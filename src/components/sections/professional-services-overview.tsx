'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Cloud,
  Shield,
  Cog,
  TrendingUp,
  Code,
  Headphones,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

export function ProfessionalServicesOverview() {
  const reduce = useReducedMotion();

  const services = [
    {
      icon: Cloud,
      title: 'Multi-Cloud Technologies',
      description:
        'Strategic cloud adoption across AWS, Azure, Google Cloud, Oracle, and IBM platforms with seamless integration and optimised performance.',
      features: ['Cloud migration strategies', 'Multi-cloud architecture', 'Hybrid solutions', 'Cost optimisation'],
      link: '/services/cloud-technologies',
    },
    {
      icon: Shield,
      title: 'Cybersecurity Excellence',
      description:
        'Comprehensive security frameworks with proactive threat detection, compliance management, and regulatory adherence across all sectors.',
      features: ['Security assessments', 'Compliance frameworks', 'Incident response', 'Risk management'],
      link: '/services/cybersecurity',
    },
    {
      icon: Cog,
      title: 'DevOps & DevSecOps',
      description:
        'Streamlined development workflows with automated CI/CD pipelines, infrastructure as code, and integrated security practices.',
      features: ['CI/CD automation', 'Infrastructure as code', 'Container orchestration', 'Monitoring solutions'],
      link: '/services/devops',
    },
    {
      icon: TrendingUp,
      title: 'Digital Transformation',
      description:
        'Strategic business modernisation with technology-driven solutions that enhance operational efficiency and competitive advantage.',
      features: ['Process automation', 'Legacy modernisation', 'Data analytics', 'Change management'],
      link: '/services/digital-transformation',
    },
    {
      icon: Code,
      title: 'Software Engineering',
      description:
        'Bespoke software development with modern architectural patterns, scalable solutions, and maintainable codebases.',
      features: ['Custom development', 'API design', 'Microservices', 'Quality assurance'],
      link: '/services/software-engineering',
    },
    {
      icon: Headphones,
      title: 'Managed IT Support',
      description:
        '24/7 comprehensive IT support services with proactive monitoring, rapid resolution, and strategic technology guidance.',
      features: ['24/7 monitoring', 'Help desk support', 'System maintenance', 'Strategic planning'],
      link: '/services/it-support',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-navy-950 relative">
      <div aria-hidden className="absolute inset-0 bg-tech-dots opacity-50" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="tech-label">[ 01 ] — Comprehensive Services</span>
          <h2 className="mt-4 mb-6 text-navy-100">Expert Solutions for Digital Excellence</h2>
          <p className="text-lg text-navy-200 leading-relaxed">
            We provide end-to-end technology solutions designed to accelerate your digital
            transformation, enhance security posture, and drive sustainable business growth across all
            industry sectors.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={reduce ? undefined : { opacity: 0, y: 24 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
              className="group relative flex flex-col rounded-lg border border-navy-700 bg-navy-850 p-7 transition-all duration-300 hover:border-aqua-500/40 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-aqua-500/10 border border-aqua-500/20 text-aqua-400">
                  <service.icon className="w-6 h-6" />
                </div>
                <span className="font-mono text-xs text-navy-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <h3 className="text-xl font-semibold text-navy-100 mb-3">{service.title}</h3>
              <p className="text-sm text-navy-300 mb-6 leading-relaxed flex-grow">{service.description}</p>

              <ul className="space-y-2 mb-6">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm text-navy-200">
                    <CheckCircle className="w-4 h-4 text-aqua-400 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={service.link as any}
                className="inline-flex items-center text-aqua-400 hover:text-aqua-300 font-semibold text-sm transition-colors"
              >
                Learn More
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA banner */}
        <div className="mt-16 rounded-xl border border-navy-700 bg-gradient-to-br from-navy-850 to-navy-900 p-8 md:p-12 card-featured">
          <div className="max-w-3xl">
            <h3 className="text-2xl font-bold text-navy-100 mb-4">
              Ready to Transform Your Technology Landscape?
            </h3>
            <p className="text-navy-200 mb-8">
              Let&apos;s discuss how our comprehensive services can accelerate your digital transformation
              journey and deliver measurable business value.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-aqua-500 hover:bg-aqua-400 text-navy-950 rounded font-semibold transition-colors"
              >
                Schedule Consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-navy-600 text-navy-100 hover:border-aqua-500/50 hover:bg-navy-800 rounded font-semibold transition-colors"
              >
                View All Services
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
