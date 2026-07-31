import { type ReactNode } from "react";
import {
  getStatement,
  type Block,
  type Segment,
  type StatementVersion,
} from "@/legal/statements/statementDefinitions";

/**
 * ============================================================================
 * LEGISLATIVE COPY — DO NOT EDIT.
 *
 * Every string rendered by this component is wording prescribed verbatim by the
 * Financial Services and Markets Act 2000 (Financial Promotion) Order 2005, as
 * amended by SI 2024/301. It is a legal requirement that it appears exactly as
 * enacted: do not reword, shorten, re-punctuate, re-order or "tidy" it, and do
 * not change where emphasis falls. Any change must be signed off by the firm's
 * solicitor before it ships.
 *
 * The source text lives in `@/legal/statements/statementDefinitions` — that file
 * is the frozen record, and it is equally off-limits.
 * ============================================================================
 *
 * Locked renderer for the prescribed FPO statements.
 *
 * `<strong>` and `<u>` here are CONTENT, mandated by SI 2024/301. Do not replace them
 * with Tailwind utilities and do not add or remove emphasis. Snapshot tests will fail
 * loudly if a refactor strips them.
 *
 * Render-only: this component holds no form state and submits nothing (Slice 2).
 * The certifier's full name is captured OUTSIDE this component — neither prescribed
 * statement contains a name field.
 */

const renderSegment = (segment: Segment, index: number): ReactNode => {
  if (segment.type === "strong") return <strong key={index}>{segment.value}</strong>;
  if (segment.type === "underline") return <u key={index}>{segment.value}</u>;
  return <span key={index}>{segment.value}</span>;
};

const renderSegments = (segments: Segment[]): ReactNode =>
  segments.map((segment, index) => renderSegment(segment, index));

const StatementBlock = ({ block }: { block: Block }) => {
  switch (block.type) {
    case "lead":
      return (
        <p data-block={block.id} className="font-sans leading-relaxed text-statutory">
          {renderSegments(block.segments)}
        </p>
      );
    case "paragraph":
      return (
        <p data-block={block.id} className="font-sans leading-relaxed text-statutory">
          {renderSegments(block.segments)}
        </p>
      );
    case "condition":
      return (
        <div data-block={block.id} className="space-y-2">
          <p className="font-sans leading-relaxed text-statutory">
            {block.letter} {renderSegments(block.segments)}
          </p>
          <ul className="list-none space-y-1 pl-0 font-sans text-statutory">
            {block.options.map((option) => (
              <li key={option}>&#9744; {option}</li>
            ))}
          </ul>
          {block.followUp && (
            <p
              data-follow-up={block.id}
              className="font-sans leading-relaxed text-statutory"
            >
              {renderSegments(block.followUp)}
            </p>
          )}
        </div>
      );
    case "connector":
      return (
        <p
          data-block={block.id}
          className="font-sans font-semibold uppercase tracking-wide text-statutory"
        >
          {block.value}
        </p>
      );
    case "rule":
      return <hr data-block={block.id} className="border-border" />;
    case "declaration":
      return (
        <p data-block={block.id} className="font-sans leading-relaxed text-statutory">
          {renderSegments(block.segments)}
        </p>
      );
    case "signature":
      return (
        <p data-block={block.id} className="font-sans leading-relaxed text-statutory">
          {block.value}
        </p>
      );
  }
};

interface PrescribedStatementProps {
  version: StatementVersion;
}

const PrescribedStatement = ({ version }: PrescribedStatementProps) => {
  const statement = getStatement(version);

  return (
    <section
      data-statement-version={statement.version}
      aria-label={statement.title}
      className="space-y-5 rounded-sm border border-border p-6 md:p-8"
    >
      <h2 className="font-sans text-base font-semibold uppercase tracking-wide text-statutory">
        {statement.title}
      </h2>
      {statement.blocks.map((block) => (
        <StatementBlock key={block.id} block={block} />
      ))}
    </section>
  );
};

export default PrescribedStatement;
