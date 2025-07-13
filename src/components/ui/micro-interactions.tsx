'use client';

import React, { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg',
        className
      )}
      {...filteredProps}
    >
      {children}
    </motion.div>
  );
}

interface InteractiveCardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
}

export function InteractiveCard({ 
  children, 
  className, 
  hoverScale = 1.02,
  ...props 
}: InteractiveCardProps) {
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
      whileHover={{ scale: hoverScale, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(
        'cursor-pointer transition-shadow duration-200 hover:shadow-lg',
        className
      )}
      {...filteredProps}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedText({ children, className, delay = 0 }: AnimatedTextProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface FloatingElementProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
}

export function FloatingElement({ 
  children, 
  className, 
  amplitude = 10,
  duration = 3,
  ...props 
}: FloatingElementProps) {
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
      animate={{ y: [0, -amplitude, 0] }}
      transition={{ 
        duration, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      className={className}
      {...filteredProps}
    >
      {children}
    </motion.div>
  );
}

interface PulseElementProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  scale?: number;
  duration?: number;
}

export function PulseElement({ 
  children, 
  className, 
  scale = 1.05,
  duration = 2,
  ...props 
}: PulseElementProps) {
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
      animate={{ scale: [1, scale, 1] }}
      transition={{ 
        duration, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      className={className}
      {...filteredProps}
    >
      {children}
    </motion.div>
  );
}