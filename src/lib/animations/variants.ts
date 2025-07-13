/**
 * Core Animation Variants
 * Reusable animation configurations for Framer Motion
 */

import { Variants, Transition } from 'framer-motion';

// Easing functions
export const easings = {
  easeOutExpo: [0.19, 1, 0.22, 1],
  easeInOutQuart: [0.76, 0, 0.24, 1],
  easeInOutCubic: [0.65, 0, 0.35, 1],
  spring: { type: 'spring', stiffness: 300, damping: 30 },
  smooth: { type: 'spring', stiffness: 100, damping: 20 },
} as const;

// Common transitions
export const transitions = {
  fast: { duration: 0.3, ease: easings.easeInOutCubic },
  medium: { duration: 0.5, ease: easings.easeInOutCubic },
  slow: { duration: 0.8, ease: easings.easeOutExpo },
  spring: easings.spring,
  smooth: easings.smooth,
} as const;

// Fade animations
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

// Scale animations
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

export const scaleInUp: Variants = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: -20 },
};

// Slide animations
export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

// Container animations with stagger
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// Complex animations
export const heroTextReveal: Variants = {
  initial: { 
    opacity: 0,
    y: 50,
    rotateX: -90,
  },
  animate: { 
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.8,
      ease: easings.easeOutExpo,
    },
  },
};

export const morphCard: Variants = {
  initial: { 
    opacity: 0,
    scale: 0.8,
    borderRadius: '50%',
  },
  animate: { 
    opacity: 1,
    scale: 1,
    borderRadius: '1rem',
    transition: {
      duration: 0.6,
      ease: easings.easeInOutQuart,
    },
  },
};

// Hover animations
export const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
};

export const hoverGlow = {
  whileHover: { 
    boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
    transition: { duration: 0.3 },
  },
};

// Page transitions
export const pageTransition: Variants = {
  initial: { 
    opacity: 0,
    y: 20,
  },
  animate: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easings.easeInOutCubic,
    },
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: easings.easeInOutCubic,
    },
  },
};

// Parallax scroll animations
export const parallaxY = (offset: number = 50): Variants => ({
  initial: { y: -offset },
  animate: { 
    y: offset,
    transition: {
      duration: 1,
      ease: 'linear',
    },
  },
});

// 3D card tilt effect
export const tilt3D = {
  whileHover: {
    rotateX: -10,
    rotateY: 10,
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: easings.easeInOutCubic,
    },
  },
};

// Loading animations
export const pulseLoader: Variants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const spinLoader: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Advanced reveal animations
export const textRevealByWord: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const wordAnimation: Variants = {
  initial: {
    opacity: 0,
    y: 50,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easings.easeOutExpo,
    },
  },
};

// Glassmorphism effect animation
export const glassMorph: Variants = {
  initial: {
    backdropFilter: 'blur(0px)',
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  animate: {
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transition: {
      duration: 0.5,
      ease: easings.easeInOutCubic,
    },
  },
};

// Draw SVG path animation
export const drawPath: Variants = {
  initial: {
    pathLength: 0,
    opacity: 0,
  },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { 
        duration: 2,
        ease: easings.easeInOutCubic,
      },
      opacity: { duration: 0.5 },
    },
  },
};

// Floating animation
export const float: Variants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Utility function to create custom variants
export const createVariant = (
  initial: any,
  animate: any,
  exit?: any,
  transition?: Transition
): Variants => ({
  initial,
  animate: { ...animate, transition },
  ...(exit && { exit: { ...exit, transition } }),
});