// Redeem a gated access token: validate, re-check the promotion gate at
// redemption time, log the page view, and return the gated page payload.
import {
  clientMeta,
  corsHeaders,
  jsonResponse,
  serviceClient,
  warningBlock,
  WARNING_BLOCK_VERSION,
} from "../_shared/gatedDelivery.ts";
import {
  enforceClaim,
  logCommunication,
  markTokenUsed,
  resolveToken,
} from "../_shared/tokenAccess.ts";

const REISSUABLE = new Set(["token_expired", "token_revoked"]);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method_not_allowed" }, 405);

  const supabase = serviceClient();
  const { ip, userAgent } = clientMeta(req);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    body = null;
  }
  const token = String((body as { token?: string } | null)?.token ?? "");
  const presentedClaim = String((body as { claim?: string } | null)?.claim ?? "");

  const outcome = await resolveToken(supabase, token, ip, userAgent);
  if (!outcome.ok) {
    console.log("token redemption denied", { reason: outcome.reason });
    return jsonResponse(
      {
        ok: false,
        reason: outcome.reason,
        reissuable: REISSUABLE.has(outcome.reason),
      },
      outcome.reason === "rate_limited" ? 429 : 403,
    );
  }

  const { value } = outcome;

  // One-device rule: the first browser to open the link claims it.
  const claim = await enforceClaim(supabase, value, presentedClaim, ip, userAgent);
  if (!claim.ok) {
    return jsonResponse({ ok: false, reason: claim.reason, reissuable: true }, 403);
  }

  try {
    // Audit row is written before anything is served.
    await logCommunication(supabase, value, "page_view", ip, userAgent);
  } catch (error) {
    console.error("page_view audit write failed", {
      message: error instanceof Error ? error.message : "unknown",
    });
    return jsonResponse({ ok: false, reason: "audit_failed" }, 500);
  }
  await markTokenUsed(supabase, value);

  console.log("token redeemed", { tokenId: value.tokenRow.id, channel: "page_view" });

  return jsonResponse({
    ok: true,
    ...(claim.claim ? { claim: claim.claim } : {}),
    document: {
      slug: value.document.slug,
      title: value.document.title,
      version: value.document.version,
      promoterEntityName: value.document.promoter_entity_name,
      promoterCompanyNumber: value.document.promoter_company_number,
      warningBlockVersion: value.document.warning_block_version,
      warningBlock: warningBlock(
        value.document.promoter_entity_name,
        value.document.promoter_company_number,
      ),
    },
    recipient: {
      fullName: value.contact.full_name,
      email: value.contact.email,
    },
    tokenExpiresAt: value.tokenRow.expires_at,
    statementExpiresAt: value.statement.expires_at,
    currentWarningBlockVersion: WARNING_BLOCK_VERSION,
  });
});
