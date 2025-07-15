
interface RateLimitConfig {
  interval: number;
  uniqueTokenPerInterval: number;
}

class RateLimiter {
  private config: RateLimitConfig;
  private hits: Map<string, number[]> = new Map();

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  async check(identifier: string, limit: number, window: string): Promise<void> {
    const now = Date.now();
    const windowMs = this.parseWindow(window);
    
    if (!this.hits.has(identifier)) {
      this.hits.set(identifier, []);
    }
    
    const userHits = this.hits.get(identifier)!;
    
    // Remove old hits outside the window
    const validHits = userHits.filter(hit => now - hit < windowMs);
    
    if (validHits.length >= limit) {
      throw new Error('Rate limit exceeded');
    }
    
    validHits.push(now);
    this.hits.set(identifier, validHits);
  }

  private parseWindow(window: string): number {
    const match = window.match(/(\d+)\s*(s|m|h|d)/);
    if (!match) return 60000; // Default to 1 minute
    
    const value = parseInt(match[1]);
    const unit = match[2];
    
    switch (unit) {
      case 's': return value * 1000;
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      default: return value * 1000;
    }
  }
}

export const rateLimit = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 unique tokens per interval
});
