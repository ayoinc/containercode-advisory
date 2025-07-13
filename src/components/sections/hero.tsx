'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FadeInUp, StaggerContainer, StaggerItem, HoverScale } from '@/components/ui/animations';
import { ArrowRight, CheckCircle2, Star } from 'lucide-react';

export function Hero() {
  const trustIndicators = [
    { metric: '50+', label: 'Projects Delivered' },
    { metric: '99.9%', label: 'Uptime SLA' },
    { metric: '24/7', label: 'Support Available' },
    { metric: '5-Star', label: 'Client Rating' }
  ];

  const serviceHighlights = [
    'Multi-cloud expertise across AWS, Azure, GCP',
    'Security-first approach with compliance',
    'DevOps automation and optimization',
    'Digital transformation consulting'
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Enhanced background with glassmorphism */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-secondary-900" />
        <div className="absolute inset-0 opacity-10 bg-[url('/images/grid-pattern.svg')]" />
        
        {/* Floating geometric shapes for modern look */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-secondary-500/10 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-primary-400/5 rounded-full blur-lg animate-pulse delay-500" />
      </div>
      
      {/* Content overlay */}
      <div className="container-custom relative z-10 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <StaggerContainer className="space-y-8">
            <StaggerItem>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-900/20 backdrop-blur-sm border border-primary-500/20 text-primary-400 mb-6">
                <Star className="w-4 h-4 mr-2 fill-current" />
                <span className="text-sm font-medium">Award-Winning Multi-Cloud Specialists</span>
              </div>
            </StaggerItem>
            
            <StaggerItem>
              <FadeInUp delay={0.2}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                  Cloud Excellence with{' '}
                  <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                    Security-First
                  </span>{' '}
                  Approach
                </h1>
              </FadeInUp>
            </StaggerItem>
            
            <StaggerItem>
              <FadeInUp delay={0.4}>
                <p className="text-xl text-white/90 max-w-xl leading-relaxed">
                  Expert consulting across Azure, AWS, Google Cloud, Oracle, and IBM with integrated cybersecurity and DevOps excellence. Transform your infrastructure with confidence.
                </p>
              </FadeInUp>
            </StaggerItem>

            {/* Service highlights */}
            <StaggerItem>
              <FadeInUp delay={0.6}>
                <div className="space-y-3 mb-8">
                  {serviceHighlights.map((highlight, index) => (
                    <div key={index} className="flex items-center text-white/80">
                      <CheckCircle2 className="w-5 h-5 text-primary-400 mr-3 flex-shrink-0" />
                      <span className="text-sm">{highlight}</span>
                    </div>
                  ))}
                </div>
              </FadeInUp>
            </StaggerItem>
            
            <StaggerItem>
              <FadeInUp delay={0.8}>
                <div className="flex flex-wrap gap-4">
                  <HoverScale>
                    <Link 
                      href="/contact" 
                      className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-lg hover:from-primary-500 hover:to-primary-400 transition-all duration-300 shadow-lg hover:shadow-primary-500/25"
                    >
                      Schedule Consultation
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </HoverScale>
                  
                  <HoverScale>
                    <Link 
                      href="/services" 
                      className="group inline-flex items-center px-8 py-4 border-2 border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 hover:border-white/30 transition-all duration-300 backdrop-blur-sm"
                    >
                      Explore Services
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </HoverScale>
                </div>
              </FadeInUp>
            </StaggerItem>
            
            {/* Trust indicators */}
            <StaggerItem>
              <FadeInUp delay={1.0}>
                <div className="pt-8 border-t border-white/10">
                  <p className="text-white/60 text-sm mb-6">Trusted metrics that matter</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {trustIndicators.map((indicator, index) => (
                      <div key={index} className="text-center">
                        <div className="text-2xl font-bold text-primary-400 mb-1">{indicator.metric}</div>
                        <div className="text-xs text-white/60">{indicator.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeInUp>
            </StaggerItem>
          </StaggerContainer>
          
          {/* Enhanced visual element */}
          <FadeInUp delay={1.2} className="hidden lg:block">
            <div className="relative">
              {/* Glassmorphism card */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold text-lg">Cloud Infrastructure Health</h3>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  
                  {/* Mock dashboard elements */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-sm">Performance Score</span>
                      <span className="text-green-400 font-semibold">98.7%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-400 to-primary-400 h-2 rounded-full w-[98.7%]"></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-sm">Security Rating</span>
                      <span className="text-primary-400 font-semibold">AAA</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-primary-400 to-primary-600 h-2 rounded-full w-full"></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-white/70 text-sm">Cost Optimization</span>
                      <span className="text-orange-400 font-semibold">-32%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div className="bg-gradient-to-r from-orange-400 to-orange-500 h-2 rounded-full w-[68%]"></div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10">
                    <div className="text-xs text-white/60 mb-2">Active Services</div>
                    <div className="flex flex-wrap gap-2">
                      {['AWS', 'Azure', 'GCP', 'Oracle', 'IBM'].map((cloud) => (
                        <span key={cloud} className="px-2 py-1 bg-white/10 rounded text-xs text-white/80">{cloud}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </FadeInUp>
        </div>
      </div>
      
      {/* Enhanced scroll indicator */}
      <FadeInUp delay={1.4} className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center">
          <span className="text-white/60 text-sm mb-2">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse"></div>
          </div>
        </div>
      </FadeInUp>
    </section>
  );
}
