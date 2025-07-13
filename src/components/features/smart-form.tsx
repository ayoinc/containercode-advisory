'use client';

/**
 * Smart Form Component
 * Advanced form with intelligent validation and user assistance
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  X, 
  AlertCircle, 
  Loader2, 
  Eye, 
  EyeOff,
  Sparkles,
  Shield,
  Mail,
  Phone,
  User,
  Building
} from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { AnimatedButton } from '@/components/ui/advanced';
import { GlassCard } from '@/components/ui/advanced';

// Smart validation schemas
const emailSchema = z.string().email().refine(
  (email) => {
    // Check for disposable email domains
    const disposableDomains = ['tempmail.com', 'throwaway.email', '10minutemail.com'];
    const domain = email.split('@')[1];
    return !disposableDomains.includes(domain);
  },
  { message: 'Please use a non-disposable email address' }
);

const phoneSchema = z.string().refine(
  (phone) => {
    // International phone number validation
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  },
  { message: 'Please enter a valid phone number' }
);

const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .refine((password) => /[A-Z]/.test(password), {
    message: 'Password must contain at least one uppercase letter',
  })
  .refine((password) => /[a-z]/.test(password), {
    message: 'Password must contain at least one lowercase letter',
  })
  .refine((password) => /[0-9]/.test(password), {
    message: 'Password must contain at least one number',
  })
  .refine((password) => /[^A-Za-z0-9]/.test(password), {
    message: 'Password must contain at least one special character',
  });

// Form schemas
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  phone: phoneSchema.optional(),
  company: z.string().optional(),
  service: z.string().min(1, 'Please select a service'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  subscribe: z.boolean().default(false),
});

export const registrationFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  company: z.string().optional(),
  role: z.string().optional(),
  agreedToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Types
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type RegistrationFormData = z.infer<typeof registrationFormSchema>;

interface SmartFormProps {
  variant: 'contact' | 'registration';
  onSubmit: (data: any) => Promise<void>;
  className?: string;
}

// Field strength indicator
const FieldStrength: React.FC<{ value: string; type: 'password' | 'email' }> = ({ 
  value, 
  type 
}) => {
  const [strength, setStrength] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (type === 'password') {
      let score = 0;
      const checks = [
        { regex: /.{8,}/, message: '8+ characters', points: 1 },
        { regex: /[A-Z]/, message: 'uppercase letter', points: 1 },
        { regex: /[a-z]/, message: 'lowercase letter', points: 1 },
        { regex: /[0-9]/, message: 'number', points: 1 },
        { regex: /[^A-Za-z0-9]/, message: 'special character', points: 1 },
      ];

      const missing = [];
      for (const check of checks) {
        if (check.regex.test(value)) {
          score += check.points;
        } else {
          missing.push(check.message);
        }
      }

      setStrength((score / checks.length) * 100);
      setFeedback(
        missing.length > 0 
          ? `Add: ${missing.join(', ')}` 
          : 'Strong password!'
      );
    }
  }, [value, type]);

  if (type !== 'password' || !value) return null;

  return (
    <div className="mt-2 space-y-1">
      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={cn(
            'h-full rounded-full',
            strength < 40 && 'bg-red-500',
            strength >= 40 && strength < 70 && 'bg-yellow-500',
            strength >= 70 && 'bg-green-500'
          )}
          initial={{ width: 0 }}
          animate={{ width: `${strength}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <p className="text-xs text-gray-600">{feedback}</p>
    </div>
  );
};

// Smart suggestions
const SmartSuggestions: React.FC<{ field: string; value: string }> = ({ 
  field, 
  value 
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (field === 'company' && value.length > 2) {
      // Simulate company suggestions
      const companies = [
        'Acme Corporation',
        'Tech Innovations Inc',
        'Global Solutions Ltd',
        'Digital Dynamics',
        'Future Systems',
      ];
      
      const filtered = companies.filter((c) =>
        c.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [field, value]);

  if (suggestions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200"
    >
      {suggestions.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
          onClick={() => {
            // Handle suggestion selection
          }}
        >
          {suggestion}
        </button>
      ))}
    </motion.div>
  );
};

export const SmartForm: React.FC<SmartFormProps> = ({
  variant,
  onSubmit,
  className,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const schema = variant === 'contact' ? contactFormSchema : registrationFormSchema;
  
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isValid, dirtyFields },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const watchedFields = watch();

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Field configuration
  const getFieldIcon = (field: string) => {
    const icons: Record<string, React.ReactNode> = {
      name: <User className="w-4 h-4" />,
      firstName: <User className="w-4 h-4" />,
      lastName: <User className="w-4 h-4" />,
      email: <Mail className="w-4 h-4" />,
      phone: <Phone className="w-4 h-4" />,
      company: <Building className="w-4 h-4" />,
      password: <Shield className="w-4 h-4" />,
    };
    return icons[field];
  };

  const renderField = (
    name: string,
    label: string,
    type: string = 'text',
    placeholder?: string
  ) => {
    const fieldError = errors[name as keyof typeof errors];
    const isDirty = dirtyFields[name as keyof typeof dirtyFields];
    const isFieldValid = isDirty && !fieldError;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {getFieldIcon(name)}
          </div>
          <input
            type={type === 'password' && showPassword ? 'text' : type}
            {...register(name as any)}
            onFocus={() => setFocusedField(name)}
            onBlur={() => setFocusedField(null)}
            placeholder={placeholder}
            className={cn(
              'w-full pl-10 pr-10 py-2 rounded-lg border transition-all duration-200',
              'bg-white',
              'focus:outline-none focus:ring-2',
              fieldError && 'border-red-500 focus:ring-red-500',
              isFieldValid && 'border-green-500 focus:ring-green-500',
              !fieldError && !isFieldValid && 'border-gray-300 focus:ring-primary-500'
            )}
          />
          
          {/* Status icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {type === 'password' && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}
            {type !== 'password' && isFieldValid && (
              <Check className="w-4 h-4 text-green-500" />
            )}
            {type !== 'password' && fieldError && (
              <X className="w-4 h-4 text-red-500" />
            )}
          </div>
        </div>

        {/* Field strength for password */}
        {type === 'password' && watchedFields[name] && (
          <FieldStrength value={watchedFields[name]} type="password" />
        )}

        {/* Smart suggestions */}
        {focusedField === name && name === 'company' && (
          <SmartSuggestions field={name} value={watchedFields[name] || ''} />
        )}

        {/* Error message */}
        <AnimatePresence>
          {fieldError && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-1 text-sm text-red-600 flex items-center gap-1"
            >
              <AlertCircle className="w-3 h-3" />
              {typeof fieldError === 'string' ? fieldError : (fieldError as any)?.message || 'Invalid input'}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <GlassCard variant="elevated" className={cn('p-6', className)}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Form header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h3 className="text-2xl font-semibold text-gray-900">
            {variant === 'contact' ? 'Get in Touch' : 'Create Account'}
          </h3>
          <p className="mt-2 text-gray-600">
            {variant === 'contact' 
              ? 'We\'ll respond within 24 hours'
              : 'Join thousands of satisfied customers'}
          </p>
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          {variant === 'contact' ? (
            <>
              {renderField('name', 'Full Name', 'text', 'John Doe')}
              {renderField('email', 'Email Address', 'email', 'john@example.com')}
              {renderField('phone', 'Phone Number (Optional)', 'tel', '+1 (555) 123-4567')}
              {renderField('company', 'Company (Optional)', 'text', 'Acme Corporation')}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service
                </label>
                <select
                  {...register('service')}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select a service</option>
                  <option value="cloud-strategy">Cloud Strategy</option>
                  <option value="devops">DevOps & Automation</option>
                  <option value="cybersecurity">Cybersecurity</option>
                  <option value="digital-transformation">Digital Transformation</option>
                  <option value="other">Other</option>
                </select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  {...register('message')}
                  rows={4}
                  placeholder="Tell us about your project..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {typeof errors.message === 'string' ? errors.message : (errors.message as any)?.message || 'Invalid message'}
                  </p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center"
              >
                <input
                  type="checkbox"
                  {...register('subscribe')}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Subscribe to our newsletter for updates
                </label>
              </motion.div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                {renderField('firstName', 'First Name', 'text', 'John')}
                {renderField('lastName', 'Last Name', 'text', 'Doe')}
              </div>
              {renderField('email', 'Email Address', 'email', 'john@example.com')}
              {renderField('password', 'Password', 'password')}
              {renderField('confirmPassword', 'Confirm Password', 'password')}
              {renderField('company', 'Company (Optional)', 'text', 'Acme Corporation')}
              {renderField('role', 'Role (Optional)', 'text', 'CTO')}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start"
              >
                <input
                  type="checkbox"
                  {...register('agreedToTerms')}
                  className="w-4 h-4 mt-1 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  I agree to the{' '}
                  <a href="/terms" className="text-primary-600 hover:underline">
                    Terms and Conditions
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-primary-600 hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </motion.div>
              {errors.agreedToTerms && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {typeof errors.agreedToTerms === 'string' ? errors.agreedToTerms : (errors.agreedToTerms as any)?.message || 'Please agree to terms'}
                </p>
              )}
            </>
          )}
        </div>

        {/* Submit button */}
        <AnimatedButton
          type="submit"
          variant="gradient"
          size="lg"
          className="w-full"
          disabled={!isValid || isSubmitting}
          animationStyle={isSubmitting ? 'pulse' : 'shine'}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {variant === 'contact' ? 'Send Message' : 'Create Account'}
            </>
          )}
        </AnimatedButton>

        {/* Success feedback */}
        <AnimatePresence>
          {isValid && Object.keys(dirtyFields).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center justify-center gap-2 text-green-600"
            >
              <Check className="w-5 h-5" />
              <span className="text-sm font-medium">Form is ready to submit!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </GlassCard>
  );
};