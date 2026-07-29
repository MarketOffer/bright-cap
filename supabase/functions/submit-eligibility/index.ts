// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";
import {
  CURRENT_STATEMENT_VERSION,
  getStatement,
  type StatementKind,
} from "../_shared/statementDefinitions.ts";
import { renderStatementSnapshot } from "../_shared/renderStatementSnapshot.ts";
import {
  flagEnabled,
  issueAccessToken,
  sendAccessEmail,
} from "../_shared/gatedDelivery.ts";
import { EMAIL_TYPES } from "../_shared/sendPromotion.ts";

const SITE_ORIGIN = Deno.env.get("SITE_ORIGIN") ?? "https://brightcap.capital";


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/**
 * Server-side validation is AUTHORITATIVE. The client's validation is convenience only.
 * Never log signatures, financial figures, emails or tokens from this function.
 */

type Answer = "yes" | "no" | null;

const HNW_CONDITIONS = ["A", "B"] as const;
const SCSI_CONDITIONS = ["A", "B", "C", "D"] as const;

const REASONS = {
  NONE_APPLY_SELECTED: "none_apply_selected",
  ALL_CONDITIONS_NO: "all_conditions_no",
  MISSING_DETAIL: "missing_detail",
  CONTRADICTION: "contradiction",
  UNANSWERED_CONDITION: "unanswered_condition",
  NO_KIND_SELECTED: "no_kind_selected",
  DECLARATIONS_INCOMPLETE: "declarations_incomplete",
  SIGNATURE_MISSING: "signature_missing",
  CONTACT_INVALID: "contact_invalid",
  PRIVACY_NOT_ACKNOWLEDGED: "privacy_not_acknowledged",
  INVALID_PAYLOAD: "invalid_payload",
  RATE_LIMITED: "rate_limited",
  BOTH_ROUTES_DECLINED: "both_routes_declined",
} as const;

/** Patch v2.1: an investor completes exactly one statement, never both. */
const OTHER_KIND: Record<StatementKind, StatementKind> = { hnw: "scsi", scsi: "hnw" };
const isKind = (v: unknown): v is StatementKind => v === "hnw" || v === "scsi";
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;


const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");
const isAnswer = (v: unknown): v is "yes" | "no" => v === "yes" || v === "no";
const num = (v: unknown): number | null => {
  const n = typeof v === "number" ? v : Number(str(v).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : null;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function declarationIds(kind: StatementKind): string[] {
  const def = getStatement(CURRENT_STATEMENT_VERSION[kind]);
  return def.blocks.filter((b) => b.type === "declaration").map((b) => b.id);
}

interface KindResult {
  criteria: string[];
  reasons: string[];
  income_band: number | null;
  net_assets_band: number | null;
}

function validateKind(kind: StatementKind, raw: any): KindResult {
  const reasons: string[] = [];
  const criteria: string[] = [];
  const answers = raw ?? {};
  const conditions = kind === "hnw" ? HNW_CONDITIONS : SCSI_CONDITIONS;
  let income_band: number | null = null;
  let net_assets_band: number | null = null;

  let unanswered = false;
  for (const letter of conditions) {
    const value: Answer = answers[letter] ?? null;
    if (!isAnswer(value)) {
      unanswered = true;
      continue;
    }
    if (value === "yes") criteria.push(letter);
  }
  if (unanswered) reasons.push(REASONS.UNANSWERED_CONDITION);

  const noneApply = answers.none === true;
  if (noneApply && criteria.length > 0) reasons.push(REASONS.CONTRADICTION);
  if (noneApply && criteria.length === 0) reasons.push(REASONS.NONE_APPLY_SELECTED);
  if (!noneApply && !unanswered && criteria.length === 0) {
    reasons.push(REASONS.ALL_CONDITIONS_NO);
  }

  // Detail fields are required wherever the answer is Yes.
  const requireText = (v: unknown) => {
    if (str(v).length === 0) reasons.push(REASONS.MISSING_DETAIL);
  };

  if (kind === "hnw") {
    if (criteria.includes("A")) {
      const v = num(answers.A_income);
      if (v === null || v <= 0 || v % 10000 !== 0) reasons.push(REASONS.MISSING_DETAIL);
      else income_band = Math.trunc(v);
    }
    if (criteria.includes("B")) {
      const v = num(answers.B_net_assets);
      // Banded to £50,000 steps so the statutory £250,000 threshold is expressible.
      if (v === null || v <= 0 || v % 50000 !== 0) reasons.push(REASONS.MISSING_DETAIL);
      else net_assets_band = Math.trunc(v);
    }
  } else {
    if (criteria.includes("A")) requireText(answers.A_organisation);
    if (criteria.includes("B")) {
      requireText(answers.B_company_name);
      requireText(answers.B_company_number);
      requireText(answers.B_jurisdiction);
    }
    if (criteria.includes("C")) {
      const v = num(answers.C_investment_count);
      if (v === null || v < 2 || !Number.isInteger(v)) reasons.push(REASONS.MISSING_DETAIL);
    }
    if (criteria.includes("D")) requireText(answers.D_network_name);
  }

  return { criteria, reasons, income_band, net_assets_band };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } },
  );

  const forwarded = req.headers.get("x-forwarded-for") ?? "";
  const ip = forwarded.split(",")[0].trim() || null;
  const userAgent = req.headers.get("user-agent") ?? null;

  let body: any;
  try {
    body = await req.json();
  } catch {
    body = null;
  }

  const contact = body?.contact ?? {};
  const fullName = str(contact.fullName);
  const email = str(contact.email).toLowerCase();
  const phone = str(contact.phone) || null;

  // Patch v2.1: a submission carries exactly one route. Legacy `kinds` arrays are
  // still read, but anything other than a single valid kind is an invalid payload.
  const kindsRaw: unknown[] = Array.isArray(body?.kinds)
    ? body.kinds
    : body?.kind !== undefined
      ? [body.kind]
      : [];
  const kind: StatementKind | null =
    kindsRaw.length === 1 && isKind(kindsRaw[0]) ? kindsRaw[0] : null;
  const kinds: StatementKind[] = kind ? [kind] : [];

  const declinedRaw: unknown[] = Array.isArray(body?.declinedKinds) ? body.declinedKinds : [];
  const declinedKinds = [...new Set(declinedRaw.filter(isKind))];
  const attemptGroupId = UUID_RE.test(str(body?.attemptGroupId))
    ? str(body?.attemptGroupId)
    : crypto.randomUUID();

  const reasons = new Set<string>();
  if (!body || typeof body !== "object") reasons.add(REASONS.INVALID_PAYLOAD);
  // More than one kind, an unknown kind, or more declines than routes exist.
  if (kindsRaw.length > 1 || (kindsRaw.length === 1 && !kind)) {
    reasons.add(REASONS.INVALID_PAYLOAD);
  }
  if (declinedKinds.length > 1) reasons.add(REASONS.INVALID_PAYLOAD);
  // "The first statement can't be revised": a route already declared as
  // not-applicable may never be re-submitted with answers.
  if (kind && declinedKinds.includes(kind)) reasons.add(REASONS.INVALID_PAYLOAD);

  const writeAttempt = async (
    outcome: "rejected" | "route_declined",
    codes: string[],
    declinedKind: StatementKind | null,
  ) => {
    await supabase.from("certification_attempts").insert({
      email: email || null,
      full_name: fullName || null,
      outcome,
      reason_codes: codes,
      requested_kinds: kinds,
      answers: body?.answers ?? null,
      attempt_group_id: attemptGroupId,
      declined_kind: declinedKind,
      ip_address: ip,
      user_agent: userAgent,
    });
  };

  const recordAttempt = async (codes: string[], status: number) => {
    await writeAttempt("rejected", codes, null);
    console.log("eligibility submission rejected", { codes, status });
    return new Response(JSON.stringify({ ok: false, reasons: codes, attemptGroupId }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  };


  // ---- rate limiting (15 minute window) -----------------------------------
  // Per email is tight; per IP is deliberately looser so shared/NAT addresses
  // (offices, mobile networks) do not lock out genuine applicants.
  const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const countAttempts = async (column: "email" | "ip_address", value: string) => {
    const { count } = await supabase
      .from("certification_attempts")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since)
      // submission attempts only, not token/re-issue events
      .in("outcome", ["rejected", "route_declined"])
      .eq(column, value);
    return count ?? 0;
  };
  if (email && (await countAttempts("email", email)) >= 5) {
    return await recordAttempt([REASONS.RATE_LIMITED], 429);
  }
  if (ip && (await countAttempts("ip_address", ip)) >= 60) {
    return await recordAttempt([REASONS.RATE_LIMITED], 429);
  }


  // ---- contact + consent --------------------------------------------------
  if (fullName.length === 0 || fullName.length > 120) reasons.add(REASONS.CONTACT_INVALID);
  if (!EMAIL_RE.test(email) || email.length > 255) reasons.add(REASONS.CONTACT_INVALID);

  const privacy = body?.privacy ?? {};
  const privacyVersion = str(privacy.version);
  if (privacy.acknowledged !== true || privacyVersion.length === 0) {
    reasons.add(REASONS.PRIVACY_NOT_ACKNOWLEDGED);
  } else {
    const { data: versionRow } = await supabase
      .from("privacy_notice_versions")
      .select("version")
      .eq("version", privacyVersion)
      .maybeSingle();
    if (!versionRow) reasons.add(REASONS.PRIVACY_NOT_ACKNOWLEDGED);
  }

  // ---- route selection (patch v2.1) ---------------------------------------
  // Declaring "none of these conditions apply to me" on a route is a formal
  // declaration, not a rejection. The first time it happens we offer the other
  // route once; the second time there is nothing left to offer.
  const noneApply = body?.noneApply === true;

  if (!kind) reasons.add(REASONS.NO_KIND_SELECTED);


  if (noneApply && kind && reasons.size === 0) {
    const alternative = OTHER_KIND[kind];
    if (declinedKinds.includes(alternative)) {
      await writeAttempt(
        "rejected",
        [REASONS.BOTH_ROUTES_DECLINED],
        kind,
      );
      console.log("eligibility both routes declined", { attemptGroupId });
      return new Response(
        JSON.stringify({
          ok: false,
          reasons: [REASONS.BOTH_ROUTES_DECLINED],
          attemptGroupId,
        }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } },

      );
    }

    await writeAttempt("route_declined", [REASONS.NONE_APPLY_SELECTED], kind);
    console.log("eligibility route declined", { attemptGroupId });
    return new Response(
      JSON.stringify({
        ok: false,
        routeDeclined: kind,
        offerAlternative: alternative,
        declinedKinds: [...declinedKinds, kind],
        attemptGroupId,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const perKind: Record<string, KindResult> = {};
  for (const k of kinds) {
    const result = validateKind(k, body?.answers?.[k]);
    result.reasons.forEach((r) => reasons.add(r));
    perKind[k] = result;
  }


  // ---- declarations + signature ------------------------------------------
  const declarations = body?.declarations ?? {};
  for (const kind of kinds) {
    for (const id of declarationIds(kind)) {
      const entry = declarations?.[kind]?.[id];
      if (entry?.accepted !== true || !str(entry?.at)) {
        reasons.add(REASONS.DECLARATIONS_INCOMPLETE);
      }
    }
  }

  const signature = str(body?.signatureTyped);
  const declaredFullName = str(body?.declaredFullName) || fullName;
  if (signature.length === 0 || signature.length > 120) reasons.add(REASONS.SIGNATURE_MISSING);

  if (reasons.size > 0) return await recordAttempt([...reasons], 422);

  // ---- accepted: write the record ----------------------------------------
  const signedAt = new Date().toISOString(); // server clock; client value ignored

  try {
    // contact upsert (case-insensitive on email)
    const { data: existing } = await supabase
      .from("contacts")
      .select("id, contact_type, marketing_opt_in, marketing_opt_in_at")
      .ilike("email", email)
      .maybeSingle();

    const marketingOptIn = body?.marketingOptIn === true;
    let contactId: string;

    if (existing) {
      const types = new Set<string>([...(existing.contact_type ?? []), "investor"]);
      const nextOptIn = marketingOptIn || existing.marketing_opt_in === true;
      const { error } = await supabase
        .from("contacts")
        .update({
          full_name: fullName,
          phone,
          contact_type: [...types],
          marketing_opt_in: nextOptIn,
          marketing_opt_in_at: nextOptIn
            ? existing.marketing_opt_in_at ?? signedAt
            : null,
          privacy_notice_version: privacyVersion,
        })
        .eq("id", existing.id);
      if (error) throw error;
      contactId = existing.id;
    } else {
      const { data, error } = await supabase
        .from("contacts")
        .insert({
          full_name: fullName,
          email,
          phone,
          contact_type: ["investor"],
          marketing_opt_in: marketingOptIn,
          marketing_opt_in_at: marketingOptIn ? signedAt : null,
          privacy_notice_version: privacyVersion,
        })
        .select("id")
        .single();
      if (error) throw error;
      contactId = data.id;
    }

    const statementIds: string[] = [];

    for (const kind of kinds) {
      const result = perKind[kind];
      const version = CURRENT_STATEMENT_VERSION[kind];
      const { data: statement, error } = await supabase
        .from("investor_statements")
        .insert({
          contact_id: contactId,
          statement_kind: kind,
          instrument: "FPO",
          statement_version: version,
          signed_at: signedAt,
          signature_typed: signature,
          declared_full_name: declaredFullName,
          answers: body?.answers?.[kind] ?? {},
          qualifying_criteria: result.criteria,
          declarations: declarations?.[kind] ?? {},
          statement_snapshot: renderStatementSnapshot(version),
          attempt_group_id: attemptGroupId,
          ip_address: ip,
          user_agent: userAgent,
        })
        .select("id")
        .single();
      if (error) throw error;
      statementIds.push(statement.id);

      if (kind === "hnw" && (result.income_band !== null || result.net_assets_band !== null)) {
        const { error: finError } = await supabase
          .from("investor_statement_financials")
          .insert({
            statement_id: statement.id,
            income_band: result.income_band,
            net_assets_band: result.net_assets_band,
          });
        if (finError) throw finError;
      }
    }

    console.log("eligibility submission accepted", { kinds, statements: statementIds.length });

    // ---- Slice 4: gated document delivery (feature-flagged, OFF by default) --
    // With the flag off this block is a no-op and Slice 3 behaviour is unchanged.
    let delivery: { issued: boolean; emailed: boolean } = { issued: false, emailed: false };
    try {
      if (await flagEnabled(supabase)) {
        const issued = await issueAccessToken(supabase, {
          contactId,
          statementId: statementIds[0],
        });
        if (issued.ok && issued.token) {
          const { data: document } = await supabase
            .from("documents")
            .select("id, promoter_entity_name, promoter_company_number")
            .eq("slug", issued.documentSlug!)
            .maybeSingle();
          const sent = await sendAccessEmail(supabase, {
            contactId,
            documentId: document?.id ?? null,
            tokenId: issued.tokenId ?? null,
            ip,
            userAgent,
            to: email,
            fullName,
            link: `${SITE_ORIGIN}/investors/summary?t=${issued.token}`,
            expiresAt: issued.expiresAt!,
            promoterName: document?.promoter_entity_name ?? "the promoter",
            promoterNumber: document?.promoter_company_number ?? "",
            emailType: EMAIL_TYPES.SIGNUP_JV_SUMMARY,
          });
          delivery = { issued: true, emailed: sent.sent };
          console.log("access token issued", { tokenId: issued.tokenId, emailed: sent.sent });
        } else {
          console.log("access token not issued", { reason: issued.reason });
        }
      }
    } catch (deliveryError) {
      // Delivery failure must never invalidate a valid certification.
      console.error("access delivery failed", {
        message: deliveryError instanceof Error ? deliveryError.message : "unknown error",
      });
    }

    return new Response(JSON.stringify({ ok: true, statementIds, delivery }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("eligibility submission failed", {
      message: error instanceof Error ? error.message : "unknown error",
    });
    return new Response(JSON.stringify({ ok: false, reasons: ["server_error"] }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
