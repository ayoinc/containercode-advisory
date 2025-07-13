#!/usr/bin/env node
/**
 * Web Vitals Monitoring Script
 * Continuously monitors and reports Core Web Vitals performance metrics
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  baseUrl: process.env.MONITOR_URL || 'https://containercode-advisory.vercel.app',
  interval: 30000, // 30 seconds
  duration: 1800000, // 30 minutes
  outputFile: path.join(__dirname, '../performance-monitoring.json'),
  thresholds: {
    lcp: 2500,
    fcp: 1800,
    cls: 0.1,
    fid: 100,
    ttfb: 800
  }
};

// Metrics storage
const metrics = {
  startTime: Date.now(),
  measurements: [],
  summary: {},
  alerts: []
};

// Performance monitoring function
async function measurePerformance(url) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const req = https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const endTime = Date.now();
        const ttfb = endTime - startTime;
        
        // Parse response headers for additional metrics
        const measurement = {
          timestamp: Date.now(),
          url,
          ttfb,
          statusCode: res.statusCode,
          headers: res.headers,
          responseSize: Buffer.byteLength(data, 'utf8'),
          responseTime: endTime - startTime
        };
        
        resolve(measurement);
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Check performance against thresholds
function checkThresholds(measurement) {
  const alerts = [];
  
  if (measurement.ttfb > CONFIG.thresholds.ttfb) {
    alerts.push({
      type: 'TTFB_HIGH',
      value: measurement.ttfb,
      threshold: CONFIG.thresholds.ttfb,
      severity: measurement.ttfb > CONFIG.thresholds.ttfb * 2 ? 'critical' : 'warning'
    });
  }
  
  if (measurement.responseTime > 5000) {
    alerts.push({
      type: 'RESPONSE_TIME_HIGH',
      value: measurement.responseTime,
      threshold: 5000,
      severity: 'warning'
    });
  }
  
  return alerts;
}

// Generate performance report
function generateReport() {
  const measurements = metrics.measurements;
  
  if (measurements.length === 0) {
    return { error: 'No measurements available' };
  }
  
  // Calculate statistics
  const ttfbValues = measurements.map(m => m.ttfb);
  const responseTimeValues = measurements.map(m => m.responseTime);
  const responseSizeValues = measurements.map(m => m.responseSize);
  
  const stats = {
    ttfb: calculateStats(ttfbValues),
    responseTime: calculateStats(responseTimeValues),
    responseSize: calculateStats(responseSizeValues),
    statusCodes: countStatusCodes(measurements),
    errorRate: calculateErrorRate(measurements)
  };
  
  // Performance score
  const performanceScore = calculatePerformanceScore(stats);
  
  // Trends
  const trends = calculateTrends(measurements);
  
  return {
    summary: {
      totalMeasurements: measurements.length,
      duration: Date.now() - metrics.startTime,
      performanceScore,
      ...stats
    },
    trends,
    alerts: metrics.alerts,
    lastMeasurement: measurements[measurements.length - 1]
  };
}

function calculateStats(values) {
  if (values.length === 0) return null;
  
  const sorted = values.sort((a, b) => a - b);
  
  return {
    min: Math.min(...values),
    max: Math.max(...values),
    avg: values.reduce((sum, val) => sum + val, 0) / values.length,
    median: sorted[Math.floor(sorted.length / 2)],
    p95: sorted[Math.floor(sorted.length * 0.95)],
    p99: sorted[Math.floor(sorted.length * 0.99)]
  };
}

function countStatusCodes(measurements) {
  const counts = {};
  measurements.forEach(m => {
    counts[m.statusCode] = (counts[m.statusCode] || 0) + 1;
  });
  return counts;
}

function calculateErrorRate(measurements) {
  const errors = measurements.filter(m => m.statusCode >= 400).length;
  return measurements.length > 0 ? errors / measurements.length : 0;
}

function calculatePerformanceScore(stats) {
  if (!stats.ttfb || !stats.responseTime) return 0;
  
  // Score based on TTFB and response time
  let score = 100;
  
  if (stats.ttfb.avg > CONFIG.thresholds.ttfb) {
    score -= 20;
  }
  
  if (stats.responseTime.avg > 3000) {
    score -= 20;
  }
  
  if (stats.errorRate > 0.01) { // 1% error rate
    score -= 30;
  }
  
  return Math.max(0, score);
}

function calculateTrends(measurements) {
  if (measurements.length < 10) return null;
  
  const recent = measurements.slice(-10);
  const older = measurements.slice(-20, -10);
  
  if (older.length === 0) return null;
  
  const recentAvgTtfb = recent.reduce((sum, m) => sum + m.ttfb, 0) / recent.length;
  const olderAvgTtfb = older.reduce((sum, m) => sum + m.ttfb, 0) / older.length;
  
  const trend = recentAvgTtfb < olderAvgTtfb ? 'improving' : 
                recentAvgTtfb > olderAvgTtfb ? 'degrading' : 'stable';
  
  return {
    ttfb: {
      trend,
      change: ((recentAvgTtfb - olderAvgTtfb) / olderAvgTtfb * 100).toFixed(2) + '%'
    }
  };
}

// Save metrics to file
function saveMetrics() {
  const report = generateReport();
  
  fs.writeFileSync(CONFIG.outputFile, JSON.stringify({
    config: CONFIG,
    metrics,
    report,
    generatedAt: new Date().toISOString()
  }, null, 2));
  
  console.log(`📊 Metrics saved to ${CONFIG.outputFile}`);
}

// Main monitoring loop
async function startMonitoring() {
  console.log('🚀 Starting Web Vitals monitoring...');
  console.log(`📍 Target URL: ${CONFIG.baseUrl}`);
  console.log(`⏱️  Interval: ${CONFIG.interval / 1000}s`);
  console.log(`⏰ Duration: ${CONFIG.duration / 60000}m`);
  console.log('');
  
  const startTime = Date.now();
  
  const monitor = async () => {
    try {
      const measurement = await measurePerformance(CONFIG.baseUrl);
      metrics.measurements.push(measurement);
      
      // Check for alerts
      const alerts = checkThresholds(measurement);
      metrics.alerts.push(...alerts);
      
      // Log current measurement
      console.log(`[${new Date().toLocaleTimeString()}] TTFB: ${measurement.ttfb}ms | Status: ${measurement.statusCode} | Size: ${Math.round(measurement.responseSize / 1024)}KB`);
      
      // Log alerts
      if (alerts.length > 0) {
        alerts.forEach(alert => {
          console.log(`🚨 ALERT: ${alert.type} - ${alert.value} exceeds ${alert.threshold} (${alert.severity})`);
        });
      }
      
      // Save metrics periodically
      if (metrics.measurements.length % 10 === 0) {
        saveMetrics();
      }
      
    } catch (error) {
      console.error(`❌ Measurement failed: ${error.message}`);
      
      metrics.measurements.push({
        timestamp: Date.now(),
        url: CONFIG.baseUrl,
        error: error.message,
        ttfb: null,
        statusCode: null
      });
    }
  };
  
  // Initial measurement
  await monitor();
  
  // Set up interval
  const interval = setInterval(monitor, CONFIG.interval);
  
  // Stop after duration
  setTimeout(() => {
    clearInterval(interval);
    
    console.log('');
    console.log('✅ Monitoring completed!');
    
    // Generate final report
    const finalReport = generateReport();
    console.log('');
    console.log('📊 FINAL REPORT:');
    console.log(`Total measurements: ${finalReport.summary.totalMeasurements}`);
    console.log(`Average TTFB: ${Math.round(finalReport.summary.ttfb.avg)}ms`);
    console.log(`Performance Score: ${finalReport.summary.performanceScore}/100`);
    console.log(`Error Rate: ${(finalReport.summary.errorRate * 100).toFixed(2)}%`);
    
    if (finalReport.trends && finalReport.trends.ttfb) {
      console.log(`TTFB Trend: ${finalReport.trends.ttfb.trend} (${finalReport.trends.ttfb.change})`);
    }
    
    // Save final metrics
    saveMetrics();
    
    // Exit with appropriate code
    const hasErrors = finalReport.summary.errorRate > 0.05;
    const hasPoorPerformance = finalReport.summary.performanceScore < 70;
    
    if (hasErrors || hasPoorPerformance) {
      console.log('⚠️  Performance issues detected!');
      process.exit(1);
    } else {
      console.log('✨ Performance looks good!');
      process.exit(0);
    }
    
  }, CONFIG.duration);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Monitoring interrupted');
  saveMetrics();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Monitoring terminated');
  saveMetrics();
  process.exit(0);
});

// Start monitoring if called directly
if (require.main === module) {
  startMonitoring().catch(error => {
    console.error('💥 Monitoring failed:', error);
    process.exit(1);
  });
}

module.exports = { startMonitoring, generateReport, measurePerformance };
