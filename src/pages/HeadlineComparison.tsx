import FadeIn from "@/components/FadeIn";
import heroBg from "@/assets/hero-cambridge.webp";

const HeroPreview = ({ headline }: { headline: React.ReactNode }) => (
  <section className="flex min-h-[70vh] flex-col md:flex-row overflow-hidden rounded-2xl border border-border">
    <div className="flex flex-1 items-center bg-background px-6 py-12 md:px-12">
      <div className="max-w-xl">
        <h1 className="text-[2rem] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground sm:text-4xl md:text-[2.75rem]">
          {headline}
        </h1>
        <p className="mt-6 max-w-md font-sans text-sm leading-relaxed text-muted-foreground md:text-base">
          We partner with business owners to grow their wealth through acquiring residential property in cities at the centre of the AI transformation.
        </p>
        <span className="mt-8 inline-block rounded-sm bg-primary px-6 py-3 font-sans text-sm font-semibold tracking-wide text-primary-foreground">
          Invest With Us
        </span>
      </div>
    </div>
    <div className="relative flex-1">
      <img src={heroBg} alt="Cambridge cityscape" className="h-full w-full object-cover md:absolute md:inset-0" />
    </div>
  </section>
);

const VariantCard = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-4">
    <div className="rounded-lg border border-border bg-card p-4">
      <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
        {label}
      </span>
    </div>
    {children}
  </div>
);

const HeadlineComparison = () => (
  <div className="min-h-screen bg-background px-6 py-16 md:px-10">
    <div className="mx-auto max-w-6xl">
      <a href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Back to site
      </a>
      <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        Headline Comparison
      </h1>
      <p className="mt-3 text-base text-muted-foreground">
        Testing different hero headlines side by side.
      </p>

      <div className="mt-16 space-y-20">
        <VariantCard label="A — Imperative">
          <HeroPreview
            headline={<>Invest in property for <span className="whitespace-nowrap">the AI era</span></>}
          />
        </VariantCard>

        <VariantCard label="B — Gerund">
          <HeroPreview
            headline={<>Investing in property for <span className="whitespace-nowrap">the AI era</span></>}
          />
        </VariantCard>
      </div>
    </div>
  </div>
);

export default HeadlineComparison;
