import { useState } from "react";
import brightcapLogo from "@/assets/brightcap_logo.svg";
import heroBg from "@/assets/hero-cambridge.jpg";
import FadeIn from "./FadeIn";

const navLinks = [
  { label: "Opportunity", href: "#opportunity" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
];

const VariantBlock = ({
  label,
  btnClass,
}: {
  label: string;
  btnClass: string;
}) => (
  <div className="border-2 border-border rounded-lg overflow-hidden">
    <div className="bg-accent/50 px-6 py-3">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>

    {/* Nav replica */}
    <nav className="bg-background shadow-[0_1px_0_0_hsl(var(--border))]">
      <div className="flex items-center justify-between px-6 py-5 md:px-16 lg:px-24">
        <img src={brightcapLogo} alt="brightcap" className="h-6" />
        <div className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <span key={link.label} className="text-sm tracking-[0.02em] text-muted-foreground">
              {link.label}
            </span>
          ))}
          <span className={`rounded-sm bg-primary tracking-wide text-primary-foreground transition-opacity hover:opacity-85 ${btnClass}`}>
            Invest With Us
          </span>
        </div>
      </div>
    </nav>

    {/* Hero replica */}
    <section className="flex flex-col md:flex-row">
      <div className="flex flex-1 items-center px-6 py-16 md:px-16 lg:px-24">
        <div className="max-w-xl">
          <h1 className="text-[2.5rem] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground sm:text-5xl md:text-[3.25rem] lg:text-[4rem]">
            Investing in real estate for <span className="whitespace-nowrap">the AI era</span>
          </h1>
          <p className="mt-8 max-w-md font-sans text-base leading-relaxed text-muted-foreground md:text-[1.0625rem]">
            We partner with business owners to grow their wealth through acquiring residential property in cities at the centre of the AI transformation.
          </p>
          <span className={`mt-10 inline-block rounded-sm bg-primary tracking-wide text-primary-foreground transition-opacity hover:opacity-85 ${btnClass}`}>
            Invest With Us
          </span>
        </div>
      </div>
      <div className="relative flex-1 min-h-[300px]">
        <img src={heroBg} alt="Cambridge cityscape" className="h-full w-full object-cover md:absolute md:inset-0" />
      </div>
    </section>
  </div>
);

const CTAComparison = () => (
  <section className="px-6 py-20 md:px-10 space-y-12 bg-muted/20">
    <h2 className="text-2xl font-semibold tracking-[-0.02em] text-foreground">CTA Button Comparison — In Context</h2>

    <VariantBlock
      label="Variant A — Bolder weight (font-bold)"
      btnClass="px-6 py-2.5 text-sm font-bold"
    />

    <VariantBlock
      label="Variant C — Larger text (text-base)"
      btnClass="px-6 py-2.5 text-base font-semibold"
    />
  </section>
);

export default CTAComparison;
