import {
  CURRENT_STATEMENT_VERSION,
  getStatement,
  type StatementKind,
} from "@/legal/statements/statementDefinitions";

/**
 * Client-side contract for the eligibility submission.
 *
 * This validation is CONVENIENCE ONLY — `submit-eligibility` re-validates every rule
 * server-side and its verdict is authoritative.
 */

export type Answer = "yes" | "no" | null;

export type DetailKind = "text" | "money10k" | "money100k" | "integer" | "company";

export interface ConditionSpec {
  letter: string;
  blockId: string;
  detailField?: {
    kind: DetailKind;
    /** payload key(s) written into `answers[kind]` */
    keys: string[];
    labels: string[];
  };
}

export const CONDITIONS: Record<StatementKind, ConditionSpec[]> = {
  hnw: [
    {
      letter: "A",
      blockId: "hnw-a",
      detailField: {
        kind: "money10k",
        keys: ["A_income"],
        labels: ["Income, to the nearest £10,000"],
      },
    },
    {
      letter: "B",
      blockId: "hnw-b",
      detailField: {
        kind: "money100k",
        keys: ["B_net_assets"],
        labels: ["Net assets, to the nearest £50,000"],
      },
    },
  ],
  scsi: [
    {
      letter: "A",
      blockId: "scsi-a",
      detailField: {
        kind: "text",
        keys: ["A_organisation"],
        labels: ["Name of the business or organisation"],
      },
    },
    {
      letter: "B",
      blockId: "scsi-b",
      detailField: {
        kind: "company",
        keys: ["B_company_name", "B_company_number", "B_jurisdiction"],
        labels: ["Company name", "Companies House number (or equivalent)", "Jurisdiction"],
      },
    },
    {
      letter: "C",
      blockId: "scsi-c",
      detailField: {
        kind: "integer",
        keys: ["C_investment_count"],
        labels: ["Number of investments in unlisted companies"],
      },
    },
    {
      letter: "D",
      blockId: "scsi-d",
      detailField: {
        kind: "text",
        keys: ["D_network_name"],
        labels: ["Name of the network or syndicate"],
      },
    },
  ],
};

export const JURISDICTIONS = [
  "United Kingdom",
  "Ireland",
  "Guernsey",
  "Jersey",
  "Isle of Man",
  "United States",
  "Other",
] as const;

export const KIND_LABEL: Record<StatementKind, string> = {
  hnw: "High net worth individual",
  scsi: "Self-certified sophisticated investor",
};

export const declarationIds = (kind: StatementKind): string[] =>
  getStatement(CURRENT_STATEMENT_VERSION[kind])
    .blocks.filter((block) => block.type === "declaration")
    .map((block) => block.id);

export const REASON_MESSAGES: Record<string, string> = {
  none_apply_selected:
    "On the information given, you do not meet the statutory conditions, so we cannot send you investment information.",
  all_conditions_no:
    "You answered No to every condition, so no statement can be made.",
  missing_detail: "A required detail is missing for a condition you answered Yes to.",
  contradiction:
    "You answered Yes to a condition and also selected “None of these apply to me”.",
  unanswered_condition: "Every condition must be answered No or Yes.",
  no_kind_selected: "Please choose at least one statement.",
  declarations_incomplete: "Every declaration must be ticked.",
  signature_missing: "A typed signature is required.",
  contact_invalid: "Please check your name and email address.",
  privacy_not_acknowledged: "The privacy notice acknowledgement is required.",
  invalid_payload: "The submission could not be read. Please try again.",
  rate_limited: "Too many attempts. Please try again shortly.",
  server_error: "Something went wrong on our side. Please try again.",
};

export interface EligibilityPayload {
  contact: { fullName: string; email: string; phone: string };
  kinds: StatementKind[];
  noneApply: boolean;
  answers: Record<string, Record<string, unknown>>;
  declarations: Record<string, Record<string, { accepted: boolean; at: string }>>;
  signatureTyped: string;
  declaredFullName: string;
  privacy: { acknowledged: boolean; version: string };
  marketingOptIn: boolean;
}

/** Kept in sync manually with `privacy_notice_versions`. */
export const PRIVACY_NOTICE_VERSION = "2026-07-29-v1";
