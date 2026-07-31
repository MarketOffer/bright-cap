import FadeIn from "./FadeIn";
import { ArrowRight } from "lucide-react";

const InvestCTASection = () => (
  <section className="px-6 pt-20 pb-8 md:px-10 md:pt-28 md:pb-10">
    <div className="mx-auto max-w-5xl rounded-2xl border border-primary p-10 md:p-14">
      <FadeIn>
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-foreground md:text-3xl">
            Interested in BrightCap&rsquo;s Cambridge strategy?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Learn how we acquire and improve residential blocks in
            Cambridge&mdash;and how investors can work with us.
          </p>
          <a
            href="#invest"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary/40"
          >
            Book a Call
            <ArrowRight className="h-3.5 w-3.5 text-primary" />
          </a>
        </div>
      </FadeIn>
    </div>
  </section>
);

export default InvestCTASection;
