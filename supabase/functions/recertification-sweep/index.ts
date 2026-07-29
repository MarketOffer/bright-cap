// Slice 6 — recertification sweep.
//
// Runs on a schedule (or manually by an admin). For every statement inside the
// prompt window that has not already been prompted, it sends ONE neutral
// prompt and records it. Idempotent by construction: the unique index
// (statement_id, prompt_kind) means a second run cannot double-send.
//
// The prompt is NOT a financial promotion — it carries no deal content, no
// figures and no property specifics — so it does not go through
// sendPromotion() and is not written to promotion_communications.
//
// Recertification always produces a NEW statement row. Nothing here updates an
// existing statement, and the link never pre-fills prior answers: the statement
// must be answered afresh.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { dispatchEmail } from "../_shared/sendPromotion.ts";

const SITE_ORIGIN = Deno.env.get("SITE_ORIGIN") ?? "https://brightcap.capital";
const PROMPT_FLAG = "recertification_prompts";
/** 11 months of a 12-month certification = ~30 days out. */
const DEFAULT_WINDOW_DAYS = 30;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-cron-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });

function promptText(fullName: string, expiresAt: string) {
  const expiry = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
    timeZone: "Europe/London",
  }).format(new Date(expiresAt));

  return [
    `Dear ${fullName},`,
    "",
    `Your investor certification with BrightCap expires on ${expiry}. Certifications last 12 months and cannot be extended — a fresh statement must be completed and signed.`,
    "",
    "You can complete a new certification here:",
    `${SITE_ORIGIN}/investors/eligibility?recertify=1`,
    "",
    "The statement must be answered afresh; we do not carry over your previous answers. Until a new certification is in place we cannot send you further material.",
    "",
    "If you would prefer us to remove your details, reply to this email and we will do so.",
    "",
    "BrightCap",
  ].join("\n");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, reason: "method_not_allowed" }, 405);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } },
  );

  // ---- caller must be the scheduler or an admin --------------------------
  const cronSecret = Deno.env.get("CRON_SECRET");
  const presented = req.headers.get("x-cron-secret");
  let authorised = Boolean(cronSecret) && presented === cronSecret;

  if (!authorised) {
    const header = req.headers.get("Authorization") ?? "";
    const jwt = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";
    if (!jwt) return json({ ok: false, reason: "unauthenticated" }, 401);
    const { data, error } = await supabase.auth.getUser(jwt);
    if (error || !data?.user) return json({ ok: false, reason: "unauthenticated" }, 401);
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: data.user.id,
      _role: "admin",
    });
    if (isAdmin !== true) return json({ ok: false, reason: "not_authorised" }, 403);
    authorised = true;
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await req.json()) ?? {};
  } catch {
    body = {};
  }
  const dryRun = body.dryRun === true;
  const windowDays = Number.isFinite(Number(body.windowDays))
    ? Math.max(1, Math.min(120, Number(body.windowDays)))
    : DEFAULT_WINDOW_DAYS;

  const { data: flag } = await supabase
    .from("feature_flags")
    .select("enabled")
    .eq("key", PROMPT_FLAG)
    .maybeSingle();
  const flagOn = flag?.enabled === true;

  const { data: due, error } = await supabase.rpc("fn_recertification_due", {
    p_window_days: windowDays,
  });
  if (error) {
    console.error("recertification sweep query failed", { message: error.message });
    return json({ ok: false, reason: "query_failed" }, 500);
  }

  const rows = (due ?? []) as Array<{
    contact_id: string;
    statement_id: string;
    email: string;
    full_name: string;
    expires_at: string;
    days_remaining: number;
  }>;

  if (dryRun || !flagOn) {
    return json({
      ok: true,
      mode: dryRun ? "dry_run" : "flag_off",
      windowDays,
      candidates: rows.length,
      statementIds: rows.map((r) => r.statement_id),
      sent: 0,
    });
  }

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const row of rows) {
    // Claim the send first. If another run already claimed it the unique index
    // rejects this insert and we skip — one prompt per statement, ever.
    const { data: claim, error: claimError } = await supabase
      .from("recertification_prompts")
      .insert({
        contact_id: row.contact_id,
        statement_id: row.statement_id,
        prompt_kind: "due",
        channel: "email",
        detail: { days_remaining: row.days_remaining, window_days: windowDays },
      })
      .select("id")
      .single();

    if (claimError || !claim) {
      skipped++;
      continue;
    }

    const result = await dispatchEmail({
      to: row.email,
      subject: "Your BrightCap investor certification is due for renewal",
      text: promptText(row.full_name, row.expires_at),
    });

    if (result.sent) {
      await supabase
        .from("recertification_prompts")
        .update({ delivered: true })
        .eq("id", claim.id);
      sent++;
    } else {
      // Leave delivered=false and release the claim so a later run retries.
      await supabase.from("recertification_prompts").delete().eq("id", claim.id);
      failed++;
      console.error("recertification prompt not dispatched", { reason: result.reason });
    }
  }

  console.log("recertification sweep complete", {
    candidates: rows.length,
    sent,
    skipped,
    failed,
  });
  return json({ ok: true, mode: "live", windowDays, candidates: rows.length, sent, skipped, failed });
});
