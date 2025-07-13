/**
 * Advanced Security Headers Configuration
 * Implements comprehensive security policies for the application
 */

// Content Security Policy directives
export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-eval'", // Required for Next.js development
    "'unsafe-inline'", // Required for Next.js hydration
    '*.googletagmanager.com',
    '*.google-analytics.com',
    '*.vercel-insights.com',
    'vitals.vercel-insights.com',
    'https://va.vercel-scripts.com',
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for styled-jsx and inline styles
    'fonts.googleapis.com',
  ],
  'img-src': [
    "'self'",
    'blob:',
    'data:',
    'images.pexels.com',
    'images.unsplash.com',
    'prod-files-secure.s3.us-west-2.amazonaws.com', // Notion images
    '*.google-analytics.com',
    '*.googletagmanager.com',
  ],
  'font-src': [
    "'self'",
    'fonts.googleapis.com',
    'fonts.gstatic.com',
  ],
  'connect-src': [
    "'self'",
    '*.google-analytics.com',
    'vitals.vercel-insights.com',
    '*.vercel.com',
    'api.resend.com',
    'https://va.vercel-scripts.com',
  ],
  'frame-src': ["'self'"],
  'media-src': ["'self'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': [],
  'block-all-mixed-content': [],
} as const;

// Convert CSP directives to string
export const generateCSP = (
  directives: typeof CSP_DIRECTIVES = CSP_DIRECTIVES
): string => {
  return Object.entries(directives)
    .map(([key, values]) => {
      if (values.length === 0) return key;
      return `${key} ${values.join(' ')}`;
    })
    .join('; ');
};

// Comprehensive security headers
export const SECURITY_HEADERS = [
  {
    key: 'Content-Security-Policy',
    value: generateCSP(),
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'browsing-topics=()',
      'payment=()',
      'usb=()',
      'accelerometer=()',
      'gyroscope=()',
      'magnetometer=()',
      'midi=()',
      'sync-xhr=()',
      'screen-wake-lock=()',
      'ambient-light-sensor=()',
      'speaker-selection=()',
    ].join(', '),
  },
  {
    key: 'X-Permitted-Cross-Domain-Policies',
    value: 'none',
  },
  {
    key: 'Cross-Origin-Embedder-Policy',
    value: 'require-corp',
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin',
  },
  {
    key: 'Cross-Origin-Resource-Policy',
    value: 'same-origin',
  },
];

// Report-Only CSP for testing
export const CSP_REPORT_ONLY_DIRECTIVES = {
  ...CSP_DIRECTIVES,
  'report-uri': ['/api/csp-report'],
  'report-to': ['csp-endpoint'],
};

// Report-To header configuration
export const REPORT_TO_CONFIG = {
  group: 'csp-endpoint',
  max_age: 10886400,
  endpoints: [
    {
      url: '/api/csp-report',
    },
  ],
};

// Security headers for API routes
export const API_SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'no-referrer',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',
};

// CORS configuration for API routes
export const CORS_CONFIG = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://containercode.com', 'https://www.containercode.com']
    : ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400, // 24 hours
};

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
};

// Security middleware helpers
export const applySecurityHeaders = (
  response: Response,
  headers: Array<{ key: string; value: string }> = SECURITY_HEADERS
): Response => {
  const newHeaders = new Headers(response.headers);
  
  headers.forEach(({ key, value }) => {
    newHeaders.set(key, value);
  });
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
};

// Nonce generation for inline scripts
export const generateNonce = (): string => {
  return Buffer.from(crypto.randomUUID()).toString('base64');
};

// Update CSP with nonce
export const updateCSPWithNonce = (csp: string, nonce: string): string => {
  return csp.replace(
    "'unsafe-inline'",
    `'unsafe-inline' 'nonce-${nonce}'`
  );
};