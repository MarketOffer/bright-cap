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

const ConstructionVariantStat = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["end end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);

  return (
    <section className="border-t border-border px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
            Our construction team
          </h2>
        </FadeIn>

        {/* Pull-quote stat */}
        <FadeIn delay={0.08}>
          <div className="mt-8 flex items-baseline gap-4">
            <span className="text-5xl font-semibold tracking-tight text-primary md:text-6xl">25+</span>
            <span className="text-base font-medium text-muted-foreground md:text-lg">years building in Cambridge</span>
          </div>
        </FadeIn>

        <FadeIn delay={0.15}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Our renovations are delivered by our founder's long-standing Cambridge
            construction business — a local team aligned with our long-term goals.
            They build to last, and because they built it, ongoing maintenance is
            fast and efficient.
          </p>
        </FadeIn>

        <div ref={containerRef} className="relative mt-10 h-[75vh] overflow-hidden rounded-2xl sm:h-[50vh]">
          <motion.div style={{ x }} drag="x" dragConstraints={{ left: -1600, right: 100 }} dragElastic={0.15}
            className="absolute inset-y-0 flex cursor-grab items-center gap-6 px-8 active:cursor-grabbing">
            {pairs.map((pair) => (
              <div key={pair.label} className="flex shrink-0 flex-col sm:flex-row sm:gap-3">
                <span className="mb-2 block text-sm font-semibold uppercase tracking-widest text-muted-foreground sm:hidden">{pair.label}</span>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative w-[280px] overflow-hidden rounded-xl border border-border bg-muted md:w-[340px]">
                    <div className="aspect-[3/2]">
                      {pair.before ? <img src={pair.before} alt={`${pair.label} — before`} className="h-full w-full object-cover" loading="lazy" /> : <div className="flex h-full items-center justify-center"><span className="text-sm text-muted-foreground">Before photo</span></div>}
                    </div>
                    <span className="absolute left-3 top-3 rounded-full border border-border bg-background/90 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-muted-foreground backdrop-blur-sm">Before</span>
                  </div>
                  <div className="relative w-[280px] overflow-hidden rounded-xl border border-border bg-muted md:w-[340px]">
                    <div className="aspect-[3/2]">
                      {pair.after ? <img src={pair.after} alt={`${pair.label} — after`} className="h-full w-full object-cover" loading="lazy" /> : <div className="flex h-full items-center justify-center"><span className="text-sm text-muted-foreground">After photo</span></div>}
                    </div>
                    <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-primary-foreground">After</span>
                  </div>
                </div>
                <div className="hidden w-8 shrink-0 items-end pb-4 sm:flex">
                  <span className="origin-bottom-left -rotate-90 whitespace-nowrap text-xs font-semibold uppercase tracking-widest text-muted-foreground">{pair.label}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ConstructionVariantStat;
