import { type ReactNode } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LegalPageLayoutProps {
  title: string;
  description: string;
  path: string;
  heading: string;
  lastUpdated?: string;
  children: ReactNode;
}

const LegalPageLayout = ({
  title,
  description,
  path,
  heading,
  lastUpdated,
  children,
}: LegalPageLayoutProps) => {
  const canonical = `https://brightcap.capital${path}`;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
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

          <h1 className="mt-8 text-3xl font-semibold tracking-[-0.02em] text-foreground md:text-[2.75rem] md:leading-[1.1]">
            {heading}
          </h1>

          {lastUpdated && (
            <p className="mt-4 font-sans text-sm text-muted-foreground">{lastUpdated}</p>
          )}

          <div className="mt-12 space-y-10">{children}</div>

          <div className="mt-16 border-t border-border pt-8">
            <Link
              to="/"
              className="inline-block font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
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

export const LegalSection = ({
  heading,
  children,
}: {
  heading?: string;
  children: ReactNode;
}) => (
  <section className="space-y-4">
    {heading && (
      <h2 className="text-xl font-semibold tracking-[-0.01em] text-foreground md:text-2xl">
        {heading}
      </h2>
    )}
    {children}
  </section>
);

export const LegalSubheading = ({ children }: { children: ReactNode }) => (
  <h3 className="pt-2 font-sans text-base font-bold text-foreground">{children}</h3>
);

export const P = ({ children }: { children: ReactNode }) => (
  <p className="font-sans text-base leading-relaxed text-foreground/80">{children}</p>
);

export const UL = ({ children }: { children: ReactNode }) => (
  <ul className="list-disc space-y-2 pl-5 font-sans text-base leading-relaxed text-foreground/80">
    {children}
  </ul>
);

export const A = ({ href, children }: { href: string; children: ReactNode }) => {
  const external = href.startsWith("http");
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 transition-colors hover:text-primary"
      >
        {children}
      </a>
    );
  }
  return (
    <Link to={href} className="underline underline-offset-2 transition-colors hover:text-primary">
      {children}
    </Link>
  );
};

export const MailLink = ({ email }: { email: string }) => (
  <a
    href={`mailto:${email}`}
    className="underline underline-offset-2 transition-colors hover:text-primary"
  >
    {email}
  </a>
);

export const TelLink = ({ tel, href }: { tel: string; href: string }) => (
  <a href={href} className="underline underline-offset-2 transition-colors hover:text-primary">
    {tel}
  </a>
);

export default LegalPageLayout;
