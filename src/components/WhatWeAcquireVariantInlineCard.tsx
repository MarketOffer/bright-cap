import FadeIn from "./FadeIn";
import blockPhoto from "@/assets/cambridge-block-flats.webp";

const steps = [
  { num: "01", title: "Buy blocks at a discount", detail: "Typically 2 to 20 units", showPhoto: true },
  { num: "02", title: "Create 15–25% equity uplift", detail: "Through title splitting and high-spec renovation of each unit" },
  { num: "03", title: "Generate long-term hands-off income", detail: "Let to professional tenants or supported living providers" },
];

const WhatWeAcquireVariantInlineCard = () => (
  <section className="px-6 py-28 md:px-10 md:py-36">
    <div className="mx-auto max-w-5xl">
      <FadeIn>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
          What We Acquire
        </h2>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p className="mt-3 text-xl font-semibold tracking-[-0.01em] text-primary md:text-2xl">
          With our partner investors
        </p>
      </FadeIn>
      <FadeIn delay={0.15}>
        <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
          We buy undervalued blocks of flats in Cambridge and turn them into high quality homes.
        </p>
      </FadeIn>

      <div className="relative mt-16">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-border md:left-8" />
        <div className="space-y-12">
          {steps.map((step, i) => (
            <FadeIn key={step.num} delay={0.2 + i * 0.12}>
              <div className="relative flex gap-8 pl-16 md:pl-20">
                <div className="absolute left-0 flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-background font-mono text-sm font-bold text-primary md:h-16 md:w-16 md:text-base">
                  {step.num}
                </div>
                <div className="flex-1">
                  <div className={`${step.showPhoto ? "flex flex-col gap-6 md:flex-row md:items-start md:gap-8" : ""}`}>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground md:text-2xl">{step.title}</h3>
                      <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground md:text-base">{step.detail}</p>
                    </div>
                    {step.showPhoto && (
                      <div className="w-full overflow-hidden rounded-xl border border-border md:w-48 md:flex-shrink-0">
                        <img src={blockPhoto} alt="Cambridge block of flats" className="h-32 w-full object-cover md:h-full" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default WhatWeAcquireVariantInlineCard;
