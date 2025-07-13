/**
 * Animation System Export
 * Central export point for all animation utilities
 */

export * from './core';
export * from './presets';

// Re-export commonly used animations for convenience
export { 
  fadeAnimations as fade,
  scaleAnimations as scale,
  slideAnimations as slide,
} from './core';

export {
  textRevealVariants as textReveal,
  cardVariants as card,
  buttonVariants as button,
  modalVariants as modal,
} from './presets';