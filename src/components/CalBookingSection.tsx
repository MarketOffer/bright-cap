import Cal from "@calcom/embed-react";
import FadeIn from "./FadeIn";

const CalBookingSection = () => {

  return (
    <section id="book" className="px-6 pt-10 pb-10 md:px-10 md:pt-14 md:pb-14">
      <div className="mx-auto max-w-4xl">
        <FadeIn>
          <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="px-6 pt-10 pb-6 md:px-10 md:pt-12 md:pb-8">
              <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1] text-center">
                Book a partner investor call
              </h2>
              <p className="mt-6 font-sans text-base leading-relaxed text-muted-foreground md:text-lg text-center max-w-2xl mx-auto">
                A 30-minute call to understand your goals, walk you through our Cambridge block strategy, and explore whether there's a genuine fit.
              </p>
            </div>
            <div className="border-t border-border" style={{ minHeight: 600 }}>
              <Cal
                namespace="partner-investor-call"
                calLink="team/brightcap/partner-investor-call"
                calOrigin="https://cal.eu"
                style={{ width: "100%", height: "100%", overflow: "scroll" }}
                config={{ layout: "month_view", useSlotsViewOnSmallScreen: "true", theme: "light" }}
              />
            </div>
            <div className="px-6 pb-6 md:px-10 md:pb-8 pt-4 border-t border-border text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Calendar not loading? Book directly instead.
              </p>
              <a
                href="https://cal.eu/team/brightcap/partner-investor-call"
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

export default CalBookingSection;
