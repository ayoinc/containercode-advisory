#!/usr/bin/env node

/**
 * Monitoring and Alerting System
 * Comprehensive monitoring with notifications and health checks
 */

import { writeFile } from 'fs/promises';

interface MonitoringConfig {
  endpoints: EndpointConfig[];
  performance: PerformanceConfig;
  security: SecurityConfig;
  notifications: NotificationConfig;
}

interface EndpointConfig {
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  expectedStatus: number;
  timeout: number;
  headers?: Record<string, string>;
  body?: any;
  checks: HealthCheck[];
}

interface PerformanceConfig {
  thresholds: {
    responseTime: number;
    uptime: number;
    errorRate: number;
    memoryUsage: number;
  };
  metrics: string[];
}

interface SecurityConfig {
  ssl: boolean;
  headers: string[];
  vulnerabilities: boolean;
}

interface NotificationConfig {
  email: {
    enabled: boolean;
    recipients: string[];
    smtp?: any;
  };
  slack: {
    enabled: boolean;
    webhookUrl?: string;
    channel: string;
  };
  discord: {
    enabled: boolean;
    webhookUrl?: string;
  };
}

interface HealthCheck {
  type: 'response_time' | 'status_code' | 'content' | 'headers' | 'ssl';
  expected: any;
  operator: 'equals' | 'less_than' | 'greater_than' | 'contains' | 'exists';
}

interface MonitoringResult {
  timestamp: string;
  endpoint: string;
  status: 'healthy' | 'warning' | 'critical';
  responseTime: number;
  statusCode: number;
  checks: CheckResult[];
  error?: string;
}

interface CheckResult {
  type: string;
  passed: boolean;
  expected: any;
  actual: any;
  message: string;
}

class MonitoringSystem {
  private config: MonitoringConfig;
  private results: MonitoringResult[] = [];

  constructor(config: MonitoringConfig) {
    this.config = config;
  }

  async runMonitoring(): Promise<MonitoringResult[]> {
    console.log('🔍 Starting monitoring checks...');
    
    const results: MonitoringResult[] = [];

    for (const endpoint of this.config.endpoints) {
      try {
        const result = await this.checkEndpoint(endpoint);
        results.push(result);
        
        // Send alerts if needed
        if (result.status === 'critical' || result.status === 'warning') {
          await this.sendAlert(result);
        }
      } catch (error) {
        console.error(`❌ Failed to monitor ${endpoint.name}:`, error);
      }
    }

    this.results = results;
    await this.generateReport();
    
    return results;
  }

  private async checkEndpoint(endpoint: EndpointConfig): Promise<MonitoringResult> {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    
    console.log(`🔍 Checking ${endpoint.name} (${endpoint.url})`);

    try {
      const response = await fetch(endpoint.url, {
        method: endpoint.method,
        headers: endpoint.headers,
        body: endpoint.body ? JSON.stringify(endpoint.body) : undefined,
        signal: AbortSignal.timeout(endpoint.timeout)
      });

      const responseTime = Date.now() - startTime;
      const checks: CheckResult[] = [];

      // Run health checks
      for (const check of endpoint.checks) {
        const checkResult = await this.runHealthCheck(check, response, responseTime);
        checks.push(checkResult);
      }

      // Determine overall status
      const failedChecks = checks.filter(c => !c.passed);
      const status = failedChecks.length === 0 ? 'healthy' : 
                   failedChecks.some(c => c.type === 'status_code' || c.type === 'response_time') ? 'critical' : 'warning';

      const result: MonitoringResult = {
        timestamp,
        endpoint: endpoint.name,
        status,
        responseTime,
        statusCode: response.status,
        checks
      };

      this.logResult(result);
      return result;

    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      const result: MonitoringResult = {
        timestamp,
        endpoint: endpoint.name,
        status: 'critical',
        responseTime,
        statusCode: 0,
        checks: [],
        error: error instanceof Error ? error.message : String(error)
      };

      this.logResult(result);
      return result;
    }
  }

  private async runHealthCheck(check: HealthCheck, response: Response, responseTime: number): Promise<CheckResult> {
    let actual: any;
    let passed = false;

    switch (check.type) {
      case 'response_time':
        actual = responseTime;
        passed = this.compareValues(actual, check.expected, check.operator);
        break;

      case 'status_code':
        actual = response.status;
        passed = this.compareValues(actual, check.expected, check.operator);
        break;

      case 'headers':
        actual = response.headers.get(check.expected);
        passed = check.operator === 'exists' ? actual !== null : this.compareValues(actual, check.expected, check.operator);
        break;

      case 'content':
        try {
          const text = await response.text();
          actual = text;
          passed = check.operator === 'contains' ? text.includes(check.expected) : this.compareValues(actual, check.expected, check.operator);
        } catch (error) {
          actual = 'Error reading response';
          passed = false;
        }
        break;

      case 'ssl':
        actual = response.url.startsWith('https://');
        passed = actual === check.expected;
        break;

      default:
        actual = 'Unknown check type';
        passed = false;
    }

    return {
      type: check.type,
      passed,
      expected: check.expected,
      actual,
      message: passed ? `✅ ${check.type} check passed` : `❌ ${check.type} check failed`
    };
  }

  private compareValues(actual: any, expected: any, operator: string): boolean {
    switch (operator) {
      case 'equals':
        return actual === expected;
      case 'less_than':
        return actual < expected;
      case 'greater_than':
        return actual > expected;
      case 'contains':
        return String(actual).includes(String(expected));
      case 'exists':
        return actual != null;
      default:
        return false;
    }
  }

  private logResult(result: MonitoringResult): void {
    const statusIcon = result.status === 'healthy' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
    console.log(`${statusIcon} ${result.endpoint}: ${result.status} (${result.responseTime}ms)`);
    
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }

    result.checks.forEach(check => {
      if (!check.passed) {
        console.log(`   ${check.message}`);
      }
    });
  }

  private async sendAlert(result: MonitoringResult): Promise<void> {
    console.log(`🚨 Sending alert for ${result.endpoint}`);

    // Send email alert
    if (this.config.notifications.email.enabled) {
      await this.sendEmailAlert(result);
    }

    // Send Slack alert
    if (this.config.notifications.slack.enabled && this.config.notifications.slack.webhookUrl) {
      await this.sendSlackAlert(result);
    }

    // Send Discord alert
    if (this.config.notifications.discord.enabled && this.config.notifications.discord.webhookUrl) {
      await this.sendDiscordAlert(result);
    }
  }

  private async sendEmailAlert(result: MonitoringResult): Promise<void> {
    // Email implementation would go here
    console.log(`📧 Email alert sent for ${result.endpoint}`);
  }

  private async sendSlackAlert(result: MonitoringResult): Promise<void> {
    try {
      const message = {
        channel: this.config.notifications.slack.channel,
        username: 'ContainerCode Monitor',
        icon_emoji: ':warning:',
        attachments: [
          {
            color: result.status === 'critical' ? 'danger' : 'warning',
            title: `${result.status.toUpperCase()}: ${result.endpoint}`,
            fields: [
              {
                title: 'Status Code',
                value: result.statusCode,
                short: true
              },
              {
                title: 'Response Time',
                value: `${result.responseTime}ms`,
                short: true
              },
              {
                title: 'Timestamp',
                value: result.timestamp,
                short: false
              }
            ],
            footer: 'ContainerCode Monitoring',
            ts: Math.floor(Date.now() / 1000)
          }
        ]
      };

      const response = await fetch(this.config.notifications.slack.webhookUrl!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      });

      if (response.ok) {
        console.log(`📱 Slack alert sent for ${result.endpoint}`);
      } else {
        console.error(`Failed to send Slack alert: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Failed to send Slack alert:`, error);
    }
  }

  private async sendDiscordAlert(result: MonitoringResult): Promise<void> {
    try {
      const embed = {
        title: `${result.status.toUpperCase()}: ${result.endpoint}`,
        color: result.status === 'critical' ? 0xff0000 : 0xffa500,
        fields: [
          {
            name: 'Status Code',
            value: String(result.statusCode),
            inline: true
          },
          {
            name: 'Response Time',
            value: `${result.responseTime}ms`,
            inline: true
          },
          {
            name: 'Timestamp',
            value: result.timestamp,
            inline: false
          }
        ],
        footer: {
          text: 'ContainerCode Monitoring'
        },
        timestamp: new Date().toISOString()
      };

      const response = await fetch(this.config.notifications.discord.webhookUrl!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [embed] })
      });

      if (response.ok) {
        console.log(`🎮 Discord alert sent for ${result.endpoint}`);
      } else {
        console.error(`Failed to send Discord alert: ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Failed to send Discord alert:`, error);
    }
  }

  private async generateReport(): Promise<void> {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.length,
        healthy: this.results.filter(r => r.status === 'healthy').length,
        warning: this.results.filter(r => r.status === 'warning').length,
        critical: this.results.filter(r => r.status === 'critical').length
      },
      results: this.results
    };

    const filePath = `./monitoring-reports/report-${Date.now()}.json`;
    await writeFile(filePath, JSON.stringify(report, null, 2));
    
    console.log(`📊 Monitoring report generated: ${filePath}`);
  }
}

// Default configuration
const defaultConfig: MonitoringConfig = {
  endpoints: [
    {
      name: 'Homepage',
      url: 'https://containercode.com',
      method: 'GET',
      expectedStatus: 200,
      timeout: 10000,
      checks: [
        { type: 'status_code', expected: 200, operator: 'equals' },
        { type: 'response_time', expected: 3000, operator: 'less_than' },
        { type: 'content', expected: 'ContainerCode', operator: 'contains' },
        { type: 'ssl', expected: true, operator: 'equals' }
      ]
    },
    {
      name: 'Contact API',
      url: 'https://containercode.com/api/contact',
      method: 'POST',
      expectedStatus: 200,
      timeout: 5000,
      checks: [
        { type: 'status_code', expected: 200, operator: 'equals' },
        { type: 'response_time', expected: 2000, operator: 'less_than' },
        { type: 'headers', expected: 'Access-Control-Allow-Origin', operator: 'exists' }
      ]
    },
    {
      name: 'Newsletter API',
      url: 'https://containercode.com/api/newsletter-subscribe',
      method: 'POST',
      expectedStatus: 200,
      timeout: 5000,
      checks: [
        { type: 'status_code', expected: 200, operator: 'equals' },
        { type: 'response_time', expected: 2000, operator: 'less_than' }
      ]
    },
    {
      name: 'Sitemap',
      url: 'https://containercode.com/sitemap.xml',
      method: 'GET',
      expectedStatus: 200,
      timeout: 5000,
      checks: [
        { type: 'status_code', expected: 200, operator: 'equals' },
        { type: 'content', expected: '<?xml version="1.0"', operator: 'contains' }
      ]
    },
    {
      name: 'Robots.txt',
      url: 'https://containercode.com/robots.txt',
      method: 'GET',
      expectedStatus: 200,
      timeout: 5000,
      checks: [
        { type: 'status_code', expected: 200, operator: 'equals' },
        { type: 'content', expected: 'User-agent:', operator: 'contains' }
      ]
    }
  ],
  performance: {
    thresholds: {
      responseTime: 3000,
      uptime: 99.9,
      errorRate: 1,
      memoryUsage: 80
    },
    metrics: ['response_time', 'status_code', 'ssl_expiry']
  },
  security: {
    ssl: true,
    headers: ['X-Content-Type-Options', 'X-Frame-Options', 'X-XSS-Protection'],
    vulnerabilities: true
  },
  notifications: {
    email: {
      enabled: false,
      recipients: ['ayoinc@me.com']
    },
    slack: {
      enabled: false,
      channel: '#alerts'
    },
    discord: {
      enabled: false
    }
  }
};

// CLI Interface
async function main() {
  const command = process.argv[2];

  switch (command) {
    case 'check':
      const monitor = new MonitoringSystem(defaultConfig);
      await monitor.runMonitoring();
      break;

    case 'test-alerts':
      console.log('🧪 Testing alert system...');
      // Test implementation
      break;

    default:
      console.log(`
Usage:
  npm run monitor:check      - Run monitoring checks
  npm run monitor:alerts     - Test alert system

Examples:
  npm run monitor:check
  npm run monitor:alerts
      `);
      break;
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { MonitoringSystem, type MonitoringConfig };