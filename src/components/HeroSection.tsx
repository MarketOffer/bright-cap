import FadeIn from "./FadeIn";
import heroBg from "@/assets/hero-cambridge.webp";

const HeroSection = () =>
  <section className="flex min-h-screen flex-col pt-24 md:flex-row md:pt-0">
    {/* Text */}
    <div className="flex flex-1 items-center px-6 py-16 md:px-16 lg:px-24">
      <div className="max-w-xl">
        <FadeIn>
          <h1 className="text-[2.5rem] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground sm:text-5xl md:text-[3.25rem] lg:text-[4rem] xl:text-[4.5rem]">
            Investing in real estate for <span className="whitespace-nowrap">the AI era</span>
          </h1>
        </FadeIn>
        <FadeIn delay={0.15}>
          <p className="mt-8 max-w-md font-sans text-base leading-relaxed text-muted-foreground md:text-[1.0625rem]">
            We partner with business owners to grow their wealth through acquiring residential property in cities at the centre of the AI transformation.
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <a
            href="#contact"
            className="mt-10 inline-block rounded-sm bg-primary px-8 py-3.5 font-sans text-base font-semibold tracking-wide text-primary-foreground transition-opacity hover:opacity-85"
          >
            Invest With Us
          </a>
        </FadeIn>
      </div>
    </div>
    {/* Image */}
    <div className="relative flex-1">
      <img
        src={heroBg}
        alt="Cambridge cityscape"
        className="h-full w-full object-cover md:absolute md:inset-0"
      />
    </div>
  </section>;


export default HeroSection;