import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import FadeIn from "./FadeIn";
import kitchenBefore from "@/assets/construction-kitchen-before.webp";
import kitchenAfter from "@/assets/construction-kitchen-after.webp";

const pairs = [
  { label: "Kitchen renovation", before: kitchenBefore, after: kitchenAfter },
  { label: "Interior refurbishment", before: null, after: null },
  { label: "Garden flat", before: null, after: null },
  { label: "Loft extension", before: null, after: null },
];

const ConstructionSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["10%", "-60%"]);

  return (
    <section className="border-t border-border px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
            Our construction team
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Our renovations are delivered by our founder's 25+ year Cambridge
            construction business.
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            A local team aligned with our long-term goals. They build to last, and
            because they built it, ongoing maintenance is fast and efficient.
          </p>
        </FadeIn>

        {/* Parallax scroll-driven before/after strip */}
        <div
          ref={containerRef}
          className="relative mt-16 h-[50vh] overflow-hidden rounded-2xl"
        >
          <motion.div
            style={{ x }}
            className="absolute inset-y-0 flex items-center gap-6 px-8"
          >
            {pairs.map((pair) => (
              <div key={pair.label} className="flex shrink-0 gap-3">
                <div className="relative w-[280px] overflow-hidden rounded-xl border border-border bg-muted md:w-[340px]">
                  <div className="aspect-[3/2]">
                    {pair.before ? (
                      <img src={pair.before} alt={`${pair.label} — before`} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-sm text-muted-foreground">Before photo</span>
                      </div>
                    )}
                  </div>
                  <span className="absolute left-3 top-3 rounded-full border border-border bg-background/90 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-muted-foreground backdrop-blur-sm">
                    Before
                  </span>
                </div>
                <div className="relative w-[280px] overflow-hidden rounded-xl border border-border bg-muted md:w-[340px]">
                  <div className="aspect-[3/2]">
                    {pair.after ? (
                      <img src={pair.after} alt={`${pair.label} — after`} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-sm text-muted-foreground">After photo</span>
                      </div>
                    )}
                  </div>
                  <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-primary-foreground">
                    After
                  </span>
                </div>
                <div className="flex w-8 shrink-0 items-end pb-4">
                  <span className="origin-bottom-left -rotate-90 whitespace-nowrap text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {pair.label}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ConstructionSection;
