'use client';

/**
 * Performance Provider
 * Initializes performance monitoring and provides context
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { performanceMonitor, PerformanceMetrics } from '@/lib/monitoring/performance';

interface PerformanceContextValue {
  metrics: PerformanceMetrics;
  isPerformingWell: boolean;
  addCustomMetric: (name: string, value: number) => void;
}

const PerformanceContext = createContext<PerformanceContextValue | undefined>(undefined);

export function PerformanceProvider({ children }: { children: React.ReactNode }) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isPerformingWell, setIsPerformingWell] = useState(true);

  useEffect(() => {
    // Subscribe to performance updates
    const unsubscribe = performanceMonitor.subscribe((newMetrics) => {
      setMetrics(newMetrics);
      setIsPerformingWell(performanceMonitor.isPerformingWell());
    });

    // Send metrics to analytics in production
    if (process.env.NODE_ENV === 'production') {
      const interval = setInterval(() => {
        performanceMonitor.sendToAnalytics();
      }, 30000); // Every 30 seconds

      return () => {
        clearInterval(interval);
        unsubscribe();
      };
    }

    return unsubscribe;
  }, []);

  // Log performance warnings in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !isPerformingWell) {
      console.warn('[Performance] Page is not performing well:', metrics);
    }
  }, [isPerformingWell, metrics]);

  const value: PerformanceContextValue = {
    metrics,
    isPerformingWell,
    addCustomMetric: (name: string, value: number) => {
      performanceMonitor.addCustomMetric(name, value);
    },
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
}

// Hook to use performance context
export function usePerformance() {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within PerformanceProvider');
  }
  return context;
}

// Performance observer component
export function PerformanceObserver({ 
  children,
  name,
}: { 
  children: React.ReactNode;
  name: string;
}) {
  const { addCustomMetric } = usePerformance();
  const startTime = React.useRef(Date.now());

  useEffect(() => {
    const mountTime = Date.now() - startTime.current;
    addCustomMetric(`${name}_mount`, mountTime);
    
    return () => {
      const unmountTime = Date.now() - startTime.current;
      addCustomMetric(`${name}_lifetime`, unmountTime);
    };
  }, [name, addCustomMetric]);

  return <>{children}</>;
}