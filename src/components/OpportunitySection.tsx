import FadeIn from "./FadeIn";

const OpportunitySection = () => (
  <section id="opportunity" className="px-6 py-28 md:px-10 md:py-36">
    <div className="mx-auto max-w-3xl border-l-2 border-primary pl-8 md:pl-12">
      <FadeIn>
        <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
          AI is deciding which cities win.
        </h2>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p className="mt-10 font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
          AI is pulling talent, capital and opportunity into a small number of cities. That's not a cycle — it's a shift. And it's accelerating.
        </p>
      </FadeIn>
      <FadeIn delay={0.2}>
        <p className="mt-6 font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
          The cities at the centre of it will grow. The ones on the outside will struggle.
        </p>
      </FadeIn>
      <FadeIn delay={0.3}>
        <p className="mt-8 font-sans text-base leading-relaxed text-foreground md:text-lg">
          The property market hasn't priced this in yet. We have.
        </p>
      </FadeIn>
    </div>
  </section>
);

export default OpportunitySection;
