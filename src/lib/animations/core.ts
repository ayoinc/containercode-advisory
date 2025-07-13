/**
 * Core Animation System
 * Provides reusable animations, variants, and hooks for Framer Motion
 */

import { Variants, Transition, TargetAndTransition } from 'framer-motion';

// Animation timing functions
export const easings = {
  easeOut: [0.16, 1, 0.3, 1],
  easeIn: [0.55, 0, 1, 0.45],
  easeInOut: [0.85, 0, 0.15, 1],
  spring: { type: 'spring', stiffness: 400, damping: 30 } as const,
  smooth: { type: 'spring', stiffness: 100, damping: 20 } as const,
  bounce: { type: 'spring', stiffness: 600, damping: 15 } as const,
} as const;

// Standard animation durations
export const durations = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
  slowest: 1.2,
} as const;

// Fade animations
export const fadeAnimations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: durations.normal },
  },
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: durations.normal, ease: easings.easeOut },
  },
  fadeInDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: durations.normal, ease: easings.easeOut },
  },
  fadeInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: durations.normal, ease: easings.easeOut },
  },
  fadeInRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: durations.normal, ease: easings.easeOut },
  },
};

// Scale animations
export const scaleAnimations = {
  scaleIn: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
    transition: { duration: durations.normal, ease: easings.easeOut },
  },
  scaleUp: {
    initial: { scale: 0 },
    animate: { scale: 1 },
    exit: { scale: 0 },
    transition: easings.spring,
  },
  pop: {
    initial: { scale: 0 },
    animate: { scale: 1 },
    exit: { scale: 0 },
    transition: easings.bounce,
  },
};

// Slide animations
export const slideAnimations = {
  slideInLeft: {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
    transition: { duration: durations.normal, ease: easings.easeOut },
  },
  slideInRight: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
    transition: { duration: durations.normal, ease: easings.easeOut },
  },
  slideInTop: {
    initial: { y: '-100%' },
    animate: { y: 0 },
    exit: { y: '-100%' },
    transition: { duration: durations.normal, ease: easings.easeOut },
  },
  slideInBottom: {
    initial: { y: '100%' },
    animate: { y: 0 },
    exit: { y: '100%' },
    transition: { duration: durations.normal, ease: easings.easeOut },
  },
};

// Container animations for staggered children
export const containerVariants: Record<string, Variants> = {
  stagger: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
    exit: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  },
  staggerFast: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  },
  staggerSlow: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  },
};

// Item variants for use with container variants
export const itemVariants: Record<string, Variants> = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
};

// Page transition variants
export const pageTransitions: Record<string, Variants> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -100 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  },
};

// Separate transition configurations for page transitions
export const pageTransitionConfigs = {
  fade: { duration: durations.normal },
  slideUp: { duration: durations.slow, ease: easings.easeOut },
  slideLeft: { duration: durations.slow, ease: easings.easeOut },
};

// Hover animations
export const hoverVariants: Record<string, TargetAndTransition> = {
  scale: { scale: 1.05 },
  scaleRotate: { scale: 1.05, rotate: 2 },
  lift: { y: -5 },
  glow: { boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
  darken: { filter: 'brightness(0.9)' },
  brighten: { filter: 'brightness(1.1)' },
};

// Tap animations
export const tapVariants: Record<string, TargetAndTransition> = {
  scale: { scale: 0.95 },
  press: { scale: 0.98, y: 1 },
};

// Scroll-triggered animations
export const scrollVariants: Record<string, Variants> = {
  fadeInView: {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
  },
  slideInView: {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
  },
  scaleInView: {
    initial: { opacity: 0, scale: 0.8 },
    whileInView: { opacity: 1, scale: 1 },
  },
};

// Separate configurations for scroll animations
export const scrollConfigs = {
  viewport: { once: true, margin: '-100px' },
  transition: { duration: durations.normal, ease: easings.easeOut },
};

// Utility function to create custom variants
export function createVariant(
  initial: any,
  animate: any,
  exit?: any,
  transition?: Transition
): Variants {
  return {
    initial,
    animate,
    ...(exit && { exit }),
    ...(transition && { transition }),
  };
}

// Delay utility
export function withDelay(animation: any, delay: number) {
  return {
    ...animation,
    transition: {
      ...animation.transition,
      delay,
    },
  };
}

// Create stagger delay for list items
export function staggerDelay(index: number, baseDelay: number = 0.1) {
  return index * baseDelay;
}

// Responsive animation values
export function responsiveValue<T>(
  mobile: T,
  tablet: T,
  desktop: T
): T {
  if (typeof window === 'undefined') return desktop;
  
  const width = window.innerWidth;
  if (width < 640) return mobile;
  if (width < 1024) return tablet;
  return desktop;
}

// Performance-optimized animation settings
export const performanceSettings = {
  // Reduce motion for users who prefer it
  reducedMotion: {
    transition: { duration: 0.01 },
  },
  
  // GPU-accelerated properties only
  gpuOptimized: {
    transform: true,
    opacity: true,
    filter: true,
  },
  
  // Layout animation settings
  layout: {
    type: 'spring',
    stiffness: 350,
    damping: 25,
  },
};

// Animation hook for reduced motion
export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = React.useState(false);
  
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return reducedMotion;
}

// Export React for hooks
import * as React from 'react';