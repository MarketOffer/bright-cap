import { type ReactNode } from "react";
import { MoneyInput, LARGE_FIGURE_THRESHOLD } from "@/components/eligibility/MoneyInput";
import DeclarationList from "@/components/eligibility/DeclarationList";
import {
  CURRENT_STATEMENT_VERSION,
  getStatement,
  type Segment,
  type StatementKind,
} from "@/legal/statements/statementDefinitions";
import {
  CONDITIONS,
  statementStepDeclarationIds,
  type Answer,
} from "@/legal/eligibility/contract";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


/**
 * ============================================================================
 * LEGISLATIVE COPY — DO NOT EDIT.
 *
 * All statement text, condition wording and declaration wording rendered here
 * is prescribed verbatim by the Financial Services and Markets Act 2000
 * (Financial Promotion) Order 2005, as amended by SI 2024/301, and is pulled
 * from the frozen definitions. Do not reword, shorten, re-punctuate or
 * re-order it, and do not alter its emphasis. Elements tagged
 * `text-statutory` carry that prescribed wording.
 *
 * Only the interactive controls (No/Yes boxes, detail inputs, tick boxes) and
 * their layout are ours to change.
 * ============================================================================
 *
 * Renders the prescribed statement as an answerable form.
 *
 * The statutory wording, bold and underline come from the frozen definitions and are
 * never restyled here. Only the controls (No/Yes, detail fields, ticks) are added.
 */

const renderSegments = (segments: Segment[]): ReactNode =>
  segments.map((segment, index) => {
    if (segment.type === "strong") return <strong key={index}>{segment.value}</strong>;
    if (segment.type === "underline") return <u key={index}>{segment.value}</u>;
    return <span key={index}>{segment.value}</span>;
  });

interface Props {
  kind: StatementKind;
  answers: Record<string, unknown>;
  onAnswers: (next: Record<string, unknown>) => void;
  declarations: Record<string, { accepted: boolean; at: string }>;
  onDeclaration: (id: string, accepted: boolean) => void;
  /**
   * Validation messages after a failed submit, keyed by anchor id
   * ("anchor-cond-A", "anchor-declarations"). Shown beside the control at fault.
   */
  errors?: Record<string, string[]>;
  /** Signature and date fields, rendered inside the declaration block. */
  children?: ReactNode;
}

/** Red helper text shown directly beneath the control it refers to. */
const FieldErrors = ({ messages }: { messages?: string[] }) =>
  messages && messages.length > 0 ? (
    <ul className="space-y-1 pt-1">
      {messages.map((message) => (
        <li key={message} className="font-sans text-sm text-destructive">
          {message}
        </li>
      ))}
    </ul>
  ) : null;

const StatementQuestions = ({
  kind,
  answers,
  onAnswers,
  declarations,
  onDeclaration,
  errors = {},
  children,
}: Props) => {
  const definition = getStatement(CURRENT_STATEMENT_VERSION[kind]);
  const specs = CONDITIONS[kind];
  const set = (key: string, value: unknown) => {
    const next = { ...answers };
    if (value === undefined) delete next[key];
    else next[key] = value;
    onAnswers(next);
  };


  /**
   * Display-only derivation. When every condition is answered No the individual
   * No selections are shown as cleared and the "None of these apply to me" box is
   * shown as ticked — the underlying answers remain "no" and are persisted as such.
   */
  const allNo =
    specs.length > 0 && specs.every((spec) => (answers[spec.letter] as Answer) === "no");
  const anyYes = specs.some((spec) => (answers[spec.letter] as Answer) === "yes");

  /**
   * SCSI only — the HNW form is unchanged. Selecting "None of these apply to me"
   * locks the lettered conditions and their detail fields; answering Yes to any
   * condition locks the "none" box, so the two can never be held at once.
   */
  const mutualLock = kind === "scsi";
  const noneSelected = allNo || answers.none === true;
  const lockConditions = mutualLock && noneSelected;
  const lockNone = mutualLock && anyYes;





  /** Removes every condition answer and its supporting detail figures. */
  const clearConditions = (none: boolean) => {
    const next = { ...answers };
    specs.forEach((spec) => {
      delete next[spec.letter];
      spec.detailField?.keys.forEach((key) => {
        delete next[key];
        delete next[`${key}_confirmed`];
      });
    });
    next.none = none;
    onAnswers(next);
  };


  const conditionBlock = (blockId: string) =>
    definition.blocks.find((block) => block.id === blockId);

  /**
   * The final "None of these apply to me" condition (C for HNW, E for SCSI) and the
   * prescribed connector that precedes it, both taken from the frozen definitions.
   */
  const noneBlockIndex = definition.blocks.findIndex(
    (block) => block.type === "condition" && !specs.some((s) => s.blockId === block.id),
  );
  const noneBlock = noneBlockIndex >= 0 ? definition.blocks[noneBlockIndex] : undefined;
  const noneConnector = definition.blocks
    .slice(0, noneBlockIndex >= 0 ? noneBlockIndex : 0)
    .reverse()
    .find((block) => block.type === "connector");

  return (
    <section
      className="space-y-8 border border-border p-6 md:p-8"
      aria-label={definition.title}
    >
      <header className="space-y-3">
        <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-statutory">
          {definition.title}
        </h3>
        {definition.blocks
          .filter((block) => block.type === "lead" || block.type === "paragraph")
          .map((block) => (
            <p
              key={block.id}
              className="font-sans text-sm leading-relaxed text-statutory"
            >
              {renderSegments(block.segments)}
            </p>
          ))}
      </header>


      <div className="space-y-8">
        {specs.map((spec, specIndex) => {
          const block = conditionBlock(spec.blockId);
          if (!block || block.type !== "condition") return null;
          const value = (answers[spec.letter] as Answer) ?? null;
          const detail = spec.detailField;

          /**
           * Prescribed connectors ("AND/OR", "OR") sit between the conditions and
           * are load-bearing: they tell the reader Yes to either or both is
           * permitted. They come from the frozen definitions, never from here.
           */
          const previousBlockId = specIndex > 0 ? specs[specIndex - 1].blockId : null;
          const previousIndex = previousBlockId
            ? definition.blocks.findIndex((candidate) => candidate.id === previousBlockId)
            : -1;
          const thisIndex = definition.blocks.findIndex(
            (candidate) => candidate.id === spec.blockId,
          );
          const connector =
            previousIndex >= 0
              ? definition.blocks
                  .slice(previousIndex + 1, thisIndex)
                  .find((candidate) => candidate.type === "connector")
              : undefined;

          return (
            <div
              key={spec.letter}
              id={`anchor-cond-${spec.letter}`}
              className="scroll-mt-28 space-y-8"
            >
              {connector && connector.type === "connector" && (
                <p className="font-sans text-sm font-semibold uppercase tracking-widest text-statutory">
                  {connector.value}
                </p>
              )}
              <fieldset
                disabled={lockConditions}
                className={`space-y-3${lockConditions ? " opacity-50" : ""}`}
              >
                <legend className="font-sans leading-relaxed text-statutory">
                  {block.letter} {renderSegments(block.segments)}
                </legend>


                <div className="flex gap-6 pt-1">
                  {(["no", "yes"] as const).map((option) => (
                    <label
                      key={option}
                      className="flex cursor-pointer items-center gap-2 font-sans text-sm text-statutory"
                    >
                      <input
                        type="checkbox"
                        name={`${kind}-${spec.letter}-${option}`}
                        value={option}
                        checked={!allNo && value === option}
                        onChange={(event) => {
                          const checked = event.target.checked;
                          const next = { ...answers };
                          if (checked) next[spec.letter] = option;
                          else delete next[spec.letter];
                          /* Answering Yes to a condition contradicts "none of these
                             apply to me", so that declaration is cleared. */
                          if (checked && option === "yes") {
                            next.none = false;
                          }
                          onAnswers(next);
                        }}
                        className="h-4 w-4 accent-primary"
                      />
                      {option === "no" ? "No" : "Yes"}
                    </label>
                  ))}
                </div>

                {detail && (
                  <fieldset
                    disabled={value !== "yes"}
                    className={`space-y-3 border-l-2 border-primary pl-4${
                      value === "yes" ? "" : " opacity-50"
                    }`}
                  >
                    {detail.prompt && (
                      <p className="font-sans text-xs normal-case tracking-normal text-statutory">
                        {detail.prompt}
                      </p>
                    )}
                    {detail.keys.map((key, index) => {
                      const label = detail.labels[index];
                      const isStatutory = detail.statutory[index] === true;
                      const labelClass = isStatutory
                        ? "font-sans text-xs normal-case tracking-normal text-statutory"
                        : "font-sans text-xs normal-case tracking-normal text-muted-foreground";
                      const inputId = `${kind}-${key}`;

                      const money =
                        detail.kind === "money10k" || detail.kind === "money100k";
                      const numeric = money || detail.kind === "integer";
                      return (
                        <div key={key} className="space-y-1.5">
                          <Label htmlFor={inputId} className={labelClass}>
                            {label}
                          </Label>
                          {money ? (
                            <MoneyInput
                              id={inputId}
                              step={detail.kind === "money10k" ? 10000 : 100000}
                              value={String((answers[key] as string | number) ?? "")}
                              confirmed={answers[`${key}_confirmed`] === true}
                              onConfirm={(next) =>
                                set(`${key}_confirmed`, next ? true : undefined)
                              }
                              onChange={(next) => {
                                /* Figures persist as integers, never formatted strings. */
                                const parsed = next === "" ? undefined : Number(next);
                                const nextAnswers = { ...answers };
                                if (parsed === undefined) delete nextAnswers[key];
                                else nextAnswers[key] = parsed;
                                if (
                                  parsed === undefined ||
                                  parsed < LARGE_FIGURE_THRESHOLD
                                ) {
                                  delete nextAnswers[`${key}_confirmed`];
                                }
                                onAnswers(nextAnswers);
                              }}
                            />
                          ) : (
                            <Input
                              id={inputId}
                              type={numeric ? "number" : "text"}
                              inputMode={numeric ? "numeric" : "text"}
                              onWheel={(event) => (event.target as HTMLInputElement).blur()}
                              className={
                                numeric
                                  ? "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                  : undefined
                              }
                              maxLength={numeric ? undefined : 200}
                              value={(answers[key] as string | number) ?? ""}
                              onChange={(event) =>
                                set(
                                  key,
                                  numeric ? event.target.value : event.target.value.slice(0, 200),
                                )
                              }
                            />
                          )}
                        </div>
                      );

                    })}
                  </fieldset>

                )}
              </fieldset>
            </div>
          );
        })}

        {/* Prescribed connector preceding the "None of these apply to me" condition. */}
        {noneConnector && noneConnector.type === "connector" && (
          <p className="font-sans text-sm font-semibold uppercase tracking-widest text-statutory">
            {noneConnector.value}
          </p>
        )}

        <fieldset
          disabled={lockNone}
          className={`space-y-3${lockNone ? " opacity-50" : ""}`}
        >
          <legend className="font-sans leading-relaxed text-statutory">
            {noneBlock && noneBlock.type === "condition"
              ? `${noneBlock.letter} ${noneBlock.segments.map((s) => s.value).join("")}`
              : "None of these apply to me."}
          </legend>
          <div className="flex gap-6 pt-1">
            <label className="flex cursor-pointer items-center gap-2 font-sans text-sm text-statutory">
              <input
                type="checkbox"
                name="none-apply"
                checked={allNo || answers.none === true}
                onChange={(event) => {
                  /* Selecting "none apply" wipes any answers or figures given for A and B. */
                  if (event.target.checked) clearConditions(true);
                  else if (allNo) clearConditions(false);
                  else set("none", false);
                }}
                className="h-4 w-4 accent-primary"
              />
              Yes
            </label>
          </div>

        </fieldset>
      </div>

      <fieldset
        id="anchor-declarations"
        disabled={!anyYes}
        className={`scroll-mt-28 space-y-4 border-t border-border pt-6${anyYes ? "" : " opacity-50"}`}
      >
        <DeclarationList
          kind={kind}
          ids={statementStepDeclarationIds(kind)}
          declarations={declarations}
          onDeclaration={onDeclaration}
          autoAcceptLeadIn={anyYes}
        />
        {children}
      </fieldset>


    </section>
  );
};

export default StatementQuestions;
