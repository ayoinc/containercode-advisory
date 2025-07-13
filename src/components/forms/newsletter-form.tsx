'use client';

import { useState } from 'react';
import { Button, Input, Card, CardContent } from '@/components/ui';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';

interface NewsletterFormProps {
  onSubmit?: (email: string) => Promise<void>;
  className?: string;
  variant?: 'inline' | 'card' | 'minimal';
  title?: string;
  description?: string;
}

export default function NewsletterForm({ 
  onSubmit, 
  className,
  variant = 'card',
  title = 'Stay Updated',
  description = 'Get the latest insights on cloud architecture and DevOps best practices.'
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setErrorMessage('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        await onSubmit(email);
      } else {
        // Default API call to newsletter endpoint
        const response = await fetch('/api/newsletter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to subscribe');
        }
      }

      setStatus('success');
      setEmail('');
      
      // Reset success state after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const FormContent = () => (
    <>
      {(title || description) && variant !== 'minimal' && (
        <div className="mb-6">
          {title && (
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
          )}
          {description && (
            <p className="text-gray-600 text-sm">
              {description}
            </p>
          )}
        </div>
      )}

      {status === 'success' ? (
        <div className="text-center py-4">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Thank you for subscribing!
          </h4>
          <p className="text-gray-600 text-sm">
            You'll receive our latest updates and insights in your inbox.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className={variant === 'inline' ? 'flex gap-2' : 'space-y-4'}>
            <div className={variant === 'inline' ? 'flex-1' : ''}>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                state={errorMessage ? 'error' : 'default'}
                errorMessage={errorMessage}
                leftIcon={<Mail className="h-4 w-4" />}
                className={variant === 'inline' ? 'mb-0' : ''}
              />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting || !email.trim()}
              variant="primary"
              className={variant === 'inline' ? 'px-6' : 'w-full'}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </div>
          
          {status === 'error' && !errorMessage && (
            <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
              <AlertCircle className="h-4 w-4" />
              <span>Something went wrong. Please try again.</span>
            </div>
          )}
        </form>
      )}

      {variant !== 'minimal' && (
        <p className="text-xs text-gray-500 mt-4 text-center">
          We respect your privacy. Unsubscribe at any time.
        </p>
      )}
    </>
  );

  if (variant === 'card') {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <FormContent />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={className}>
      <FormContent />
    </div>
  );
}
