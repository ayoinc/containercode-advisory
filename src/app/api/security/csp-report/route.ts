/**
 * Content Security Policy (CSP) Violation Report Endpoint
 * Handles CSP violation reports and security monitoring
 */

import { NextRequest, NextResponse } from 'next/server';


interface CSPViolationReport {
  'document-uri': string;
  'referrer': string;
  'violated-directive': string;
  'effective-directive': string;
  'original-policy': string;
  'disposition': string;
  'blocked-uri': string;
  'line-number': number;
  'column-number': number;
  'source-file': string;
  'status-code': number;
  'script-sample': string;
}

interface CSPReportWrapper {
  'csp-report': CSPViolationReport;
}

interface ProcessedCSPViolation {
  id: string;
  timestamp: number;
  documentUri: string;
  violatedDirective: string;
  blockedUri: string;
  originalPolicy: string;
  disposition: string;
  sourceFile: string;
  lineNumber: number;
  columnNumber: number;
  scriptSample: string;
  userAgent: string;
  ip: string;
  country: string;
  severity: 'low' | 'medium' | 'high';
  category: string;
  recommendation: string;
}

// In-memory storage for CSP violations
const cspViolations: ProcessedCSPViolation[] = [];

export async function POST(request: NextRequest) {
  try {
    // Parse the CSP report
    const reportData: CSPReportWrapper = await request.json();
    const report = reportData['csp-report'];
    
    if (!report) {
      return NextResponse.json(
        { error: 'Invalid CSP report format' },
        { status: 400 }
      );
    }

    // Extract client information
    const userAgent = request.headers.get('user-agent') || '';
    const clientIP = request.ip || 
                    request.headers.get('x-forwarded-for')?.split(',')[0] ||
                    'unknown';
    const country = request.geo?.country || 'unknown';

    // Process and analyze the violation
    const processedViolation = processCSPViolation(report, userAgent, clientIP, country);
    
    // Store the violation
    cspViolations.push(processedViolation);
    
    // Keep storage manageable
    if (cspViolations.length > 1000) {
      cspViolations.splice(0, 100);
    }

    // Log based on severity
    if (processedViolation.severity === 'high') {
      console.error('[CSP VIOLATION - HIGH]', processedViolation);
    } else if (processedViolation.severity === 'medium') {
      console.warn('[CSP VIOLATION - MEDIUM]', processedViolation);
    } else {
      console.log('[CSP VIOLATION - LOW]', processedViolation);
    }

    // Check for attack patterns
    const isAttack = detectPotentialAttack(processedViolation);
    if (isAttack) {
      await triggerSecurityAlert(processedViolation);
    }

    return NextResponse.json({
      success: true,
      violationId: processedViolation.id,
      severity: processedViolation.severity,
      category: processedViolation.category,
    });

  } catch (error) {
    console.error('CSP report processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process CSP report' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '24h';
    const severity = searchParams.get('severity');
    const limit = parseInt(searchParams.get('limit') || '100');
    const format = searchParams.get('format') || 'json';
    
    // Calculate time range
    const endTime = Date.now();
    const startTime = endTime - parseTimeRange(timeRange);
    
    // Filter violations
    let filteredViolations = cspViolations.filter(violation => 
      violation.timestamp >= startTime && violation.timestamp <= endTime
    );
    
    if (severity) {
      filteredViolations = filteredViolations.filter(violation => 
        violation.severity === severity
      );
    }
    
    // Sort by timestamp (newest first)
    filteredViolations.sort((a, b) => b.timestamp - a.timestamp);
    
    // Limit results
    filteredViolations = filteredViolations.slice(0, limit);

    if (format === 'analytics') {
      const analytics = generateCSPAnalytics(filteredViolations);
      return NextResponse.json(analytics);
    }

    return NextResponse.json({
      timeRange: { start: startTime, end: endTime },
      violations: filteredViolations,
      totalViolations: filteredViolations.length,
      summary: generateViolationSummary(filteredViolations),
    });

  } catch (error) {
    console.error('CSP violations GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function processCSPViolation(
  report: CSPViolationReport,
  userAgent: string,
  ip: string,
  country: string
): ProcessedCSPViolation {
  const violation: ProcessedCSPViolation = {
    id: generateViolationId(),
    timestamp: Date.now(),
    documentUri: report['document-uri'] || '',
    violatedDirective: report['violated-directive'] || '',
    blockedUri: report['blocked-uri'] || '',
    originalPolicy: report['original-policy'] || '',
    disposition: report['disposition'] || '',
    sourceFile: report['source-file'] || '',
    lineNumber: report['line-number'] || 0,
    columnNumber: report['column-number'] || 0,
    scriptSample: report['script-sample'] || '',
    userAgent,
    ip,
    country,
    severity: assessViolationSeverity(report),
    category: categorizeViolation(report),
    recommendation: generateRecommendation(report),
  };

  return violation;
}

function assessViolationSeverity(report: CSPViolationReport): 'low' | 'medium' | 'high' {
  const directive = report['violated-directive'] || '';
  const blockedUri = report['blocked-uri'] || '';
  const scriptSample = report['script-sample'] || '';
  
  // High severity indicators
  if (directive.includes('script-src') && blockedUri.includes('javascript:')) {
    return 'high'; // Potential XSS
  }
  
  if (directive.includes('script-src') && /eval|setTimeout|setInterval/i.test(scriptSample)) {
    return 'high'; // Dangerous script execution
  }
  
  if (blockedUri.includes('data:') && directive.includes('script-src')) {
    return 'high'; // Data URI script injection
  }
  
  // Medium severity indicators
  if (directive.includes('script-src') || directive.includes('object-src')) {
    return 'medium'; // Script or object violations
  }
  
  if (directive.includes('frame-src') && !blockedUri.includes('trusted-domain')) {
    return 'medium'; // Untrusted frame sources
  }
  
  // Low severity for style, image, font violations
  return 'low';
}

function categorizeViolation(report: CSPViolationReport): string {
  const directive = report['violated-directive'] || '';
  const blockedUri = report['blocked-uri'] || '';
  
  if (directive.includes('script-src')) {
    if (blockedUri.includes('inline')) return 'inline-script';
    if (blockedUri.includes('eval')) return 'eval-usage';
    if (blockedUri.startsWith('data:')) return 'data-uri-script';
    return 'external-script';
  }
  
  if (directive.includes('style-src')) {
    if (blockedUri.includes('inline')) return 'inline-style';
    return 'external-style';
  }
  
  if (directive.includes('img-src')) return 'image-source';
  if (directive.includes('font-src')) return 'font-source';
  if (directive.includes('connect-src')) return 'connection';
  if (directive.includes('frame-src')) return 'frame-source';
  if (directive.includes('object-src')) return 'object-source';
  
  return 'other';
}

function generateRecommendation(report: CSPViolationReport): string {
  const directive = report['violated-directive'] || '';
  const blockedUri = report['blocked-uri'] || '';
  const category = categorizeViolation(report);
  
  const recommendations: Record<string, string> = {
    'inline-script': 'Move inline scripts to external files and add nonce or hash to CSP',
    'eval-usage': 'Remove eval() usage and replace with safer alternatives',
    'data-uri-script': 'Avoid data URI scripts, use external files instead',
    'external-script': `Add '${blockedUri}' to script-src directive if trusted`,
    'inline-style': 'Move inline styles to external CSS files',
    'external-style': `Add '${blockedUri}' to style-src directive if trusted`,
    'image-source': `Add '${blockedUri}' to img-src directive if trusted`,
    'font-source': `Add '${blockedUri}' to font-src directive if trusted`,
    'connection': `Add '${blockedUri}' to connect-src directive if trusted`,
    'frame-source': `Add '${blockedUri}' to frame-src directive if trusted`,
    'object-source': 'Consider if object embedding is necessary for security',
    'other': 'Review CSP policy and add appropriate sources',
  };
  
  return recommendations[category] || 'Review and update CSP policy as needed';
}

function detectPotentialAttack(violation: ProcessedCSPViolation): boolean {
  // XSS indicators
  if (violation.category === 'inline-script' && 
      /alert|confirm|prompt|document\.cookie/i.test(violation.scriptSample)) {
    return true;
  }
  
  // Data exfiltration attempts
  if (violation.blockedUri.includes('data:') || 
      violation.blockedUri.includes('javascript:')) {
    return true;
  }
  
  // External script injection
  if (violation.category === 'external-script' && 
      !isKnownGoodDomain(violation.blockedUri)) {
    return true;
  }
  
  return false;
}

function isKnownGoodDomain(uri: string): boolean {
  const trustedDomains = [
    'googleapis.com',
    'gstatic.com',
    'cloudflare.com',
    'jsdelivr.net',
    'unpkg.com',
    'vercel.com',
    'vercel-insights.com',
    'google-analytics.com',
    'googletagmanager.com',
  ];
  
  return trustedDomains.some(domain => uri.includes(domain));
}

async function triggerSecurityAlert(violation: ProcessedCSPViolation): Promise<void> {
  console.error('[CSP SECURITY ALERT]', {
    violationId: violation.id,
    ip: violation.ip,
    severity: violation.severity,
    category: violation.category,
    blockedUri: violation.blockedUri,
    scriptSample: violation.scriptSample,
  });
  
  // In production, integrate with security monitoring systems
  // - Send to SIEM
  // - Notify security team
  // - Create incident ticket
  // - Update threat intelligence
}

function generateViolationSummary(violations: ProcessedCSPViolation[]): any {
  const summary = {
    total: violations.length,
    bySeverity: {} as Record<string, number>,
    byCategory: {} as Record<string, number>,
    topBlockedUris: [] as Array<{ uri: string; count: number }>,
    topDirectives: [] as Array<{ directive: string; count: number }>,
    potentialAttacks: 0,
  };
  
  const uriCounts: Record<string, number> = {};
  const directiveCounts: Record<string, number> = {};
  
  violations.forEach(violation => {
    // Count by severity
    summary.bySeverity[violation.severity] = (summary.bySeverity[violation.severity] || 0) + 1;
    
    // Count by category
    summary.byCategory[violation.category] = (summary.byCategory[violation.category] || 0) + 1;
    
    // Count URIs
    uriCounts[violation.blockedUri] = (uriCounts[violation.blockedUri] || 0) + 1;
    
    // Count directives
    directiveCounts[violation.violatedDirective] = (directiveCounts[violation.violatedDirective] || 0) + 1;
    
    // Count potential attacks
    if (detectPotentialAttack(violation)) {
      summary.potentialAttacks++;
    }
  });
  
  // Top blocked URIs
  summary.topBlockedUris = Object.entries(uriCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([uri, count]) => ({ uri, count }));
  
  // Top violated directives
  summary.topDirectives = Object.entries(directiveCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([directive, count]) => ({ directive, count }));
  
  return summary;
}

function generateCSPAnalytics(violations: ProcessedCSPViolation[]): any {
  const analytics = {
    totalViolations: violations.length,
    severityDistribution: {} as Record<string, number>,
    categoryDistribution: {} as Record<string, number>,
    hourlyDistribution: {} as Record<string, number>,
    topSources: [] as Array<{ source: string; count: number }>,
    recommendations: [] as string[],
    trends: {
      increasing: [] as string[],
      decreasing: [] as string[],
      stable: [] as string[],
    },
  };
  
  const sourceCounts: Record<string, number> = {};
  
  violations.forEach(violation => {
    // Severity distribution
    analytics.severityDistribution[violation.severity] = 
      (analytics.severityDistribution[violation.severity] || 0) + 1;
    
    // Category distribution
    analytics.categoryDistribution[violation.category] = 
      (analytics.categoryDistribution[violation.category] || 0) + 1;
    
    // Hourly distribution
    const hour = new Date(violation.timestamp).getHours().toString();
    analytics.hourlyDistribution[hour] = (analytics.hourlyDistribution[hour] || 0) + 1;
    
    // Source tracking
    const source = violation.sourceFile || violation.documentUri;
    sourceCounts[source] = (sourceCounts[source] || 0) + 1;
  });
  
  // Top sources
  analytics.topSources = Object.entries(sourceCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([source, count]) => ({ source, count }));
  
  // Generate recommendations
  if (analytics.severityDistribution.high > 0) {
    analytics.recommendations.push('Address high-severity CSP violations immediately');
  }
  
  if (analytics.categoryDistribution['inline-script'] > 0) {
    analytics.recommendations.push('Consider moving inline scripts to external files');
  }
  
  if (analytics.categoryDistribution['eval-usage'] > 0) {
    analytics.recommendations.push('Remove eval() usage for better security');
  }
  
  return analytics;
}

function parseTimeRange(timeRange: string): number {
  const unit = timeRange.slice(-1);
  const value = parseInt(timeRange.slice(0, -1));
  
  switch (unit) {
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: return 24 * 60 * 60 * 1000; // 24 hours default
  }
}

function generateViolationId(): string {
  return `csp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
