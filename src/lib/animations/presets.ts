/**
 * Advanced Animation Presets
 * Complex animations for specific UI patterns and components
 */

import { Variants } from 'framer-motion';
import { easings, durations } from './core';

// Text reveal animations
export const textRevealVariants: Record<string, Variants> = {
  // Letter by letter reveal
  letterReveal: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.03,
      },
    },
  },
  
  // Word by word reveal
  wordReveal: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
  
  // Line by line reveal
  lineReveal: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  },
};

// Text child variants
export const textChildVariants: Record<string, Variants> = {
  letter: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
  
  word: {
    initial: { opacity: 0, y: 10, filter: 'blur(8px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  },
  
  line: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
  },
};

// Transition configurations for text animations
export const textTransitionConfigs = {
  letter: { duration: durations.fast, ease: easings.easeOut },
  word: { duration: durations.normal, ease: easings.easeOut },
  line: { duration: durations.normal, ease: easings.easeOut },
};

// Card animations
export const cardVariants: Record<string, Variants> = {
  // 3D flip card
  flip3D: {
    initial: { rotateY: 0 },
    animate: { rotateY: 0 },
    hover: { rotateY: 180 },
  },
  
  // Tilt on hover
  tilt: {
    initial: { rotateX: 0, rotateY: 0 },
    hover: { 
      rotateX: -5, 
      rotateY: 5,
    },
  },
  
  // Floating effect
  float: {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
  
  // Morph on hover
  morph: {
    initial: { borderRadius: '8px' },
    hover: { 
      borderRadius: '20px',
      scale: 1.05,
      transition: { duration: durations.normal },
    },
  },
};

// Button animations
export const buttonVariants: Record<string, Variants> = {
  // Pulse effect
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
  
  // Shine effect
  shine: {
    initial: { backgroundPosition: '-200% 0' },
    animate: {
      backgroundPosition: '200% 0',
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  },
  
  // Ripple on tap
  ripple: {
    tap: {
      scale: 0.95,
      transition: { duration: durations.instant },
    },
  },
  
  // Magnetic hover
  magnetic: {
    hover: {
      x: 0,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 150,
        damping: 15,
      },
    },
  },
};

// Loading animations
export const loadingVariants: Record<string, Variants> = {
  // Spinning dots
  dots: {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [1, 0.5, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'easeInOut',
        times: [0, 0.5, 1],
        repeatDelay: 0.2,
      },
    },
  },
  
  // Progress bar
  progress: {
    initial: { scaleX: 0 },
    animate: { scaleX: 1 },
  },
  
  // Skeleton pulse
  skeleton: {
    animate: {
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
};

// Modal/Overlay animations
export const modalVariants: Record<string, Variants> = {
  // Backdrop
  backdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  
  // Modal content - scale up
  scaleUp: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
  },
  
  // Modal content - slide up
  slideUp: {
    initial: { y: 100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 100, opacity: 0 },
  },
  
  // Modal content - drawer from side
  drawer: {
    initial: { x: '100%' },
    animate: { x: 0 },
    exit: { x: '100%' },
  },
};

// Navigation animations
export const navVariants: Record<string, Variants> = {
  // Mobile menu
  mobileMenu: {
    initial: { height: 0, opacity: 0 },
    animate: { height: 'auto', opacity: 1 },
    exit: { height: 0, opacity: 0 },
  },
  
  // Menu items stagger
  menuItems: {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  },
  
  // Active indicator
  activeIndicator: {
    initial: { scale: 0 },
    animate: { scale: 1 },
  },
};

// Parallax scroll effects
export const parallaxVariants = {
  slow: {
    y: [0, -50],
    transition: { ease: 'linear' },
  },
  
  medium: {
    y: [0, -100],
    transition: { ease: 'linear' },
  },
  
  fast: {
    y: [0, -200],
    transition: { ease: 'linear' },
  },
  
  reverse: {
    y: [0, 50],
    transition: { ease: 'linear' },
  },
};

// Glassmorphism animations
export const glassVariants: Record<string, Variants> = {
  // Glass hover effect
  hover: {
    initial: {
      backdropFilter: 'blur(10px)',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    hover: {
      backdropFilter: 'blur(20px)',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      transition: { duration: durations.normal },
    },
  },
  
  // Glass morphing
  morph: {
    animate: {
      backdropFilter: ['blur(10px)', 'blur(20px)', 'blur(10px)'],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
};

// Advanced interaction animations
export const interactionVariants: Record<string, Variants> = {
  // Drag indicator
  draggable: {
    drag: {
      scale: 1.1,
      transition: { duration: durations.instant },
    },
  },
  
  // Swipe hint
  swipeHint: {
    animate: {
      x: [0, 20, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
  
  // Focus ring
  focusRing: {
    initial: { scale: 0.95, opacity: 0 },
    focus: {
      scale: 1,
      opacity: 1,
      transition: { duration: durations.fast },
    },
  },
};

// Notification animations
export const notificationVariants: Record<string, Variants> = {
  // Toast slide in
  toast: {
    initial: { x: 300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 300, opacity: 0 },
  },
  
  // Alert shake
  alert: {
    animate: {
      x: [-10, 10, -10, 10, 0],
      transition: { duration: 0.5 },
    },
  },
  
  // Success check
  success: {
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0 },
  },
};