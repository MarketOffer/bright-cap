// Admin compliance API (Slice 5).
//
// One POST endpoint, four actions. Every action re-authenticates, re-checks the
// role server-side and writes an audit row. Financial bands are served only to
// the `compliance` role and never appear in any other response body.
import {
  authenticate,
  clientMeta,
  corsHeaders,
  hasRole,
  jsonResponse,
  logAdminAccess,
  serviceClient,
  type Actor,
} from "../_shared/adminAuth.ts";
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

interface Body {
  action?: string;
  statementId?: string;
  reason?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "method_not_allowed" }, 405);

  const supabase = serviceClient();
  const { ip, userAgent } = clientMeta(req);

  const auth = await authenticate(supabase, req);
  if (!auth.ok) {
    // A signed-in user without a role is a real access attempt: log it.
    if (auth.userId) {
      await logAdminAccess(supabase, {
        actorUserId: auth.userId,
        actorEmail: auth.email ?? null,
        action: "access_denied",
        detail: { reason: auth.reason },
        ip,
        userAgent,
      }).catch(() => {});
    }
    return jsonResponse({ ok: false, reason: auth.reason }, auth.status);
  }
  const actor = auth.actor;

  let body: Body | null = null;
  try {
    body = (await req.json()) as Body;
  } catch {
    body = null;
  }
  const action = String(body?.action ?? "");

  try {
    switch (action) {
      case "list":
        return await listRegister(supabase, actor, ip, userAgent);
      case "statement":
        return await statementDetail(supabase, actor, body?.statementId, ip, userAgent);
      case "financials":
        return await financials(supabase, actor, body?.statementId, ip, userAgent);
      case "revoke":
        return await revoke(supabase, actor, body?.statementId, body?.reason, ip, userAgent);
      default:
        return jsonResponse({ ok: false, reason: "unknown_action" }, 400);
    }
  } catch (error) {
    console.error("admin action failed", {
      action,
      message: error instanceof Error ? error.message : "unknown",
    });
    return jsonResponse({ ok: false, reason: "server_error" }, 500);
  }
});

// ---- list -----------------------------------------------------------------

async function listRegister(
  supabase: SupabaseClient,
  actor: Actor,
  ip: string | null,
  userAgent: string | null,
) {
  const [{ data: contacts }, { data: statements }, { data: certs }, { data: comms }] =
    await Promise.all([
      supabase.from("contacts").select("id, full_name, email, created_at"),
      supabase
        .from("investor_statements")
        .select(
          "id, contact_id, statement_kind, qualifying_criteria, signed_at, expires_at, revoked_at, revoked_reason",
        )
        .order("signed_at", { ascending: false }),
      supabase.from("v_contact_certification").select("*"),
      supabase
        .from("promotion_communications")
        .select("contact_id, channel, sent_at")
        .order("sent_at", { ascending: false }),
    ]);

  const certByContact = new Map((certs ?? []).map((c) => [c.contact_id as string, c]));
  const commsByContact = new Map<string, { count: number; last: string | null }>();
  for (const row of comms ?? []) {
    const entry = commsByContact.get(row.contact_id as string) ?? { count: 0, last: null };
    entry.count += 1;
    if (!entry.last) entry.last = row.sent_at as string;
    commsByContact.set(row.contact_id as string, entry);
  }

  const byContact = new Map<string, typeof statements>();
  for (const s of statements ?? []) {
    const list = byContact.get(s.contact_id as string) ?? [];
    list.push(s);
    byContact.set(s.contact_id as string, list);
  }

  const rows = (contacts ?? []).flatMap((contact) => {
    const list = byContact.get(contact.id as string) ?? [];
    const cert = certByContact.get(contact.id as string);
    const commsEntry = commsByContact.get(contact.id as string) ?? { count: 0, last: null };
    return list.map((s) => ({
      statementId: s.id,
      contactId: contact.id,
      fullName: contact.full_name,
      email: contact.email,
      statementKind: s.statement_kind,
      qualifyingCriteria: s.qualifying_criteria,
      signedAt: s.signed_at,
      expiresAt: s.expires_at,
      revokedAt: s.revoked_at,
      revokedReason: s.revoked_reason,
      // Live figures come from the view, which only counts an unrevoked,
      // in-window statement.
      isCurrent: cert?.statement_id === s.id,
      daysRemaining: cert?.statement_id === s.id ? cert?.days_remaining ?? 0 : 0,
      dueForRecertification:
        cert?.statement_id === s.id ? cert?.due_for_recertification ?? false : false,
      communicationCount: commsEntry.count,
      lastAccessAt: commsEntry.last,
    }));
  });

  rows.sort((a, b) => String(b.signedAt).localeCompare(String(a.signedAt)));

  await logAdminAccess(supabase, {
    actorUserId: actor.userId,
    actorEmail: actor.email,
    action: "list_view",
    detail: { rows: rows.length },
    ip,
    userAgent,
  });

  // No financial bands in this payload, for any role.
  return jsonResponse({ ok: true, roles: actor.roles, rows });
}

// ---- statement detail -----------------------------------------------------

async function statementDetail(
  supabase: SupabaseClient,
  actor: Actor,
  statementId: string | undefined,
  ip: string | null,
  userAgent: string | null,
) {
  if (!statementId || !UUID_RE.test(statementId)) {
    return jsonResponse({ ok: false, reason: "invalid_statement_id" }, 400);
  }

  const { data: statement } = await supabase
    .from("investor_statements")
    .select("*")
    .eq("id", statementId)
    .maybeSingle();
  if (!statement) return jsonResponse({ ok: false, reason: "not_found" }, 404);

  const [{ data: contact }, { data: comms }, { data: gate }] = await Promise.all([
    supabase
      .from("contacts")
      .select("id, full_name, email, phone, marketing_opt_in, marketing_opt_in_at, privacy_notice_version")
      .eq("id", statement.contact_id)
      .maybeSingle(),
    supabase
      .from("promotion_communications")
      .select("id, channel, exemption_relied_on, sent_at")
      .eq("statement_id", statementId)
      .order("sent_at", { ascending: false }),
    supabase.rpc("fn_can_promote", { p_contact_id: statement.contact_id }),
  ]);

  // Patch v2.1: a statement may be preceded by a declined route in the same
  // episode. The reviewer sees the whole trail, not just the successful part.
  const { data: attempts } = statement.attempt_group_id
    ? await supabase
        .from("certification_attempts")
        .select("id, outcome, reason_codes, declined_kind, created_at")
        .eq("attempt_group_id", statement.attempt_group_id)
        .order("created_at", { ascending: true })
    : { data: [] };

  await logAdminAccess(supabase, {
    actorUserId: actor.userId,
    actorEmail: actor.email,
    action: "statement_view",
    subjectType: "investor_statement",
    subjectId: statementId,
    ip,
    userAgent,
  });

  return jsonResponse({
    ok: true,
    roles: actor.roles,
    contact,
    communications: comms ?? [],
    gate: Array.isArray(gate) ? gate[0] ?? null : gate ?? null,
    attempts: attempts ?? [],
    statement: {
      id: statement.id,
      statementKind: statement.statement_kind,
      instrument: statement.instrument,
      statementVersion: statement.statement_version,
      signedAt: statement.signed_at,
      expiresAt: statement.expires_at,
      signatureTyped: statement.signature_typed,
      declaredFullName: statement.declared_full_name,
      answers: statement.answers,
      qualifyingCriteria: statement.qualifying_criteria,
      declarations: statement.declarations,
      snapshot: statement.statement_snapshot,
      ipAddress: statement.ip_address,
      userAgent: statement.user_agent,
      revokedAt: statement.revoked_at,
      revokedReason: statement.revoked_reason,
    },
  });
}

// ---- financials (compliance only) -----------------------------------------

async function financials(
  supabase: SupabaseClient,
  actor: Actor,
  statementId: string | undefined,
  ip: string | null,
  userAgent: string | null,
) {
  if (!statementId || !UUID_RE.test(statementId)) {
    return jsonResponse({ ok: false, reason: "invalid_statement_id" }, 400);
  }

  if (!hasRole(actor, "compliance")) {
    await logAdminAccess(supabase, {
      actorUserId: actor.userId,
      actorEmail: actor.email,
      action: "financials_denied",
      subjectType: "investor_statement",
      subjectId: statementId,
      detail: { roles: actor.roles },
      ip,
      userAgent,
    });
    return jsonResponse({ ok: false, reason: "not_authorised" }, 403);
  }

  const { data } = await supabase
    .from("investor_statement_financials")
    .select("income_band, net_assets_band")
    .eq("statement_id", statementId)
    .maybeSingle();

  // The reveal is logged before the bands are returned.
  await logAdminAccess(supabase, {
    actorUserId: actor.userId,
    actorEmail: actor.email,
    action: "financials_reveal",
    subjectType: "investor_statement",
    subjectId: statementId,
    ip,
    userAgent,
  });

  return jsonResponse({
    ok: true,
    financials: data
      ? { incomeBand: data.income_band, netAssetsBand: data.net_assets_band }
      : null,
  });
}

// ---- revocation (the only permitted write) --------------------------------

async function revoke(
  supabase: SupabaseClient,
  actor: Actor,
  statementId: string | undefined,
  reason: string | undefined,
  ip: string | null,
  userAgent: string | null,
) {
  if (!statementId || !UUID_RE.test(statementId)) {
    return jsonResponse({ ok: false, reason: "invalid_statement_id" }, 400);
  }
  const trimmed = String(reason ?? "").trim();
  if (trimmed.length < 5 || trimmed.length > 500) {
    return jsonResponse({ ok: false, reason: "reason_required" }, 400);
  }

  const { data: existing } = await supabase
    .from("investor_statements")
    .select("id, revoked_at")
    .eq("id", statementId)
    .maybeSingle();
  if (!existing) return jsonResponse({ ok: false, reason: "not_found" }, 404);
  if (existing.revoked_at) return jsonResponse({ ok: false, reason: "already_revoked" }, 409);

  const { data: updated, error } = await supabase
    .from("investor_statements")
    .update({ revoked_at: new Date().toISOString(), revoked_reason: trimmed })
    .eq("id", statementId)
    .select("id, revoked_at, revoked_reason")
    .maybeSingle();

  if (error || !updated) {
    console.error("revocation failed", { message: error?.message ?? "no row" });
    return jsonResponse({ ok: false, reason: "revoke_failed" }, 500);
  }

  // Live access dies with the statement: kill any outstanding links too.
  await supabase
    .from("access_tokens")
    .update({ revoked_at: new Date().toISOString(), revoked_reason: "statement_revoked" })
    .eq("statement_id", statementId)
    .is("revoked_at", null);

  await logAdminAccess(supabase, {
    actorUserId: actor.userId,
    actorEmail: actor.email,
    action: "statement_revoke",
    subjectType: "investor_statement",
    subjectId: statementId,
    detail: { reason: trimmed },
    ip,
    userAgent,
  });

  return jsonResponse({ ok: true, statement: updated });
}
