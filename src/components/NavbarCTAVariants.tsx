import brightcapLogo from "@/assets/brightcap_logo.svg";

const navLinks = [
  { label: "Opportunity", href: "#opportunity" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
];

const VariantA = () => (
  <div className="border border-border rounded-lg p-6">
    <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Variant A — Bolder weight (font-bold)</p>
    <div className="flex items-center justify-between bg-background py-4 px-6 rounded">
      <img src={brightcapLogo} alt="brightcap" className="h-6" />
      <div className="flex items-center gap-10">
        {navLinks.map((link) => (
          <span key={link.label} className="text-sm tracking-[0.02em] text-muted-foreground">{link.label}</span>
        ))}
        <a href="#contact" className="rounded-sm bg-primary px-6 py-2.5 text-sm font-bold tracking-wide text-primary-foreground">
          Invest With Us
        </a>
      </div>
    </div>
  </div>
);

const VariantB = () => (
  <div className="border border-border rounded-lg p-6">
    <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Variant B — Tighter padding (px-5 py-2)</p>
    <div className="flex items-center justify-between bg-background py-4 px-6 rounded">
      <img src={brightcapLogo} alt="brightcap" className="h-6" />
      <div className="flex items-center gap-10">
        {navLinks.map((link) => (
          <span key={link.label} className="text-sm tracking-[0.02em] text-muted-foreground">{link.label}</span>
        ))}
        <a href="#contact" className="rounded-sm bg-primary px-5 py-2 text-sm font-semibold tracking-wide text-primary-foreground">
          Invest With Us
        </a>
      </div>
    </div>
  </div>
);

const VariantC = () => (
  <div className="border border-border rounded-lg p-6">
    <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Variant C — Larger text (text-base)</p>
    <div className="flex items-center justify-between bg-background py-4 px-6 rounded">
      <img src={brightcapLogo} alt="brightcap" className="h-6" />
      <div className="flex items-center gap-10">
        {navLinks.map((link) => (
          <span key={link.label} className="text-sm tracking-[0.02em] text-muted-foreground">{link.label}</span>
        ))}
        <a href="#contact" className="rounded-sm bg-primary px-6 py-2.5 text-base font-semibold tracking-wide text-primary-foreground">
          Invest With Us
        </a>
      </div>
    </div>
  </div>
);

const NavbarCTAVariants = () => (
  <section className="px-6 py-20 md:px-16 lg:px-24 space-y-8 border-t border-border bg-muted/30">
    <h2 className="text-2xl font-semibold tracking-[-0.02em] text-foreground">CTA Button Comparison</h2>
    <VariantA />
    <VariantB />
    <VariantC />
  </section>
);

export default NavbarCTAVariants;
