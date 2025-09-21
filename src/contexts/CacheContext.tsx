'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

interface CacheContextType {
  get: <T>(key: string) => T | null;
  set: <T>(key: string, data: T, ttl?: number) => void;
  invalidate: (key: string) => void;
  invalidatePattern: (pattern: string) => void;
  clear: () => void;
  preload: <T>(key: string, fetcher: () => Promise<T>, ttl?: number) => Promise<T>;
}

const CacheContext = createContext<CacheContextType | undefined>(undefined);

interface CacheProviderProps {
  children: ReactNode;
  defaultTTL?: number;
  maxSize?: number;
}

export function CacheProvider({ 
  children, 
  defaultTTL = 5 * 60 * 1000, // 5 minutes default
  maxSize = 100 
}: CacheProviderProps) {
  const [cache, setCache] = useState<Map<string, CacheEntry<any>>>(new Map());

  // Clean expired entries periodically
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setCache(prev => {
        const newCache = new Map(prev);
        for (const [key, entry] of newCache.entries()) {
          if (now - entry.timestamp > entry.ttl) {
            newCache.delete(key);
          }
        }
        return newCache;
      });
    }, 60000); // Cleanup every minute

    return () => clearInterval(cleanupInterval);
  }, []);

  const get = <T,>(key: string): T | null => {
    const entry = cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      // Entry expired
      setCache(prev => {
        const newCache = new Map(prev);
        newCache.delete(key);
        return newCache;
      });
      return null;
    }

    return entry.data as T;
  };

  const set = <T,>(key: string, data: T, ttl: number = defaultTTL): void => {
    setCache(prev => {
      const newCache = new Map(prev);
      
      // If cache is at max size, remove oldest entry
      if (newCache.size >= maxSize && !newCache.has(key)) {
        const oldestKey = newCache.keys().next().value;
        if (oldestKey) {
          newCache.delete(oldestKey);
        }
      }

      newCache.set(key, {
        data,
        timestamp: Date.now(),
        ttl
      });

      return newCache;
    });
  };

  const invalidate = (key: string): void => {
    setCache(prev => {
      const newCache = new Map(prev);
      newCache.delete(key);
      return newCache;
    });
  };

  const invalidatePattern = (pattern: string): void => {
    const regex = new RegExp(pattern);
    setCache(prev => {
      const newCache = new Map(prev);
      for (const key of newCache.keys()) {
        if (regex.test(key)) {
          newCache.delete(key);
        }
      }
      return newCache;
    });
  };

  const clear = (): void => {
    setCache(new Map());
  };

  const preload = async <T,>(
    key: string, 
    fetcher: () => Promise<T>, 
    ttl: number = defaultTTL
  ): Promise<T> => {
    // Check if already cached
    const cached = get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Fetch and cache
    try {
      const data = await fetcher();
      set(key, data, ttl);
      return data;
    } catch (error) {
      console.error(`Failed to preload data for key ${key}:`, error);
      throw error;
    }
  };

  const value: CacheContextType = {
    get,
    set,
    invalidate,
    invalidatePattern,
    clear,
    preload
  };

  return (
    <CacheContext.Provider value={value}>
      {children}
    </CacheContext.Provider>
  );
}

export function useCache() {
  const context = useContext(CacheContext);
  if (context === undefined) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
}

// Custom hook for cached API calls
export function useCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    ttl?: number;
    enabled?: boolean;
    refetchInterval?: number;
  } = {}
) {
  const { get, set, preload } = useCache();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const {
    ttl = 5 * 60 * 1000, // 5 minutes
    enabled = true,
    refetchInterval
  } = options;

  const fetchData = async (forceFetch = false) => {
    if (!enabled) return;

    setLoading(true);
    setError(null);

    try {
      if (!forceFetch) {
        // Try to get from cache first
        const cached = get<T>(key);
        if (cached !== null) {
          setData(cached);
          setLoading(false);
          return;
        }
      }

      // Fetch fresh data
      const freshData = await preload(key, fetcher, ttl);
      setData(freshData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [key, enabled]);

  // Set up automatic refetching
  useEffect(() => {
    if (!refetchInterval || !enabled) return;

    const interval = setInterval(() => {
      fetchData(true); // Force fetch on interval
    }, refetchInterval);

    return () => clearInterval(interval);
  }, [refetchInterval, enabled]);

  return {
    data,
    loading,
    error,
    refetch: () => fetchData(true),
    cached: get<T>(key) !== null
  };
}

// Cache key generators for consistency
export const cacheKeys = {
  campaigns: 'campaigns',
  campaign: (id: number | string) => `campaign:${id}`,
  performance: (id: number | string, period: string) => `performance:${id}:${period}`,
  dashboard: 'dashboard:overview',
  kpi: 'kpi:summary',
  analytics: (type: string, period: string) => `analytics:${type}:${period}`,
  leads: 'leads',
  user: (id: number | string) => `user:${id}`
};