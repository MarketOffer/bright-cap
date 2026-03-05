import FadeIn from "./FadeIn";
import logoLandlordToday from "@/assets/logo-landlord-today.svg";
import logoLandlordZone from "@/assets/logo-landlord-zone.svg";
import logoNRLA from "@/assets/logo-nrla.svg";
import logoPropertyNotify from "@/assets/logo-property-notify.svg";

const logos = [
  { src: logoLandlordZone, alt: "LandlordZONE", height: "h-4 md:h-5" },
  { src: logoNRLA, alt: "NRLA", height: "h-5 md:h-6" },
  { src: logoPropertyNotify, alt: "Property Notify", height: "h-3.5 md:h-4" },
  { src: logoLandlordToday, alt: "Landlord TODAY", height: "h-4 md:h-5" },
];

const placeholders = ["BBC", "The Telegraph"];

const LogoStripInset = () => (
  <section className="-mt-8 relative z-10 px-6">
    <div className="mx-auto max-w-3xl rounded-xl bg-background/80 backdrop-blur-md border border-border/50 shadow-lg px-8 py-6">
      <FadeIn>
        <p className="mb-5 text-center font-sans text-xs tracking-[0.15em] uppercase text-muted-foreground/70">
          Founders' Businesses Seen In
        </p>
      </FadeIn>
      <FadeIn delay={0.1}>
        <div className="flex items-center justify-center gap-8 md:gap-12">
          {logos.map((logo) => (
            <img key={logo.alt} src={logo.src} alt={logo.alt} className={`${logo.height} w-auto opacity-40 grayscale`} />
          ))}
          {placeholders.map((name) => (
            <span key={name} className="font-serif text-base font-semibold tracking-tight text-muted-foreground/30 md:text-lg">
              {name}
            </span>
          ))}
        </div>
      </FadeIn>
    </div>
  </section>
);

export default LogoStripInset;
