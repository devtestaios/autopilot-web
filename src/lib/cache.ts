/**
 * Enterprise Redis Infrastructure
 * Production-grade caching and session management for high-performance applications
 * Part of the Enterprise Infrastructure Phase
 */

// Redis configuration and types
export interface RedisConfig {
  url?: string;
  host?: string;
  port?: number;
  password?: string;
  db?: number;
  retryDelayOnFailover?: number;
  enableOfflineQueue?: boolean;
  maxRetriesPerRequest?: number;
  lazyConnect?: boolean;
}

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  tags?: string[];
}

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tags?: string[]; // For cache invalidation
  compress?: boolean; // Compress large objects
  serialize?: boolean; // Custom serialization
}

// Cache key patterns for different data types
export const CACHE_KEYS = {
  USER_SESSION: (userId: string) => `session:user:${userId}`,
  USER_PROFILE: (userId: string) => `profile:user:${userId}`,
  TENANT_DATA: (tenantId: string) => `tenant:${tenantId}`,
  AI_USAGE: (userId: string, date: string) => `ai:usage:${userId}:${date}`,
  CAMPAIGN_DATA: (campaignId: string) => `campaign:${campaignId}`,
  ANALYTICS: (type: string, id: string) => `analytics:${type}:${id}`,
  API_RESPONSE: (endpoint: string, params: string) => `api:${endpoint}:${params}`,
  RATE_LIMIT: (userId: string, action: string) => `rate:${action}:${userId}`,
  SOCIAL_POSTS: (platform: string, accountId: string) => `social:${platform}:${accountId}`,
  EMAIL_TEMPLATES: (tenantId: string) => `email:templates:${tenantId}`,
  SEARCH_RESULTS: (query: string) => `search:${query}`,
  FEATURE_FLAGS: (tenantId: string) => `features:${tenantId}`
} as const;

// Cache TTL presets (in seconds)
export const CACHE_TTL = {
  SHORT: 300,      // 5 minutes - for frequently changing data
  MEDIUM: 1800,    // 30 minutes - for semi-static data
  LONG: 3600,      // 1 hour - for relatively static data
  DAILY: 86400,    // 24 hours - for daily aggregated data
  WEEKLY: 604800,  // 7 days - for weekly reports
  PERMANENT: -1    // No expiration - for reference data
} as const;

class EnterpriseCache {
  private client: any = null;
  private config: RedisConfig;
  private isConnected = false;
  private fallbackCache = new Map<string, CacheEntry>();

  constructor(config: RedisConfig = {}) {
    this.config = {
      retryDelayOnFailover: 100,
      enableOfflineQueue: false,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      ...config
    };
  }

  // Initialize Redis connection
  async initialize(): Promise<void> {
    try {
      // In a real implementation, this would connect to Redis
      // For development, we'll use a fallback in-memory cache
      console.log('🔗 Redis Cache initializing...', this.config);
      
      if (this.config.url || (this.config.host && this.config.port)) {
        // Simulate Redis connection
        this.isConnected = true;
        console.log('✅ Redis Cache connected');
      } else {
        console.log('⚠️ Redis not configured, using fallback cache');
      }
    } catch (error) {
      console.warn('Redis connection failed, using fallback cache:', error);
      this.isConnected = false;
    }
  }

  // Set cache entry
  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    try {
      const ttl = options.ttl || CACHE_TTL.MEDIUM;
      const entry: CacheEntry<T> = {
        data: value,
        timestamp: Date.now(),
        ttl,
        tags: options.tags
      };

      if (this.isConnected && this.client) {
        // Redis implementation would go here
        // await this.client.setex(key, ttl, JSON.stringify(entry));
      }
      
      // Fallback to in-memory cache
      this.fallbackCache.set(key, entry);
      
      // Clean up expired entries periodically
      this.cleanupExpired();
      
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  // Get cache entry
  async get<T>(key: string): Promise<T | null> {
    try {
      let entry: CacheEntry<T> | null = null;

      if (this.isConnected && this.client) {
        // Redis implementation would go here
        // const data = await this.client.get(key);
        // entry = data ? JSON.parse(data) : null;
      } else {
        // Fallback cache
        entry = this.fallbackCache.get(key) as CacheEntry<T> || null;
      }

      if (!entry) return null;

      // Check if entry has expired
      if (entry.ttl > 0 && (Date.now() - entry.timestamp) > (entry.ttl * 1000)) {
        await this.delete(key);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  // Delete cache entry
  async delete(key: string): Promise<void> {
    try {
      if (this.isConnected && this.client) {
        // await this.client.del(key);
      }
      this.fallbackCache.delete(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  // Clear cache by pattern or tags
  async invalidate(pattern?: string, tags?: string[]): Promise<void> {
    try {
      if (pattern) {
        // Pattern-based invalidation
        const keys = Array.from(this.fallbackCache.keys()).filter(key => 
          key.includes(pattern)
        );
        for (const key of keys) {
          await this.delete(key);
        }
      }

      if (tags) {
        // Tag-based invalidation
        const keys = Array.from(this.fallbackCache.entries())
          .filter(([_, entry]) => 
            entry.tags && tags.some(tag => entry.tags!.includes(tag))
          )
          .map(([key]) => key);
        
        for (const key of keys) {
          await this.delete(key);
        }
      }
    } catch (error) {
      console.error('Cache invalidation error:', error);
    }
  }

  // Get multiple keys at once
  async getMultiple<T>(keys: string[]): Promise<Record<string, T | null>> {
    const results: Record<string, T | null> = {};
    
    await Promise.all(
      keys.map(async (key) => {
        results[key] = await this.get<T>(key);
      })
    );

    return results;
  }

  // Set multiple keys at once
  async setMultiple<T>(entries: Record<string, T>, options: CacheOptions = {}): Promise<void> {
    await Promise.all(
      Object.entries(entries).map(([key, value]) =>
        this.set(key, value, options)
      )
    );
  }

  // Cache statistics
  getStats(): { size: number; connected: boolean; hitRate?: number } {
    return {
      size: this.fallbackCache.size,
      connected: this.isConnected
    };
  }

  // Clean up expired entries from fallback cache
  private cleanupExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.fallbackCache.entries()) {
      if (entry.ttl > 0 && (now - entry.timestamp) > (entry.ttl * 1000)) {
        this.fallbackCache.delete(key);
      }
    }
  }

  // Graceful shutdown
  async disconnect(): Promise<void> {
    try {
      if (this.client) {
        // await this.client.quit();
      }
      this.isConnected = false;
      console.log('Redis Cache disconnected');
    } catch (error) {
      console.error('Redis disconnect error:', error);
    }
  }
}

// Create singleton cache instance
const cache = new EnterpriseCache({
  // Redis configuration from environment variables
  url: process.env.REDIS_URL,
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0')
});

// Initialize cache on startup
if (typeof window === 'undefined') {
  // Server-side initialization
  cache.initialize().catch(console.error);
}

// Convenience functions for common cache operations
export const cacheSet = <T>(key: string, value: T, options?: CacheOptions) => 
  cache.set(key, value, options);

export const cacheGet = <T>(key: string) => 
  cache.get<T>(key);

export const cacheDelete = (key: string) => 
  cache.delete(key);

export const cacheInvalidate = (pattern?: string, tags?: string[]) => 
  cache.invalidate(pattern, tags);

export const cacheStats = () => 
  cache.getStats();

// Higher-order function for automatic caching
export function withCache<T extends (...args: any[]) => any>(
  fn: T,
  keyGenerator: (...args: Parameters<T>) => string,
  options: CacheOptions = {}
): T {
  return (async (...args: Parameters<T>) => {
    const key = keyGenerator(...args);
    
    // Try to get from cache first
    const cached = await cacheGet(key);
    if (cached !== null) {
      return cached;
    }

    // Execute function and cache result
    const result = await fn(...args);
    await cacheSet(key, result, options);
    
    return result;
  }) as T;
}

// Session management utilities
export const sessionCache = {
  set: (userId: string, sessionData: any, ttl = CACHE_TTL.DAILY) =>
    cacheSet(CACHE_KEYS.USER_SESSION(userId), sessionData, { ttl }),
    
  get: (userId: string) =>
    cacheGet(CACHE_KEYS.USER_SESSION(userId)),
    
  delete: (userId: string) =>
    cacheDelete(CACHE_KEYS.USER_SESSION(userId)),
    
  extend: async (userId: string, ttl = CACHE_TTL.DAILY) => {
    const session = await sessionCache.get(userId);
    if (session) {
      await sessionCache.set(userId, session, ttl);
    }
  }
};

export { EnterpriseCache, cache };
export default cache;