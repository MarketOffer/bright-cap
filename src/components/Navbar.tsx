import { useState, useEffect } from "react";
import brightcapLogo from "@/assets/brightcap_logo.svg";

const navLinks = [
  { label: "Opportunity", href: "#opportunity" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-background transition-shadow duration-300 ${
        scrolled ? "shadow-[0_1px_0_0_hsl(var(--border))]" : ""
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 md:px-10">
        <a href="#">
          <img src={brightcapLogo} alt="brightcap" className="h-4" />
        </a>

        {/* Desktop */}
        <div className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm tracking-[0.02em] transition-colors duration-200 ${
                link.label === "Contact"
                  ? "text-primary font-semibold hover:opacity-80"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block h-px w-6 bg-foreground transition-transform duration-200 ${mobileOpen ? "translate-y-[4px] rotate-45" : ""}`} />
          <span className={`block h-px w-6 bg-foreground transition-opacity duration-200 ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`block h-px w-6 bg-foreground transition-transform duration-200 ${mobileOpen ? "-translate-y-[4px] -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-6 pb-6 md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block py-3 text-sm tracking-[0.02em] ${
                link.label === "Contact"
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
