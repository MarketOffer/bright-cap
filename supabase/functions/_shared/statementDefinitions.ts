/**
 * FROZEN STATUTORY CONTENT — DO NOT EDIT.
 *
 * Transcribed from the Financial Services and Markets Act 2000 (Financial Promotion)
 * (Amendment) Order 2024 (SI 2024/301), Schedules 3 and 4, which replace Schedule 5
 * Parts 1 and 2 of the FPO 2005.
 *
 * Bold and underline in this file are CONTENT, not style. Article 48(3) forgives
 * formatting defects only where the bold words remain bold. Never substitute a
 * Tailwind class for a `strong` / `underline` segment.
 *
 * Corrections or updates must be ADDITIVE: add a new `statement_version` key.
 * Never edit an existing version — persisted certifications reference these bytes.
 */

export type StatementVersion =
  | "FPO_SCH5_PT1_SI2024-301"
  | "FPO_SCH5_PT2_SI2024-301";

export type StatementKind = "hnw" | "scsi";

/** A run of statement text. `strong` and `underline` are legally load-bearing. */
export type Segment =
  | { type: "text"; value: string }
  | { type: "strong"; value: string }
  | { type: "underline"; value: string };

export type Block =
  | { type: "paragraph"; id: string; segments: Segment[] }
  | { type: "lead"; id: string; segments: Segment[] }
  | {
      type: "condition";
      id: string;
      /** "A)", "B)" … rendered as part of the condition line. */
      letter: string;
      segments: Segment[];
      options: string[];
      followUp?: Segment[];
    }
  | { type: "connector"; id: string; value: string }
  | { type: "rule"; id: string }
  | { type: "declaration"; id: string; segments: Segment[] }
  | { type: "signature"; id: string; value: string };

export interface StatementDefinition {
  version: StatementVersion;
  kind: StatementKind;
  source: string;
  title: string;
  blocks: Block[];
}

const t = (value: string): Segment => ({ type: "text", value });
const b = (value: string): Segment => ({ type: "strong", value });
const u = (value: string): Segment => ({ type: "underline", value });

const HNW: StatementDefinition = {
  version: "FPO_SCH5_PT1_SI2024-301",
  kind: "hnw",
  source: "SI 2024/301 Sch 3 (FPO 2005 Sch 5 Pt 1)",
  title: "HIGH NET WORTH INDIVIDUAL INVESTOR STATEMENT",
  blocks: [
    {
      type: "lead",
      id: "hnw-lead",
      segments: [
        t("If you meet "),
        b("condition A or B below"),
        t(
          ", you may choose to be classified as a high net worth individual for the purposes of the Financial Services and Markets Act 2000 (Financial Promotion) Order 2005."
        ),
      ],
    },
    {
      type: "paragraph",
      id: "hnw-prompt",
      segments: [t("In the last financial year, did you have:")],
    },
    {
      type: "condition",
      id: "hnw-a",
      letter: "A)",
      segments: [
        t("An annual "),
        b("income of £100,000 or more"),
        t("? Income does "),
        u("NOT"),
        t(" include any one-off pension withdrawals."),
      ],
      options: ["No", "Yes"],
      followUp: [
        t(
          "If yes, please specify your income (as defined above) to the nearest £10,000 in the last financial year [£________]"
        ),
      ],
    },
    { type: "connector", id: "hnw-connector-1", value: "AND/OR" },
    {
      type: "condition",
      id: "hnw-b",
      letter: "B)",
      segments: [
        b("Net assets of £250,000 or more"),
        t("? Net assets do "),
        u("NOT"),
        t(
          " include: your home (primary residence), any loan secured on it or any equity released from it; your pension (or any pension withdrawals) or any rights under insurance contracts. Net assets are total assets minus any debts you owe."
        ),
      ],
      options: ["No", "Yes"],
      followUp: [
        t(
          "If yes, please specify your net assets (as defined above) to the nearest £100,000 in the last financial year [£________]"
        ),
      ],
    },
    { type: "connector", id: "hnw-connector-2", value: "OR" },
    {
      type: "condition",
      id: "hnw-c",
      letter: "C)",
      segments: [t("None of these apply to me.")],
      options: ["Yes"],
    },
    { type: "rule", id: "hnw-rule" },
    {
      type: "declaration",
      id: "hnw-declaration",
      segments: [
        t(
          "I declare that I have answered yes to A and/or B, and wish to be treated as a high net worth individual."
        ),
      ],
    },
    {
      type: "declaration",
      id: "hnw-understand",
      segments: [t("I understand that this means:")],
    },
    {
      type: "declaration",
      id: "hnw-understand-a",
      segments: [
        t(
          "a) I can receive financial promotions where the contents may not comply with rules made by the Financial Conduct Authority (FCA);"
        ),
      ],
    },
    {
      type: "declaration",
      id: "hnw-understand-b",
      segments: [
        t("b) I can expect "),
        b("no protection"),
        t(
          " from the FCA, the Financial Ombudsman Service or the Financial Services Compensation Scheme."
        ),
      ],
    },
    {
      type: "declaration",
      id: "hnw-advice",
      segments: [
        t(
          "I am aware that it is open to me to seek advice from someone who specialises in advising on investments."
        ),
      ],
    },
    {
      type: "declaration",
      id: "hnw-loss",
      segments: [b("I accept that I could lose all of the money I invest.")],
    },
    {
      type: "signature",
      id: "hnw-signature",
      value: "Signature ______________________ Date ______________",
    },
  ],
};

const SCSI: StatementDefinition = {
  version: "FPO_SCH5_PT2_SI2024-301",
  kind: "scsi",
  source: "SI 2024/301 Sch 4 (FPO 2005 Sch 5 Pt 2)",
  title: "SELF-CERTIFIED SOPHISTICATED INVESTOR STATEMENT",
  blocks: [
    {
      type: "lead",
      id: "scsi-lead",
      segments: [
        t("If you meet "),
        b("condition A, B, C or D below"),
        t(
          ", you may choose to be classified as a self-certified sophisticated investor for the purposes of the Financial Services and Markets Act 2000 (Financial Promotion) Order 2005."
        ),
      ],
    },
    { type: "paragraph", id: "scsi-prompt", segments: [t("Have you:")] },
    {
      type: "condition",
      id: "scsi-a",
      letter: "A)",
      // NOTE: Sch 4 does NOT bold "£1 million". Do not normalise against Sch 3.
      segments: [
        t(
          "Worked in a professional capacity in the private equity sector, or in the provision of finance for small and medium enterprises, in the last two years?"
        ),
      ],
      options: ["No", "Yes"],
      followUp: [
        t("If yes, what is/was the name of the business/organisation? [________]"),
      ],
    },
    {
      type: "condition",
      id: "scsi-b",
      letter: "B)",
      segments: [
        t(
          "Been the director of a company with an annual turnover of at least £1 million, in the last two years?"
        ),
      ],
      options: ["No", "Yes"],
      followUp: [
        t(
          "If yes, what is/was the name of the company, and its Companies House number (or international equivalent)? [________]"
        ),
      ],
    },
    {
      type: "condition",
      id: "scsi-c",
      letter: "C)",
      segments: [
        t("Made two or more investments in an unlisted company, in the last two years?"),
      ],
      options: ["No", "Yes"],
      followUp: [
        t(
          "If yes, how many investments in unlisted companies have you made in the last two years? [________]"
        ),
      ],
    },
    {
      type: "condition",
      id: "scsi-d",
      letter: "D)",
      segments: [
        t(
          "Been a member of a network or syndicate of business angels for more than six months, and are still a member?"
        ),
      ],
      options: ["No", "Yes"],
      followUp: [t("If yes, what is the name of the network or syndicate? [________]")],
    },
    { type: "connector", id: "scsi-connector-1", value: "OR" },
    {
      type: "condition",
      id: "scsi-e",
      letter: "E)",
      segments: [t("None of these apply to me.")],
      options: ["Yes"],
    },
    { type: "rule", id: "scsi-rule" },
    {
      type: "declaration",
      id: "scsi-declaration",
      segments: [
        t(
          "I declare that I have answered yes to A and/or B and/or C and/or D, and wish to be treated as a self-certified sophisticated investor."
        ),
      ],
    },
    {
      type: "declaration",
      id: "scsi-understand",
      segments: [t("I understand that this means:")],
    },
    {
      type: "declaration",
      id: "scsi-understand-a",
      segments: [
        t(
          "a) I can receive financial promotions where the contents may not comply with rules made by the Financial Conduct Authority (FCA);"
        ),
      ],
    },
    {
      type: "declaration",
      id: "scsi-understand-b",
      segments: [
        t("b) I can expect "),
        b("no protection"),
        t(
          " from the FCA, the Financial Ombudsman Service, or the Financial Services Compensation Scheme."
        ),
      ],
    },
    {
      type: "declaration",
      id: "scsi-advice",
      segments: [
        t(
          "I am aware that it is open to me to seek advice from someone who specialises in advising on investments."
        ),
      ],
    },
    {
      type: "declaration",
      id: "scsi-loss",
      segments: [b("I accept that I could lose all of the money I invest.")],
    },
    {
      type: "signature",
      id: "scsi-signature",
      value: "Signature ______________________ Date ______________",
    },
  ],
};

export const STATEMENTS: Readonly<Record<StatementVersion, StatementDefinition>> =
  Object.freeze({
    "FPO_SCH5_PT1_SI2024-301": HNW,
    "FPO_SCH5_PT2_SI2024-301": SCSI,
  });

export const CURRENT_STATEMENT_VERSION: Record<StatementKind, StatementVersion> = {
  hnw: "FPO_SCH5_PT1_SI2024-301",
  scsi: "FPO_SCH5_PT2_SI2024-301",
};

export const getStatement = (version: StatementVersion): StatementDefinition =>
  STATEMENTS[version];

/** Plain-text rendering of a segment run, used by the text-diff test. */
export const segmentsToText = (segments: Segment[]): string =>
  segments.map((s) => s.value).join("");
