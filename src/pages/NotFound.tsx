import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  const canonical = `https://cambridge-capital-flow.lovable.app${location.pathname}`;

  return (
    <>
      <Helmet>
        <title>Page not found (404) | BrightCap</title>
        <meta
          name="description"
          content="The page you're looking for doesn't exist. Return to the BrightCap homepage to explore Cambridge property co-investment opportunities."
        />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content="Page not found (404) | BrightCap" />
        <meta
          property="og:description"
          content="The page you're looking for doesn't exist. Return to the BrightCap homepage."
        />
        <meta property="og:url" content={canonical} />
      </Helmet>
      <div className="flex min-h-screen items-center justify-center bg-muted">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">404</h1>
          <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
          <a href="/" className="text-primary underline hover:text-primary/90">
            Return to Home
          </a>
        </div>
      </div>
    </>
  );
};

export default NotFound;
