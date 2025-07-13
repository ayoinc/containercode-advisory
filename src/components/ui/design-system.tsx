'use client';

/**
 * Advanced Design System Components
 * Modern UI components with sophisticated variants and interactions
 */

import React, { forwardRef, ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Design tokens
export const designTokens = {
  colors: {
    primary: {
      50: 'hsl(212, 100%, 97%)',
      100: 'hsl(212, 100%, 93%)',
      200: 'hsl(212, 100%, 85%)',
      300: 'hsl(212, 100%, 76%)',
      400: 'hsl(212, 100%, 65%)',
      500: 'hsl(212, 100%, 50%)',
      600: 'hsl(212, 100%, 45%)',
      700: 'hsl(212, 100%, 39%)',
      800: 'hsl(212, 100%, 32%)',
      900: 'hsl(212, 100%, 24%)',
      950: 'hsl(212, 100%, 15%)',
    },
    neutral: {
      0: 'hsl(0, 0%, 100%)',
      50: 'hsl(210, 20%, 98%)',
      100: 'hsl(210, 20%, 95%)',
      200: 'hsl(210, 16%, 93%)',
      300: 'hsl(210, 14%, 89%)',
      400: 'hsl(210, 14%, 83%)',
      500: 'hsl(210, 11%, 71%)',
      600: 'hsl(210, 7%, 56%)',
      700: 'hsl(210, 9%, 31%)',
      800: 'hsl(210, 10%, 23%)',
      900: 'hsl(210, 11%, 15%)',
      950: 'hsl(210, 13%, 9%)',
      1000: 'hsl(0, 0%, 0%)',
    },
    semantic: {
      success: 'hsl(142, 76%, 36%)',
      warning: 'hsl(38, 92%, 50%)',
      error: 'hsl(0, 84%, 60%)',
      info: 'hsl(212, 100%, 50%)',
    },
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    glow: '0 0 20px rgb(59 130 246 / 0.3)',
    glass: '0 8px 32px 0 rgb(31 38 135 / 0.37)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, hsl(212, 100%, 50%) 0%, hsl(212, 100%, 39%) 100%)',
    glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    mesh: 'radial-gradient(at 40% 20%, hsl(212, 100%, 50%) 0px, transparent 50%), radial-gradient(at 80% 0%, hsl(212, 100%, 39%) 0px, transparent 50%), radial-gradient(at 0% 50%, hsl(212, 100%, 65%) 0px, transparent 50%)',
  },
  blur: {
    sm: 'blur(4px)',
    md: 'blur(8px)',
    lg: 'blur(16px)',
    xl: 'blur(24px)',
    '2xl': 'blur(40px)',
    '3xl': 'blur(64px)',
  },
} as const;

// Advanced Button Component with variants
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg hover:shadow-xl hover:from-primary-700 hover:to-primary-800 focus-visible:ring-primary-600',
        secondary: 'bg-neutral-100 text-neutral-900 shadow-sm hover:bg-neutral-200 focus-visible:ring-neutral-600',
        outline: 'border-2 border-neutral-200 bg-transparent text-neutral-900 hover:bg-neutral-50 focus-visible:ring-neutral-600',
        ghost: 'text-neutral-700 hover:bg-neutral-100 focus-visible:ring-neutral-600',
        glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-glass hover:bg-white/20',
        gradient: 'bg-gradient-to-r from-purple-600 via-pink-600 to-primary-600 text-white shadow-xl hover:shadow-2xl bg-[length:200%_100%] hover:bg-[position:100%_0%] transition-all duration-500',
        destructive: 'bg-red-600 text-white shadow-lg hover:bg-red-700 focus-visible:ring-red-600',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10',
      },
      effect: {
        none: '',
        shimmer: 'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700',
        glow: 'hover:shadow-glow',
        lift: 'hover:-translate-y-0.5 active:translate-y-0',
        scale: 'hover:scale-105 active:scale-95',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      effect: 'none',
    },
  }
);

export interface AdvancedButtonProps
  extends HTMLMotionProps<'button'>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export const AdvancedButton = forwardRef<HTMLButtonElement, AdvancedButtonProps>(
  ({ className, variant, size, effect, children, loading, icon, iconPosition = 'left', ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size, effect, className }))}
        whileTap={{ scale: 0.98 }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : icon && iconPosition === 'left' ? (
          <span className="mr-2">{icon}</span>
        ) : null}
        {children}
        {icon && iconPosition === 'right' && !loading ? (
          <span className="ml-2">{icon}</span>
        ) : null}
      </motion.button>
    );
  }
);

AdvancedButton.displayName = 'AdvancedButton';

// Advanced Card Component
const cardVariants = cva(
  'rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'border-neutral-200 bg-white',
        elevated: 'border-neutral-200 bg-white shadow-lg hover:shadow-xl',
        glass: 'border-white/20 bg-white/10 backdrop-blur-md shadow-glass',
        gradient: 'border-0 bg-gradient-to-br from-white to-neutral-50',
        outlined: 'border-2 border-primary-200 bg-primary-50/50',
        floating: 'border-neutral-200 bg-white shadow-2xl hover:shadow-3xl transform hover:-translate-y-1',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);

export interface AdvancedCardProps
  extends HTMLMotionProps<'div'>,
    VariantProps<typeof cardVariants> {
  children: ReactNode;
  interactive?: boolean;
}

export const AdvancedCard = forwardRef<HTMLDivElement, AdvancedCardProps>(
  ({ className, variant, padding, children, interactive, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(cardVariants({ variant, padding, className }))}
        whileHover={interactive ? { scale: 1.02, y: -2 } : undefined}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

AdvancedCard.displayName = 'AdvancedCard';

// Advanced Input Component
const inputVariants = cva(
  'flex w-full rounded-xl border bg-background px-4 py-3 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-neutral-300 focus-visible:border-primary-500 focus-visible:ring-primary-500',
        filled: 'border-transparent bg-neutral-100 focus-visible:bg-white focus-visible:ring-primary-500',
        glass: 'border-white/20 bg-white/10 backdrop-blur-md placeholder:text-white/70 text-white focus-visible:border-white/40 focus-visible:ring-white/30',
        error: 'border-red-400 focus-visible:border-red-500 focus-visible:ring-red-500',
        success: 'border-green-400 focus-visible:border-green-500 focus-visible:ring-green-500',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface AdvancedInputProps
  extends Omit<HTMLMotionProps<'input'>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  success?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export const AdvancedInput = forwardRef<HTMLInputElement, AdvancedInputProps>(
  ({ className, variant, size, label, error, success, icon, iconPosition = 'left', ...props }, ref) => {
    const hasError = !!error;
    const hasSuccess = !!success;
    const finalVariant = hasError ? 'error' : hasSuccess ? 'success' : variant;

    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
              {icon}
            </div>
          )}
          <motion.input
            ref={ref}
            className={cn(
              inputVariants({ variant: finalVariant, size, className }),
              icon && iconPosition === 'left' && 'pl-10',
              icon && iconPosition === 'right' && 'pr-10'
            )}
            whileFocus={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">
              {icon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        {success && (
          <p className="text-sm text-green-600">{success}</p>
        )}
      </div>
    );
  }
);

AdvancedInput.displayName = 'AdvancedInput';

// Advanced Badge Component
const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-neutral-100 text-neutral-900',
        primary: 'bg-primary-100 text-primary-900',
        secondary: 'bg-neutral-100 text-neutral-600',
        success: 'bg-green-100 text-green-900',
        warning: 'bg-yellow-100 text-yellow-900',
        error: 'bg-red-100 text-red-900',
        glass: 'bg-white/20 text-white backdrop-blur-sm border border-white/20',
        gradient: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
        outline: 'border border-neutral-200 text-neutral-700',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
      interactive: {
        true: 'cursor-pointer hover:scale-110 active:scale-95',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      interactive: false,
    },
  }
);

export interface AdvancedBadgeProps
  extends HTMLMotionProps<'span'>,
    VariantProps<typeof badgeVariants> {
  children: ReactNode;
  icon?: ReactNode;
  removable?: boolean;
  onRemove?: () => void;
}

export const AdvancedBadge = forwardRef<HTMLSpanElement, AdvancedBadgeProps>(
  ({ className, variant, size, interactive, children, icon, removable, onRemove, ...props }, ref) => {
    return (
      <motion.span
        ref={ref}
        className={cn(badgeVariants({ variant, size, interactive, className }))}
        whileHover={interactive ? { scale: 1.05 } : undefined}
        whileTap={interactive ? { scale: 0.95 } : undefined}
        {...props}
      >
        {icon && <span className="mr-1">{icon}</span>}
        {children}
        {removable && (
          <button
            onClick={onRemove}
            className="ml-1 rounded-full p-0.5 hover:bg-black/10"
          >
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </motion.span>
    );
  }
);

AdvancedBadge.displayName = 'AdvancedBadge';

// Advanced Progress Component
export interface AdvancedProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient' | 'glass';
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export const AdvancedProgress: React.FC<AdvancedProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  animated = true,
  className,
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };
  
  const variantClasses = {
    default: 'bg-primary-600',
    gradient: 'bg-gradient-to-r from-primary-600 to-purple-600',
    glass: 'bg-white/30 backdrop-blur-sm',
  };

  return (
    <div className={cn('space-y-2', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn('w-full rounded-full bg-neutral-200', sizeClasses[size])}>
        <motion.div
          className={cn('rounded-full transition-all duration-500', sizeClasses[size], variantClasses[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 1 : 0, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

// Advanced Avatar Component
const avatarVariants = cva(
  'relative inline-flex items-center justify-center overflow-hidden rounded-full bg-neutral-100',
  {
    variants: {
      size: {
        sm: 'h-8 w-8 text-sm',
        md: 'h-10 w-10 text-base',
        lg: 'h-12 w-12 text-lg',
        xl: 'h-16 w-16 text-xl',
        '2xl': 'h-20 w-20 text-2xl',
      },
      ring: {
        none: '',
        sm: 'ring-2 ring-white',
        md: 'ring-4 ring-white',
        lg: 'ring-4 ring-primary-500',
      },
    },
    defaultVariants: {
      size: 'md',
      ring: 'none',
    },
  }
);

export interface AdvancedAvatarProps
  extends HTMLMotionProps<'div'>,
    VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: string;
  status?: 'online' | 'offline' | 'busy' | 'away';
}

export const AdvancedAvatar = forwardRef<HTMLDivElement, AdvancedAvatarProps>(
  ({ className, size, ring, src, alt, fallback, status, ...props }, ref) => {
    const statusColors = {
      online: 'bg-green-500',
      offline: 'bg-neutral-400',
      busy: 'bg-red-500',
      away: 'bg-yellow-500',
    };

    return (
      <motion.div
        ref={ref}
        className={cn(avatarVariants({ size, ring, className }))}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="font-medium text-neutral-600">
            {fallback}
          </span>
        )}
        {status && (
          <div
            className={cn(
              'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white',
              statusColors[status]
            )}
          />
        )}
      </motion.div>
    );
  }
);

AdvancedAvatar.displayName = 'AdvancedAvatar';

// Export all components and utilities
export { buttonVariants, cardVariants, inputVariants, badgeVariants, avatarVariants };