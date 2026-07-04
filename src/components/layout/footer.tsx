'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ExternalLink } from '@/components/ui/external-link';
import { Linkedin, Twitter, Github, Mail, Phone, MapPin, ArrowRight, Building2, CheckCircle, AlertCircle } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newsletterEmail.trim()) {
      setStatus('error');
      setErrorMessage('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to subscribe');
      }

      setStatus('success');
      setNewsletterEmail('');
      
      // Reset success state after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <footer className="relative w-full py-20 md:py-24 bg-navy-950 text-navy-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          {/* Company Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center space-x-3">
              <img
                src="/images/containercode-icon.svg"
                alt="ContainerCode Advisory"
                className="h-10 w-10"
              />
              <h3 className="text-xl font-bold">ContainerCode Advisory</h3>
            </div>
            <p className="text-navy-200 max-w-md leading-relaxed">
              Strategic technology consultancy specialising in multi-cloud solutions, cybersecurity excellence, 
              and digital transformation. Trusted by organisations worldwide to deliver measurable results.
            </p>
            
            {/* Newsletter Subscription */}
            <div className="max-w-md">
              <h4 className="text-lg font-semibold mb-3">Stay Informed</h4>
              <p className="text-navy-300 text-sm mb-4">
                Subscribe to our insights newsletter for expert analysis and industry updates.
              </p>
              <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleNewsletterSubmit}>
                <div className="flex-1">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-4 py-3 bg-navy-950 border border-navy-700 text-navy-100 placeholder-navy-300 focus:border-aqua-500 focus:ring-1 focus:ring-aqua-500 rounded transition-colors"
                    aria-label="Email for newsletter subscription"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-aqua-500 hover:bg-aqua-400 disabled:bg-navy-700 disabled:text-navy-300 disabled:cursor-not-allowed text-navy-950 rounded font-semibold transition-colors whitespace-nowrap"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
              {status === 'success' && (
                <div className="flex items-center space-x-2 mt-3 p-3 bg-aqua-500/10 border border-aqua-500/30 rounded">
                  <CheckCircle className="h-4 w-4 text-aqua-400" />
                  <span className="text-sm text-aqua-300">
                    Thank you for subscribing! Please check your email to confirm your subscription.
                  </span>
                </div>
              )}
              {status === 'error' && errorMessage && (
                <div className="flex items-center space-x-2 mt-3 p-3 bg-error-700/30 border border-error-500/40 rounded">
                  <AlertCircle className="h-4 w-4 text-error-400" />
                  <span className="text-sm text-error-300">
                    {errorMessage}
                  </span>
                </div>
              )}
              <p className="text-xs text-navy-400 mt-2">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <ExternalLink 
                href="https://linkedin.com/company/containercode-advisory" 
                className="p-3 bg-navy-850 hover:bg-navy-800 rounded-lg transition-colors group" 
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="h-5 w-5 group-hover:text-aqua-400 transition-colors" />
              </ExternalLink>
              <ExternalLink 
                href="https://twitter.com/containercode" 
                className="p-3 bg-navy-850 hover:bg-navy-800 rounded-lg transition-colors group" 
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-5 w-5 group-hover:text-sky-400 transition-colors" />
              </ExternalLink>
              <ExternalLink 
                href="https://github.com/containercode" 
                className="p-3 bg-navy-850 hover:bg-navy-800 rounded-lg transition-colors group" 
                aria-label="View our GitHub"
              >
                <Github className="h-5 w-5 group-hover:text-navy-200 transition-colors" />
              </ExternalLink>
            </div>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-6 text-white">Services</h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/services/cloud-technologies" 
                  className="text-navy-200 hover:text-aqua-400 transition-colors inline-flex items-center group"
                >
                  Multi-Cloud Technologies
                  <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/services/cybersecurity" 
                  className="text-navy-200 hover:text-aqua-400 transition-colors inline-flex items-center group"
                >
                  Cybersecurity Excellence
                  <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/services/devops" 
                  className="text-navy-200 hover:text-aqua-400 transition-colors inline-flex items-center group"
                >
                  DevOps & DevSecOps
                  <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/services/digital-transformation" 
                  className="text-navy-200 hover:text-aqua-400 transition-colors inline-flex items-center group"
                >
                  Digital Transformation
                  <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/services/software-engineering" 
                  className="text-navy-200 hover:text-aqua-400 transition-colors inline-flex items-center group"
                >
                  Software Engineering
                  <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/services/it-support" 
                  className="text-navy-200 hover:text-aqua-400 transition-colors inline-flex items-center group"
                >
                  Managed IT Support
                  <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-6 text-white">Company</h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/about" 
                  className="text-navy-200 hover:text-aqua-400 transition-colors inline-flex items-center group"
                >
                  About Us
                  <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/resources" 
                  className="text-navy-200 hover:text-aqua-400 transition-colors inline-flex items-center group"
                >
                  Resources
                  <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className="text-navy-200 hover:text-aqua-400 transition-colors inline-flex items-center group"
                >
                  Insights
                  <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/team" 
                  className="text-navy-200 hover:text-aqua-400 transition-colors inline-flex items-center group"
                >
                  Our Team
                  <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-navy-200 hover:text-aqua-400 transition-colors inline-flex items-center group"
                >
                  Contact Us
                  <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq" 
                  className="text-navy-200 hover:text-aqua-400 transition-colors inline-flex items-center group"
                >
                  FAQ
                  <ArrowRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-3">
            <h3 className="text-lg font-semibold mb-6 text-white">Contact Information</h3>
            <ul className="space-y-6">
              <li className="flex items-start space-x-3 text-navy-200">
                <Mail className="h-5 w-5 mt-0.5 text-aqua-400 flex-shrink-0" />
                <div>
                  <span className="block text-sm text-navy-300 mb-1">General Enquiries:</span>
                  <a 
                    href="mailto:hello@containercode.club" 
                    className="text-aqua-400 hover:text-aqua-300 transition-colors font-medium"
                  >
                    hello@containercode.club
                  </a>
                </div>
              </li>
              <li className="flex items-start space-x-3 text-navy-200">
                <Phone className="h-5 w-5 mt-0.5 text-aqua-400 flex-shrink-0" />
                <div>
                  <span className="block text-sm text-navy-300 mb-1">Telephone:</span>
                  <a 
                    href="tel:+442079460958" 
                    className="text-aqua-400 hover:text-aqua-300 transition-colors font-medium"
                  >
                    +44 (0) 20 7946 0958
                  </a>
                  <div className="text-sm text-navy-400 mt-1">
                    Monday-Friday, 9AM-6PM GMT
                  </div>
                </div>
              </li>
              <li className="flex items-start space-x-3 text-navy-200">
                <MapPin className="h-5 w-5 mt-0.5 text-aqua-400 flex-shrink-0" />
                <div>
                  <span className="block text-sm text-navy-300 mb-1">Headquarters:</span>
                  <address className="not-italic">
                    London, United Kingdom<br />
                    <span className="text-sm text-navy-400">Serving clients globally</span>
                  </address>
                </div>
              </li>
            </ul>

            {/* Emergency Support */}
            <div className="mt-8 p-4 bg-navy-850 rounded-lg border border-navy-700">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-4 w-4 text-error-400" />
                <span className="text-sm font-semibold text-white">Emergency Support</span>
              </div>
              <p className="text-xs text-navy-300 mb-3">
                24/7 critical issue assistance available
              </p>
              <a
                href="tel:+442079460958"
                className="inline-flex items-center gap-2 text-sm text-error-400 hover:text-error-300 transition-colors font-medium"
              >
                <Phone className="h-3 w-3" />
                Emergency Hotline
              </a>
            </div>
          </div>
        </div>

        {/* Certifications & Partnerships */}
        <div className="py-8 border-t border-b border-navy-800">
          <div className="text-center mb-6">
            <h4 className="text-lg font-semibold text-white mb-2">Certified Partners & Accreditations</h4>
            <p className="text-navy-300 text-sm">
              Industry-leading certifications and partnerships ensuring exceptional service delivery
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 text-navy-300">
            <div className="text-sm font-medium">AWS Partner</div>
            <div className="text-sm font-medium">Microsoft Partner</div>
            <div className="text-sm font-medium">Google Cloud Partner</div>
            <div className="text-sm font-medium">ISO 27001 Certified</div>
            <div className="text-sm font-medium">SOC 2 Type II</div>
            <div className="text-sm font-medium">Cyber Essentials Plus</div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-navy-300 text-sm">
            © {currentYear} ContainerCode Advisory Limited. All rights reserved. Company registered in England and Wales.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4 md:mt-0">
            <Link 
              href="/privacy" 
              className="text-navy-300 hover:text-aqua-400 text-sm transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="text-navy-300 hover:text-aqua-400 text-sm transition-colors"
            >
              Terms & Conditions
            </Link>
            <Link
              href={"/cookies" as any}
              className="text-navy-300 hover:text-aqua-400 text-sm transition-colors"
            >
              Cookie Policy
            </Link>
            <Link
              href={"/accessibility" as any}
              className="text-navy-300 hover:text-aqua-400 text-sm transition-colors"
            >
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}