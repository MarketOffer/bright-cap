import FadeIn from "./FadeIn";

const stats = [
  {
    label: "High Capital Growth",
    highlight: "50%",
    detail: "Over last 10 years",
  },
  {
    label: "Global Science & Tech",
    highlight: "No.1",
    detail: "Cluster in world — three years running",
    source: "WIPO 2022–2024",
  },
  {
    label: "High Employment Growth",
    highlight: "5×",
    detail: "UK's average",
  },
  {
    label: "World-Class Talent",
    highlight: "No.1",
    detail: "UK university",
  },
  {
    label: "Deep Tech Ecosystem",
    highlight: "5,300+",
    detail: "Science & tech firms incl. Google, Apple, ARM, AstraZeneca",
  },
];

const CambridgeSection = () => (
  <section id="cambridge" className="px-6 py-20 md:px-10 md:py-28">
    <div className="mx-auto max-w-5xl">
      <FadeIn>
        <h2 className="text-4xl font-semibold tracking-[-0.02em] text-foreground md:text-[3.5rem] md:leading-[1.05]">
          Cambridge.
        </h2>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
          Our first market. The world's leading science and tech cluster.
        </p>
      </FadeIn>

      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, i) => (
          <FadeIn key={i} delay={0.15 + i * 0.08}>
            <div className="flex h-full flex-col items-center justify-start rounded-2xl border border-border bg-card px-5 py-8 text-center transition-colors hover:border-primary/40">
              <span className="text-base font-semibold leading-snug tracking-wide text-foreground md:text-lg">
                {stat.label}
              </span>
              <span className="mt-4 text-5xl font-semibold tracking-tight text-primary md:text-6xl">
                {stat.highlight}
              </span>
              <p className="mt-4 font-sans text-sm leading-relaxed text-muted-foreground">
                {stat.detail}
              </p>
              {stat.source && (
                <p className="mt-1 font-sans text-[0.65rem] text-muted-foreground/50">
                  {stat.source}
                </p>
              )}
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

export default CambridgeSection;
