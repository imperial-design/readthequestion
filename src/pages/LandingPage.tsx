import { HeroSection } from '../components/landing/HeroSection';
import { ProblemSection } from '../components/landing/ProblemSection';
import { ClearMethodSection } from '../components/landing/ClearMethodSection';
import { JourneySection } from '../components/landing/JourneySection';
import { StorySection } from '../components/landing/StorySection';
import { PricingSection } from '../components/landing/PricingSection';
import { FaqSection } from '../components/landing/FaqSection';
import { FinalCtaSection } from '../components/landing/FinalCtaSection';
import { LandingFooter } from '../components/landing/LandingFooter';
import { StickyCtaBar } from '../components/landing/StickyCtaBar';

export function LandingPage() {
  return (
    <div className="min-h-screen pb-20">
      <HeroSection />
      <ProblemSection />
      <ClearMethodSection />
      <JourneySection />
      <StorySection />
      <PricingSection />
      <FaqSection />
      <FinalCtaSection />
      <LandingFooter />
      <StickyCtaBar />
    </div>
  );
}
