'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { forwardRef, InputHTMLAttributes, useState, ReactNode } from 'react';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';

const inputVariants = cva(
  'flex w-full rounded border border-navy-700 bg-navy-950 px-3 py-2 text-sm text-navy-100 ring-offset-navy-900 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-navy-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'focus-visible:border-aqua-500 focus-visible:ring-aqua-500/40',
        ghost: 'border-transparent bg-navy-800 focus-visible:bg-navy-950',
        filled: 'bg-navy-800 border-navy-700',
        glassmorphism: 'bg-navy-850/60 backdrop-blur-sm border-navy-700/60 text-navy-100 placeholder:text-navy-300',
      },
      inputSize: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-3',
        lg: 'h-12 px-4 text-base',
      },
      state: {
        default: '',
        error: 'border-error-500 focus-visible:ring-error-500/40',
        success: 'border-aqua-500 focus-visible:ring-aqua-500/40',
        warning: 'border-tertiary-500 focus-visible:ring-tertiary-500/40',
      }
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'md',
      state: 'default',
    },
  }
);

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  showPasswordToggle?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type,
    variant,
    inputSize,
    state,
    label,
    helperText,
    errorMessage,
    leftIcon,
    rightIcon,
    showPasswordToggle = false,
    disabled,
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputType = showPasswordToggle && type === 'password' 
      ? showPassword ? 'text' : 'password'
      : type;

    const actualState = errorMessage ? 'error' : state;

    const hasLeftIcon = !!leftIcon;
    const hasRightIcon = !!rightIcon || showPasswordToggle || actualState === 'success' || actualState === 'error';

    return (
      <div className="w-full">
        {label && (
          <label className={cn(
            'block text-sm font-medium mb-2 transition-colors',
            disabled ? 'text-navy-400' : 'text-navy-200',
            isFocused && 'text-aqua-400'
          )}>
            {label}
          </label>
        )}

        <div className="relative">
          {hasLeftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-navy-300">
              {leftIcon}
            </div>
          )}
          
          <input
            type={inputType}
            className={cn(
              inputVariants({ variant, inputSize, state, className }),
              hasLeftIcon && 'pl-10',
              hasRightIcon && 'pr-10'
            )}
            ref={ref}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          
          {hasRightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              {actualState === 'error' && (
                <AlertCircle className="h-4 w-4 text-error-400" />
              )}
              {actualState === 'success' && (
                <Check className="h-4 w-4 text-aqua-400" />
              )}
              {rightIcon && <div className="text-navy-300">{rightIcon}</div>}
              {showPasswordToggle && type === 'password' && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-navy-300 hover:text-navy-100 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>
          )}
        </div>
        
        {(helperText || errorMessage) && (
          <div className={cn(
            'mt-2 text-sm',
            errorMessage ? 'text-error-400' : 'text-navy-300'
          )}>
            {errorMessage || helperText}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputVariants };