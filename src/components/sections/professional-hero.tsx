'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Terminal } from 'lucide-react';

export function ProfessionalHero() {
  const reduce = useReducedMotion();

  const trustMetrics = [
    { value: '150+', label: 'Successful Transformations' },
    { value: '99.9%', label: 'Service Reliability' },
    { value: '24/7', label: 'Expert Support' },
    { value: '5.0', label: 'Client Satisfaction' },
  ];

  const keyCapabilities = [
    'Multi-cloud expertise across all major platforms',
    'Security-first approach with regulatory compliance',
    'DevOps automation and operational excellence',
    'Strategic digital transformation guidance',
  ];

  const cloudProviders = ['AWS', 'Azure', 'GCP', 'Oracle', 'IBM'];

  // Entrance choreography — disabled under prefers-reduced-motion
  const fade = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-navy-900">
      {/* Technical grid + aqua glow backdrop */}
      <div aria-hidden className="absolute inset-0 bg-tech-grid opacity-60" />
      <div
        aria-hidden
        className="absolute -top-1/4 right-0 h-[60rem] w-[60rem] rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgb(20 184 166 / 0.12) 0%, transparent 60%)' }}
      />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-900 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left — content */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div {...fade(0)}>
              <span className="tech-label inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-aqua-400 animate-pulse" />
                {'// Trusted by industry leaders'}
              </span>
            </motion.div>

            <motion.h1 {...fade(0.08)} className="max-w-2xl">
              Transforming Businesses Through{' '}
              <span className="text-gradient-aqua">Cloud Excellence</span>
            </motion.h1>

            <motion.p {...fade(0.16)} className="text-lg md:text-xl text-navy-200 max-w-xl leading-relaxed">
              We partner with forward-thinking organisations to accelerate their digital transformation
              journey. Our expertise spans multi-cloud architectures, cybersecurity, and operational
              excellence — delivering measurable results that drive sustainable growth.
            </motion.p>

            <motion.ul {...fade(0.24)} className="grid sm:grid-cols-2 gap-3">
              {keyCapabilities.map((capability) => (
                <li key={capability} className="flex items-start gap-3 text-navy-200">
                  <CheckCircle2 className="w-5 h-5 text-aqua-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{capability}</span>
                </li>
              ))}
            </motion.ul>

            <motion.div {...fade(0.32)} className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-aqua-500 text-navy-950 font-semibold rounded hover:bg-aqua-400 transition-colors shadow-button hover:shadow-glow"
              >
                Start Your Transformation
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/services"
                className="group inline-flex items-center gap-2 px-7 py-3.5 border border-aqua-500/50 text-aqua-400 font-semibold rounded hover:bg-aqua-500/10 transition-colors"
              >
                View Success Stories
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Trust metrics — rendered with final values (SSR-correct, no-JS safe) */}
            <motion.div {...fade(0.4)} className="pt-8 border-t border-navy-700">
              <p className="tech-label mb-5 text-navy-300">Trusted by organisations worldwide</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {trustMetrics.map((metric) => (
                  <div key={metric.label}>
                    <div className="font-display text-3xl font-bold text-aqua-400 mb-1 tabular-nums">
                      {metric.value}
                    </div>
                    <div className="text-xs text-navy-300">{metric.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — console-framed hero image (shown on all breakpoints) */}
          <motion.div
            {...(reduce
              ? {}
              : {
                  initial: { opacity: 0, scale: 0.96 },
                  animate: { opacity: 1, scale: 1 },
                  transition: { duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const },
                })}
            className="lg:col-span-5"
          >
            <div className="relative rounded-xl border border-navy-700 bg-navy-850 shadow-elevated overflow-hidden">
              {/* Console title bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-navy-700 bg-navy-900/60">
                <span className="h-3 w-3 rounded-full bg-error-500/70" />
                <span className="h-3 w-3 rounded-full bg-tertiary-400/70" />
                <span className="h-3 w-3 rounded-full bg-aqua-500/80" />
                <span className="ml-2 inline-flex items-center gap-2 font-mono text-xs text-navy-300">
                  <Terminal className="w-3.5 h-3.5" />
                  ~/containercode — multi-cloud
                </span>
              </div>

              {/* Deterministic hero image (priority → preloadable LCP, in server HTML) */}
              <div className="relative aspect-[4/3]">
                <Image
                  src="/images/hero-cloud-computing-1.jpeg"
                  alt="Multi-cloud infrastructure and digital transformation"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                  priority
                  unoptimized
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent" />
                {/* Live status chip */}
                <div className="absolute top-3 right-3 badge badge-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-aqua-400" />
                  Live
                </div>
              </div>

              {/* Cloud provider strip */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-3 border-t border-navy-700 bg-navy-900/60">
                <span className="font-mono text-[0.65rem] uppercase tracking-widest text-navy-400">
                  platforms:
                </span>
                {cloudProviders.map((p) => (
                  <span key={p} className="font-mono text-xs font-semibold text-navy-200">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        {...(reduce ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.8 } })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center"
      >
        <span className="font-mono text-xs text-navy-400 mb-2">scroll</span>
        <div className="w-6 h-10 border-2 border-navy-600 rounded-full flex items-start justify-center p-1">
          <motion.div
            className="w-1.5 h-3 bg-aqua-400 rounded-full"
            animate={reduce ? {} : { y: [0, 16, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
