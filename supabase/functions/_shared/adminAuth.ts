// Shared authorisation + audit helpers for the admin compliance view (Slice 5).
//
// Rules enforced here:
//  - the caller's identity comes from a JWT validated against the auth server,
//    never from anything the client asserts about itself
//  - roles are read server-side via has_role(); a client cannot influence them
//  - every admin read and write is logged to admin_access_log
//  - the anon key never touches the compliance tables: all data access below
//    runs through the service-role client, behind the role check

import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export const adminHeaders = (extra: Record<string, string> = {}) => ({
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
    headers: adminHeaders({ "Content-Type": "application/json", ...extra }),
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

export type AppRole = "admin" | "compliance";

export interface Actor {
  userId: string;
  email: string | null;
  roles: AppRole[];
}

export type AuthOutcome =
  | { ok: true; actor: Actor }
  | { ok: false; status: number; reason: string; userId?: string; email?: string | null };

/**
 * Resolve the caller from the bearer token.
 *
 * `getUser(jwt)` re-validates the token with the auth server, so a forged or
 * edited token — including one with hand-written role claims — fails here.
 * Roles are then read from the database, never from the token payload.
 */
export async function authenticate(
  supabase: SupabaseClient,
  req: Request,
): Promise<AuthOutcome> {
  const header = req.headers.get("Authorization") ?? "";
  const jwt = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : "";
  if (!jwt) return { ok: false, status: 401, reason: "unauthenticated" };

  const { data, error } = await supabase.auth.getUser(jwt);
  if (error || !data?.user) return { ok: false, status: 401, reason: "unauthenticated" };

  const user = data.user;
  const roles: AppRole[] = [];
  for (const role of ["admin", "compliance"] as AppRole[]) {
    const { data: held, error: roleError } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: role,
    });
    if (roleError) {
      console.error("role lookup failed", { message: roleError.message });
      return { ok: false, status: 500, reason: "role_lookup_failed" };
    }
    if (held === true) roles.push(role);
  }

  if (roles.length === 0) {
    return {
      ok: false,
      status: 403,
      reason: "not_authorised",
      userId: user.id,
      email: user.email ?? null,
    };
  }

  return { ok: true, actor: { userId: user.id, email: user.email ?? null, roles } };
}

export const hasRole = (actor: Actor, role: AppRole) => actor.roles.includes(role);

/** Writes an audit row. Reads are logged here too, not only writes. */
export async function logAdminAccess(
  supabase: SupabaseClient,
  params: {
    actorUserId: string;
    actorEmail: string | null;
    action:
      | "list_view"
      | "statement_view"
      | "financials_reveal"
      | "financials_denied"
      | "statement_revoke"
      | "access_denied";
    subjectType?: string | null;
    subjectId?: string | null;
    detail?: Record<string, unknown>;
    ip: string | null;
    userAgent: string | null;
  },
) {
  const { error } = await supabase.from("admin_access_log").insert({
    actor_user_id: params.actorUserId,
    actor_email: params.actorEmail,
    action: params.action,
    subject_type: params.subjectType ?? null,
    subject_id: params.subjectId ?? null,
    detail: params.detail ?? {},
    ip_address: params.ip,
    user_agent: params.userAgent,
  });
  if (error) throw new Error(`admin audit write failed: ${error.message}`);
}
