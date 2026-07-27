import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import LogoStrip from "@/components/LogoStrip";
import OpportunitySection from "@/components/OpportunitySection";
import CambridgeSection from "@/components/CambridgeVariantVideo";
import WhatWeAcquireTimeline from "@/components/WhatWeAcquireTimeline";
import ConstructionSection from "@/components/ConstructionSection";
import InvestorProfileSection from "@/components/InvestorProfileSection";
import FoundersSection from "@/components/FoundersSection";
import TestimonialSection from "@/components/TestimonialSection";
import InvestCTASection from "@/components/InvestCTASection";
import CalBookingSection from "@/components/CalBookingSection";

import Footer from "@/components/Footer";

const Index = () => (
  <>
    <Helmet>
      <title>BrightCap | Cambridge Residential Property Partnerships</title>
      <meta
        name="description"
        content="BrightCap, a trading name of RM Incorporations Ltd, acquires and operates residential blocks in Cambridge through group companies and selected joint ventures."
      />
      <link rel="canonical" href="https://brightcap.capital/" />
      <meta property="og:title" content="BrightCap | Cambridge Residential Property Partnerships" />
      <meta
        property="og:description"
        content="BrightCap, a trading name of RM Incorporations Ltd, acquires and operates residential blocks in Cambridge through group companies and selected joint ventures."
      />
      <meta property="og:url" content="https://brightcap.capital/" />
    </Helmet>
    <Navbar />
    <main>
      <HeroSection />
      <LogoStrip />
      <OpportunitySection />
      <CambridgeSection />
      <WhatWeAcquireTimeline />
      <ConstructionSection />
      <InvestorProfileSection />
      <FoundersSection />
      <TestimonialSection />
      <InvestCTASection />
      <CalBookingSection />
    </main>
    <Footer />
  </>
);

export default Index;
