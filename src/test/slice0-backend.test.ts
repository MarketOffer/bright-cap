import { describe, it, expect } from "vitest";

/**
 * Slice 0 test gate — backend foundation.
 * Verifies the Data API exposure of the new tables from an anonymous client,
 * using the publishable (anon) key only. Constraint-level tests (contact_type
 * CHECK, case-insensitive email uniqueness) are exercised server-side against
 * the database and recorded in the plan's Slice 0 log.
 */

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

const headers = {
  apikey: anonKey ?? "",
  Authorization: `Bearer ${anonKey ?? ""}`,
};

const configured = Boolean(url && anonKey);

describe.runIf(configured)("Slice 0 — Data API exposure", () => {
  it("0.4 anon cannot read contacts", async () => {
    const res = await fetch(`${url}/rest/v1/contacts?select=*`, { headers });
    if (res.ok) {
      // Table is granted nothing / RLS-closed: must never leak rows.
      expect(await res.json()).toEqual([]);
    } else {
      expect([401, 403, 404]).toContain(res.status);
    }
  });

  it("privacy notice versions are publicly readable", async () => {
    const res = await fetch(`${url}/rest/v1/privacy_notice_versions?select=version`, { headers });
    expect(res.ok).toBe(true);
    expect(Array.isArray(await res.json())).toBe(true);
  });
});
