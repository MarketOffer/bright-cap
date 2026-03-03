import FadeIn from "./FadeIn";

const OpportunitySection = () => (
  <section id="opportunity" className="px-6 py-28 md:px-10 md:py-36">
    <div className="mx-auto max-w-3xl">
      <FadeIn>
        <h2 className="font-serif text-3xl font-light tracking-tight text-foreground md:text-5xl">
          Not all cities will grow equally.
        </h2>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p className="mt-10 font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
          AI is concentrating talent, capital and economic activity into a small number of innovation hubs globally. Cambridge is one of them — consistently ranked among the world's top AI and deep tech centres.
        </p>
      </FadeIn>
      <FadeIn delay={0.2}>
        <p className="mt-6 font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
          While institutional investors focus on regulation and affordability, we're positioning in the cities where demand is structurally supported for the next decade. Most large players aren't factoring this in yet. We are.
        </p>
      </FadeIn>
    </div>
  </section>
);

export default OpportunitySection;
