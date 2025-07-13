/**
 * Animation Hooks
 * Custom React hooks for animation functionality
 */

import { useEffect, useState, useRef, RefObject } from 'react';
import { useInView, useAnimation, useScroll, useTransform, MotionValue } from 'framer-motion';

// Type for animation controls
type AnimationControls = ReturnType<typeof useAnimation>;

// Hook for viewport-triggered animations
export const useViewportAnimation = (
  threshold: number = 0.3,
  triggerOnce: boolean = true
) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { 
    amount: threshold,
    once: triggerOnce 
  });

  useEffect(() => {
    if (inView) {
      controls.start('animate');
    } else if (!triggerOnce) {
      controls.start('initial');
    }
  }, [controls, inView, triggerOnce]);

  return { ref, controls, inView };
};

// Hook for scroll-triggered animations with progress
export const useScrollAnimation = (
  ref: RefObject<HTMLElement>,
  offset: ["start end", "end start"] = ["start end", "end start"]
) => {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as any,
  });

  return { scrollYProgress };
};

// Hook for parallax effects
export const useParallax = (
  value: MotionValue<number>,
  distance: number = 50
) => {
  return useTransform(value, [0, 1], [-distance, distance]);
};

// Hook for staggered animations
export const useStaggerAnimation = (
  itemCount: number,
  baseDelay: number = 0.1
) => {
  const controls = useAnimation();
  const [hasAnimated, setHasAnimated] = useState(false);

  const startAnimation = async () => {
    if (!hasAnimated) {
      await controls.start((i) => ({
        opacity: 1,
        y: 0,
        transition: {
          delay: i * baseDelay,
          duration: 0.5,
        },
      }));
      setHasAnimated(true);
    }
  };

  return { controls, startAnimation };
};

// Hook for mouse position tracking
export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return mousePosition;
};

// Hook for device motion (for mobile parallax effects)
export const useDeviceMotion = () => {
  const [motion, setMotion] = useState({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    const handleMotion = (e: DeviceMotionEvent) => {
      if (e.accelerationIncludingGravity) {
        setMotion({
          x: e.accelerationIncludingGravity.x || 0,
          y: e.accelerationIncludingGravity.y || 0,
          z: e.accelerationIncludingGravity.z || 0,
        });
      }
    };

    if (window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => window.removeEventListener('devicemotion', handleMotion);
  }, []);

  return motion;
};

// Hook for reduced motion preference
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Hook for intersection observer with multiple thresholds
export const useIntersectionObserver = (
  ref: RefObject<HTMLElement>,
  options: IntersectionObserverInit = {}
) => {
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setEntry(entry),
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
        ...options,
      }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options]);

  return entry;
};

// Hook for scroll direction detection
export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? 'down' : 'up';
      
      if (direction !== scrollDirection && Math.abs(scrollY - lastScrollY) > 5) {
        setScrollDirection(direction);
      }
      
      setLastScrollY(scrollY);
    };

    const throttledUpdateScrollDirection = throttle(updateScrollDirection, 100);
    
    window.addEventListener('scroll', throttledUpdateScrollDirection);
    return () => window.removeEventListener('scroll', throttledUpdateScrollDirection);
  }, [scrollDirection, lastScrollY]);

  return scrollDirection;
};

// Hook for element dimensions
export const useElementDimensions = (ref: RefObject<HTMLElement>) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;

    const updateDimensions = () => {
      if (ref.current) {
        setDimensions({
          width: ref.current.offsetWidth,
          height: ref.current.offsetHeight,
        });
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(ref.current);

    return () => resizeObserver.disconnect();
  }, [ref]);

  return dimensions;
};

// Utility function: throttle
function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}