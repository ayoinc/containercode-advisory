'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  blur?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  opacity?: 'light' | 'medium' | 'heavy';
  border?: boolean;
  hover?: 'none' | 'lift' | 'glow' | 'scale';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  animateEntrance?: boolean;
  variant?: 'default' | 'elevated';
  children: React.ReactNode;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ 
    className, 
    blur = 'md',
    opacity = 'medium',
    border = true,
    hover = 'none',
    padding = 'md',
    rounded = 'lg',
    animateEntrance = false,
    variant = 'default',
    children,
    ...props 
  }, ref) => {
    // Blur mappings
    const blurMappings = {
      none: '',
      sm: 'backdrop-blur-sm',
      md: 'backdrop-blur-md',
      lg: 'backdrop-blur-lg',
      xl: 'backdrop-blur-xl',
    };
    
    // Opacity mappings
    const opacityMappings = {
      light: 'bg-white/30',
      medium: 'bg-white/50',
      heavy: 'bg-white/70',
    };
    
    // Border mappings
    const borderClass = border 
      ? 'border border-white/30'
      : '';
    
    // Padding mappings
    const paddingMappings = {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-7',
      xl: 'p-9',
    };
    
    // Rounded mappings
    const roundedMappings = {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    };
    
    // Hover animations
    const hoverMappings = {
      none: {},
      lift: {
        whileHover: { y: -5 },
        transition: { duration: 0.2 }
      },
      glow: {
        whileHover: { boxShadow: '0 0 15px rgba(20, 184, 166, 0.5)' },
        transition: { duration: 0.3 }
      },
      scale: {
        whileHover: { scale: 1.03 },
        transition: { duration: 0.2 }
      }
    };
    
    // Entrance animation
    const entranceAnimation = animateEntrance ? {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, ease: 'easeOut' }
    } : {};
    
    // Motion props combination
    const motionProps = {
      ...hoverMappings[hover],
      ...entranceAnimation,
      ...props
    };

    return (
      <motion.div
        {...(motionProps as any)}
        ref={ref}
        className={cn(
          blurMappings[blur],
          opacityMappings[opacity],
          borderClass,
          paddingMappings[padding],
          roundedMappings[rounded],
          'transition-all duration-300',
          variant === 'elevated' ? 'shadow-xl' : 'shadow-lg',
          variant === 'elevated' && 'bg-white',
          'text-gray-800 shadow-black/5',
          className
        )}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
