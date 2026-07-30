import {
  getStatement,
  type Block,
  type Segment,
  type StatementVersion,
} from "./statementDefinitions.ts";

/**
 * Produces the exact HTML string persisted to `investor_statements.statement_snapshot`.
 *
 * Deterministic and style-free: no classes, no whitespace between tags. The output is
 * the evidential record of what the certifier was shown, so it must be reproducible
 * byte-for-byte from the frozen definition alone.
 *
 * When a `completion` is supplied the snapshot is the COMPLETE signed record: every
 * condition with its exclusions, the answer given to each (ticked boxes), the figures
 * or detail supplied, all declarations with their acceptance, and the typed signature
 * and date. Bold and underline are preserved because they are legally load-bearing.
 */

export interface StatementCompletion {
  /** Raw answers for this kind, e.g. { A: "yes", B: "no", none: false, A_income: 110000 }. */
  answers: Record<string, unknown>;
  /** Declaration acceptances keyed by block id. */
  declarations: Record<string, { accepted?: boolean; at?: string } | undefined>;
  signatureTyped: string;
  declaredFullName: string;
  /** ISO timestamp set server-side at submission. */
  signedAt: string;
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const TICKED = "&#9746;"; // ballot box with X
const EMPTY = "&#9744;"; // empty ballot box

const renderSegment = (segment: Segment): string => {
  const value = escapeHtml(segment.value);
  if (segment.type === "strong") return `<strong>${value}</strong>`;
  if (segment.type === "underline") return `<u>${value}</u>`;
  return value;
};

const renderSegments = (segments: Segment[]): string =>
  segments.map(renderSegment).join("");

const groupDigits = (value: number): string => {
  const sign = value < 0 ? "-" : "";
  const digits = Math.abs(Math.trunc(value)).toString();
  return sign + digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const MONEY_KEYS = new Set(["A_income", "B_net_assets"]);

const DETAIL_LABELS: Record<string, string> = {
  A_income: "Annual income",
  B_net_assets: "Net assets",
  A_organisation: "Organisation",
  B_company_name: "Company name",
  B_company_number: "Company number",
  C_investment_count: "Number of investments",
  D_network_name: "Network or syndicate",
};

const formatDetail = (key: string, value: unknown): string => {
  if (MONEY_KEYS.has(key) && typeof value === "number") {
    return `£${groupDigits(value)}`;
  }
  return String(value);
};

/** "A)" -> "A" */
const letterKey = (letter: string): string => letter.replace(/[^A-Za-z]/g, "");

const formatSignedAt = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return escapeHtml(iso);
  return date.toISOString().replace("T", " ").replace(/\.\d{3}Z$/, " UTC");
};

const renderBlock = (block: Block, completion?: StatementCompletion): string => {
  switch (block.type) {
    case "lead":
    case "paragraph":
      return `<p data-block="${block.id}">${renderSegments(block.segments)}</p>`;
    case "condition": {
      const key = letterKey(block.letter);
      const answers = completion?.answers ?? {};
      // A condition offering only "Yes" is the "none of these apply" declaration.
      const isNoneApply = block.options.length === 1 && block.options[0] === "Yes";
      const answer = isNoneApply
        ? answers.none === true
          ? "Yes"
          : null
        : answers[key] === "yes"
          ? "Yes"
          : answers[key] === "no"
            ? "No"
            : null;

      const options = block.options
        .map((option) => {
          const ticked = completion && answer === option;
          if (!completion) return `<li>${EMPTY} ${escapeHtml(option)}</li>`;
          return `<li data-answer="${escapeHtml(option)}"${
            ticked ? ' data-selected="true"' : ""
          }>${ticked ? TICKED : EMPTY} ${escapeHtml(option)}</li>`;
        })
        .join("");

      const followUp = block.followUp
        ? `<p data-follow-up="${block.id}">${renderSegments(block.followUp)}</p>`
        : "";

      // Detail supplied against this condition (figures, names, counts).
      const details = completion
        ? Object.keys(answers)
            .filter((k) => k.startsWith(`${key}_`))
            .filter((k) => {
              const v = answers[k];
              return v !== null && v !== undefined && v !== "";
            })
            .sort()
            .map(
              (k) =>
                `<p data-detail="${escapeHtml(k)}">${escapeHtml(
                  DETAIL_LABELS[k] ?? k,
                )}: <strong>${escapeHtml(formatDetail(k, answers[k]))}</strong></p>`,
            )
            .join("")
        : "";

      return (
        `<div data-block="${block.id}">` +
        `<p>${escapeHtml(block.letter)} ${renderSegments(block.segments)}</p>` +
        `<ul>${options}</ul>` +
        followUp +
        details +
        `</div>`
      );
    }
    case "connector":
      return `<p data-block="${block.id}">${escapeHtml(block.value)}</p>`;
    case "rule":
      return `<hr data-block="${block.id}">`;
    case "declaration": {
      const entry = completion?.declarations?.[block.id];
      const mark = completion
        ? `${entry?.accepted === true ? TICKED : EMPTY} `
        : "";
      const at = completion && entry?.at ? ` <span data-accepted-at="${escapeHtml(entry.at)}"></span>` : "";
      return `<p data-block="${block.id}"${
        completion ? ` data-accepted="${entry?.accepted === true}"` : ""
      }>${mark}${renderSegments(block.segments)}${at}</p>`;
    }
    case "signature": {
      if (!completion) return `<p data-block="${block.id}">${escapeHtml(block.value)}</p>`;
      return (
        `<p data-block="${block.id}">Signature <strong>${escapeHtml(
          completion.signatureTyped,
        )}</strong> Date <strong>${formatSignedAt(completion.signedAt)}</strong></p>` +
        `<p data-block="${block.id}-name">Full name as declared: <strong>${escapeHtml(
          completion.declaredFullName,
        )}</strong></p>`
      );
    }
  }
};

export const renderStatementSnapshot = (
  version: StatementVersion,
  completion?: StatementCompletion,
): string => {
  const statement = getStatement(version);
  return (
    `<section data-statement-version="${statement.version}">` +
    `<h2>${escapeHtml(statement.title)}</h2>` +
    statement.blocks.map((block) => renderBlock(block, completion)).join("") +
    `</section>`
  );
};
