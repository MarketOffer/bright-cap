import { useEffect } from "react";

declare global {
  interface Window {
    Cal?: any;
  }
}

const CalEmbed = () => {
  useEffect(() => {
    // Load Cal.com embed
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

    window.Cal!("init", "partner-investor-call", { origin: "https://app.cal.eu" });

    window.Cal!.ns["partner-investor-call"]("inline", {
      elementOrSelector: "#my-cal-inline-partner-investor-call",
      config: { layout: "week_view", useSlotsViewOnSmallScreen: "true" },
      calLink: "team/brightcap/partner-investor-call",
    });

    window.Cal!.ns["partner-investor-call"]("ui", {
      cssVarsPerTheme: { light: { "cal-brand": "#3DC9A8" } },
      hideEventTypeDetails: false,
      layout: "week_view",
    });
  }, []);

  return (
    <section className="px-6 pt-20 pb-8 md:px-10 md:pt-28 md:pb-10">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-8 text-center text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
          Book a partner investor call
        </h2>
        <div
          style={{ width: "100%", height: "700px", overflow: "scroll" }}
          id="my-cal-inline-partner-investor-call"
        />
      </div>
    </section>
  );
};

export default CalEmbed;
