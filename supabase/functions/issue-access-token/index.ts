// Self-service re-issue of a gated access link (Slice 4).
//
// Public endpoint. Always returns the same generic response so it cannot be used
// to test whether an email address is certified. Never echoes the token.
import {
  clientMeta,
  corsHeaders,
  flagEnabled,
  issueAccessToken,
  jsonResponse,
  sendAccessEmail,
  serviceClient,
} from "../_shared/gatedDelivery.ts";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SITE_ORIGIN = Deno.env.get("SITE_ORIGIN") ?? "https://brightcap.capital";
const GENERIC = {
  ok: true,
  message:
    "If that address has a valid certification on file, a fresh access link has been sent to it.",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method_not_allowed" }, 405);

  const supabase = serviceClient();
  const { ip, userAgent } = clientMeta(req);

  if (!(await flagEnabled(supabase))) {
    return jsonResponse({ ok: false, reason: "unavailable" }, 404);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = null;
  }
  const email = String((body as { email?: string } | null)?.email ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 255) {
    return jsonResponse(GENERIC, 200);
  }

  // Rate limit re-issue requests per IP.
  const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  if (ip) {
    const { count } = await supabase
      .from("certification_attempts")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since)
      .eq("ip_address", ip)
      .eq("outcome", "reissue_request")
      .contains("reason_codes", ["reissue_request"]);
    if ((count ?? 0) >= 10) return jsonResponse(GENERIC, 200);
  }
  await supabase.from("certification_attempts").insert({
    outcome: "reissue_request",
    reason_codes: ["reissue_request"],
    ip_address: ip,
    user_agent: userAgent,
  });

  const { data: contact } = await supabase
    .from("contacts")
    .select("id, full_name, email")
    .ilike("email", email)
    .maybeSingle();

  if (!contact) return jsonResponse(GENERIC, 200);

  const issued = await issueAccessToken(supabase, { contactId: contact.id });
  if (!issued.ok || !issued.token) {
    console.log("reissue not granted", { reason: issued.reason });
    return jsonResponse(GENERIC, 200);
  }

  const { data: document } = await supabase
    .from("documents")
    .select("promoter_entity_name, promoter_company_number")
    .eq("slug", issued.documentSlug!)
    .maybeSingle();

  await sendAccessEmail({
    to: contact.email,
    fullName: contact.full_name,
    link: `${SITE_ORIGIN}/investors/summary?t=${issued.token}`,
    expiresAt: issued.expiresAt!,
    promoterName: document?.promoter_entity_name ?? "the promoter",
    promoterNumber: document?.promoter_company_number ?? "",
  });

  console.log("access token re-issued", { tokenId: issued.tokenId });
  return jsonResponse(GENERIC, 200);
});
