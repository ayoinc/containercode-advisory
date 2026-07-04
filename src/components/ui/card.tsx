'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';
import { InViewAnimation } from './animations';

const cardVariants = cva(
  'rounded-lg border transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-navy-850 border-navy-700 shadow-card hover:border-navy-600 hover:shadow-card-hover',
        elevated: 'bg-navy-800 border-navy-700 shadow-lg hover:shadow-xl',
        glassmorphism: 'bg-navy-850/70 backdrop-blur-md border-navy-700/60 shadow-lg hover:bg-navy-850/90',
        gradient: 'bg-gradient-to-br from-navy-800 to-navy-850 border-navy-700 shadow-md hover:shadow-lg',
        interactive: 'bg-navy-850 border-navy-700 shadow-card hover:border-aqua-500/40 hover:shadow-card-hover hover:scale-[1.02] cursor-pointer',
        // Featured consultancy service — aqua top-border accent
        featured: 'bg-navy-850 border-navy-700 border-t-2 border-t-aqua-500 shadow-card hover:shadow-card-hover',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
        xl: 'p-10',
      },
      animation: {
        none: '',
        fadeInUp: 'opacity-0 translate-y-4',
        fadeInLeft: 'opacity-0 -translate-x-4',
        scale: 'opacity-0 scale-95',
      }
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
      animation: 'fadeInUp',
    },
  }
);

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  hoverable?: boolean;
  animated?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant, 
    padding, 
    animation, 
    hoverable = false,
    animated = true,
    children,
    ...props 
  }, ref) => {
    const cardElement = (
      <div
        className={cn(
          cardVariants({ variant, padding, animation, className }),
          hoverable && 'hover:scale-105 cursor-pointer'
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );

    // Wrap with animation if enabled
    if (animated && animation !== 'none') {
      const animationVariants = {
        fadeInUp: { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } },
        fadeInLeft: { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 } },
        scale: { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 } },
      };

      return (
        <InViewAnimation 
          variants={animationVariants[animation || 'fadeInUp']}
          className="w-full"
        >
          {cardElement}
        </InViewAnimation>
      );
    }

    return cardElement;
  }
);

Card.displayName = 'Card';

const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-navy-300', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
};
