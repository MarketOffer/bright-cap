import FadeIn from "./FadeIn";
import heroBg from "@/assets/hero-cambridge.jpg";

const HeroSection = () =>
<section className="relative flex min-h-screen items-center px-6 pt-24 md:px-10 overflow-hidden">
    <div className="absolute inset-0">
      <img src={heroBg} alt="Cambridge cityscape" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
    </div>
    <div className="relative mx-auto max-w-4xl">
      <FadeIn>
        <h1 className="text-[2.5rem] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-[5rem]">
          Investing in real estate for{"\n"}the AI era
        </h1>
      </FadeIn>
      <FadeIn delay={0.15}>
        <p className="mt-8 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground md:text-[1.0625rem]">
          We partner with business owners to grow their wealth through investing in residential real estate in cities leading the AI transformation.
        </p>
      </FadeIn>
      <FadeIn delay={0.3}>
        <a
        href="#contact"
        className="mt-10 inline-block rounded-sm bg-primary px-8 py-3.5 font-sans text-sm font-semibold tracking-wide text-primary-foreground transition-opacity hover:opacity-85">
        
          Explore co-investment
        </a>
      </FadeIn>
    </div>
  </section>;


export default HeroSection;