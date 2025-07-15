/**
 * Enhanced Edge Middleware with Smart Caching, Security, and Performance Monitoring
 * Integrates all Phase 1 enhancements into a unified edge computing solution
 * Phase 6: Enhanced Security & Compliance Integration
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSecurityHeaders } from './src/lib/security/csp-policy';
import { analyzeRequest } from './src/lib/security/monitoring';
import { isGDPRApplicable } from './src/lib/security/gdpr-compliance';
import { handleStaticAsset } from './src/lib/static-assets';

// Enhanced cache control configurations
const ENHANCED_CACHE_CONTROL = {
  // Critical user-facing content
  critical: 'public, s-maxage=3600, stale-while-revalidate=86400, stale-if-error=86400',
  
  // Static assets with versioning
  staticVersioned: 'public, max-age=31536000, immutable',
  
  // Static assets without versioning
  staticUnversioned: 'public, s-maxage=86400, stale-while-revalidate=604800',
  
  // Dynamic HTML pages
  dynamic: 'public, s-maxage=60, stale-while-revalidate=300, stale-if-error=3600',
  
  // API routes with smart caching
  apiSmart: 'public, s-maxage=300, stale-while-revalidate=600, stale-if-error=1800',
  
  // Real-time data
  realtime: 'no-cache, no-store, must-revalidate, max-age=0',
  
  // Private/authenticated content
  private: 'private, no-cache, no-store, must-revalidate, max-age=0',
};

// Enhanced security headers
const ENHANCED_SECURITY_HEADERS = {
  // Modern HSTS with preload
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  
  // Enhanced XSS Protection
  'X-XSS-Protection': '1; mode=block',
  
  // Content Type Options
  'X-Content-Type-Options': 'nosniff',
  
  // Frame Options
  'X-Frame-Options': 'DENY',
  
  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Modern Permissions Policy
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
    'ambient-light-sensor=()',
    'autoplay=()',
    'encrypted-media=()',
    'fullscreen=()',
    'picture-in-picture=()',
  ].join(', '),
  
  // Cross-Origin Policies for enhanced security
  'Cross-Origin-Embedder-Policy': 'credentialless',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'cross-origin',
  
  // Additional modern security headers
  'X-Permitted-Cross-Domain-Policies': 'none',
  'X-Download-Options': 'noopen',
  'X-Robots-Tag': 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
};

// Performance optimization headers
const PERFORMANCE_HEADERS = {
  // Resource hints for critical resources
  'Link': [
    '</fonts/inter-var.woff2>; rel=preload; as=font; type=font/woff2; crossorigin',
    '</api/critical-data>; rel=prefetch',
    '<https://fonts.googleapis.com>; rel=preconnect; crossorigin',
    '<https://vitals.vercel-insights.com>; rel=preconnect',
  ].join(', '),
  
  // DNS prefetch control
  'X-DNS-Prefetch-Control': 'on',
  
  // Early hints support
  'Accept-CH': 'DPR, Viewport-Width, Width, Save-Data, Sec-CH-UA, Sec-CH-UA-Mobile, Sec-CH-UA-Platform',
  
  // Compression preferences
  'Vary': 'Accept-Encoding, Accept, User-Agent, Save-Data',
};

// Edge-compatible rate limiting (using Map for simplicity)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Enhanced bot detection patterns
const BOT_PATTERNS = [
  /bot|crawler|spider|crawling|facebook|twitter|whatsapp|linkedin/i,
  /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot/i,
  /facebookexternalhit|twitterbot|linkedinbot|telegrambot|whatsapp/i,
  /curl|wget|python-requests|axios|fetch|node-fetch/i,
];

// Suspicious request patterns
const SUSPICIOUS_PATTERNS = [
  /\.\./,  // Directory traversal
  /<script/i,  // XSS attempts
  /union.*select/i,  // SQL injection
  /eval\s*\(/i,  // Code injection
  /\/etc\/passwd/i,  // System file access
  /cmd\.exe|powershell/i,  // Command injection
];

// IP geolocation data for enhanced security
const HIGH_RISK_COUNTRIES = new Set<string>([
  // This would be populated with actual country codes based on security policy
  // Example: 'XX', 'YY', 'ZZ'
]);

interface RequestMetrics {
  timestamp: number;
  responseTime: number;
  statusCode: number;
  bytes: number;
  cached: boolean;
  bot: boolean;
  suspicious: boolean;
  country?: string;
}

// In-memory metrics storage (in production, use Redis or similar)
const metricsBuffer: RequestMetrics[] = [];

export async function middleware(request: NextRequest) {
  const startTime = Date.now();
  const { pathname, search } = request.nextUrl;
  const userAgent = request.headers.get('user-agent') || '';
  const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const country = request.geo?.country || 'unknown';
  
  // Handle static assets for Cloudflare Workers
  if (pathname.startsWith('/images/') || pathname.startsWith('/_next/static/') || 
      pathname === '/favicon.ico' || pathname === '/robots.txt' || pathname === '/sitemap.xml') {
    
    // Check if we're in Cloudflare Workers environment
    const env = (globalThis as any).process?.env || (globalThis as any);
    
    // Try to handle static asset
    try {
      const staticResponse = await handleStaticAsset(request, env);
      if (staticResponse) {
        return staticResponse;
      }
    } catch (error) {
      console.error('Error serving static asset:', error);
    }
    
    // If static asset handling fails, continue with normal processing
    // This allows fallback to Next.js static serving in development
  }
  
  // Create response object
  const response = NextResponse.next();
  
  // Enhanced bot detection
  const isBot = BOT_PATTERNS.some(pattern => pattern.test(userAgent));
  
  // Suspicious request detection
  const isSuspicious = SUSPICIOUS_PATTERNS.some(pattern => 
    pattern.test(pathname + search) || pattern.test(userAgent)
  );
  
  // Rate limiting with enhanced logic
  const rateLimitResult = checkRateLimit(clientIP, isBot, isSuspicious);
  if (!rateLimitResult.allowed) {
    return new NextResponse('Rate limit exceeded', { 
      status: 429,
      headers: {
        'X-RateLimit-Limit': rateLimitResult.limit.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
        'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
      }
    });
  }
  
  // Enhanced security headers with CSP
  const environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';
  const securityHeaders = getSecurityHeaders(environment);
  
  Object.entries(securityHeaders).forEach(([key, value]) => {
    if (value) response.headers.set(key, value);
  });
  
  // Legacy security headers for compatibility
  Object.entries(ENHANCED_SECURITY_HEADERS).forEach(([key, value]) => {
    if (!securityHeaders[key as keyof typeof securityHeaders]) {
      response.headers.set(key, value);
    }
  });
  
  // Performance headers
  Object.entries(PERFORMANCE_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  
  // Enhanced caching strategy
  applyCachingStrategy(request, response, pathname, isBot);
  
  // Content optimization based on client capabilities
  applyContentOptimization(request, response, userAgent);
  
  // Advanced security monitoring
  const securityEvents = analyzeRequest(request);
  if (securityEvents.length > 0) {
    const criticalEvents = securityEvents.filter(e => e.severity === 'critical' || e.severity === 'high');
    if (criticalEvents.length > 0) {
      // Block critical threats
      return new NextResponse('Request blocked for security reasons', { 
        status: 403,
        headers: {
          'X-Security-Block': 'true',
          'X-Security-Reason': criticalEvents[0].type
        }
      });
    }
    response.headers.set('X-Security-Events', securityEvents.length.toString());
  }
  
  // GDPR compliance check
  const gdprApplicable = isGDPRApplicable(request);
  if (gdprApplicable) {
    response.headers.set('X-GDPR-Applicable', 'true');
  }
  
  // Security monitoring
  applySecurityMonitoring(request, response, isSuspicious, country);
  
  // A/B testing and feature flags
  applyFeatureFlags(request, response);
  
  // Performance monitoring
  applyPerformanceMonitoring(request, response, startTime, isBot, isSuspicious);
  
  return response;
}

function checkRateLimit(
  clientIP: string, 
  isBot: boolean, 
  isSuspicious: boolean
): { allowed: boolean; limit: number; resetTime: number } {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const key = clientIP;
  
  // Different limits based on request type
  let maxRequests = 100; // Default for regular users
  
  if (isBot) {
    maxRequests = 50; // Lower limit for bots
  }
  
  if (isSuspicious) {
    maxRequests = 10; // Very low limit for suspicious requests
  }
  
  const current = rateLimitMap.get(key);
  const resetTime = now + windowMs;
  
  if (!current || now > current.resetTime) {
    // Reset window
    rateLimitMap.set(key, { count: 1, resetTime });
    return { allowed: true, limit: maxRequests, resetTime };
  }
  
  if (current.count >= maxRequests) {
    return { allowed: false, limit: maxRequests, resetTime: current.resetTime };
  }
  
  // Increment count
  current.count++;
  rateLimitMap.set(key, current);
  
  return { allowed: true, limit: maxRequests, resetTime: current.resetTime };
}

function applyCachingStrategy(
  request: NextRequest,
  response: NextResponse,
  pathname: string,
  isBot: boolean
): void {
  // Static assets with enhanced caching
  if (pathname.match(/\.(js|css|woff2?|ttf|otf|ico|png|jpg|jpeg|gif|svg|webp|avif)$/)) {
    // Check if versioned (contains hash)
    const isVersioned = pathname.match(/\.[a-f0-9]{8,}\.(js|css)$/) || 
                       pathname.includes('/_next/static/');
    
    response.headers.set(
      'Cache-Control', 
      isVersioned ? ENHANCED_CACHE_CONTROL.staticVersioned : ENHANCED_CACHE_CONTROL.staticUnversioned
    );
    
    // Add CORS for fonts
    if (pathname.match(/\.(woff2?|ttf|otf)$/)) {
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
    }
    
    // Add immutable for versioned assets
    if (isVersioned) {
      response.headers.set('Cache-Control', ENHANCED_CACHE_CONTROL.staticVersioned);
    }
  }
  
  // HTML pages with smart caching
  else if (!pathname.startsWith('/api/') && !pathname.startsWith('/_next/')) {
    // Different caching for bots vs users
    if (isBot) {
      // More aggressive caching for bots
      response.headers.set('Cache-Control', 'public, s-maxage=3600, max-age=3600');
    } else {
      // Smart caching for users
      response.headers.set('Cache-Control', ENHANCED_CACHE_CONTROL.dynamic);
    }
    
    // Add ETag for conditional requests
    const etag = `"${Date.now().toString(36)}"`;
    response.headers.set('ETag', etag);
  }
  
  // API routes with intelligent caching
  else if (pathname.startsWith('/api/')) {
    if (pathname.includes('/api/notion/') || pathname.includes('/api/blog/')) {
      response.headers.set('Cache-Control', ENHANCED_CACHE_CONTROL.apiSmart);
    } else if (pathname.includes('/api/contact') || pathname.includes('/api/auth/')) {
      response.headers.set('Cache-Control', ENHANCED_CACHE_CONTROL.private);
    } else if (pathname.includes('/api/analytics/') || pathname.includes('/api/metrics/')) {
      response.headers.set('Cache-Control', ENHANCED_CACHE_CONTROL.realtime);
    } else {
      response.headers.set('Cache-Control', ENHANCED_CACHE_CONTROL.dynamic);
    }
    
    // CORS for API routes if needed
    if (process.env.NODE_ENV === 'development') {
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }
  }
}

function applyContentOptimization(
  request: NextRequest,
  response: NextResponse,
  userAgent: string
): void {
  // Device detection
  const isMobile = /mobile/i.test(userAgent);
  const isTablet = /tablet|ipad/i.test(userAgent);
  const isOldBrowser = /msie|trident/i.test(userAgent);
  
  // Set device type header
  if (isMobile) {
    response.headers.set('X-Device-Type', 'mobile');
  } else if (isTablet) {
    response.headers.set('X-Device-Type', 'tablet');
  } else {
    response.headers.set('X-Device-Type', 'desktop');
  }
  
  // Save-Data support
  const saveData = request.headers.get('save-data') === 'on';
  if (saveData) {
    response.headers.set('X-Save-Data', 'enabled');
  }
  
  // Modern browser features
  if (!isOldBrowser) {
    response.headers.set('X-Modern-Browser', 'true');
  }
  
  // Content hints
  const acceptWebP = request.headers.get('accept')?.includes('image/webp');
  const acceptAVIF = request.headers.get('accept')?.includes('image/avif');
  
  if (acceptAVIF) {
    response.headers.set('X-Supports-AVIF', 'true');
  } else if (acceptWebP) {
    response.headers.set('X-Supports-WebP', 'true');
  }
}

function applySecurityMonitoring(
  request: NextRequest,
  response: NextResponse,
  isSuspicious: boolean,
  country: string
): void {
  // Enhanced security headers
  if (isSuspicious) {
    response.headers.set('X-Security-Alert', 'suspicious-request');
  }
  
  // Country-based security
  if (HIGH_RISK_COUNTRIES.has(country)) {
    response.headers.set('X-Security-Country-Risk', 'high');
  }
  
  // Add security monitoring headers
  response.headers.set('X-Security-Timestamp', Date.now().toString());
  response.headers.set('X-Request-ID', generateRequestId());
  
  // CSP nonce for dynamic content
  const nonce = generateNonce();
  response.headers.set('X-CSP-Nonce', nonce);
}

function applyFeatureFlags(
  request: NextRequest,
  response: NextResponse
): void {
  // A/B testing buckets
  const bucket = request.cookies.get('ab-bucket')?.value;
  if (!bucket) {
    const newBucket = Math.random() < 0.5 ? 'a' : 'b';
    response.cookies.set('ab-bucket', newBucket, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    response.headers.set('X-AB-Bucket', newBucket);
  } else {
    response.headers.set('X-AB-Bucket', bucket);
  }
  
  // Feature flags based on environment
  const isProduction = process.env.NODE_ENV === 'production';
  response.headers.set('X-Feature-Analytics', isProduction ? 'enabled' : 'disabled');
  response.headers.set('X-Feature-PWA', 'enabled');
  response.headers.set('X-Feature-WebVitals', 'enabled');
}

function applyPerformanceMonitoring(
  request: NextRequest,
  response: NextResponse,
  startTime: number,
  isBot: boolean,
  isSuspicious: boolean
): void {
  const responseTime = Date.now() - startTime;
  
  // Performance headers
  response.headers.set('X-Response-Time', `${responseTime}ms`);
  response.headers.set('X-Edge-Location', process.env.VERCEL_REGION || 'unknown');
  
  // Server timing API
  const serverTiming = [
    `edge;dur=${responseTime};desc="Edge processing time"`,
    `cache;dur=0;desc="Cache lookup time"`,
  ];
  
  response.headers.set('Server-Timing', serverTiming.join(', '));
  
  // Collect metrics
  const metrics: RequestMetrics = {
    timestamp: startTime,
    responseTime,
    statusCode: response.status,
    bytes: 0, // Would be populated in a real implementation
    cached: false, // Would be determined by cache status
    bot: isBot,
    suspicious: isSuspicious,
    country: request.geo?.country,
  };
  
  // Store metrics (in production, send to analytics service)
  metricsBuffer.push(metrics);
  
  // Keep buffer size manageable
  if (metricsBuffer.length > 1000) {
    metricsBuffer.splice(0, 100);
  }
  
  // Log slow requests
  if (responseTime > 1000) {
    console.warn(`[Slow Request] ${request.nextUrl.pathname}: ${responseTime}ms`);
  }
}

// Utility functions
function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
}

function generateNonce(): string {
  const array = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Fallback for environments without crypto
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Clean up rate limit map periodically
if (typeof globalThis !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    rateLimitMap.forEach((value, key) => {
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    });
  }, 5 * 60 * 1000); // Every 5 minutes
}

// Configure which routes use the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)  
     * - favicon.ico (favicon file)
     * - robots.txt (robots file)
     * - sitemap.xml (sitemap file)
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
