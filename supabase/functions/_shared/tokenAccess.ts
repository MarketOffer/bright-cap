// Token resolution shared by `redeem-access-token` and `download-document`.
// deno-lint-ignore-file no-explicit-any
import { type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import { flagEnabled, hashToken, timingSafeEqual } from "./gatedDelivery.ts";

export type DenyReason =
  | "flag_off"
  | "invalid_token"
  | "token_expired"
  | "token_revoked"
  | "statement_expired"
  | "statement_revoked"
  | "no_statement"
  | "document_unavailable"
  | "rate_limited";

export interface ResolvedToken {
  tokenRow: {
    id: string;
    contact_id: string;
    statement_id: string;
    document_id: string;
    expires_at: string;
    first_used_at: string | null;
    use_count: number;
  };
  contact: { id: string; full_name: string; email: string };
  document: {
    id: string;
    slug: string;
    title: string;
    version: string;
    storage_path: string;
    promoter_entity_name: string;
    promoter_company_number: string;
    warning_block_version: string;
  };
  statement: { id: string; signed_at: string; expires_at: string };
}

export type ResolveOutcome =
  | { ok: true; value: ResolvedToken }
  | { ok: false; reason: DenyReason; reissuable?: boolean };

const GUESS_WINDOW_MS = 15 * 60 * 1000;
const GUESS_LIMIT = 20;

/** Records a failed lookup so enumeration attempts are rate-limited and alertable. */
export async function recordTokenFailure(
  supabase: SupabaseClient,
  ip: string | null,
  userAgent: string | null,
  code: string,
) {
  // Logged in its own table so link guessing cannot poison the submission
  // rate limiter in `submit-eligibility`, which reads certification_attempts.
  await supabase.from("access_attempts").insert({
    kind: "token_lookup",
    reason_code: code,
    ip_address: ip,
    user_agent: userAgent,
  });
}

export async function guessLimitExceeded(
  supabase: SupabaseClient,
  ip: string | null,
): Promise<boolean> {
  if (!ip) return false;
  const since = new Date(Date.now() - GUESS_WINDOW_MS).toISOString();
  const { count } = await supabase
    .from("access_attempts")
    .select("id", { count: "exact", head: true })
    .gte("created_at", since)
    .eq("ip_address", ip)
    .eq("kind", "token_lookup")
    .eq("reason_code", "token_invalid");
  const exceeded = (count ?? 0) >= GUESS_LIMIT;
  if (exceeded) {
    // Alert: sustained token enumeration from a single address.
    console.error("ALERT token_enumeration_suspected", { attempts: count });
  }
  return exceeded;
}

/**
 * Validates a plaintext token. Never logs or returns the token itself.
 * The statement gate is re-checked HERE, at redemption time — not at issue time.
 */
export async function resolveToken(
  supabase: SupabaseClient,
  token: string,
  ip: string | null,
  userAgent: string | null,
): Promise<ResolveOutcome> {
  if (!(await flagEnabled(supabase))) return { ok: false, reason: "flag_off" };

  const clean = typeof token === "string" ? token.trim() : "";
  const deny = async (reason: DenyReason, reissuable = false) => {
    if (reason === "invalid_token") {
      await recordTokenFailure(supabase, ip, userAgent, "token_invalid");
      // Enumeration guard applies to FAILED lookups only. A holder of a valid
      // token is never locked out by guesses from a shared address.
      if (await guessLimitExceeded(supabase, ip)) {
        return { ok: false as const, reason: "rate_limited" as DenyReason, reissuable: false };
      }
    }
    return { ok: false as const, reason, reissuable };
  };

  if (clean.length < 20 || clean.length > 200 || !/^[A-Za-z0-9_-]+$/.test(clean)) {
    return await deny("invalid_token");
  }

  const candidateHash = await hashToken(clean);
  const { data: tokenRow } = await supabase
    .from("access_tokens")
    .select(
      "id, contact_id, statement_id, document_id, token_hash, expires_at, revoked_at, first_used_at, use_count",
    )
    .eq("token_hash", candidateHash)
    .maybeSingle();

  // Constant-time confirmation of the digest, so a partial index match cannot
  // be distinguished by timing.
  if (!tokenRow || !timingSafeEqual(tokenRow.token_hash, candidateHash)) {
    return await deny("invalid_token");
  }
  if (tokenRow.revoked_at) return await deny("token_revoked", true);
  if (new Date(tokenRow.expires_at).getTime() <= Date.now()) {
    return await deny("token_expired", true);
  }

  const { data: gate } = await supabase
    .rpc("fn_can_promote", { p_contact_id: tokenRow.contact_id })
    .maybeSingle();
  const gateRow = gate as { allowed?: boolean; reason?: string } | null;
  if (!gateRow?.allowed) {
    const reason = gateRow?.reason === "statement_revoked"
      ? "statement_revoked"
      : gateRow?.reason === "statement_expired"
      ? "statement_expired"
      : "no_statement";
    return await deny(reason as DenyReason);
  }

  const [{ data: contact }, { data: document }, { data: statement }] = await Promise.all([
    supabase.from("contacts").select("id, full_name, email").eq("id", tokenRow.contact_id)
      .maybeSingle(),
    supabase
      .from("documents")
      .select(
        "id, slug, title, version, storage_path, promoter_entity_name, promoter_company_number, warning_block_version, is_active",
      )
      .eq("id", tokenRow.document_id)
      .maybeSingle(),
    supabase.from("investor_statements").select("id, signed_at, expires_at, revoked_at").eq(
      "id",
      tokenRow.statement_id,
    ).maybeSingle(),
  ]);

  if (!contact || !document || !document.is_active || !statement) {
    return await deny("document_unavailable");
  }
  if (statement.revoked_at) return await deny("statement_revoked");
  if (new Date(statement.expires_at).getTime() <= Date.now()) {
    return await deny("statement_expired");
  }

  return { ok: true, value: { tokenRow, contact, document, statement } };
}

/** Writes the audit row for a served communication. Must happen BEFORE the payload. */
export async function logCommunication(
  supabase: SupabaseClient,
  resolved: ResolvedToken,
  channel: "email" | "page_view" | "download",
  ip: string | null,
  userAgent: string | null,
) {
  const { error } = await supabase.from("promotion_communications").insert({
    contact_id: resolved.contact.id,
    statement_id: resolved.statement.id,
    document_id: resolved.document.id,
    channel,
    exemption_relied_on: "FPO art 48/50A",
    statement_signed_at: resolved.statement.signed_at,
    statement_expires_at: resolved.statement.expires_at,
    token_id: resolved.tokenRow.id,
    ip_address: ip,
    user_agent: userAgent,
  });
  if (error) throw error;
}

export async function markTokenUsed(supabase: SupabaseClient, resolved: ResolvedToken) {
  const now = new Date().toISOString();
  await supabase
    .from("access_tokens")
    .update({
      use_count: resolved.tokenRow.use_count + 1,
      first_used_at: resolved.tokenRow.first_used_at ?? now,
      last_used_at: now,
    })
    .eq("id", resolved.tokenRow.id);
}
