import { ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LegalPageProps {
  title: string;
  description: string;
  path: string;
  lastUpdated?: string;
  children: ReactNode;
}

const LegalPage = ({ title, description, path, lastUpdated, children }: LegalPageProps) => {
  const canonical = `https://brightcap.capital${path}`;

  return (
    <>
      <Helmet>
        <title>{`${title} | BrightCap`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={`${title} | BrightCap`} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
      </Helmet>
      <Navbar />
      <main className="px-6 pb-24 pt-32 md:px-10 md:pt-40">
        <div className="mx-auto max-w-[46rem]">
          <Link
            to="/"
            className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to BrightCap
          </Link>

          <h1 className="mt-8 text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
            {title}
          </h1>
          {lastUpdated && (
            <p className="mt-4 font-sans text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
          )}

          <div className="legal-copy mt-12 space-y-6 font-sans text-base leading-relaxed text-muted-foreground [&_a]:text-foreground [&_a]:underline hover:[&_a]:text-primary [&_h2]:mt-14 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-[-0.01em] [&_h2]:text-foreground [&_h3]:mt-10 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_li]:leading-relaxed [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6">
            {children}
          </div>

          <div className="mt-16 border-t border-border pt-8">
            <Link
              to="/"
              className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Back to BrightCap
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default LegalPage;
