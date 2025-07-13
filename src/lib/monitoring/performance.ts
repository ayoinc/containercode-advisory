/**
 * Performance Monitoring System
 * Tracks Core Web Vitals and custom metrics
 */

import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals';

// Types for performance metrics
export interface PerformanceMetrics {
  cls?: number;
  fcp?: number;
  fid?: number;
  lcp?: number;
  ttfb?: number;
  custom?: Record<string, number>;
}

// Performance thresholds based on Google's recommendations
export const PERFORMANCE_THRESHOLDS = {
  cls: { good: 0.1, needsImprovement: 0.25 },
  fcp: { good: 1800, needsImprovement: 3000 },
  fid: { good: 100, needsImprovement: 300 },
  lcp: { good: 2500, needsImprovement: 4000 },
  ttfb: { good: 800, needsImprovement: 1800 },
};

// Performance monitoring class
class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private listeners: Array<(metrics: PerformanceMetrics) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeVitals();
      this.trackCustomMetrics();
    }
  }

  // Initialize Core Web Vitals tracking
  private initializeVitals() {
    onCLS((metric) => this.handleMetric('cls', metric.value));
    onFCP((metric) => this.handleMetric('fcp', metric.value));
    onINP((metric) => this.handleMetric('fid', metric.value)); // Use INP instead of FID
    onLCP((metric) => this.handleMetric('lcp', metric.value));
    onTTFB((metric) => this.handleMetric('ttfb', metric.value));
  }

  // Handle individual metric updates
  private handleMetric(name: keyof PerformanceMetrics, value: number) {
    if (name === 'custom') {
      // Don't assign number to custom record
      return;
    }
    (this.metrics as any)[name] = value;
    this.notifyListeners();
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      const threshold = PERFORMANCE_THRESHOLDS[name as keyof typeof PERFORMANCE_THRESHOLDS];
      if (threshold) {
        const rating = value <= threshold.good ? 'good' : 
                      value <= threshold.needsImprovement ? 'needs improvement' : 
                      'poor';
        console.log(`[Performance] ${name.toUpperCase()}: ${value}ms (${rating})`);
      }
    }
  }

  // Track custom performance metrics
  private trackCustomMetrics() {
    // Track time to interactive
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      const tti = timing.domInteractive - timing.navigationStart;
      this.addCustomMetric('tti', tti);
    }

    // Track resource loading
    this.trackResourcePerformance();
  }

  // Track resource loading performance
  private trackResourcePerformance() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            const loadTime = resourceEntry.responseEnd - resourceEntry.startTime;
            
            // Track slow resources
            if (loadTime > 1000) {
              console.warn(`[Performance] Slow resource: ${resourceEntry.name} (${loadTime}ms)`);
            }
          }
        }
      });

      observer.observe({ entryTypes: ['resource'] });
    }
  }

  // Add custom metric
  public addCustomMetric(name: string, value: number) {
    if (!this.metrics.custom) {
      this.metrics.custom = {};
    }
    this.metrics.custom[name] = value;
    this.notifyListeners();
  }

  // Get current metrics
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Subscribe to metric updates
  public subscribe(listener: (metrics: PerformanceMetrics) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.getMetrics()));
  }

  // Send metrics to analytics
  public sendToAnalytics(endpoint?: string) {
    const metrics = this.getMetrics();
    
    // Send to Vercel Analytics if available
    if (typeof window !== 'undefined' && (window as any).va) {
      (window as any).va('track', 'Web Vitals', metrics);
    }

    // Send to custom endpoint if provided
    if (endpoint) {
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: window.location.href,
          timestamp: new Date().toISOString(),
          metrics,
        }),
      }).catch(error => {
        console.error('[Performance] Failed to send metrics:', error);
      });
    }
  }

  // Performance optimization utilities
  public measureFunction<T extends (...args: any[]) => any>(
    fn: T,
    name: string
  ): T {
    return ((...args: Parameters<T>) => {
      const start = performance.now();
      const result = fn(...args);
      const duration = performance.now() - start;
      
      if (duration > 16) { // Log if takes more than one frame
        console.warn(`[Performance] ${name} took ${duration}ms`);
      }
      
      return result;
    }) as T;
  }

  // Check if page is performing well
  public isPerformingWell(): boolean {
    const metrics = this.getMetrics();
    
    return Object.entries(PERFORMANCE_THRESHOLDS).every(([key, threshold]) => {
      const value = metrics[key as keyof PerformanceMetrics] as number;
      return !value || value <= threshold.good;
    });
  }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for performance monitoring
export function usePerformanceMonitor() {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>({});
  
  React.useEffect(() => {
    return performanceMonitor.subscribe(setMetrics);
  }, []);
  
  return {
    metrics,
    isPerformingWell: performanceMonitor.isPerformingWell(),
    addCustomMetric: (name: string, value: number) => 
      performanceMonitor.addCustomMetric(name, value),
  };
}

// Performance budget checker
export function checkPerformanceBudget(budget: Partial<PerformanceMetrics>): boolean {
  const metrics = performanceMonitor.getMetrics();
  
  return Object.entries(budget).every(([key, maxValue]) => {
    const currentValue = metrics[key as keyof PerformanceMetrics];
    if (key === 'custom' || typeof currentValue !== 'number' || typeof maxValue !== 'number') {
      return true; // Skip non-numeric comparisons
    }
    return !currentValue || currentValue <= maxValue;
  });
}

// Export React for the hook
import * as React from 'react';