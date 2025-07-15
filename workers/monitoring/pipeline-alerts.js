/**
 * Real-time Pipeline Monitoring and Alerting System
 * Implements comprehensive monitoring with intelligent alerting
 * Supports multiple alert channels and escalation policies
 */

import { JobState } from '../durable-objects/job-state.js';
import { PipelineOrchestrator } from '../durable-objects/pipeline-orchestrator.js';

export class PipelineAlerts {
  constructor(env) {
    this.env = env;
    this.alertChannels = new AlertChannels(env);
    this.escalationPolicies = new EscalationPolicies(env);
    this.alertHistory = new AlertHistory(env);
    this.metricsCollector = new MetricsCollector(env);
  }

  /**
   * Initialize monitoring system
   */
  async initialize() {
    await this.setupAlertThresholds();
    await this.setupHealthChecks();
    await this.startMonitoring();
  }

  /**
   * Setup alert thresholds for different pipeline components
   */
  async setupAlertThresholds() {
    this.thresholds = {
      // Job State Thresholds
      jobFailureRate: 0.1, // 10% failure rate
      jobTimeoutRate: 0.05, // 5% timeout rate
      avgJobDuration: 300000, // 5 minutes
      maxJobDuration: 600000, // 10 minutes
      
      // Queue Thresholds
      queueDepth: 1000, // Max queue depth
      queueProcessingRate: 10, // Min messages per minute
      deadLetterQueueDepth: 100, // Max dead letter messages
      
      // API Thresholds
      deepseekApiLatency: 180000, // 3 minutes
      deepseekApiErrorRate: 0.2, // 20% error rate
      braveSearchApiLatency: 10000, // 10 seconds
      braveSearchApiErrorRate: 0.1, // 10% error rate
      
      // Resource Thresholds
      cpuUsage: 80, // 80% CPU usage
      memoryUsage: 80, // 80% memory usage
      durableObjectRequestRate: 1000, // Requests per minute
      
      // Business Thresholds
      newsletterDeliveryRate: 0.95, // 95% delivery rate
      subscriberEngagementRate: 0.15, // 15% engagement rate
      contentGenerationRate: 0.8 // 80% successful content generation
    };
  }

  /**
   * Setup health checks for critical components
   */
  async setupHealthChecks() {
    this.healthChecks = {
      // Database connectivity
      database: async () => {
        try {
          await this.env.DB.prepare('SELECT 1').run();
          return { healthy: true, responseTime: Date.now() };
        } catch (error) {
          return { healthy: false, error: error.message };
        }
      },
      
      // Notion API connectivity
      notionApi: async () => {
        try {
          const startTime = Date.now();
          // Simple API call to test connectivity
          await fetch('https://api.notion.com/v1/users/me', {
            headers: { 'Authorization': `Bearer ${this.env.NOTION_TOKEN}` }
          });
          return { healthy: true, responseTime: Date.now() - startTime };
        } catch (error) {
          return { healthy: false, error: error.message };
        }
      },
      
      // DeepSeek API connectivity
      deepseekApi: async () => {
        try {
          const startTime = Date.now();
          const response = await fetch('https://api.deepseek.com/v1/models', {
            headers: { 'Authorization': `Bearer ${this.env.DEEPSEEK_API_KEY}` }
          });
          return { 
            healthy: response.ok, 
            responseTime: Date.now() - startTime,
            statusCode: response.status
          };
        } catch (error) {
          return { healthy: false, error: error.message };
        }
      },
      
      // BraveSearch API connectivity
      braveSearchApi: async () => {
        try {
          const startTime = Date.now();
          const response = await fetch('https://api.search.brave.com/res/v1/web/search?q=test', {
            headers: { 'X-Subscription-Token': this.env.BRAVE_API_KEY }
          });
          return { 
            healthy: response.ok, 
            responseTime: Date.now() - startTime,
            statusCode: response.status
          };
        } catch (error) {
          return { healthy: false, error: error.message };
        }
      },
      
      // Email service connectivity
      emailService: async () => {
        try {
          const startTime = Date.now();
          const response = await fetch('https://api.resend.com/domains', {
            headers: { 'Authorization': `Bearer ${this.env.RESEND_API_KEY}` }
          });
          return { 
            healthy: response.ok, 
            responseTime: Date.now() - startTime,
            statusCode: response.status
          };
        } catch (error) {
          return { healthy: false, error: error.message };
        }
      },
      
      // Durable Objects health
      durableObjects: async () => {
        try {
          const jobState = this.env.JOB_STATE.get(this.env.JOB_STATE.idFromName('health-check'));
          const testJob = await jobState.createJob('health-check', 'system', {});
          await jobState.updateStatus('completed', { message: 'Health check completed' });
          return { healthy: true, jobId: testJob.id };
        } catch (error) {
          return { healthy: false, error: error.message };
        }
      }
    };
  }

  /**
   * Start monitoring pipeline components
   */
  async startMonitoring() {
    // Monitor job states
    this.monitorJobs();
    
    // Monitor queue depths
    this.monitorQueues();
    
    // Monitor API performance
    this.monitorAPIs();
    
    // Monitor resource usage
    this.monitorResources();
    
    // Monitor business metrics
    this.monitorBusinessMetrics();
    
    // Run periodic health checks
    this.runHealthChecks();
  }

  /**
   * Monitor job states and performance
   */
  async monitorJobs() {
    const jobMetrics = await this.metricsCollector.collectJobMetrics();
    
    // Check job failure rate
    if (jobMetrics.failureRate > this.thresholds.jobFailureRate) {
      await this.triggerAlert('job_failure_rate', {
        severity: 'high',
        message: `Job failure rate (${(jobMetrics.failureRate * 100).toFixed(1)}%) exceeds threshold (${(this.thresholds.jobFailureRate * 100).toFixed(1)}%)`,
        metrics: jobMetrics,
        timestamp: new Date().toISOString()
      });
    }
    
    // Check job timeout rate
    if (jobMetrics.timeoutRate > this.thresholds.jobTimeoutRate) {
      await this.triggerAlert('job_timeout_rate', {
        severity: 'medium',
        message: `Job timeout rate (${(jobMetrics.timeoutRate * 100).toFixed(1)}%) exceeds threshold (${(this.thresholds.jobTimeoutRate * 100).toFixed(1)}%)`,
        metrics: jobMetrics,
        timestamp: new Date().toISOString()
      });
    }
    
    // Check average job duration
    if (jobMetrics.avgDuration > this.thresholds.avgJobDuration) {
      await this.triggerAlert('job_duration_high', {
        severity: 'medium',
        message: `Average job duration (${(jobMetrics.avgDuration / 1000).toFixed(1)}s) exceeds threshold (${(this.thresholds.avgJobDuration / 1000).toFixed(1)}s)`,
        metrics: jobMetrics,
        timestamp: new Date().toISOString()
      });
    }
    
    // Check for stuck jobs
    const stuckJobs = await this.identifyStuckJobs();
    if (stuckJobs.length > 0) {
      await this.triggerAlert('stuck_jobs', {
        severity: 'high',
        message: `Found ${stuckJobs.length} stuck jobs that may need intervention`,
        stuckJobs: stuckJobs,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Monitor queue depths and processing rates
   */
  async monitorQueues() {
    const queueMetrics = await this.metricsCollector.collectQueueMetrics();
    
    // Check queue depths
    Object.entries(queueMetrics.depths).forEach(async ([queueName, depth]) => {
      if (depth > this.thresholds.queueDepth) {
        await this.triggerAlert('queue_depth_high', {
          severity: 'medium',
          message: `Queue '${queueName}' depth (${depth}) exceeds threshold (${this.thresholds.queueDepth})`,
          queueName,
          depth,
          timestamp: new Date().toISOString()
        });
      }
    });
    
    // Check dead letter queue
    if (queueMetrics.deadLetterDepth > this.thresholds.deadLetterQueueDepth) {
      await this.triggerAlert('dead_letter_queue_high', {
        severity: 'high',
        message: `Dead letter queue depth (${queueMetrics.deadLetterDepth}) exceeds threshold (${this.thresholds.deadLetterQueueDepth})`,
        depth: queueMetrics.deadLetterDepth,
        timestamp: new Date().toISOString()
      });
    }
    
    // Check processing rates
    Object.entries(queueMetrics.processingRates).forEach(async ([queueName, rate]) => {
      if (rate < this.thresholds.queueProcessingRate) {
        await this.triggerAlert('queue_processing_slow', {
          severity: 'medium',
          message: `Queue '${queueName}' processing rate (${rate}/min) below threshold (${this.thresholds.queueProcessingRate}/min)`,
          queueName,
          rate,
          timestamp: new Date().toISOString()
        });
      }
    });
  }

  /**
   * Monitor external API performance
   */
  async monitorAPIs() {
    const apiMetrics = await this.metricsCollector.collectApiMetrics();
    
    // Monitor DeepSeek API
    const deepseekMetrics = apiMetrics.deepseek;
    if (deepseekMetrics.avgLatency > this.thresholds.deepseekApiLatency) {
      await this.triggerAlert('deepseek_api_latency_high', {
        severity: 'medium',
        message: `DeepSeek API latency (${(deepseekMetrics.avgLatency / 1000).toFixed(1)}s) exceeds threshold (${(this.thresholds.deepseekApiLatency / 1000).toFixed(1)}s)`,
        metrics: deepseekMetrics,
        timestamp: new Date().toISOString()
      });
    }
    
    if (deepseekMetrics.errorRate > this.thresholds.deepseekApiErrorRate) {
      await this.triggerAlert('deepseek_api_error_rate_high', {
        severity: 'high',
        message: `DeepSeek API error rate (${(deepseekMetrics.errorRate * 100).toFixed(1)}%) exceeds threshold (${(this.thresholds.deepseekApiErrorRate * 100).toFixed(1)}%)`,
        metrics: deepseekMetrics,
        timestamp: new Date().toISOString()
      });
    }
    
    // Monitor BraveSearch API
    const braveSearchMetrics = apiMetrics.braveSearch;
    if (braveSearchMetrics.avgLatency > this.thresholds.braveSearchApiLatency) {
      await this.triggerAlert('brave_search_api_latency_high', {
        severity: 'medium',
        message: `BraveSearch API latency (${(braveSearchMetrics.avgLatency / 1000).toFixed(1)}s) exceeds threshold (${(this.thresholds.braveSearchApiLatency / 1000).toFixed(1)}s)`,
        metrics: braveSearchMetrics,
        timestamp: new Date().toISOString()
      });
    }
    
    if (braveSearchMetrics.errorRate > this.thresholds.braveSearchApiErrorRate) {
      await this.triggerAlert('brave_search_api_error_rate_high', {
        severity: 'high',
        message: `BraveSearch API error rate (${(braveSearchMetrics.errorRate * 100).toFixed(1)}%) exceeds threshold (${(this.thresholds.braveSearchApiErrorRate * 100).toFixed(1)}%)`,
        metrics: braveSearchMetrics,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Monitor resource usage
   */
  async monitorResources() {
    const resourceMetrics = await this.metricsCollector.collectResourceMetrics();
    
    // Check CPU usage
    if (resourceMetrics.cpuUsage > this.thresholds.cpuUsage) {
      await this.triggerAlert('cpu_usage_high', {
        severity: 'medium',
        message: `CPU usage (${resourceMetrics.cpuUsage.toFixed(1)}%) exceeds threshold (${this.thresholds.cpuUsage}%)`,
        metrics: resourceMetrics,
        timestamp: new Date().toISOString()
      });
    }
    
    // Check memory usage
    if (resourceMetrics.memoryUsage > this.thresholds.memoryUsage) {
      await this.triggerAlert('memory_usage_high', {
        severity: 'medium',
        message: `Memory usage (${resourceMetrics.memoryUsage.toFixed(1)}%) exceeds threshold (${this.thresholds.memoryUsage}%)`,
        metrics: resourceMetrics,
        timestamp: new Date().toISOString()
      });
    }
    
    // Check Durable Object request rate
    if (resourceMetrics.durableObjectRequestRate > this.thresholds.durableObjectRequestRate) {
      await this.triggerAlert('durable_object_request_rate_high', {
        severity: 'medium',
        message: `Durable Object request rate (${resourceMetrics.durableObjectRequestRate}/min) exceeds threshold (${this.thresholds.durableObjectRequestRate}/min)`,
        metrics: resourceMetrics,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Monitor business metrics
   */
  async monitorBusinessMetrics() {
    const businessMetrics = await this.metricsCollector.collectBusinessMetrics();
    
    // Check newsletter delivery rate
    if (businessMetrics.newsletterDeliveryRate < this.thresholds.newsletterDeliveryRate) {
      await this.triggerAlert('newsletter_delivery_rate_low', {
        severity: 'high',
        message: `Newsletter delivery rate (${(businessMetrics.newsletterDeliveryRate * 100).toFixed(1)}%) below threshold (${(this.thresholds.newsletterDeliveryRate * 100).toFixed(1)}%)`,
        metrics: businessMetrics,
        timestamp: new Date().toISOString()
      });
    }
    
    // Check subscriber engagement rate
    if (businessMetrics.subscriberEngagementRate < this.thresholds.subscriberEngagementRate) {
      await this.triggerAlert('subscriber_engagement_rate_low', {
        severity: 'medium',
        message: `Subscriber engagement rate (${(businessMetrics.subscriberEngagementRate * 100).toFixed(1)}%) below threshold (${(this.thresholds.subscriberEngagementRate * 100).toFixed(1)}%)`,
        metrics: businessMetrics,
        timestamp: new Date().toISOString()
      });
    }
    
    // Check content generation rate
    if (businessMetrics.contentGenerationRate < this.thresholds.contentGenerationRate) {
      await this.triggerAlert('content_generation_rate_low', {
        severity: 'medium',
        message: `Content generation rate (${(businessMetrics.contentGenerationRate * 100).toFixed(1)}%) below threshold (${(this.thresholds.contentGenerationRate * 100).toFixed(1)}%)`,
        metrics: businessMetrics,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Run periodic health checks
   */
  async runHealthChecks() {
    const healthResults = {};
    
    for (const [checkName, checkFunction] of Object.entries(this.healthChecks)) {
      try {
        const result = await checkFunction();
        healthResults[checkName] = result;
        
        if (!result.healthy) {
          await this.triggerAlert('health_check_failed', {
            severity: 'high',
            message: `Health check '${checkName}' failed: ${result.error}`,
            checkName,
            error: result.error,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        healthResults[checkName] = { healthy: false, error: error.message };
        await this.triggerAlert('health_check_error', {
          severity: 'high',
          message: `Health check '${checkName}' threw error: ${error.message}`,
          checkName,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    // Store health check results
    await this.storeHealthCheckResults(healthResults);
  }

  /**
   * Identify stuck jobs that may need intervention
   */
  async identifyStuckJobs() {
    const stuckJobs = [];
    const cutoffTime = Date.now() - (30 * 60 * 1000); // 30 minutes ago
    
    // This would typically query job states from Durable Objects
    // For now, return placeholder data
    return stuckJobs;
  }

  /**
   * Trigger alert with escalation
   */
  async triggerAlert(alertType, alertData) {
    // Check if alert is already active to avoid spam
    const isAlreadyActive = await this.alertHistory.isAlertActive(alertType, alertData);
    if (isAlreadyActive) {
      return;
    }
    
    // Create alert record
    const alert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: alertType,
      severity: alertData.severity,
      message: alertData.message,
      data: alertData,
      status: 'active',
      createdAt: new Date().toISOString(),
      acknowledgedAt: null,
      resolvedAt: null
    };
    
    // Store alert
    await this.alertHistory.storeAlert(alert);
    
    // Send notifications based on severity
    await this.sendAlertNotifications(alert);
    
    // Apply escalation policy
    await this.escalationPolicies.applyEscalation(alert);
    
    // Log alert
    console.error(`ALERT [${alert.severity.toUpperCase()}]: ${alert.message}`, alert.data);
  }

  /**
   * Send alert notifications to configured channels
   */
  async sendAlertNotifications(alert) {
    // Send to appropriate channels based on severity
    const channels = this.getNotificationChannels(alert.severity);
    
    for (const channel of channels) {
      try {
        await this.alertChannels.sendNotification(channel, alert);
      } catch (error) {
        console.error(`Failed to send alert to ${channel}:`, error);
      }
    }
  }

  /**
   * Get notification channels based on severity
   */
  getNotificationChannels(severity) {
    const channelConfig = {
      low: ['email'],
      medium: ['email', 'slack'],
      high: ['email', 'slack', 'sms'],
      critical: ['email', 'slack', 'sms', 'pager']
    };
    
    return channelConfig[severity] || ['email'];
  }

  /**
   * Store health check results
   */
  async storeHealthCheckResults(results) {
    try {
      await this.env.DB.prepare(
        'INSERT INTO health_checks (timestamp, results) VALUES (?, ?)'
      ).bind(
        new Date().toISOString(),
        JSON.stringify(results)
      ).run();
    } catch (error) {
      console.error('Failed to store health check results:', error);
    }
  }

  /**
   * Get alert dashboard data
   */
  async getDashboardData() {
    const activeAlerts = await this.alertHistory.getActiveAlerts();
    const recentAlerts = await this.alertHistory.getRecentAlerts(24); // Last 24 hours
    const healthStatus = await this.getOverallHealthStatus();
    const metrics = await this.metricsCollector.getCurrentMetrics();
    
    return {
      activeAlerts,
      recentAlerts,
      healthStatus,
      metrics,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Get overall health status
   */
  async getOverallHealthStatus() {
    const healthChecks = await this.runHealthChecks();
    const activeAlerts = await this.alertHistory.getActiveAlerts();
    
    const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'critical').length;
    const highAlerts = activeAlerts.filter(alert => alert.severity === 'high').length;
    
    if (criticalAlerts > 0) {
      return 'critical';
    } else if (highAlerts > 0) {
      return 'degraded';
    } else if (activeAlerts.length > 0) {
      return 'warning';
    } else {
      return 'healthy';
    }
  }
}

/**
 * Alert notification channels
 */
class AlertChannels {
  constructor(env) {
    this.env = env;
  }

  async sendNotification(channel, alert) {
    switch (channel) {
      case 'email':
        return await this.sendEmailAlert(alert);
      case 'slack':
        return await this.sendSlackAlert(alert);
      case 'sms':
        return await this.sendSmsAlert(alert);
      case 'webhook':
        return await this.sendWebhookAlert(alert);
      default:
        console.warn(`Unknown alert channel: ${channel}`);
    }
  }

  async sendEmailAlert(alert) {
    const emailContent = {
      to: this.env.ADMIN_EMAIL,
      subject: `[${alert.severity.toUpperCase()}] Pipeline Alert: ${alert.type}`,
      html: `
        <h2>Pipeline Alert</h2>
        <p><strong>Type:</strong> ${alert.type}</p>
        <p><strong>Severity:</strong> ${alert.severity}</p>
        <p><strong>Message:</strong> ${alert.message}</p>
        <p><strong>Time:</strong> ${alert.createdAt}</p>
        <p><strong>Alert ID:</strong> ${alert.id}</p>
        <hr>
        <h3>Alert Data:</h3>
        <pre>${JSON.stringify(alert.data, null, 2)}</pre>
      `
    };
    
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailContent)
    });
  }

  async sendSlackAlert(alert) {
    if (!this.env.SLACK_WEBHOOK_URL) {
      console.warn('Slack webhook URL not configured');
      return;
    }
    
    const slackMessage = {
      text: `🚨 Pipeline Alert: ${alert.type}`,
      attachments: [
        {
          color: this.getSeverityColor(alert.severity),
          fields: [
            { title: 'Severity', value: alert.severity, short: true },
            { title: 'Type', value: alert.type, short: true },
            { title: 'Message', value: alert.message, short: false },
            { title: 'Time', value: alert.createdAt, short: true },
            { title: 'Alert ID', value: alert.id, short: true }
          ]
        }
      ]
    };
    
    await fetch(this.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackMessage)
    });
  }

  async sendSmsAlert(alert) {
    // Implementation would depend on SMS provider (Twilio, etc.)
    console.log(`SMS Alert: ${alert.message}`);
  }

  async sendWebhookAlert(alert) {
    if (!this.env.WEBHOOK_URL) {
      console.warn('Webhook URL not configured');
      return;
    }
    
    await fetch(this.env.WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'pipeline_alert',
        alert: alert
      })
    });
  }

  getSeverityColor(severity) {
    const colors = {
      low: '#36a64f',
      medium: '#ffb347',
      high: '#ff6b6b',
      critical: '#ff0000'
    };
    return colors[severity] || '#808080';
  }
}

/**
 * Escalation policies for alerts
 */
class EscalationPolicies {
  constructor(env) {
    this.env = env;
    this.policies = this.setupPolicies();
  }

  setupPolicies() {
    return {
      high: {
        escalationTimes: [0, 15, 30, 60], // minutes
        channels: ['email', 'slack', 'sms', 'pager']
      },
      medium: {
        escalationTimes: [0, 30, 60], // minutes
        channels: ['email', 'slack', 'sms']
      },
      low: {
        escalationTimes: [0, 60], // minutes
        channels: ['email', 'slack']
      }
    };
  }

  async applyEscalation(alert) {
    const policy = this.policies[alert.severity];
    if (!policy) return;
    
    // Schedule escalation notifications
    policy.escalationTimes.forEach((delayMinutes, index) => {
      if (index === 0) return; // First notification already sent
      
      setTimeout(async () => {
        const isStillActive = await this.isAlertStillActive(alert.id);
        if (isStillActive) {
          const channel = policy.channels[index] || policy.channels[policy.channels.length - 1];
          await this.sendEscalationNotification(alert, channel, index);
        }
      }, delayMinutes * 60 * 1000);
    });
  }

  async isAlertStillActive(alertId) {
    // Check if alert is still active in the alert history
    return true; // Placeholder
  }

  async sendEscalationNotification(alert, channel, escalationLevel) {
    const escalatedAlert = {
      ...alert,
      message: `[ESCALATION ${escalationLevel}] ${alert.message}`,
      escalationLevel
    };
    
    const alertChannels = new AlertChannels(this.env);
    await alertChannels.sendNotification(channel, escalatedAlert);
  }
}

/**
 * Alert history management
 */
class AlertHistory {
  constructor(env) {
    this.env = env;
  }

  async storeAlert(alert) {
    try {
      await this.env.DB.prepare(
        'INSERT INTO alerts (id, type, severity, message, data, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).bind(
        alert.id,
        alert.type,
        alert.severity,
        alert.message,
        JSON.stringify(alert.data),
        alert.status,
        alert.createdAt
      ).run();
    } catch (error) {
      console.error('Failed to store alert:', error);
    }
  }

  async isAlertActive(alertType, alertData) {
    try {
      const result = await this.env.DB.prepare(
        'SELECT COUNT(*) as count FROM alerts WHERE type = ? AND status = "active" AND created_at > ?'
      ).bind(
        alertType,
        new Date(Date.now() - 10 * 60 * 1000).toISOString() // Last 10 minutes
      ).first();
      
      return result?.count > 0;
    } catch (error) {
      console.error('Failed to check alert status:', error);
      return false;
    }
  }

  async getActiveAlerts() {
    try {
      const result = await this.env.DB.prepare(
        'SELECT * FROM alerts WHERE status = "active" ORDER BY created_at DESC'
      ).all();
      
      return result.results || [];
    } catch (error) {
      console.error('Failed to get active alerts:', error);
      return [];
    }
  }

  async getRecentAlerts(hours) {
    try {
      const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
      const result = await this.env.DB.prepare(
        'SELECT * FROM alerts WHERE created_at > ? ORDER BY created_at DESC LIMIT 100'
      ).bind(cutoffTime).all();
      
      return result.results || [];
    } catch (error) {
      console.error('Failed to get recent alerts:', error);
      return [];
    }
  }
}

/**
 * Metrics collector for monitoring
 */
class MetricsCollector {
  constructor(env) {
    this.env = env;
  }

  async collectJobMetrics() {
    // This would typically query job states from Durable Objects
    // For now, return placeholder metrics
    return {
      totalJobs: 1000,
      completedJobs: 850,
      failedJobs: 100,
      timeoutJobs: 50,
      failureRate: 0.1,
      timeoutRate: 0.05,
      avgDuration: 120000 // 2 minutes
    };
  }

  async collectQueueMetrics() {
    // This would query queue depths from Cloudflare APIs
    return {
      depths: {
        'article-processing': 50,
        'newsletter-generation': 20,
        'email-distribution': 100,
        'image-processing': 30
      },
      processingRates: {
        'article-processing': 15,
        'newsletter-generation': 8,
        'email-distribution': 25,
        'image-processing': 12
      },
      deadLetterDepth: 5
    };
  }

  async collectApiMetrics() {
    // This would collect API metrics from circuit breakers and rate limiters
    return {
      deepseek: {
        totalRequests: 500,
        successfulRequests: 400,
        failedRequests: 100,
        avgLatency: 45000,
        errorRate: 0.2
      },
      braveSearch: {
        totalRequests: 200,
        successfulRequests: 180,
        failedRequests: 20,
        avgLatency: 2000,
        errorRate: 0.1
      }
    };
  }

  async collectResourceMetrics() {
    // This would collect resource usage metrics
    return {
      cpuUsage: 65,
      memoryUsage: 70,
      durableObjectRequestRate: 500
    };
  }

  async collectBusinessMetrics() {
    // This would collect business-related metrics
    return {
      newsletterDeliveryRate: 0.96,
      subscriberEngagementRate: 0.18,
      contentGenerationRate: 0.85
    };
  }

  async getCurrentMetrics() {
    const [jobMetrics, queueMetrics, apiMetrics, resourceMetrics, businessMetrics] = await Promise.all([
      this.collectJobMetrics(),
      this.collectQueueMetrics(),
      this.collectApiMetrics(),
      this.collectResourceMetrics(),
      this.collectBusinessMetrics()
    ]);
    
    return {
      jobs: jobMetrics,
      queues: queueMetrics,
      apis: apiMetrics,
      resources: resourceMetrics,
      business: businessMetrics,
      timestamp: new Date().toISOString()
    };
  }
}

export default PipelineAlerts;
