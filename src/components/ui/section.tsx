'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';
import { InViewAnimation } from './animations';

const sectionVariants = cva(
  'relative w-full',
  {
    variants: {
      spacing: {
        none: 'py-0',
        sm: 'py-8 md:py-12',
        md: 'py-12 md:py-16',
        lg: 'py-16 md:py-20',
        xl: 'py-20 md:py-24',
        '2xl': 'py-24 md:py-32',
      },
      background: {
        transparent: '',
        white: 'bg-navy-900',
        slate: 'bg-navy-850',
        surface: 'bg-navy-900',
        raised: 'bg-navy-850',
        deep: 'bg-navy-950',
        gradient: 'bg-gradient-to-br from-navy-900 to-navy-850',
        navy: 'bg-navy-950 text-navy-100',
        glassmorphism: 'bg-navy-850/60 backdrop-blur-sm',
      },
      pattern: {
        none: '',
        grid: 'bg-tech-grid',
        dots: 'bg-tech-dots',
        mesh: 'bg-[linear-gradient(to_right,rgb(60_73_71_/_0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgb(60_73_71_/_0.25)_1px,transparent_1px)] bg-[size:48px_48px]',
      },
      container: {
        none: '',
        sm: 'max-w-2xl mx-auto px-4 sm:px-6',
        md: 'max-w-4xl mx-auto px-4 sm:px-6',
        lg: 'max-w-6xl mx-auto px-4 sm:px-6',
        xl: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
        full: 'w-full px-4 sm:px-6 lg:px-8',
      }
    },
    defaultVariants: {
      spacing: 'lg',
      background: 'transparent',
      pattern: 'none',
      container: 'xl',
    },
  }
);

export interface SectionProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sectionVariants> {
  animated?: boolean;
  as?: 'section' | 'div' | 'main' | 'article' | 'aside';
}

const Section = forwardRef<HTMLDivElement, SectionProps>(
  ({ 
    className, 
    spacing,
    background,
    pattern,
    container,
    animated = true,
    as: Component = 'section',
    children,
    ...props 
  }, ref) => {
    const content = (
      <Component
        className={cn(sectionVariants({ spacing, background, pattern, className }))}
        ref={ref}
        {...props}
      >
        {container !== 'none' ? (
          <div className={cn(sectionVariants({ container }))}>
            {children}
          </div>
        ) : (
          children
        )}
      </Component>
    );

    if (animated) {
      return (
        <InViewAnimation
          variants={{
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
          }}
          className="w-full"
        >
          {content}
        </InViewAnimation>
      );
    }

    return content;
  }
);

Section.displayName = 'Section';

// Container component for consistent max-width and padding
const Container = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & {
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  }
>(({ className, size = 'xl', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(sectionVariants({ container: size }), className)}
    {...props}
  />
));
Container.displayName = 'Container';

export { Section, Container, sectionVariants };
