/**
 * Modern Animation Effects and Micro-interactions
 * Advanced animation system with glassmorphism, particle effects, and gesture-based animations
 */

import { Variants, Transition, TargetAndTransition } from 'framer-motion';
import { easings, durations } from './core';

// Interface definitions for modern effects
interface GlassmorphismEffect {
  backdropFilter: string;
  backgroundColor: string;
  border: string;
  boxShadow: string;
}

interface NeumorphismEffect {
  background: string;
  boxShadow: string;
}

interface AnimationVariant {
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: Transition;
}

interface MicroInteraction {
  [key: string]: TargetAndTransition;
}

// Modern visual effects
export const modernEffects = {
  // Glassmorphism effects
  glassmorphism: {
    light: {
      backdropFilter: 'blur(16px) saturate(180%)',
      backgroundColor: 'rgba(255, 255, 255, 0.75)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    },
    dark: {
      backdropFilter: 'blur(16px) saturate(180%)',
      backgroundColor: 'rgba(17, 25, 40, 0.75)',
      border: '1px solid rgba(255, 255, 255, 0.125)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    },
  },

  // Neumorphism effects
  neumorphism: {
    light: {
      background: 'linear-gradient(145deg, #f0f0f0, #cacaca)',
      boxShadow: '20px 20px 60px #bebebe, -20px -20px 60px #ffffff',
    },
    dark: {
      background: 'linear-gradient(145deg, #2c2c2c, #242424)',
      boxShadow: '20px 20px 60px #1e1e1e, -20px -20px 60px #323232',
    },
  },

  // Gradient animations
  gradientShift: {
    backgroundImage: [
      'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(45deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
    ],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'linear',
    },
  },

  // Holographic effect
  holographic: {
    background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.5) 50%, transparent 70%)',
    backgroundSize: '200% 200%',
    animation: 'shimmer 2s infinite',
  },
};

// Micro-interaction variants
export const microInteractions = {
  // Button interactions
  button: {
    primary: {
      scale: 1,
      boxShadow: '0 4px 15px 0 rgba(31, 38, 135, 0.2)',
      transition: { duration: 0.2 },
    },
    hover: {
      scale: 1.02,
      boxShadow: '0 8px 25px 0 rgba(31, 38, 135, 0.35)',
      y: -2,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.98,
      boxShadow: '0 2px 10px 0 rgba(31, 38, 135, 0.15)',
      y: 0,
      transition: { duration: 0.1 },
    },
  },

  // Card interactions
  card: {
    rest: {
      scale: 1,
      rotateX: 0,
      rotateY: 0,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    },
    hover: {
      scale: 1.02,
      rotateX: 5,
      rotateY: 5,
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      transition: { duration: 0.3, ease: easings.easeOut },
    },
  },

  // Input field interactions
  input: {
    focus: {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
      scale: 1.01,
      transition: { duration: 0.2 },
    },
    error: {
      borderColor: '#ef4444',
      boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)',
      x: [0, -5, 5, -5, 5, 0],
      transition: { duration: 0.5 },
    },
  },

  // Loading indicators
  loading: {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    bounce: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
};

// Advanced page transitions
export const advancedTransitions = {
  // Magnetic page transition
  magnetic: {
    initial: { 
      scale: 0.8, 
      opacity: 0,
      filter: 'blur(10px)',
    },
    animate: { 
      scale: 1, 
      opacity: 1,
      filter: 'blur(0px)',
    },
    exit: { 
      scale: 1.1, 
      opacity: 0,
      filter: 'blur(10px)',
    },
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },

  // Morphing transition
  morph: {
    initial: {
      clipPath: 'circle(0% at 50% 50%)',
      opacity: 0,
    },
    animate: {
      clipPath: 'circle(100% at 50% 50%)',
      opacity: 1,
    },
    exit: {
      clipPath: 'circle(0% at 50% 50%)',
      opacity: 0,
    },
    transition: {
      duration: 0.8,
      ease: easings.easeInOut,
    },
  },

  // Parallax scroll transition
  parallaxScroll: {
    initial: { y: 100, opacity: 0 },
    whileInView: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: easings.easeOut,
      },
    },
    viewport: { 
      once: true, 
      margin: '-10%',
    },
  },
};

// Gesture-based animations
export const gestureAnimations = {
  // Swipe gestures
  swipeCard: {
    drag: 'x' as const,
    dragConstraints: { left: -100, right: 100 },
    dragElastic: 0.2,
    onDragEnd: (event: any, info: any) => {
      if (Math.abs(info.offset.x) > 50) {
        // Handle swipe action
        return info.offset.x > 0 ? 'right' : 'left';
      }
    },
  },

  // Long press
  longPress: {
    initial: { scale: 1 },
    whileTap: { 
      scale: 0.95,
      transition: { duration: 0.1 },
    },
    whileLongPress: {
      scale: 1.05,
      boxShadow: '0 0 0 8px rgba(59, 130, 246, 0.2)',
      transition: { duration: 0.3 },
    },
  },

  // Magnetic attraction
  magnetic: {
    initial: { x: 0, y: 0 },
    whileHover: {
      x: 0,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 10,
      },
    },
  },
};

// Particle effects (using CSS animations)
export const particleEffects = {
  // Floating particles
  floatingParticles: `
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33% { transform: translateY(-10px) rotate(120deg); }
      66% { transform: translateY(5px) rotate(240deg); }
    }
    
    .particle {
      animation: float 6s ease-in-out infinite;
      animation-delay: var(--delay, 0s);
    }
  `,

  // Sparkle effect
  sparkle: `
    @keyframes sparkle {
      0%, 100% { opacity: 0; transform: scale(0); }
      50% { opacity: 1; transform: scale(1); }
    }
    
    .sparkle {
      animation: sparkle 1.5s ease-in-out infinite;
      animation-delay: var(--delay, 0s);
    }
  `,

  // Energy pulse
  energyPulse: `
    @keyframes energy-pulse {
      0% { 
        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
        transform: scale(1);
      }
      70% {
        box-shadow: 0 0 0 20px rgba(59, 130, 246, 0);
        transform: scale(1.02);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
        transform: scale(1);
      }
    }
    
    .energy-pulse {
      animation: energy-pulse 2s infinite;
    }
  `,
};

// Complex layout animations
export const layoutAnimations = {
  // Masonry layout
  masonry: {
    layout: true,
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: {
      layout: { duration: 0.6, ease: easings.easeOut },
      opacity: { duration: 0.3 },
      scale: { duration: 0.3 },
    },
  },

  // Shared element transition
  sharedElement: {
    layoutId: 'shared-element',
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: {
      layout: { duration: 0.5, ease: easings.easeInOut },
    },
  },

  // Staggered grid
  staggeredGrid: {
    container: {
      initial: {},
      animate: {
        transition: {
          staggerChildren: 0.1,
          delayChildren: 0.3,
        },
      },
    },
    item: {
      initial: { y: 20, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { duration: 0.6, ease: easings.easeOut },
    },
  },
};

// Performance-optimized animations
export const performanceAnimations = {
  // GPU-accelerated transforms only
  gpuOptimized: {
    initial: { transform: 'translate3d(0, 20px, 0) scale(0.9)', opacity: 0 },
    animate: { transform: 'translate3d(0, 0, 0) scale(1)', opacity: 1 },
    exit: { transform: 'translate3d(0, -20px, 0) scale(0.9)', opacity: 0 },
    transition: { duration: 0.3, ease: easings.easeOut },
  },

  // Composite layer animation
  compositeLayer: {
    willChange: 'transform, opacity',
    transform: 'translateZ(0)', // Force hardware acceleration
  },
};

// Accessibility-aware animations
export const accessibleAnimations = {
  respectMotionPreference: (animation: any) => ({
    ...animation,
    transition: {
      ...animation.transition,
      duration: 
        typeof window !== 'undefined' && 
        window.matchMedia('(prefers-reduced-motion: reduce)').matches 
          ? 0.01 
          : animation.transition?.duration,
    },
  }),
};

// Animation utilities
export const animationUtils = {
  // Create stagger delay
  createStagger: (index: number, baseDelay = 0.1) => ({
    transition: { delay: index * baseDelay },
  }),

  // Create wave effect
  createWave: (index: number, total: number) => ({
    transition: {
      delay: (index / total) * 0.5,
      duration: 0.6,
      ease: easings.easeOut,
    },
  }),

  // Create ripple effect
  createRipple: (originX: number, originY: number) => ({
    initial: { 
      scale: 0, 
      opacity: 1,
      x: originX,
      y: originY,
    },
    animate: { 
      scale: 4, 
      opacity: 0,
    },
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  }),

  // Magnetic mouse follow
  magneticFollow: (mouseX: number, mouseY: number, strength = 0.3) => ({
    x: mouseX * strength,
    y: mouseY * strength,
    transition: {
      type: 'spring',
      stiffness: 150,
      damping: 15,
    },
  }),

  // Parallax scroll effect
  parallaxScroll: (scrollY: number, speed = 0.5) => ({
    y: scrollY * speed,
  }),
};

// Create variant helper function
export function createVariant(
  initial: any,
  animate: any,
  exit?: any,
  transition?: Transition
): AnimationVariant {
  return {
    initial,
    animate,
    ...(exit && { exit }),
    ...(transition && { transition }),
  };
}

// Delay utility function
export function withDelay(animation: any, delay: number) {
  return {
    ...animation,
    transition: {
      ...animation.transition,
      delay,
    },
  };
}

// Custom hooks for animations
export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return mousePosition;
};

export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = React.useState(0);

  React.useEffect(() => {
    const updateScrollPosition = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', updateScrollPosition, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollPosition);
  }, []);

  return scrollPosition;
};

export const useParallax = (speed = 0.5) => {
  const scrollY = useScrollPosition();
  return {
    transform: `translateY(${scrollY * speed}px)`,
  };
};

export const useMagneticEffect = (strength = 0.3) => {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const ref = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;
      
      setPosition({ x: deltaX, y: deltaY });
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return { ref, style: { transform: `translate(${position.x}px, ${position.y}px)` } };
};

// Export React for hooks
import * as React from 'react';
