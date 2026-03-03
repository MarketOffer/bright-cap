import FadeIn from "./FadeIn";

const HeroSection = () =>
<section className="flex min-h-screen items-center px-6 pt-24 md:px-10">
    <div className="mx-auto max-w-4xl">
      <FadeIn>
         <h1 className="text-[2.5rem] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5rem]">Investing in real estate for{"\n"}the AI decade
      </h1>
      </FadeIn>
      <FadeIn delay={0.15}>
        <p className="mt-8 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground md:text-[1.0625rem]">We partner with business owners to grow and protect their operating wealth through real estate in cities leading the AI era.

      </p>
      </FadeIn>
      <FadeIn delay={0.3}>
        <a href="#contact" className="mt-10 inline-block rounded-sm bg-primary px-8 py-3.5 font-sans text-sm font-semibold tracking-wide text-primary-foreground transition-opacity hover:opacity-85">
        
          Explore co-investment
        </a>
      </FadeIn>
    </div>
  </section>;


export default HeroSection;