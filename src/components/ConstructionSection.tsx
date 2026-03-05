import FadeIn from "./FadeIn";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import kitchenBefore from "@/assets/construction-kitchen-before.webp";
import kitchenAfter from "@/assets/construction-kitchen-after.webp";
import churchBefore from "@/assets/construction-church-before.webp";
import churchAfter from "@/assets/construction-church-after.webp";
import livingRoomBefore from "@/assets/construction-living-room-before.webp";
import livingRoomAfter from "@/assets/construction-living-room-after.webp";
import extensionBefore from "@/assets/construction-extension-before.webp";
import extensionAfter from "@/assets/construction-extension-after.webp";

const pairs = [
  { label: "Kitchen renovation", before: kitchenBefore, after: kitchenAfter },
  { label: "Church conversion", before: churchBefore, after: churchAfter },
  { label: "Living room", before: livingRoomBefore, after: livingRoomAfter },
  { label: "Extension", before: extensionBefore, after: extensionAfter },
];

const ConstructionSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    dragFree: true,
    containScroll: false,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

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
            Our renovations are delivered by our founder's{" "}
            <span className="text-foreground font-bold">25+ year Cambridge construction business</span>.
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            A local team aligned with our long-term goals. They build to last, and
            because they built it, ongoing maintenance is fast and efficient.
          </p>
        </FadeIn>

        {/* Looping carousel */}
        <div className="relative mt-10">
          <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
            <div className="flex">
              {pairs.map((pair) => (
                <div
                  key={pair.label}
                  className="flex shrink-0 flex-col gap-3 pr-6 sm:flex-row"
                >
                  {/* Before */}
                  <div className="relative w-[280px] overflow-hidden rounded-xl border border-border bg-muted md:w-[340px]">
                    <div className="aspect-[3/2]">
                      {pair.before ? (
                        <img
                          src={pair.before}
                          alt={`${pair.label} — before`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
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
                  {/* After */}
                  <div className="relative w-[280px] overflow-hidden rounded-xl border border-border bg-muted md:w-[340px]">
                    <div className="aspect-[3/2]">
                      {pair.after ? (
                        <img
                          src={pair.after}
                          alt={`${pair.label} — after`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
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
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={scrollPrev}
            className="absolute -left-4 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background/90 p-2 shadow-sm backdrop-blur-sm transition-colors hover:bg-muted"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4 text-foreground" />
          </button>
          <button
            onClick={scrollNext}
            className="absolute -right-4 top-1/2 -translate-y-1/2 rounded-full border border-border bg-background/90 p-2 shadow-sm backdrop-blur-sm transition-colors hover:bg-muted"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4 text-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ConstructionSection;
