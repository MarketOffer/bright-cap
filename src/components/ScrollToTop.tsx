import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Scrolls to the top on route change, unless the URL carries a hash target. */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
