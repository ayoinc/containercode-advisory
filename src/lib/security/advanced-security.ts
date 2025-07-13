/**
 * Advanced Security System with Modern Threat Detection
 * Enterprise-grade security headers, CSP, and real-time threat monitoring
 */

// Security threat levels
export enum ThreatLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Security event types
export enum SecurityEventType {
  CSP_VIOLATION = 'csp_violation',
  XSS_ATTEMPT = 'xss_attempt',
  SQL_INJECTION = 'sql_injection',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  SUSPICIOUS_REQUEST = 'suspicious_request',
  MALWARE_DETECTED = 'malware_detected',
  BRUTE_FORCE = 'brute_force',
  DATA_BREACH_ATTEMPT = 'data_breach_attempt'
}

interface SecurityEvent {
  id: string;
  type: SecurityEventType;
  threatLevel: ThreatLevel;
  timestamp: number;
  source: string;
  details: Record<string, any>;
  blocked: boolean;
  userAgent?: string;
  ip?: string;
  geolocation?: string;
}

interface SecurityPolicy {
  csp: ContentSecurityPolicy;
  rateLimit: RateLimitPolicy;
  accessControl: AccessControlPolicy;
  encryption: EncryptionPolicy;
}

interface ContentSecurityPolicy {
  defaultSrc: string[];
  scriptSrc: string[];
  styleSrc: string[];
  imgSrc: string[];
  fontSrc: string[];
  connectSrc: string[];
  frameSrc: string[];
  mediaSrc: string[];
  objectSrc: string[];
  upgradeInsecureRequests: boolean;
  blockAllMixedContent: boolean;
  reportUri?: string;
}

interface RateLimitPolicy {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests: boolean;
  skipFailedRequests: boolean;
  keyGenerator?: (req: any) => string;
}

interface AccessControlPolicy {
  allowedOrigins: string[];
  allowedMethods: string[];
  allowedHeaders: string[];
  credentials: boolean;
  maxAge: number;
}

interface EncryptionPolicy {
  algorithm: string;
  keyLength: number;
  saltLength: number;
  iterations: number;
}

// Advanced security headers configuration
export const ADVANCED_SECURITY_HEADERS = {
  // Strict Transport Security with preload
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  
  // Enhanced XSS Protection
  'X-XSS-Protection': '1; mode=block',
  
  // Content Type Options
  'X-Content-Type-Options': 'nosniff',
  
  // Frame Options
  'X-Frame-Options': 'DENY',
  
  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions Policy (replacing Feature-Policy)
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'interest-cohort=()',
    'payment=()',
    'usb=()',
    'bluetooth=()',
    'magnetometer=()',
    'accelerometer=()',
    'gyroscope=()',
  ].join(', '),
  
  // Cross-Origin Policies
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  
  // Additional security headers
  'X-Permitted-Cross-Domain-Policies': 'none',
  'X-Download-Options': 'noopen',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
  
  // Server information hiding
  'Server': 'webserver',
  'X-Powered-By': '',
};

// Dynamic Content Security Policy generator
export class CSPBuilder {
  private policy: ContentSecurityPolicy;

  constructor(basePolicy?: Partial<ContentSecurityPolicy>) {
    this.policy = {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'blob:'],
      fontSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      mediaSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: true,
      blockAllMixedContent: true,
      ...basePolicy
    };
  }

  addSource(directive: keyof ContentSecurityPolicy, source: string): this {
    if (Array.isArray(this.policy[directive])) {
      (this.policy[directive] as string[]).push(source);
    }
    return this;
  }

  removeSource(directive: keyof ContentSecurityPolicy, source: string): this {
    if (Array.isArray(this.policy[directive])) {
      const sources = this.policy[directive] as string[];
      const index = sources.indexOf(source);
      if (index > -1) {
        sources.splice(index, 1);
      }
    }
    return this;
  }

  setReportUri(uri: string): this {
    this.policy.reportUri = uri;
    return this;
  }

  build(): string {
    const directives: string[] = [];

    Object.entries(this.policy).forEach(([key, value]) => {
      if (key === 'upgradeInsecureRequests' && value) {
        directives.push('upgrade-insecure-requests');
      } else if (key === 'blockAllMixedContent' && value) {
        directives.push('block-all-mixed-content');
      } else if (key === 'reportUri' && value) {
        directives.push(`report-uri ${value}`);
      } else if (Array.isArray(value) && value.length > 0) {
        const directiveName = this.camelToKebab(key);
        directives.push(`${directiveName} ${value.join(' ')}`);
      }
    });

    return directives.join('; ');
  }

  private camelToKebab(str: string): string {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  }
}

// Threat detection system
export class ThreatDetector {
  private events: SecurityEvent[] = [];
  private patterns: Map<SecurityEventType, RegExp[]> = new Map();
  private listeners: Array<(event: SecurityEvent) => void> = [];

  constructor() {
    this.initializePatterns();
    this.setupGlobalListeners();
  }

  private initializePatterns(): void {
    // XSS patterns
    this.patterns.set(SecurityEventType.XSS_ATTEMPT, [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>/gi,
      /eval\s*\(/gi,
    ]);

    // SQL injection patterns
    this.patterns.set(SecurityEventType.SQL_INJECTION, [
      /('|(\\')|(;)|(\\;))/g,
      /((\%27)|(\'))\s*((\%6F)|o|(\%4F))((\%72)|r|(\%52))/gi,
      /union\s+(all\s+)?select/gi,
      /insert\s+into/gi,
      /drop\s+(table|database)/gi,
    ]);

    // Suspicious request patterns
    this.patterns.set(SecurityEventType.SUSPICIOUS_REQUEST, [
      /\.\./g, // Directory traversal
      /\/etc\/passwd/gi,
      /\/proc\/self\/environ/gi,
      /cmd\.exe/gi,
      /powershell/gi,
    ]);
  }

  private setupGlobalListeners(): void {
    if (typeof window !== 'undefined') {
      // CSP violation reporting
      document.addEventListener('securitypolicyviolation', (e) => {
        this.reportEvent({
          type: SecurityEventType.CSP_VIOLATION,
          threatLevel: ThreatLevel.MEDIUM,
          source: e.documentURI,
          details: {
            violatedDirective: e.violatedDirective,
            blockedURI: e.blockedURI,
            effectiveDirective: e.effectiveDirective,
            originalPolicy: e.originalPolicy,
          },
          blocked: true,
        });
      });

      // Global error handling for potential attacks
      window.addEventListener('error', (e) => {
        if (this.isSuspiciousError(e)) {
          this.reportEvent({
            type: SecurityEventType.SUSPICIOUS_REQUEST,
            threatLevel: ThreatLevel.LOW,
            source: e.filename || 'unknown',
            details: {
              message: e.message,
              lineno: e.lineno,
              colno: e.colno,
            },
            blocked: false,
          });
        }
      });
    }
  }

  private isSuspiciousError(error: ErrorEvent): boolean {
    const suspiciousPatterns = [
      /blocked by csp/i,
      /refused to execute/i,
      /unsafe-eval/i,
      /unsafe-inline/i,
    ];

    return suspiciousPatterns.some(pattern => 
      pattern.test(error.message)
    );
  }

  // Analyze content for threats
  analyzeContent(content: string, source: string): SecurityEvent[] {
    const events: SecurityEvent[] = [];

    this.patterns.forEach((patterns, eventType) => {
      patterns.forEach(pattern => {
        if (pattern.test(content)) {
          events.push({
            id: this.generateEventId(),
            type: eventType,
            threatLevel: this.assessThreatLevel(eventType),
            timestamp: Date.now(),
            source,
            details: {
              pattern: pattern.toString(),
              content: content.substring(0, 200), // First 200 chars
            },
            blocked: true,
          });
        }
      });
    });

    return events;
  }

  // Report security event
  reportEvent(eventData: Partial<SecurityEvent>): void {
    const event: SecurityEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      blocked: false,
      ...eventData,
    } as SecurityEvent;

    this.events.push(event);
    
    // Keep only last 1000 events
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }

    // Notify listeners
    this.listeners.forEach(listener => listener(event));

    // Log high-severity events
    if (event.threatLevel === ThreatLevel.HIGH || event.threatLevel === ThreatLevel.CRITICAL) {
      console.error('[Security Alert]', event);
    }

    // Send to monitoring service
    this.sendToMonitoring(event);
  }

  private assessThreatLevel(eventType: SecurityEventType): ThreatLevel {
    const threatLevels = {
      [SecurityEventType.CSP_VIOLATION]: ThreatLevel.MEDIUM,
      [SecurityEventType.XSS_ATTEMPT]: ThreatLevel.HIGH,
      [SecurityEventType.SQL_INJECTION]: ThreatLevel.CRITICAL,
      [SecurityEventType.RATE_LIMIT_EXCEEDED]: ThreatLevel.MEDIUM,
      [SecurityEventType.SUSPICIOUS_REQUEST]: ThreatLevel.LOW,
      [SecurityEventType.MALWARE_DETECTED]: ThreatLevel.CRITICAL,
      [SecurityEventType.BRUTE_FORCE]: ThreatLevel.HIGH,
      [SecurityEventType.DATA_BREACH_ATTEMPT]: ThreatLevel.CRITICAL,
    };

    return threatLevels[eventType] || ThreatLevel.LOW;
  }

  private generateEventId(): string {
    return `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private sendToMonitoring(event: SecurityEvent): void {
    // Send to external monitoring service
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/security/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      }).catch(() => {}); // Silent fail
    }
  }

  // Public API
  getEvents(): SecurityEvent[] {
    return [...this.events];
  }

  getEventsByType(type: SecurityEventType): SecurityEvent[] {
    return this.events.filter(event => event.type === type);
  }

  getEventsByThreatLevel(level: ThreatLevel): SecurityEvent[] {
    return this.events.filter(event => event.threatLevel === level);
  }

  subscribe(listener: (event: SecurityEvent) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  clearEvents(): void {
    this.events = [];
  }
}

// Rate limiting implementation
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private policy: RateLimitPolicy;

  constructor(policy: RateLimitPolicy) {
    this.policy = policy;
    
    // Cleanup old entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.policy.windowMs;
    
    let requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    requests = requests.filter(time => time > windowStart);
    
    if (requests.length >= this.policy.maxRequests) {
      return false;
    }
    
    requests.push(now);
    this.requests.set(identifier, requests);
    
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const requests = this.requests.get(identifier) || [];
    const windowStart = Date.now() - this.policy.windowMs;
    const validRequests = requests.filter(time => time > windowStart);
    
    return Math.max(0, this.policy.maxRequests - validRequests.length);
  }

  getResetTime(identifier: string): number {
    const requests = this.requests.get(identifier) || [];
    if (requests.length === 0) return 0;
    
    const oldestRequest = Math.min(...requests);
    return oldestRequest + this.policy.windowMs;
  }

  private cleanup(): void {
    const now = Date.now();
    
    for (const [identifier, requests] of Array.from(this.requests.entries())) {
      const validRequests = requests.filter((time: any) => 
        time > now - this.policy.windowMs
      );
      
      if (validRequests.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, validRequests);
      }
    }
  }
}

// Security utilities
export const securityUtils = {
  // Sanitize user input
  sanitizeInput: (input: string): string => {
    return input
      .replace(/[<>\"']/g, (match) => {
        const charMap: Record<string, string> = {
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#x27;',
        };
        return charMap[match];
      });
  },

  // Generate secure random string
  generateSecureRandom: (length: number = 32): string => {
    if (typeof window !== 'undefined' && window.crypto) {
      const array = new Uint8Array(length);
      window.crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    // Fallback for environments without crypto API
    return Array.from({ length }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  },

  // Hash password securely
  hashPassword: async (password: string, salt?: string): Promise<string> => {
    if (typeof window !== 'undefined' && window.crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(password + (salt || ''));
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    
    // Fallback - not cryptographically secure
    return btoa(password);
  },

  // Validate email format
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Check for suspicious patterns
  containsSuspiciousPatterns: (input: string): boolean => {
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+=/i,
      /union.*select/i,
      /drop.*table/i,
      /\.\.\/\.\.\//,
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(input));
  },
};

// Export singletons
export const threatDetector = new ThreatDetector();

export const defaultRateLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});

// CSP builder with smart defaults
export const createSmartCSP = (environment: 'development' | 'production' = 'production') => {
  const builder = new CSPBuilder();
  
  if (environment === 'development') {
    builder
      .addSource('scriptSrc', "'unsafe-eval'")
      .addSource('connectSrc', 'ws:')
      .addSource('connectSrc', 'wss:');
  }
  
  return builder
    .addSource('scriptSrc', '*.googletagmanager.com')
    .addSource('scriptSrc', '*.google-analytics.com')
    .addSource('scriptSrc', '*.vercel-insights.com')
    .addSource('styleSrc', 'fonts.googleapis.com')
    .addSource('fontSrc', 'fonts.googleapis.com')
    .addSource('fontSrc', 'fonts.gstatic.com')
    .addSource('imgSrc', 'images.pexels.com')
    .addSource('imgSrc', 'images.unsplash.com')
    .addSource('imgSrc', '*.google-analytics.com')
    .addSource('connectSrc', '*.google-analytics.com')
    .addSource('connectSrc', '*.vercel-insights.com')
    .addSource('connectSrc', 'api.resend.com')
    .setReportUri('/api/security/csp-report');
};

// React hook for security monitoring
export function useSecurityMonitor() {
  const [events, setEvents] = React.useState<SecurityEvent[]>([]);
  const [threatLevel, setThreatLevel] = React.useState<ThreatLevel>(ThreatLevel.LOW);

  React.useEffect(() => {
    const unsubscribe = threatDetector.subscribe((event) => {
      setEvents(current => [...current, event].slice(-50)); // Keep last 50 events
      
      // Update overall threat level
      const recentEvents = threatDetector.getEvents().slice(-10);
      const highThreatEvents = recentEvents.filter(e => 
        e.threatLevel === ThreatLevel.HIGH || e.threatLevel === ThreatLevel.CRITICAL
      );
      
      if (highThreatEvents.length > 0) {
        setThreatLevel(ThreatLevel.HIGH);
      } else {
        setThreatLevel(ThreatLevel.LOW);
      }
    });

    return unsubscribe;
  }, []);

  return {
    events,
    threatLevel,
    reportEvent: (eventData: Partial<SecurityEvent>) => threatDetector.reportEvent(eventData),
    analyzeContent: (content: string, source: string) => threatDetector.analyzeContent(content, source),
  };
}

// Export React for the hook
import * as React from 'react';
