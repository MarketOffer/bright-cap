import { useState } from "react";
import { Input } from "@/components/ui/input";

interface MoneyInputProps {
  id: string;
  /** Raw digits, e.g. "150000". Empty string when unanswered. */
  value: string;
  onChange: (next: string) => void;
  /** Statutory rounding increment (10000 or 100000). */
  step: number;
  /** Explicit confirmation for unusually large figures. */
  confirmed?: boolean;
  onConfirm?: (next: boolean) => void;
}

/** Above this, the investor is asked to confirm the figure. The value is never capped. */
export const LARGE_FIGURE_THRESHOLD = 1_000_000;

export const formatGBP = (raw: string | number): string => {
  if (raw === "") return "";
  const numeric = Number(raw);
  if (!Number.isFinite(numeric)) return String(raw);
  return `£${numeric.toLocaleString("en-GB", { maximumFractionDigits: 0 })}`;
};

/** Digits only — the figure is a whole-pound statutory declaration. */
const parseDigits = (input: string): string => input.replace(/[^0-9]/g, "");

/**
 * A money field that displays UK currency formatting and flags figures that are
 * not an exact multiple of the statutory rounding. No spinners, and the mouse
 * wheel can never alter a signed financial declaration.
 */
export function MoneyInput({
  id,
  value,
  onChange,
  step,
  confirmed = false,
  onConfirm,
}: MoneyInputProps) {
  const [focused, setFocused] = useState(false);

  const numeric = value === "" ? null : Number(value);
  const notRounded = numeric !== null && Number.isFinite(numeric) && numeric % step !== 0;
  const needsConfirm =
    numeric !== null && Number.isFinite(numeric) && numeric >= LARGE_FIGURE_THRESHOLD;

  return (
    <div className="space-y-1.5">
      <Input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={focused ? value : formatGBP(value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onWheel={(event) => (event.target as HTMLInputElement).blur()}
        onChange={(event) => onChange(parseDigits(event.target.value))}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp" || event.key === "ArrowDown") event.preventDefault();
        }}
      />
      {notRounded && (
        <p className="font-sans text-xs text-destructive">
          Please enter a figure rounded to the nearest {formatGBP(step)}.
        </p>
      )}
      {needsConfirm && onConfirm && (
        <label className="flex cursor-pointer items-start gap-2 pt-1 font-sans text-xs leading-relaxed text-foreground">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(event) => onConfirm(event.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 accent-primary"
          />
          <span>You entered {formatGBP(value)} — please confirm this figure is correct.</span>
        </label>
      )}
    </div>
  );
}
