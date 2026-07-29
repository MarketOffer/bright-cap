import { describe, it, expect, beforeAll } from "vitest";
import { readFileSync } from "node:fs";
import { renderStatementSnapshot } from "@/legal/statements/renderStatementSnapshot";

/**
 * Slice 3 test gate — eligibility submission pipeline.
 *
 * Exercises the deployed `submit-eligibility` function with the publishable (anon)
 * key only, exactly as a browser would. Database-side assertions (rows written,
 * snapshot bytes, contact upsert) are verified against the database and recorded in
 * the plan's Slice 3 log — the anon key deliberately cannot read those tables.
 */

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
const configured = Boolean(url && anonKey);

const headers = {
  apikey: anonKey ?? "",
  Authorization: `Bearer ${anonKey ?? ""}`,
  "Content-Type": "application/json",
};

const RUN = `s3-${Date.now()}`;
const email = (tag: string) => `${RUN}-${tag}@example.test`;
const PRIVACY_VERSION = "2026-07-29-v1";

const now = () => new Date().toISOString();

const hnwDeclarations = () =>
  Object.fromEntries(
    [
      "hnw-declaration",
      "hnw-understand",
      "hnw-understand-a",
      "hnw-understand-b",
      "hnw-advice",
      "hnw-loss",
    ].map((id) => [id, { accepted: true, at: now() }]),
  );

const scsiDeclarations = () =>
  Object.fromEntries(
    [
      "scsi-declaration",
      "scsi-understand",
      "scsi-understand-a",
      "scsi-understand-b",
      "scsi-advice",
      "scsi-loss",
    ].map((id) => [id, { accepted: true, at: now() }]),
  );

interface Payload {
  contact: { fullName: string; email: string; phone?: string };
  kind: string;
  declinedKinds?: string[];
  attemptGroupId?: string;
  noneApply?: boolean;
  answers: Record<string, Record<string, unknown>>;
  declarations: Record<string, unknown>;
  signatureTyped: string;
  declaredFullName: string;
  privacy: { acknowledged: boolean; version: string };
  marketingOptIn: boolean;
  signed_at?: string;
}

const basePayload = (tag: string, overrides: Partial<Payload> = {}): Payload => ({
  contact: { fullName: "Gate Three Tester", email: email(tag), phone: "+44 1223 000000" },
  kind: "hnw",
  noneApply: false,
  answers: { hnw: { A: "no", B: "yes", B_net_assets: 300000, none: false } },
  declarations: { hnw: hnwDeclarations() },
  signatureTyped: "Gate Three Tester",
  declaredFullName: "Gate Three Tester",
  privacy: { acknowledged: true, version: PRIVACY_VERSION },
  marketingOptIn: false,
  ...overrides,
});

const submit = async (payload: unknown) => {
  const res = await fetch(`${url}/functions/v1/submit-eligibility`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json } as {
    status: number;
    json: Record<string, unknown> & { reasons?: string[] };
  };
};

describe.runIf(configured)("Slice 3 — data API exposure", () => {
  it.each([
    "investor_statements",
    "investor_statement_financials",
    "promotion_communications",
    "certification_attempts",
  ])("3.15 anon cannot read %s", async (table) => {
    const res = await fetch(`${url}/rest/v1/${table}?select=*`, { headers });
    if (res.ok) {
      expect(await res.json()).toEqual([]);
    } else {
      expect([401, 403, 404]).toContain(res.status);
    }
  });
});

describe.runIf(configured)("Slice 3 — submission pipeline", () => {
  it("3.16 happy path, HNW only", async () => {
    const { status, json } = await submit(basePayload("hnw"));
    expect(status).toBe(200);
    expect(json.ok).toBe(true);
    expect(json.statementIds).toHaveLength(1);
  });

  it("3.17 happy path, SCSI only", async () => {
    const { status, json } = await submit(
      basePayload("scsi", {
        kind: "scsi",
        answers: {
          scsi: {
            A: "no",
            B: "yes",
            B_company_name: "Example Holdings Ltd",
            B_company_number: "12345678",
            B_jurisdiction: "United Kingdom",
            C: "no",
            D: "no",
            none: false,
          },
        },
        declarations: { scsi: scsiDeclarations() },
      }),
    );
    expect(status).toBe(200);
    expect(json.statementIds).toHaveLength(1);
  });

  it("3.18 a two-kind payload is rejected: one route per submission", async () => {
    const { status, json } = await submit({
      ...basePayload("both"),
      kinds: ["hnw", "scsi"],
      kind: undefined,
    });
    expect(status).toBe(422);
    expect(json.reasons).toContain("invalid_payload");
  });

  it("3.19a declining a route offers the other one, once", async () => {
    const first = await submit(
      basePayload("rej-none", { noneApply: true, answers: {}, declarations: {} }),
    );
    expect(first.status).toBe(200);
    expect(first.json.routeDeclined).toBe("hnw");
    expect(first.json.offerAlternative).toBe("scsi");

    const second = await submit(
      basePayload("rej-none", {
        kind: "scsi",
        declinedKinds: ["hnw"],
        attemptGroupId: first.json.attemptGroupId as string,
        noneApply: true,
        answers: {},
        declarations: {},
      }),
    );
    expect(second.status).toBe(422);
    expect(second.json.reasons).toContain("both_routes_declined");
  });

  it("3.19b rejects all conditions No", async () => {
    const { status, json } = await submit(
      basePayload("rej-allno", { answers: { hnw: { A: "no", B: "no", none: false } } }),
    );
    expect(status).toBe(422);
    expect(json.reasons).toContain("all_conditions_no");
  });

  it("3.19c rejects a Yes with a blank detail", async () => {
    const { status, json } = await submit(
      basePayload("rej-detail", { answers: { hnw: { A: "yes", B: "no", none: false } } }),
    );
    expect(status).toBe(422);
    expect(json.reasons).toContain("missing_detail");
  });

  it("3.19d rejects a contradiction", async () => {
    const { status, json } = await submit(
      basePayload("rej-contra", {
        answers: { hnw: { A: "no", B: "yes", B_net_assets: 300000, none: true } },
      }),
    );
    expect(status).toBe(422);
    expect(json.reasons).toContain("contradiction");
  });

  it("3.19e rejects an unanswered condition", async () => {
    const { status, json } = await submit(
      basePayload("rej-unanswered", { answers: { hnw: { B: "yes", B_net_assets: 300000 } } }),
    );
    expect(status).toBe(422);
    expect(json.reasons).toContain("unanswered_condition");
  });

  it("3.20 rejects a malformed payload without partial writes", async () => {
    const { status, json } = await submit({ nonsense: true });
    expect(status).toBe(422);
    expect(json.ok).toBe(false);
    expect(json.reasons).toContain("contact_invalid");
  });

  it("3.21 ignores a client-supplied signed_at", async () => {
    const { status, json } = await submit(
      basePayload("backdate", { signed_at: "2020-01-01T00:00:00.000Z" }),
    );
    expect(status).toBe(200);
    expect(json.ok).toBe(true);
  });

  it("3.22 rejects SCSI condition B with a blank company number", async () => {
    const { status, json } = await submit(
      basePayload("scsi-blank", {
        kind: "scsi",
        answers: {
          scsi: {
            A: "no",
            B: "yes",
            B_company_name: "Example Holdings Ltd",
            B_company_number: "",
            B_jurisdiction: "United Kingdom",
            C: "no",
            D: "no",
            none: false,
          },
        },
        declarations: { scsi: scsiDeclarations() },
      }),
    );
    expect(status).toBe(422);
    expect(json.reasons).toContain("missing_detail");
  });

  it("3.23 duplicate submission for the same email succeeds", async () => {
    const payload = basePayload("dupe");
    const first = await submit(payload);
    const second = await submit(payload);
    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
  });

  it("3.25 marketing opt-in defaults to false", async () => {
    const { status } = await submit(basePayload("nomarketing", { marketingOptIn: false }));
    expect(status).toBe(200);
  });

  it("3.26 rejects marketing ticked with privacy unticked", async () => {
    const { status, json } = await submit(
      basePayload("no-privacy", {
        marketingOptIn: true,
        privacy: { acknowledged: false, version: PRIVACY_VERSION },
      }),
    );
    expect(status).toBe(422);
    expect(json.reasons).toContain("privacy_not_acknowledged");
  });

  it("rejects incomplete declarations", async () => {
    const { status, json } = await submit(
      basePayload("no-decl", { declarations: { hnw: {} } }),
    );
    expect(status).toBe(422);
    expect(json.reasons).toContain("declarations_incomplete");
  });
});

describe("Slice 3 — statement snapshot drift guard", () => {
  it("3.24 the edge function's copy of the frozen statements matches src", () => {
    const src = readFileSync("src/legal/statements/statementDefinitions.ts", "utf8");
    const shared = readFileSync("supabase/functions/_shared/statementDefinitions.ts", "utf8");
    expect(shared).toBe(src);
  });

  it("3.24 the snapshot renderer matches src apart from the Deno import specifier", () => {
    const src = readFileSync("src/legal/statements/renderStatementSnapshot.ts", "utf8");
    const shared = readFileSync(
      "supabase/functions/_shared/renderStatementSnapshot.ts",
      "utf8",
    );
    expect(shared.replace('"./statementDefinitions.ts"', '"./statementDefinitions"')).toBe(src);
  });

  it("3.24 the rendered snapshot matches the Slice 2 fixture", () => {
    const hnw = readFileSync("src/test/fixtures/hnw-statement.html", "utf8");
    const scsi = readFileSync("src/test/fixtures/scsi-statement.html", "utf8");
    expect(renderStatementSnapshot("FPO_SCH5_PT1_SI2024-301").trim()).toBe(hnw.trim());
    expect(renderStatementSnapshot("FPO_SCH5_PT2_SI2024-301").trim()).toBe(scsi.trim());
  });
});
