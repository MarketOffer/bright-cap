import FadeIn from "@/components/FadeIn";
import blockPhoto from "@/assets/cambridge-block-flats.webp";

/* ── Variant A: Current ── */
const stepsA = [
  { num: "01", title: "Buy blocks at a discount", detail: "Typically 2 to 20 units" },
  { num: "02", title: "Create 15–25% equity uplift", detail: "Through title splitting and high-spec renovation of each unit" },
  { num: "03", title: "Generate long-term hands-off income", detail: "Let to professional tenants or supported living providers" },
];

const VariantA = () => (
  <div>
    <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
      What We Acquire
    </h2>
    <p className="mt-3 text-xl font-semibold tracking-[-0.01em] text-primary md:text-2xl">
      With our partner investors
    </p>
    <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
      We buy undervalued blocks of flats in Cambridge and turn them into high quality homes.
    </p>

    <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-border md:left-8" />
        <div className="space-y-12">
          {stepsA.map((step, i) => (
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
      <div className="overflow-hidden rounded-2xl border border-border max-h-[300px] md:max-h-[400px] lg:max-h-none">
        <img src={blockPhoto} alt="Cambridge block of flats" className="h-full w-full object-cover" />
      </div>
    </div>
  </div>
);

/* ── Variant B: New copy & expanded details ── */
const stepsB = [
  {
    num: "01",
    title: "Acquire mispriced Cambridge blocks",
    detail: "Typically 2 to 20 flats in prime or emerging central locations, sourced off‑market or before wider marketing.",
  },
  {
    num: "02",
    title: "Unlock targeted 15–25% equity uplift",
    detail: "Through title splitting, planning gains where available, and high‑spec renovation of each flat.",
  },
  {
    num: "03",
    title: "Hold for hands‑off income",
    detail: "Let to professional tenants or, where economics are stronger, supported living providers, with maintenance overseen by our co‑founder's construction business.",
  },
];

const VariantB = () => (
  <div>
    <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
      Our Cambridge block strategy
    </h2>
    <p className="mt-3 text-xl font-semibold tracking-[-0.01em] text-primary md:text-2xl">
      Invested alongside a small group of partner founders
    </p>
    <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
      We focus on one thing: acquiring and improving residential blocks in Cambridge's science and tech core, then holding them as high‑quality long‑term rentals.
    </p>

    <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-border md:left-8" />
        <div className="space-y-12">
          {stepsB.map((step) => (
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
      <div className="overflow-hidden rounded-2xl border border-border max-h-[300px] md:max-h-[400px] lg:max-h-none">
        <img src={blockPhoto} alt="Cambridge block of flats" className="h-full w-full object-cover" />
      </div>
    </div>
  </div>
);

const variants = [
  { label: "A — Current copy", Component: VariantA },
  { label: "B — Revised copy & expanded details", Component: VariantB },
];

const AcquireCompare = () => (
  <div className="min-h-screen bg-background">
    <div className="border-b border-border px-6 py-8 md:px-10">
      <div className="mx-auto max-w-6xl">
        <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to site</a>
        <h1 className="mt-4 text-2xl font-bold text-foreground md:text-3xl">Block Strategy Section — Copy Comparison</h1>
        <p className="mt-2 text-muted-foreground">Same layout, different copy — compare side by side.</p>
      </div>
    </div>

    {variants.map(({ label, Component }) => (
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

export default AcquireCompare;
