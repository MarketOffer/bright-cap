import FadeIn from "./FadeIn";

const OpportunitySection = () => (
  <section id="opportunity" className="px-6 pt-32 pb-20 md:px-10 md:pt-44 md:pb-28">
    <div className="mx-auto max-w-3xl border-l-2 border-primary pl-8 md:pl-12">
      <FadeIn>
        <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
          AI is reshaping where property wealth is created
        </h2>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p className="mt-10 font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
          AI is accelerating the economic growth of a small number of cities — and leaving others behind. That's not a cycle — it's a shift.
        </p>
      </FadeIn>
      <FadeIn delay={0.2}>
        <p className="mt-6 font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
          The cities at the centre of it will attract talent, capital and opportunity for decades — driving long-term rental demand and property values in the process.
        </p>
      </FadeIn>
      <FadeIn delay={0.3}>
        <p className="mt-8 font-sans text-base leading-relaxed text-foreground md:text-lg">
          The market hasn't priced this in yet. We've built our strategy around it.
        </p>
      </FadeIn>
    </div>
  </section>
);

export default OpportunitySection;
