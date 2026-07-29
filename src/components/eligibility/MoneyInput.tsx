import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";

interface MoneyInputProps {
  id: string;
  /** Raw digits, e.g. "150000". Empty string when unanswered. */
  value: string;
  onChange: (next: string) => void;
  /** Statutory rounding increment (10000 or 100000). */
  step: number;
}

const formatGBP = (raw: string): string => {
  if (raw === "") return "";
  const numeric = Number(raw);
  if (!Number.isFinite(numeric)) return raw;
  return `£${numeric.toLocaleString("en-GB", { maximumFractionDigits: 0 })}`;
};

/** Digits only — the figure is a whole-pound statutory declaration. */
const parseDigits = (input: string): string => input.replace(/[^0-9]/g, "");

/**
 * A money field that displays UK currency formatting, offers increment
 * arrows stepped to the statutory rounding, and flags figures that are
 * not an exact multiple of that rounding.
 */
export function MoneyInput({ id, value, onChange, step }: MoneyInputProps) {
  const [focused, setFocused] = useState(false);

  const numeric = value === "" ? null : Number(value);
  const notRounded = numeric !== null && Number.isFinite(numeric) && numeric % step !== 0;

  const nudge = (direction: 1 | -1) => {
    const current = numeric ?? 0;
    const base = Math.floor(current / step) * step;
    const next =
      direction === 1
        ? (current % step === 0 ? current : base) + step
        : Math.max(0, current % step === 0 ? current - step : base);
    onChange(String(next));
  };

  return (
    <div className="space-y-1.5">
      <div className="relative">
        <Input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          className="pr-10"
          value={focused ? value : formatGBP(value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(event) => onChange(parseDigits(event.target.value))}
          onKeyDown={(event) => {
            if (event.key === "ArrowUp") {
              event.preventDefault();
              nudge(1);
            } else if (event.key === "ArrowDown") {
              event.preventDefault();
              nudge(-1);
            }
          }}
        />
        <div className="absolute right-0 top-0 flex h-full w-9 flex-col border-l border-input">
          <button
            type="button"
            aria-label={`Increase by ${formatGBP(String(step))}`}
            onClick={() => nudge(1)}
            className="flex flex-1 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label={`Decrease by ${formatGBP(String(step))}`}
            onClick={() => nudge(-1)}
            className="flex flex-1 items-center justify-center border-t border-input text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      {notRounded && (
        <p className="font-sans text-xs text-destructive">
          Please enter a figure rounded to the nearest {formatGBP(String(step))}.
        </p>
      )}
    </div>
  );
}
