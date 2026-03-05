import FadeIn from "@/components/FadeIn";

/**
 * Variant A — Side-by-side grid
 * Two images next to each other with subtle labels.
 */
const VariantSideBySide = () => (
  <div>
    <h3 className="mb-6 text-lg font-semibold text-foreground">A — Side-by-side</h3>
    <div className="grid gap-4 md:grid-cols-2 md:gap-6">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-muted">
        <div className="flex aspect-[4/3] items-center justify-center">
          <span className="text-sm text-muted-foreground">Before photo</span>
        </div>
        <span className="absolute left-4 top-4 rounded-full border border-border bg-background/90 px-3 py-1 text-xs font-semibold tracking-wide text-muted-foreground backdrop-blur-sm">
          Before
        </span>
      </div>
      <div className="relative overflow-hidden rounded-2xl border border-border bg-muted">
        <div className="flex aspect-[4/3] items-center justify-center">
          <span className="text-sm text-muted-foreground">After photo</span>
        </div>
        <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold tracking-wide text-primary-foreground">
          After
        </span>
      </div>
    </div>
  </div>
);

/**
 * Variant B — Stacked with divider line
 * Before on top, thin divider, after below. Editorial feel.
 */
const VariantStacked = () => (
  <div>
    <h3 className="mb-6 text-lg font-semibold text-foreground">B — Stacked with divider</h3>
    <div className="mx-auto max-w-2xl space-y-0">
      <div className="relative overflow-hidden rounded-t-2xl border border-b-0 border-border bg-muted">
        <div className="flex aspect-[16/9] items-center justify-center">
          <span className="text-sm text-muted-foreground">Before photo</span>
        </div>
        <span className="absolute left-4 top-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Before
        </span>
      </div>
      <div className="mx-4 border-t border-border" />
      <div className="relative overflow-hidden rounded-b-2xl border border-t-0 border-border bg-muted">
        <div className="flex aspect-[16/9] items-center justify-center">
          <span className="text-sm text-muted-foreground">After photo</span>
        </div>
        <span className="absolute left-4 top-4 text-xs font-semibold uppercase tracking-widest text-primary">
          After
        </span>
      </div>
    </div>
  </div>
);

/**
 * Variant C — Overlapping cards
 * After card overlaps Before with offset, creating depth.
 */
const VariantOverlap = () => (
  <div>
    <h3 className="mb-6 text-lg font-semibold text-foreground">C — Overlapping cards</h3>
    <div className="relative mx-auto max-w-3xl">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-muted">
        <div className="flex aspect-[16/9] items-center justify-center">
          <span className="text-sm text-muted-foreground">Before photo</span>
        </div>
        <span className="absolute left-4 top-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Before
        </span>
      </div>
      <div className="absolute -bottom-8 right-4 w-[55%] overflow-hidden rounded-2xl border border-border bg-muted shadow-lg md:-bottom-12 md:right-8">
        <div className="flex aspect-[4/3] items-center justify-center">
          <span className="text-sm text-muted-foreground">After photo</span>
        </div>
        <span className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold tracking-wide text-primary-foreground">
          After
        </span>
      </div>
    </div>
    <div className="h-16 md:h-20" /> {/* spacing for overlap */}
  </div>
);

/**
 * Variant D — Two rows of before/after pairs
 * Shows multiple transformations in a compact grid.
 */
const VariantMultiPair = () => (
  <div>
    <h3 className="mb-6 text-lg font-semibold text-foreground">D — Multiple pairs grid</h3>
    <div className="space-y-8">
      {["Chapel conversion", "Interior refurbishment"].map((label, i) => (
        <div key={label}>
          <div className="grid gap-3 md:grid-cols-2 md:gap-4">
            <div className="relative overflow-hidden rounded-xl border border-border bg-muted">
              <div className="flex aspect-[3/2] items-center justify-center">
                <span className="text-sm text-muted-foreground">Before photo</span>
              </div>
              <span className="absolute left-3 top-3 rounded-full border border-border bg-background/90 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-muted-foreground backdrop-blur-sm">
                Before
              </span>
            </div>
            <div className="relative overflow-hidden rounded-xl border border-border bg-muted">
              <div className="flex aspect-[3/2] items-center justify-center">
                <span className="text-sm text-muted-foreground">After photo</span>
              </div>
              <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-primary-foreground">
                After
              </span>
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{label}</p>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Variant E — Minimal caption-only (no badge overlays)
 * Clean editorial: image fills card, label sits below as a caption.
 */
const VariantCaptionBelow = () => (
  <div>
    <h3 className="mb-6 text-lg font-semibold text-foreground">E — Minimal with captions below</h3>
    <div className="grid gap-6 md:grid-cols-2 md:gap-8">
      <div>
        <div className="overflow-hidden rounded-2xl border border-border bg-muted">
          <div className="flex aspect-[4/3] items-center justify-center">
            <span className="text-sm text-muted-foreground">Before photo</span>
          </div>
        </div>
        <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Before</p>
      </div>
      <div>
        <div className="overflow-hidden rounded-2xl border border-border bg-muted">
          <div className="flex aspect-[4/3] items-center justify-center">
            <span className="text-sm text-muted-foreground">After photo</span>
          </div>
        </div>
        <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-primary">After</p>
      </div>
    </div>
  </div>
);

const CompareBeforeAfter = () => (
  <div className="min-h-screen bg-background">
    <div className="mx-auto max-w-5xl px-6 py-16 md:px-10">
      <h1 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-4xl">
        Before / After — Layout Variants
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        Five approaches for showing transformation photos. All use placeholder images.
      </p>

      <div className="mt-16 space-y-24">
        <FadeIn><VariantSideBySide /></FadeIn>
        <FadeIn delay={0.1}><VariantStacked /></FadeIn>
        <FadeIn delay={0.2}><VariantOverlap /></FadeIn>
        <FadeIn delay={0.3}><VariantMultiPair /></FadeIn>
        <FadeIn delay={0.4}><VariantCaptionBelow /></FadeIn>
      </div>
    </div>
  </div>
);

export default CompareBeforeAfter;
