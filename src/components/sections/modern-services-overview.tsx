'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Cloud, Shield, Code, Database, Zap, Settings, CheckCircle } from 'lucide-react';
import { CardSpotlight, FloatingCard } from '@/components/ui/modern-cards';
import { Section, Container } from '@/components/ui';

const services = [
  {
    id: 'cloud-technologies',
    icon: Cloud,
    title: 'Cloud Technologies',
    description: 'Migrate, optimize, and manage your cloud infrastructure across AWS, Azure, and Google Cloud Platform.',
    gradient: 'from-primary-500 to-cyan-500',
    features: [
      'Multi-cloud architecture design',
      'Cloud migration strategy & execution',
      'Cost optimization & monitoring',
      'Performance tuning & scaling'
    ],
    href: '/services/cloud-technologies',
    stats: { projects: '50+', savings: '40%', uptime: '99.9%' }
  },
  {
    id: 'cybersecurity',
    icon: Shield,
    title: 'Cybersecurity',
    description: 'Protect your business with comprehensive security assessments, compliance, and threat protection.',
    gradient: 'from-red-500 to-pink-500',
    features: [
      'Security assessments & audits',
      'Compliance framework implementation',
      'Threat detection & response',
      'Security architecture design'
    ],
    href: '/services/cybersecurity',
    stats: { compliance: '100%', response: '<5min', breaches: '0' }
  },
  {
    id: 'devops-devsecops',
    icon: Code,
    title: 'DevOps & DevSecOps',
    description: 'Streamline your development lifecycle with automated CI/CD pipelines and security integration.',
    gradient: 'from-green-500 to-emerald-500',
    features: [
      'CI/CD pipeline implementation',
      'Infrastructure as Code',
      'Container orchestration',
      'Security integration (DevSecOps)'
    ],
    href: '/services/devops',
    stats: { deployment: '10x faster', automation: '90%', reliability: '99.9%' }
  },
  {
    id: 'digital-transformation',
    icon: Database,
    title: 'Digital Transformation',
    description: 'Transform your business processes with modern technology solutions and strategic planning.',
    gradient: 'from-purple-500 to-violet-500',
    features: [
      'Digital strategy development',
      'Legacy system modernization',
      'Process automation',
      'Change management'
    ],
    href: '/services/digital-transformation',
    stats: { roi: '300%', efficiency: '+60%', adoption: '95%' }
  },
  {
    id: 'software-engineering',
    icon: Zap,
    title: 'Software Engineering',
    description: 'Custom software development, API design, and application modernization services.',
    gradient: 'from-orange-500 to-amber-500',
    features: [
      'Custom application development',
      'API design & integration',
      'Microservices architecture',
      'Application modernization'
    ],
    href: '/services/software-engineering',
    stats: { apps: '100+', performance: '2x faster', uptime: '99.9%' }
  },
  {
    id: 'it-support-management',
    icon: Settings,
    title: 'IT Support & Management',
    description: 'Ongoing IT support, system monitoring, and infrastructure management for your business.',
    gradient: 'from-teal-500 to-cyan-500',
    features: [
      '24/7 system monitoring',
      'Managed IT services',
      'Infrastructure maintenance',
      'Technical support'
    ],
    href: '/services/it-support',
    stats: { uptime: '99.9%', response: '<15min', resolution: '95%' }
  }
];

export function ModernServicesOverview() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <Section spacing="xl" background="slate">
      <Container>
        <motion.div 
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-600 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Our Core Services</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Enterprise Solutions That
            <span className="block bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Drive Results
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From cloud migration to cybersecurity, we provide comprehensive technology consulting 
            that transforms businesses and accelerates growth.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <CardSpotlight 
                className="h-full group cursor-pointer"
                spotlightColor={service.gradient.includes('blue') ? '#3B82F6' : 
                              service.gradient.includes('red') ? '#EF4444' :
                              service.gradient.includes('green') ? '#10B981' :
                              service.gradient.includes('purple') ? '#8B5CF6' :
                              service.gradient.includes('orange') ? '#F59E0B' : '#06B6D4'}
              >
                <div className="flex flex-col h-full">
                  {/* Header with Icon */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 bg-gradient-to-r ${service.gradient} rounded-2xl shadow-lg`}>
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <motion.div
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.1 }}
                    >
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-sm text-gray-700 mb-3">Key Features:</h4>
                      <ul className="space-y-2">
                        {service.features.slice(0, 3).map((feature, featureIndex) => (
                          <motion.li 
                            key={featureIndex} 
                            className="flex items-center gap-2 text-sm text-gray-600"
                            initial={{ opacity: 0, x: -10 }}
                            animate={inView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.4, delay: (index * 0.1) + (featureIndex * 0.05) }}
                          >
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                    </div>

                    {/* Stats Preview */}
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        {Object.entries(service.stats).slice(0, 3).map(([key, value], statIndex) => (
                          <div key={key}>
                            <div className="text-lg font-bold text-gray-900">{value}</div>
                            <div className="text-xs text-gray-500 capitalize">{key}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-auto">
                    <Link 
                      href={service.href as any}
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold group-hover:gap-2 transition-all"
                    >
                      Learn More 
                      <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </CardSpotlight>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-lg text-gray-600 mb-8">
            Can't find exactly what you're looking for? We create custom solutions.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/contact"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-primary-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-primary-500/25"
            >
              Discuss Your Needs
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}
