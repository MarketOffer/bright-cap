import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import Contact from "./pages/Contact";
import Investors from "./pages/Investors";
import InvestorEligibility from "./pages/InvestorEligibility";
import InvestorSummary from "./pages/InvestorSummary";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminInvestors from "./pages/admin/AdminInvestors";
import AdminStatement from "./pages/admin/AdminStatement";

import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/investors" element={<Investors />} />
          <Route path="/investors/eligibility" element={<InvestorEligibility />} />
          {/* Gated, token-only. Never linked publicly; noindex; excluded from

              sitemap.xml, llms.txt and the prerender pipeline. */}
          <Route path="/investors/summary" element={<InvestorSummary />} />

          {/* Legacy path — permanent client-side redirect */}
          <Route path="/contactus" element={<Navigate to="/contact" replace />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
