#!/usr/bin/env node
/**
 * Performance Optimization Script
 * Implements dynamic imports and code splitting for better performance
 */

const fs = require('fs');
const path = require('path');
const { performance } = require('perf_hooks');

class PerformanceOptimizer {
  constructor() {
    this.optimizations = [];
    this.startTime = performance.now();
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : '⚡';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  // Create dynamic import wrapper for heavy components
  createDynamicImports() {
    this.log('Creating dynamic imports for heavy components...');
    
    // Create dynamic import for framer-motion components
    const dynamicMotionComponent = `
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy load framer-motion components
export const MotionDiv = dynamic(
  () => import('framer-motion').then(mod => ({ default: mod.motion.div })),
  { 
    ssr: false,
    loading: () => <div className="animate-pulse" />
  }
);

export const MotionSection = dynamic(
  () => import('framer-motion').then(mod => ({ default: mod.motion.section })),
  { 
    ssr: false,
    loading: () => <section className="animate-pulse" />
  }
);

export const AnimatePresence = dynamic(
  () => import('framer-motion').then(mod => ({ default: mod.AnimatePresence })),
  { 
    ssr: false,
    loading: () => <div />
  }
);

// Wrapper component with Suspense
export const LazyMotionWrapper = ({ children }) => (
  <Suspense fallback={<div className="animate-pulse h-32" />}>
    {children}
  </Suspense>
);
`;

    const dynamicComponentsPath = path.join(process.cwd(), 'src/components/ui/dynamic-components.tsx');
    fs.writeFileSync(dynamicComponentsPath, dynamicMotionComponent);
    this.log('Created dynamic motion components');

    // Create dynamic imports for heavy UI components
    const dynamicUIComponent = `
import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Lazy load heavy UI components
export const LazyAccordion = dynamic(
  () => import('@nextui-org/react').then(mod => ({ default: mod.Accordion })),
  { 
    ssr: false,
    loading: () => <div className="animate-pulse h-12 bg-gray-200 rounded" />
  }
);

export const LazyModal = dynamic(
  () => import('@nextui-org/react').then(mod => ({ default: mod.Modal })),
  { 
    ssr: false,
    loading: () => <div />
  }
);

export const LazyDropdown = dynamic(
  () => import('@nextui-org/react').then(mod => ({ default: mod.Dropdown })),
  { 
    ssr: false,
    loading: () => <div className="animate-pulse h-8 bg-gray-200 rounded" />
  }
);

// Chart components (if needed)
export const LazyChart = dynamic(
  () => import('recharts').then(mod => ({ default: mod.LineChart })),
  { 
    ssr: false,
    loading: () => <div className="animate-pulse h-64 bg-gray-200 rounded" />
  }
);
`;

    const dynamicUIPath = path.join(process.cwd(), 'src/components/ui/dynamic-ui.tsx');
    fs.writeFileSync(dynamicUIPath, dynamicUIComponent);
    this.log('Created dynamic UI components');

    this.optimizations.push('Dynamic imports created');
  }

  // Create performance monitoring utilities
  createPerformanceMonitoring() {
    this.log('Creating performance monitoring utilities...');

    const performanceUtils = `
import { performance } from 'perf_hooks';

// Web Vitals monitoring
export const reportWebVitals = (metric: any) => {
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics service
    console.log(metric);
  }
};

// Performance measurement utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance() {
    if (!this.instance) {
      this.instance = new PerformanceMonitor();
    }
    return this.instance;
  }

  startMeasure(name: string) {
    this.metrics.set(name, performance.now());
  }

  endMeasure(name: string) {
    const startTime = this.metrics.get(name);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.metrics.delete(name);
      return duration;
    }
    return 0;
  }

  measureComponent<T>(name: string, component: () => T): T {
    this.startMeasure(name);
    const result = component();
    const duration = this.endMeasure(name);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(\`Component \${name} took \${duration.toFixed(2)}ms\`);
    }
    
    return result;
  }
}

// Bundle size analyzer
export const analyzeBundleSize = () => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const scripts = document.querySelectorAll('script[src]');
    let totalSize = 0;
    
    scripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src && src.includes('/_next/')) {
        console.log('Bundle script:', src);
      }
    });
  }
};
`;

    const performanceUtilsPath = path.join(process.cwd(), 'src/utils/performance.ts');
    fs.writeFileSync(performanceUtilsPath, performanceUtils);
    this.log('Created performance monitoring utilities');

    this.optimizations.push('Performance monitoring created');
  }

  // Optimize image loading
  optimizeImages() {
    this.log('Creating optimized image component...');

    const optimizedImageComponent = `
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  ...props
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Generate blur data URL for placeholder
  const generateBlurDataURL = (width: number, height: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, width, height);
      return canvas.toDataURL();
    }
    return '';
  };

  useEffect(() => {
    if (placeholder === 'blur' && !blurDataURL && width && height) {
      const dataURL = generateBlurDataURL(width, height);
      // Set blur data URL
    }
  }, [placeholder, blurDataURL, width, height]);

  if (hasError) {
    return (
      <div 
        className={\`bg-gray-200 flex items-center justify-center \${className}\`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">Image failed to load</span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={\`transition-opacity duration-300 \${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } \${className}\`}
        priority={priority}
        sizes={sizes}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        {...props}
      />
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ width, height }}
        />
      )}
    </div>
  );
};

// Lazy image component for non-critical images
export const LazyImage = (props: OptimizedImageProps) => {
  const [isInView, setIsInView] = useState(false);
  const [imgRef, setImgRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!imgRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(imgRef);
    return () => observer.disconnect();
  }, [imgRef]);

  return (
    <div ref={setImgRef} className={props.className}>
      {isInView ? (
        <OptimizedImage {...props} />
      ) : (
        <div 
          className="bg-gray-200 animate-pulse"
          style={{ width: props.width, height: props.height }}
        />
      )}
    </div>
  );
};
`;

    const optimizedImagePath = path.join(process.cwd(), 'src/components/ui/optimized-image.tsx');
    fs.writeFileSync(optimizedImagePath, optimizedImageComponent);
    this.log('Created optimized image components');

    this.optimizations.push('Image optimization created');
  }

  // Create bundle analyzer script
  createBundleAnalyzer() {
    this.log('Creating bundle analyzer script...');

    const bundleAnalyzerScript = `
{
  "name": "analyze-bundle",
  "scripts": {
    "analyze": "cross-env ANALYZE=true next build",
    "analyze:server": "cross-env ANALYZE=true BUNDLE_ANALYZE=server next build",
    "analyze:browser": "cross-env ANALYZE=true BUNDLE_ANALYZE=browser next build"
  }
}
`;

    // Update package.json with bundle analysis scripts
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      packageJson.scripts = {
        ...packageJson.scripts,
        "analyze": "cross-env ANALYZE=true next build",
        "analyze:server": "cross-env ANALYZE=true BUNDLE_ANALYZE=server next build",
        "analyze:browser": "cross-env ANALYZE=true BUNDLE_ANALYZE=browser next build"
      };

      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      this.log('Updated package.json with bundle analysis scripts');
    }

    this.optimizations.push('Bundle analyzer configured');
  }

  // Create security enhancements
  createSecurityEnhancements() {
    this.log('Creating security enhancements...');

    const securityUtils = `
import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from 'utils/rate-limit';

// Input validation utilities
export const validateInput = (input: string, maxLength: number = 1000): string => {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }
  
  if (input.length > maxLength) {
    throw new Error(\`Input too long. Maximum length is \${maxLength} characters\`);
  }
  
  // Remove potentially harmful characters
  const sanitized = input
    .replace(/<script[^>]*>.*?<\\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\\w+\\s*=/gi, '')
    .trim();
  
  return sanitized;
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

// CSRF protection
export const generateCSRFToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Rate limiting middleware
export const withRateLimit = (handler: any) => {
  return async (req: NextRequest) => {
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    
    try {
      await rateLimit.check(ip, 10, '1 m'); // 10 requests per minute
      return handler(req);
    } catch {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }
  };
};

// Security headers middleware
export const withSecurityHeaders = (response: NextResponse) => {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
};
`;

    const securityUtilsPath = path.join(process.cwd(), 'src/utils/security.ts');
    fs.writeFileSync(securityUtilsPath, securityUtils);
    this.log('Created security utilities');

    // Create rate limiting utility
    const rateLimitUtils = `
interface RateLimitConfig {
  interval: number;
  uniqueTokenPerInterval: number;
}

class RateLimiter {
  private config: RateLimitConfig;
  private hits: Map<string, number[]> = new Map();

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  async check(identifier: string, limit: number, window: string): Promise<void> {
    const now = Date.now();
    const windowMs = this.parseWindow(window);
    
    if (!this.hits.has(identifier)) {
      this.hits.set(identifier, []);
    }
    
    const userHits = this.hits.get(identifier)!;
    
    // Remove old hits outside the window
    const validHits = userHits.filter(hit => now - hit < windowMs);
    
    if (validHits.length >= limit) {
      throw new Error('Rate limit exceeded');
    }
    
    validHits.push(now);
    this.hits.set(identifier, validHits);
  }

  private parseWindow(window: string): number {
    const match = window.match(/(\\d+)\\s*(s|m|h|d)/);
    if (!match) return 60000; // Default to 1 minute
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    switch (unit) {
      case 's': return value * 1000;
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      default: return value * 1000;
    }
  }
}

export const rateLimit = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 unique tokens per interval
});
`;

    const rateLimitPath = path.join(process.cwd(), 'src/utils/rate-limit.ts');
    fs.writeFileSync(rateLimitPath, rateLimitUtils);
    this.log('Created rate limiting utilities');

    this.optimizations.push('Security enhancements created');
  }

  // Run all optimizations
  async runOptimizations() {
    this.log('🚀 Starting Performance Optimization');
    
    try {
      this.createDynamicImports();
      this.createPerformanceMonitoring();
      this.optimizeImages();
      this.createBundleAnalyzer();
      this.createSecurityEnhancements();
      
      const duration = performance.now() - this.startTime;
      
      this.log('\n✅ Performance Optimization Complete');
      this.log(`⏱️  Total Duration: ${(duration / 1000).toFixed(2)}s`);
      this.log(`🔧 Optimizations Applied: ${this.optimizations.length}`);
      
      this.log('\n📋 Optimizations Summary:');
      this.optimizations.forEach((opt, index) => {
        this.log(`   ${index + 1}. ${opt}`);
      });
      
      this.log('\n🔄 Next Steps:');
      this.log('   1. Update components to use dynamic imports');
      this.log('   2. Replace heavy imports with lazy-loaded alternatives');
      this.log('   3. Use OptimizedImage component for all images');
      this.log('   4. Run "npm run analyze" to check bundle size');
      this.log('   5. Test performance improvements');
      
    } catch (error) {
      this.log(`❌ Optimization failed: ${error.message}`, 'error');
    }
  }
}

// Run optimization if called directly
if (require.main === module) {
  const optimizer = new PerformanceOptimizer();
  optimizer.runOptimizations();
}

module.exports = PerformanceOptimizer;