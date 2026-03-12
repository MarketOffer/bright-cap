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
      <div className="mt-8 max-w-xl space-y-3">
        <p className="font-sans text-[11px] leading-relaxed text-muted-foreground">
          BrightCap does not provide regulated financial or investment advice. This website is for information purposes only and does not constitute an offer to invest.
        </p>
        <p className="font-sans text-[11px] leading-relaxed text-muted-foreground">
          From time to time, opportunities to invest in property projects originated by our team may be discussed privately with suitable investors and will be subject to separate documentation.
        </p>
        <p className="font-sans text-[11px] leading-relaxed text-muted-foreground">
          Property investments involve risk and the value of investments can go down as well as up. Past performance is not a reliable indicator of future results.
        </p>
        <p className="font-sans text-[11px] leading-relaxed text-muted-foreground">
          BrightCap is a trading name of Real Marketplace Ltd, a company registered in England and Wales (Company No. 14456959). Registered Office: The Offices, 53 King Street, Manchester, England, M2 4LQ.
        </p>
        <p className="font-sans text-[11px] italic leading-relaxed text-muted-foreground">
          <sup>1</sup> Sources: ONS UK House Price Index, WIPO Global Innovation Index, Cambridge Ahead / CBR, Complete University Guide.
        </p>
        <p className="font-sans text-[11px] italic leading-relaxed text-muted-foreground">
          <sup>2</sup> Testimonial relates to a project delivered by our founder's construction and property business prior to the launch of BrightCap.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
