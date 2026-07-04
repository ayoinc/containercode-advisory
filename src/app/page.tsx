import { ScrollSplitHero } from '@/components/sections/scroll-split-hero';
import { ProfessionalServicesOverview } from '@/components/sections/professional-services-overview';
import { FeatureSection } from '@/components/sections/feature-section';
import { CapabilitiesShowcase } from '@/components/sections/capabilities-showcase';
import { TestimonialSection } from '@/components/sections/testimonial-section';
import { CtaSection } from '@/components/sections/cta-section';

export default function Home() {
  return (
    <>
      <ScrollSplitHero />
      <ProfessionalServicesOverview />
      <FeatureSection />
      <CapabilitiesShowcase />
      <TestimonialSection />
      <CtaSection />
    </>
  );
}
