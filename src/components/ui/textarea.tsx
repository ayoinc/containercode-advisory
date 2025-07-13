'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { forwardRef, TextareaHTMLAttributes, useState } from 'react';
import { AlertCircle, Check } from 'lucide-react';

const textareaVariants = cva(
  'flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none',
  {
    variants: {
      variant: {
        default: 'focus-visible:ring-primary-500',
        ghost: 'border-transparent bg-gray-100 focus-visible:bg-white',
        filled: 'bg-gray-50 border-gray-200',
        glassmorphism: 'bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/70',
      },
      textareaSize: {
        sm: 'min-h-[60px] px-3 py-2 text-sm',
        md: 'min-h-[80px] px-3 py-2',
        lg: 'min-h-[120px] px-4 py-3 text-base',
        xl: 'min-h-[160px] px-4 py-3 text-base',
      },
      state: {
        default: '',
        error: 'border-red-500 focus-visible:ring-red-500',
        success: 'border-green-500 focus-visible:ring-green-500',
        warning: 'border-yellow-500 focus-visible:ring-yellow-500',
      },
      resize: {
        none: 'resize-none',
        vertical: 'resize-y',
        horizontal: 'resize-x',
        both: 'resize',
      }
    },
    defaultVariants: {
      variant: 'default',
      textareaSize: 'md',
      state: 'default',
      resize: 'vertical',
    },
  }
);

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  showCharCount?: boolean;
  maxLength?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className,
    variant,
    textareaSize,
    state,
    resize,
    label,
    helperText,
    errorMessage,
    showCharCount = false,
    maxLength,
    disabled,
    value,
    defaultValue,
    onChange,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [charCount, setCharCount] = useState(
      (value?.toString().length || defaultValue?.toString().length || 0)
    );

    const actualState = errorMessage ? 'error' : state;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

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
          <textarea
            className={cn(
              textareaVariants({ variant, textareaSize, state: actualState, resize }),
              disabled && 'cursor-not-allowed opacity-50',
              className
            )}
            ref={ref}
            disabled={disabled}
            maxLength={maxLength}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          
          {actualState !== 'default' && (
            <div className="absolute top-3 right-3">
              {actualState === 'success' && <Check className="h-4 w-4 text-green-500" />}
              {actualState === 'error' && <AlertCircle className="h-4 w-4 text-red-500" />}
              {actualState === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-500" />}
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-1">
          <div>
            {(helperText || errorMessage) && (
              <p className={cn(
                'text-sm transition-colors',
                errorMessage 
                  ? 'text-red-600'
                  : 'text-gray-500'
              )}>
                {errorMessage || helperText}
              </p>
            )}
          </div>
          
          {showCharCount && (
            <span className={cn(
              'text-xs transition-colors',
              maxLength && charCount > maxLength * 0.9 
                ? 'text-yellow-600'
                : 'text-gray-400'
            )}>
              {charCount}{maxLength && `/${maxLength}`}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea, textareaVariants };