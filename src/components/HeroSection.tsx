import FadeIn from "./FadeIn";

const HeroSection = () => (
  <section className="flex min-h-screen items-center px-6 pt-24 md:px-10">
    <div className="mx-auto max-w-4xl">
      <FadeIn>
        <h1 className="font-serif text-4xl font-light leading-[1.15] tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          Capital positioned for the cities that will lead the next economy.
        </h1>
      </FadeIn>
      <FadeIn delay={0.15}>
        <p className="mt-8 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
          brightcap acquires residential blocks in Cambridge — one of the world's top-ranked AI and innovation hubs — in selective partnership with co-investors.
        </p>
      </FadeIn>
      <FadeIn delay={0.3}>
        <a
          href="#contact"
          className="mt-10 inline-block rounded-sm bg-primary px-8 py-3.5 font-sans text-sm font-semibold tracking-wide text-primary-foreground transition-opacity hover:opacity-85"
        >
          Explore co-investment
        </a>
      </FadeIn>
    </div>
  </section>
);

export default HeroSection;
