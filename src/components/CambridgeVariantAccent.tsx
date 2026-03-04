import FadeIn from "./FadeIn";

const stats = [
  { label: "Global Science & Tech", highlight: "No.1", detail: "Cluster in world — three years running", source: "WIPO 2022–2024" },
  { label: "World-Class Talent", highlight: "No.1", detail: "UK university" },
  { label: "Deep Tech Ecosystem", highlight: "5,300+", detail: "Science & tech firms incl. Google, Apple, ARM, AstraZeneca" },
  { label: "High Capital Growth", highlight: "50%", detail: "Over last 10 years" },
  { label: "High Employment Growth", highlight: "5×", detail: "UK's average" },
];

const CambridgeVariantAccent = () => (
  <section className="relative overflow-hidden px-6 pt-10 pb-20 md:px-10 md:pt-14 md:pb-28" style={{ backgroundColor: "rgba(163, 196, 188, 0.08)" }}>
    {/* Accent: line-art Mathematical Bridge on the left */}
    <svg
      className="pointer-events-none absolute -left-8 bottom-12 opacity-[0.07] md:left-4"
      width="280" height="200" viewBox="0 0 280 200" fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Bridge arch */}
      <path d="M10 180 Q70 40 140 60 Q210 80 270 180" stroke="currentColor" strokeWidth="2.5" className="text-foreground" fill="none"/>
      {/* Lattice struts */}
      <line x1="50" y1="140" x2="90" y2="70" stroke="currentColor" strokeWidth="1.5" className="text-foreground"/>
      <line x1="90" y1="70" x2="130" y2="130" stroke="currentColor" strokeWidth="1.5" className="text-foreground"/>
      <line x1="130" y1="130" x2="170" y2="75" stroke="currentColor" strokeWidth="1.5" className="text-foreground"/>
      <line x1="170" y1="75" x2="210" y2="125" stroke="currentColor" strokeWidth="1.5" className="text-foreground"/>
      <line x1="210" y1="125" x2="240" y2="90" stroke="currentColor" strokeWidth="1.5" className="text-foreground"/>
      {/* Railing */}
      <path d="M30 155 Q140 30 250 155" stroke="currentColor" strokeWidth="1" className="text-foreground" fill="none" strokeDasharray="4 3"/>
      {/* Water reflection */}
      <path d="M10 185 Q140 195 270 185" stroke="currentColor" strokeWidth="1" className="text-primary" fill="none" opacity="0.5"/>
    </svg>

    <div className="relative mx-auto max-w-5xl">
      <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-primary">Variant B — Accent Illustration</p>
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

export default CambridgeVariantAccent;
