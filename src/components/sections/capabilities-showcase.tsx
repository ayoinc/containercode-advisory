import { CheckCircle, Award, Users, Target, Zap, Shield } from 'lucide-react';
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
      'Legacy system modernization',
      'Agile transformation processes'
    ]
  },
  {
    icon: Shield,
    title: 'Enterprise Security Leadership',
    description: 'Comprehensive cybersecurity solutions that protect your assets and ensure compliance.',
    highlights: [
      'Zero-trust security models',
      'Compliance framework implementation',
      '24/7 threat monitoring'
    ]
  },
  {
    icon: Target,
    title: 'Strategic Technology Consulting',
    description: 'Expert guidance to align technology investments with business objectives.',
    highlights: [
      'Technology roadmap development',
      'Architecture assessment and optimization',
      'Vendor selection and management'
    ]
  }
];

const stats = [
  { value: '100+', label: 'Enterprise Clients' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '50+', label: 'Cloud Migrations' },
  { value: '24/7', label: 'Expert Support' }
];

export function CapabilitiesShowcase() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom">
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="text-sm font-medium text-primary-600 mb-2 uppercase tracking-wider">
            OUR EXPERTISE
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Proven Excellence in Enterprise Technology Consulting
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            We deliver exceptional results through deep technical expertise, strategic thinking, 
            and unwavering commitment to your success.
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {capabilities.map((capability, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 bg-primary-100 rounded-xl flex items-center justify-center mr-4">
                  <capability.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold">{capability.title}</h3>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {capability.description}
              </p>
              
              <div className="space-y-3">
                {capability.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-primary-600 rounded-2xl shadow-2xl p-8 mb-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="text-white">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-primary-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4">
            <Link 
              href="/services"
              className="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors shadow-lg"
            >
              Explore Our Services
            </Link>
            <Link 
              href="/contact"
              className="inline-flex items-center px-8 py-4 bg-white hover:bg-gray-50 text-primary-600 border-2 border-primary-600 rounded-lg font-semibold transition-colors"
            >
              Discuss Your Project
            </Link>
          </div>
          <p className="text-gray-600 mt-4 text-sm">
            Ready to transform your technology infrastructure? Let&apos;s talk about your goals.
          </p>
        </div>
      </div>
    </section>
  );
}
