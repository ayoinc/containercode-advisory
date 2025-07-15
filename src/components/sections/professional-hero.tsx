'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Star, Shield, Award, Users, TrendingUp, Clock } from 'lucide-react';
import { HeroImage } from '@/components/ui/images/smart-image';

export function ProfessionalHero() {
  const trustMetrics = [
    { metric: 150, suffix: '+', label: 'Successful Transformations' },
    { metric: 99.9, suffix: '%', label: 'Service Reliability' },
    { metric: 24, suffix: '/7', label: 'Expert Support' },
    { metric: 5, suffix: '★', label: 'Client Satisfaction' }
  ];

  const keyCapabilities = [
    'Multi-cloud expertise across all major platforms',
    'Security-first approach with regulatory compliance',
    'DevOps automation and operational excellence',
    'Strategic digital transformation guidance'
  ];

  const trustLogos = [
    { name: 'AWS', color: 'text-orange-500' },
    { name: 'Azure', color: 'text-primary-600' },
    { name: 'GCP', color: 'text-green-500' },
    { name: 'Oracle', color: 'text-red-600' },
    { name: 'IBM', color: 'text-primary-700' }
  ];

  const AnimatedCounter = ({ from, to, duration, suffix }: { from: number; to: number; duration: number; suffix: string }) => {
    const [count, setCount] = React.useState(from);

    React.useEffect(() => {
      let startTime: number;
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        
        setCount(from + (to - from) * progress);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      const timer = setTimeout(() => requestAnimationFrame(animate), 1000);
      return () => clearTimeout(timer);
    }, [from, to, duration]);

    return (
      <span>
        {Math.round(count * 10) / 10}{suffix}
      </span>
    );
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 bg-gradient-to-br from-gray-50 via-white to-primary-50">
      
      {/* Professional background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236b7280' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div 
                className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 border border-gray-200 text-gray-700 mb-6"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Award className="w-4 h-4 mr-2 text-primary-600" />
                <span className="text-sm font-medium">Trusted by Industry Leaders</span>
              </motion.div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Transforming Businesses Through{' '}
                <span className="text-primary-600">
                  Cloud Excellence
                </span>
              </h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <p className="text-xl text-gray-600 max-w-xl leading-relaxed">
                We partner with forward-thinking organisations to accelerate their digital transformation journey. 
                Our expertise spans multi-cloud architectures, cybersecurity, and operational excellence - delivering 
                measurable results that drive sustainable growth.
              </p>
            </motion.div>

            {/* Capabilities */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="space-y-4 mb-8">
                {keyCapabilities.map((capability, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center text-gray-700"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span>{capability}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="flex flex-wrap gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/contact" 
                    className="group inline-flex items-center px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Start Your Transformation
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/services" 
                    className="group inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300"
                  >
                    View Success Stories
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
            >
              <div className="pt-8 border-t border-gray-200">
                <p className="text-gray-500 text-sm mb-6">Trusted by organisations worldwide</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {trustMetrics.map((metric, index) => (
                    <motion.div 
                      key={index} 
                      className="text-center"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-2xl font-bold text-primary-600 mb-1">
                        <AnimatedCounter
                          from={0}
                          to={metric.metric}
                          duration={2 + index * 0.2}
                          suffix={metric.suffix}
                        />
                      </div>
                      <div className="text-xs text-gray-500">{metric.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Right Column - Hero Image with Professional Dashboard */}
          <motion.div
            className="hidden lg:block relative"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {/* Hero Image Background */}
            <div className="relative mb-8">
              <HeroImage 
                alt="Cloud computing infrastructure and digital transformation"
                className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl" />
            </div>

            
          </motion.div>
        </div>
      </div>
      
      {/* Professional scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <div className="flex flex-col items-center">
          <span className="text-gray-500 text-sm mb-2">Discover our expertise</span>
          <motion.div 
            className="w-6 h-10 border-2 border-gray-300 rounded-full flex items-start justify-center p-1"
            whileHover={{ scale: 1.1 }}
          >
            <motion.div 
              className="w-1.5 h-3 bg-gray-400 rounded-full"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}