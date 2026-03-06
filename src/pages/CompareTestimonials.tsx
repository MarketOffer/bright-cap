import TestimonialSection from "@/components/TestimonialSection";
import TestimonialVariantTint from "@/components/TestimonialVariantTint";
import TestimonialVariantPullQuote from "@/components/TestimonialVariantPullQuote";
import TestimonialVariantAccentRule from "@/components/TestimonialVariantAccentRule";
import TestimonialVariantCard from "@/components/TestimonialVariantCard";

const variants = [
  { label: "Original", component: <TestimonialSection /> },
  { label: "A — Subtle Background Tint", component: <TestimonialVariantTint /> },
  { label: "B — Large Pull-Quote Typography", component: <TestimonialVariantPullQuote /> },
  { label: "C — Accent Border / Left Rule", component: <TestimonialVariantAccentRule /> },
  { label: "D — Card with Elevation", component: <TestimonialVariantCard /> },
];

const CompareTestimonials = () => (
  <div className="min-h-screen bg-background">
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur px-6 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Testimonial Section — Variant Comparison</h1>
        <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to site</a>
      </div>
    </header>

    {variants.map((v, i) => (
      <div key={i}>
        <div className="mx-auto max-w-6xl px-6 pt-10 pb-2">
          <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            {v.label}
          </span>
        </div>
        {v.component}
      </div>
    ))}
  </div>
);

export default CompareTestimonials;
