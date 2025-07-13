'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardSpotlightProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

export const CardSpotlight: React.FC<CardSpotlightProps> = ({
  children,
  className,
  spotlightColor = "#0ea5e9"
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-lg transition-all duration-300",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      style={{
        transform: isHovering 
          ? `perspective(1000px) rotateX(${(mousePosition.y - 150) / 10}deg) rotateY(${(mousePosition.x - 150) / 10}deg)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
      }}
    >
      {/* Spotlight effect */}
      {isHovering && (
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, ${spotlightColor}, transparent 40%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 0.2 }}
        />
      )}
      
      {/* Glass effect overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-50" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 opacity-0 transition-opacity duration-300"
        animate={isHovering ? { opacity: 1 } : { opacity: 0 }}
      >
        <div className="absolute -top-4 -left-4 h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform rotate-45 transition-transform duration-700 hover:translate-x-full" />
      </motion.div>
    </motion.div>
  );
};

// Floating Card with modern animations
interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const FloatingCard: React.FC<FloatingCardProps> = ({
  children,
  className,
  delay = 0
}) => {
  return (
    <motion.div
      className={cn(
        "relative rounded-3xl bg-gradient-to-br from-white to-gray-50 p-8 shadow-2xl border border-gray-100",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: {
          duration: 0.6,
          delay,
          ease: "easeOut"
        }
      }}
      whileHover={{ 
        y: -12,
        scale: 1.03,
        transition: { duration: 0.3 }
      }}
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(240,240,240,0.8) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)',
      }}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary-400/20 via-purple-400/20 to-pink-400/20 opacity-0 transition-opacity duration-300 hover:opacity-100" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

// Gradient Border Card
interface GradientBorderCardProps {
  children: React.ReactNode;
  className?: string;
  gradientColors?: string[];
}

export const GradientBorderCard: React.FC<GradientBorderCardProps> = ({
  children,
  className,
  gradientColors = ['#3B82F6', '#8B5CF6', '#EC4899']
}) => {
  return (
    <div className={cn("relative group", className)}>
      {/* Gradient border */}
      <div 
        className="absolute inset-0 rounded-2xl p-[2px] transition-all duration-300 group-hover:p-[3px]"
        style={{
          background: `linear-gradient(45deg, ${gradientColors.join(', ')})`
        }}
      >
        <div className="h-full w-full rounded-2xl bg-white">
          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Animated Number Counter
interface AnimatedCounterProps {
  from: number;
  to: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  from,
  to,
  duration = 2,
  suffix = '',
  className
}) => {
  const [current, setCurrent] = React.useState(from);

  React.useEffect(() => {
    const startTime = Date.now();
    const difference = to - from;

    const updateCounter = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      
      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const newValue = from + (difference * easeOut);
      
      setCurrent(newValue);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    const timer = setTimeout(() => {
      requestAnimationFrame(updateCounter);
    }, 100); // Small delay to ensure component is mounted

    return () => clearTimeout(timer);
  }, [from, to, duration]);

  return (
    <span className={className}>
      {Math.floor(current)}{suffix}
    </span>
  );
};
