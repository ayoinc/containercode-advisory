import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // Enable R2 incremental cache when ready
  // incrementalCache: r2IncrementalCache,
  
  // Cloudflare Pages compatibility fixes
  experimental: {
    // Use npm instead of bun for compatibility
    packageManager: 'npm',
    // Disable turbopack for compatibility
    turbo: false,
  },
  
  // Ensure proper module resolution
  webpack: (config, { dev, isServer }) => {
    // Fix module resolution issues on Cloudflare
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    return config;
  },
});
