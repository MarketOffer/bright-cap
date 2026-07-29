import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const canonical = "https://brightcap.capital/investors/eligibility";

const InvestorEligibility = () => (
  <>
    <Helmet>
      <title>Investor Eligibility | BrightCap</title>
      <meta
        name="description"
        content="Confirm your investor status before BrightCap can share investment information with you."
      />
      <meta name="robots" content="noindex, follow" />
      <link rel="canonical" href={canonical} />
    </Helmet>

    <Navbar />

    <main className="px-6 pb-24 pt-32 md:px-10 md:pt-40">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/investors"
          className="inline-block font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to investors
        </Link>

        <h1 className="mt-8 text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
          Investor eligibility
        </h1>

        <p className="mt-6 font-sans text-lg leading-relaxed text-secondary">
          The eligibility statement is being finalised. Once it is live you will be able to certify
          your status as a high-net-worth or self-certified sophisticated investor and receive our
          investment summary.
        </p>

        <p className="mt-4 font-sans leading-relaxed text-secondary">
          In the meantime, please{" "}
          <Link to="/contact" className="text-foreground underline underline-offset-4">
            contact us
          </Link>{" "}
          and we will let you know as soon as it opens.
        </p>
      </div>
    </main>

    <Footer />
  </>
);

export default InvestorEligibility;
