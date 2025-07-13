/**
 * Enhanced Performance Monitoring with Real-time Alerts
 * Advanced Core Web Vitals tracking with predictive analytics
 */

import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';

// Enhanced metric types
export interface EnhancedPerformanceMetrics {
  // Core Web Vitals
  cls?: number;
  fcp?: number;
  fid?: number;
  inp?: number; // Interaction to Next Paint (new metric)
  lcp?: number;
  ttfb?: number;
  
  // Custom metrics
  tti?: number; // Time to Interactive
  tbt?: number; // Total Blocking Time
  fmp?: number; // First Meaningful Paint
  si?: number;  // Speed Index
  
  // Resource metrics
  resourceLoadTime?: number;
  cacheHitRatio?: number;
  apiLatency?: number;
  
  // User experience metrics
  userInteractions?: number;
  errorRate?: number;
  bounceRate?: number;
  
  // Technical metrics
  bundleSize?: number;
  memoryUsage?: number;
  cpuUsage?: number;
  networkLatency?: number;
}

// Performance thresholds with new metrics
export const ENHANCED_THRESHOLDS = {
  cls: { good: 0.1, needsImprovement: 0.25, poor: Infinity },
  fcp: { good: 1800, needsImprovement: 3000, poor: Infinity },
  fid: { good: 100, needsImprovement: 300, poor: Infinity },
  inp: { good: 200, needsImprovement: 500, poor: Infinity },
  lcp: { good: 2500, needsImprovement: 4000, poor: Infinity },
  ttfb: { good: 800, needsImprovement: 1800, poor: Infinity },
  tti: { good: 3800, needsImprovement: 7300, poor: Infinity },
  tbt: { good: 200, needsImprovement: 600, poor: Infinity },
  si: { good: 3400, needsImprovement: 5800, poor: Infinity },
};

// Alert severity levels
export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

// Performance alert interface
export interface PerformanceAlert {
  metric: string;
  value: number;
  threshold: number;
  severity: AlertSeverity;
  timestamp: number;
  context?: Record<string, any>;
  recommendation?: string;
}

// Performance trend analysis
interface TrendData {
  metric: string;
  values: number[];
  timestamps: number[];
  trend: 'improving' | 'degrading' | 'stable';
  confidence: number;
}

// Real-time monitoring class
export class EnhancedPerformanceMonitor {
  private metrics: EnhancedPerformanceMetrics = {};
  private alerts: PerformanceAlert[] = [];
  private trendData: Map<string, TrendData> = new Map();
  private listeners: Array<(data: any) => void> = [];
  private alertCallbacks: Array<(alert: PerformanceAlert) => void> = [];
  
  // Performance budget
  private budget: Partial<EnhancedPerformanceMetrics> = {
    lcp: 2500,
    fcp: 1800,
    cls: 0.1,
    ttfb: 800,
    bundleSize: 1024 * 1024, // 1MB
  };

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeMonitoring();
      this.startContinuousMonitoring();
    }
  }

  private initializeMonitoring(): void {
    // Core Web Vitals with enhanced tracking
    onCLS((metric) => this.handleMetric('cls', metric.value, metric));
    onFCP((metric) => this.handleMetric('fcp', metric.value, metric));
    onINP((metric: any) => this.handleMetric('inp', metric.value, metric));
    onINP((metric) => this.handleMetric('inp', metric.value, metric));
    onLCP((metric) => this.handleMetric('lcp', metric.value, metric));
    onTTFB((metric) => this.handleMetric('ttfb', metric.value, metric));

    // Custom metrics
    this.trackTimeToInteractive();
    this.trackTotalBlockingTime();
    this.trackResourceMetrics();
    this.trackMemoryUsage();
    this.trackUserInteractions();
    this.trackApiLatency();
    this.trackBundleSize();
  }

  private handleMetric(
    name: keyof EnhancedPerformanceMetrics, 
    value: number, 
    context?: any
  ): void {
    this.metrics[name] = value;
    
    // Update trend data
    this.updateTrendData(name, value);
    
    // Check for alerts
    this.checkForAlerts(name, value, context);
    
    // Notify listeners
    this.notifyListeners();
    
    // Send to analytics in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(name, value, context);
    }
  }

  private updateTrendData(metric: string, value: number): void {
    const trend = this.trendData.get(metric) || {
      metric,
      values: [],
      timestamps: [],
      trend: 'stable' as const,
      confidence: 0
    };

    trend.values.push(value);
    trend.timestamps.push(Date.now());

    // Keep only last 20 values for trend analysis
    if (trend.values.length > 20) {
      trend.values = trend.values.slice(-20);
      trend.timestamps = trend.timestamps.slice(-20);
    }

    // Calculate trend
    if (trend.values.length >= 5) {
      const { trendDirection, confidence } = this.calculateTrend(trend.values);
      trend.trend = trendDirection;
      trend.confidence = confidence;
    }

    this.trendData.set(metric, trend);
  }

  private calculateTrend(values: number[]): { 
    trendDirection: 'improving' | 'degrading' | 'stable', 
    confidence: number 
  } {
    const n = values.length;
    const sumX = values.reduce((sum, _, i) => sum + i, 0);
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, i) => sum + i * val, 0);
    const sumXX = values.reduce((sum, _, i) => sum + i * i, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const correlation = this.calculateCorrelation(values);

    const confidence = Math.abs(correlation);
    
    if (Math.abs(slope) < 0.1 || confidence < 0.3) {
      return { trendDirection: 'stable', confidence };
    }
    
    // For metrics like LCP, FCP (lower is better)
    const lowerIsBetter = ['lcp', 'fcp', 'fid', 'inp', 'ttfb', 'tbt'].includes(values[0].toString());
    const isImproving = lowerIsBetter ? slope < 0 : slope > 0;
    
    return {
      trendDirection: isImproving ? 'improving' : 'degrading',
      confidence
    };
  }

  private calculateCorrelation(values: number[]): number {
    const n = values.length;
    const indices = Array.from({ length: n }, (_, i) => i);
    
    const meanX = indices.reduce((sum, val) => sum + val, 0) / n;
    const meanY = values.reduce((sum, val) => sum + val, 0) / n;
    
    const numerator = indices.reduce((sum, x, i) => 
      sum + (x - meanX) * (values[i] - meanY), 0);
    
    const denomX = Math.sqrt(indices.reduce((sum, x) => 
      sum + Math.pow(x - meanX, 2), 0));
    
    const denomY = Math.sqrt(values.reduce((sum, y) => 
      sum + Math.pow(y - meanY, 2), 0));
    
    return numerator / (denomX * denomY) || 0;
  }

  private checkForAlerts(
    metric: string, 
    value: number, 
    context?: any
  ): void {
    const threshold = ENHANCED_THRESHOLDS[metric as keyof typeof ENHANCED_THRESHOLDS];
    if (!threshold) return;

    let severity: AlertSeverity;
    let thresholdValue: number;

    if (value <= threshold.good) return; // No alert needed

    if (value <= threshold.needsImprovement) {
      severity = AlertSeverity.WARNING;
      thresholdValue = threshold.good;
    } else {
      severity = AlertSeverity.ERROR;
      thresholdValue = threshold.needsImprovement;
    }

    const alert: PerformanceAlert = {
      metric,
      value,
      threshold: thresholdValue,
      severity,
      timestamp: Date.now(),
      context,
      recommendation: this.getRecommendation(metric, value)
    };

    this.alerts.push(alert);
    
    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }

    // Notify alert callbacks
    this.alertCallbacks.forEach(callback => callback(alert));

    console.warn(`[Performance Alert] ${metric}: ${value} exceeds threshold ${thresholdValue}`);
  }

  private getRecommendation(metric: string, value: number): string {
    const recommendations: Record<string, string> = {
      lcp: 'Optimize largest contentful paint by reducing image sizes, using CDN, or improving server response time',
      fcp: 'Reduce first contentful paint by optimizing critical rendering path and removing render-blocking resources',
      cls: 'Improve cumulative layout shift by setting dimensions for images and avoiding dynamic content insertion',
      fid: 'Reduce first input delay by minimizing JavaScript execution time and using code splitting',
      inp: 'Optimize interaction to next paint by reducing JavaScript main thread blocking',
      ttfb: 'Improve time to first byte by optimizing server response time and using edge caching',
      bundleSize: 'Reduce bundle size by implementing code splitting and tree shaking',
      memoryUsage: 'Optimize memory usage by fixing memory leaks and reducing object creation',
    };

    return recommendations[metric] || 'Review metric documentation for optimization strategies';
  }

  // Custom metric tracking methods
  private trackTimeToInteractive(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            const tti = navEntry.domInteractive - (navEntry.activationStart || 0);
            this.handleMetric('tti', tti);
          }
        }
      });

      observer.observe({ entryTypes: ['navigation'] });
    }
  }

  private trackTotalBlockingTime(): void {
    if ('PerformanceObserver' in window) {
      let totalBlockingTime = 0;

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            totalBlockingTime += entry.duration - 50;
          }
        }
        this.handleMetric('tbt', totalBlockingTime);
      });

      observer.observe({ entryTypes: ['longtask'] });
    }
  }

  private trackResourceMetrics(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        let totalLoadTime = 0;
        let resourceCount = 0;
        let cacheHits = 0;

        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            totalLoadTime += resourceEntry.responseEnd - resourceEntry.startTime;
            resourceCount++;

            // Check if served from cache
            if (resourceEntry.transferSize === 0) {
              cacheHits++;
            }
          }
        }

        if (resourceCount > 0) {
          this.handleMetric('resourceLoadTime', totalLoadTime / resourceCount);
          this.handleMetric('cacheHitRatio', cacheHits / resourceCount);
        }
      });

      observer.observe({ entryTypes: ['resource'] });
    }
  }

  private trackMemoryUsage(): void {
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      const memoryUsage = memInfo.usedJSHeapSize / memInfo.totalJSHeapSize;
      this.handleMetric('memoryUsage', memoryUsage);

      // Check memory periodically
      setInterval(() => {
        const currentUsage = memInfo.usedJSHeapSize / memInfo.totalJSHeapSize;
        this.handleMetric('memoryUsage', currentUsage);
      }, 30000); // Every 30 seconds
    }
  }

  private trackUserInteractions(): void {
    let interactionCount = 0;
    let errorCount = 0;

    // Track clicks, touches, and key presses
    ['click', 'touchstart', 'keydown'].forEach(event => {
      document.addEventListener(event, () => {
        interactionCount++;
      });
    });

    // Track errors
    window.addEventListener('error', () => {
      errorCount++;
    });

    // Report interaction metrics every minute
    setInterval(() => {
      this.handleMetric('userInteractions', interactionCount);
      this.handleMetric('errorRate', errorCount / Math.max(1, interactionCount));
      interactionCount = 0;
      errorCount = 0;
    }, 60000);
  }

  private trackApiLatency(): void {
    // Wrap fetch to track API calls
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const start = performance.now();
      try {
        const response = await originalFetch.apply(window, args);
        const latency = performance.now() - start;
        
        if (args[0]?.toString().includes('/api/')) {
          this.handleMetric('apiLatency', latency);
        }
        
        return response;
      } catch (error) {
        const latency = performance.now() - start;
        this.handleMetric('apiLatency', latency);
        throw error;
      }
    };
  }

  private trackBundleSize(): void {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        let totalSize = 0;

        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            if (resourceEntry.name.includes('/_next/static/')) {
              totalSize += resourceEntry.transferSize || 0;
            }
          }
        }

        if (totalSize > 0) {
          this.handleMetric('bundleSize', totalSize);
        }
      });

      observer.observe({ entryTypes: ['resource'] });
    }
  }

  private startContinuousMonitoring(): void {
    // Monitor performance budget every 30 seconds
    setInterval(() => {
      this.checkPerformanceBudget();
    }, 30000);

    // Generate performance report every 5 minutes
    setInterval(() => {
      this.generatePerformanceReport();
    }, 300000);
  }

  private checkPerformanceBudget(): void {
    const violations: Array<{ metric: string; actual: number; budget: number }> = [];

    Object.entries(this.budget).forEach(([metric, budgetValue]) => {
      const actualValue = this.metrics[metric as keyof EnhancedPerformanceMetrics];
      if (actualValue && actualValue > budgetValue) {
        violations.push({
          metric,
          actual: actualValue,
          budget: budgetValue
        });
      }
    });

    if (violations.length > 0) {
      console.warn('[Performance Budget] Violations detected:', violations);
    }
  }

  private generatePerformanceReport(): void {
    const report = {
      timestamp: new Date().toISOString(),
      metrics: this.metrics,
      trends: Object.fromEntries(this.trendData),
      recentAlerts: this.alerts.slice(-10),
      recommendations: this.generateRecommendations()
    };

    // Store report or send to analytics
    if (process.env.NODE_ENV === 'development') {
      console.log('[Performance Report]', report);
    }
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    
    // Analyze current metrics and trends
    Object.entries(this.metrics).forEach(([metric, value]) => {
      const trend = this.trendData.get(metric);
      if (trend && trend.trend === 'degrading' && trend.confidence > 0.5) {
        recommendations.push(`${metric} is degrading - consider optimization`);
      }
    });

    return recommendations;
  }

  private sendToAnalytics(metric: string, value: number, context?: any): void {
    // Send to Vercel Analytics
    if (typeof window !== 'undefined' && (window as any).va) {
      (window as any).va('track', 'Performance Metric', {
        metric,
        value,
        context
      });
    }

    // Send to custom endpoint
    fetch('/api/analytics/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metric,
        value,
        context,
        timestamp: Date.now(),
        url: window.location.href
      })
    }).catch(() => {}); // Silent fail
  }

  private notifyListeners(): void {
    const data = {
      metrics: this.metrics,
      trends: Object.fromEntries(this.trendData),
      alerts: this.alerts.slice(-5)
    };
    
    this.listeners.forEach(listener => listener(data));
  }

  // Public API
  public getMetrics(): EnhancedPerformanceMetrics {
    return { ...this.metrics };
  }

  public getTrends(): Record<string, TrendData> {
    return Object.fromEntries(this.trendData);
  }

  public getAlerts(): PerformanceAlert[] {
    return [...this.alerts];
  }

  public subscribe(listener: (data: any) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public onAlert(callback: (alert: PerformanceAlert) => void): () => void {
    this.alertCallbacks.push(callback);
    return () => {
      this.alertCallbacks = this.alertCallbacks.filter(c => c !== callback);
    };
  }

  public setBudget(budget: Partial<EnhancedPerformanceMetrics>): void {
    this.budget = { ...this.budget, ...budget };
  }

  public getBudget(): Partial<EnhancedPerformanceMetrics> {
    return { ...this.budget };
  }

  public getPerformanceScore(): number {
    const scores = {
      lcp: this.calculateMetricScore('lcp', this.metrics.lcp),
      fcp: this.calculateMetricScore('fcp', this.metrics.fcp),
      cls: this.calculateMetricScore('cls', this.metrics.cls),
      fid: this.calculateMetricScore('fid', this.metrics.fid),
      ttfb: this.calculateMetricScore('ttfb', this.metrics.ttfb)
    };

    const validScores = Object.values(scores).filter(score => score !== null);
    return validScores.length > 0 
      ? validScores.reduce((sum, score) => sum + score!, 0) / validScores.length 
      : 0;
  }

  private calculateMetricScore(
    metric: string, 
    value?: number
  ): number | null {
    if (!value) return null;

    const threshold = ENHANCED_THRESHOLDS[metric as keyof typeof ENHANCED_THRESHOLDS];
    if (!threshold) return null;

    if (value <= threshold.good) return 100;
    if (value <= threshold.needsImprovement) {
      return 50 + (50 * (threshold.needsImprovement - value) / (threshold.needsImprovement - threshold.good));
    }
    
    return Math.max(0, 50 - (value - threshold.needsImprovement) / 100);
  }
}

// Export singleton instance
export const enhancedPerformanceMonitor = new EnhancedPerformanceMonitor();

// React hook for enhanced performance monitoring
export function useEnhancedPerformanceMonitor() {
  const [data, setData] = React.useState<any>({});
  const [alerts, setAlerts] = React.useState<PerformanceAlert[]>([]);

  React.useEffect(() => {
    const unsubscribeData = enhancedPerformanceMonitor.subscribe(setData);
    const unsubscribeAlerts = enhancedPerformanceMonitor.onAlert((alert) => {
      setAlerts(current => [...current, alert].slice(-10));
    });

    return () => {
      unsubscribeData();
      unsubscribeAlerts();
    };
  }, []);

  return {
    metrics: data.metrics || {},
    trends: data.trends || {},
    alerts,
    performanceScore: enhancedPerformanceMonitor.getPerformanceScore(),
    setBudget: (budget: Partial<EnhancedPerformanceMetrics>) => 
      enhancedPerformanceMonitor.setBudget(budget),
  };
}

// Export React for the hook
import * as React from 'react';
