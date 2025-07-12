import { Hero } from '@/components/sections/hero';
import { ServicesOverview } from '@/components/sections/services-overview';
import { FeatureSection } from '@/components/sections/feature-section';
import { CaseStudyFeature } from '@/components/sections/case-study-feature';
import { TestimonialSection } from '@/components/sections/testimonial-section';
import { CtaSection } from '@/components/sections/cta-section';

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <FeatureSection />
      <CaseStudyFeature />
      <TestimonialSection />
      <CtaSection />
    </>
  );
}
