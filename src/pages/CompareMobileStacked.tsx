import kitchenBefore from "@/assets/construction-kitchen-before.webp";
import kitchenAfter from "@/assets/construction-kitchen-after.webp";

const pairs = [
  { label: "Kitchen renovation", before: kitchenBefore, after: kitchenAfter },
  { label: "Interior refurbishment", before: null, after: null },
  { label: "Garden flat", before: null, after: null },
  { label: "Loft extension", before: null, after: null },
];

const CompareMobileStacked = () => (
  <div className="min-h-screen bg-background">
    <div className="mx-auto max-w-5xl px-6 py-16 md:px-10">
      <h1 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-4xl">
        Before &amp; After — Mobile Stacked
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        On mobile, before and after are stacked so both are visible at once. Desktop/tablet keeps the side-by-side strip.
      </p>

      <div className="mt-12 space-y-16">
        {pairs.map((pair) => (
          <div key={pair.label}>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {pair.label}
            </p>

            {/* Mobile: 2-row stack | Tablet+: side-by-side */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <div className="relative overflow-hidden rounded-xl border border-border bg-muted">
                <div className="aspect-[3/2]">
                  {pair.before ? (
                    <img
                      src={pair.before}
                      alt={`${pair.label} — before`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-sm text-muted-foreground">Before photo</span>
                    </div>
                  )}
                </div>
                <span className="absolute left-3 top-3 rounded-full border border-border bg-background/90 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-muted-foreground backdrop-blur-sm">
                  Before
                </span>
              </div>

              <div className="relative overflow-hidden rounded-xl border border-border bg-muted">
                <div className="aspect-[3/2]">
                  {pair.after ? (
                    <img
                      src={pair.after}
                      alt={`${pair.label} — after`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-sm text-muted-foreground">After photo</span>
                    </div>
                  )}
                </div>
                <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-primary-foreground">
                  After
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default CompareMobileStacked;
