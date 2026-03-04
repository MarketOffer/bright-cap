import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import OpportunitySection from "@/components/OpportunitySection";
import HowItWorksSection from "@/components/HowItWorksSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import NavbarCTAVariants from "@/components/NavbarCTAVariants";

const Index = () => (
  <>
    <Navbar />
    <HeroSection />
    <NavbarCTAVariants />
    <OpportunitySection />
    <HowItWorksSection />
    <AboutSection />
    <ContactSection />
    <Footer />
  </>
);

export default Index;
