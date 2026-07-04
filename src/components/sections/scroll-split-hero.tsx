'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  motion,
  useMotionValue,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const HERO_SRC = '/images/hero-cloud-computing-1.jpeg';
const HERO_ALT = 'Multi-cloud infrastructure and digital transformation';
const SLICES = 5;

const metrics = [
  { value: '150+', label: 'Transformations' },
  { value: '99.9%', label: 'Reliability' },
  { value: '24/7', label: 'Support' },
  { value: '5.0', label: 'Satisfaction' },
];

/**
 * One vertical slice of the hero image. All slices render the SAME image and
 * are clipped to their own vertical band via clip-path; at rest (progress 0)
 * they reconstruct the whole picture with no gaps. On scroll they translate
 * outward (outer slices travel further) with a little vertical parallax and
 * tilt, then fade — like container doors parting to reveal the dark canvas.
 * Only compositor properties (transform/opacity) animate.
 */
function Slice({
  index,
  progress,
}: {
  index: number;
  progress: MotionValue<number>;
}) {
  const center = (SLICES - 1) / 2;
  const offset = index - center; // -2..2 for 5 slices
  const leftInset = (index / SLICES) * 100;
  const rightInset = ((SLICES - 1 - index) / SLICES) * 100;

  const spread = 26; // % of hero width the ±1 slices travel; outer ones ×2
  const x = useTransform(progress, [0, 1], ['0%', `${offset * spread}%`]);
  const y = useTransform(progress, [0, 1], ['0%', `${Math.abs(offset) * 9}%`]);
  const rotate = useTransform(progress, [0, 1], [0, offset * 1.5]);
  const opacity = useTransform(progress, [0, 0.45, 0.92], [1, 1, 0]);

  const clip = `inset(0 ${rightInset}% 0 ${leftInset}%)`;

  return (
    <motion.div
      aria-hidden={index !== 0}
      className="absolute inset-0 will-change-transform"
      style={{ x, y, rotate, opacity, clipPath: clip, WebkitClipPath: clip }}
    >
      <Image
        src={HERO_SRC}
        alt={index === 0 ? HERO_ALT : ''}
        fill
        priority={index === 0}
        sizes="100vw"
        className="object-cover"
        unoptimized
      />
    </motion.div>
  );
}

function HeroContent() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <span className="tech-label inline-flex items-center gap-2 mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-aqua-400 animate-pulse" />
          {'// Trusted by industry leaders'}
        </span>
        <h1 className="mb-6">
          Transforming Businesses Through{' '}
          <span className="text-gradient-aqua">Cloud Excellence</span>
        </h1>
        <p className="text-lg md:text-xl text-navy-200 max-w-xl mb-8 leading-relaxed">
          We partner with forward-thinking organisations to accelerate their digital
          transformation — multi-cloud architecture, cybersecurity, and operational
          excellence that drives measurable growth.
        </p>
        <div className="flex flex-wrap gap-4 mb-10">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 px-7 py-3.5 bg-aqua-500 text-navy-950 font-semibold rounded hover:bg-aqua-400 transition-colors shadow-button hover:shadow-glow"
          >
            Start Your Transformation
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-7 py-3.5 border border-aqua-500/50 text-aqua-400 font-semibold rounded hover:bg-aqua-500/10 transition-colors"
          >
            View Success Stories
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-4 sm:gap-6 max-w-lg border-t border-navy-700 pt-6">
          {metrics.map((m) => (
            <div key={m.label}>
              <div className="font-display text-2xl font-bold text-aqua-400 tabular-nums">
                {m.value}
              </div>
              <div className="text-xs text-navy-300">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Reduced-motion / no-JS fallback: a static full-bleed hero, no split. */
function StaticHero() {
  return (
    <section className="relative min-h-screen flex items-center bg-navy-900 overflow-hidden pt-20">
      <div className="absolute inset-0">
        <Image
          src={HERO_SRC}
          alt={HERO_ALT}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          unoptimized
        />
      </div>
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/70 to-navy-950/30" />
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-900 to-transparent" />
      <div className="relative z-10 w-full">
        <HeroContent />
      </div>
    </section>
  );
}

export function ScrollSplitHero() {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);

  // Manual scroll → progress. framer's useScroll({target}) reports a
  // non-monotonic (triangular) progress when the target contains a sticky
  // child, so we compute progress ourselves from the track's position:
  // 0 when the track top hits the viewport top, 1 once we've scrolled the
  // full pinned distance (trackHeight − viewport height). Always monotonic.
  const progress = useMotionValue(0);
  useEffect(() => {
    if (reduce) return;
    const update = () => {
      const el = trackRef.current;
      if (!el) return;
      const range = el.offsetHeight - window.innerHeight;
      const p = range > 0 ? (window.scrollY - el.offsetTop) / range : 0;
      progress.set(Math.min(1, Math.max(0, p)));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [progress, reduce]);

  const contentOpacity = useTransform(progress, [0, 0.4], [1, 0]);
  const contentY = useTransform(progress, [0, 0.4], ['0%', '-10%']);
  const hintOpacity = useTransform(progress, [0, 0.15], [1, 0]);

  // Reduced-motion users get the static hero (hooks above still run — fine).
  if (reduce) return <StaticHero />;

  return (
    <section ref={trackRef} className="relative h-[180vh] md:h-[240vh] bg-navy-900">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Reveal backdrop shown as the slices part */}
        <div aria-hidden className="absolute inset-0 bg-navy-900 bg-tech-grid opacity-70" />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 70% 30%, rgb(20 184 166 / 0.14), transparent 55%)',
          }}
        />

        {/* Image slices */}
        {Array.from({ length: SLICES }).map((_, i) => (
          <Slice key={i} index={i} progress={progress} />
        ))}

        {/* Legibility scrim over the image (does not split) */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/55 to-navy-950/10"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-900 to-transparent"
        />

        {/* Hero content — fades/rises as the split begins */}
        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="relative z-10 h-full flex items-center"
        >
          <HeroContent />
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center"
        >
          <span className="font-mono text-xs text-navy-400 mb-2">scroll to split</span>
          <div className="w-6 h-10 border-2 border-navy-600 rounded-full flex items-start justify-center p-1">
            <motion.div
              className="w-1.5 h-3 bg-aqua-400 rounded-full"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
