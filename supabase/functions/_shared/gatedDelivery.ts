// Shared helpers for the gated document delivery layer (Slice 4).
//
// Rules enforced here:
//  - tokens are 256-bit CSRNG values, stored as SHA-256 hashes only
//  - plaintext tokens are NEVER written to the database or to any log line
//  - every gated response carries `X-Robots-Tag: noindex, nofollow`
//  - nothing is issued or served unless the `gated_summary_delivery` flag is on

// deno-lint-ignore-file no-explicit-any
import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { sendPromotion } from "./sendPromotion.ts";

export const GATED_FLAG = "gated_summary_delivery";
export const TOKEN_TTL_DAYS = 14;
export const SIGNED_URL_TTL_SECONDS = 60;
export const DOCUMENT_BUCKET = "investor-documents";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/** Headers for every gated handler: CORS + a hard noindex. */
export const gatedHeaders = (extra: Record<string, string> = {}) => ({
  ...corsHeaders,
  "X-Robots-Tag": "noindex, nofollow",
  "Cache-Control": "no-store",
  ...extra,
});

export const jsonResponse = (
  body: unknown,
  status = 200,
  extra: Record<string, string> = {},
) =>
  new Response(JSON.stringify(body), {
    status,
    headers: gatedHeaders({ "Content-Type": "application/json", ...extra }),
  });

export function serviceClient(): SupabaseClient {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } },
  );
}

export function clientMeta(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for") ?? "";
  return {
    ip: forwarded.split(",")[0].trim() || null,
    userAgent: req.headers.get("user-agent") ?? null,
  };
}

// ---- tokens ---------------------------------------------------------------

const B64URL = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

/** 32 CSRNG bytes = 256 bits of entropy, well above the 128-bit floor. */
export function mintToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return B64URL(bytes);
}

export async function hashToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token),
  );
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Constant-time comparison of two equal-length hex digests. */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// ---- feature flag ---------------------------------------------------------

export async function flagEnabled(
  supabase: SupabaseClient,
  key = GATED_FLAG,
): Promise<boolean> {
  const { data } = await supabase
    .from("feature_flags")
    .select("enabled")
    .eq("key", key)
    .maybeSingle();
  return data?.enabled === true;
}

// ---- statutory warning block ---------------------------------------------

export const WARNING_BLOCK_VERSION = "fpo-2026-07-v1";

/**
 * The art 48(5)/(5A)/(7) block. The promoting entity is passed in from the
 * `documents` row — it is never hardcoded, because a document issued by an SPV
 * rather than the promoter changes the 48(5A) wording.
 */
export function warningBlock(promoterName: string, promoterNumber: string): string {
  return [
    "IMPORTANT — RESTRICTED COMMUNICATION",
    "",
    "This communication is directed only at persons who have certified themselves as a high net worth individual or a self-certified sophisticated investor under the Financial Services and Markets Act 2000 (Financial Promotion) Order 2005 (as amended). It must not be acted on or relied on by anyone else.",
    "",
    `The person making this communication is ${promoterName} (company number ${promoterNumber}), which is not an authorised person under the Financial Services and Markets Act 2000.`,
    "",
    "The investments described are not subject to the protections of the UK regulatory system. You will not have access to the Financial Ombudsman Service or the Financial Services Compensation Scheme. Your capital is at risk and you may lose all of the money you invest. Past performance is not a guide to future performance.",
    "",
    "You should not invest unless you are prepared to lose all of the money you invest. You should seek independent advice from an authorised person who specialises in advising on this kind of investment.",
  ].join("\n");
}

// ---- issue ----------------------------------------------------------------

export interface IssueResult {
  ok: boolean;
  reason?: string;
  token?: string;
  tokenId?: string;
  documentSlug?: string;
  expiresAt?: string;
}

/**
 * Mints a fresh token for a contact + statement + document, revoking any live
 * token for the same triple (self-service re-issue kills the old link).
 * Returns the plaintext token to the CALLER ONLY; it is never persisted.
 */
export async function issueAccessToken(
  supabase: SupabaseClient,
  params: { contactId: string; statementId?: string | null; documentSlug?: string },
): Promise<IssueResult> {
  if (!(await flagEnabled(supabase))) return { ok: false, reason: "flag_off" };

  const { data: gate } = await supabase
    .rpc("fn_can_promote", { p_contact_id: params.contactId })
    .maybeSingle();

  const gateRow = gate as { allowed?: boolean; statement_id?: string; reason?: string } | null;
  if (!gateRow?.allowed) {
    return { ok: false, reason: gateRow?.reason ?? "no_statement" };
  }
  const statementId = params.statementId ?? gateRow.statement_id!;

  const query = supabase
    .from("documents")
    .select("id, slug, title, version")
    .eq("is_active", true);
  const { data: document } = params.documentSlug
    ? await query.eq("slug", params.documentSlug).maybeSingle()
    : await query.order("created_at", { ascending: false }).limit(1).maybeSingle();

  if (!document) return { ok: false, reason: "no_document" };

  await supabase
    .from("access_tokens")
    .update({ revoked_at: new Date().toISOString(), revoked_reason: "reissued" })
    .eq("contact_id", params.contactId)
    .eq("document_id", document.id)
    .is("revoked_at", null);

  const token = mintToken();
  const expiresAt = new Date(
    Date.now() + TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
  ).toISOString();

  const { data: row, error } = await supabase
    .from("access_tokens")
    .insert({
      contact_id: params.contactId,
      statement_id: statementId,
      document_id: document.id,
      token_hash: await hashToken(token),
      expires_at: expiresAt,
    })
    .select("id")
    .single();

  if (error) return { ok: false, reason: "insert_failed" };

  return {
    ok: true,
    token,
    tokenId: row.id,
    documentSlug: document.slug,
    expiresAt,
  };
}

// ---- delivery email -------------------------------------------------------

/**
 * Confirmation + access link ONLY. Zero deal content: no yields, no prices, no
 * property specifics. The warning block travels with it regardless.
 *
 * Slice 6: this now goes through sendPromotion(), so the 12-month test is
 * re-applied at SEND TIME and the communication is logged before dispatch.
 */
export async function sendAccessEmail(
  supabase: SupabaseClient,
  params: {
    contactId: string;
    documentId?: string | null;
    tokenId?: string | null;
    to: string;
    fullName: string;
    link: string;
    expiresAt: string;
    promoterName: string;
    promoterNumber: string;
    ip?: string | null;
    userAgent?: string | null;
  },
): Promise<{ sent: boolean; reason?: string }> {
  const expiry = new Date(params.expiresAt).toUTCString();
  const warning = warningBlock(params.promoterName, params.promoterNumber);

  const text = [
    `Dear ${params.fullName},`,
    "",
    "Thank you for completing the investor certification. Your access link is below. It is personal to you, expires on " +
      expiry + ", and should not be forwarded.",
    "",
    params.link,
    "",
    "If the link has expired you can request a new one from the same page.",
    "",
    warning,
  ].join("\n");

  const result = await sendPromotion(supabase, {
    contactId: params.contactId,
    channel: "email",
    exemptionReliedOn: "FPO art 48/50A",
    documentId: params.documentId ?? null,
    tokenId: params.tokenId ?? null,
    ip: params.ip ?? null,
    userAgent: params.userAgent ?? null,
    email: { to: params.to, subject: "Your BrightCap access link", text },
  });

  return { sent: result.ok, reason: result.reason };
}
