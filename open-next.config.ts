import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // Enable R2 incremental cache when ready
  // incrementalCache: r2IncrementalCache,
  
  // Image optimization configuration for Cloudflare
  imageOptimization: {
    // Use Cloudflare Images for optimization
    loader: 'cloudflare',
    // Static image assets configuration
    staticImageOptimization: true,
  },
  
  // Ensure static assets are properly handled
  override: {
    wrapper: 'cloudflare-pages',
  }
});
