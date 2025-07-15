import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  // Enable R2 incremental cache when ready
  // incrementalCache: r2IncrementalCache,
  
  override: {
    wrapper: "cloudflare-static-assets",
  },
});
