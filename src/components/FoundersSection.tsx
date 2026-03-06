import FadeIn from "./FadeIn";
import logoBbc from "@/assets/logo-bbc.svg";
import logoPia from "@/assets/logo-property-investor-awards.svg";
import logoPe from "@/assets/logo-property-entrepreneur.png";

const stats = [
  { number: "£5.7M", label: "Property portfolio" },
  { number: "34", label: "Years combined experience" },
  { number: "20+", label: "UK & Global property and business awards" },
];

const founders = [
  { name: "Andy Fidler", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=750&fit=crop&crop=face" },
  { name: "Sam Carter", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=750&fit=crop&crop=face" },
];

const FoundersSection = () => (
  <section className="border-t border-border px-6 py-28 md:px-10 md:py-36">
    <div className="mx-auto max-w-6xl">
      {/* Top: Photos + Intro */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left: Photos */}
        <FadeIn>
          <div className="flex gap-4 sm:gap-6">
            {founders.map((founder) => (
              <div key={founder.name} className="flex-1 flex flex-col">
                <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-muted">
                  <img
                    src={founder.img}
                    alt={founder.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="mt-3 text-center text-sm font-medium tracking-wide text-muted-foreground">
                  {founder.name}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Right: Title + Credentials */}
        <div className="flex flex-col justify-center">
          <FadeIn delay={0.1}>
            <h2 className="text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
              The founders
            </h2>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p className="mt-6 font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
              BrightCap is led by entrepreneurs with a track record of building businesses and delivering property projects for private investors.
              <br /><br />
              Alongside BrightCap, we own{" "}
              <span className="font-semibold text-foreground">MarketOffer</span>,
              a nationwide social housing leasing platform, and Sam's family construction and maintenance business has been delivering projects in Cambridge for over 25 years.
            </p>
          </FadeIn>

          {/* Stat callouts */}
          <FadeIn delay={0.2}>
            <div className="mt-10 grid grid-cols-3 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="border-t border-border pt-4">
                  <p className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    {stat.number}
                  </p>
                  <p className="mt-1 text-xs leading-snug text-muted-foreground md:text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.25}>
            <div className="mt-10">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Selected recognition for projects led by our team
              </p>
              <div className="mt-4 flex items-center gap-8">
                <img src={logoPia} alt="Property Investors Awards" className="h-8 opacity-60 grayscale" />
                <div className="flex h-8 items-center justify-center rounded bg-muted px-4 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Property Entrepreneur
                </div>
                <img src={logoBbc} alt="BBC" className="h-6 opacity-60 grayscale" />
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  </section>
);

export default FoundersSection;
