/**
 * Content Security Policy (CSP) Configuration
 * Advanced security headers and CSP policies
 */

export interface CSPDirectives {
  'default-src'?: string[];
  'script-src'?: string[];
  'style-src'?: string[];
  'img-src'?: string[];
  'font-src'?: string[];
  'connect-src'?: string[];
  'media-src'?: string[];
  'object-src'?: string[];
  'child-src'?: string[];
  'worker-src'?: string[];
  'frame-src'?: string[];
  'form-action'?: string[];
  'base-uri'?: string[];
  'manifest-src'?: string[];
  'upgrade-insecure-requests'?: boolean;
  'block-all-mixed-content'?: boolean;
}

export interface SecurityHeaders {
  'Content-Security-Policy'?: string;
  'X-Content-Type-Options'?: string;
  'X-Frame-Options'?: string;
  'X-XSS-Protection'?: string;
  'Referrer-Policy'?: string;
  'Permissions-Policy'?: string;
  'Strict-Transport-Security'?: string;
  'X-DNS-Prefetch-Control'?: string;
  'Cross-Origin-Embedder-Policy'?: string;
  'Cross-Origin-Opener-Policy'?: string;
  'Cross-Origin-Resource-Policy'?: string;
}

class SecurityPolicyBuilder {
  private environment: 'development' | 'staging' | 'production';
  private nonce?: string;

  constructor(environment: 'development' | 'staging' | 'production' = 'production') {
    this.environment = environment;
  }

  setNonce(nonce: string): this {
    this.nonce = nonce;
    return this;
  }

  // Build CSP directives based on environment
  buildCSPDirectives(): CSPDirectives {
    const isDevelopment = this.environment === 'development';
    const isProduction = this.environment === 'production';

    const directives: CSPDirectives = {
      'default-src': ["'self'"],
      
      'script-src': [
        "'self'",
        ...(this.nonce ? [`'nonce-${this.nonce}'`] : []),
        "'unsafe-inline'", // For Next.js runtime
        "'unsafe-eval'", // For development and some libraries
        'https://www.googletagmanager.com',
        'https://www.google-analytics.com',
        'https://vercel.live',
        'https://va.vercel-scripts.com',
        ...(isDevelopment ? ["'unsafe-eval'"] : [])
      ],

      'style-src': [
        "'self'",
        "'unsafe-inline'", // For CSS-in-JS and inline styles
        'https://fonts.googleapis.com'
      ],

      'img-src': [
        "'self'",
        'data:',
        'blob:',
        'https:',
        'https://images.unsplash.com',
        'https://www.notion.so',
        'https://prod-files-secure.s3.us-west-2.amazonaws.com',
        'https://www.google-analytics.com',
        'https://www.googletagmanager.com'
      ],

      'font-src': [
        "'self'",
        'data:',
        'https://fonts.gstatic.com'
      ],

      'connect-src': [
        "'self'",
        'https://api.notion.com',
        'https://api.resend.com',
        'https://api.deepseek.com',
        'https://search.brave.com',
        'https://www.google-analytics.com',
        'https://vercel.live',
        'https://va.vercel-scripts.com',
        ...(isDevelopment ? ['ws://localhost:*', 'http://localhost:*'] : [])
      ],

      'media-src': [
        "'self'",
        'data:',
        'blob:',
        'https:'
      ],

      'object-src': ["'none'"],

      'child-src': [
        "'self'",
        'https://www.youtube.com',
        'https://player.vimeo.com'
      ],

      'worker-src': [
        "'self'",
        'blob:'
      ],

      'frame-src': [
        "'self'",
        'https://www.youtube.com',
        'https://player.vimeo.com',
        'https://www.google.com' // For reCAPTCHA if needed
      ],

      'form-action': [
        "'self'"
      ],

      'base-uri': ["'self'"],

      'manifest-src': ["'self'"],

      'upgrade-insecure-requests': isProduction,
      'block-all-mixed-content': isProduction
    };

    return directives;
  }

  // Convert CSP directives to string
  buildCSPString(): string {
    const directives = this.buildCSPDirectives();
    const cspParts: string[] = [];

    Object.entries(directives).forEach(([directive, value]) => {
      if (typeof value === 'boolean') {
        if (value) {
          cspParts.push(directive.replace(/([A-Z])/g, '-$1').toLowerCase());
        }
      } else if (Array.isArray(value) && value.length > 0) {
        const directiveName = directive.replace(/([A-Z])/g, '-$1').toLowerCase();
        cspParts.push(`${directiveName} ${value.join(' ')}`);
      }
    });

    return cspParts.join('; ');
  }

  // Build comprehensive security headers
  buildSecurityHeaders(): SecurityHeaders {
    const isProduction = this.environment === 'production';

    return {
      'Content-Security-Policy': this.buildCSPString(),
      
      'X-Content-Type-Options': 'nosniff',
      
      'X-Frame-Options': 'DENY',
      
      'X-XSS-Protection': '1; mode=block',
      
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      
      'Permissions-Policy': [
        'accelerometer=()',
        'autoplay=()',
        'camera=()',
        'cross-origin-isolated=()',
        'display-capture=()',
        'encrypted-media=()',
        'fullscreen=(self)',
        'geolocation=()',
        'gyroscope=()',
        'keyboard-map=()',
        'magnetometer=()',
        'microphone=()',
        'midi=()',
        'payment=()',
        'picture-in-picture=()',
        'publickey-credentials-get=()',
        'screen-wake-lock=()',
        'sync-xhr=()',
        'usb=()',
        'web-share=()',
        'xr-spatial-tracking=()'
      ].join(', '),
      
      'Strict-Transport-Security': isProduction 
        ? 'max-age=63072000; includeSubDomains; preload'
        : 'max-age=86400',
      
      'X-DNS-Prefetch-Control': 'on',
      
      'Cross-Origin-Embedder-Policy': 'unsafe-none',
      
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      
      'Cross-Origin-Resource-Policy': 'cross-origin'
    };
  }

  // Generate nonce for inline scripts
  static generateNonce(): string {
    return Buffer.from(crypto.getRandomValues(new Uint8Array(16))).toString('base64');
  }

  // Validate CSP directive
  static validateDirective(directive: string, value: string[]): boolean {
    const validDirectives = [
      'default-src', 'script-src', 'style-src', 'img-src', 'font-src',
      'connect-src', 'media-src', 'object-src', 'child-src', 'worker-src',
      'frame-src', 'form-action', 'base-uri', 'manifest-src'
    ];

    if (!validDirectives.includes(directive)) {
      return false;
    }

    // Validate sources
    const validSources = [
      "'self'", "'unsafe-inline'", "'unsafe-eval'", "'none'",
      "'strict-dynamic'", "'unsafe-hashes'"
    ];

    return value.every(source => {
      return validSources.includes(source) ||
             source.startsWith('https://') ||
             source.startsWith('http://') ||
             source.startsWith("'nonce-") ||
             source.startsWith("'sha256-") ||
             source.startsWith("'sha384-") ||
             source.startsWith("'sha512-") ||
             source === 'data:' ||
             source === 'blob:' ||
             source === '*';
    });
  }
}

// Predefined security configurations
export const securityConfigs = {
  development: new SecurityPolicyBuilder('development'),
  staging: new SecurityPolicyBuilder('staging'),
  production: new SecurityPolicyBuilder('production')
};

// Export utility functions
export function getSecurityHeaders(environment: 'development' | 'staging' | 'production' = 'production'): SecurityHeaders {
  return securityConfigs[environment].buildSecurityHeaders();
}

export function getCSPString(environment: 'development' | 'staging' | 'production' = 'production'): string {
  return securityConfigs[environment].buildCSPString();
}

export function generateCSPNonce(): string {
  return SecurityPolicyBuilder.generateNonce();
}

// CSP violation reporting
export interface CSPViolationReport {
  'csp-report': {
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
  };
}

export function buildCSPWithReporting(environment: 'development' | 'staging' | 'production' = 'production', reportUri?: string): string {
  const baseCSP = getCSPString(environment);
  
  if (reportUri) {
    return `${baseCSP}; report-uri ${reportUri}; report-to csp-endpoint`;
  }
  
  return baseCSP;
}

// Report-To header for modern browsers
export function getReportToHeader(): string {
  return JSON.stringify({
    group: 'csp-endpoint',
    max_age: 10886400,
    endpoints: [
      { url: '/api/security/csp-report' }
    ]
  });
}

export { SecurityPolicyBuilder };