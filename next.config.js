/** @type {import('next').NextConfig} */

// Content Security Policy
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googletagmanager.com *.google-analytics.com;
  style-src 'self' 'unsafe-inline' fonts.googleapis.com;
  img-src 'self' blob: data: images.pexels.com images.unsplash.com prod-files-secure.s3.us-west-2.amazonaws.com *.google-analytics.com;
  font-src 'self' fonts.googleapis.com fonts.gstatic.com;
  connect-src 'self' *.google-analytics.com vitals.vercel-insights.com;
  frame-src 'self';
`;

// Security headers
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
];

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'images.pexels.com',
      'images.unsplash.com',
      'prod-files-secure.s3.us-west-2.amazonaws.com', // Notion images
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
  },
  experimental: {
    serverComponentsExternalPackages: [
      '@notionhq/client',
      'pexels',
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;