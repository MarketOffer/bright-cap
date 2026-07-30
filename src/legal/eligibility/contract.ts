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
    /**
     * Field labels. Where `statutory[i]` is true the label is the prescribed
     * follow-up wording from SI 2024/301 and MUST NOT be reworded or shortened.
     */
    labels: string[];
    statutory: boolean[];
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
        labels: [
          "If yes, please specify your income (as defined above) to the nearest £10,000 in the last financial year",
        ],
        statutory: [true],
      },
    },
    {
      letter: "B",
      blockId: "hnw-b",
      detailField: {
        kind: "money100k",
        keys: ["B_net_assets"],
        labels: [
          "If yes, please specify your net assets (as defined above) to the nearest £100,000 in the last financial year",
        ],
        statutory: [true],
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
        labels: ["If yes, what is/was the name of the business/organisation?"],
        statutory: [true],
      },
    },
    {
      letter: "B",
      blockId: "scsi-b",
      detailField: {
        kind: "company",
        keys: ["B_company_name", "B_company_number", "B_jurisdiction"],
        labels: [
          "If yes, what is/was the name of the company, and its Companies House number (or international equivalent)?",
          "Companies House number (or international equivalent)",
          "Jurisdiction",
        ],
        statutory: [true, false, false],
      },
    },
    {
      letter: "C",
      blockId: "scsi-c",
      detailField: {
        kind: "integer",
        keys: ["C_investment_count"],
        labels: [
          "If yes, how many investments in unlisted companies have you made in the last two years?",
        ],
        statutory: [true],
      },
    },
    {
      letter: "D",
      blockId: "scsi-d",
      detailField: {
        kind: "text",
        keys: ["D_network_name"],
        labels: ["If yes, what is the name of the network or syndicate?"],
        statutory: [true],
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

/**
 * Patch v2.1 — neutral route selection.
 *
 * This copy appears BEFORE any statutory wording and forms no part of any
 * declaration. It must stay informative, never persuasive: do not describe either
 * route as quicker, easier or preferable. The note that the experience-based route
 * asks nothing about income or assets is a material fact and is stated plainly,
 * once, without emphasis.
 */
export const ROUTE_OPTIONS: {
  kind: StatementKind;
  title: string;
  body: string;
  bullets?: string[];
  note?: string;
}[] = [
  {
    kind: "hnw",
    title: "Based on my income or assets",
    body:
      "In the last financial year you had an annual income of £100,000 or more, or net assets of £250,000 or more (excluding your home, pension and insurance policies)",
  },
  {
    kind: "scsi",
    title: "Based on my investment or business experience",
    body: "In the last two years you:",
    bullets: [
      "worked in private equity, or in providing finance to small and medium-sized businesses",
      "were a director of a company turning over at least £1 million",
      "made two or more investments in unlisted companies",
      "were a member of a business angels network for over six months, and still are",
    ],
    note: "This route does not ask about your income or assets.",
  },
];


export const declarationIds = (kind: StatementKind): string[] =>
  getStatement(CURRENT_STATEMENT_VERSION[kind])
    .blocks.filter((block) => block.type === "declaration")
    .map((block) => block.id);

/**
 * Declarations shown alongside the conditions, on the statement step.
 *
 * Both routes keep the whole prescribed declaration block with the statement it
 * belongs to — the statutory wording is never separated from the answers it
 * relates to.
 */
export const STATEMENT_STEP_DECLARATIONS: Record<StatementKind, string[] | null> = {
  hnw: null,
  scsi: null,
};

export const statementStepDeclarationIds = (kind: StatementKind): string[] => {
  const only = STATEMENT_STEP_DECLARATIONS[kind];
  return only ?? declarationIds(kind);
};

/** Declarations moved to the Declaration step (ticked next to the signature). */
export const declarationStepDeclarationIds = (kind: StatementKind): string[] => {
  const only = STATEMENT_STEP_DECLARATIONS[kind];
  if (!only) return [];
  return declarationIds(kind).filter((id) => !only.includes(id));
};


export const REASON_MESSAGES: Record<string, string> = {
  none_apply_selected:
    "On the information given, you do not meet the statutory conditions, so we cannot send you investment information.",
  all_conditions_no:
    "You answered No to every condition, so no statement can be made.",
  missing_detail: "A required detail is missing for a condition you answered Yes to.",
  figure_below_threshold:
    "The figure you entered is below the threshold stated in the condition you answered Yes to. A statement cannot declare both.",
  figure_not_rounded:
    "Please enter the figure rounded as the statement requires — income to the nearest £10,000, net assets to the nearest £100,000.",

  contradiction:
    "You answered Yes to a condition and also selected “None of these apply to me”.",
  unanswered_condition: "Every condition must be answered No or Yes.",
  no_kind_selected: "Please choose a basis before continuing.",
  both_routes_declined:
    "You have declared that neither basis applies to you. We cannot send you investment information, and this cannot be revised.",
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
  /** Patch v2.1: exactly one route per submission. */
  kind: StatementKind;
  noneApply: boolean;
  /** Routes already formally declared as not applicable; they may not be revisited. */
  declinedKinds: StatementKind[];
  /** Links a declined attempt to the submission that follows it. */
  attemptGroupId: string;
  answers: Record<string, Record<string, unknown>>;
  declarations: Record<string, Record<string, { accepted: boolean; at: string }>>;
  signatureTyped: string;
  declaredFullName: string;
  privacy: { acknowledged: boolean; version: string };
  marketingOptIn: boolean;
}

export interface EligibilityResponse {
  ok?: boolean;
  reasons?: string[];
  routeDeclined?: StatementKind;
  offerAlternative?: StatementKind;
  declinedKinds?: StatementKind[];
  attemptGroupId?: string;
}

/** Kept in sync manually with `privacy_notice_versions`. */
export const PRIVACY_NOTICE_VERSION = "2026-07-29-v1";

