import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import OpportunitySection from "@/components/OpportunitySection";
import HowItWorksSection from "@/components/HowItWorksSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import CTAComparison from "@/components/CTAComparison";

const Index = () => (
  <>
    <Navbar />
    <HeroSection />
    <CTAComparison />
    <OpportunitySection />
    <HowItWorksSection />
    <AboutSection />
    <ContactSection />
    <Footer />
  </>
);

export default Index;
