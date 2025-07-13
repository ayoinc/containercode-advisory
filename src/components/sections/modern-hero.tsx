'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Star, Sparkles, Shield, Zap } from 'lucide-react';
import { CardSpotlight, AnimatedCounter } from '@/components/ui/modern-cards';
import { MeshGradient } from '@/components/ui/modern-backgrounds';

export function ModernHero() {
  const trustIndicators = [
    { metric: 150, suffix: '+', label: 'Projects Delivered' },
    { metric: 99.9, suffix: '%', label: 'Uptime SLA' },
    { metric: 24, suffix: '/7', label: 'Support Available' },
    { metric: 5, suffix: '★', label: 'Client Rating' }
  ];

  const serviceHighlights = [
    'Multi-cloud expertise across AWS, Azure, GCP',
    'Security-first approach with compliance',
    'DevOps automation and optimization',
    'Digital transformation consulting'
  ];

  const floatingIcons = [
    { icon: Shield, color: 'text-primary-400', delay: 0 },
    { icon: Zap, color: 'text-purple-400', delay: 0.5 },
    { icon: Star, color: 'text-yellow-400', delay: 1 },
  ];

  return (
    <MeshGradient>
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        
        {/* Floating Icons */}
        <div className="absolute inset-0 z-0">
          {floatingIcons.map((item, index) => (
            <motion.div
              key={index}
              className={`absolute ${item.color}`}
              style={{
                left: `${20 + index * 30}%`,
                top: `${30 + index * 20}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4 + index,
                repeat: Infinity,
                ease: "easeInOut",
                delay: item.delay,
              }}
            >
              <item.icon className="w-8 h-8 opacity-20" />
            </motion.div>
          ))}
        </div>
        
        {/* Content */}
        <div className="container-custom relative z-10 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Text Content */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.div 
                  className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white mb-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Award-Winning Multi-Cloud Specialists</span>
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                  Cloud Excellence with{' '}
                  <motion.span 
                    className="bg-gradient-to-r from-primary-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    Security-First
                  </motion.span>{' '}
                  Approach
                </h1>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <p className="text-xl text-white/90 max-w-xl leading-relaxed">
                  Expert consulting across Azure, AWS, Google Cloud, Oracle, and IBM with integrated cybersecurity and DevOps excellence. Transform your infrastructure with confidence.
                </p>
              </motion.div>

              {/* Service highlights */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <div className="space-y-3 mb-8">
                  {serviceHighlights.map((highlight, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center text-white/80"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">{highlight}</span>
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
                      className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-semibold rounded-xl hover:from-primary-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-primary-500/25"
                    >
                      Schedule Consultation
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      href="/services" 
                      className="group inline-flex items-center px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-white/30 transition-all duration-300 backdrop-blur-sm"
                    >
                      Explore Services
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
                <div className="pt-8 border-t border-white/10">
                  <p className="text-white/60 text-sm mb-6">Trusted metrics that matter</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {trustIndicators.map((indicator, index) => (
                      <motion.div 
                        key={index} 
                        className="text-center"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="text-2xl font-bold text-primary-400 mb-1">
                          <AnimatedCounter
                            from={0}
                            to={indicator.metric}
                            duration={2 + index * 0.2}
                            suffix={indicator.suffix}
                          />
                        </div>
                        <div className="text-xs text-white/60">{indicator.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Right Column - Interactive Dashboard */}
            <motion.div
              className="hidden lg:block"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <CardSpotlight className="bg-white/10 backdrop-blur-md border-white/20">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold text-lg">Cloud Infrastructure Health</h3>
                    <motion.div 
                      className="w-3 h-3 bg-green-400 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  
                  {/* Mock dashboard elements */}
                  <div className="space-y-4">
                    {[
                      { label: 'Performance Score', value: '98.7%', color: 'green' },
                      { label: 'Security Rating', value: 'AAA', color: 'blue' },
                      { label: 'Cost Optimization', value: '-32%', color: 'orange' }
                    ].map((metric, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white/70 text-sm">{metric.label}</span>
                          <span className={`text-${metric.color}-400 font-semibold`}>{metric.value}</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <motion.div 
                            className={`bg-gradient-to-r from-${metric.color}-400 to-${metric.color}-600 h-2 rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: metric.label === 'Cost Optimization' ? '68%' : '95%' }}
                            transition={{ duration: 1.5, delay: 1.6 + index * 0.2 }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.div
                    className="pt-4 border-t border-white/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 2 }}
                  >
                    <div className="text-xs text-white/60 mb-2">Active Services</div>
                    <div className="flex flex-wrap gap-2">
                      {['AWS', 'Azure', 'GCP', 'Oracle', 'IBM'].map((cloud, index) => (
                        <motion.span 
                          key={cloud} 
                          className="px-2 py-1 bg-white/10 rounded text-xs text-white/80 border border-white/20"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 2.2 + index * 0.1 }}
                        >
                          {cloud}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </CardSpotlight>
              
            </motion.div>
          </div>
        </div>
        
        {/* Enhanced scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          <div className="flex flex-col items-center">
            <span className="text-white/60 text-sm mb-2">Scroll to explore</span>
            <motion.div 
              className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1"
              whileHover={{ scale: 1.1 }}
            >
              <motion.div 
                className="w-1.5 h-3 bg-white/60 rounded-full"
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </motion.div>
      </section>
    </MeshGradient>
  );
}