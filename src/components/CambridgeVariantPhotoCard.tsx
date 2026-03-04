import FadeIn from "./FadeIn";
import heroBg from "@/assets/hero-cambridge.jpg";

const stats = [
  { label: "World-Class Talent", highlight: "No.1", detail: "UK university" },
  { label: "Deep Tech Ecosystem", highlight: "5,300+", detail: "Science & tech firms incl. Google, Apple, ARM, AstraZeneca" },
  { label: "High Capital Growth", highlight: "50%", detail: "Over last 10 years" },
  { label: "High Employment Growth", highlight: "5×", detail: "UK's average" },
];

const CambridgeVariantPhotoCard = () => (
  <section className="px-6 pt-10 pb-20 md:px-10 md:pt-14 md:pb-28" style={{ backgroundColor: "rgba(163, 196, 188, 0.08)" }}>
    <div className="mx-auto max-w-5xl">
      <p className="mb-2 font-sans text-xs font-semibold uppercase tracking-[0.2em] text-primary">Variant E — Photo as First Card</p>
      <FadeIn>
        <h2 className="text-4xl font-semibold tracking-[-0.02em] text-foreground md:text-[3.5rem] md:leading-[1.05]">Cambridge.</h2>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
          Our first market. The world's leading science and tech cluster.
        </p>
      </FadeIn>

      <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Photo card in first position */}
        <FadeIn delay={0.15}>
          <div className="relative h-full min-h-[220px] overflow-hidden rounded-2xl border border-border">
            <img src={heroBg} alt="Cambridge" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-5">
              <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground/80">Global Science & Tech</span>
              <p className="mt-1 text-3xl font-semibold tracking-tight text-primary-foreground">No.1</p>
              <p className="mt-1 font-sans text-xs leading-relaxed text-primary-foreground/70">Cluster in world — three years running</p>
            </div>
          </div>
        </FadeIn>

        {stats.map((stat, i) => (
          <FadeIn key={i} delay={0.23 + i * 0.08}>
            <div className="flex h-full flex-col items-center justify-start rounded-2xl border border-border bg-card px-5 py-8 text-center transition-colors hover:border-primary/40">
              <span className="text-base font-semibold leading-snug tracking-wide text-foreground md:text-lg">{stat.label}</span>
              <span className="mt-4 text-5xl font-semibold tracking-tight text-primary md:text-6xl">{stat.highlight}</span>
              <p className="mt-4 font-sans text-sm leading-relaxed text-muted-foreground">{stat.detail}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

export default CambridgeVariantPhotoCard;
