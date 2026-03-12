import FadeIn from "@/components/FadeIn";
import heroBg from "@/assets/hero-cambridge.webp";
import { ReactNode } from "react";

const HeroPreview = ({ headline, subtitle }: { headline: ReactNode; subtitle: string }) => (
  <div className="flex min-h-[420px] flex-col md:flex-row overflow-hidden rounded-lg border border-border">
    <div className="flex flex-1 items-center px-6 py-10 md:px-12">
      <div className="max-w-xl">
        <h2 className="text-2xl font-semibold leading-[1.1] tracking-[-0.02em] text-foreground sm:text-3xl md:text-4xl">
          {headline}
        </h2>
        <p className="mt-6 max-w-md font-sans text-sm leading-relaxed text-muted-foreground md:text-base">
          {subtitle}
        </p>
        <span className="mt-8 inline-block rounded-sm bg-primary px-6 py-3 font-sans text-sm font-semibold tracking-wide text-primary-foreground">
          Invest With Us
        </span>
      </div>
    </div>
    <div className="relative flex-1 min-h-[200px]">
      <img src={heroBg} alt="Cambridge cityscape" className="h-full w-full object-cover md:absolute md:inset-0" />
    </div>
  </div>
);

const VariantCard = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="space-y-3">
    <span className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{label}</span>
    {children}
  </div>
);

const subtitle = "We partner with business owners to grow their wealth through acquiring residential property in cities at the centre of the AI transformation.";

const HeadlineComparison = () => (
  <div className="min-h-screen bg-background px-4 py-16 md:px-12">
    <div className="mx-auto max-w-6xl space-y-12">
      <FadeIn>
        <h1 className="text-3xl font-semibold text-foreground">Headline Comparison</h1>
        <p className="mt-2 text-muted-foreground">Compare hero headline variants side by side.</p>
      </FadeIn>

      <div className="space-y-10">
        <VariantCard label="A — Original (Gerund)">
          <HeroPreview
            headline={<>Investing in property for <span className="whitespace-nowrap">the AI era</span></>}
            subtitle={subtitle}
          />
        </VariantCard>

        <VariantCard label="B — Building">
          <HeroPreview
            headline={<>Building property portfolios for <span className="whitespace-nowrap">the AI era</span></>}
            subtitle={subtitle}
          />
        </VariantCard>

        <VariantCard label="C — Acquiring">
          <HeroPreview
            headline={<>Acquiring property for <span className="whitespace-nowrap">the AI era</span></>}
            subtitle={subtitle}
          />
        </VariantCard>
      </div>
    </div>
  </div>
);

export default HeadlineComparison;
