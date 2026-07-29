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
 */

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const renderSegment = (segment: Segment): string => {
  const value = escapeHtml(segment.value);
  if (segment.type === "strong") return `<strong>${value}</strong>`;
  if (segment.type === "underline") return `<u>${value}</u>`;
  return value;
};

const renderSegments = (segments: Segment[]): string =>
  segments.map(renderSegment).join("");

const renderBlock = (block: Block): string => {
  switch (block.type) {
    case "lead":
    case "paragraph":
      return `<p data-block="${block.id}">${renderSegments(block.segments)}</p>`;
    case "condition": {
      const options = block.options
        .map((option) => `<li>&#9744; ${escapeHtml(option)}</li>`)
        .join("");
      const followUp = block.followUp
        ? `<p data-follow-up="${block.id}">${renderSegments(block.followUp)}</p>`
        : "";
      return (
        `<div data-block="${block.id}">` +
        `<p>${escapeHtml(block.letter)} ${renderSegments(block.segments)}</p>` +
        `<ul>${options}</ul>` +
        followUp +
        `</div>`
      );
    }
    case "connector":
      return `<p data-block="${block.id}">${escapeHtml(block.value)}</p>`;
    case "rule":
      return `<hr data-block="${block.id}">`;
    case "declaration":
      return `<p data-block="${block.id}">${renderSegments(block.segments)}</p>`;
    case "signature":
      return `<p data-block="${block.id}">${escapeHtml(block.value)}</p>`;
  }
};

export const renderStatementSnapshot = (version: StatementVersion): string => {
  const statement = getStatement(version);
  return (
    `<section data-statement-version="${statement.version}">` +
    `<h2>${escapeHtml(statement.title)}</h2>` +
    statement.blocks.map(renderBlock).join("") +
    `</section>`
  );
};
