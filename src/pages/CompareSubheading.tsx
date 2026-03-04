import FadeIn from "@/components/FadeIn";

const steps = [
  { num: "01", title: "Buy blocks at a discount", detail: "Typically 2 to 20 units" },
  { num: "02", title: "Create 15–25% equity uplift", detail: "Through title splitting and high-spec renovation of each unit" },
  { num: "03", title: "Generate long-term hands-off income", detail: "Let to professional tenants or supported living providers" },
];

const Timeline = () => (
  <div className="relative mt-16">
    <div className="absolute left-6 top-0 bottom-0 w-px bg-border md:left-8" />
    <div className="space-y-12">
      {steps.map((step, i) => (
        <div key={step.num} className="relative flex gap-8 pl-16 md:pl-20">
          <div className="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-background font-mono text-sm font-bold text-primary md:h-16 md:w-16 md:text-base">
            {step.num}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground md:text-2xl">{step.title}</h3>
            <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground md:text-base">{step.detail}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const VariantA = () => (
  <section className="px-6 py-28 md:px-10 md:py-36 border-b-2 border-dashed border-muted">
    <div className="mx-auto max-w-5xl">
      <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Option A — Accent Colour Bar</p>
      <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
        What We Acquire
      </h2>
      <div className="mt-4 h-1 w-16 rounded-full bg-primary" />
      <p className="mt-4 text-xl font-medium tracking-[-0.01em] text-foreground md:text-2xl">
        With our partner investors
      </p>
      <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
        We buy undervalued blocks of flats in Cambridge and turn them into high quality homes.
      </p>
      <Timeline />
    </div>
  </section>
);

const VariantB = () => (
  <section className="px-6 py-28 md:px-10 md:py-36 border-b-2 border-dashed border-muted">
    <div className="mx-auto max-w-5xl">
      <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Option B — Large Italic Contrast</p>
      <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
        What We Acquire
      </h2>
      <p className="mt-3 text-2xl font-light italic tracking-[-0.01em] text-foreground/80 md:text-[2.25rem] md:leading-[1.2]">
        With our partner investors
      </p>
      <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
        We buy undervalued blocks of flats in Cambridge and turn them into high quality homes.
      </p>
      <Timeline />
    </div>
  </section>
);

const VariantC = () => (
  <section className="px-6 py-28 md:px-10 md:py-36 border-b-2 border-dashed border-muted">
    <div className="mx-auto max-w-5xl">
      <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Option C — Primary Colour Text</p>
      <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
        What We Acquire
      </h2>
      <p className="mt-3 text-xl font-semibold tracking-[-0.01em] text-primary md:text-2xl">
        With our partner investors
      </p>
      <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
        We buy undervalued blocks of flats in Cambridge and turn them into high quality homes.
      </p>
      <Timeline />
    </div>
  </section>
);

const VariantD = () => (
  <section className="px-6 py-28 md:px-10 md:py-36">
    <div className="mx-auto max-w-5xl">
      <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Option D — Side-by-Side Layout</p>
      <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:gap-4">
        <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
          What We Acquire
        </h2>
        <span className="hidden text-2xl font-light text-muted-foreground/60 md:inline">—</span>
        <p className="text-xl font-medium tracking-[-0.01em] text-foreground/80 md:text-2xl">
          With our partner investors
        </p>
      </div>
      <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
        We buy undervalued blocks of flats in Cambridge and turn them into high quality homes.
      </p>
      <Timeline />
    </div>
  </section>
);

const CompareSubheading = () => (
  <div className="min-h-screen bg-background">
    <div className="px-6 py-12 text-center">
      <h1 className="text-2xl font-bold text-foreground">Subheading Treatment Comparison</h1>
      <p className="mt-2 text-muted-foreground">Four ways to elevate "With our partner investors"</p>
    </div>
    <VariantA />
    <VariantB />
    <VariantC />
    <VariantD />
  </div>
);

export default CompareSubheading;
