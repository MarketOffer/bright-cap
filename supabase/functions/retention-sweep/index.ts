// Slice 6 — retention sweep.
//
// Statement + audit trail are deleted six years after the LAST promotion made
// in reliance on that statement (or six years after it expired, if no promotion
// was ever made under it).
//
// SHIPS DISABLED. With the `retention_purge` flag off — the default — this is a
// dry run: it reports what would be deleted and deletes nothing.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const PURGE_FLAG = "retention_purge";

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, reason: "method_not_allowed" }, 405);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } },
  );

  const cronSecret = Deno.env.get("CRON_SECRET");
  const presented = req.headers.get("x-cron-secret");
  if (!(cronSecret && presented === cronSecret)) {
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
  }

  const { data: candidates, error } = await supabase.rpc("fn_retention_candidates", {});
  if (error) {
    console.error("retention query failed", { message: error.message });
    return json({ ok: false, reason: "query_failed" }, 500);
  }

  const rows = (candidates ?? []) as Array<{
    statement_id: string;
    contact_id: string;
    last_promotion_at: string | null;
    cutoff_at: string;
  }>;

  const { data: flag } = await supabase
    .from("feature_flags")
    .select("enabled")
    .eq("key", PURGE_FLAG)
    .maybeSingle();

  // Orphan check runs alongside: a promotion logged but never dispatched is a
  // send-path fault and must be visible in the same operational report.
  const { data: orphans } = await supabase.rpc("fn_promotion_orphans", {});

  if (flag?.enabled !== true) {
    console.log("retention dry run", { candidates: rows.length });
    return json({
      ok: true,
      mode: "dry_run",
      deleted: 0,
      candidates: rows.length,
      report: rows,
      orphanPromotions: (orphans ?? []).length,
    });
  }

  let deleted = 0;
  for (const row of rows) {
    const { error: deleteError } = await supabase
      .from("investor_statements")
      .delete()
      .eq("id", row.statement_id);
    if (deleteError) {
      console.error("retention delete failed", { message: deleteError.message });
      continue;
    }
    await supabase
      .from("admin_access_log")
      .delete()
      .eq("subject_type", "statement")
      .eq("subject_id", row.statement_id);
    deleted++;
  }

  console.log("retention purge complete", { candidates: rows.length, deleted });
  return json({
    ok: true,
    mode: "live",
    candidates: rows.length,
    deleted,
    orphanPromotions: (orphans ?? []).length,
  });
});
