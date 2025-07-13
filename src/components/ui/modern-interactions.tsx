'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Loading Spinner Component
export const ModernSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg'; color?: string }> = ({ 
  size = 'md', 
  color = '#3B82F6' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-full border-2 border-transparent`}
      style={{
        borderTopColor: color,
        borderRightColor: color,
      }}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
};

// Skeleton Loader for Cards
export const CardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ${className}`}>
      <div className="animate-pulse">
        {/* Icon placeholder */}
        <div className="w-12 h-12 bg-gray-200 rounded-2xl mb-4" />
        
        {/* Title placeholder */}
        <div className="h-6 bg-gray-200 rounded mb-3 w-3/4" />
        
        {/* Description placeholder */}
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
        
        {/* Features placeholder */}
        <div className="space-y-2 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded-full" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
        
        {/* CTA placeholder */}
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
};

// Page transition component
export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.5,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

// Stagger children animation
export const StaggeredContainer: React.FC<{ 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
}> = ({ children, className = '', delay = 0 }) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: delay,
            staggerChildren: 0.1
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggeredItem: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.5,
            ease: "easeOut"
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
};

// Button with ripple effect
export const RippleButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}> = ({ children, onClick, className = '', disabled = false }) => {
  const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { x, y, id: Date.now() };
    setRipples(prev => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
    
    onClick?.();
  };

  return (
    <motion.button
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white/20 rounded-full pointer-events-none"
          style={{
            left: ripple.x - 25,
            top: ripple.y - 25,
            width: 50,
            height: 50,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}
      {children}
    </motion.button>
  );
};

// Floating action button
export const FloatingActionButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
}> = ({ children, onClick, position = 'bottom-right', className = '' }) => {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  return (
    <motion.button
      className={`fixed ${positionClasses[position]} z-50 w-14 h-14 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20
      }}
    >
      {children}
    </motion.button>
  );
};

// Progress bar component
export const ProgressBar: React.FC<{
  progress: number;
  className?: string;
  showPercentage?: boolean;
  color?: string;
}> = ({ progress, className = '', showPercentage = false, color = 'blue' }) => {
  return (
    <div className={`w-full ${className}`}>
      {showPercentage && (
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className={`h-2 rounded-full bg-gradient-to-r from-${color}-500 to-${color}-600`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

// Toast notification (works with react-hot-toast)
export const customToastOptions = {
  style: {
    borderRadius: '12px',
    background: '#363636',
    color: '#fff',
    padding: '16px',
    fontSize: '14px',
    fontWeight: '500',
  },
  success: {
    style: {
      background: '#059669',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#059669',
    },
  },
  error: {
    style: {
      background: '#DC2626',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#DC2626',
    },
  },
  loading: {
    style: {
      background: '#3B82F6',
    },
  },
};
