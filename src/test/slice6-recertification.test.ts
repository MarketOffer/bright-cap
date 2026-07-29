import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Slice 6 static test gate — the parts that must hold in the source itself.
 * The live behavioural gate (6.1–6.5, 6.8) runs against the deployed backend
 * via `bun run scripts/slice6-gate.ts`; its results are recorded in the plan.
 */

const read = (path: string) => readFileSync(path, "utf8");

const sendPath = read("supabase/functions/_shared/sendPromotion.ts");
const recert = read("supabase/functions/recertification-sweep/index.ts");
const retention = read("supabase/functions/retention-sweep/index.ts");
const gated = read("supabase/functions/_shared/gatedDelivery.ts");
const eslintConfig = read("eslint.config.js");

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (entry === "node_modules" || entry === "dist") return [];
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

const sourceFiles = [...walk("src"), ...walk("supabase/functions"), ...walk("scripts")].filter(
  (f) => f.endsWith(".ts") || f.endsWith(".tsx"),
);

describe("6.4 the send path refuses uncertified contacts before dispatch", () => {
  it("calls fn_can_promote and returns before any dispatch when not allowed", () => {
    const gateIndex = sendPath.indexOf("fn_can_promote");
    const logIndex = sendPath.indexOf('from("promotion_communications")');
    const dispatchIndex = sendPath.indexOf("await dispatchEmail(params.email)");
    expect(gateIndex).toBeGreaterThan(-1);
    // (a) gate, then (b) log, then (c) dispatch — in that order.
    expect(gateIndex).toBeLessThan(logIndex);
    expect(logIndex).toBeLessThan(dispatchIndex);
    expect(sendPath).toContain('return { ok: false, reason: gateRow?.reason ?? "no_statement" }');
  });
});

describe("6.5 a communication cannot be logged as sent without a dispatch", () => {
  it("stamps dispatched_at only after a successful dispatch", () => {
    expect(sendPath).toMatch(/if \(result\.sent\) \{\s*await supabase[\s\S]*?dispatched_at/);
    expect(sendPath).toContain("promotion logged but not dispatched");
  });

  it("served communications are stamped at log time so they are not orphans", () => {
    expect(read("supabase/functions/_shared/tokenAccess.ts")).toContain("dispatch_ref: channel");
  });
});

describe("6.6 direct provider calls are banned outside the send path", () => {
  it("the lint rule exists and allow-lists only sendPromotion.ts", () => {
    expect(eslintConfig).toContain("no-restricted-syntax");
    expect(eslintConfig).toContain("supabase/functions/_shared/sendPromotion.ts");
    expect(eslintConfig).toContain("Literal[value=/resend/i]");
  });

  it("no other source file touches the provider", () => {
    const offenders = sourceFiles.filter(
      (file) =>
        !file.endsWith("sendPromotion.ts") &&
        !file.endsWith("slice6-recertification.test.ts") &&
        /resend/i.test(read(file)),
    );
    expect(offenders).toEqual([]);
  });

  it("the access-link email is routed through sendPromotion", () => {
    expect(gated).toContain('from "./sendPromotion.ts"');
    expect(gated).toContain("await sendPromotion(supabase, {");
  });
});

describe("6.7 the certification result is never cached", () => {
  it("no code writes a derived certification flag onto contacts", () => {
    // `is_certified` exists only on the read-only register view, which derives
    // it live from investor_statements. It must never become a stored column.
    for (const file of sourceFiles) {
      if (file.endsWith("types.ts") || file.includes("test")) continue;
      const source = read(file);
      expect(source).not.toMatch(/is_certified|certified_until|can_promote_cached/);
    }
  });

  it("no migration adds a cached certification column to contacts", () => {
    const migrations = walk("supabase/migrations").filter((f) => f.endsWith(".sql"));
    for (const file of migrations) {
      const sql = read(file);
      expect(sql).not.toMatch(/alter table[^;]*contacts[^;]*(is_certified|certified_until)/i);
    }
  });


  it("every send re-reads the gate rather than accepting one from the caller", () => {
    expect(sendPath).toContain("live gate check — always re-read, never cached");
    // The caller cannot pass a gate result in.
    expect(sendPath).not.toMatch(/allowed\??\s*:\s*boolean;[\s\S]{0,200}interface PromotionParams/);
  });
});

describe("6.1 / 6.2 recertification", () => {
  it("prompts once per statement by claiming the send before dispatching", () => {
    const claim = recert.indexOf('from("recertification_prompts")');
    const send = recert.indexOf("await dispatchEmail(");
    expect(claim).toBeGreaterThan(-1);
    expect(claim).toBeLessThan(send);
  });

  it("never updates an existing statement and never pre-fills prior answers", () => {
    expect(recert).not.toContain('from("investor_statements").update');
    expect(recert).toContain("recertify=1");
    expect(recert).toContain("answered afresh");
  });

  it("carries no deal content in the prompt", () => {
    expect(recert).not.toMatch(/yield|%|£|return of|uplift/i);
  });

  it("is behind a flag and requires the scheduler secret or an admin", () => {
    expect(recert).toContain("recertification_prompts");
    expect(recert).toContain("CRON_SECRET");
    expect(recert).toContain('_role: "admin"');
  });
});

describe("6.8 retention ships disabled", () => {
  it("dry-runs and deletes nothing unless the purge flag is on", () => {
    expect(retention).toContain("retention_purge");
    expect(retention).toContain('mode: "dry_run"');
    const dryRunReturn = retention.indexOf('mode: "dry_run"');
    const firstDelete = retention.indexOf(".delete()");
    expect(dryRunReturn).toBeLessThan(firstDelete);
  });
});
