import { useState, useEffect } from "react";
import brightcapLogo from "@/assets/brightcap_logo.svg";

const navLinks = [
  { label: "The Opportunity", href: "#opportunity" },
  { label: "What We Acquire", href: "#what-we-acquire" },
  { label: "The Founders", href: "#founders" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [heroCtaVisible, setHeroCtaVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      setHeroCtaVisible((e as CustomEvent).detail);
    };
    window.addEventListener("hero-cta-visibility", handler);
    return () => window.removeEventListener("hero-cta-visibility", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-background transition-shadow duration-300 ${
        scrolled ? "shadow-[0_1px_0_0_hsl(var(--border))]" : ""
      }`}
    >
      <div className="flex items-center justify-between px-6 py-5 md:px-16 lg:px-24">
        <a href="#">
          <img src={brightcapLogo} alt="brightcap" className="h-6" />
        </a>

        {/* Desktop */}
        <div className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm tracking-[0.02em] text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-sm bg-primary px-6 py-2.5 text-base font-semibold tracking-wide text-primary-foreground transition-opacity hover:opacity-85"
          >
            Invest With Us
          </a>
        </div>

        {/* Mobile: CTA + hamburger */}
        <div className="flex items-center gap-3 md:hidden">
          {/* Slide-in CTA when hero button scrolls away */}
          <a
            href="#contact"
            className={`rounded-sm bg-primary px-4 py-1.5 text-xs font-semibold tracking-wide text-primary-foreground transition-all duration-300 ${
              heroCtaVisible ? "pointer-events-none translate-y-1 opacity-0" : "translate-y-0 opacity-100"
            }`}
          >
            Invest With Us
          </a>

          <button
            className="flex flex-col gap-1.5"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block h-px w-6 bg-foreground transition-transform duration-200 ${mobileOpen ? "translate-y-[4px] rotate-45" : ""}`} />
            <span className={`block h-px w-6 bg-foreground transition-opacity duration-200 ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block h-px w-6 bg-foreground transition-transform duration-200 ${mobileOpen ? "-translate-y-[4px] -rotate-45" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-6 pb-6 md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-3 text-sm tracking-[0.02em] text-muted-foreground"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="mt-3 inline-block rounded-sm bg-primary px-6 py-2.5 text-base font-semibold tracking-wide text-primary-foreground transition-opacity hover:opacity-85"
          >
            Invest With Us
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
