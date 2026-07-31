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
            <h1 className="mt-8 text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
              Investing alongside BrightCap
            </h1>
            <p className="mt-6 font-sans text-lg leading-relaxed text-secondary">
              BrightCap acquires and operates residential blocks in Cambridge, directly and through
              joint ventures with a small number of partners.
            </p>
          </FadeIn>

          {SHOW_DETAIL_SECTIONS && (
            <>
              <FadeIn>
                <section className="mt-20">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Credentials
                  </h2>
                  <div className="mt-8 space-y-10">
                    {credentials.map((item) => (
                      <div key={item.title}>
                        <h3 className="text-xl font-semibold tracking-[-0.01em] text-foreground">
                          {item.title}
                        </h3>
                        <p className="mt-3 font-sans leading-relaxed text-secondary">{item.body}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </FadeIn>

              <FadeIn>
                <section className="mt-20">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Track record
                  </h2>
                  <p className="mt-8 font-sans leading-relaxed text-secondary">
                    The founders have acquired, refurbished and let residential property in and
                    around Cambridge over a number of years, alongside careers in property
                    management and development. Blocks are held for the long term and managed by the
                    same team that bought them.
                  </p>
                  <p className="mt-4 font-sans leading-relaxed text-secondary">
                    Details of individual acquisitions, performance and any current opportunity are
                    not published here. They are shared only with investors who have completed the
                    eligibility process below.
                  </p>
                </section>
              </FadeIn>

              <FadeIn>
                <section className="mt-20">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    How we work
                  </h2>
                  <div className="mt-8 space-y-8">
                    {strategy.map((item) => (
                      <div key={item.step} className="flex gap-6">
                        <span className="font-sans text-sm font-semibold text-primary">
                          {item.step}
                        </span>
                        <div>
                          <h3 className="text-xl font-semibold tracking-[-0.01em] text-foreground">
                            {item.title}
                          </h3>
                          <p className="mt-3 font-sans leading-relaxed text-secondary">
                            {item.body}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </FadeIn>
            </>
          )}

          <FadeIn>
            <section className="mt-20 rounded-sm border border-primary/60 p-8 md:p-12">
              <h2 className="text-2xl font-semibold tracking-[-0.01em] text-foreground">
                Check your investor eligibility
              </h2>
              <p className="mt-4 font-sans leading-relaxed text-secondary">
                Investment information can only be shared with individuals who qualify as
                high-net-worth or self-certified sophisticated investors. Completing the short
                eligibility statement lets us send you our investment summary.
              </p>
              <Link
                to="/investors/eligibility"
                className="mt-8 inline-block rounded-full bg-primary px-8 py-3 font-sans text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Check your investor eligibility
              </Link>
            </section>
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
