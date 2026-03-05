import FadeIn from "./FadeIn";
import logoLandlordToday from "@/assets/logo-landlord-today.svg";
import logoLandlordZone from "@/assets/logo-landlord-zone.svg";
import logoNRLA from "@/assets/logo-nrla.svg";
import logoPropertyNotify from "@/assets/logo-property-notify.svg";
import logoBBC from "@/assets/logo-bbc.svg";
import logoTelegraph from "@/assets/logo-telegraph.svg";

const logos = [
  { src: logoBBC, alt: "BBC", height: "h-4 md:h-5" },
  { src: logoTelegraph, alt: "The Telegraph", height: "h-3 md:h-3.5" },
  { src: logoLandlordZone, alt: "LandlordZONE", height: "h-3 md:h-3.5" },
  { src: logoNRLA, alt: "NRLA", height: "h-4 md:h-5" },
  { src: logoPropertyNotify, alt: "Property Notify", height: "h-3 md:h-3.5" },
  { src: logoLandlordToday, alt: "Landlord TODAY", height: "h-3 md:h-3.5" },
];

const LogoStrip = () => (
  <section className="px-6 py-10 md:py-14">
    <div className="mx-auto max-w-4xl">
      <FadeIn>
        <p className="mb-8 text-center font-sans text-sm tracking-[0.15em] uppercase text-muted-foreground/70">
          Founders' Businesses Seen In
        </p>
      </FadeIn>
      <FadeIn delay={0.1}>
        <div className="flex flex-wrap items-end justify-center gap-6 md:flex-nowrap md:gap-10">
          {logos.map((logo) => (
            <img
              key={logo.alt}
              src={logo.src}
              alt={logo.alt}
              className={`${logo.height} w-auto opacity-50 grayscale`}
            />
          ))}
        </div>
      </FadeIn>
    </div>
  </section>
);

export default LogoStrip;
