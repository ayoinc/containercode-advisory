'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'subtle' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  animationType?: 'scale' | 'pulse' | 'bounce' | 'glow' | 'none';
  animationStyle?: 'scale' | 'pulse' | 'bounce' | 'glow' | 'shine' | 'none';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    animationType = 'scale',
    animationStyle,
    loading = false,
    icon,
    iconPosition = 'right',
    fullWidth = false,
    disabled,
    children,
    ...props 
  }, ref) => {
    // Use animationStyle if provided, otherwise use animationType
    const effectiveAnimationType = animationStyle || animationType;
    // Animation variants
    const animations = {
      scale: {
        whileHover: { scale: 1.05 },
        whileTap: { scale: 0.95 },
        transition: { duration: 0.2 }
      },
      pulse: {
        whileHover: { scale: [1, 1.05, 1.02] },
        transition: { duration: 0.5, repeat: 0 }
      },
      bounce: {
        whileHover: { y: [0, -5, 0] },
        transition: { duration: 0.5, repeat: 0 }
      },
      glow: {
        whileHover: { boxShadow: '0 0 12px rgba(20, 184, 166, 0.7)' },
        transition: { duration: 0.3 }
      },
      shine: {
        whileHover: { 
          background: [
            'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)',
            'linear-gradient(90deg, rgba(255,255,255,0) 10%, rgba(255,255,255,0.2) 60%, rgba(255,255,255,0) 110%)',
            'linear-gradient(90deg, rgba(255,255,255,0) 100%, rgba(255,255,255,0.2) 150%, rgba(255,255,255,0) 200%)'
          ],
          backgroundSize: '200% 100%',
          backgroundPosition: ['0% 0%', '100% 0%', '0% 0%']
        },
        transition: { 
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'loop' 
        }
      },
      none: {}
    };
    
    const selectedAnimation = animations[effectiveAnimationType] || animations.scale;
    
    return (
      <motion.div
        className={cn(fullWidth && 'w-full', className)}
        {...selectedAnimation}
      >
        <Button
          ref={ref}
          variant={variant === 'gradient' ? 'primary' : (variant as any)}
          size={size as any}
          className={cn(
            'flex items-center justify-center',
            variant === 'gradient' && 'bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-500 hover:to-secondary-500',
            iconPosition === 'left' && icon && 'flex-row-reverse',
            fullWidth && 'w-full',
            className
          )}
          disabled={disabled || loading}
          {...props}
        >
          {loading ? (
            <>
              <svg 
                className="animate-spin -ml-1 mr-2 h-4 w-4" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Loading...
            </>
          ) : (
            <>
              {children}
              {icon && (
                <span className={cn('inline-flex', iconPosition === 'right' ? 'ml-2' : 'mr-2')}>
                  {icon}
                </span>
              )}
            </>
          )}
        </Button>
      </motion.div>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';
