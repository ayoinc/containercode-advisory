/**
 * Core Web Vitals Monitoring
 * Advanced performance tracking and monitoring system
 */

import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  timestamp: number;
  url: string;
  userAgent: string;
  connectionType?: string;
}

export interface PerformanceReport {
  url: string;
  timestamp: number;
  metrics: PerformanceMetric[];
  navigation: PerformanceNavigationTiming | null;
  paint: PerformancePaintTiming[];
  resources: PerformanceResourceTiming[];
  memory?: any;
  deviceInfo: {
    deviceType: 'desktop' | 'tablet' | 'mobile';
    screenResolution: string;
    viewport: string;
    pixelRatio: number;
  };
  networkInfo?: {
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
  };
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: PerformanceObserver[] = [];
  private reportingEndpoint: string;

  constructor(reportingEndpoint: string = '/api/analytics/performance') {
    this.reportingEndpoint = reportingEndpoint;
    this.initializeWebVitals();
    this.initializePerformanceObservers();
    this.scheduleReporting();
  }

  // Initialize Core Web Vitals tracking
  private initializeWebVitals(): void {
    onCLS((metric) => this.handleWebVital('CLS', metric));
    onINP((metric: any) => this.handleWebVital('INP', metric));
    onFCP((metric) => this.handleWebVital('FCP', metric));
    onLCP((metric) => this.handleWebVital('LCP', metric));
    onTTFB((metric) => this.handleWebVital('TTFB', metric));
    onINP((metric) => this.handleWebVital('INP', metric));
  }

  // Handle Web Vital metrics
  private handleWebVital(name: string, metric: any): void {
    const performanceMetric: PerformanceMetric = {
      name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connectionType: this.getConnectionType()
    };

    this.metrics.push(performanceMetric);
    this.reportMetric(performanceMetric);
  }

  // Initialize Performance Observers
  private initializePerformanceObservers(): void {
    // Long Tasks Observer
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            this.handleLongTask(entry as PerformanceEntry);
          });
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        this.observers.push(longTaskObserver);
      } catch (error) {
        console.warn('Long task observer not supported');
      }

      // Layout Shift Observer
      try {
        const layoutShiftObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            this.handleLayoutShift(entry as any);
          });
        });
        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(layoutShiftObserver);
      } catch (error) {
        console.warn('Layout shift observer not supported');
      }

      // Largest Contentful Paint Observer
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            this.handleLCP(entry as any);
          });
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (error) {
        console.warn('LCP observer not supported');
      }

      // First Input Delay Observer
      try {
        const fidObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            this.handleFID(entry as any);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (error) {
        console.warn('FID observer not supported');
      }
    }
  }

  // Handle Long Tasks
  private handleLongTask(entry: PerformanceEntry): void {
    const metric: PerformanceMetric = {
      name: 'LONG_TASK',
      value: entry.duration,
      rating: entry.duration > 50 ? 'poor' : 'good',
      delta: 0,
      id: `long-task-${Date.now()}`,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connectionType: this.getConnectionType()
    };

    this.metrics.push(metric);
  }

  // Handle Layout Shifts
  private handleLayoutShift(entry: any): void {
    if (!entry.hadRecentInput) {
      const metric: PerformanceMetric = {
        name: 'LAYOUT_SHIFT',
        value: entry.value,
        rating: entry.value > 0.1 ? 'poor' : entry.value > 0.05 ? 'needs-improvement' : 'good',
        delta: 0,
        id: `layout-shift-${Date.now()}`,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
        connectionType: this.getConnectionType()
      };

      this.metrics.push(metric);
    }
  }

  // Handle LCP
  private handleLCP(entry: any): void {
    const metric: PerformanceMetric = {
      name: 'LCP_ELEMENT',
      value: entry.startTime,
      rating: entry.startTime > 4000 ? 'poor' : entry.startTime > 2500 ? 'needs-improvement' : 'good',
      delta: 0,
      id: `lcp-element-${Date.now()}`,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connectionType: this.getConnectionType()
    };

    this.metrics.push(metric);
  }

  // Handle FID
  private handleFID(entry: any): void {
    const metric: PerformanceMetric = {
      name: 'FID_INPUT',
      value: entry.processingStart - entry.startTime,
      rating: entry.processingStart - entry.startTime > 300 ? 'poor' : 
              entry.processingStart - entry.startTime > 100 ? 'needs-improvement' : 'good',
      delta: 0,
      id: `fid-input-${Date.now()}`,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connectionType: this.getConnectionType()
    };

    this.metrics.push(metric);
  }

  // Get connection type
  private getConnectionType(): string | undefined {
    // @ts-ignore - Connection API may not be available
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return connection?.effectiveType;
  }

  // Generate comprehensive performance report
  public generateReport(): PerformanceReport {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint') as PerformancePaintTiming[];
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

    return {
      url: window.location.href,
      timestamp: Date.now(),
      metrics: [...this.metrics],
      navigation,
      paint,
      resources: resources.slice(-50), // Last 50 resources to avoid huge payloads
      memory: (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
      } : undefined,
      deviceInfo: this.getDeviceInfo(),
      networkInfo: this.getNetworkInfo()
    };
  }

  // Get device information
  private getDeviceInfo() {
    const width = window.innerWidth;
    let deviceType: 'desktop' | 'tablet' | 'mobile' = 'desktop';
    
    if (width < 768) deviceType = 'mobile';
    else if (width < 1024) deviceType = 'tablet';

    return {
      deviceType,
      screenResolution: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      pixelRatio: window.devicePixelRatio || 1
    };
  }

  // Get network information
  private getNetworkInfo() {
    // @ts-ignore - Connection API may not be available
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    
    if (connection) {
      return {
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0,
        saveData: connection.saveData || false
      };
    }
    
    return undefined;
  }

  // Report individual metric
  private async reportMetric(metric: PerformanceMetric): Promise<void> {
    try {
      await fetch(this.reportingEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: 'metric', data: metric })
      });
    } catch (error) {
      console.warn('Failed to report performance metric:', error);
    }
  }

  // Report comprehensive performance data
  public async reportPerformance(): Promise<void> {
    try {
      const report = this.generateReport();
      
      await fetch(this.reportingEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: 'report', data: report })
      });

      // Clear metrics after reporting
      this.metrics = [];
    } catch (error) {
      console.warn('Failed to report performance data:', error);
    }
  }

  // Schedule periodic reporting
  private scheduleReporting(): void {
    // Report on page unload
    window.addEventListener('beforeunload', () => {
      this.reportPerformance();
    });

    // Report every 30 seconds for long sessions
    setInterval(() => {
      if (this.metrics.length > 0) {
        this.reportPerformance();
      }
    }, 30000);

    // Report on visibility change
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.metrics.length > 0) {
        this.reportPerformance();
      }
    });
  }

  // Get current performance score
  public getPerformanceScore(): number {
    const webVitals = this.metrics.filter(m => 
      ['CLS', 'FID', 'FCP', 'LCP', 'TTFB', 'INP'].includes(m.name)
    );

    if (webVitals.length === 0) return 100;

    const scores = webVitals.map(metric => {
      switch (metric.rating) {
        case 'good': return 100;
        case 'needs-improvement': return 75;
        case 'poor': return 50;
        default: return 100;
      }
    });

    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }

  // Clean up observers
  public destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Create singleton instance
let performanceMonitor: PerformanceMonitor | null = null;

export function getPerformanceMonitor(): PerformanceMonitor {
  if (!performanceMonitor) {
    performanceMonitor = new PerformanceMonitor();
  }
  return performanceMonitor;
}

// Convenience functions
export function trackPerformance(): void {
  getPerformanceMonitor();
}

export function reportPerformance(): Promise<void> {
  return getPerformanceMonitor().reportPerformance();
}

export function getPerformanceScore(): number {
  return getPerformanceMonitor().getPerformanceScore();
}

export function generatePerformanceReport(): PerformanceReport {
  return getPerformanceMonitor().generateReport();
}

// React hook for performance monitoring
export function usePerformanceMonitoring() {
  const monitor = getPerformanceMonitor();
  
  return {
    reportPerformance: () => monitor.reportPerformance(),
    getPerformanceScore: () => monitor.getPerformanceScore(),
    generateReport: () => monitor.generateReport()
  };
}