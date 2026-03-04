import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import HeroSectionVideo from "@/components/HeroSectionVideo";
import OpportunitySection from "@/components/OpportunitySection";
import CambridgeSection from "@/components/CambridgeVariantPhotoFirst";
import CambridgeVariantVideo from "@/components/CambridgeVariantVideo";
import HowItWorksSection from "@/components/HowItWorksSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => (
  <>
    <Navbar />

    {/* Hero A — Original (still photo) */}
    <div className="relative">
      <div className="absolute top-4 left-4 z-10 rounded bg-foreground/80 px-3 py-1 text-xs font-semibold text-background">Hero A — Still Photo</div>
      <HeroSection />
    </div>

    {/* Hero B — Video */}
    <div className="relative">
      <div className="absolute top-4 left-4 z-10 rounded bg-foreground/80 px-3 py-1 text-xs font-semibold text-background">Hero B — Video</div>
      <HeroSectionVideo />
    </div>

    <OpportunitySection />

    {/* Cambridge A — Photo first card */}
    <div className="relative">
      <div className="absolute top-4 left-4 z-10 rounded bg-foreground/80 px-3 py-1 text-xs font-semibold text-background">Cambridge A — Still Photo</div>
      <CambridgeSection />
    </div>

    {/* Cambridge B — Video first card */}
    <div className="relative">
      <div className="absolute top-4 left-4 z-10 rounded bg-foreground/80 px-3 py-1 text-xs font-semibold text-background">Cambridge B — Video</div>
      <CambridgeVariantVideo />
    </div>

    <HowItWorksSection />
    <AboutSection />
    <ContactSection />
    <Footer />
  </>
);

export default Index;
