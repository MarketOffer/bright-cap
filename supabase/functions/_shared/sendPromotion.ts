// Slice 6 — the send-path contract.
//
// THIS FILE IS THE ONLY SANCTIONED OUTBOUND EMAIL PATH IN THE PROJECT.
// A lint rule (see eslint.config.js, `no-restricted-syntax`) fails the build if
// any other file calls the email provider directly.
//
// Rules enforced here, in this order, for every financial promotion:
//   (a) fn_can_promote() is called at SEND TIME, fresh, on every send. The
//       result is never cached, never stored on `contacts`, never passed in by
//       the caller.
//   (b) a `promotion_communications` row is written BEFORE dispatch, carrying
//       the statement's signed_at/expires_at as they stood at that moment.
//   (c) dispatch happens last; on success the row is stamped `dispatched_at`.
//       A row left without `dispatched_at` is an orphan and is surfaced by
//       fn_promotion_orphans() — a logged promotion that never went out is a
//       data-integrity fault, not a silent success.
//
// A neutral operational email (e.g. a recertification prompt) is NOT a
// financial promotion: it carries no deal content of any kind. Those go through
// `dispatchEmail` directly and are never written to promotion_communications.

// deno-lint-ignore-file no-explicit-any
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

export interface DispatchResult {
  sent: boolean;
  reason?: string;
  ref?: string | null;
}

/**
 * Raw provider call. Internal to the send path — do not call from anywhere
 * that constitutes a financial promotion; use `sendPromotion` for those.
 *
 * Routed through the Lovable connector gateway. NOTE: the linked connection is
 * currently MarketOffer's, so the sending domain is a MarketOffer-verified
 * domain until a brightcap.capital sender is verified — tracked as a Slice 0
 * blocking item.
 */
const GATEWAY_URL = "https://connector-gateway.lovable.dev/resend";

// TEMPORARY: outbound mail is routed to a Make.com webhook instead of Resend.
// The Resend call site below is commented out, not deleted — restoring it is a
// one-line swap once a verified brightcap.capital sender exists (gate item 0.7).
const WEBHOOK_URL = Deno.env.get("EMAIL_WEBHOOK_URL") ??
  "https://hook.eu2.make.com/tfeswcx47u1wcycs3v3ftd26tpd6eeoc";

function splitName(fullName?: string): { first: string; last: string } {
  const parts = (fullName ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: "", last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Convert the plain-text body into simple, email-safe HTML. */
function textToHtml(text: string): string {
  const paragraphs = text
    .trim()
    .split(/\n{2,}/)
    .map((block) =>
      `<p style="margin:0 0 16px;">${
        escapeHtml(block).replace(
          /(https?:\/\/[^\s<]+)/g,
          '<a href="$1" style="color:#3CD7B6;">$1</a>',
        ).replace(/\n/g, "<br />")
      }</p>`
    )
    .join("");
  return `<div style="font-family:Lato,Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:#171717;">${paragraphs}</div>`;
}

export async function dispatchEmail(params: {
  to: string;
  subject: string;
  text: string;
  /** Optional pre-built HTML body. Falls back to HTML derived from `text`. */
  html?: string;
  fullName?: string;
}): Promise<DispatchResult> {
  const from = Deno.env.get("ACCESS_EMAIL_FROM") ??
    "BrightCap <support@marketoffer.co.uk>";
  const replyTo = Deno.env.get("ACCESS_EMAIL_REPLY_TO") ?? null;
  const { first, last } = splitName(params.fullName);
  const html = params.html ?? textToHtml(params.text);

  const payload = {
    first_name: first,
    last_name: last,
    email: params.to,
    subject: params.subject,
    text: params.text,
    html,
    from,
    reply_to: replyTo,
    sent_at: new Date().toISOString(),
  };


  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error("email webhook dispatch failed", {
      status: response.status,
      detail: detail.slice(0, 300),
    });
    return { sent: false, reason: "webhook_error" };
  }

  const ref = await response.text().catch(() => "");
  return { sent: true, ref: ref ? `webhook:${ref.slice(0, 80)}` : "webhook" };

  /* ---- Resend path (temporarily disabled) --------------------------------
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  const connectionKey = Deno.env.get("RESEND_API_KEY");
  if (!lovableKey || !connectionKey) {
    return { sent: false, reason: "no_email_provider" };
  }

  const body: Record<string, unknown> = {
    from,
    to: [params.to],
    subject: params.subject,
    text: params.text,
  };
  if (replyTo) body.reply_to = replyTo;

  const response = await fetch(`${GATEWAY_URL}/emails`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": connectionKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error("email dispatch failed", {
      status: response.status,
      detail: detail.slice(0, 300),
    });
    return { sent: false, reason: "provider_error" };
  }

  let ref: string | null = null;
  try {
    const parsed = await response.json();
    ref = typeof parsed?.id === "string" ? parsed.id : null;
  } catch {
    // provider returned no body; the send still succeeded
  }
  return { sent: true, ref };
  ------------------------------------------------------------------------ */
}

export interface PromotionParams {
  contactId: string;
  /** 'email' | 'call' | 'meeting' | 'document' — how the promotion travelled. */
  channel: string;
  /** The FPO article relied on, e.g. 'FPO art 48' or 'FPO art 50A'. */
  exemptionReliedOn: string;
  documentId?: string | null;
  tokenId?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  /** Present for channel === 'email'. Omitted for logged real-time contact. */
  email?: { to: string; subject: string; text: string; fullName?: string };
}

export interface PromotionResult {
  ok: boolean;
  reason?: string;
  communicationId?: string;
  statementId?: string;
  dispatched?: boolean;
}

/**
 * The only sanctioned way to make a financial promotion.
 * Refuses before dispatch if the contact is not currently certified.
 */
export async function sendPromotion(
  supabase: SupabaseClient,
  params: PromotionParams,
): Promise<PromotionResult> {
  // (a) live gate check — always re-read, never cached.
  const { data: gate, error: gateError } = await supabase
    .rpc("fn_can_promote", { p_contact_id: params.contactId })
    .maybeSingle();

  if (gateError) return { ok: false, reason: "gate_check_failed" };

  const gateRow = gate as
    | { allowed?: boolean; statement_id?: string; reason?: string }
    | null;

  if (!gateRow?.allowed || !gateRow.statement_id) {
    console.log("promotion refused", { reason: gateRow?.reason ?? "no_statement" });
    return { ok: false, reason: gateRow?.reason ?? "no_statement" };
  }
  const statementId = gateRow.statement_id;

  const { data: statement } = await supabase
    .from("investor_statements")
    .select("signed_at, expires_at")
    .eq("id", statementId)
    .maybeSingle();

  if (!statement) return { ok: false, reason: "statement_missing" };

  // (b) log BEFORE dispatch.
  const { data: row, error: logError } = await supabase
    .from("promotion_communications")
    .insert({
      contact_id: params.contactId,
      statement_id: statementId,
      document_id: params.documentId ?? null,
      channel: params.channel,
      exemption_relied_on: params.exemptionReliedOn,
      statement_signed_at: statement.signed_at,
      statement_expires_at: statement.expires_at,
      token_id: params.tokenId ?? null,
      ip_address: params.ip ?? null,
      user_agent: params.userAgent ?? null,
    })
    .select("id")
    .single();

  if (logError || !row) return { ok: false, reason: "log_failed" };

  // (c) dispatch, then stamp.
  if (!params.email) {
    // Non-email channel: the caller is recording a communication it is making
    // itself (e.g. a solicited real-time call). Stamp it immediately.
    await supabase
      .from("promotion_communications")
      .update({ dispatched_at: new Date().toISOString(), dispatch_ref: "manual" })
      .eq("id", row.id);
    return { ok: true, communicationId: row.id, statementId, dispatched: true };
  }

  const result = await dispatchEmail(params.email);
  if (result.sent) {
    await supabase
      .from("promotion_communications")
      .update({ dispatched_at: new Date().toISOString(), dispatch_ref: result.ref })
      .eq("id", row.id);
  } else {
    console.error("promotion logged but not dispatched", {
      communicationId: row.id,
      reason: result.reason,
    });
  }

  return {
    ok: result.sent,
    reason: result.sent ? undefined : result.reason,
    communicationId: row.id,
    statementId,
    dispatched: result.sent,
  };
}
