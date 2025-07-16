/** @type {import('next').NextConfig} */

// Performance and bundle analysis - conditional import
const withBundleAnalyzer = process.env.ANALYZE === 'true' 
  ? require('@next/bundle-analyzer')({ enabled: true })
  : (config) => config;

// PWA Configuration
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/middleware-manifest.json$/],
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    // Optimized caching for static assets
    {
      urlPattern: /\/_next\/static\/.*/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
    // API routes with network-first strategy
    {
      urlPattern: /\/api\/.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // 5 minutes
        },
      },
    },
  ],
});

// Enhanced Content Security Policy
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.googletagmanager.com *.google-analytics.com *.vercel-insights.com vitals.vercel-insights.com;
  style-src 'self' 'unsafe-inline' fonts.googleapis.com;
  img-src 'self' blob: data: images.pexels.com images.unsplash.com prod-files-secure.s3.us-west-2.amazonaws.com *.google-analytics.com;
  font-src 'self' fonts.googleapis.com fonts.gstatic.com;
  connect-src 'self' *.google-analytics.com vitals.vercel-insights.com *.vercel.com api.resend.com;
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
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    // React optimization
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
  
  // Advanced image optimization - optimized for OpenNext/Cloudflare
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
    formats: ['image/webp', 'image/avif'], // Enable modern formats for Cloudflare
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days for production
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // OpenNext/Cloudflare optimized settings
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Enable optimization for OpenNext deployment
    unoptimized: false,
    loader: 'default',
  },

  // Experimental features for better performance
  experimental: {
    serverComponentsExternalPackages: [
      '@notionhq/client',
      'pexels',
    ],
    optimizeCss: true,
    typedRoutes: true,
    // Advanced experimental features
    webVitalsAttribution: ['CLS', 'LCP', 'FCP', 'FID', 'TTFB', 'INP'],
    optimizePackageImports: ['lucide-react', 'framer-motion', '@radix-ui/react-dialog', '@nextui-org/react'],
    // Edge runtime optimization
    serverMinification: true,
    // Enhanced tree shaking
    esmExternals: true,
    // Turbopack for faster builds
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // Bundle optimization
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle in production
    if (!dev && !isServer) {
      // Enhanced code splitting configuration
      config.optimization.splitChunks = {
        chunks: 'all',
        maxAsyncRequests: 30,
        maxInitialRequests: 20, // Further reduced for better performance
        minSize: 40000, // Increased for better bundle consolidation
        maxSize: 250000, // Reduced max size for better loading
        cacheGroups: {
          // React framework bundle
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            enforce: true,
          },
          // Framer Motion (large library)
          'framer-motion': {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            priority: 35,
            enforce: true,
            chunks: 'async', // Load framer-motion asynchronously
          },
          // NextUI components
          nextui: {
            test: /[\\/]node_modules[\\/]@nextui-org[\\/]/,
            name: 'nextui',
            priority: 35,
            enforce: true,
            chunks: 'async',
          },
          // Radix UI components
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
            name: 'radix-ui',
            priority: 35,
            enforce: true,
          },
          // Lucide icons
          lucide: {
            test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
            name: 'lucide-react',
            priority: 33,
            enforce: true,
          },
          // Other libraries
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const match = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
              if (!match) return 'lib';
              const packageName = match[1];
              return `npm.${packageName.replace('@', '')}`;
            },
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
            maxSize: 300000, // Split large vendor chunks
          },
          // Commons for shared code
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
            maxSize: 250000,
          },
        },
      };
      
      // Module concatenation for smaller bundles
      config.optimization.concatenateModules = true;
      
      // Better tree shaking
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      
      // Add dynamic imports analysis
      config.optimization.mangleExports = 'size';
    }
    
    // Enhanced performance hints
    config.performance = {
      hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
      maxEntrypointSize: 400000, // Reduced from 512000
      maxAssetSize: 400000, // Reduced from 512000
    };
    
    return config;
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

// Apply configurations with PWA and Bundle Analyzer
const finalConfig = withPWA(withBundleAnalyzer(nextConfig));

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