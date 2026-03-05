import WhatWeAcquireVariantSideBySide from "@/components/WhatWeAcquireVariantSideBySide";
import WhatWeAcquireVariantStripBelow from "@/components/WhatWeAcquireVariantStripBelow";
import WhatWeAcquireVariantInlineCard from "@/components/WhatWeAcquireVariantInlineCard";
import WhatWeAcquireVariantBackground from "@/components/WhatWeAcquireVariantBackground";

const CompareWhatWeAcquire = () => (
  <div className="bg-background">
    <div className="border-b border-border px-6 py-10 text-center">
      <h1 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-4xl">
        "What We Acquire" — Photo Layout Comparison
      </h1>
      <p className="mt-3 font-sans text-muted-foreground">Scroll to compare all four variants</p>
    </div>

    {/* Variant A */}
    <div className="border-b border-border">
      <div className="mx-auto max-w-5xl px-6 pt-10">
        <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 font-mono text-sm font-semibold text-primary">
          A — Side-by-side on desktop
        </span>
      </div>
      <WhatWeAcquireVariantSideBySide />
    </div>

    {/* Variant B */}
    <div className="border-b border-border">
      <div className="mx-auto max-w-5xl px-6 pt-10">
        <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 font-mono text-sm font-semibold text-primary">
          B — Full-width strip below timeline
        </span>
      </div>
      <WhatWeAcquireVariantStripBelow />
    </div>

    {/* Variant C */}
    <div className="border-b border-border">
      <div className="mx-auto max-w-5xl px-6 pt-10">
        <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 font-mono text-sm font-semibold text-primary">
          C — Inline card beside step 1
        </span>
      </div>
      <WhatWeAcquireVariantInlineCard />
    </div>

    {/* Variant D */}
    <div>
      <div className="mx-auto max-w-5xl px-6 pt-10">
        <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 font-mono text-sm font-semibold text-primary">
          D — Background with overlay
        </span>
      </div>
      <WhatWeAcquireVariantBackground />
    </div>
  </div>
);

export default CompareWhatWeAcquire;
