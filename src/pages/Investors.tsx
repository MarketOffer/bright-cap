import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeIn from "@/components/FadeIn";

const canonical = "https://brightcap.capital/investors";

// Temporarily hidden — set to true to restore these sections.
const SHOW_DETAIL_SECTIONS = false;

const credentials = [
  {
    title: "Operators, not allocators",
    body: "We source, acquire and manage residential blocks ourselves. Refurbishment, letting and ongoing management are handled in-house rather than outsourced to third parties.",
  },
  {
    title: "One market, understood deeply",
    body: "Cambridge and its immediate travel-to-work area. A single, well-understood market allows us to judge stock, streets and tenant demand on evidence rather than assumption.",
  },
  {
    title: "Institutional discipline, private scale",
    body: "Legal, valuation and building surveys on every acquisition, structured through group companies and selected joint ventures with clear governance.",
  },
];

const strategy = [
  {
    step: "01",
    title: "Source",
    body: "Off-market and under-managed residential blocks identified through long-standing local relationships with agents, landlords and vendors.",
  },
  {
    step: "02",
    title: "Improve",
    body: "Planned refurbishment programmes that raise the standard of the accommodation and the quality of the tenancy.",
  },
  {
    step: "03",
    title: "Operate",
    body: "Long-term ownership and active management, with reporting to partners throughout the holding period.",
  },
];

const Investors = () => {
  const title = "Investors | BrightCap";
  const description =
    "BrightCap, a trading name of RM Incorporations Ltd, acquires and operates residential blocks in Cambridge. Credentials, strategy and team for prospective investment partners.";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
      </Helmet>

      <Navbar />

      <main className="px-6 pb-24 pt-32 md:px-10 md:pt-40">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/"
            className="inline-block font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to BrightCap
          </Link>

          <FadeIn>
            <p className="mt-8 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Investing alongside BrightCap
            </p>

            <h1 className="mt-5 text-3xl font-semibold tracking-[-0.01em] text-foreground md:text-4xl">
              Self-certify your investor status
            </h1>

            <p className="mt-6 font-sans text-lg leading-relaxed text-secondary">
              BrightCap acquires and operates residential blocks in Cambridge, directly and through
              joint ventures with a small number of partners.
            </p>

            <p className="mt-6 font-sans text-lg font-semibold leading-relaxed text-foreground">
              Complete the short statement below and we'll email you our current investment summary.
            </p>

            <p className="mt-6 font-sans leading-relaxed text-secondary">
              UK financial promotion rules mean we can only send investment details to individuals
              who have self-certified their investor status. It's a short declaration you make about
              yourself. There are two routes:
            </p>

            <ol className="mt-4 list-decimal space-y-2 pl-5 font-sans leading-relaxed text-secondary">
              <li>
                <strong className="font-semibold text-foreground">Income or assets</strong> — based
                on your income or net assets in the last financial year
              </li>
              <li>
                <strong className="font-semibold text-foreground">
                  Investment or business experience
                </strong>{" "}
                — based on your professional or investing background. This route doesn't ask about
                your finances.
              </li>
            </ol>

            <p className="mt-6 font-sans leading-relaxed text-secondary">
              Takes about two minutes.
            </p>

            <p className="mt-4 font-sans leading-relaxed text-secondary">
              You'll also be registered for 12 months, so we can share future opportunities directly
              without repeating this step.
            </p>

            <Link
              to="/investors/eligibility"
              className="mt-8 inline-block rounded-full bg-primary px-8 py-3 font-sans text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Start self-certification
            </Link>
          </FadeIn>



          <FadeIn>
            <p className="mt-16 font-sans text-sm leading-relaxed text-muted-foreground">
              This page is provided for information only. It is not an invitation or inducement to
              engage in investment activity and nothing on it should be relied upon as advice.
              Investing in property places your capital at risk.
            </p>
          </FadeIn>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Investors;
