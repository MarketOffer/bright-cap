import { useRef, useEffect, useCallback, useState } from "react";
import FadeIn from "./FadeIn";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
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
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      dragFree: true,
      containScroll: false,
    },
    [
      AutoScroll({
        speed: 0.8,
        startDelay: 0,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        stopOnFocusIn: true,
      }),
    ]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Only start auto-scroll once the carousel bottom is visible
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Play/pause auto-scroll based on visibility
  useEffect(() => {
    if (!emblaApi) return;
    const autoScroll = emblaApi.plugins()?.autoScroll;
    if (!autoScroll) return;

    if (isInView) {
      (autoScroll as any).play();
    } else {
      (autoScroll as any).stop();
    }
  }, [emblaApi, isInView]);

  return (
    <section className="border-t border-border px-6 py-28 md:px-10 md:py-36" style={{ backgroundColor: "rgba(163, 170, 196, 0.07)" }}>
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
            Our construction team
          </h2>
        </FadeIn>

        <FadeIn delay={0.1}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Our renovations are delivered by our founder's family-run construction and maintenance business — <span className="text-foreground font-bold">building in Cambridge for over 25 years.</span>
          </p>
        </FadeIn>

        <FadeIn delay={0.15}>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            They build to last and the same team maintains it — so standards stay high and issues get resolved fast.
          </p>
        </FadeIn>

        {/* Looping carousel with auto-scroll */}
        <div className="relative mt-10" ref={sectionRef}>
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
