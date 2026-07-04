import { CheckCircle, Target, Zap, Shield } from 'lucide-react';
import Link from 'next/link';

interface Capability {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  highlights: string[];
}

const capabilities: Capability[] = [
  {
    icon: Zap,
    title: 'Digital Transformation Excellence',
    description: 'We accelerate your digital journey with proven methodologies and cutting-edge technologies.',
    highlights: [
      'Cloud-native architecture design',
      'Legacy system modernisation',
      'Agile transformation processes',
    ],
  },
  {
    icon: Shield,
    title: 'Enterprise Security Leadership',
    description: 'Comprehensive cybersecurity solutions that protect your assets and ensure compliance.',
    highlights: [
      'Zero-trust security models',
      'Compliance framework implementation',
      '24/7 threat monitoring',
    ],
  },
  {
    icon: Target,
    title: 'Strategic Technology Consulting',
    description: 'Expert guidance to align technology investments with business objectives.',
    highlights: [
      'Technology roadmap development',
      'Architecture assessment and optimisation',
      'Vendor selection and management',
    ],
  },
];

const stats = [
  { value: '150+', label: 'Enterprise Clients' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '50+', label: 'Cloud Migrations' },
  { value: '24/7', label: 'Expert Support' },
];

export function CapabilitiesShowcase() {
  return (
    <section className="py-24 bg-navy-950 relative">
      <div aria-hidden className="absolute inset-0 bg-tech-dots opacity-40" />
      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="tech-label">[ 03 ] — Our Expertise</span>
          <h2 className="mt-4 mb-6 text-navy-100">
            Proven Excellence in Enterprise Technology Consulting
          </h2>
          <p className="text-lg text-navy-200 leading-relaxed">
            We deliver exceptional results through deep technical expertise, strategic thinking, and
            unwavering commitment to your success.
          </p>
        </div>

        {/* Capabilities grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-12">
          {capabilities.map((capability, index) => (
            <div
              key={index}
              className="rounded-lg border border-navy-700 bg-navy-850 p-8 transition-all duration-300 hover:border-aqua-500/40 hover:-translate-y-1"
            >
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-lg bg-aqua-500/10 border border-aqua-500/20 flex items-center justify-center mr-4">
                  <capability.icon className="h-6 w-6 text-aqua-400" />
                </div>
                <h3 className="text-lg font-semibold text-navy-100">{capability.title}</h3>
              </div>

              <p className="text-navy-300 mb-6 leading-relaxed">{capability.description}</p>

              <div className="space-y-3">
                {capability.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-aqua-400 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-navy-200">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Stats band */}
        <div className="rounded-xl border border-navy-700 bg-gradient-to-br from-navy-850 to-navy-900 p-8 mb-12 card-featured">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="font-display text-3xl md:text-4xl font-bold text-gradient-aqua mb-2 tabular-nums">
                  {stat.value}
                </div>
                <div className="font-mono text-xs uppercase tracking-wider text-navy-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <Link
            href="/services"
            className="inline-flex items-center px-8 py-4 bg-aqua-500 hover:bg-aqua-400 text-navy-950 rounded font-semibold transition-colors shadow-button"
          >
            Explore Our Services
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-transparent hover:bg-aqua-500/10 text-aqua-400 border border-aqua-500/50 rounded font-semibold transition-colors"
          >
            Discuss Your Project
          </Link>
        </div>
        <p className="text-navy-300 mt-4 text-sm">
          Ready to transform your technology infrastructure? Let&apos;s talk about your goals.
        </p>
      </div>
    </section>
  );
}
