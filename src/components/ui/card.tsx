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
        default: 'bg-white border-gray-200 shadow-sm hover:shadow-md',
        elevated: 'bg-white border-gray-200 shadow-lg hover:shadow-xl',
        glassmorphism: 'bg-white/10 backdrop-blur-md border-white/20 shadow-lg hover:bg-white/20',
        gradient: 'bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-md hover:shadow-lg',
        interactive: 'bg-white border-gray-200 shadow-sm hover:shadow-lg hover:scale-[1.02] cursor-pointer',
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
    className={cn('text-sm text-gray-500', className)}
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
