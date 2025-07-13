'use client';

import React, { HTMLAttributes, useEffect, useRef } from 'react';
import { motion, Variants, useAnimation, useInView as framerUseInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface InViewAnimationProps extends HTMLAttributes<HTMLDivElement> {
  variants?: {
    initial: object;
    animate: object;
  };
  viewport?: object;
  transition?: object;
  once?: boolean;
  amount?: number | "some" | "all";
  children: React.ReactNode;
}

export function InViewAnimation({
  children,
  variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  },
  viewport = { once: true, amount: 0.3 },
  transition = { duration: 0.5, ease: 'easeOut' },
  once = true,
  amount = 0.3,
  className,
  ...props
}: InViewAnimationProps) {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = framerUseInView(ref, {
    once,
    amount,
    ...viewport
  });
  
  useEffect(() => {
    if (inView) {
      controls.start('animate');
    } else if (!once) {
      controls.start('initial');
    }
  }, [controls, inView, once]);

  // Filter out conflicting props
  const { 
    onDrag, 
    onDragStart, 
    onDragEnd, 
    onAnimationStart, 
    onAnimationEnd, 
    onAnimationIteration,
    ...filteredProps 
  } = props;
  
  return (
    <motion.div
      ref={ref}
      initial="initial"
      animate={controls}
      variants={variants as Variants}
      transition={transition}
      className={cn(className)}
      {...filteredProps}
    >
      {children}
    </motion.div>
  );
}

// Add the StaggerItem component
export function StaggerItem({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>) {
  // Filter out conflicting props
  const { 
    onDrag, 
    onDragStart, 
    onDragEnd, 
    onAnimationStart, 
    onAnimationEnd, 
    onAnimationIteration,
    ...filteredProps 
  } = props;

  return (
    <motion.div
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 }
      }}
      className={cn(className)}
      {...filteredProps}
    >
      {children}
    </motion.div>
  );
}

// Renamed to match the index export
export function FadeInUp({
  children,
  delay = 0,
  duration = 0.5,
  className,
  ...props
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <InViewAnimation
      variants={{
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 }
      }}
      transition={{ duration, delay }}
      className={className}
      {...props}
    >
      {children}
    </InViewAnimation>
  );
}

// Additional animation components that might be useful
export function FadeIn({
  children,
  direction = "up",
  delay = 0,
  duration = 0.5,
  className,
  ...props
}: {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  delay?: number;
  duration?: number;
  className?: string;
} & HTMLAttributes<HTMLDivElement>) {
  const directionMap = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
    none: {}
  };

  return (
    <InViewAnimation
      variants={{
        initial: { opacity: 0, ...directionMap[direction] },
        animate: { opacity: 1, y: 0, x: 0 }
      }}
      transition={{ duration, delay }}
      className={className}
      {...props}
    >
      {children}
    </InViewAnimation>
  );
}

export function SlideIn({
  children,
  direction = "left",
  distance = 50,
  delay = 0,
  duration = 0.5,
  className,
  ...props
}: {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  delay?: number;
  duration?: number;
  className?: string;
} & HTMLAttributes<HTMLDivElement>) {
  const directionMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: -distance },
    right: { x: distance }
  };

  return (
    <InViewAnimation
      variants={{
        initial: { ...directionMap[direction] },
        animate: { x: 0, y: 0 }
      }}
      transition={{ duration, delay }}
      className={className}
      {...props}
    >
      {children}
    </InViewAnimation>
  );
}

export function ScaleIn({
  children,
  delay = 0,
  duration = 0.5,
  from = 0.9,
  className,
  ...props
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  from?: number;
  className?: string;
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <InViewAnimation
      variants={{
        initial: { opacity: 0, scale: from },
        animate: { opacity: 1, scale: 1 }
      }}
      transition={{ duration, delay }}
      className={className}
      {...props}
    >
      {children}
    </InViewAnimation>
  );
}

// Added HoverScale component
export function HoverScale({
  children,
  scale = 1.05,
  className,
  ...props
}: {
  children: React.ReactNode;
  scale?: number;
  className?: string;
} & HTMLAttributes<HTMLDivElement>) {
  // Filter out conflicting props
  const { 
    onDrag, 
    onDragStart, 
    onDragEnd, 
    onAnimationStart, 
    onAnimationEnd, 
    onAnimationIteration,
    ...filteredProps 
  } = props;

  return (
    <motion.div
      whileHover={{ scale }}
      transition={{ duration: 0.2 }}
      className={cn(className)}
      {...filteredProps}
    >
      {children}
    </motion.div>
  );
}

// Renamed to match the index export
export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  containerVariants,
  childVariants,
  className,
  ...props
}: {
  children: React.ReactNode;
  staggerDelay?: number;
  containerVariants?: Variants;
  childVariants?: Variants;
  className?: string;
} & HTMLAttributes<HTMLDivElement>) {
  const defaultContainerVariants: Variants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay
      }
    }
  };

  const defaultChildVariants: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  // Filter out conflicting props
  const { 
    onDrag, 
    onDragStart, 
    onDragEnd, 
    onAnimationStart, 
    onAnimationEnd, 
    onAnimationIteration,
    ...filteredProps 
  } = props;

  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants || defaultContainerVariants}
      className={className}
      {...filteredProps}
    >
      {children}
    </motion.div>
  );
}
