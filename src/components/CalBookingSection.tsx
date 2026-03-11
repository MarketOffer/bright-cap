import FadeIn from "./FadeIn";

const CalBookingSection = () => {
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
            <iframe
              src="https://cal.com/team/brightcap/investorcall?layout=month_view"
              style={{ width: "100%", height: "700px", border: "none" }}
              loading="lazy"
              title="Schedule a call with Brightcap"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default CalBookingSection;
