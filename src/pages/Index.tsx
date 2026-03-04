import Navbar from "@/components/Navbar";
import HeroVariantContained from "@/components/HeroVariantContained";
import HeroSection from "@/components/HeroSection";
import OpportunitySection from "@/components/OpportunitySection";
import HowItWorksSection from "@/components/HowItWorksSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => (
  <>
    <Navbar />
    {/* VARIANT A: Side-by-side split */}
    <HeroSection />
    <div className="border-t border-border mx-6 md:mx-16 lg:mx-24" />
    <p className="text-center text-sm text-muted-foreground py-4">↑ Option A: Side-by-side split &nbsp;|&nbsp; ↓ Option B: Contained image block</p>
    <div className="border-b border-border mx-6 md:mx-16 lg:mx-24" />
    {/* VARIANT B: Contained image block */}
    <HeroVariantContained />
    <OpportunitySection />
    <HowItWorksSection />
    <AboutSection />
    <ContactSection />
    <Footer />
  </>
);

export default Index;
