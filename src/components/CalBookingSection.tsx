import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import FadeIn from "./FadeIn";

const CalBookingSection = () => {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "partner-investor-call" } as any);
      cal("ui", {
        theme: "light",
        cssVarsPerTheme: { light: { "cal-brand": "#3DC9A8" }, dark: { "cal-brand": "#3DC9A8" } },
        hideEventTypeDetails: true,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <section id="book" className="px-6 pt-10 pb-10 md:px-10 md:pt-14 md:pb-14">
      <div className="mx-auto max-w-4xl">
        <FadeIn>
          <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1] text-center">
            Book a partner investor call
          </h2>
          <p className="mt-6 font-sans text-base leading-relaxed text-muted-foreground md:text-lg text-center max-w-2xl mx-auto">
            A 30-minute call to understand your goals, walk you through our Cambridge block strategy, and explore whether there's a genuine fit.
          </p>
        </FadeIn>
        <FadeIn delay={0.15}>
          <div className="mt-10 rounded-2xl border border-border bg-card overflow-hidden" style={{ minHeight: 600 }}>
            <Cal
              namespace="partner-investor-call"
              calLink="team/brightcap/partner-investor-call"
              calOrigin="https://cal.eu"
              style={{ width: "100%", height: "100%", overflow: "scroll" }}
              config={{ layout: "month_view", useSlotsViewOnSmallScreen: "true", theme: "light" }}
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default CalBookingSection;
