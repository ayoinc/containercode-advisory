'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { forwardRef, InputHTMLAttributes, useState, ReactNode } from 'react';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';

const inputVariants = cva(
  'flex w-full border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'rounded-md focus-visible:ring-primary-500',
        ghost: 'border-transparent bg-gray-100 focus-visible:bg-white',
        filled: 'bg-gray-50 border-gray-200',
        glassmorphism: 'bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/70',
      },
      inputSize: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-10 px-3',
        lg: 'h-12 px-4 text-base',
      },
      state: {
        default: '',
        error: 'border-red-500 focus-visible:ring-red-500',
        success: 'border-green-500 focus-visible:ring-green-500',
        warning: 'border-yellow-500 focus-visible:ring-yellow-500',
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
            disabled ? 'text-gray-400' : 'text-gray-700',
            isFocused && 'text-primary-600'
          )}>
            {label}
          </label>
        )}
        
        <div className="relative">
          {hasLeftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
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
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              {actualState === 'success' && (
                <Check className="h-4 w-4 text-green-500" />
              )}
              {rightIcon && <div className="text-gray-400">{rightIcon}</div>}
              {showPasswordToggle && type === 'password' && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
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
            errorMessage ? 'text-red-600' : 'text-gray-500'
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