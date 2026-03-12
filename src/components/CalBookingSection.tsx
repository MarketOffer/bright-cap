import { useEffect } from "react";
import FadeIn from "./FadeIn";

const CalBookingSection = () => {
  useEffect(() => {
    // Cal.com inline embed loader
    (function (C: any, A: string, L: string) {
      let p = function (a: any, ar: any) { a.q.push(ar); };
      let d = C.document;
      C.Cal = C.Cal || function () {
        let cal = C.Cal;
        let ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const api = function () { p(api, arguments); };
          const namespace = ar[1];
          api.q = api.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || api;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
    })(window, "https://app.cal.eu/embed/embed.js", "init");

    const Cal = (window as any).Cal;
    Cal("init", "partner-investor-call", { origin: "https://app.cal.eu" });
    Cal.ns["partner-investor-call"]("inline", {
      elementOrSelector: "#my-cal-inline-partner-investor-call",
      config: { layout: "column_view", useSlotsViewOnSmallScreen: "false" },
      calLink: "team/brightcap/partner-investor-call",
    });
    Cal.ns["partner-investor-call"]("ui", { hideEventTypeDetails: true, layout: "column_view" });
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
          <div
            id="my-cal-inline-partner-investor-call"
            className="mt-10"
            style={{ width: "100%", minHeight: "600px", overflow: "visible" }}
          />
        </FadeIn>
      </div>
    </section>
  );
};

export default CalBookingSection;
