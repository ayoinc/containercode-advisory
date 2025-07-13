import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

// Modern button variants using cva
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-button hover:shadow-button-hover active:translate-y-px',
        secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 shadow-button hover:shadow-button-hover active:translate-y-px',
        outline: 'bg-transparent text-primary-600 border border-primary-600 hover:bg-primary-50 focus:ring-primary-500',
        ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500 shadow-none',
        subtle: 'bg-primary-50 text-primary-700 hover:bg-primary-100 focus:ring-primary-500 shadow-sm',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm rounded-lg',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
      },
      animation: {
        none: '',
        scale: 'hover:scale-105',
        pulse: 'hover:shadow-lg hover:animate-pulse-once',
        slide: 'hover:translate-x-1',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      animation: 'none',
    },
  }
);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, 
  VariantProps<typeof buttonVariants> {
  loading?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    loading = false,
    disabled,
    children, 
    ...props 
  }, ref) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size }),
          loading && 'opacity-75 cursor-wait',
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
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
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };

// Usage examples:
/*
<Button variant="primary" size="lg">
  Get Started
</Button>

<Button variant="outline" size="md" loading>
  Loading...
</Button>

<Button variant="ghost" size="sm">
  Cancel
</Button>
*/