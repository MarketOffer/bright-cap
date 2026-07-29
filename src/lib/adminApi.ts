import { supabase } from "@/integrations/supabase/client";

export interface RegisterRow {
  statementId: string;
  contactId: string;
  fullName: string;
  email: string;
  statementKind: "hnw" | "scsi";
  qualifyingCriteria: string[];
  signedAt: string;
  expiresAt: string;
  revokedAt: string | null;
  revokedReason: string | null;
  isCurrent: boolean;
  daysRemaining: number;
  dueForRecertification: boolean;
  communicationCount: number;
  lastAccessAt: string | null;
}

export interface StatementDetail {
  contact: {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    marketing_opt_in: boolean;
    marketing_opt_in_at: string | null;
    privacy_notice_version: string | null;
  } | null;
  communications: Array<{
    id: string;
    channel: string;
    exemption_relied_on: string;
    sent_at: string;
  }>;
  gate: { allowed: boolean; statement_id: string | null; reason: string } | null;
  statement: {
    id: string;
    statementKind: "hnw" | "scsi";
    instrument: string;
    statementVersion: string;
    signedAt: string;
    expiresAt: string;
    signatureTyped: string;
    declaredFullName: string;
    answers: Record<string, unknown>;
    qualifyingCriteria: string[];
    declarations: Record<string, unknown>;
    snapshot: string;
    ipAddress: string | null;
    userAgent: string | null;
    revokedAt: string | null;
    revokedReason: string | null;
  };
}

async function callAdmin<T>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke("admin-api", { body });
  if (error) {
    // supabase-js surfaces non-2xx as FunctionsHttpError; read the reason if present.
    let reason = "request_failed";
    const ctx = (error as { context?: Response }).context;
    if (ctx && typeof ctx.json === "function") {
      try {
        const parsed = await ctx.json();
        reason = parsed?.reason ?? reason;
      } catch {
        /* keep default */
      }
    }
    throw new Error(reason);
  }
  if (data && (data as { ok?: boolean }).ok === false) {
    throw new Error((data as { reason?: string }).reason ?? "request_failed");
  }
  return data as T;
}

export const fetchRegister = () =>
  callAdmin<{ ok: true; roles: string[]; rows: RegisterRow[] }>({ action: "list" });

export const fetchStatement = (statementId: string) =>
  callAdmin<StatementDetail & { roles: string[] }>({ action: "statement", statementId });

export const fetchFinancials = (statementId: string) =>
  callAdmin<{ ok: true; financials: { incomeBand: number | null; netAssetsBand: number | null } | null }>(
    { action: "financials", statementId },
  );

export const revokeStatement = (statementId: string, reason: string) =>
  callAdmin<{ ok: true }>({ action: "revoke", statementId, reason });
