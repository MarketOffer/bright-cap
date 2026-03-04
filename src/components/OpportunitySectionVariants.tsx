import FadeIn from "./FadeIn";

const heading = "Not all cities will grow equally.";
const p1 = "AI is pulling talent, capital and opportunity into a small number of cities. That's not a cycle — it's a shift. And it's accelerating.";
const p2 = "The cities at the centre of it will grow. The ones on the outside will struggle.";
const punchline = "The property market hasn't priced this in yet. We have.";

/* ── Variant A: Dark background ── */
export const VariantDark = () => (
  <section className="px-6 py-28 md:px-10 md:py-36 bg-foreground">
    <div className="mx-auto max-w-3xl">
      <p className="mb-4 font-sans text-xs uppercase tracking-[0.2em] text-muted">Variant A — Dark Background</p>
      <FadeIn>
        <h2 className="text-3xl font-semibold tracking-[-0.02em] text-background md:text-[2.75rem] md:leading-[1.1]">
          {heading}
        </h2>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p className="mt-10 font-sans text-base leading-relaxed text-muted md:text-lg">{p1}</p>
      </FadeIn>
      <FadeIn delay={0.2}>
        <p className="mt-6 font-sans text-base leading-relaxed text-muted md:text-lg">{p2}</p>
      </FadeIn>
      <FadeIn delay={0.3}>
        <p className="mt-6 font-sans text-base leading-relaxed text-background md:text-lg">{punchline}</p>
      </FadeIn>
    </div>
  </section>
);

/* ── Variant B: Accent highlight / border treatment ── */
export const VariantAccent = () => (
  <section className="px-6 py-28 md:px-10 md:py-36">
    <div className="mx-auto max-w-3xl border-l-2 border-primary pl-8 md:pl-12">
      <p className="mb-4 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground/50">Variant B — Accent Highlight</p>
      <FadeIn>
        <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
          {heading}
        </h2>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p className="mt-10 font-sans text-base leading-relaxed text-muted-foreground md:text-lg">{p1}</p>
      </FadeIn>
      <FadeIn delay={0.2}>
        <p className="mt-6 font-sans text-base leading-relaxed text-muted-foreground md:text-lg">{p2}</p>
      </FadeIn>
      <FadeIn delay={0.3}>
        <p className="mt-8 font-sans text-base leading-relaxed text-foreground md:text-lg">
          <span className="inline-block border-b-2 border-primary pb-1">{punchline}</span>
        </p>
      </FadeIn>
    </div>
  </section>
);

/* ── Variant C: Large pull-quote ── */
export const VariantPullQuote = () => (
  <section className="px-6 py-28 md:px-10 md:py-36">
    <div className="mx-auto max-w-3xl">
      <p className="mb-4 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground/50">Variant C — Pull-Quote</p>
      <FadeIn>
        <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
          {heading}
        </h2>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p className="mt-10 font-sans text-base leading-relaxed text-muted-foreground md:text-lg">{p1}</p>
      </FadeIn>
      <FadeIn delay={0.2}>
        <p className="mt-6 font-sans text-base leading-relaxed text-muted-foreground md:text-lg">{p2}</p>
      </FadeIn>
      <FadeIn delay={0.3}>
        <p className="mt-12 text-2xl font-semibold leading-snug tracking-[-0.02em] text-foreground md:text-[2rem] md:leading-[1.2]">
          {punchline}
        </p>
      </FadeIn>
    </div>
  </section>
);

export default function OpportunitySectionVariants() {
  return (
    <>
      <VariantDark />
      <div className="border-t border-border" />
      <VariantAccent />
      <div className="border-t border-border" />
      <VariantPullQuote />
    </>
  );
}
