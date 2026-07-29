import { type ReactNode } from "react";
import {
  CURRENT_STATEMENT_VERSION,
  getStatement,
  type Segment,
  type StatementKind,
} from "@/legal/statements/statementDefinitions";
import {
  CONDITIONS,
  JURISDICTIONS,
  declarationIds,
  type Answer,
} from "@/legal/eligibility/contract";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

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
}

const StatementQuestions = ({
  kind,
  answers,
  onAnswers,
  declarations,
  onDeclaration,
}: Props) => {
  const definition = getStatement(CURRENT_STATEMENT_VERSION[kind]);
  const specs = CONDITIONS[kind];
  const set = (key: string, value: unknown) => onAnswers({ ...answers, [key]: value });

  /**
   * Display-only derivation. When every condition is answered No the individual
   * No selections are shown as cleared and the "None of these apply to me" box is
   * shown as ticked — the underlying answers remain "no" and are persisted as such.
   */
  const allNo =
    specs.length > 0 && specs.every((spec) => (answers[spec.letter] as Answer) === "no");
  const anyYes = specs.some((spec) => (answers[spec.letter] as Answer) === "yes");

  const clearConditions = () => {
    const next = { ...answers };
    specs.forEach((spec) => {
      delete next[spec.letter];
    });
    next.none = false;
    onAnswers(next);
  };

  const conditionBlock = (blockId: string) =>
    definition.blocks.find((block) => block.id === blockId);


  return (
    <section
      className="space-y-8 border border-border p-6 md:p-8"
      aria-label={definition.title}
    >
      <header className="space-y-3">
        <h3 className="font-sans text-sm font-semibold uppercase tracking-widest text-foreground">
          {definition.title}
        </h3>
        {definition.blocks
          .filter((block) => block.type === "lead" || block.type === "paragraph")
          .map((block) => (
            <p
              key={block.id}
              className="font-sans text-sm leading-relaxed text-secondary"
            >
              {renderSegments(block.segments)}
            </p>
          ))}
      </header>

      <div className="space-y-8">
        {specs.map((spec) => {
          const block = conditionBlock(spec.blockId);
          if (!block || block.type !== "condition") return null;
          const value = (answers[spec.letter] as Answer) ?? null;
          const detail = spec.detailField;

          return (
            <fieldset key={spec.letter} className="space-y-3">
              <legend className="font-sans leading-relaxed text-foreground">
                {block.letter} {renderSegments(block.segments)}
              </legend>

              <div className="flex gap-6 pt-1">
                {(["no", "yes"] as const).map((option) => (
                  <label
                    key={option}
                    className="flex cursor-pointer items-center gap-2 font-sans text-sm text-foreground"
                  >
                    <input
                      type="radio"
                      name={`${kind}-${spec.letter}`}
                      value={option}
                      checked={!allNo && value === option}
                      onChange={() => set(spec.letter, option)}
                      className="h-4 w-4 accent-primary"
                    />
                    {option === "no" ? "No" : "Yes"}
                  </label>
                ))}
              </div>

              {value === "yes" && detail && (
                <div className="space-y-3 border-l-2 border-primary pl-4">
                  {detail.keys.map((key, index) => {
                    const label = detail.labels[index];
                    const inputId = `${kind}-${key}`;
                    if (key === "B_jurisdiction") {
                      return (
                        <div key={key} className="space-y-1.5">
                          <Label htmlFor={inputId} className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
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
                    const numeric =
                      detail.kind === "money10k" ||
                      detail.kind === "money100k" ||
                      detail.kind === "integer";
                    return (
                      <div key={key} className="space-y-1.5">
                        <Label htmlFor={inputId} className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
                          {label}
                        </Label>
                        <Input
                          id={inputId}
                          type={numeric ? "number" : "text"}
                          inputMode={numeric ? "numeric" : "text"}
                          step={
                            detail.kind === "money10k"
                              ? 10000
                              : detail.kind === "money100k"
                                ? 50000
                                : 1
                          }
                          maxLength={numeric ? undefined : 200}
                          value={(answers[key] as string | number) ?? ""}
                          onChange={(event) =>
                            set(key, numeric ? event.target.value : event.target.value.slice(0, 200))
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </fieldset>
          );
        })}

        <label className="flex cursor-pointer items-start gap-3 border-t border-border pt-6 font-sans text-sm text-foreground">
          <input
            type="checkbox"
            checked={answers.none === true}
            onChange={(event) => set("none", event.target.checked)}
            className="mt-1 h-4 w-4 accent-primary"
          />
          None of these apply to me.
        </label>
      </div>

      <div className="space-y-4 border-t border-border pt-6">
        {declarationIds(kind).map((id) => {
          const block = definition.blocks.find((candidate) => candidate.id === id);
          if (!block || block.type !== "declaration") return null;
          return (
            <label
              key={id}
              className="flex cursor-pointer items-start gap-3 font-sans text-sm leading-relaxed text-foreground"
            >
              <Checkbox
                checked={declarations[id]?.accepted === true}
                onCheckedChange={(checked) => onDeclaration(id, checked === true)}
                className="mt-1"
              />
              <span>{renderSegments(block.segments)}</span>
            </label>
          );
        })}
      </div>
    </section>
  );
};

export default StatementQuestions;
