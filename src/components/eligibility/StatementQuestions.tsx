import { type ReactNode } from "react";
import { MoneyInput } from "@/components/eligibility/MoneyInput";
import DeclarationList from "@/components/eligibility/DeclarationList";
import {
  CURRENT_STATEMENT_VERSION,
  getStatement,
  type Segment,
  type StatementKind,
} from "@/legal/statements/statementDefinitions";
import {
  CONDITIONS,
  JURISDICTIONS,
  statementStepDeclarationIds,
  type Answer,
} from "@/legal/eligibility/contract";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


/**
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
  /** Signature and date fields, rendered inside the declaration block. */
  children?: ReactNode;
}

const StatementQuestions = ({
  kind,
  answers,
  onAnswers,
  declarations,
  onDeclaration,
  children,
}: Props) => {
  const definition = getStatement(CURRENT_STATEMENT_VERSION[kind]);
  const specs = CONDITIONS[kind];
  const declarationTitle = definition.title.replace(/STATEMENT$/i, "DECLARATION");
  const set = (key: string, value: unknown) => onAnswers({ ...answers, [key]: value });

  /**
   * Display-only derivation. When every condition is answered No the individual
   * No selections are shown as cleared and the "None of these apply to me" box is
   * shown as ticked — the underlying answers remain "no" and are persisted as such.
   */
  const allNo =
    specs.length > 0 && specs.every((spec) => (answers[spec.letter] as Answer) === "no");
  const anyYes = specs.some((spec) => (answers[spec.letter] as Answer) === "yes");



  /** Removes every condition answer and its supporting detail figures. */
  const clearConditions = (none: boolean) => {
    const next = { ...answers };
    specs.forEach((spec) => {
      delete next[spec.letter];
      spec.detailField?.keys.forEach((key) => {
        delete next[key];
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
            <div key={spec.letter} className="space-y-8">
              {connector && connector.type === "connector" && (
                <p className="font-sans text-sm font-semibold uppercase tracking-widest text-statutory">
                  {connector.value}
                </p>
              )}
              <fieldset className="space-y-3">
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
                        onChange={(event) =>
                          set(spec.letter, event.target.checked ? option : undefined)
                        }
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

                    {detail.keys.map((key, index) => {
                      const label = detail.labels[index];
                      const isStatutory = detail.statutory[index] === true;
                      const labelClass = isStatutory
                        ? "font-sans text-xs normal-case tracking-normal text-statutory"
                        : "font-sans text-xs normal-case tracking-normal text-muted-foreground";
                      const inputId = `${kind}-${key}`;
                      if (key === "B_jurisdiction") {
                        return (
                          <div key={key} className="space-y-1.5">
                            <Label htmlFor={inputId} className={labelClass}>
                              {label}
                            </Label>

                            <select
                              id={inputId}
                              value={(answers[key] as string) ?? ""}
                              onChange={(event) => set(key, event.target.value)}
                              className="h-10 w-full border border-input bg-background px-3 font-sans text-sm text-foreground"
                            >
                              <option value="">Select…</option>
                              {JURISDICTIONS.map((jurisdiction) => (
                                <option key={jurisdiction} value={jurisdiction}>
                                  {jurisdiction}
                                </option>
                              ))}
                            </select>
                          </div>
                        );
                      }
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
                              onChange={(next) => set(key, next)}
                            />
                          ) : (
                            <Input
                              id={inputId}
                              type={numeric ? "number" : "text"}
                              inputMode={numeric ? "numeric" : "text"}
                              onWheel={(event) => (event.target as HTMLInputElement).blur()}
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
                  </div>
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

        <fieldset className="space-y-3">
          <legend className="font-sans leading-relaxed text-statutory">
            {noneBlock && noneBlock.type === "condition"
              ? `${noneBlock.letter} ${noneBlock.segments.map((s) => s.value).join("")}`
              : "None of these apply to me."}
          </legend>
          <div className="flex gap-6 pt-1">
            <label className="flex cursor-pointer items-center gap-2 font-sans text-sm text-statutory">
              <input
                type="radio"
                name="none-apply"
                checked={allNo || answers.none === true}
                onChange={() => {
                  /* Selecting "none apply" wipes any answers or figures given for A and B. */
                  clearConditions(true);
                }}
                onClick={() => {
                  if (allNo || answers.none === true) {
                    /* Clicking the selected option again clears it. */
                    if (allNo) clearConditions(false);
                    else set("none", false);
                  }
                }}
                className="h-4 w-4 accent-primary"
              />
              Yes
            </label>
          </div>
        </fieldset>
      </div>

      <div className={anyYes ? "space-y-4 border-t border-border pt-6" : "hidden"}>
        <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-statutory">
          {declarationTitle}
        </h3>
        <DeclarationList
          kind={kind}
          ids={statementStepDeclarationIds(kind)}
          declarations={declarations}
          onDeclaration={onDeclaration}
          autoAcceptLeadIn={anyYes}
        />
        {children}
      </div>

    </section>
  );
};

export default StatementQuestions;
