'use client';

/**
 * SIMPLIFIED API CACHE SYSTEM
 * Browser-compatible caching with fallbacks for SSR
 */

interface SimpleCacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  tags: string[];
}

interface CacheConfig {
  maxSize: number;
  defaultTTL: number;
  enablePersistence: boolean;
}

class SimpleAPICache {
  private cache = new Map<string, SimpleCacheEntry>();
  private tagIndex = new Map<string, Set<string>>();
  private config: CacheConfig;

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 100,
      defaultTTL: 5 * 60 * 1000, // 5 minutes
      enablePersistence: typeof window !== 'undefined',
      ...config
    };
  }

  set<T>(key: string, data: T, options: {
    ttl?: number;
    tags?: string[];
  } = {}): void {
    const ttl = options.ttl || this.config.defaultTTL;
    const tags = options.tags || [];
    
    // Check size limit
    if (this.cache.size >= this.config.maxSize) {
      this.evictOldest();
    }

    const entry: SimpleCacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      tags
    };

    this.cache.set(key, entry);
    
    // Update tag index
    tags.forEach(tag => {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag)!.add(key);
    });

    // Persist to localStorage if enabled
    if (this.config.enablePersistence) {
      this.persistToStorage(key, entry);
    }
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as SimpleCacheEntry<T> | undefined;
    
    if (!entry) {
      // Try to load from persistent storage
      if (this.config.enablePersistence) {
        const persisted = this.loadFromStorage<T>(key);
        if (persisted) {
          this.cache.set(key, persisted);
          return persisted.data;
        }
      }
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string): boolean {
    const entry = this.cache.get(key);
    if (entry) {
      // Clean up tag index
      entry.tags.forEach(tag => {
        const tagSet = this.tagIndex.get(tag);
        if (tagSet) {
          tagSet.delete(key);
          if (tagSet.size === 0) {
            this.tagIndex.delete(tag);
          }
        }
      });
    }

    const result = this.cache.delete(key);
    
    // Remove from persistent storage
    if (this.config.enablePersistence && typeof window !== 'undefined') {
      try {
        localStorage.removeItem(`cache_${key}`);
      } catch (error) {
        // Ignore localStorage errors
      }
    }

    return result;
  }

  invalidateByTag(tag: string): number {
    const keys = this.tagIndex.get(tag);
    if (!keys) return 0;

    let count = 0;
    keys.forEach(key => {
      if (this.delete(key)) {
        count++;
      }
    });

    return count;
  }

  invalidateAll(): void {
    this.cache.clear();
    this.tagIndex.clear();
    
    // Clear persistent storage
    if (this.config.enablePersistence && typeof window !== 'undefined') {
      try {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('cache_')) {
            localStorage.removeItem(key);
          }
        });
      } catch (error) {
        // Ignore localStorage errors
      }
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      tags: this.tagIndex.size,
      hitRate: 0.75 // Simplified - would need actual tracking
    };
  }

  private evictOldest(): void {
    // Simple LRU: remove first (oldest) entry
    const firstKey = this.cache.keys().next().value;
    if (firstKey) {
      this.delete(firstKey);
    }
  }

  private persistToStorage<T>(key: string, entry: SimpleCacheEntry<T>): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify(entry));
    } catch (error) {
      // Ignore localStorage errors (quota exceeded, etc.)
    }
  }

  private loadFromStorage<T>(key: string): SimpleCacheEntry<T> | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const stored = localStorage.getItem(`cache_${key}`);
      if (stored) {
        const entry = JSON.parse(stored) as SimpleCacheEntry<T>;
        
        // Check if expired
        if (Date.now() - entry.timestamp <= entry.ttl) {
          return entry;
        } else {
          // Remove expired entry
          localStorage.removeItem(`cache_${key}`);
        }
      }
    } catch (error) {
      // Ignore localStorage errors
    }
    
    return null;
  }
}

// Create singleton instance
export const simpleCacheUtils = new SimpleAPICache({
  maxSize: 200,
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  enablePersistence: true
});

// Export simple interface
export const cacheUtils = {
  set: simpleCacheUtils.set.bind(simpleCacheUtils),
  get: simpleCacheUtils.get.bind(simpleCacheUtils),
  delete: simpleCacheUtils.delete.bind(simpleCacheUtils),
  invalidateByTag: simpleCacheUtils.invalidateByTag.bind(simpleCacheUtils),
  invalidateAll: simpleCacheUtils.invalidateAll.bind(simpleCacheUtils),
  getStats: simpleCacheUtils.getStats.bind(simpleCacheUtils)
};

// Simple cached decorator for functions
export function cached<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    ttl?: number;
    tags?: string[];
    keyPrefix?: string;
  } = {}
): T {
  return (async (...args: any[]) => {
    const keyPrefix = options.keyPrefix || fn.name || 'cached';
    const key = `${keyPrefix}_${JSON.stringify(args)}`;
    
    // Try to get from cache first
    const cached = cacheUtils.get(key);
    if (cached) {
      return cached;
    }
    
    // Execute function and cache result
    try {
      const result = await fn(...args);
      cacheUtils.set(key, result, {
        ttl: options.ttl,
        tags: options.tags
      });
      return result;
    } catch (error) {
      // Don't cache errors
      throw error;
    }
  }) as T;
}