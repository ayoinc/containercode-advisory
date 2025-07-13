/**
 * Comprehensive Security Monitoring System
 * Real-time security event detection and response
 */

export interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  source: string;
  description: string;
  metadata: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  userId?: string;
  sessionId?: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

export type SecurityEventType = 
  | 'failed_login'
  | 'brute_force_attempt'
  | 'suspicious_activity'
  | 'data_breach_attempt'
  | 'injection_attempt'
  | 'xss_attempt'
  | 'csrf_attempt'
  | 'rate_limit_exceeded'
  | 'unauthorized_access'
  | 'privilege_escalation'
  | 'data_exfiltration'
  | 'malware_detection'
  | 'ddos_attempt'
  | 'bot_activity'
  | 'geo_anomaly'
  | 'time_anomaly'
  | 'api_abuse'
  | 'form_spam'
  | 'content_injection'
  | 'file_upload_threat';

export interface SecurityRule {
  id: string;
  name: string;
  description: string;
  eventType: SecurityEventType;
  enabled: boolean;
  conditions: SecurityCondition[];
  actions: SecurityAction[];
  cooldownPeriod: number; // milliseconds
  lastTriggered?: string;
}

export interface SecurityCondition {
  field: string;
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'regex' | 'in_list';
  value: any;
  caseSensitive?: boolean;
}

export interface SecurityAction {
  type: 'block' | 'rate_limit' | 'alert' | 'log' | 'redirect' | 'challenge';
  parameters: Record<string, any>;
}

export interface ThreatIntelligence {
  ipBlacklist: string[];
  userAgentBlacklist: string[];
  suspiciousPatterns: RegExp[];
  knownBotSignatures: string[];
  maliciousDomains: string[];
  geoRestrictions: {
    blockedCountries: string[];
    allowedCountries: string[];
  };
}

export interface SecurityMetrics {
  totalEvents: number;
  eventsByType: Record<SecurityEventType, number>;
  eventsBySeverity: Record<'low' | 'medium' | 'high' | 'critical', number>;
  topSourceIPs: Array<{ ip: string; count: number }>;
  resolvedEvents: number;
  activeThreats: number;
  averageResponseTime: number;
  falsePositiveRate: number;
}

class SecurityMonitor {
  private events: SecurityEvent[] = [];
  private rules: SecurityRule[] = [];
  private threatIntel: ThreatIntelligence;
  private rateLimits = new Map<string, { count: number; resetTime: number }>();

  constructor() {
    this.threatIntel = this.initializeThreatIntelligence();
    this.initializeSecurityRules();
    this.startPeriodicCleanup();
  }

  // Initialize threat intelligence data
  private initializeThreatIntelligence(): ThreatIntelligence {
    return {
      ipBlacklist: [
        // Known malicious IPs would be loaded from external sources
      ],
      userAgentBlacklist: [
        'sqlmap',
        'nikto',
        'masscan',
        'nmap',
        'zgrab',
        'python-requests/2.6.0',
        'Go-http-client',
        'curl/7.58.0'
      ],
      suspiciousPatterns: [
        /(\b(union|select|insert|delete|update|drop|create|alter|exec|script)\b)/i,
        /<script[^>]*>.*?<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /\b(eval|alert|confirm|prompt)\s*\(/gi,
        /\.\.(\/|\\)/g, // Path traversal
        /\b(cmd|powershell|bash|sh)\b/gi
      ],
      knownBotSignatures: [
        'Googlebot',
        'Bingbot',
        'Slurp',
        'DuckDuckBot',
        'Baiduspider',
        'YandexBot',
        'facebookexternalhit'
      ],
      maliciousDomains: [
        // Malicious domains would be loaded from threat feeds
      ],
      geoRestrictions: {
        blockedCountries: [], // Countries to block
        allowedCountries: [] // Only allow these countries (if specified)
      }
    };
  }

  // Initialize security rules
  private initializeSecurityRules(): void {
    this.rules = [
      {
        id: 'rate_limit_api',
        name: 'API Rate Limiting',
        description: 'Detect and prevent API abuse',
        eventType: 'rate_limit_exceeded',
        enabled: true,
        conditions: [
          { field: 'path', operator: 'contains', value: '/api/' },
          { field: 'requests_per_minute', operator: 'greater_than', value: 60 }
        ],
        actions: [
          { type: 'rate_limit', parameters: { duration: 300000 } }, // 5 minutes
          { type: 'alert', parameters: { severity: 'medium' } }
        ],
        cooldownPeriod: 60000
      },
      {
        id: 'sql_injection_attempt',
        name: 'SQL Injection Detection',
        description: 'Detect SQL injection attempts',
        eventType: 'injection_attempt',
        enabled: true,
        conditions: [
          { field: 'query_params', operator: 'regex', value: /(\b(union|select|insert|delete|update|drop)\b)/i },
          { field: 'form_data', operator: 'regex', value: /(\b(union|select|insert|delete|update|drop)\b)/i }
        ],
        actions: [
          { type: 'block', parameters: {} },
          { type: 'alert', parameters: { severity: 'high' } },
          { type: 'log', parameters: { details: 'full_request' } }
        ],
        cooldownPeriod: 0
      },
      {
        id: 'xss_attempt',
        name: 'XSS Attack Detection',
        description: 'Detect cross-site scripting attempts',
        eventType: 'xss_attempt',
        enabled: true,
        conditions: [
          { field: 'request_body', operator: 'regex', value: /<script[^>]*>.*?<\/script>/gi },
          { field: 'query_params', operator: 'regex', value: /javascript:/gi }
        ],
        actions: [
          { type: 'block', parameters: {} },
          { type: 'alert', parameters: { severity: 'high' } }
        ],
        cooldownPeriod: 0
      },
      {
        id: 'brute_force_detection',
        name: 'Brute Force Detection',
        description: 'Detect brute force login attempts',
        eventType: 'brute_force_attempt',
        enabled: true,
        conditions: [
          { field: 'failed_logins', operator: 'greater_than', value: 5 },
          { field: 'time_window', operator: 'less_than', value: 300000 } // 5 minutes
        ],
        actions: [
          { type: 'block', parameters: { duration: 3600000 } }, // 1 hour
          { type: 'alert', parameters: { severity: 'high' } }
        ],
        cooldownPeriod: 300000
      },
      {
        id: 'bot_detection',
        name: 'Malicious Bot Detection',
        description: 'Detect malicious bot activity',
        eventType: 'bot_activity',
        enabled: true,
        conditions: [
          { field: 'user_agent', operator: 'in_list', value: this.threatIntel.userAgentBlacklist },
          { field: 'requests_per_second', operator: 'greater_than', value: 10 }
        ],
        actions: [
          { type: 'challenge', parameters: { type: 'captcha' } },
          { type: 'alert', parameters: { severity: 'medium' } }
        ],
        cooldownPeriod: 60000
      },
      {
        id: 'form_spam_detection',
        name: 'Form Spam Detection',
        description: 'Detect spam submissions',
        eventType: 'form_spam',
        enabled: true,
        conditions: [
          { field: 'form_submissions', operator: 'greater_than', value: 3 },
          { field: 'time_window', operator: 'less_than', value: 60000 }, // 1 minute
          { field: 'content_similarity', operator: 'greater_than', value: 0.8 }
        ],
        actions: [
          { type: 'rate_limit', parameters: { duration: 900000 } }, // 15 minutes
          { type: 'alert', parameters: { severity: 'medium' } }
        ],
        cooldownPeriod: 300000
      }
    ];
  }

  // Analyze incoming request for security threats
  public analyzeRequest(request: Request): SecurityEvent[] {
    const events: SecurityEvent[] = [];
    const url = new URL(request.url);
    const clientIP = this.getClientIP(request);
    const userAgent = request.headers.get('User-Agent') || '';

    // Check against threat intelligence
    if (this.threatIntel.ipBlacklist.includes(clientIP)) {
      events.push(this.createSecurityEvent({
        type: 'unauthorized_access',
        severity: 'high',
        source: clientIP,
        description: 'Request from blacklisted IP address',
        metadata: { ip: clientIP, reason: 'ip_blacklist' }
      }));
    }

    // Check user agent
    if (this.threatIntel.userAgentBlacklist.some(ua => userAgent.toLowerCase().includes(ua.toLowerCase()))) {
      events.push(this.createSecurityEvent({
        type: 'bot_activity',
        severity: 'medium',
        source: clientIP,
        description: 'Suspicious user agent detected',
        metadata: { userAgent, ip: clientIP }
      }));
    }

    // Check for suspicious patterns in URL
    const fullUrl = url.href;
    for (const pattern of this.threatIntel.suspiciousPatterns) {
      if (pattern.test(fullUrl)) {
        events.push(this.createSecurityEvent({
          type: 'injection_attempt',
          severity: 'high',
          source: clientIP,
          description: 'Suspicious pattern detected in URL',
          metadata: { url: fullUrl, pattern: pattern.toString(), ip: clientIP }
        }));
      }
    }

    // Rate limiting check
    const rateKey = `${clientIP}:${url.pathname}`;
    const rateLimitEvent = this.checkRateLimit(rateKey, clientIP);
    if (rateLimitEvent) {
      events.push(rateLimitEvent);
    }

    return events;
  }

  // Check rate limiting
  private checkRateLimit(key: string, clientIP: string): SecurityEvent | null {
    const now = Date.now();
    const windowSize = 60000; // 1 minute
    const limit = 60; // requests per minute

    const current = this.rateLimits.get(key) || { count: 0, resetTime: now + windowSize };

    if (now > current.resetTime) {
      // Reset window
      current.count = 1;
      current.resetTime = now + windowSize;
    } else {
      current.count++;
    }

    this.rateLimits.set(key, current);

    if (current.count > limit) {
      return this.createSecurityEvent({
        type: 'rate_limit_exceeded',
        severity: 'medium',
        source: clientIP,
        description: `Rate limit exceeded: ${current.count} requests in ${windowSize}ms`,
        metadata: { requests: current.count, window: windowSize, limit }
      });
    }

    return null;
  }

  // Create security event
  private createSecurityEvent(params: {
    type: SecurityEventType;
    severity: SecurityEvent['severity'];
    source: string;
    description: string;
    metadata: Record<string, any>;
  }): SecurityEvent {
    const event: SecurityEvent = {
      id: `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      resolved: false,
      ...params
    };

    this.events.push(event);
    this.processSecurityEvent(event);

    return event;
  }

  // Process security event
  private async processSecurityEvent(event: SecurityEvent): Promise<void> {
    // Find matching rules
    const matchingRules = this.rules.filter(rule => 
      rule.enabled && 
      rule.eventType === event.type &&
      this.evaluateRuleConditions(rule, event)
    );

    // Execute actions for matching rules
    for (const rule of matchingRules) {
      // Check cooldown
      if (rule.lastTriggered && 
          Date.now() - new Date(rule.lastTriggered).getTime() < rule.cooldownPeriod) {
        continue;
      }

      await this.executeRuleActions(rule, event);
      rule.lastTriggered = new Date().toISOString();
    }

    // Send real-time alert for critical events
    if (event.severity === 'critical' || event.severity === 'high') {
      await this.sendRealTimeAlert(event);
    }

    // Log event
    console.log(`Security Event [${event.severity.toUpperCase()}]: ${event.description}`, event);
  }

  // Evaluate rule conditions
  private evaluateRuleConditions(rule: SecurityRule, event: SecurityEvent): boolean {
    return rule.conditions.every(condition => {
      const value = this.getEventValue(event, condition.field);
      return this.evaluateCondition(value, condition);
    });
  }

  // Get value from event
  private getEventValue(event: SecurityEvent, field: string): any {
    if (field.includes('.')) {
      const parts = field.split('.');
      let value: any = event;
      for (const part of parts) {
        value = value?.[part];
      }
      return value;
    }
    return (event as any)[field] || event.metadata[field];
  }

  // Evaluate individual condition
  private evaluateCondition(value: any, condition: SecurityCondition): boolean {
    switch (condition.operator) {
      case 'equals':
        return value === condition.value;
      case 'contains':
        return String(value).toLowerCase().includes(String(condition.value).toLowerCase());
      case 'greater_than':
        return Number(value) > Number(condition.value);
      case 'less_than':
        return Number(value) < Number(condition.value);
      case 'regex':
        return condition.value.test(String(value));
      case 'in_list':
        return Array.isArray(condition.value) && condition.value.includes(value);
      default:
        return false;
    }
  }

  // Execute rule actions
  private async executeRuleActions(rule: SecurityRule, event: SecurityEvent): Promise<void> {
    for (const action of rule.actions) {
      switch (action.type) {
        case 'block':
          await this.blockRequest(event, action.parameters);
          break;
        case 'rate_limit':
          await this.applyRateLimit(event, action.parameters);
          break;
        case 'alert':
          await this.sendAlert(event, action.parameters);
          break;
        case 'log':
          await this.logSecurityEvent(event, action.parameters);
          break;
        case 'redirect':
          await this.redirectRequest(event, action.parameters);
          break;
        case 'challenge':
          await this.challengeRequest(event, action.parameters);
          break;
      }
    }
  }

  // Action implementations
  private async blockRequest(event: SecurityEvent, params: any): Promise<void> {
    // Block IP temporarily or permanently
    console.log(`Blocking request from ${event.source}`, params);
  }

  private async applyRateLimit(event: SecurityEvent, params: any): Promise<void> {
    // Apply rate limiting
    console.log(`Applying rate limit to ${event.source}`, params);
  }

  private async sendAlert(event: SecurityEvent, params: any): Promise<void> {
    // Send alert to security team
    console.log(`Sending alert for event ${event.id}`, params);
  }

  private async logSecurityEvent(event: SecurityEvent, params: any): Promise<void> {
    // Enhanced logging
    console.log(`Logging security event ${event.id}`, params);
  }

  private async redirectRequest(event: SecurityEvent, params: any): Promise<void> {
    // Redirect suspicious requests
    console.log(`Redirecting request from ${event.source}`, params);
  }

  private async challengeRequest(event: SecurityEvent, params: any): Promise<void> {
    // Present CAPTCHA or other challenge
    console.log(`Challenging request from ${event.source}`, params);
  }

  // Send real-time alerts
  private async sendRealTimeAlert(event: SecurityEvent): Promise<void> {
    // Implementation would send to Slack, Discord, email, etc.
    console.log(`🚨 SECURITY ALERT: ${event.description}`, event);
  }

  // Get client IP
  private getClientIP(request: Request): string {
    return request.headers.get('CF-Connecting-IP') || 
           request.headers.get('X-Forwarded-For') || 
           request.headers.get('X-Real-IP') || 
           'unknown';
  }

  // Get security metrics
  public getSecurityMetrics(): SecurityMetrics {
    const now = Date.now();
    const last24Hours = now - (24 * 60 * 60 * 1000);
    const recentEvents = this.events.filter(e => new Date(e.timestamp).getTime() > last24Hours);

    const eventsByType = recentEvents.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<SecurityEventType, number>);

    const eventsBySeverity = recentEvents.reduce((acc, event) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1;
      return acc;
    }, {} as Record<'low' | 'medium' | 'high' | 'critical', number>);

    const ipCounts = recentEvents.reduce((acc, event) => {
      if (event.source) {
        acc[event.source] = (acc[event.source] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const topSourceIPs = Object.entries(ipCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([ip, count]) => ({ ip, count }));

    return {
      totalEvents: recentEvents.length,
      eventsByType,
      eventsBySeverity,
      topSourceIPs,
      resolvedEvents: recentEvents.filter(e => e.resolved).length,
      activeThreats: recentEvents.filter(e => !e.resolved && e.severity === 'critical').length,
      averageResponseTime: 0, // Would calculate from response times
      falsePositiveRate: 0 // Would calculate from manual reviews
    };
  }

  // Periodic cleanup
  private startPeriodicCleanup(): void {
    setInterval(() => {
      const cutoff = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days
      this.events = this.events.filter(e => new Date(e.timestamp).getTime() > cutoff);
      
      // Clean up rate limits
      const now = Date.now();
      for (const [key, data] of Array.from(this.rateLimits.entries())) {
        if (now > data.resetTime) {
          this.rateLimits.delete(key);
        }
      }
    }, 60 * 60 * 1000); // Run hourly
  }

  // Manual event resolution
  public resolveEvent(eventId: string, resolvedBy: string): boolean {
    const event = this.events.find(e => e.id === eventId);
    if (event) {
      event.resolved = true;
      event.resolvedAt = new Date().toISOString();
      event.resolvedBy = resolvedBy;
      return true;
    }
    return false;
  }

  // Get events
  public getEvents(filters?: {
    type?: SecurityEventType;
    severity?: SecurityEvent['severity'];
    resolved?: boolean;
    limit?: number;
  }): SecurityEvent[] {
    let filteredEvents = [...this.events];

    if (filters?.type) {
      filteredEvents = filteredEvents.filter(e => e.type === filters.type);
    }

    if (filters?.severity) {
      filteredEvents = filteredEvents.filter(e => e.severity === filters.severity);
    }

    if (filters?.resolved !== undefined) {
      filteredEvents = filteredEvents.filter(e => e.resolved === filters.resolved);
    }

    // Sort by timestamp (newest first)
    filteredEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (filters?.limit) {
      filteredEvents = filteredEvents.slice(0, filters.limit);
    }

    return filteredEvents;
  }
}

// Export singleton instance
export const securityMonitor = new SecurityMonitor();

// Utility functions
export function analyzeRequest(request: Request): SecurityEvent[] {
  return securityMonitor.analyzeRequest(request);
}

export function getSecurityMetrics(): SecurityMetrics {
  return securityMonitor.getSecurityMetrics();
}

export function getSecurityEvents(filters?: Parameters<typeof securityMonitor.getEvents>[0]): SecurityEvent[] {
  return securityMonitor.getEvents(filters);
}

export function resolveSecurityEvent(eventId: string, resolvedBy: string): boolean {
  return securityMonitor.resolveEvent(eventId, resolvedBy);
}