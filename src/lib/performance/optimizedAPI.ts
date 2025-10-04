import { cacheUtils, cached } from './simpleCacheUtils';
import type { 
  Campaign, 
  PerformanceSnapshot, 
  CampaignFormData,
  EmailCampaign,
  SocialMediaAccount,
  TeamMember,
  IntegrationApp
} from '@/types';

// Enhanced API client with performance optimizations
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api-1.onrender.com';

// Performance-optimized API error class
export class OptimizedAPIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: any,
    public retryable?: boolean,
    public timestamp?: number
  ) {
    super(message);
    this.name = 'OptimizedAPIError';
    this.timestamp = timestamp || Date.now();
  }
}

// Advanced request configuration
interface RequestConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  cache?: {
    ttl?: number;
    tags?: string[];
    staleWhileRevalidate?: boolean;
  };
  priority?: 'high' | 'normal' | 'low';
  abortController?: AbortController;
}

// Connection pooling and request management
class ConnectionManager {
  private activeRequests = new Map<string, Promise<any>>();
  private requestQueue: Array<{ fn: () => Promise<any>; priority: number }> = [];
  private concurrentRequests = 0;
  private readonly maxConcurrentRequests = 6; // Chrome's default
  
  async executeRequest<T>(
    key: string,
    requestFn: () => Promise<T>,
    priority: 'high' | 'normal' | 'low' = 'normal'
  ): Promise<T> {
    // Check if same request is already in flight
    if (this.activeRequests.has(key)) {
      return this.activeRequests.get(key);
    }
    
    const priorityNum = priority === 'high' ? 3 : priority === 'normal' ? 2 : 1;
    
    if (this.concurrentRequests >= this.maxConcurrentRequests) {
      return new Promise((resolve, reject) => {
        this.requestQueue.push({
          fn: async () => {
            try {
              const result = await this.executeImmediately(key, requestFn);
              resolve(result);
            } catch (error) {
              reject(error);
            }
          },
          priority: priorityNum
        });
        
        // Sort queue by priority
        this.requestQueue.sort((a, b) => b.priority - a.priority);
      });
    }
    
    return this.executeImmediately(key, requestFn);
  }
  
  private async executeImmediately<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    this.concurrentRequests++;
    
    const promise = requestFn().finally(() => {
      this.concurrentRequests--;
      this.activeRequests.delete(key);
      this.processQueue();
    });
    
    this.activeRequests.set(key, promise);
    return promise;
  }
  
  private processQueue() {
    while (this.requestQueue.length > 0 && this.concurrentRequests < this.maxConcurrentRequests) {
      const next = this.requestQueue.shift();
      if (next) {
        next.fn();
      }
    }
  }
  
  cancelRequest(key: string) {
    this.activeRequests.delete(key);
  }
  
  getStats() {
    return {
      activeRequests: this.activeRequests.size,
      queuedRequests: this.requestQueue.length,
      concurrentRequests: this.concurrentRequests
    };
  }
}

// Singleton connection manager
const connectionManager = new ConnectionManager();

// Enhanced fetch with performance optimizations
async function optimizedFetch(
  url: string,
  options: RequestInit & { config?: RequestConfig } = {}
): Promise<Response> {
  const { config, ...fetchOptions } = options;
  const requestKey = `${url}:${JSON.stringify(fetchOptions)}`;
  
  return connectionManager.executeRequest(
    requestKey,
    async () => {
      // Setup timeout
      const controller = config?.abortController || new AbortController();
      const timeout = setTimeout(() => controller.abort(), config?.timeout || 30000);
      
      try {
        const response = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'X-Request-Priority': config?.priority || 'normal',
            ...fetchOptions.headers,
          },
        });
        
        clearTimeout(timeout);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new OptimizedAPIError(
            errorData.message || `HTTP ${response.status}: ${response.statusText}`,
            response.status,
            errorData.code,
            errorData,
            response.status >= 500 && response.status < 600, // Server errors are retryable
            Date.now()
          );
        }
        
        return response;
      } catch (error) {
        clearTimeout(timeout);
        
        if (error instanceof OptimizedAPIError) {
          throw error;
        }
        
        throw new OptimizedAPIError(
          `Network error: ${(error as Error).message}`,
          0,
          'NETWORK_ERROR',
          error,
          true, // Network errors are retryable
          Date.now()
        );
      }
    },
    config?.priority
  );
}

// Retry logic with exponential backoff
async function withRetry<T>(
  fn: () => Promise<T>,
  config: { retries?: number; retryDelay?: number } = {}
): Promise<T> {
  const maxRetries = config.retries || 3;
  const baseDelay = config.retryDelay || 1000;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries || !(error as OptimizedAPIError).retryable) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Retry logic failed unexpectedly');
}

// Database query optimization functions
const optimizedAPI = {
  // Campaigns with intelligent caching
  campaigns: {
    getAll: cached(async (): Promise<Campaign[]> => {
      const response = await optimizedFetch(`${API_BASE}/campaigns`, {
        config: { 
          priority: 'high',
          cache: { 
            ttl: 2 * 60 * 1000, // 2 minutes
            tags: ['campaigns'],
            staleWhileRevalidate: true
          }
        }
      });
      return response.json();
    }, {
      ttl: 2 * 60 * 1000,
      tags: ['campaigns'],
      staleWhileRevalidate: true,
      keyGenerator: () => 'campaigns:all'
    }),

    getById: cached(async (id: string): Promise<Campaign> => {
      const response = await optimizedFetch(`${API_BASE}/campaigns/${id}`, {
        config: { 
          priority: 'high',
          cache: { 
            ttl: 5 * 60 * 1000, // 5 minutes
            tags: ['campaigns', `campaign:${id}`]
          }
        }
      });
      return response.json();
    }, {
      ttl: 5 * 60 * 1000,
      tags: (id: string) => ['campaigns', `campaign:${id}`],
      keyGenerator: (id: string) => `campaigns:${id}`
    }),

    create: async (campaignData: CampaignFormData): Promise<Campaign> => {
      const response = await withRetry(() => 
        optimizedFetch(`${API_BASE}/campaigns`, {
          method: 'POST',
          body: JSON.stringify(campaignData),
          config: { priority: 'high' }
        })
      );
      
      // Invalidate campaigns cache
      cacheUtils.invalidateByTag('campaigns');
      
      return response.json();
    },

    update: async (id: string, campaignData: Partial<CampaignFormData>): Promise<Campaign> => {
      const response = await withRetry(() =>
        optimizedFetch(`${API_BASE}/campaigns/${id}`, {
          method: 'PUT',
          body: JSON.stringify(campaignData),
          config: { priority: 'high' }
        })
      );
      
      // Invalidate specific campaign and campaigns list
      cacheUtils.invalidateByTag(`campaign:${id}`);
      cacheUtils.invalidateByTag('campaigns');
      
      return response.json();
    },

    delete: async (id: string): Promise<void> => {
      await withRetry(() =>
        optimizedFetch(`${API_BASE}/campaigns/${id}`, {
          method: 'DELETE',
          config: { priority: 'normal' }
        })
      );
      
      // Invalidate caches
      cacheUtils.invalidateByTag(`campaign:${id}`);
      cacheUtils.invalidateByTag('campaigns');
    }
  },

  // Email marketing with pagination optimization
  emailMarketing: {
    getCampaigns: cached(async (page = 1, limit = 20): Promise<{ campaigns: EmailCampaign[]; total: number; hasMore: boolean }> => {
      const response = await optimizedFetch(`${API_BASE}/api/email-marketing/campaigns?page=${page}&limit=${limit}`, {
        config: { 
          cache: { 
            ttl: 3 * 60 * 1000, // 3 minutes
            tags: ['email-campaigns', `email-campaigns:page:${page}`]
          }
        }
      });
      return response.json();
    }, {
      ttl: 3 * 60 * 1000,
      tags: (page: number) => ['email-campaigns', `email-campaigns:page:${page}`],
      keyGenerator: (page: number, limit: number) => `email-campaigns:${page}:${limit}`
    }),

    getOverview: cached(async (): Promise<any> => {
      const response = await optimizedFetch(`${API_BASE}/api/email-marketing/overview`, {
        config: { 
          priority: 'high',
          cache: { 
            ttl: 5 * 60 * 1000, // 5 minutes
            tags: ['email-overview']
          }
        }
      });
      return response.json();
    }, {
      ttl: 5 * 60 * 1000,
      tags: ['email-overview'],
      keyGenerator: () => 'email-marketing:overview'
    })
  },

  // Social media with real-time optimizations
  socialMedia: {
    getAccounts: cached(async (): Promise<SocialMediaAccount[]> => {
      const response = await optimizedFetch(`${API_BASE}/api/social-media/accounts`, {
        config: { 
          cache: { 
            ttl: 10 * 60 * 1000, // 10 minutes
            tags: ['social-accounts']
          }
        }
      });
      return response.json();
    }, {
      ttl: 10 * 60 * 1000,
      tags: ['social-accounts'],
      keyGenerator: () => 'social-media:accounts'
    }),

    getAnalytics: cached(async (accountId: string, timeRange: string): Promise<any> => {
      const response = await optimizedFetch(`${API_BASE}/api/social-media/analytics/${accountId}?range=${timeRange}`, {
        config: { 
          cache: { 
            ttl: 5 * 60 * 1000, // 5 minutes
            tags: ['social-analytics', `analytics:${accountId}`],
            staleWhileRevalidate: true
          }
        }
      });
      return response.json();
    }, {
      ttl: 5 * 60 * 1000,
      tags: (accountId: string) => ['social-analytics', `analytics:${accountId}`],
      staleWhileRevalidate: true,
      keyGenerator: (accountId: string, timeRange: string) => `social-analytics:${accountId}:${timeRange}`
    })
  },

  // Team collaboration with real-time features
  collaboration: {
    getTeamMembers: cached(async (): Promise<TeamMember[]> => {
      const response = await optimizedFetch(`${API_BASE}/api/collaboration/team/members`, {
        config: { 
          cache: { 
            ttl: 30 * 1000, // 30 seconds (more frequent updates for team data)
            tags: ['team-members']
          }
        }
      });
      return response.json();
    }, {
      ttl: 30 * 1000,
      tags: ['team-members'],
      keyGenerator: () => 'collaboration:team-members'
    }),

    getOverview: cached(async (): Promise<any> => {
      const response = await optimizedFetch(`${API_BASE}/api/collaboration/overview`, {
        config: { 
          cache: { 
            ttl: 60 * 1000, // 1 minute
            tags: ['collaboration-overview']
          }
        }
      });
      return response.json();
    }, {
      ttl: 60 * 1000,
      tags: ['collaboration-overview'],
      keyGenerator: () => 'collaboration:overview'
    })
  },

  // Integrations with marketplace optimization
  integrations: {
    getApps: cached(async (category?: string): Promise<IntegrationApp[]> => {
      const url = category 
        ? `${API_BASE}/api/integrations/marketplace/apps?category=${category}`
        : `${API_BASE}/api/integrations/marketplace/apps`;
      
      const response = await optimizedFetch(url, {
        config: { 
          cache: { 
            ttl: 15 * 60 * 1000, // 15 minutes (marketplace data changes less frequently)
            tags: ['integration-apps', ...(category ? [`apps:${category}`] : [])]
          }
        }
      });
      return response.json();
    }, {
      ttl: 15 * 60 * 1000,
      tags: (category?: string) => ['integration-apps', ...(category ? [`apps:${category}`] : [])],
      keyGenerator: (category?: string) => `integrations:apps${category ? `:${category}` : ''}`
    })
  },

  // Performance monitoring endpoints
  performance: {
    recordWebVitals: async (vitalsData: any): Promise<void> => {
      // Don't cache performance recordings
      await optimizedFetch(`${API_BASE}/api/performance/web-vitals`, {
        method: 'POST',
        body: JSON.stringify(vitalsData),
        config: { priority: 'low' } // Performance data is lower priority
      });
    },

    getPerformanceInsights: cached(async (): Promise<any> => {
      const response = await optimizedFetch(`${API_BASE}/api/performance/insights`, {
        config: { 
          cache: { 
            ttl: 5 * 60 * 1000, // 5 minutes
            tags: ['performance-insights']
          }
        }
      });
      return response.json();
    }, {
      ttl: 5 * 60 * 1000,
      tags: ['performance-insights'],
      keyGenerator: () => 'performance:insights'
    })
  }
};

// Batch request optimization
export async function batchRequests<T>(
  requests: Array<() => Promise<T>>,
  batchSize = 5
): Promise<T[]> {
  const results: T[] = [];
  
  for (let i = 0; i < requests.length; i += batchSize) {
    const batch = requests.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(batch.map(request => request()));
    
    batchResults.forEach(result => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        console.warn('Batch request failed:', result.reason);
        // You might want to push null or handle differently
        results.push(null as any);
      }
    });
  }
  
  return results;
}

// Preloading utilities
export const preloader = {
  preloadCriticalData: async () => {
    // Preload most important data that's likely to be needed
    const criticalRequests = [
      () => optimizedAPI.campaigns.getAll(),
      () => optimizedAPI.emailMarketing.getOverview(),
      () => optimizedAPI.collaboration.getOverview()
    ];
    
    return batchRequests(criticalRequests, 3);
  },

  preloadUserData: async () => {
    // Preload user-specific data
    const userRequests = [
      () => optimizedAPI.socialMedia.getAccounts(),
      () => optimizedAPI.collaboration.getTeamMembers()
    ];
    
    return batchRequests(userRequests, 2);
  }
};

// Health check with performance metrics
export async function checkOptimizedAPIHealth(): Promise<{
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  cacheStats: any;
  connectionStats: any;
  features: {
    campaigns: boolean;
    analytics: boolean;
    ai: boolean;
    cache: boolean;
  };
}> {
  const startTime = Date.now();
  
  try {
    const response = await optimizedFetch(`${API_BASE}/health`, {
      config: { timeout: 5000, priority: 'high' }
    });
    const data = await response.json();
    
    return {
      status: 'healthy',
      responseTime: Date.now() - startTime,
      cacheStats: cacheUtils.getStats(),
      connectionStats: connectionManager.getStats(),
      features: {
        campaigns: true,
        analytics: true,
        ai: data.ai_services?.service_healthy || false,
        cache: true
      }
    };
  } catch (error) {
    return {
      status: 'down',
      responseTime: Date.now() - startTime,
      cacheStats: cacheUtils.getStats(),
      connectionStats: connectionManager.getStats(),
      features: {
        campaigns: false,
        analytics: false,
        ai: false,
        cache: true
      }
    };
  }
}

export { optimizedAPI, connectionManager, OptimizedAPIError };
export default optimizedAPI;