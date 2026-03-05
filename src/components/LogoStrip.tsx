import FadeIn from "./FadeIn";
import logoLandlordToday from "@/assets/logo-landlord-today.svg";
import logoLandlordZone from "@/assets/logo-landlord-zone.svg";
import logoNRLA from "@/assets/logo-nrla.svg";
import logoPropertyNotify from "@/assets/logo-property-notify.svg";

const logos = [
  { src: logoLandlordZone, alt: "LandlordZONE", height: "h-6 md:h-7" },
  { src: logoNRLA, alt: "NRLA", height: "h-7 md:h-8" },
  { src: logoPropertyNotify, alt: "Property Notify", height: "h-5 md:h-6" },
  { src: logoLandlordToday, alt: "Landlord TODAY", height: "h-6 md:h-7" },
];

const placeholders = ["BBC", "The Telegraph"];

const LogoStrip = () => (
  <section className="border-y border-border bg-muted/20 px-6 py-10 md:py-12">
    <div className="mx-auto max-w-5xl">
      <FadeIn>
        <p className="mb-8 text-center font-sans text-sm tracking-[0.15em] uppercase text-muted-foreground/70">
          Founders' Businesses Seen In
        </p>
      </FadeIn>
      <FadeIn delay={0.1}>
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-14 lg:gap-16">
          {logos.map((logo) => (
            <img
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              className={`${logo.height} w-auto opacity-50 grayscale`}
            />
          ))}
          {placeholders.map((name) => (
            <span
              key={name}
              className="font-serif text-xl font-semibold tracking-tight text-muted-foreground/40 md:text-2xl"
            >
              {name}
            </span>
          ))}
        </div>
      </FadeIn>
    </div>
  </section>
);

export default LogoStrip;
