import brightcapLogo from "@/assets/brightcap_logo.svg";

const Footer = () => (
  <footer className="border-t border-border px-6 py-12 md:px-10">
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <img src={brightcapLogo} alt="brightcap" className="h-4" />
        <div className="flex items-center gap-6">
          <span className="font-sans text-xs text-muted-foreground">© 2025 brightcap</span>
          <a href="#" className="font-sans text-xs text-muted-foreground transition-colors hover:text-foreground">
            Privacy Policy
          </a>
        </div>
      </div>
      <div className="mt-8 max-w-xl space-y-2">
        <p className="font-sans text-[11px] italic leading-relaxed text-muted-foreground">
          brightcap does not provide regulated financial advice. Co-investment opportunities are available to sophisticated and high net worth investors only.
        </p>
        <p className="font-sans text-[11px] italic leading-relaxed text-muted-foreground">
          ¹ Testimonial relates to a project delivered by our founder's construction and property business, prior to the launch of BrightCap.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
