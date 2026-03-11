import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import FadeIn from "./FadeIn";

const CalBookingSection = () => {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "investorcall" });
      cal("ui", {
        cssVarsPerTheme: {
          light: { "cal-brand": "#3DC9A8" },
          dark: { "cal-brand": "#fafafa" },
        },
        hideEventTypeDetails: true,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <section className="px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-5xl">
        <FadeIn>
          <h2 className="text-center text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
            Schedule a Call
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-muted-foreground md:text-lg">
            Pick a time that works for you and we'll walk you through our
            Cambridge block strategy.
          </p>
        </FadeIn>
        <FadeIn delay={0.15}>
          <div className="mt-10">
            <Cal
              namespace="investorcall"
              calLink="team/brightcap/investorcall"
              style={{ width: "100%", height: "100%", overflow: "scroll" }}
              config={{ layout: "month_view", useSlotsViewOnSmallScreen: "true" }}
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default CalBookingSection;
