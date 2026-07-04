'use client';

import { useState } from 'react';
import { Mail, Phone, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const services = [
  { value: 'Cloud Technologies', label: 'Cloud Technologies' },
  { value: 'Cybersecurity', label: 'Cybersecurity' },
  { value: 'DevOps & DevSecOps', label: 'DevOps & DevSecOps' },
  { value: 'Digital Transformation', label: 'Digital Transformation' },
  { value: 'Software Engineering', label: 'Software Engineering' },
  { value: 'Managed IT Support', label: 'IT Support & Management' },
];

export function CtaSection() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || 'Something went wrong. Please try again.');
      }
      setStatus('success');
      form.reset();
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  return (
    <section className="py-24 bg-navy-950 relative">
      <div aria-hidden className="absolute inset-0 bg-tech-dots opacity-40" />
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left — pitch + contact */}
          <div>
            <span className="tech-label">[ 05 ] — Start a Conversation</span>
            <h2 className="mt-4 mb-6 text-navy-100">Ready to Transform Your Technology?</h2>
            <p className="text-xl text-navy-200 mb-10">
              Schedule a consultation with our experts to discuss your specific needs and discover how
              we can help you achieve your technology goals.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-aqua-500/10 border border-aqua-500/20 p-2.5 rounded-lg">
                  <Mail className="h-5 w-5 text-aqua-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-navy-100 mb-1">Email Us</h3>
                  <p className="text-navy-300 mb-1">Get a response within 24 hours</p>
                  <a href="mailto:hello@containercode.club" className="text-aqua-400 hover:text-aqua-300 font-medium">
                    hello@containercode.club
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-aqua-500/10 border border-aqua-500/20 p-2.5 rounded-lg">
                  <Phone className="h-5 w-5 text-aqua-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-navy-100 mb-1">Call Us</h3>
                  <p className="text-navy-300 mb-1">Monday–Friday, 9AM–6PM GMT</p>
                  <a href="tel:+442079460958" className="text-aqua-400 hover:text-aqua-300 font-medium">
                    +44 (0) 20 7946 0958
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right — working contact form */}
          <div className="rounded-xl border border-navy-700 bg-navy-850 p-8 shadow-elevated card-featured">
            <h3 className="text-2xl font-bold text-navy-100 mb-6">Contact Us</h3>

            {status === 'success' ? (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-aqua-500/10 border border-aqua-500/30">
                <CheckCircle className="h-5 w-5 text-aqua-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-navy-100">Message sent</p>
                  <p className="text-sm text-navy-300">
                    Thank you — we&apos;ll be in touch within 24 hours.
                  </p>
                </div>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input id="name" name="name" type="text" required minLength={2} className="form-input" />
                </div>

                <div>
                  <label htmlFor="email" className="form-label">Email Address</label>
                  <input id="email" name="email" type="email" required className="form-input" />
                </div>

                <div>
                  <label htmlFor="service" className="form-label">Service of Interest</label>
                  <select id="service" name="service" required defaultValue="" className="form-select">
                    <option value="" disabled>Select a service…</option>
                    {services.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea id="message" name="message" rows={4} required minLength={10} className="form-textarea" />
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-2 text-sm text-error-400">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-aqua-500 hover:bg-aqua-400 disabled:opacity-60 disabled:cursor-not-allowed text-navy-950 rounded font-semibold transition-colors"
                >
                  {status === 'submitting' && <Loader2 className="h-4 w-4 animate-spin" />}
                  {status === 'submitting' ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
