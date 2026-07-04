'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { forwardRef, TextareaHTMLAttributes, useState } from 'react';
import { AlertCircle, Check } from 'lucide-react';

const textareaVariants = cva(
  'flex min-h-[80px] w-full rounded border border-navy-700 bg-navy-950 px-3 py-2 text-sm text-navy-100 ring-offset-navy-900 placeholder:text-navy-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none',
  {
    variants: {
      variant: {
        default: 'focus-visible:border-aqua-500 focus-visible:ring-aqua-500/40',
        ghost: 'border-transparent bg-navy-800 focus-visible:bg-navy-950',
        filled: 'bg-navy-800 border-navy-700',
        glassmorphism: 'bg-navy-850/60 backdrop-blur-sm border-navy-700/60 text-navy-100 placeholder:text-navy-300',
      },
      textareaSize: {
        sm: 'min-h-[60px] px-3 py-2 text-sm',
        md: 'min-h-[80px] px-3 py-2',
        lg: 'min-h-[120px] px-4 py-3 text-base',
        xl: 'min-h-[160px] px-4 py-3 text-base',
      },
      state: {
        default: '',
        error: 'border-error-500 focus-visible:ring-error-500/40',
        success: 'border-aqua-500 focus-visible:ring-aqua-500/40',
        warning: 'border-tertiary-500 focus-visible:ring-tertiary-500/40',
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
            disabled ? 'text-navy-400' : 'text-navy-200',
            isFocused && 'text-aqua-400'
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
              {actualState === 'success' && <Check className="h-4 w-4 text-aqua-400" />}
              {actualState === 'error' && <AlertCircle className="h-4 w-4 text-error-400" />}
              {actualState === 'warning' && <AlertCircle className="h-4 w-4 text-tertiary-400" />}
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-1">
          <div>
            {(helperText || errorMessage) && (
              <p className={cn(
                'text-sm transition-colors',
                errorMessage
                  ? 'text-error-400'
                  : 'text-navy-300'
              )}>
                {errorMessage || helperText}
              </p>
            )}
          </div>

          {showCharCount && (
            <span className={cn(
              'text-xs transition-colors',
              maxLength && charCount > maxLength * 0.9
                ? 'text-tertiary-400'
                : 'text-navy-300'
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