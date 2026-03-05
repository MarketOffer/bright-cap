import FadeIn from "@/components/FadeIn";

const founders = [
  { name: "Andy Fidler", initials: "AF", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=750&fit=crop&crop=face" },
  { name: "Sam Carter", initials: "SC", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=750&fit=crop&crop=face" },
];

const stats = [
  { number: "£5.7M", label: "Property portfolio" },
  { number: "34", label: "Years combined experience" },
  { number: "20+", label: "UK & Global property and business awards" },
];

const credentialsText = `Founded by experienced entrepreneurs in business and property - with a proven track record delivering property projects for HNW investors.\n\nThey own a group of businesses including MarketOffer, a nationwide social housing leasing platform, plus a Cambridge construction and maintenance business.`;

/* ── Variant A: Current – Hero-style with stat strip ── */
const VariantA = () => (
  <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
    <div className="flex gap-4 sm:gap-6">
      {founders.map((f) => (
        <div key={f.name} className="flex-1 flex flex-col">
          <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-muted">
            <img src={f.img} alt={f.name} className="h-full w-full object-cover" />
          </div>
          <p className="mt-3 text-center text-sm font-medium tracking-wide text-muted-foreground">{f.name}</p>
        </div>
      ))}
    </div>
    <div className="flex flex-col justify-center">
      <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">The founders</h2>
      <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">{credentialsText}</p>
      <div className="mt-10 grid grid-cols-3 gap-6">
        {stats.map((s) => (
          <div key={s.label} className="border-t border-border pt-4">
            <p className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{s.number}</p>
            <p className="mt-1 text-xs leading-snug text-muted-foreground md:text-sm">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ── Variant B: Side-by-side portraits + stats below ── */
const VariantB = () => (
  <div>
    <h2 className="text-center text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">The founders</h2>
    <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-muted-foreground md:text-lg">{credentialsText}</p>
    <div className="mx-auto mt-12 flex max-w-lg gap-6 sm:gap-8">
      {founders.map((f) => (
        <div key={f.name} className="flex-1 flex flex-col items-center">
          <div className="aspect-square w-full overflow-hidden rounded-full border-2 border-border bg-muted">
            <img src={f.img} alt={f.name} className="h-full w-full object-cover" />
          </div>
          <p className="mt-4 text-sm font-medium tracking-wide text-foreground">{f.name}</p>
        </div>
      ))}
    </div>
    <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 gap-8 text-center">
      {stats.map((s) => (
        <div key={s.label} className="rounded-xl border border-border bg-muted/50 px-4 py-6">
          <p className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{s.number}</p>
          <p className="mt-2 text-xs text-muted-foreground md:text-sm">{s.label}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ── Variant C: Split layout (annual report) ── */
const VariantC = () => (
  <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
    {/* Left: founders stacked */}
    <div className="space-y-6">
      {founders.map((f) => (
        <div key={f.name} className="flex items-center gap-5">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
            <img src={f.img} alt={f.name} className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{f.name}</p>
            <p className="text-sm text-muted-foreground">Co-founder</p>
          </div>
        </div>
      ))}
    </div>
    {/* Right: credentials as cards */}
    <div>
      <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">The founders</h2>
      <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">{credentialsText}</p>
      <div className="mt-8 space-y-3">
        {stats.map((s) => (
          <div key={s.label} className="flex items-baseline gap-4 rounded-lg border border-border bg-muted/30 px-5 py-4">
            <span className="text-2xl font-bold text-foreground">{s.number}</span>
            <span className="text-sm text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ── Variant D: Founder cards with integrated stats ── */
const VariantD = () => (
  <div>
    <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">The founders</h2>
    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
      {founders.map((f) => (
        <div key={f.name} className="overflow-hidden rounded-2xl border border-border">
          <div className="aspect-[4/3] bg-muted">
            <img src={f.img} alt={f.name} className="h-full w-full object-cover" />
          </div>
          <div className="p-6">
            <p className="text-lg font-semibold text-foreground">{f.name}</p>
            <p className="text-sm text-muted-foreground">Co-founder</p>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-10 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">{credentialsText}</div>
    <div className="mt-8 flex flex-wrap gap-6">
      {stats.map((s) => (
        <div key={s.label} className="min-w-[140px] border-l-2 border-primary pl-4">
          <p className="text-2xl font-bold text-foreground md:text-3xl">{s.number}</p>
          <p className="mt-1 text-xs text-muted-foreground md:text-sm">{s.label}</p>
        </div>
      ))}
    </div>
  </div>
);

/* ── Variant E: Full-width hero with stat strip ── */
const VariantE = () => (
  <div>
    <div className="flex flex-col items-center text-center">
      <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">The founders</h2>
      <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">{credentialsText}</p>
    </div>
    <div className="mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-6">
      {founders.map((f) => (
        <div key={f.name} className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
          <img src={f.img} alt={f.name} className="h-full w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 pb-5 pt-12">
            <p className="text-base font-semibold text-white">{f.name}</p>
          </div>
        </div>
      ))}
    </div>
    <div className="mx-auto mt-14 flex max-w-3xl items-center justify-center divide-x divide-border">
      {stats.map((s) => (
        <div key={s.label} className="px-8 py-2 text-center">
          <p className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">{s.number}</p>
          <p className="mt-1 text-xs text-muted-foreground md:text-sm">{s.label}</p>
        </div>
      ))}
    </div>
  </div>
);

const variants = [
  { label: "A — Current: Photos left, stats right", Component: VariantA },
  { label: "B — Centred portraits (circular) + stat cards", Component: VariantB },
  { label: "C — Split layout (annual report style)", Component: VariantC },
  { label: "D — Founder cards with left-border stats", Component: VariantD },
  { label: "E — Hero photos with overlay + stat strip", Component: VariantE },
];

const FoundersCompare = () => (
  <div className="min-h-screen bg-background">
    <div className="border-b border-border px-6 py-8 md:px-10">
      <div className="mx-auto max-w-6xl">
        <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to site</a>
        <h1 className="mt-4 text-2xl font-bold text-foreground md:text-3xl">Founders Section — Design Comparison</h1>
        <p className="mt-2 text-muted-foreground">All variants shown with the same content and placeholder photos.</p>
      </div>
    </div>

    {variants.map(({ label, Component }, i) => (
      <section key={label} className="border-b border-border px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-6xl">
          <FadeIn>
            <p className="mb-10 inline-block rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              Variant {label}
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Component />
          </FadeIn>
        </div>
      </section>
    ))}
  </div>
);

export default FoundersCompare;
