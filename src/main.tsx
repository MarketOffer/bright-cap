import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

// Static <head> tags in index.html exist for non-JS crawlers. Once React
// (Helmet) takes over the head, drop them so no tag is duplicated.
document
  .querySelectorAll("head meta[data-static-head]")
  .forEach((el) => el.remove());

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>,
);
