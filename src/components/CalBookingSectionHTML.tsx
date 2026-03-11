import { useEffect, useRef } from "react";
import FadeIn from "./FadeIn";

const CalBookingSectionHTML = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inject the Cal.com embed script
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.textContent = `
      (function (C, A, L) {
        let p = function (a, ar) { a.q.push(ar); };
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

      Cal("init", "partner-investor-call-html", {origin:"https://app.cal.eu"});

      Cal.ns["partner-investor-call-html"]("inline", {
        elementOrSelector:"#my-cal-inline-html",
        config: {"layout":"month_view","useSlotsViewOnSmallScreen":"true"},
        calLink: "team/brightcap/partner-investor-call",
      });

      Cal.ns["partner-investor-call-html"]("ui", {
        "cssVarsPerTheme":{"light":{"cal-brand":"#3DC9A8"}},
        "hideEventTypeDetails":true,
        "layout":"month_view"
      });
    `;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section id="book-html" className="px-6 pt-10 pb-10 md:px-10 md:pt-14 md:pb-14">
      <div className="mx-auto max-w-4xl">
        <FadeIn>
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="px-6 pt-10 pb-6 md:px-10 md:pt-12 md:pb-8">
              <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1] text-center">
                Book a partner investor call (HTML test)
              </h2>
              <p className="mt-6 font-sans text-base leading-relaxed text-muted-foreground md:text-lg text-center max-w-2xl mx-auto">
                A 30-minute call to understand your goals, walk you through our Cambridge block strategy, and explore whether there's a genuine fit.
              </p>
            </div>
            <div className="border-t border-border">
              <div
                id="my-cal-inline-html"
                ref={containerRef}
                style={{ width: "100%", height: 700, overflow: "scroll" }}
              />
            </div>
            <div className="px-6 pb-6 md:px-10 md:pb-8 pt-4 border-t border-border text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Calendar not loading? Book directly instead.
              </p>
              <a
                href="https://cal.com/team/brightcap/partner-investor-call"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Book on Cal.com →
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default CalBookingSectionHTML;
