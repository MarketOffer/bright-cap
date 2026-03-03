import FadeIn from "./FadeIn";

const AboutSection = () => (
  <section id="about" className="border-t border-border px-6 py-28 md:px-10 md:py-36">
    <div className="mx-auto max-w-3xl">
      <FadeIn>
        <h2 className="font-serif text-3xl tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
          Built by an operator, not a fund manager.
        </h2>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p className="mt-10 font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
          Andy Fidler has spent decades building and scaling businesses outside traditional finance. brightcap is built on a simple conviction: the right location, the right thesis, and the right local partnerships matter more than financial engineering.
        </p>
      </FadeIn>
      <FadeIn delay={0.2}>
        <p className="mt-6 font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
          Our construction partner has operated in Cambridge for over 25 years. We know this market. We're selective about what we acquire and selective about who we partner with.
        </p>
      </FadeIn>
    </div>
  </section>
);

export default AboutSection;
