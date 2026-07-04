/** @type {import('next').NextConfig} */

// Performance and bundle analysis - conditional import
const withBundleAnalyzer = process.env.ANALYZE === 'true'
  ? require('@next/bundle-analyzer')({ enabled: true })
  : (config) => config;

// Enhanced Content Security Policy
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googletagmanager.com *.google-analytics.com *.vercel-insights.com vitals.vercel-insights.com *.cloudflareinsights.com static.cloudflareinsights.com containercode.club;
  style-src 'self' 'unsafe-inline' fonts.googleapis.com;
  img-src 'self' blob: data: images.pexels.com images.unsplash.com prod-files-secure.s3.us-west-2.amazonaws.com *.google-analytics.com;
  font-src 'self' fonts.googleapis.com fonts.gstatic.com;
  connect-src 'self' *.google-analytics.com vitals.vercel-insights.com *.vercel.com api.resend.com *.cloudflareinsights.com containercode.club;
  frame-src 'self';
  media-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;

// Enhanced security headers
const securityHeaders = [
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
    value: 'SAMEORIGIN',
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
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
  },
  // Additional security headers
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'X-Permitted-Cross-Domain-Policies',
    value: 'none',
  },
  // Edge runtime optimization headers
  {
    key: 'CDN-Cache-Control',
    value: 'public, s-maxage=31536000',
  },
  {
    key: 'Surrogate-Control',
    value: 'max-age=31536000',
  },
];

const nextConfig = {
  // Performance optimizations
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    // React optimization
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },

  // Node packages that must not be bundled by the server compiler (Next 15+)
  serverExternalPackages: ['@notionhq/client', 'pexels'],

  // Typed routes are stable in Next 15+
  typedRoutes: true,
  
  // Advanced image optimization - disabled for Cloudflare Workers compatibility
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com',
        pathname: '**',
      },
    ],
    // Disable Next.js image optimization for Cloudflare Workers
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Experimental features. Bundling/splitting is left to Turbopack (the Next 16
  // default); the old bespoke webpack splitChunks config referenced packages
  // that are no longer used and is unnecessary under Turbopack.
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
    webVitalsAttribution: ['CLS', 'LCP', 'FCP', 'INP', 'TTFB'],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      // Cache static assets
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // Advanced caching and rewrites
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
    ];
  },
  
  // Output configuration for Cloudflare Pages
  output: 'standalone',
  
  // Ensure static files are correctly copied
  trailingSlash: false,
  
  // Compression
  compress: true,
  
  // PoweredBy header removal
  poweredByHeader: false,
  
  // Generate ETags
  generateEtags: true,
  
  // Disable x-powered-by header
  httpAgentOptions: {
    keepAlive: true,
  },
};

// Apply configuration with the (optional) bundle analyzer
const finalConfig = withBundleAnalyzer(nextConfig);

// Initialize OpenNext for Cloudflare development
if (process.env.NODE_ENV === 'development') {
  try {
    const { initOpenNextCloudflareForDev } = require('@opennextjs/cloudflare');
    initOpenNextCloudflareForDev();
  } catch (error) {
    // Silently fail if OpenNext is not available (e.g., during initial npm install)
    console.log('OpenNext not available for dev initialization');
  }
}

module.exports = finalConfig;