/**
 * Performance Analytics API
 * Real-time performance data collection and analysis endpoint
 */

import { NextRequest, NextResponse } from 'next/server';


// Analytics data structures
interface PerformanceDataPoint {
  timestamp: number;
  metric: string;
  value: number;
  context?: Record<string, any>;
  sessionId: string;
  userId?: string;
  page: string;
  userAgent: string;
  country?: string;
  device: 'mobile' | 'tablet' | 'desktop';
  connection?: string;
}

interface AggregatedMetrics {
  metric: string;
  count: number;
  min: number;
  max: number;
  avg: number;
  p50: number;
  p75: number;
  p90: number;
  p95: number;
  p99: number;
}

interface PerformanceReport {
  timeRange: {
    start: number;
    end: number;
  };
  totalSessions: number;
  uniqueUsers: number;
  pageViews: number;
  metrics: AggregatedMetrics[];
  trends: {
    metric: string;
    trend: 'improving' | 'degrading' | 'stable';
    change: number;
  }[];
  alerts: any[];
  recommendations: string[];
}

// In-memory storage (in production, use database)
const performanceData: PerformanceDataPoint[] = [];
const sessionsCache = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.metric || typeof data.value !== 'number') {
      return NextResponse.json(
        { error: 'Invalid data: metric and value are required' },
        { status: 400 }
      );
    }

    // Extract client information
    const userAgent = request.headers.get('user-agent') || '';
    const country = request.geo?.country || 'unknown';
    const clientIP = request.ip || 'unknown';
    
    // Device detection
    const device = detectDevice(userAgent);
    
    // Connection type detection
    const connection = request.headers.get('downlink') || 
                      request.headers.get('save-data') === 'on' ? 'slow' : 'unknown';

    // Create data point
    const dataPoint: PerformanceDataPoint = {
      timestamp: Date.now(),
      metric: data.metric,
      value: data.value,
      context: data.context || {},
      sessionId: data.sessionId || generateSessionId(),
      userId: data.userId,
      page: data.page || data.url || 'unknown',
      userAgent,
      country,
      device,
      connection: connection !== 'unknown' ? connection : undefined,
    };

    // Store data point
    performanceData.push(dataPoint);
    
    // Update session cache
    updateSessionCache(dataPoint);
    
    // Keep data buffer manageable (last 10,000 entries)
    if (performanceData.length > 10000) {
      performanceData.splice(0, 1000);
    }

    // Check for performance issues
    const alerts = checkPerformanceAlerts(dataPoint);
    
    // Trigger real-time monitoring
    if (alerts.length > 0) {
      await triggerAlerts(alerts);
    }

    return NextResponse.json({
      success: true,
      dataPoint: {
        id: `${dataPoint.timestamp}-${dataPoint.sessionId}`,
        timestamp: dataPoint.timestamp,
        metric: dataPoint.metric,
        value: dataPoint.value,
      },
      alerts: alerts.length,
    });

  } catch (error) {
    console.error('Performance analytics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '1h';
    const metric = searchParams.get('metric');
    const format = searchParams.get('format') || 'json';
    
    // Calculate time range
    const endTime = Date.now();
    const startTime = endTime - parseTimeRange(timeRange);
    
    // Filter data
    let filteredData = performanceData.filter(d => 
      d.timestamp >= startTime && d.timestamp <= endTime
    );
    
    if (metric) {
      filteredData = filteredData.filter(d => d.metric === metric);
    }

    if (format === 'report') {
      const report = generatePerformanceReport(filteredData, startTime, endTime);
      return NextResponse.json(report);
    }

    if (format === 'aggregated') {
      const aggregated = aggregateMetrics(filteredData);
      return NextResponse.json({
        timeRange: { start: startTime, end: endTime },
        metrics: aggregated,
        totalDataPoints: filteredData.length,
      });
    }

    // Raw data format
    return NextResponse.json({
      timeRange: { start: startTime, end: endTime },
      data: filteredData.slice(-1000), // Last 1000 data points
      totalDataPoints: filteredData.length,
    });

  } catch (error) {
    console.error('Performance analytics GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Utility functions
function detectDevice(userAgent: string): 'mobile' | 'tablet' | 'desktop' {
  if (/mobile/i.test(userAgent) && !/tablet|ipad/i.test(userAgent)) {
    return 'mobile';
  }
  if (/tablet|ipad/i.test(userAgent)) {
    return 'tablet';
  }
  return 'desktop';
}

function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function parseTimeRange(timeRange: string): number {
  const unit = timeRange.slice(-1);
  const value = parseInt(timeRange.slice(0, -1));
  
  switch (unit) {
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: return 60 * 60 * 1000; // 1 hour default
  }
}

function updateSessionCache(dataPoint: PerformanceDataPoint): void {
  const session = sessionsCache.get(dataPoint.sessionId) || {
    id: dataPoint.sessionId,
    startTime: dataPoint.timestamp,
    lastActivity: dataPoint.timestamp,
    pageViews: new Set<string>(),
    metrics: {},
    device: dataPoint.device,
    country: dataPoint.country,
  };

  session.lastActivity = dataPoint.timestamp;
  session.pageViews.add(dataPoint.page);
  
  if (!session.metrics[dataPoint.metric]) {
    session.metrics[dataPoint.metric] = [];
  }
  
  session.metrics[dataPoint.metric].push({
    value: dataPoint.value,
    timestamp: dataPoint.timestamp,
  });

  sessionsCache.set(dataPoint.sessionId, session);
  
  // Clean up old sessions (older than 1 hour)
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  sessionsCache.forEach((sessionData, sessionId) => {
    if (sessionData.lastActivity < oneHourAgo) {
      sessionsCache.delete(sessionId);
    }
  });
}

function checkPerformanceAlerts(dataPoint: PerformanceDataPoint): any[] {
  const alerts: any[] = [];
  
  // Define alert thresholds
  const thresholds = {
    lcp: { warning: 2500, critical: 4000 },
    fcp: { warning: 1800, critical: 3000 },
    cls: { warning: 0.1, critical: 0.25 },
    fid: { warning: 100, critical: 300 },
    ttfb: { warning: 800, critical: 1800 },
  };

  const threshold = thresholds[dataPoint.metric as keyof typeof thresholds];
  if (threshold) {
    if (dataPoint.value > threshold.critical) {
      alerts.push({
        type: 'critical',
        metric: dataPoint.metric,
        value: dataPoint.value,
        threshold: threshold.critical,
        message: `Critical performance issue: ${dataPoint.metric} = ${dataPoint.value}ms`,
      });
    } else if (dataPoint.value > threshold.warning) {
      alerts.push({
        type: 'warning',
        metric: dataPoint.metric,
        value: dataPoint.value,
        threshold: threshold.warning,
        message: `Performance warning: ${dataPoint.metric} = ${dataPoint.value}ms`,
      });
    }
  }

  return alerts;
}

async function triggerAlerts(alerts: any[]): Promise<void> {
  // In production, send to monitoring service
  for (const alert of alerts) {
    console.warn('[Performance Alert]', alert);
    
    // Could send to Slack, Discord, email, etc.
    // await sendToSlack(alert);
    // await sendEmail(alert);
  }
}

function aggregateMetrics(data: PerformanceDataPoint[]): AggregatedMetrics[] {
  const metricGroups = new Map<string, number[]>();
  
  // Group by metric
  data.forEach(point => {
    if (!metricGroups.has(point.metric)) {
      metricGroups.set(point.metric, []);
    }
    metricGroups.get(point.metric)!.push(point.value);
  });

  // Calculate aggregations
  const aggregated: AggregatedMetrics[] = [];
  
  metricGroups.forEach((values, metric) => {
    const sorted = values.sort((a, b) => a - b);
    const count = values.length;
    
    aggregated.push({
      metric,
      count,
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((sum, val) => sum + val, 0) / count,
      p50: percentile(sorted, 50),
      p75: percentile(sorted, 75),
      p90: percentile(sorted, 90),
      p95: percentile(sorted, 95),
      p99: percentile(sorted, 99),
    });
  });

  return aggregated;
}

function percentile(sortedArray: number[], p: number): number {
  const index = Math.ceil((p / 100) * sortedArray.length) - 1;
  return sortedArray[index] || 0;
}

function generatePerformanceReport(
  data: PerformanceDataPoint[], 
  startTime: number, 
  endTime: number
): PerformanceReport {
  const sessions = new Set(data.map(d => d.sessionId));
  const users = new Set(data.map(d => d.userId).filter(Boolean));
  const pages = new Set(data.map(d => d.page));
  
  const metrics = aggregateMetrics(data);
  
  // Calculate trends (simplified)
  const trends = metrics.map(metric => ({
    metric: metric.metric,
    trend: 'stable' as const, // Would calculate actual trend
    change: 0, // Percentage change from previous period
  }));

  // Generate recommendations
  const recommendations: string[] = [];
  
  metrics.forEach(metric => {
    if (metric.metric === 'lcp' && metric.p75 > 2500) {
      recommendations.push('Optimize Largest Contentful Paint by reducing image sizes and improving server response time');
    }
    if (metric.metric === 'cls' && metric.p75 > 0.1) {
      recommendations.push('Improve Cumulative Layout Shift by setting dimensions for images and avoiding dynamic content');
    }
    if (metric.metric === 'fcp' && metric.p75 > 1800) {
      recommendations.push('Reduce First Contentful Paint by optimizing critical rendering path');
    }
  });

  return {
    timeRange: { start: startTime, end: endTime },
    totalSessions: sessions.size,
    uniqueUsers: users.size,
    pageViews: pages.size,
    metrics,
    trends,
    alerts: [], // Would include recent alerts
    recommendations,
  };
}
