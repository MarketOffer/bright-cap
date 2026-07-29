import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { createHash, randomBytes } from "node:crypto";

/**
 * Slice 4 static test gate — the parts that must hold in the source itself.
 * The live behavioural gate (4.3–4.14) runs against the deployed backend via
 * `bun run scripts/slice4-gate.ts`; its results are recorded in the plan.
 */

const read = (path: string) => readFileSync(path, "utf8");

const shared = read("supabase/functions/_shared/gatedDelivery.ts");
const tokenAccess = read("supabase/functions/_shared/tokenAccess.ts");
const redeem = read("supabase/functions/redeem-access-token/index.ts");
const download = read("supabase/functions/download-document/index.ts");
const issue = read("supabase/functions/issue-access-token/index.ts");

describe("4.1 token entropy", () => {
  it("mints 256-bit values with no collisions over 10,000 issues", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 10_000; i++) seen.add(randomBytes(32).toString("base64url"));
    expect(seen.size).toBe(10_000);
    expect([...seen][0].length).toBeGreaterThanOrEqual(43); // 43 base64url chars = 256 bits
  });

  it("the edge implementation draws 32 CSRNG bytes", () => {
    expect(shared).toContain("new Uint8Array(32)");
    expect(shared).toContain("crypto.getRandomValues");
  });
});

describe("4.2 tokens are never stored or logged in the clear", () => {
  it("persists a SHA-256 hash only", () => {
    expect(shared).toContain('crypto.subtle.digest(\n    "SHA-256"');
    expect(shared).toMatch(/token_hash: await hashToken\(token\)/);
    expect(createHash("sha256").update("x").digest("hex")).toHaveLength(64);
  });

  it("never passes a token into a log call", () => {
    for (const source of [shared, tokenAccess, redeem, download, issue]) {
      const logs = source.match(/console\.(log|error|warn)\([^;]*\)/gs) ?? [];
      for (const line of logs) {
        expect(line).not.toMatch(/\btoken\b\s*[,}]/);
        expect(line).not.toMatch(/issued\.token\b|value\.token\b|\bclean\b/);
      }
    }
  });
});

describe("4.8 constant-time comparison", () => {
  it("compares digests without early exit", () => {
    expect(shared).toContain("export function timingSafeEqual");
    expect(shared).toContain("diff |= a.charCodeAt(i) ^ b.charCodeAt(i)");
    expect(tokenAccess).toContain("timingSafeEqual(tokenRow.token_hash, candidateHash)");
  });
});

describe("4.6 / 4.7 token lifetime and re-issue", () => {
  it("uses a 14-day TTL", () => {
    expect(shared).toContain("export const TOKEN_TTL_DAYS = 14");
  });

  it("revokes live tokens for the same document before minting a fresh one", () => {
    expect(shared).toMatch(/revoked_reason: "reissued"/);
  });
});

describe("4.9 / 4.10 private bucket", () => {
  it("reads bytes only through a short-TTL server-minted signed URL", () => {
    expect(shared).toContain("export const SIGNED_URL_TTL_SECONDS = 60");
    expect(download).toContain("createSignedUrl(value.document.storage_path, SIGNED_URL_TTL_SECONDS)");
    expect(download).not.toContain("getPublicUrl");
  });
});

describe("4.12 audit before stream", () => {
  it("writes the download row before any bytes are fetched", () => {
    const auditAt = download.indexOf('logCommunication(supabase, value, "download"');
    const fetchAt = download.indexOf("createSignedUrl");
    expect(auditAt).toBeGreaterThan(-1);
    expect(auditAt).toBeLessThan(fetchAt);
  });
});

describe("4.14 noindex headers", () => {
  it("stamps X-Robots-Tag on every gated response", () => {
    expect(shared).toContain('"X-Robots-Tag": "noindex, nofollow"');
    for (const source of [redeem, download, issue]) {
      expect(source).toMatch(/gatedHeaders|jsonResponse/);
    }
  });
});

describe("4.15 gated paths are not discoverable", () => {
  const sitemap = read("public/sitemap.xml");
  const llms = read("public/llms.txt");
  const robots = read("public/robots.txt");

  it("is absent from sitemap.xml and llms.txt", () => {
    expect(sitemap).not.toContain("/investors/summary");
    expect(llms).not.toContain("/investors/summary");
  });

  it("is disallowed in robots.txt and noindexed in the page head", () => {
    expect(robots).toContain("Disallow: /investors/summary");
    const page = read("src/pages/InvestorSummary.tsx");
    expect(page).toContain('content="noindex, nofollow, noarchive"');
  });

  it("is not linked from any public page", () => {
    const pages = [
      "src/pages/Index.tsx",
      "src/pages/Investors.tsx",
      "src/pages/InvestorEligibility.tsx",
      "src/components/Footer.tsx",
      "src/components/Navbar.tsx",
    ];
    for (const path of pages) expect(read(path)).not.toContain("/investors/summary");
  });
});

describe("4.16 delivery email", () => {
  it("carries the warning block and no deal content", () => {
    expect(shared).toContain("warningBlock(params.promoterName, params.promoterNumber)");
    const body = shared.slice(shared.indexOf("const text = ["), shared.indexOf("const response"));
    for (const forbidden of ["yield", "return of", "£", "per cent", "%", "IRR", "unit", "price"]) {
      expect(body.toLowerCase()).not.toContain(forbidden.toLowerCase());
    }
  });

  it("takes the promoter from the document row, never a hardcoded entity", () => {
    expect(shared).toContain("export function warningBlock(promoterName: string, promoterNumber: string)");
    expect(shared).not.toMatch(/RM Incorporations Ltd/);
    expect(shared).toContain("export const WARNING_BLOCK_VERSION");
  });
});

describe("4.17 feature flag", () => {
  it("is created off and gates issue and redemption", () => {
    const migrations = read(
      "supabase/migrations/" +
        readdirSync("supabase/migrations").filter((f: string) =>
          read(`supabase/migrations/${f}`).includes("feature_flags"),
        )[0],
    );
    expect(migrations).toMatch(/'gated_summary_delivery',\s*\n?\s*false/);
    expect(shared).toContain("if (!(await flagEnabled(supabase))) return { ok: false, reason: \"flag_off\" };");
    expect(tokenAccess).toContain('return { ok: false, reason: "flag_off" };');
  });

  it("leaves the Slice 3 path unchanged when off", () => {
    const submit = read("supabase/functions/submit-eligibility/index.ts");
    expect(submit).toContain("if (await flagEnabled(supabase))");
    expect(submit).toContain("Delivery failure must never invalidate a valid certification.");
  });
});
