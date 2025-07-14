// utils/dynamic-imports.ts
// Lazy load heavy components to reduce initial bundle size

import React from 'react';
import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Loading component for better UX
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

// Framer Motion components (heavy animation library)
export const MotionDiv = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.div })), {
  loading: () => <div />, // Minimal loading for animations
  ssr: false // Disable SSR for animations
});

export const MotionSection = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.section })), {
  loading: () => <div />, 
  ssr: false
});

export const MotionH2 = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.h2 })), {
  loading: () => <h2 />, 
  ssr: false
});

export const MotionP = dynamic(() => import('framer-motion').then(mod => ({ default: mod.motion.p })), {
  loading: () => <p />, 
  ssr: false
});

// Heavy UI components
export const ContactForm = dynamic(() => import('@/components/forms/contact-form'), {
  loading: () => <LoadingSpinner />,
  ssr: true // Keep SSR for forms (SEO)
});

export const NewsletterForm = dynamic(() => import('@/components/forms/newsletter-form'), {
  loading: () => <LoadingSpinner />,
  ssr: true
});

export const NewsletterSubscription = dynamic(() => import('@/components/forms/newsletter-subscription'), {
  loading: () => <LoadingSpinner />,
  ssr: true
});

// Interactive components that don't need immediate loading
export const TestimonialSection = dynamic(() => import('@/components/sections/testimonial-section'), {
  loading: () => <LoadingSpinner />
});

export const FeatureSection = dynamic(() => import('@/components/sections/feature-section'), {
  loading: () => <LoadingSpinner />
});

export const ModernServicesOverview = dynamic(() => import('@/components/sections/modern-services-overview'), {
  loading: () => <LoadingSpinner />
});

export const ProfessionalServicesOverview = dynamic(() => import('@/components/sections/professional-services-overview'), {
  loading: () => <LoadingSpinner />
});

// Modal components (only load when needed)
export const Modal = dynamic(() => import('@/components/ui/modal'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

// Advanced: Intersection Observer for viewport-based loading
import { useInView } from 'react-intersection-observer';

export const ViewportLazyComponent: React.FC<{ children: React.ComponentType; height?: string }> = ({ 
  children: Component, 
  height = 'h-64' 
}) => {
  const { ref, inView } = useInView({
    triggerOnce: true, // Only load once
    threshold: 0.1,    // Load when 10% visible
  });

  return (
    <div ref={ref}>
      {inView ? <Component /> : <div className={height} />} {/* Placeholder height */}
    </div>
  );
};

// Usage with viewport loading:
export const LazyTestimonials = () => (
  <ViewportLazyComponent>
    {() => <TestimonialSection />}
  </ViewportLazyComponent>
);

export const LazyFeatures = () => (
  <ViewportLazyComponent>
    {() => <FeatureSection />}
  </ViewportLazyComponent>
);