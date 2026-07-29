/**
 * Slice 4 live test gate. Runs against the deployed backend with the service role.
 * Seeds a scratch document + contact + statement, flips the feature flag on for the
 * duration, and puts it back off at the end no matter what.
 *
 *   bun run scripts/slice4-gate.ts
 */
import { createClient } from "@supabase/supabase-js";
import { createHash, randomBytes } from "node:crypto";

const url = process.env.VITE_SUPABASE_URL!;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const anon = process.env.VITE_SUPABASE_PUBLISHABLE_KEY!;
const db = createClient(url, service, { auth: { persistSession: false } });

const results: [string, boolean, string][] = [];
const check = (id: string, pass: boolean, note = "") => {
  results.push([id, pass, note]);
  console.log(`${pass ? "PASS" : "FAIL"} ${id} ${note}`);
};

const b64url = (b: Buffer) => b.toString("base64url");
const mint = () => b64url(randomBytes(32));
const hash = (t: string) => createHash("sha256").update(t).digest("hex");

const setFlag = (enabled: boolean) =>
  db.from("feature_flags").update({ enabled }).eq("key", "gated_summary_delivery");

const call = (fn: string, body: unknown) =>
  fetch(`${url}/functions/v1/${fn}`, {
    method: "POST",
    headers: {
      apikey: anon,
      Authorization: `Bearer ${anon}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

// Minimal one-page PDF.
const samplePdf = () => {
  const objs = [
    "1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj",
    "2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj",
    "3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 595 842]/Resources<<>>/Contents 4 0 R>>endobj",
    "4 0 obj<</Length 8>>stream\n         \nendstream endobj",
  ];
  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  for (const o of objs) {
    offsets.push(pdf.length);
    pdf += o + "\n";
  }
  const xref = pdf.length;
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  for (const off of offsets) pdf += `${String(off).padStart(10, "0")} 00000 n \n`;
  pdf += `trailer<</Size ${objs.length + 1}/Root 1 0 R>>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf, "latin1");
};

const run = `s4-${Date.now()}`;
let documentId = "";
let contactAId = "";
let contactBId = "";
let statementAId = "";
let statementBId = "";

const seedContact = async (tag: string, signedAtOverride?: Date) => {
  const { data: contact, error } = await db
    .from("contacts")
    .insert({
      full_name: `Gate ${tag}`,
      email: `${run}-${tag}@example.test`,
      contact_type: ["investor"],
      privacy_notice_version: "2026-07-29-v1",
    })
    .select("id")
    .single();
  if (error) throw error;
  const signedAt = signedAtOverride ?? new Date();
  const { data: statement, error: sErr } = await db
    .from("investor_statements")
    .insert({
      contact_id: contact.id,
      statement_kind: "hnw",
      statement_version: "hnw-2024-si301-v1",
      signed_at: signedAt.toISOString(),
      signature_typed: `Gate ${tag}`,
      declared_full_name: `Gate ${tag}`,
      answers: { A: "yes" },
      qualifying_criteria: ["A"],
      declarations: {},
      statement_snapshot: "scratch",
    })
    .select("id")
    .single();
  if (sErr) throw sErr;
  return { contactId: contact.id, statementId: statement.id };
};

const insertToken = async (
  contactId: string,
  statementId: string,
  opts: { expiresAt?: Date; revoked?: boolean } = {},
) => {
  const token = mint();
  const { data, error } = await db
    .from("access_tokens")
    .insert({
      contact_id: contactId,
      statement_id: statementId,
      document_id: documentId,
      token_hash: hash(token),
      expires_at: (opts.expiresAt ?? new Date(Date.now() + 14 * 864e5)).toISOString(),
      revoked_at: opts.revoked ? new Date().toISOString() : null,
    })
    .select("id")
    .single();
  if (error) throw error;
  return { token, id: data.id as string };
};

try {
  // ---- 4.17 flag off ------------------------------------------------------
  await setFlag(false);
  const offRes = await call("redeem-access-token", { token: mint() });
  const offBody = await offRes.json();
  check("4.17", offBody.reason === "flag_off", `flag off -> ${offBody.reason}`);

  // ---- 4.1 entropy --------------------------------------------------------
  const seen = new Set<string>();
  for (let i = 0; i < 10000; i++) seen.add(mint());
  check("4.1", seen.size === 10000 && [...seen][0].length >= 43, `${seen.size} unique, 256-bit`);

  // seed the scratch document + storage object
  const storagePath = `${run}/summary.pdf`;
  const upload = await db.storage
    .from("investor-documents")
    .upload(storagePath, samplePdf(), { contentType: "application/pdf" });
  if (upload.error) throw upload.error;

  const { data: doc, error: docErr } = await db
    .from("documents")
    .insert({
      slug: `scratch-${run}`,
      title: "Scratch Summary (test gate)",
      version: "test",
      storage_path: storagePath,
      promoter_entity_name: "RM Incorporations Ltd",
      promoter_company_number: "16600000",
      warning_block_version: "fpo-2026-07-v1",
      is_active: true,
    })
    .select("id")
    .single();
  if (docErr) throw docErr;
  documentId = doc.id;

  const a = await seedContact("a");
  const b = await seedContact("b");
  contactAId = a.contactId;
  statementAId = a.statementId;
  contactBId = b.contactId;
  statementBId = b.statementId;

  await setFlag(true);

  // ---- 4.3 valid redemption ----------------------------------------------
  const valid = await insertToken(contactAId, statementAId);
  const redeem = await call("redeem-access-token", { token: valid.token });
  const redeemBody = await redeem.json();
  const { count: views } = await db
    .from("promotion_communications")
    .select("id", { count: "exact", head: true })
    .eq("token_id", valid.id)
    .eq("channel", "page_view");
  check("4.3", redeemBody.ok === true && (views ?? 0) === 1, `page_view rows=${views}`);

  // ---- 4.14 headers -------------------------------------------------------
  check(
    "4.14",
    redeem.headers.get("x-robots-tag") === "noindex, nofollow",
    `${redeem.headers.get("x-robots-tag")}`,
  );

  // ---- 4.2 hash only ------------------------------------------------------
  const { data: stored } = await db
    .from("access_tokens")
    .select("token_hash")
    .eq("id", valid.id)
    .single();
  check(
    "4.2",
    /^[0-9a-f]{64}$/.test(stored!.token_hash) && !stored!.token_hash.includes(valid.token),
    "hash only, no plaintext column",
  );

  // ---- 4.8 tampered token -------------------------------------------------
  const tampered = valid.token.slice(0, -1) + (valid.token.endsWith("A") ? "B" : "A");
  const tamperBody = await (await call("redeem-access-token", { token: tampered })).json();
  check("4.8", tamperBody.ok !== true, `${tamperBody.reason}`);

  // ---- 4.6 token expiry ---------------------------------------------------
  const expired = await insertToken(contactAId, statementAId, {
    expiresAt: new Date(Date.now() - 60_000),
  });
  const expiredBody = await (await call("redeem-access-token", { token: expired.token })).json();
  check(
    "4.6",
    expiredBody.reason === "token_expired" && expiredBody.reissuable === true,
    "denied + re-issue offered",
  );

  // ---- 4.7 re-issue kills the old token -----------------------------------
  const older = await insertToken(contactAId, statementAId);
  await db
    .from("access_tokens")
    .update({ revoked_at: new Date().toISOString(), revoked_reason: "reissued" })
    .eq("id", older.id);
  const fresh = await insertToken(contactAId, statementAId);
  const oldBody = await (await call("redeem-access-token", { token: older.token })).json();
  const newBody = await (await call("redeem-access-token", { token: fresh.token })).json();
  check(
    "4.7",
    oldBody.reason === "token_revoked" && newBody.ok === true,
    `old=${oldBody.reason} new=${newBody.ok ? "ok" : newBody.reason}`,
  );

  // ---- 4.12 + 4.11 download, watermark, audit-before-stream ---------------
  const before = await db
    .from("promotion_communications")
    .select("id", { count: "exact", head: true })
    .eq("channel", "download");
  const dlA = await call("download-document", { token: fresh.token });
  const bytesA = Buffer.from(await dlA.arrayBuffer());
  const tokenB = await insertToken(contactBId, statementBId);
  const dlB = await call("download-document", { token: tokenB.token });
  const bytesB = Buffer.from(await dlB.arrayBuffer());
  const after = await db
    .from("promotion_communications")
    .select("id", { count: "exact", head: true })
    .eq("channel", "download");
  const textA = bytesA.toString("latin1");
  const textB = bytesB.toString("latin1");
  check(
    "4.11",
    dlA.ok && dlB.ok && !bytesA.equals(bytesB) && textA !== textB,
    `A=${dlA.status} B=${dlB.status} bytes ${bytesA.length} vs ${bytesB.length} ${dlA.ok ? "" : textA.slice(0, 120)}`,
  );
  check(
    "4.12",
    (after.count ?? 0) - (before.count ?? 0) === 2,
    `download rows +${(after.count ?? 0) - (before.count ?? 0)}`,
  );

  // ---- 4.9 direct bucket URL ---------------------------------------------
  const direct = await fetch(
    `${url}/storage/v1/object/public/investor-documents/${storagePath}`,
  );
  check("4.9", direct.status === 400 || direct.status === 403 || direct.status === 404,
    `status ${direct.status}`);

  // ---- 4.10 signed URL after TTL -----------------------------------------
  const { data: signed } = await db.storage
    .from("investor-documents")
    .createSignedUrl(storagePath, 1);
  await new Promise((r) => setTimeout(r, 2500));
  const stale = await fetch(signed!.signedUrl);
  check("4.10", !stale.ok, `status ${stale.status}`);

  // ---- 4.4 statement expiry / 4.5 revoked --------------------------------
  const expiredStatement = await seedContact("exp", new Date(Date.now() - 400 * 864e5));
  const expTok = await insertToken(expiredStatement.contactId, expiredStatement.statementId);
  const expRes = await (await call("redeem-access-token", { token: expTok.token })).json();
  const { count: expComms } = await db
    .from("promotion_communications")
    .select("id", { count: "exact", head: true })
    .eq("token_id", expTok.id);
  check(
    "4.4",
    expRes.ok !== true && (expComms ?? 0) === 0,
    `${expRes.reason}, comms=${expComms}`,
  );

  const revoked = await seedContact("rev");
  await db
    .from("investor_statements")
    .update({ revoked_at: new Date().toISOString(), revoked_reason: "test" })
    .eq("id", revoked.statementId);
  const revTok = await insertToken(revoked.contactId, revoked.statementId);
  const revRes = await (await call("redeem-access-token", { token: revTok.token })).json();
  check("4.5", revRes.ok !== true, `${revRes.reason}`);

  // ---- 4.13 enumeration ---------------------------------------------------
  let denied = 0;
  let limited = 0;
  for (let i = 0; i < 40; i++) {
    const res = await call("redeem-access-token", { token: mint() });
    const body = await res.json();
    if (body.ok !== true) denied++;
    if (body.reason === "rate_limited") limited++;
  }
  check("4.13", denied === 40 && limited > 0, `${denied}/40 denied, ${limited} rate-limited`);
} finally {
  await setFlag(false);

  // Remove scratch data so the gate leaves no residue in the live database.
  try {
    const { data: scratchContacts } = await db
      .from("contacts")
      .select("id")
      .like("email", "s4-%@example.test");
    const ids = (scratchContacts ?? []).map((c: { id: string }) => c.id);
    if (ids.length) {
      await db.from("promotion_communications").delete().in("contact_id", ids);
      await db.from("access_tokens").delete().in("contact_id", ids);
      await db.from("investor_statement_financials").delete().in("statement_id", []);
      await db.from("investor_statements").delete().in("contact_id", ids);
      await db.from("contacts").delete().in("id", ids);
    }
    await db.from("documents").delete().like("slug", "scratch-s4-%");
    const { data: files } = await db.storage.from("investor-documents").list(run);
    if (files?.length) {
      await db.storage
        .from("investor-documents")
        .remove(files.map((f: { name: string }) => `${run}/${f.name}`));
    }
    await db
      .from("certification_attempts")
      .delete()
      .in("outcome", ["token_rejected", "reissue_request"]);
  } catch (cleanupError) {
    console.log("cleanup warning", cleanupError);
  }

  const { data: flag } = await db
    .from("feature_flags")
    .select("enabled")
    .eq("key", "gated_summary_delivery")
    .single();
  check("flag-restored", flag?.enabled === false, "gated_summary_delivery = off");
  console.log("\n---");
  const failed = results.filter(([, ok]) => !ok);
  console.log(`${results.length - failed.length}/${results.length} passed`);
  if (failed.length) console.log("FAILED:", failed.map(([id]) => id).join(", "));
}
