// Records the investor's marketing preference after an accepted submission.
// Authenticated by the personal access token minted at submission time, so the
// investor never re-enters an email. Never returns contact data.
import {
  corsHeaders,
  hashToken,
  jsonResponse,
  serviceClient,
  timingSafeEqual,
} from "../_shared/gatedDelivery.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method_not_allowed" }, 405);

  let body: { token?: string; optIn?: boolean } | null = null;
  try {
    body = await req.json();
  } catch {
    body = null;
  }

  const token = String(body?.token ?? "").trim();
  const optIn = body?.optIn === true;
  if (!token) return jsonResponse({ ok: false, reason: "invalid_token" }, 403);

  const supabase = serviceClient();
  const candidateHash = await hashToken(token);

  const { data: tokenRow } = await supabase
    .from("access_tokens")
    .select("id, contact_id, token_hash, revoked_at, expires_at")
    .eq("token_hash", candidateHash)
    .maybeSingle();

  if (
    !tokenRow ||
    !timingSafeEqual(tokenRow.token_hash, candidateHash) ||
    tokenRow.revoked_at !== null ||
    new Date(tokenRow.expires_at).getTime() < Date.now()
  ) {
    return jsonResponse({ ok: false, reason: "invalid_token" }, 403);
  }

  const now = new Date().toISOString();
  const { error } = await supabase
    .from("contacts")
    .update({
      marketing_opt_in: optIn,
      marketing_opt_in_at: optIn ? now : null,
    })
    .eq("id", tokenRow.contact_id);

  if (error) {
    console.error("marketing preference update failed", { message: error.message });
    return jsonResponse({ ok: false, reason: "update_failed" }, 500);
  }

  console.log("marketing preference recorded", { optIn });
  return jsonResponse({ ok: true });
});
