import { useEffect, useRef } from "react";

declare global {
  interface Window {
    Cal?: (...args: unknown[]) => void;
  }
}

export default function CalEmbed() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return;
    const script = document.createElement("script");
    script.src = "https://app.cal.com/embed/embed.js";
    script.async = true;
    script.onload = () => {
      window.Cal?.("init", "partner-investor-call", { origin: "https://app.cal.com" });
      (window.Cal as any)?.ns?.["partner-investor-call"]?.("inline", {
        elementOrSelector: ref.current,
        config: { layout: "month_view" },
        calLink: "team/brightcap/partner-investor-call",
      });
    };
    document.head.appendChild(script);
  }, []);

  return <div ref={ref} className="w-full min-h-[500px]" />;
}
