/**
 * Security Events API
 * Real-time security monitoring and threat detection endpoint
 */

import { NextRequest, NextResponse } from 'next/server';

// Security event types and interfaces
enum SecurityEventType {
  CSP_VIOLATION = 'csp_violation',
  XSS_ATTEMPT = 'xss_attempt',
  SQL_INJECTION = 'sql_injection',
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  SUSPICIOUS_REQUEST = 'suspicious_request',
  MALWARE_DETECTED = 'malware_detected',
  BRUTE_FORCE = 'brute_force',
  DATA_BREACH_ATTEMPT = 'data_breach_attempt'
}

enum ThreatLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
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
  severity: 'info' | 'warning' | 'error' | 'critical';
}

interface SecurityMetrics {
  totalEvents: number;
  eventsByType: Record<string, number>;
  eventsByThreatLevel: Record<string, number>;
  blockedRequests: number;
  uniqueIPs: number;
  topSources: Array<{ source: string; count: number }>;
  recentTrends: Array<{ 
    timestamp: number; 
    eventCount: number; 
    threatLevel: ThreatLevel 
  }>;
}

// In-memory storage (in production, use database with proper retention)
const securityEvents: SecurityEvent[] = [];
const ipActivityMap = new Map<string, { count: number; firstSeen: number; lastSeen: number }>();

export async function POST(request: NextRequest) {
  try {
    const eventData = await request.json();
    
    // Extract client information
    const clientIP = request.ip || 
                    request.headers.get('x-forwarded-for')?.split(',')[0] ||
                    request.headers.get('x-real-ip') ||
                    'unknown';
    
    const userAgent = request.headers.get('user-agent') || '';
    const country = request.geo?.country || 'unknown';
    const city = request.geo?.city || 'unknown';
    
    // Create security event
    const securityEvent: SecurityEvent = {
      id: generateEventId(),
      type: eventData.type || SecurityEventType.SUSPICIOUS_REQUEST,
      threatLevel: eventData.threatLevel || ThreatLevel.LOW,
      timestamp: Date.now(),
      source: eventData.source || request.url,
      details: {
        ...eventData.details,
        requestHeaders: Object.fromEntries(request.headers.entries()),
        url: request.url,
        method: request.method,
      },
      blocked: eventData.blocked || false,
      userAgent,
      ip: clientIP,
      geolocation: `${city}, ${country}`,
      severity: mapThreatLevelToSeverity(eventData.threatLevel || ThreatLevel.LOW),
    };

    // Enhance event with additional analysis
    await enhanceSecurityEvent(securityEvent, request);
    
    // Store the event
    securityEvents.push(securityEvent);
    
    // Update IP activity tracking
    updateIPActivity(clientIP);
    
    // Keep storage manageable (last 5,000 events)
    if (securityEvents.length > 5000) {
      securityEvents.splice(0, 500);
    }

    // Check for patterns and escalate if needed
    const patterns = detectAttackPatterns(clientIP);
    if (patterns.length > 0) {
      await escalateSecurityThreat(securityEvent, patterns);
    }

    // Log high-severity events
    if (securityEvent.threatLevel === ThreatLevel.HIGH || 
        securityEvent.threatLevel === ThreatLevel.CRITICAL) {
      console.error('[SECURITY ALERT]', {
        type: securityEvent.type,
        threatLevel: securityEvent.threatLevel,
        source: securityEvent.source,
        ip: clientIP,
        details: securityEvent.details,
      });
    }

    return NextResponse.json({
      success: true,
      eventId: securityEvent.id,
      threatLevel: securityEvent.threatLevel,
      blocked: securityEvent.blocked,
      timestamp: securityEvent.timestamp,
    });

  } catch (error) {
    console.error('Security event processing error:', error);
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
    const threatLevel = searchParams.get('threatLevel');
    const eventType = searchParams.get('type');
    const format = searchParams.get('format') || 'json';
    const limit = parseInt(searchParams.get('limit') || '100');
    
    // Calculate time range
    const endTime = Date.now();
    const startTime = endTime - parseTimeRange(timeRange);
    
    // Filter events
    let filteredEvents = securityEvents.filter(event => 
      event.timestamp >= startTime && event.timestamp <= endTime
    );
    
    if (threatLevel) {
      filteredEvents = filteredEvents.filter(event => 
        event.threatLevel === threatLevel
      );
    }
    
    if (eventType) {
      filteredEvents = filteredEvents.filter(event => 
        event.type === eventType
      );
    }

    // Sort by timestamp (newest first)
    filteredEvents.sort((a, b) => b.timestamp - a.timestamp);
    
    // Limit results
    filteredEvents = filteredEvents.slice(0, limit);

    if (format === 'metrics') {
      const metrics = generateSecurityMetrics(filteredEvents, startTime, endTime);
      return NextResponse.json(metrics);
    }

    if (format === 'summary') {
      const summary = generateSecuritySummary(filteredEvents);
      return NextResponse.json(summary);
    }

    // Default: return filtered events
    return NextResponse.json({
      timeRange: { start: startTime, end: endTime },
      events: filteredEvents,
      totalEvents: filteredEvents.length,
      filters: { threatLevel, eventType, limit },
    });

  } catch (error) {
    console.error('Security events GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Utility functions
function generateEventId(): string {
  return `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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

function mapThreatLevelToSeverity(threatLevel: ThreatLevel): 'info' | 'warning' | 'error' | 'critical' {
  const mapping = {
    [ThreatLevel.LOW]: 'info' as const,
    [ThreatLevel.MEDIUM]: 'warning' as const,
    [ThreatLevel.HIGH]: 'error' as const,
    [ThreatLevel.CRITICAL]: 'critical' as const,
  };
  return mapping[threatLevel];
}

async function enhanceSecurityEvent(event: SecurityEvent, request: NextRequest): Promise<void> {
  // Add threat intelligence
  event.details.threatIntelligence = await getThreatIntelligence(event.ip || '');
  
  // Analyze request patterns
  event.details.requestPattern = analyzeRequestPattern(event);
  
  // Check against known attack signatures
  event.details.attackSignatures = checkAttackSignatures(event);
  
  // Geolocation risk assessment
  event.details.geoRisk = assessGeolocationRisk(event.geolocation || '');
}

async function getThreatIntelligence(ip: string): Promise<any> {
  // In production, integrate with threat intelligence APIs
  // For now, return mock data
  return {
    reputation: 'unknown',
    categories: [],
    confidence: 0,
    lastSeen: null,
  };
}

function analyzeRequestPattern(event: SecurityEvent): any {
  const patterns = {
    repetitiveRequests: false,
    unusualUserAgent: false,
    suspiciousHeaders: false,
    malformedData: false,
  };
  
  // Analyze user agent
  if (event.userAgent) {
    patterns.unusualUserAgent = /bot|crawler|scanner|automated/i.test(event.userAgent) ||
                                event.userAgent.length < 10;
  }
  
  // Check for suspicious headers
  if (event.details.requestHeaders) {
    const headers = event.details.requestHeaders;
    patterns.suspiciousHeaders = 
      !headers['accept'] || 
      headers['x-forwarded-for']?.includes('127.0.0.1') ||
      Object.keys(headers).some(h => h.includes('x-real-ip'));
  }
  
  return patterns;
}

function checkAttackSignatures(event: SecurityEvent): string[] {
  const signatures: string[] = [];
  const content = JSON.stringify(event.details).toLowerCase();
  
  // XSS signatures
  if (/<script|javascript:|on\w+=/i.test(content)) {
    signatures.push('xss_attempt');
  }
  
  // SQL injection signatures
  if (/union.*select|insert.*into|drop.*table/i.test(content)) {
    signatures.push('sql_injection');
  }
  
  // Directory traversal
  if (/\.\.\/|\.\.\\|\/etc\/|\/proc\//i.test(content)) {
    signatures.push('directory_traversal');
  }
  
  // Command injection
  if (/cmd\.exe|powershell|\/bin\/|system\(/i.test(content)) {
    signatures.push('command_injection');
  }
  
  return signatures;
}

function assessGeolocationRisk(geolocation: string): 'low' | 'medium' | 'high' {
  // High-risk countries/regions (this would be configurable)
  const highRiskRegions = ['unknown', 'tor_exit_node'];
  const mediumRiskRegions = ['some_country'];
  
  if (highRiskRegions.some(region => geolocation.includes(region))) {
    return 'high';
  }
  
  if (mediumRiskRegions.some(region => geolocation.includes(region))) {
    return 'medium';
  }
  
  return 'low';
}

function updateIPActivity(ip: string): void {
  const now = Date.now();
  const activity = ipActivityMap.get(ip) || { 
    count: 0, 
    firstSeen: now, 
    lastSeen: now 
  };
  
  activity.count++;
  activity.lastSeen = now;
  
  ipActivityMap.set(ip, activity);
  
  // Clean up old entries (older than 24 hours)
  const dayAgo = now - 24 * 60 * 60 * 1000;
  ipActivityMap.forEach((activityData, ipKey) => {
    if (activityData.lastSeen < dayAgo) {
      ipActivityMap.delete(ipKey);
    }
  });
}

function detectAttackPatterns(ip: string): string[] {
  const patterns: string[] = [];
  const activity = ipActivityMap.get(ip);
  
  if (!activity) return patterns;
  
  const recentEvents = securityEvents
    .filter(event => event.ip === ip)
    .filter(event => event.timestamp > Date.now() - 60 * 60 * 1000); // Last hour
  
  // High frequency attacks
  if (recentEvents.length > 50) {
    patterns.push('high_frequency_attack');
  }
  
  // Multiple attack types
  const attackTypes = new Set(recentEvents.map(e => e.type));
  if (attackTypes.size > 3) {
    patterns.push('multi_vector_attack');
  }
  
  // Escalating threat levels
  const threatLevels = recentEvents.map(e => e.threatLevel);
  if (threatLevels.includes(ThreatLevel.CRITICAL) && threatLevels.includes(ThreatLevel.HIGH)) {
    patterns.push('escalating_threats');
  }
  
  return patterns;
}

async function escalateSecurityThreat(event: SecurityEvent, patterns: string[]): Promise<void> {
  console.error('[SECURITY ESCALATION]', {
    eventId: event.id,
    ip: event.ip,
    patterns,
    threatLevel: event.threatLevel,
  });
  
  // In production, integrate with incident response systems
  // - Send alerts to security team
  // - Update WAF rules
  // - Trigger automated blocking
  // - Create incident tickets
}

function generateSecurityMetrics(
  events: SecurityEvent[], 
  startTime: number, 
  endTime: number
): SecurityMetrics {
  const eventsByType: Record<string, number> = {};
  const eventsByThreatLevel: Record<string, number> = {};
  const sourceCount: Record<string, number> = {};
  const uniqueIPs = new Set<string>();
  
  let blockedRequests = 0;
  
  events.forEach(event => {
    // Count by type
    eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
    
    // Count by threat level
    eventsByThreatLevel[event.threatLevel] = (eventsByThreatLevel[event.threatLevel] || 0) + 1;
    
    // Count by source
    sourceCount[event.source] = (sourceCount[event.source] || 0) + 1;
    
    // Track unique IPs
    if (event.ip) {
      uniqueIPs.add(event.ip);
    }
    
    // Count blocked requests
    if (event.blocked) {
      blockedRequests++;
    }
  });
  
  // Top sources
  const topSources = Object.entries(sourceCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([source, count]) => ({ source, count }));
  
  // Generate trends (simplified)
  const recentTrends = generateTrends(events, startTime, endTime);
  
  return {
    totalEvents: events.length,
    eventsByType,
    eventsByThreatLevel,
    blockedRequests,
    uniqueIPs: uniqueIPs.size,
    topSources,
    recentTrends,
  };
}

function generateTrends(
  events: SecurityEvent[], 
  startTime: number, 
  endTime: number
): Array<{ timestamp: number; eventCount: number; threatLevel: ThreatLevel }> {
  const interval = Math.max((endTime - startTime) / 20, 60000); // At least 1 minute intervals
  const trends: Array<{ timestamp: number; eventCount: number; threatLevel: ThreatLevel }> = [];
  
  for (let time = startTime; time < endTime; time += interval) {
    const intervalEvents = events.filter(e => 
      e.timestamp >= time && e.timestamp < time + interval
    );
    
    const maxThreatLevel = intervalEvents.reduce((max, event) => {
      const levels = [ThreatLevel.LOW, ThreatLevel.MEDIUM, ThreatLevel.HIGH, ThreatLevel.CRITICAL];
      const currentIndex = levels.indexOf(event.threatLevel);
      const maxIndex = levels.indexOf(max);
      return currentIndex > maxIndex ? event.threatLevel : max;
    }, ThreatLevel.LOW);
    
    trends.push({
      timestamp: time,
      eventCount: intervalEvents.length,
      threatLevel: maxThreatLevel,
    });
  }
  
  return trends;
}

function generateSecuritySummary(events: SecurityEvent[]): any {
  const summary = {
    totalEvents: events.length,
    criticalEvents: events.filter(e => e.threatLevel === ThreatLevel.CRITICAL).length,
    highThreatEvents: events.filter(e => e.threatLevel === ThreatLevel.HIGH).length,
    blockedAttacks: events.filter(e => e.blocked).length,
    mostCommonAttack: '',
    riskScore: 0,
    recommendations: [] as string[],
  };
  
  // Find most common attack type
  const typeCounts: Record<string, number> = {};
  events.forEach(event => {
    typeCounts[event.type] = (typeCounts[event.type] || 0) + 1;
  });
  
  summary.mostCommonAttack = Object.entries(typeCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || 'none';
  
  // Calculate risk score (0-100)
  summary.riskScore = Math.min(100, Math.round(
    (summary.criticalEvents * 25) + 
    (summary.highThreatEvents * 10) + 
    (events.length * 0.1)
  ));
  
  // Generate recommendations
  if (summary.criticalEvents > 0) {
    summary.recommendations.push('Immediate action required: Critical security events detected');
  }
  if (summary.riskScore > 70) {
    summary.recommendations.push('Consider implementing additional security measures');
  }
  if (summary.blockedAttacks < events.length * 0.8) {
    summary.recommendations.push('Review and strengthen blocking mechanisms');
  }
  
  return summary;
}
