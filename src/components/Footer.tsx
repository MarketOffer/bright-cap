import brightcapLogo from "@/assets/brightcap_logo.svg";
import { company, currentYear } from "@/config/company";

const Footer = () => (
  <footer className="border-t border-border px-6 py-12 md:px-10">
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
        <img src={brightcapLogo} alt="brightcap" className="h-4" />

        <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
          {/* Terms & Policies */}
          <div className="space-y-2">
            <h4 className="font-sans text-xs font-semibold text-foreground">Terms &amp; Policies</h4>
            <a href="#" className="block font-sans text-xs text-muted-foreground transition-colors hover:text-foreground">
              Privacy Policy
            </a>
            <a href="#" className="block font-sans text-xs text-muted-foreground transition-colors hover:text-foreground">
              Web Terms
            </a>
          </div>

          {/* Contact Us */}
          <div className="space-y-2">
            <h4 className="font-sans text-xs font-semibold text-foreground">Contact Us</h4>
            <a href={company.telephoneHref} className="block font-sans text-xs text-muted-foreground transition-colors hover:text-foreground">
              {company.telephone}
            </a>
            <a href={`mailto:${company.email}`} className="block font-sans text-xs text-muted-foreground transition-colors hover:text-foreground">
              {company.email}
            </a>
            <a href="/contactus" className="block font-sans text-xs text-muted-foreground transition-colors hover:text-foreground">

              Full Contact Details
            </a>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <span className="font-sans text-xs text-muted-foreground">© {currentYear} BrightCap</span>
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
          {company.legalDisclosure}
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
