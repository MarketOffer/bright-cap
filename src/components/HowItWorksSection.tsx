import FadeIn from "./FadeIn";

const steps = [
  {
    label: "Acquire",
    description:
      "We identify and purchase blocks of residential flats in Cambridge at block value — before individual unit pricing is applied.",
  },
  {
    label: "Create Value",
    description:
      "Title splitting, refurbishment and repositioning through a construction partnership with over 25 years of Cambridge experience.",
  },
  {
    label: "Exit or Hold",
    description:
      "Premium professional rentals or supported living leasing — whichever delivers the best risk-adjusted return at the time.",
  },
];

const HowItWorksSection = () => (
  <section id="how-it-works" className="border-t border-border px-6 py-28 md:px-10 md:py-36">
    <div className="mx-auto max-w-5xl">
      <FadeIn>
        <h2 className="font-serif text-3xl font-light tracking-tight text-foreground md:text-5xl">
          A focused model. Selective partnerships.
        </h2>
      </FadeIn>

      <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
        {steps.map((step, i) => (
          <FadeIn key={step.label} delay={0.1 + i * 0.1}>
            <div>
              <h3 className="font-serif text-xl font-medium text-foreground md:text-2xl">
                {step.label}
              </h3>
              <p className="mt-4 font-sans text-sm leading-relaxed text-muted-foreground md:text-base">
                {step.description}
              </p>
            </div>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.5}>
        <p className="mt-16 font-sans text-sm text-muted-foreground">
          Co-investment from £500k. We invest alongside you in every deal.
        </p>
      </FadeIn>
    </div>
  </section>
);

export default HowItWorksSection;
