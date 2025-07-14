'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Cloud, 
  Shield, 
  Cog, 
  TrendingUp, 
  Code, 
  Headphones,
  ArrowRight,
  CheckCircle,
  Users,
  Award
} from 'lucide-react';
import { ServiceImage } from '@/components/ui/images/smart-image';

export function ProfessionalServicesOverview() {
  const services = [
    {
      icon: Cloud,
      title: 'Multi-Cloud Technologies',
      description: 'Strategic cloud adoption across AWS, Azure, Google Cloud, Oracle, and IBM platforms with seamless integration and optimised performance.',
      features: ['Cloud migration strategies', 'Multi-cloud architecture', 'Hybrid solutions', 'Cost optimisation'],
      link: '/services/cloud-technologies',
      gradient: 'from-primary-500 to-primary-600',
      service: 'cloud-technologies' as const
    },
    {
      icon: Shield,
      title: 'Cybersecurity Excellence',
      description: 'Comprehensive security frameworks with proactive threat detection, compliance management, and regulatory adherence across all sectors.',
      features: ['Security assessments', 'Compliance frameworks', 'Incident response', 'Risk management'],
      link: '/services/cybersecurity',
      gradient: 'from-green-500 to-green-600',
      service: 'cybersecurity' as const
    },
    {
      icon: Cog,
      title: 'DevOps & DevSecOps',
      description: 'Streamlined development workflows with automated CI/CD pipelines, infrastructure as code, and integrated security practices.',
      features: ['CI/CD automation', 'Infrastructure as code', 'Container orchestration', 'Monitoring solutions'],
      link: '/services/devops',
      gradient: 'from-purple-500 to-purple-600',
      service: 'devops' as const
    },
    {
      icon: TrendingUp,
      title: 'Digital Transformation',
      description: 'Strategic business modernisation with technology-driven solutions that enhance operational efficiency and competitive advantage.',
      features: ['Process automation', 'Legacy modernisation', 'Data analytics', 'Change management'],
      link: '/services/digital-transformation',
      gradient: 'from-orange-500 to-orange-600',
      service: 'digital-transformation' as const
    },
    {
      icon: Code,
      title: 'Software Engineering',
      description: 'Bespoke software development with modern architectural patterns, scalable solutions, and maintainable codebases.',
      features: ['Custom development', 'API design', 'Microservices', 'Quality assurance'],
      link: '/services/software-engineering',
      gradient: 'from-indigo-500 to-indigo-600',
      service: 'software-engineering' as const
    },
    {
      icon: Headphones,
      title: 'Managed IT Support',
      description: '24/7 comprehensive IT support services with proactive monitoring, rapid resolution, and strategic technology guidance.',
      features: ['24/7 monitoring', 'Help desk support', 'System maintenance', 'Strategic planning'],
      link: '/services/it-support',
      gradient: 'from-teal-500 to-teal-600',
      service: 'it-support' as const
    }
  ];

  const stats = [
    { number: '500+', label: 'Clients Served', icon: Users },
    { number: '99.9%', label: 'Uptime SLA', icon: TrendingUp },
    { number: '150+', label: 'Projects Delivered', icon: CheckCircle },
    { number: '24/7', label: 'Expert Support', icon: Headphones }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mb-6">
              <Award className="w-4 h-4 mr-2" />
              Comprehensive Services
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Expert Solutions for Digital Excellence
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We provide end-to-end technology solutions designed to accelerate your digital transformation, 
              enhance security posture, and drive sustainable business growth across all industry sectors.
            </p>
          </motion.div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full overflow-hidden">
                {/* Service Image */}
                <div className="relative h-48">
                  <ServiceImage 
                    category={
                      service.service === 'cloud-technologies' ? 'cloud computing' :
                      service.service === 'cybersecurity' ? 'cybersecurity' :
                      service.service === 'devops' ? 'software development' :
                      service.service === 'digital-transformation' ? 'digital innovation' :
                      service.service === 'software-engineering' ? 'software development' :
                      service.service === 'it-support' ? 'digital innovation' :
                      'cloud computing' // fallback
                    }
                    alt={`${service.title} professional services`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Icon overlay */}
                  <div className={`absolute top-4 left-4 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${service.gradient} text-white shadow-lg`}>
                    <service.icon className="w-6 h-6" />
                  </div>
                </div>

                <div className="p-8">
                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Link */}
                  <Link
                    href={service.link as any}
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold group-hover:translate-x-1 transition-all duration-300"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Proven Track Record</h3>
            <p className="text-gray-600">
              Delivering exceptional results for organisations across the globe
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-primary-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="text-center mt-12"
        >
          <div className="bg-gray-900 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Technology Landscape?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Let's discuss how our comprehensive services can accelerate your digital transformation journey 
              and deliver measurable business value.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors"
              >
                Schedule Consultation
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center px-6 py-3 border-2 border-white text-white hover:bg-white hover:text-gray-900 rounded-lg font-semibold transition-all duration-300"
              >
                View All Services
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}