import FadeIn from "./FadeIn";

const stats = [
  { label: "Global Science & Tech", highlight: "No.1", detail: "Cluster in world — three years running", source: "WIPO 2022–2024" },
  { label: "World-Class Talent", highlight: "No.1", detail: "UK university" },
  { label: "Deep Tech Ecosystem", highlight: "5,300+", detail: "Science & tech firms incl. Google, Apple, ARM, AstraZeneca" },
  { label: "High Capital Growth", highlight: "50%", detail: "Over last 10 years" },
  { label: "High Employment Growth", highlight: "5×", detail: "UK's average" },
];

const CambridgeVariantWatermark = () => (
  <section className="relative overflow-hidden px-6 pt-10 pb-20 md:px-10 md:pt-14 md:pb-28" style={{ backgroundColor: "rgba(163, 196, 188, 0.08)" }}>
    {/* Watermark: stylised King's College Chapel spire */}
    <svg
      className="pointer-events-none absolute right-[5%] top-1/2 -translate-y-1/2 opacity-[0.045]"
      width="420" height="700" viewBox="0 0 420 700" fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gothic spire silhouette */}
      <path d="M210 0 L250 180 L270 180 L280 300 L300 300 L310 450 L330 450 L340 600 L360 600 L360 700 L60 700 L60 600 L80 600 L90 450 L110 450 L120 300 L140 300 L150 180 L170 180 Z" fill="currentColor" className="text-foreground"/>
      {/* Windows */}
      <rect x="175" y="320" width="30" height="60" rx="15" fill="currentColor" className="text-background"/>
      <rect x="215" y="320" width="30" height="60" rx="15" fill="currentColor" className="text-background"/>
      <rect x="155" y="470" width="25" height="50" rx="12" fill="currentColor" className="text-background"/>
      <rect x="197" y="470" width="25" height="50" rx="12" fill="currentColor" className="text-background"/>
      <rect x="240" y="470" width="25" height="50" rx="12" fill="currentColor" className="text-background"/>
      {/* Door */}
      <rect x="185" y="620" width="50" height="80" rx="25" fill="currentColor" className="text-background"/>
    </svg>

    <div className="relative mx-auto max-w-5xl">
      <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-primary">Variant A — Watermark</p>
      <FadeIn>
        <h2 className="text-4xl font-semibold tracking-[-0.02em] text-foreground md:text-[3.5rem] md:leading-[1.05]">Cambridge.</h2>
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
              <span className="text-base font-semibold leading-snug tracking-wide text-foreground md:text-lg">{stat.label}</span>
              <span className="mt-4 text-5xl font-semibold tracking-tight text-primary md:text-6xl">{stat.highlight}</span>
              <p className="mt-4 font-sans text-sm leading-relaxed text-muted-foreground">{stat.detail}</p>
              {stat.source && <p className="mt-1 font-sans text-[0.65rem] text-muted-foreground/50">{stat.source}</p>}
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

export default CambridgeVariantWatermark;
