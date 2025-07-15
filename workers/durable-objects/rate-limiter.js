/**
 * Rate Limiter Durable Object
 * Distributed rate limiting for API calls across multiple workers
 * Supports sliding window, token bucket, and fixed window algorithms
 */

export class RateLimiter {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.storage = state.storage;
    this.initPromise = this.initialize();
  }

  async initialize() {
    // Initialize rate limiter config if not exists
    const config = await this.storage.get('config');
    if (!config) {
      await this.storage.put('config', {
        algorithm: 'sliding_window', // sliding_window, token_bucket, fixed_window
        windowSize: 60000, // 1 minute window
        maxRequests: 100,
        refillRate: 1, // tokens per second for token bucket
        burstCapacity: 10, // max burst for token bucket
        createdAt: new Date().toISOString()
      });
    }

    // Initialize counters
    const counters = await this.storage.get('counters');
    if (!counters) {
      await this.storage.put('counters', {
        current: 0,
        windowStart: Date.now(),
        tokens: 0,
        lastRefill: Date.now(),
        requests: []
      });
    }
  }

  /**
   * Check if request is allowed based on rate limiting rules
   */
  async checkRateLimit(identifier = 'default', cost = 1) {
    await this.initPromise;
    
    const config = await this.storage.get('config');
    const key = `counters_${identifier}`;
    
    let counters = await this.storage.get(key);
    if (!counters) {
      counters = {
        current: 0,
        windowStart: Date.now(),
        tokens: config.maxRequests,
        lastRefill: Date.now(),
        requests: []
      };
    }

    const now = Date.now();
    let allowed = false;

    switch (config.algorithm) {
      case 'sliding_window':
        allowed = await this.slidingWindowCheck(counters, config, now, cost);
        break;
      case 'token_bucket':
        allowed = await this.tokenBucketCheck(counters, config, now, cost);
        break;
      case 'fixed_window':
        allowed = await this.fixedWindowCheck(counters, config, now, cost);
        break;
      default:
        throw new Error(`Unknown rate limiting algorithm: ${config.algorithm}`);
    }

    // Update counters
    await this.storage.put(key, counters);

    // Log request
    await this.logRequest(identifier, allowed, cost, now);

    return {
      allowed,
      remaining: this.getRemainingRequests(counters, config),
      resetTime: this.getResetTime(counters, config),
      retryAfter: allowed ? null : this.getRetryAfter(counters, config)
    };
  }

  /**
   * Sliding window rate limiting
   */
  async slidingWindowCheck(counters, config, now, cost) {
    const windowStart = now - config.windowSize;
    
    // Remove old requests
    counters.requests = counters.requests.filter(req => req.timestamp > windowStart);
    
    // Calculate current usage
    const currentUsage = counters.requests.reduce((sum, req) => sum + req.cost, 0);
    
    if (currentUsage + cost <= config.maxRequests) {
      counters.requests.push({
        timestamp: now,
        cost
      });
      return true;
    }
    
    return false;
  }

  /**
   * Token bucket rate limiting
   */
  async tokenBucketCheck(counters, config, now, cost) {
    // Refill tokens
    const timeSinceLastRefill = now - counters.lastRefill;
    const tokensToAdd = (timeSinceLastRefill / 1000) * config.refillRate;
    
    counters.tokens = Math.min(
      config.burstCapacity,
      counters.tokens + tokensToAdd
    );
    counters.lastRefill = now;
    
    // Check if we have enough tokens
    if (counters.tokens >= cost) {
      counters.tokens -= cost;
      return true;
    }
    
    return false;
  }

  /**
   * Fixed window rate limiting
   */
  async fixedWindowCheck(counters, config, now, cost) {
    // Check if we're in a new window
    if (now - counters.windowStart >= config.windowSize) {
      counters.windowStart = now;
      counters.current = 0;
    }
    
    // Check if request is allowed
    if (counters.current + cost <= config.maxRequests) {
      counters.current += cost;
      return true;
    }
    
    return false;
  }

  /**
   * Get remaining requests for current window
   */
  getRemainingRequests(counters, config) {
    switch (config.algorithm) {
      case 'sliding_window':
        const currentUsage = counters.requests.reduce((sum, req) => sum + req.cost, 0);
        return Math.max(0, config.maxRequests - currentUsage);
      case 'token_bucket':
        return Math.floor(counters.tokens);
      case 'fixed_window':
        return Math.max(0, config.maxRequests - counters.current);
      default:
        return 0;
    }
  }

  /**
   * Get reset time for current window
   */
  getResetTime(counters, config) {
    switch (config.algorithm) {
      case 'sliding_window':
        if (counters.requests.length === 0) return Date.now();
        const oldestRequest = Math.min(...counters.requests.map(req => req.timestamp));
        return oldestRequest + config.windowSize;
      case 'token_bucket':
        const timeToFull = (config.burstCapacity - counters.tokens) / config.refillRate * 1000;
        return Date.now() + timeToFull;
      case 'fixed_window':
        return counters.windowStart + config.windowSize;
      default:
        return Date.now();
    }
  }

  /**
   * Get retry after time in seconds
   */
  getRetryAfter(counters, config) {
    const resetTime = this.getResetTime(counters, config);
    return Math.ceil((resetTime - Date.now()) / 1000);
  }

  /**
   * Log request for analytics
   */
  async logRequest(identifier, allowed, cost, timestamp) {
    const logEntry = {
      identifier,
      allowed,
      cost,
      timestamp: new Date(timestamp).toISOString()
    };

    // Get current logs
    const logs = await this.storage.get('requestLogs') || [];
    logs.push(logEntry);

    // Keep only last 1000 logs
    if (logs.length > 1000) {
      logs.splice(0, logs.length - 1000);
    }

    await this.storage.put('requestLogs', logs);

    // Send to analytics if configured
    if (this.env.ANALYTICS) {
      await this.env.ANALYTICS.writeDataPoint({
        blobs: [identifier, allowed ? 'allowed' : 'denied'],
        doubles: [cost],
        indexes: [new Date(timestamp).toISOString()]
      });
    }
  }

  /**
   * Update rate limiter configuration
   */
  async updateConfig(newConfig) {
    await this.initPromise;
    
    const currentConfig = await this.storage.get('config');
    const updatedConfig = {
      ...currentConfig,
      ...newConfig,
      updatedAt: new Date().toISOString()
    };

    await this.storage.put('config', updatedConfig);
    
    // Reset counters if algorithm changed
    if (newConfig.algorithm && newConfig.algorithm !== currentConfig.algorithm) {
      await this.resetCounters();
    }
    
    return updatedConfig;
  }

  /**
   * Reset all counters
   */
  async resetCounters() {
    await this.initPromise;
    
    const config = await this.storage.get('config');
    const resetCounters = {
      current: 0,
      windowStart: Date.now(),
      tokens: config.maxRequests,
      lastRefill: Date.now(),
      requests: []
    };

    // Reset default counters
    await this.storage.put('counters', resetCounters);

    // Reset all identifier-specific counters
    const list = await this.storage.list({ prefix: 'counters_' });
    for (const key of list.keys()) {
      await this.storage.put(key.name, resetCounters);
    }
  }

  /**
   * Get rate limiter statistics
   */
  async getStatistics(identifier = null) {
    await this.initPromise;
    
    const config = await this.storage.get('config');
    const logs = await this.storage.get('requestLogs') || [];
    
    // Filter logs by identifier if specified
    const filteredLogs = identifier 
      ? logs.filter(log => log.identifier === identifier)
      : logs;

    const now = Date.now();
    const oneHourAgo = now - (60 * 60 * 1000);
    const recentLogs = filteredLogs.filter(log => 
      new Date(log.timestamp).getTime() > oneHourAgo
    );

    const stats = {
      config,
      totalRequests: filteredLogs.length,
      recentRequests: recentLogs.length,
      allowedRequests: recentLogs.filter(log => log.allowed).length,
      deniedRequests: recentLogs.filter(log => !log.allowed).length,
      averageRequestsPerMinute: recentLogs.length / 60,
      denialRate: recentLogs.length > 0 
        ? recentLogs.filter(log => !log.allowed).length / recentLogs.length 
        : 0
    };

    if (identifier) {
      const key = `counters_${identifier}`;
      const counters = await this.storage.get(key);
      if (counters) {
        stats.remaining = this.getRemainingRequests(counters, config);
        stats.resetTime = this.getResetTime(counters, config);
      }
    }

    return stats;
  }

  /**
   * Get all active identifiers
   */
  async getActiveIdentifiers() {
    await this.initPromise;
    
    const list = await this.storage.list({ prefix: 'counters_' });
    const identifiers = [];
    
    for (const key of list.keys()) {
      const identifier = key.name.replace('counters_', '');
      const counters = await this.storage.get(key.name);
      
      identifiers.push({
        identifier,
        remaining: this.getRemainingRequests(counters, await this.storage.get('config')),
        lastActivity: counters.lastRefill || counters.windowStart
      });
    }
    
    return identifiers;
  }

  /**
   * Clean up old data
   */
  async cleanup() {
    await this.initPromise;
    
    const config = await this.storage.get('config');
    const now = Date.now();
    
    // Clean up old request logs
    const logs = await this.storage.get('requestLogs') || [];
    const cutoff = now - (24 * 60 * 60 * 1000); // 24 hours
    const filteredLogs = logs.filter(log => 
      new Date(log.timestamp).getTime() > cutoff
    );
    
    if (filteredLogs.length !== logs.length) {
      await this.storage.put('requestLogs', filteredLogs);
    }
    
    // Clean up old counters
    const list = await this.storage.list({ prefix: 'counters_' });
    for (const key of list.keys()) {
      const counters = await this.storage.get(key.name);
      const lastActivity = counters.lastRefill || counters.windowStart;
      
      // Remove counters inactive for more than 1 hour
      if (now - lastActivity > 60 * 60 * 1000) {
        await this.storage.delete(key.name);
      }
    }
  }

  /**
   * WebSocket handler for real-time rate limiting monitoring
   */
  async handleWebSocket(webSocket) {
    await this.initPromise;
    
    webSocket.accept();
    
    // Send current configuration
    const config = await this.storage.get('config');
    webSocket.send(JSON.stringify({
      type: 'config',
      data: config
    }));
    
    // Send current statistics
    const stats = await this.getStatistics();
    webSocket.send(JSON.stringify({
      type: 'statistics',
      data: stats
    }));
    
    // Set up periodic updates
    const interval = setInterval(async () => {
      const currentStats = await this.getStatistics();
      webSocket.send(JSON.stringify({
        type: 'statistics_update',
        data: currentStats
      }));
    }, 5000);
    
    webSocket.addEventListener('close', () => {
      clearInterval(interval);
    });
  }

  /**
   * Handle alarm for periodic cleanup
   */
  async alarm() {
    await this.cleanup();
    
    // Schedule next cleanup in 1 hour
    await this.storage.setAlarm(Date.now() + 60 * 60 * 1000);
  }
}

export default RateLimiter;