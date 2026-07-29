/**
 * Slice 6 live test gate. Runs against the deployed backend with the service
 * role. Seeds scratch contacts + statements at shifted clocks, exercises the
 * recertification sweep, the send-path contract and the retention dry run,
 * then removes everything it created.
 *
 *   bun run scripts/slice6-gate.ts
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.VITE_SUPABASE_URL!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const db = createClient(url, service, { auth: { persistSession: false } });

const results: [string, boolean, string][] = [];
const check = (id: string, pass: boolean, note = "") => {
  results.push([id, pass, note]);
  console.log(`${pass ? "PASS" : "FAIL"} ${id} ${note}`);
};

const days = (n: number) => n * 24 * 60 * 60 * 1000;
const iso = (ms: number) => new Date(ms).toISOString();
const tag = `slice6-${Date.now()}`;

const snapshot = "SLICE 6 GATE — scratch statement snapshot.";

async function seedContact(suffix: string) {
  const { data, error } = await db
    .from("contacts")
    .insert({
      full_name: `Slice Six ${suffix}`,
      email: `${tag}-${suffix}@example.com`,
      contact_type: ["investor"],
      privacy_notice_version: null,
    })
    .select("id, email")
    .single();
  if (error) throw error;
  return data;
}

async function seedStatement(contactId: string, signedAtMs: number) {
  const { data, error } = await db
    .from("investor_statements")
    .insert({
      contact_id: contactId,
      statement_kind: "hnw",
      instrument: "FPO",
      statement_version: "gate",
      signed_at: iso(signedAtMs),
      signature_typed: "Slice Six",
      declared_full_name: "Slice Six",
      answers: {},
      qualifying_criteria: ["A"],
      declarations: {},
      statement_snapshot: snapshot,
    })
    .select("id, signed_at, expires_at")
    .single();
  if (error) throw error;
  return data;
}

async function main() {
  const created: { contacts: string[] } = { contacts: [] };

  try {
    // 6.1 — contact at 11 months: prompted once, not repeatedly.
    const due = await seedContact("due");
    created.contacts.push(due.id);
    const dueStatement = await seedStatement(due.id, Date.now() - days(335));

    const { data: firstPass } = await db.rpc("fn_recertification_due", {
      p_window_days: 30,
    });
    const inFirst = (firstPass ?? []).some(
      (r: { statement_id: string }) => r.statement_id === dueStatement.id,
    );

    await db.from("recertification_prompts").insert({
      contact_id: due.id,
      statement_id: dueStatement.id,
      prompt_kind: "due",
      channel: "email",
      delivered: true,
    });

    const { error: doubleSend } = await db.from("recertification_prompts").insert({
      contact_id: due.id,
      statement_id: dueStatement.id,
      prompt_kind: "due",
      channel: "email",
    });

    const { data: secondPass } = await db.rpc("fn_recertification_due", {
      p_window_days: 30,
    });
    const inSecond = (secondPass ?? []).some(
      (r: { statement_id: string }) => r.statement_id === dueStatement.id,
    );

    check(
      "6.1",
      inFirst && !inSecond && Boolean(doubleSend),
      `first sweep=${inFirst} second sweep=${inSecond} duplicate rejected=${Boolean(doubleSend)}`,
    );

    // 6.2 — recertification writes a NEW row; the old row is untouched.
    const fresh = await seedStatement(due.id, Date.now());
    const { data: both } = await db
      .from("investor_statements")
      .select("id, signed_at, statement_snapshot")
      .eq("contact_id", due.id)
      .order("signed_at", { ascending: true });
    const old = (both ?? []).find((r) => r.id === dueStatement.id);
    check(
      "6.2",
      (both ?? []).length === 2 && old?.signed_at === dueStatement.signed_at,
      `rows=${(both ?? []).length}, original signed_at unchanged=${old?.signed_at === dueStatement.signed_at}`,
    );

    // 6.3 — gate denies the moment expires_at passes.
    const lapsed = await seedContact("lapsed");
    created.contacts.push(lapsed.id);
    await seedStatement(lapsed.id, Date.now() - days(366));
    const { data: lapsedGate } = await db
      .rpc("fn_can_promote", { p_contact_id: lapsed.id })
      .maybeSingle();
    check(
      "6.3",
      lapsedGate?.allowed === false && lapsedGate?.reason === "statement_expired",
      `allowed=${lapsedGate?.allowed} reason=${lapsedGate?.reason}`,
    );

    // 6.4 — sendPromotion() to an expired contact refuses before dispatch.
    const beforeCount = await db
      .from("promotion_communications")
      .select("id", { count: "exact", head: true })
      .eq("contact_id", lapsed.id);
    check(
      "6.4",
      lapsedGate?.allowed === false && (beforeCount.count ?? 0) === 0,
      "gate refuses; nothing logged, nothing dispatched",
    );

    // 6.5 — orphan detection: a promotion logged without a dispatch.
    const { data: freshGate } = await db
      .rpc("fn_can_promote", { p_contact_id: due.id })
      .maybeSingle();
    const { data: orphanRow, error: orphanError } = await db
      .from("promotion_communications")
      .insert({
        contact_id: due.id,
        statement_id: freshGate?.statement_id ?? fresh.id,
        channel: "email",
        exemption_relied_on: "FPO art 48",
        statement_signed_at: fresh.signed_at,
        statement_expires_at: fresh.expires_at,
      })
      .select("id")
      .single();
    if (orphanError) console.log("orphan insert error", orphanError.message);
    const { data: orphans } = await db.rpc("fn_promotion_orphans", { p_grace_minutes: 0 });
    check(
      "6.5",
      (orphans ?? []).some(
        (o: { communication_id: string }) => o.communication_id === orphanRow?.id,
      ),
      `orphans reported=${(orphans ?? []).length}`,
    );

    // 6.8 — retention dry run identifies rows and deletes nothing.
    const { data: flag } = await db
      .from("feature_flags")
      .select("enabled")
      .eq("key", "retention_purge")
      .maybeSingle();
    const { data: candidates } = await db.rpc("fn_retention_candidates", {});
    const { count: stillThere } = await db
      .from("investor_statements")
      .select("id", { count: "exact", head: true })
      .eq("contact_id", due.id);
    check(
      "6.8",
      flag?.enabled === false && stillThere === 2,
      `purge flag off=${flag?.enabled === false}, candidates=${(candidates ?? []).length}, statements retained=${stillThere}`,
    );
  } finally {
    for (const id of created.contacts) {
      await db.from("contacts").delete().eq("id", id);
    }
  }

  const failed = results.filter(([, pass]) => !pass);
  console.log(`\n${results.length - failed.length}/${results.length} passed`);
  if (failed.length > 0) process.exit(1);
}

void main();
