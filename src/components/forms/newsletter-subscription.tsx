'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui/micro-interactions';

interface NewsletterSubscriptionProps {
  className?: string;
  variant?: 'default' | 'minimal' | 'featured';
  showFrequencyOptions?: boolean;
  showInterests?: boolean;
}

interface SubscriptionFormData {
  email: string;
  firstName: string;
  lastName: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  interests: string[];
  source: string;
}

const INTEREST_OPTIONS = [
  'Cloud Computing',
  'DevOps & Automation',
  'Cybersecurity',
  'Digital Transformation',
  'AWS',
  'Azure',
  'Google Cloud',
  'Kubernetes',
  'Microservices',
  'Serverless',
  'AI/ML',
  'Data Analytics'
];

export const NewsletterSubscription: React.FC<NewsletterSubscriptionProps> = ({
  className,
  variant = 'default',
  showFrequencyOptions = true,
  showInterests = true
}) => {
  const [formData, setFormData] = useState<SubscriptionFormData>({
    email: '',
    firstName: '',
    lastName: '',
    frequency: 'weekly',
    interests: [],
    source: 'website_newsletter_form'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: keyof SubscriptionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      setError('Email address is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/newsletter-subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSubmitted(true);
      } else {
        setError(result.message || 'Subscription failed. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn('text-center', className)}
      >
        <GlassCard className="p-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          </motion.div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            🎉 Welcome to the Community!
          </h3>
          
          <p className="text-gray-600 mb-6">
            Thank you for subscribing! You'll receive our {formData.frequency} newsletter 
            with the latest insights in cloud computing and digital transformation.
          </p>
          
          <div className="bg-primary-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-primary-800">
              📧 Check your email for a welcome message with next steps.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                email: '',
                firstName: '',
                lastName: '',
                frequency: 'weekly',
                interests: [],
                source: 'website_newsletter_form'
              });
            }}
            className="btn-primary"
          >
            Subscribe Another Email
          </motion.button>
        </GlassCard>
      </motion.div>
    );
  }

  const isMinimal = variant === 'minimal';
  const isFeatured = variant === 'featured';

  return (
    <div className={cn('w-full max-w-md mx-auto', className)}>
      {isFeatured && (
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Stay Ahead of the Curve
            </h2>
            <p className="text-lg text-gray-600">
              Get cutting-edge insights on cloud computing, DevOps, and digital transformation 
              delivered directly to your inbox.
            </p>
          </motion.div>
        </div>
      )}

      <GlassCard className={cn("p-6", isMinimal ? "" : "shadow-lg")}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isMinimal && (
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Join Our Newsletter
              </h3>
              <p className="text-gray-600 text-sm">
                Get expert insights and industry updates
              </p>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 "
                required
              />
              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {/* Name Fields */}
          {!isMinimal && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="John"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 "
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-gray-900 "
                />
              </div>
            </div>
          )}

          {/* Frequency Selection */}
          {showFrequencyOptions && !isMinimal && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How often would you like to hear from us?
              </label>
              <div className="space-y-2">
                {[
                  { value: 'daily', label: 'Daily', description: 'Latest updates every day' },
                  { value: 'weekly', label: 'Weekly', description: 'Weekly digest (recommended)' },
                  { value: 'monthly', label: 'Monthly', description: 'Monthly summary' }
                ].map((option) => (
                  <motion.label
                    key={option.value}
                    whileHover={{ scale: 1.02 }}
                    className={cn(
                      'flex items-center p-3 rounded-lg border cursor-pointer transition-all',
                      formData.frequency === option.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-300 hover:border-primary-300'
                    )}
                  >
                    <input
                      type="radio"
                      name="frequency"
                      value={option.value}
                      checked={formData.frequency === option.value}
                      onChange={(e) => handleInputChange('frequency', e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                    <div className={cn(
                      'w-4 h-4 rounded-full border-2 flex items-center justify-center',
                      formData.frequency === option.value
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-gray-300'
                    )}>
                      {formData.frequency === option.value && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                  </motion.label>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          {showInterests && !isMinimal && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Topics of Interest (optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((interest) => (
                  <motion.button
                    key={interest}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleInterestToggle(interest)}
                    className={cn(
                      'px-3 py-1 rounded-full text-sm font-medium transition-all',
                      formData.interests.includes(interest)
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 '
                    )}
                  >
                    {interest}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-red-700 text-sm">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isSubmitting || !formData.email}
            whileHover={!isSubmitting ? { scale: 1.02 } : {}}
            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            className={cn(
              'w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all',
              'bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700',
              'text-white shadow-lg hover:shadow-xl',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Subscribing...
              </>
            ) : (
              <>
                <Mail className="w-5 h-5" />
                Subscribe to Newsletter
              </>
            )}
          </motion.button>

          {/* Privacy Notice */}
          <p className="text-xs text-gray-500 text-center">
            We respect your privacy. Unsubscribe at any time. 
            <br />
            By subscribing, you agree to our privacy policy.
          </p>
        </form>
      </GlassCard>
    </div>
  );
};