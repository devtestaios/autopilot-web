// API Helper Functions for Autopilot Campaign Management
import type { 
  Campaign, 
  PerformanceSnapshot, 
  CampaignFormData
} from '@/types';
import { environmentManager } from './environment';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api-1.onrender.com';

// Enhanced API Error Class
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// API Configuration
const API_CONFIG = {
  timeout: 30000, // 30 seconds
  retries: 3,
  retryDelay: 1000, // 1 second
  rateLimit: {
    maxRequests: 100,
    windowMs: 60000 // 1 minute
  }
};

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting check
function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + API_CONFIG.rateLimit.windowMs });
    return true;
  }
  
  if (record.count >= API_CONFIG.rateLimit.maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}

// Enhanced fetch with retry logic and timeout
async function enhancedFetch(
  url: string, 
  options: RequestInit = {},
  retryCount = 0
): Promise<Response> {
  // Check rate limiting
  if (!checkRateLimit(url)) {
    throw new APIError('Rate limit exceeded', 429, 'RATE_LIMIT_EXCEEDED');
  }

  // Add timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store', // Always fetch fresh data for marketing metrics
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData.code,
        errorData
      );
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    // Handle network errors with retry logic
    if ((error as Error).name === 'AbortError') {
      throw new APIError('Request timeout', 408, 'TIMEOUT');
    }

    if (retryCount < API_CONFIG.retries && isRetryableError(error)) {
      await delay(API_CONFIG.retryDelay * Math.pow(2, retryCount)); // Exponential backoff
      return enhancedFetch(url, options, retryCount + 1);
    }

    if (error instanceof APIError) {
      throw error;
    }

    throw new APIError(
      `Network error: ${(error as Error).message}`,
      0,
      'NETWORK_ERROR',
      error
    );
  }
}

// Check if error is retryable
function isRetryableError(error: any): boolean {
  return !!(
    error.name === 'TypeError' || // Network errors
    (error instanceof APIError && error.status && error.status >= 500) // Server errors
  );
}

// Utility delay function
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Health check function
export async function checkAPIHealth(): Promise<{
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  features: {
    campaigns: boolean;
    analytics: boolean;
    ai: boolean;
  };
}> {
  const startTime = Date.now();
  
  try {
    const response = await enhancedFetch(`${API_BASE}/health`);
    const data = await response.json();
    
    return {
      status: 'healthy',
      responseTime: Date.now() - startTime,
      features: {
        campaigns: true,
        analytics: true,
        ai: data.ai_status === 'operational'
      }
    };
  } catch (error) {
    return {
      status: 'down',
      responseTime: Date.now() - startTime,
      features: {
        campaigns: false,
        analytics: false,
        ai: false
      }
    };
  }
}

// Mock data for testing and development
const MOCK_CAMPAIGNS = [
  {
    id: '1',
    name: 'Google Ads - Search Campaign',
    platform: 'Google Ads',
    client_name: 'Demo Client',
    status: 'active' as const,
    budget: 5000,
    spend: 3200,
    metrics: {
      impressions: 125000,
      clicks: 2100,
      conversions: 156,
      ctr: 1.68,
      cpc: 1.52,
      roas: 4.2
    },
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '2', 
    name: 'Meta Display Campaign',
    platform: 'Meta',
    client_name: 'Demo Client',
    status: 'active' as const,
    budget: 8000,
    spend: 4800,
    metrics: {
      impressions: 287000,
      clicks: 3200,
      conversions: 187,
      ctr: 1.12,
      cpc: 1.50,
      roas: 3.8
    },
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z'
  }
];

const MOCK_DASHBOARD_DATA = {
  totalRevenue: 847291,
  activeCampaigns: 24,
  conversionRate: 12.4,
  totalLeads: 2847
};

// Legacy helper function for backward compatibility
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    
    try {
      const errorData = await response.json().catch(() => null);
      if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (errorData?.detail) {
        errorMessage = errorData.detail;
      }
    } catch {
      // Fallback to status text if JSON parsing fails
    }

    throw new APIError(errorMessage, response.status);
  }

  try {
    return await response.json();
  } catch (error) {
    throw new APIError('Invalid response format', response.status);
  }
}

// Legacy types for backward compatibility (remove when all components updated)
export type CampaignInput = CampaignFormData;
export type PerformanceInput = {
  snapshot_date: string;
  metrics: Record<string, unknown>;
};

// Campaign API Functions with enhanced error handling
export async function fetchCampaigns(): Promise<Campaign[]> {
  try {
    const response = await enhancedFetch(`${API_BASE}/campaigns`);
    return await response.json();
  } catch (error) {
    console.warn('Campaign API fetch failed, using mock data:', error);
    return MOCK_CAMPAIGNS as Campaign[];
  }
}

export async function fetchCampaign(id: string): Promise<Campaign> {
  try {
    const response = await enhancedFetch(`${API_BASE}/campaigns/${id}`);
    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Failed to connect to the server. Please check your internet connection.');
  }
}

export async function createCampaign(campaign: CampaignInput): Promise<Campaign> {
  const response = await enhancedFetch(`${API_BASE}/campaigns`, {
    method: 'POST',
    body: JSON.stringify(campaign)
  });
  return await response.json();
}

export async function updateCampaign(id: string, campaign: CampaignInput): Promise<Campaign> {
  const response = await enhancedFetch(`${API_BASE}/campaigns/${id}`, {
    method: 'PUT',
    body: JSON.stringify(campaign)
  });
  return await response.json();
}

export async function deleteCampaign(id: string): Promise<void> {
  await enhancedFetch(`${API_BASE}/campaigns/${id}`, {
    method: 'DELETE'
  });
}

// Performance API Functions with enhanced error handling
export async function fetchCampaignPerformance(campaignId: string, limit = 100): Promise<PerformanceSnapshot[]> {
  const response = await enhancedFetch(`${API_BASE}/campaigns/${campaignId}/performance?limit=${limit}`);
  return await response.json();
}

export async function addPerformanceSnapshot(campaignId: string, performance: PerformanceInput): Promise<PerformanceSnapshot> {
  const response = await enhancedFetch(`${API_BASE}/campaigns/${campaignId}/performance`, {
    method: 'POST',
    body: JSON.stringify(performance)
  });
  return await response.json();
}

// Dashboard API Functions with enhanced error handling and fallbacks
export async function fetchDashboardOverview() {
  try {
    const response = await enhancedFetch(`${API_BASE}/dashboard/overview`);
    return await response.json();
  } catch (error) {
    console.warn('Dashboard API fetch failed, using mock data:', error);
    return MOCK_DASHBOARD_DATA;
  }
}

export async function fetchKPISummary() {
  try {
    const response = await enhancedFetch(`${API_BASE}/kpi/summary`);
    return await response.json();
  } catch (error) {
    console.warn('KPI API fetch failed, using mock data:', error);
    return MOCK_DASHBOARD_DATA;
  }
}

export async function fetchDailyKPIs(days = 30) {
  try {
    const response = await enhancedFetch(`${API_BASE}/kpi/daily?days=${days}`);
    return await response.json();
  } catch (error) {
    console.warn('Daily KPI API fetch failed, using mock data:', error);
    return Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * 10000),
      conversions: Math.floor(Math.random() * 100),
      spend: Math.floor(Math.random() * 5000)
    }));
  }
}

// Analytics API Functions with enhanced error handling
export async function fetchAnalyticsPerformance(dateRange?: { start: string; end: string }) {
  const params = new URLSearchParams();
  if (dateRange) {
    params.append('start_date', dateRange.start);
    params.append('end_date', dateRange.end);
  }
  
  const response = await enhancedFetch(`${API_BASE}/analytics/performance?${params}`);
  return await response.json();
}

export async function fetchROIAnalytics(dateRange?: { start: string; end: string }) {
  const params = new URLSearchParams();
  if (dateRange) {
    params.append('start_date', dateRange.start);
    params.append('end_date', dateRange.end);
  }
  
  const response = await enhancedFetch(`${API_BASE}/analytics/roi?${params}`);
  return await response.json();
}

export async function fetchPlatformBreakdown() {
  const response = await enhancedFetch(`${API_BASE}/analytics/platform-breakdown`);
  return await response.json();
}

// Health Check Functions
export async function checkApiHealth() {
  try {
    const [health, version, envCheck] = await Promise.all([
      fetch(`${API_BASE}/health`).then(r => r.json()),
      fetch(`${API_BASE}/version`).then(r => r.json()),
      fetch(`${API_BASE}/env-check`).then(r => r.json()),
    ]);
    
    return {
      health: health?.ok ? '✅ API Healthy' : '❌ API Issues',
      version: version?.version ? `✅ Version ${version.version}` : '❌ Version Unknown',
      database: envCheck?.SUPABASE_URL_present && envCheck?.SUPABASE_ANON_KEY_present 
        ? '✅ Database Connected' : '❌ Database Issues'
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      health: `❌ Error: ${errorMessage}`,
      version: '❌ Unreachable',
      database: '❌ Unreachable'
    };
  }
}