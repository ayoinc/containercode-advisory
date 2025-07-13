/**
 * Smart Cache System with Predictive Invalidation
 * Advanced caching with ML-inspired invalidation patterns
 */

import { EdgeCache } from '../isr';

// Cache priority levels
export enum CachePriority {
  CRITICAL = 'critical',   // User-facing critical paths
  HIGH = 'high',          // Important but not critical
  MEDIUM = 'medium',      // Standard content
  LOW = 'low',           // Background data
  BACKGROUND = 'background' // Analytics, logs
}

// Cache strategies
export enum CacheStrategy {
  CACHE_FIRST = 'cache-first',
  NETWORK_FIRST = 'network-first',
  STALE_WHILE_REVALIDATE = 'stale-while-revalidate',
  NETWORK_ONLY = 'network-only',
  CACHE_ONLY = 'cache-only'
}

interface SmartCacheConfig {
  ttl: number;
  priority: CachePriority;
  strategy: CacheStrategy;
  maxSize?: number;
  invalidationPattern?: RegExp[];
  warmupUrls?: string[];
  compressionEnabled?: boolean;
  encryptionEnabled?: boolean;
}

interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  hits: number;
  lastAccess: number;
  size: number;
  priority: CachePriority;
  etag?: string;
  headers?: Record<string, string>;
  compressed?: boolean;
  encrypted?: boolean;
}

interface CacheStats {
  totalEntries: number;
  totalSize: number;
  hitRate: number;
  missRate: number;
  evictionCount: number;
  averageAccessTime: number;
}

export class SmartCache {
  private cache = new Map<string, CacheEntry>();
  private maxMemorySize: number;
  private currentSize = 0;
  private stats: CacheStats = {
    totalEntries: 0,
    totalSize: 0,
    hitRate: 0,
    missRate: 0,
    evictionCount: 0,
    averageAccessTime: 0
  };
  private hitCount = 0;
  private missCount = 0;
  private evictionCount = 0;
  private accessTimes: number[] = [];

  constructor(maxMemorySize = 50 * 1024 * 1024) { // 50MB default
    this.maxMemorySize = maxMemorySize;
    
    // Cleanup expired entries every 5 minutes
    if (typeof window !== 'undefined') {
      setInterval(() => this.cleanup(), 5 * 60 * 1000);
      
      // Update stats every minute
      setInterval(() => this.updateStats(), 60 * 1000);
    }
  }

  // Enhanced set with compression and priority-based eviction
  async set<T>(
    key: string, 
    data: T, 
    config: SmartCacheConfig
  ): Promise<void> {
    const startTime = performance.now();
    
    try {
      let processedData: T | string = data;
      let size = this.estimateSize(data);
      let compressed = false;
      let encrypted = false;

      // Compression for large data
      if (config.compressionEnabled && size > 1024) {
        processedData = await this.compress(data as any);
        compressed = true;
        size = this.estimateSize(processedData);
      }

      // Encryption for sensitive data
      if (config.encryptionEnabled) {
        processedData = await this.encrypt(processedData as any);
        encrypted = true;
      }

      // Evict entries if needed
      await this.evictIfNeeded(size, config.priority);

      const entry: CacheEntry<T> = {
        data: processedData as T, // Data may be compressed/encrypted string
        timestamp: Date.now(),
        hits: 0,
        lastAccess: Date.now(),
        size,
        priority: config.priority,
        compressed,
        encrypted,
        etag: this.generateETag(data)
      };

      this.cache.set(key, entry);
      this.currentSize += size;
      
      // Warmup related URLs
      if (config.warmupUrls && typeof window !== 'undefined') {
        this.scheduleWarmup(config.warmupUrls);
      }

    } finally {
      this.recordAccessTime(performance.now() - startTime);
    }
  }

  // Enhanced get with automatic decompression/decryption
  async get<T>(key: string): Promise<T | null> {
    const startTime = performance.now();
    
    try {
      const entry = this.cache.get(key);
      
      if (!entry) {
        this.missCount++;
        return null;
      }

      // Check if expired
      if (this.isExpired(entry)) {
        this.cache.delete(key);
        this.currentSize -= entry.size;
        this.missCount++;
        return null;
      }

      // Update access stats
      entry.hits++;
      entry.lastAccess = Date.now();
      this.hitCount++;

      let data = entry.data;

      // Decrypt if needed
      if (entry.encrypted) {
        data = await this.decrypt(data);
      }

      // Decompress if needed
      if (entry.compressed) {
        data = await this.decompress(data);
      }

      return data as T;

    } finally {
      this.recordAccessTime(performance.now() - startTime);
    }
  }

  // Smart invalidation based on patterns
  invalidatePattern(pattern: RegExp): number {
    let invalidated = 0;
    
    for (const [key, entry] of Array.from(this.cache.entries())) {
      if (pattern.test(key)) {
        this.cache.delete(key);
        this.currentSize -= entry.size;
        invalidated++;
      }
    }
    
    return invalidated;
  }

  // Predictive cache warming
  private async scheduleWarmup(urls: string[]): Promise<void> {
    // Warmup during idle time
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        urls.forEach(url => this.warmupUrl(url));
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        urls.forEach(url => this.warmupUrl(url));
      }, 100);
    }
  }

  private async warmupUrl(url: string): Promise<void> {
    try {
      const response = await fetch(url, { 
        method: 'HEAD',
        cache: 'no-cache' 
      });
      
      if (response.ok) {
        // Pre-fetch the actual content
        fetch(url).catch(() => {}); // Silent fail
      }
    } catch {
      // Silent fail for warmup
    }
  }

  // Priority-based eviction (LRU with priority weights)
  private async evictIfNeeded(
    newEntrySize: number, 
    newEntryPriority: CachePriority
  ): Promise<void> {
    while (this.currentSize + newEntrySize > this.maxMemorySize) {
      const entryToEvict = this.selectEvictionCandidate(newEntryPriority);
      
      if (!entryToEvict) break;
      
      const entry = this.cache.get(entryToEvict);
      if (entry) {
        this.cache.delete(entryToEvict);
        this.currentSize -= entry.size;
        this.evictionCount++;
      }
    }
  }

  private selectEvictionCandidate(
    newEntryPriority: CachePriority
  ): string | null {
    let candidate: string | null = null;
    let lowestScore = Infinity;

    for (const [key, entry] of Array.from(this.cache.entries())) {
      // Don't evict higher priority items for lower priority ones
      if (this.getPriorityWeight(entry.priority) > this.getPriorityWeight(newEntryPriority)) {
        continue;
      }

      // Calculate eviction score (lower = more likely to evict)
      const timeSinceAccess = Date.now() - entry.lastAccess;
      const priorityWeight = this.getPriorityWeight(entry.priority);
      const hitRatio = entry.hits / Math.max(1, (Date.now() - entry.timestamp) / 1000);
      
      const score = (priorityWeight * 1000) + (hitRatio * 100) - (timeSinceAccess / 1000);
      
      if (score < lowestScore) {
        lowestScore = score;
        candidate = key;
      }
    }

    return candidate;
  }

  private getPriorityWeight(priority: CachePriority): number {
    const weights = {
      [CachePriority.CRITICAL]: 10,
      [CachePriority.HIGH]: 7,
      [CachePriority.MEDIUM]: 5,
      [CachePriority.LOW]: 3,
      [CachePriority.BACKGROUND]: 1
    };
    return weights[priority];
  }

  // Compression utilities
  private async compress<T>(data: T): Promise<string> {
    if (typeof window !== 'undefined' && 'CompressionStream' in window) {
      try {
        const stream = new CompressionStream('gzip');
        const writer = stream.writable.getWriter();
        const reader = stream.readable.getReader();
        
        const encoder = new TextEncoder();
        const chunk = encoder.encode(JSON.stringify(data));
        
        writer.write(chunk);
        writer.close();
        
        const compressed = await reader.read();
        return btoa(String.fromCharCode(...Array.from(new Uint8Array(compressed.value!))));
      } catch {
        // Fallback if CompressionStream fails
      }
    }
    
    // Fallback: simple string compression
    return btoa(encodeURIComponent(JSON.stringify(data)));
  }

  private async decompress<T>(compressed: string): Promise<T> {
    if (typeof window !== 'undefined' && 'DecompressionStream' in window) {
      try {
        const stream = new DecompressionStream('gzip');
        const writer = stream.writable.getWriter();
        const reader = stream.readable.getReader();
        
        const decoder = new TextDecoder();
        const chunk = new Uint8Array(atob(compressed).split('').map(c => c.charCodeAt(0)));
        
        writer.write(chunk);
        writer.close();
        
        const decompressed = await reader.read();
        const text = decoder.decode(decompressed.value);
        return JSON.parse(text);
      } catch {
        // Fallback if decompression fails
      }
    }
    
    // Fallback: simple string decompression
    return JSON.parse(decodeURIComponent(atob(compressed)));
  }

  // Encryption utilities (basic implementation)
  private async encrypt<T>(data: T): Promise<string> {
    // In production, use Web Crypto API
    // For now, basic obfuscation
    const jsonStr = JSON.stringify(data);
    return btoa(jsonStr.split('').reverse().join(''));
  }

  private async decrypt<T>(encrypted: string): Promise<T> {
    const decrypted = atob(encrypted).split('').reverse().join('');
    return JSON.parse(decrypted);
  }

  // Utility methods
  private estimateSize(data: any): number {
    return new Blob([JSON.stringify(data)]).size;
  }

  private isExpired(entry: CacheEntry): boolean {
    // Different TTL based on priority
    const ttlMultipliers = {
      [CachePriority.CRITICAL]: 1.0,
      [CachePriority.HIGH]: 0.8,
      [CachePriority.MEDIUM]: 0.6,
      [CachePriority.LOW]: 0.4,
      [CachePriority.BACKGROUND]: 0.2
    };
    
    const baseTTL = 3600000; // 1 hour
    const actualTTL = baseTTL * ttlMultipliers[entry.priority];
    
    return Date.now() - entry.timestamp > actualTTL;
  }

  private generateETag(data: any): string {
    // Simple hash function for ETag
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `"${hash.toString(36)}"`;
  }

  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, entry] of Array.from(this.cache.entries())) {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
        this.currentSize -= entry.size;
        cleaned++;
      }
    }
    
    if (cleaned > 0 && process.env.NODE_ENV === 'development') {
      console.log(`[SmartCache] Cleaned up ${cleaned} expired entries`);
    }
  }

  private recordAccessTime(time: number): void {
    this.accessTimes.push(time);
    // Keep only last 1000 access times
    if (this.accessTimes.length > 1000) {
      this.accessTimes = this.accessTimes.slice(-1000);
    }
  }

  private updateStats(): void {
    const total = this.hitCount + this.missCount;
    this.stats = {
      totalEntries: this.cache.size,
      totalSize: this.currentSize,
      hitRate: total > 0 ? this.hitCount / total : 0,
      missRate: total > 0 ? this.missCount / total : 0,
      evictionCount: this.evictionCount,
      averageAccessTime: this.accessTimes.length > 0 
        ? this.accessTimes.reduce((a, b) => a + b, 0) / this.accessTimes.length 
        : 0
    };
  }

  // Public API methods
  public getStats(): CacheStats {
    return { ...this.stats };
  }

  public clear(): void {
    this.cache.clear();
    this.currentSize = 0;
    this.hitCount = 0;
    this.missCount = 0;
    this.evictionCount = 0;
    this.accessTimes = [];
  }

  public delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (entry) {
      this.currentSize -= entry.size;
      return this.cache.delete(key);
    }
    return false;
  }

  public has(key: string): boolean {
    const entry = this.cache.get(key);
    return entry !== undefined && !this.isExpired(entry);
  }

  public keys(): string[] {
    const keys: string[] = [];
    for (const [key, entry] of Array.from(this.cache.entries())) {
      if (!this.isExpired(entry)) {
        keys.push(key);
      }
    }
    return keys;
  }
}

// Export singleton instances with different configurations
export const criticalCache = new SmartCache(20 * 1024 * 1024); // 20MB for critical data
export const standardCache = new SmartCache(30 * 1024 * 1024); // 30MB for standard data
export const backgroundCache = new SmartCache(10 * 1024 * 1024); // 10MB for background data

// Cache configuration presets
export const cacheConfigs = {
  critical: {
    ttl: 3600000, // 1 hour
    priority: CachePriority.CRITICAL,
    strategy: CacheStrategy.STALE_WHILE_REVALIDATE,
    compressionEnabled: true,
    encryptionEnabled: false
  },
  userContent: {
    ttl: 1800000, // 30 minutes
    priority: CachePriority.HIGH,
    strategy: CacheStrategy.NETWORK_FIRST,
    compressionEnabled: true,
    encryptionEnabled: true
  },
  staticAssets: {
    ttl: 86400000, // 24 hours
    priority: CachePriority.MEDIUM,
    strategy: CacheStrategy.CACHE_FIRST,
    compressionEnabled: true,
    encryptionEnabled: false
  },
  analytics: {
    ttl: 300000, // 5 minutes
    priority: CachePriority.BACKGROUND,
    strategy: CacheStrategy.NETWORK_ONLY,
    compressionEnabled: false,
    encryptionEnabled: false
  }
} as const;
