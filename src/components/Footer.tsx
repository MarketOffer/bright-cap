import { Link } from "react-router-dom";
import brightcapLogo from "@/assets/brightcap_logo.svg";
import { company, currentYear } from "@/config/company";

const Footer = () => (
  <footer className="border-t border-border px-6 py-12 md:px-10">
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
        <Link to="/">
          <img src={brightcapLogo} alt="brightcap" className="h-4" />
        </Link>

        <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
          {/* Terms & Policies */}
          <div className="space-y-2">
            <h4 className="font-sans text-xs font-semibold text-foreground">Terms &amp; Policies</h4>
            <Link to="/privacy" className="block font-sans text-xs text-muted-foreground transition-colors hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="/terms" className="block font-sans text-xs text-muted-foreground transition-colors hover:text-foreground">
              Web Terms
            </Link>
            <Link to="/cookies" className="block font-sans text-xs text-muted-foreground transition-colors hover:text-foreground">
              Cookies
            </Link>
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
            <Link to="/contact" className="block font-sans text-xs text-muted-foreground transition-colors hover:text-foreground">
              Full Contact Details
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <span className="font-sans text-xs text-muted-foreground">© {currentYear} BrightCap</span>
      </div>

      <div className="mt-8 max-w-xl space-y-3">
        <p className="font-sans text-[11px] leading-relaxed text-muted-foreground">
          BrightCap does not provide regulated financial or investment advice. This public website provides general information about our business and strategy. It is not a personal recommendation or an offer to participate in a specific investment.
        </p>
        <p className="font-sans text-[11px] leading-relaxed text-muted-foreground">
          Any specific opportunity will be communicated separately only to an eligible recipient and will be subject to its own information, due diligence and definitive legal documentation issued by the relevant property-specific company.
        </p>
        <p className="font-sans text-[11px] leading-relaxed text-muted-foreground">
          Property investment is illiquid and involves risk. Capital and returns are not guaranteed, and an investor may receive back less than they invest. Past performance is not a reliable indicator of future results.
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
