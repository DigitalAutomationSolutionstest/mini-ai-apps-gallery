
import React from 'react';
import { StarryBackground } from '@/components/ui/StarryBackground';
import { HeroSection } from '@/components/landing/HeroSection';
import { MiniAppGrid } from '@/components/landing/MiniAppGrid';
import { CustomProjectCTA } from '@/components/landing/CustomProjectCTA';
import { PricingSection } from '@/components/landing/PricingSection';
import { SectionComingSoonApps } from '@/components/landing/SectionComingSoonApps';
import { Footer } from '@/components/landing/Footer';
import { FooterTriangle } from '@/components/landing/FooterTriangle';
import { ParallaxSection } from '@/components/landing/ParallaxSection';
import { ScrollToTop } from '@/components/landing/ScrollToTop';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-animated-mesh">
      <StarryBackground />
      <HeroSection />
      <ParallaxSection />
      <MiniAppGrid />
      <CustomProjectCTA />
      <PricingSection />
      <SectionComingSoonApps />
      <Footer />
      <FooterTriangle />
      <ScrollToTop />
    </div>
  );
};
