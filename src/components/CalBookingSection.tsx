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

    const calLayout = window.innerWidth < 768 ? "column_view" : "month_view";

    Cal.ns["partner-investor-call"]("inline", {
      elementOrSelector: "#my-cal-inline-partner-investor-call",
      config: { layout: calLayout, useSlotsViewOnSmallScreen: "false" },
      calLink: "team/brightcap/partner-investor-call",
    });
    Cal.ns["partner-investor-call"]("ui", { hideEventTypeDetails: true, layout: calLayout });
  }, []);

  return (
    <section className="px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-4xl">
        <FadeIn>
          <div className="rounded-2xl border border-border bg-card p-8 shadow-[0_12px_48px_-12px_hsl(var(--foreground)/0.10)] md:p-14">
            <div className="text-center">
              <p className="font-sans text-sm font-semibold uppercase tracking-widest text-primary">
                Interested in investing with us?
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
                Book an Investor Discovery Call
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
                A no-obligation call to discuss your investment goals, explore our
                Cambridge block strategy, and find out whether there's a genuine fit.
              </p>
              <p className="mx-auto mt-3 max-w-2xl text-base font-semibold leading-relaxed text-foreground md:text-lg">
                Pick a time that works for you below.
              </p>
              {/* Hand-drawn curved arrow pointing down */}
              <svg
                className="mx-auto mt-3 text-primary"
                width="40"
                height="48"
                viewBox="0 0 40 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 4 C10 8, 8 20, 14 30 C18 36, 20 38, 20 42"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray="0"
                  style={{ strokeLinejoin: "round" }}
                />
                <path
                  d="M14 38 L20 46 L26 38"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
            <div
              id="my-cal-inline-partner-investor-call"
              className="mt-4"
              style={{ width: "100%", minHeight: "400px", overflow: "visible" }}
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default CalBookingSection;
