
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
      console.log(`Component ${name} took ${duration.toFixed(2)}ms`);
    }
    
    return result;
  }
}

// Bundle size analyzer
export const analyzeBundleSize = () => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    const scripts = document.querySelectorAll('script[src]');
    
    scripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src && src.includes('/_next/')) {
        console.log('Bundle script:', src);
      }
    });
  }
};
