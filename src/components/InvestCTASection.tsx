import FadeIn from "./FadeIn";
import { ArrowRight } from "lucide-react";

const InvestCTASection = () => (
  <section className="px-6 py-20 md:px-10 md:py-28">
    <div className="mx-auto max-w-5xl rounded-2xl border border-primary p-10 md:p-14">
      <FadeIn>
        <div className="text-center">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-foreground md:text-3xl">
            Interested in growing your property wealth in the AI&nbsp;era?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            If you're looking to grow your wealth through property in one of
            the world's few cities built to thrive in the AI era — without
            building your own property team — we'd love to talk.
          </p>
          <a
            href="#contact"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-primary/40"
          >
            Invest With Us
            <ArrowRight className="h-3.5 w-3.5 text-primary" />
          </a>
        </div>
      </FadeIn>
    </div>
  </section>
);

export default InvestCTASection;
