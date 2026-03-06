import FadeIn from "./FadeIn";
import { ArrowRight } from "lucide-react";

const InvestCTASection = () => (
  <section className="border-t border-border px-6 py-28 md:px-10 md:py-36">
    <div className="mx-auto max-w-5xl">
      <FadeIn>
        <div className="relative overflow-hidden rounded-2xl bg-foreground p-10 md:p-14">
          <div className="relative z-10">
            <h2 className="text-2xl font-semibold tracking-[-0.02em] text-background md:text-3xl">
              Interested in investing alongside us?
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-background/60 md:text-lg">
              If you're looking to grow your wealth through property in one of
              the world's few cities built to thrive in the AI era — without
              building your own property team — we'd love to talk.
            </p>
            <a
              href="#contact"
              className="mt-8 inline-flex items-center gap-2 rounded-sm border border-background/20 px-6 py-2.5 text-sm font-medium text-background/70 transition-colors hover:border-background/40 hover:text-background"
            >
              Invest With Us
              <ArrowRight className="h-3.5 w-3.5 text-primary" />
            </a>
          </div>
        </div>
      </FadeIn>
    </div>
  </section>
);

export default InvestCTASection;
