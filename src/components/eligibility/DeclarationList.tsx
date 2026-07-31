import { useEffect, type ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CURRENT_STATEMENT_VERSION,
  getStatement,
  type Segment,
  type StatementKind,
} from "@/legal/statements/statementDefinitions";

/**
 * ============================================================================
 * LEGISLATIVE COPY — DO NOT EDIT.
 *
 * The declaration wording rendered here is prescribed verbatim by the Financial
 * Services and Markets Act 2000 (Financial Promotion) Order 2005, as amended by
 * SI 2024/301. Do not reword, shorten, re-punctuate, re-order or restyle it.
 * Only the tick controls around it are ours to change.
 * ============================================================================
 *
 * Renders a subset of the prescribed declarations as tickable statements.
 *
 * The statutory wording is taken verbatim from the frozen definitions and is
 * never reworded here. Only the tick controls are added.
 */

const renderSegments = (segments: Segment[]): ReactNode =>
  segments.map((segment, index) => {
    if (segment.type === "strong") return <strong key={index}>{segment.value}</strong>;
    if (segment.type === "underline") return <u key={index}>{segment.value}</u>;
    return <span key={index}>{segment.value}</span>;
  });

interface Props {
  kind: StatementKind;
  ids: string[];
  declarations: Record<string, { accepted: boolean; at: string }>;
  onDeclaration: (id: string, accepted: boolean) => void;
  /** Accept the implicit "I understand that this means:" lead-in when shown. */
  autoAcceptLeadIn?: boolean;
}

const DeclarationList = ({
  kind,
  ids,
  declarations,
  onDeclaration,
  autoAcceptLeadIn = true,
}: Props) => {
  const definition = getStatement(CURRENT_STATEMENT_VERSION[kind]);

  /** The "I understand that this means:" lead-in carries no tick; accept it implicitly. */
  const understandId = ids.find((id) => id.endsWith("-understand"));
  const understandAccepted = understandId
    ? declarations[understandId]?.accepted === true
    : true;
  useEffect(() => {
    if (autoAcceptLeadIn && understandId && !understandAccepted) {
      onDeclaration(understandId, true);
    }
  }, [autoAcceptLeadIn, understandId, understandAccepted, onDeclaration]);

  return (
    <>
      {ids.map((id) => {
        const block = definition.blocks.find((candidate) => candidate.id === id);
        if (!block || block.type !== "declaration") return null;

        /**
         * "I understand that this means:" is a prescribed lead-in to the lettered
         * sub-points, not a separate declaration — shown as text, accepted implicitly.
         */
        if (id.endsWith("-understand")) {
          return (
            <p key={id} className="font-sans text-sm leading-relaxed text-statutory">
              {renderSegments(block.segments)}
            </p>
          );
        }

        const isSubPoint = id.endsWith("-understand-b");

        return (
          <label
            key={id}
            className={`flex cursor-pointer items-start gap-3 font-sans text-sm leading-relaxed text-statutory${
              isSubPoint ? " -mt-2" : ""
            }`}
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
    </>
  );
};

export default DeclarationList;
