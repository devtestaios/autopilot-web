import { LRUCache } from 'lru-cache';

// Browser-safe cache initialization
const createLRUCache = () => {
  if (typeof window === 'undefined') {
    // Server-side fallback
    return new Map();
  }
  
  try {
    return new LRUCache({
      max: 1000,
      ttl: 1000 * 60 * 5, // 5 minutes
    });
  } catch (error) {
    console.warn('LRU Cache not available, using Map fallback');
    return new Map();
  }
};

// Advanced API caching system with multiple strategies
interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  tags: string[];
  etag?: string;
  revalidate?: boolean;
}

interface CacheConfig {
  maxSize: number;
  defaultTTL: number;
  enablePersistence: boolean;
  enableTagging: boolean;
  enableCompression: boolean;
  compressionThreshold: number;
  revalidateOnStale: boolean;
}

class AdvancedAPICache {
  private memoryCache: LRUCache<string, CacheEntry>;
  private config: CacheConfig;
  private persistentStore: Storage | null = null;
  private tagIndex: Map<string, Set<string>> = new Map();
  private compressionEnabled: boolean = false;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 100,
      defaultTTL: 5 * 60 * 1000, // 5 minutes
      enablePersistence: true,
      enableTagging: true,
      enableCompression: false,
      compressionThreshold: 1024, // 1KB
      revalidateOnStale: true,
      ...config
    };

    this.memoryCache = createLRUCache();
    if (this.memoryCache instanceof Map) {
      // Map fallback - add manual cleanup
      console.warn('Using Map fallback for cache');
    }

    this.initializePersistentStorage();
    this.initializeCompression();
  }

  private initializePersistentStorage() {
    if (typeof window !== 'undefined' && this.config.enablePersistence) {
      try {
        this.persistentStore = window.localStorage;
      } catch (error) {
        console.warn('Persistent storage not available:', error);
      }
    }
  }

  private async initializeCompression() {
    if (this.config.enableCompression && typeof window !== 'undefined') {
      try {
        // Check if compression is supported
        const testData = 'test';
        const compressed = await this.compress(testData);
        const decompressed = await this.decompress(compressed);
        this.compressionEnabled = decompressed === testData;
      } catch (error) {
        console.warn('Compression not available:', error);
      }
    }
  }

  private async compress(data: string): Promise<string> {
    if (!this.compressionEnabled) return data;
    
    try {
      const encoder = new TextEncoder();
      const compressed = await new Response(
        new ReadableStream({
          start(controller) {
            controller.enqueue(encoder.encode(data));
            controller.close();
          }
        }).pipeThrough(new CompressionStream('gzip'))
      ).arrayBuffer();
      
      return btoa(String.fromCharCode(...new Uint8Array(compressed)));
    } catch (error) {
      console.warn('Compression failed:', error);
      return data;
    }
  }

  private async decompress(compressedData: string): Promise<string> {
    if (!this.compressionEnabled) return compressedData;
    
    try {
      const binaryString = atob(compressedData);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const decompressed = await new Response(
        new ReadableStream({
          start(controller) {
            controller.enqueue(bytes);
            controller.close();
          }
        }).pipeThrough(new DecompressionStream('gzip'))
      ).text();
      
      return decompressed;
    } catch (error) {
      console.warn('Decompression failed:', error);
      return compressedData;
    }
  }

  private generateCacheKey(url: string, params?: Record<string, any>): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${url}:${btoa(paramString)}`;
  }

  private updateTagIndex(key: string, tags: string[]) {
    if (!this.config.enableTagging) return;
    
    tags.forEach(tag => {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag)!.add(key);
    });
  }

  private cleanupTags(key: string) {
    if (!this.config.enableTagging) return;
    
    this.tagIndex.forEach((keys, tag) => {
      keys.delete(key);
      if (keys.size === 0) {
        this.tagIndex.delete(tag);
      }
    });
  }

  private async saveToPersistentStorage(key: string, entry: CacheEntry) {
    if (!this.persistentStore) return;
    
    try {
      const serialized = JSON.stringify(entry);
      const compressed = await this.compress(serialized);
      this.persistentStore.setItem(`api-cache:${key}`, compressed);
    } catch (error) {
      console.warn('Failed to save to persistent storage:', error);
    }
  }

  private async loadFromPersistentStorage(key: string): Promise<CacheEntry | null> {
    if (!this.persistentStore) return null;
    
    try {
      const compressed = this.persistentStore.getItem(`api-cache:${key}`);
      if (!compressed) return null;
      
      const decompressed = await this.decompress(compressed);
      const entry = JSON.parse(decompressed) as CacheEntry;
      
      // Check if entry is still valid
      if (Date.now() - entry.timestamp > entry.ttl) {
        this.persistentStore.removeItem(`api-cache:${key}`);
        return null;
      }
      
      return entry;
    } catch (error) {
      console.warn('Failed to load from persistent storage:', error);
      return null;
    }
  }

  async get<T = any>(
    url: string, 
    params?: Record<string, any>,
    options: {
      ttl?: number;
      tags?: string[];
      staleWhileRevalidate?: boolean;
    } = {}
  ): Promise<T | null> {
    const key = this.generateCacheKey(url, params);
    
    // Try memory cache first
    let entry = this.memoryCache.get(key);
    
    // Fallback to persistent storage
    if (!entry && this.config.enablePersistence) {
      entry = await this.loadFromPersistentStorage(key);
      if (entry) {
        // Restore to memory cache
        this.memoryCache.set(key, entry);
        this.updateTagIndex(key, entry.tags);
      }
    }
    
    if (!entry) return null;
    
    const now = Date.now();
    const isStale = (now - entry.timestamp) > entry.ttl;
    
    if (isStale) {
      if (options.staleWhileRevalidate && entry.revalidate) {
        // Return stale data but trigger revalidation
        this.triggerRevalidation(url, params, options);
        return entry.data;
      } else {
        // Remove expired entry
        this.delete(key);
        return null;
      }
    }
    
    return entry.data;
  }

  async set<T = any>(
    url: string,
    data: T,
    params?: Record<string, any>,
    options: {
      ttl?: number;
      tags?: string[];
      etag?: string;
      revalidate?: boolean;
    } = {}
  ): Promise<void> {
    const key = this.generateCacheKey(url, params);
    const ttl = options.ttl || this.config.defaultTTL;
    const tags = options.tags || [];
    
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      tags,
      etag: options.etag,
      revalidate: options.revalidate ?? this.config.revalidateOnStale
    };
    
    // Store in memory cache
    this.memoryCache.set(key, entry);
    
    // Update tag index
    this.updateTagIndex(key, tags);
    
    // Store in persistent storage
    if (this.config.enablePersistence) {
      await this.saveToPersistentStorage(key, entry);
    }
  }

  delete(keyOrUrl: string, params?: Record<string, any>): boolean {
    const key = params ? this.generateCacheKey(keyOrUrl, params) : keyOrUrl;
    
    // Remove from memory cache
    const deleted = this.memoryCache.delete(key);
    
    // Remove from persistent storage
    if (this.persistentStore) {
      this.persistentStore.removeItem(`api-cache:${key}`);
    }
    
    // Cleanup tags
    this.cleanupTags(key);
    
    return deleted;
  }

  invalidateByTag(tag: string): number {
    if (!this.config.enableTagging) return 0;
    
    const keys = this.tagIndex.get(tag);
    if (!keys) return 0;
    
    let count = 0;
    keys.forEach(key => {
      if (this.delete(key)) count++;
    });
    
    return count;
  }

  clear(): void {
    this.memoryCache.clear();
    this.tagIndex.clear();
    
    if (this.persistentStore) {
      // Clear only our cache entries
      const keys = Object.keys(this.persistentStore);
      keys.forEach(key => {
        if (key.startsWith('api-cache:')) {
          this.persistentStore!.removeItem(key);
        }
      });
    }
  }

  getStats() {
    return {
      size: this.memoryCache.size,
      maxSize: this.config.maxSize,
      hitRate: this.memoryCache.calculatedSize,
      tags: this.tagIndex.size,
      compressionEnabled: this.compressionEnabled
    };
  }

  private async triggerRevalidation(
    url: string, 
    params?: Record<string, any>,
    options: { tags?: string[]; ttl?: number } = {}
  ) {
    // Background revalidation - don't await
    setTimeout(async () => {
      try {
        // This would typically call the actual API
        // For now, we'll just mark it for revalidation
        const key = this.generateCacheKey(url, params);
        const entry = this.memoryCache.get(key);
        if (entry) {
          entry.timestamp = Date.now();
          entry.revalidate = false;
          this.memoryCache.set(key, entry);
        }
      } catch (error) {
        console.warn('Revalidation failed:', error);
      }
    }, 100);
  }
}

// Create singleton instance
export const apiCache = new AdvancedAPICache({
  maxSize: 200,
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  enablePersistence: true,
  enableTagging: true,
  enableCompression: true,
  revalidateOnStale: true
});

// Cache decorator for API functions
export function cached<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    ttl?: number;
    tags?: string[] | ((...args: Parameters<T>) => string[]);
    keyGenerator?: (...args: Parameters<T>) => string;
    staleWhileRevalidate?: boolean;
  } = {}
): T {
  return (async (...args: Parameters<T>) => {
    const key = options.keyGenerator 
      ? options.keyGenerator(...args)
      : `${fn.name}:${JSON.stringify(args)}`;
    
    const tags = typeof options.tags === 'function' 
      ? options.tags(...args)
      : options.tags || [fn.name];
    
    // Try to get from cache
    const cached = await apiCache.get(key, undefined, {
      tags,
      staleWhileRevalidate: options.staleWhileRevalidate
    });
    
    if (cached !== null) {
      return cached;
    }
    
    // Execute function and cache result
    const result = await fn(...args);
    
    await apiCache.set(key, result, undefined, {
      ttl: options.ttl,
      tags,
      revalidate: options.staleWhileRevalidate
    });
    
    return result;
  }) as T;
}

// Cache invalidation utilities
export const cacheUtils = {
  invalidateAll: () => apiCache.clear(),
  invalidateByTag: (tag: string) => apiCache.invalidateByTag(tag),
  invalidateByPattern: (pattern: RegExp) => {
    // Not implemented in LRUCache, would need custom implementation
    console.warn('Pattern invalidation not implemented');
  },
  getStats: () => apiCache.getStats(),
  preload: async <T>(
    key: string, 
    fetchFn: () => Promise<T>,
    options: { ttl?: number; tags?: string[] } = {}
  ) => {
    const existing = await apiCache.get(key);
    if (existing === null) {
      const data = await fetchFn();
      await apiCache.set(key, data, undefined, options);
      return data;
    }
    return existing;
  }
};

// React hook for cached API calls
import { useState, useEffect, useCallback } from 'react';

export function useCachedAPI<T>(
  fetchFn: () => Promise<T>,
  dependencies: any[] = [],
  options: {
    cacheKey: string;
    ttl?: number;
    tags?: string[];
    enabled?: boolean;
    staleWhileRevalidate?: boolean;
  }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!options.enabled) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Try cache first
      const cached = await apiCache.get(options.cacheKey, undefined, {
        tags: options.tags,
        staleWhileRevalidate: options.staleWhileRevalidate
      });
      
      if (cached !== null) {
        setData(cached);
        setLoading(false);
        return;
      }
      
      // Fetch fresh data
      const result = await fetchFn();
      
      // Cache the result
      await apiCache.set(options.cacheKey, result, undefined, {
        ttl: options.ttl,
        tags: options.tags,
        revalidate: options.staleWhileRevalidate
      });
      
      setData(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, options.cacheKey, options.enabled, options.ttl, options.tags, options.staleWhileRevalidate]);

  useEffect(() => {
    fetchData();
  }, [...dependencies, fetchData]);

  const invalidate = useCallback(() => {
    apiCache.delete(options.cacheKey);
    fetchData();
  }, [options.cacheKey, fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    invalidate
  };
}

export default apiCache;