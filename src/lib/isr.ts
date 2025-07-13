/**
 * Incremental Static Regeneration (ISR) Utilities
 * Handles revalidation, caching strategies, and static generation
 */

import { unstable_cache } from 'next/cache';
import { cache } from 'react';

// ISR configuration types
export interface ISRConfig {
  revalidate?: number | false;
  fallback?: 'blocking' | boolean;
  notFound?: boolean;
  tags?: string[];
}

// Cache tags for granular invalidation
export const CACHE_TAGS = {
  ALL: 'all',
  BLOG: 'blog',
  BLOG_POST: 'blog-post',
  SERVICES: 'services',
  HOMEPAGE: 'homepage',
  NAVIGATION: 'navigation',
  NOTION: 'notion',
} as const;

// Default ISR configurations for different page types
export const ISR_CONFIGS = {
  // Static pages with occasional updates
  static: {
    revalidate: 3600, // 1 hour
    fallback: false,
    tags: [CACHE_TAGS.ALL] as string[],
  },
  
  // Dynamic content pages
  dynamic: {
    revalidate: 60, // 1 minute
    fallback: 'blocking' as const,
    tags: [CACHE_TAGS.ALL] as string[],
  },
  
  // Blog/News pages
  blog: {
    revalidate: 300, // 5 minutes
    fallback: true,
    tags: [CACHE_TAGS.BLOG],
  },
  
  // Real-time content
  realtime: {
    revalidate: 10, // 10 seconds
    fallback: 'blocking' as const,
    tags: [CACHE_TAGS.ALL],
  },
  
  // No revalidation (fully static)
  permanent: {
    revalidate: false,
    fallback: false,
    tags: [CACHE_TAGS.ALL],
  },
} as const;

// Cache control headers for different content types
export const CACHE_HEADERS = {
  static: 'public, max-age=31536000, immutable',
  dynamic: 'public, s-maxage=10, stale-while-revalidate=59',
  api: 'public, s-maxage=60, stale-while-revalidate=300',
  private: 'private, no-cache, no-store, must-revalidate',
} as const;

// Generate static params with pagination support
export function generateStaticParamsWithPagination(
  totalItems: number,
  itemsPerPage: number = 10
) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  return Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString(),
  }));
}

// Revalidation utility for on-demand ISR
export async function revalidatePath(path: string): Promise<boolean> {
  try {
    const response = await fetch('/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to revalidate path:', error);
    return false;
  }
}

// Batch revalidation for multiple paths
export async function revalidatePaths(paths: string[]): Promise<Record<string, boolean>> {
  const results: Record<string, boolean> = {};
  
  // Process in batches to avoid overwhelming the server
  const batchSize = 5;
  for (let i = 0; i < paths.length; i += batchSize) {
    const batch = paths.slice(i, i + batchSize);
    const promises = batch.map(async (path) => {
      const success = await revalidatePath(path);
      results[path] = success;
    });
    
    await Promise.all(promises);
  }
  
  return results;
}

// Smart revalidation based on content type
export function getRevalidateTime(contentType: keyof typeof ISR_CONFIGS): number | false {
  return ISR_CONFIGS[contentType].revalidate;
}

// Edge-compatible cache wrapper
export class EdgeCache {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  
  constructor(private ttl: number = 60000) {} // Default 1 minute
  
  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }
  
  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;
    
    // Check if cache is expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  delete(key: string): void {
    this.cache.delete(key);
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    
    for (const [key, entry] of Array.from(this.cache.entries())) {
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Stale-while-revalidate implementation
export async function staleWhileRevalidate<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    cache: EdgeCache;
    ttl?: number;
    onRevalidate?: (data: T) => void;
  }
): Promise<T> {
  const cached = options.cache.get(key);
  
  // Return cached data immediately if available
  if (cached) {
    // Revalidate in the background
    fetcher().then((freshData) => {
      options.cache.set(key, freshData);
      options.onRevalidate?.(freshData);
    }).catch(console.error);
    
    return cached;
  }
  
  // No cache, fetch and cache
  const data = await fetcher();
  options.cache.set(key, data);
  return data;
}

// Generate cache key for queries
export function generateCacheKey(
  base: string,
  params?: Record<string, any>
): string {
  if (!params || Object.keys(params).length === 0) {
    return base;
  }
  
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
  
  return `${base}?${sortedParams}`;
}

// ISR helper for getStaticProps
export function withISR<T extends { props: any }>(
  config: ISRConfig = ISR_CONFIGS.dynamic
) {
  return (getStaticPropsResult: T): T => {
    return {
      ...getStaticPropsResult,
      revalidate: config.revalidate,
    };
  };
}

// Cache-aware data fetcher
export async function fetchWithCache<T>(
  url: string,
  options: RequestInit & {
    cache?: EdgeCache;
    cacheKey?: string;
    cacheTTL?: number;
  } = {}
): Promise<T> {
  const { cache, cacheKey, cacheTTL, ...fetchOptions } = options;
  
  // Use cache if provided
  if (cache && cacheKey) {
    return staleWhileRevalidate(
      cacheKey,
      () => fetch(url, fetchOptions).then(res => res.json()),
      { cache, ttl: cacheTTL }
    );
  }
  
  // Direct fetch without cache
  const response = await fetch(url, fetchOptions);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }
  
  return response.json();
}

// Advanced Next.js 14+ cache wrapper with tags
export const createCachedFunction = <T extends (...args: any[]) => any>(
  fn: T,
  options?: {
    revalidate?: number | false;
    tags?: string[];
  }
) => {
  return unstable_cache(
    fn,
    [fn.name],
    {
      revalidate: options?.revalidate ?? 3600,
      tags: options?.tags ?? [CACHE_TAGS.ALL],
    }
  );
};

// React cache for request-level deduplication
export const dedupedNotionFetch = cache(async (pageId: string) => {
  const response = await fetch(`/api/notion/${pageId}`, {
    next: {
      revalidate: ISR_CONFIGS.dynamic.revalidate,
      tags: [CACHE_TAGS.NOTION, `notion-${pageId}`],
    },
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch Notion page: ${response.statusText}`);
  }
  
  return response.json();
});

// Optimized cache invalidation
export async function revalidateByTag(tag: string): Promise<boolean> {
  try {
    const response = await fetch('/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': process.env.REVALIDATE_SECRET || '',
      },
      body: JSON.stringify({ tag }),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Tag revalidation error:', error);
    return false;
  }
}

// Intelligent prefetching for improved performance
export const prefetchRelatedContent = async (
  currentPath: string,
  relatedPaths: string[]
): Promise<void> => {
  // Prefetch related content in the background
  const prefetchPromises = relatedPaths.map(path => 
    fetch(path, {
      priority: 'low',
      next: {
        revalidate: ISR_CONFIGS.static.revalidate,
      },
    }).catch(() => {
      // Silently fail prefetch errors
    })
  );
  
  await Promise.allSettled(prefetchPromises);
};

// Edge-optimized response caching
export const cacheResponse = (
  response: Response,
  cacheControl: string = CACHE_HEADERS.dynamic
): Response => {
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', cacheControl);
  headers.set('CDN-Cache-Control', cacheControl);
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};