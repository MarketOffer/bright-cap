import FadeIn from "./FadeIn";

const founders = [
  { name: "Andy Fidler", placeholder: "AF" },
  { name: "Sam Carter", placeholder: "SC" },
];

const FoundersSection = () => (
  <section className="border-t border-border px-6 py-28 md:px-10 md:py-36">
    <div className="mx-auto max-w-5xl">
      <FadeIn>
        <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
          The founders
        </h2>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="mt-8 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
          <p className="mb-4">Founded by entrepreneurs with:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>A £5.7M property portfolio</li>
            <li>
              A group of property businesses inc:
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>
                  <span className="font-semibold text-foreground">MarketOffer</span> — a social housing leasing platform for landlords
                </li>
                <li>A construction and property maintenance business</li>
              </ul>
            </li>
            <li>34 years combined experience in construction, property, finance and scaling businesses globally</li>
            <li>Proven track record delivering property projects for HNW investors</li>
            <li>20+ UK &amp; Global Award Wins in property and business</li>
          </ul>
        </div>
      </FadeIn>

      <FadeIn delay={0.2}>
        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 max-w-xl">
          {founders.map((founder) => (
            <div key={founder.name} className="flex flex-col items-center">
              <div className="flex h-56 w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted sm:h-64 md:h-72">
                <span className="font-mono text-4xl font-bold text-muted-foreground/40">
                  {founder.placeholder}
                </span>
              </div>
              <p className="mt-4 text-sm font-medium tracking-wide text-muted-foreground">
                {founder.name}
              </p>
            </div>
          ))}
        </div>
      </FadeIn>
    </div>
  </section>
);

export default FoundersSection;
