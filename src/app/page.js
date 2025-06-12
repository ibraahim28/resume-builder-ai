import HeroSection from "./landingComponents/HeroSection";
import TrustedBySection from "./landingComponents/TrustedBySection";
import HowItWorksSection from "./landingComponents/HowItWorksSection";
import FeaturesSection from "./landingComponents/FeaturesSection";
import BenefitsSection from "./landingComponents/BenefitsSection";
import TestimonialsSection from "./landingComponents/TestimonialsSection";
import FAQSection from "./landingComponents/FAQSection";
import Footer from "./(main)/_components/Footer";
import ScrollToTop from "./landingComponents/ScrollToTop";
import LandingLayout from "./landingComponents/LandingLayout";
import Navbar from "./(main)/_components/Navbar";

export default function Home() {
  return (
    <div className="antialiased">
      <LandingLayout>
        <Navbar />
        <main className="relative z-10 overflow-x-hidden">
          <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(255,255,255,0))]"></div>
          <HeroSection />
          <TrustedBySection />
          <HowItWorksSection />
          <FeaturesSection />
          <BenefitsSection />
          <TestimonialsSection />
          <FAQSection />
        </main>
        <Footer />
        <ScrollToTop />
      </LandingLayout>
    </div>
  );
}
