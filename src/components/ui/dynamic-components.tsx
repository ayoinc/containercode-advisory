
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy load framer-motion components
export const MotionDiv = dynamic(
  () => import('framer-motion').then(mod => ({ default: mod.motion.div })),
  { 
    ssr: false,
    loading: () => <div className="animate-pulse" />
  }
);

export const MotionSection = dynamic(
  () => import('framer-motion').then(mod => ({ default: mod.motion.section })),
  { 
    ssr: false,
    loading: () => <section className="animate-pulse" />
  }
);

export const AnimatePresence = dynamic(
  () => import('framer-motion').then(mod => ({ default: mod.AnimatePresence })),
  { 
    ssr: false,
    loading: () => <div />
  }
);

// Heavy form components can be loaded dynamically when needed
// For now, focus on framer-motion components which are the largest bundle impact

// Wrapper component with Suspense
export const LazyMotionWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className="animate-pulse h-32" />}>
    {children}
  </Suspense>
);
