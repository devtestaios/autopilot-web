// API Helper Functions for Autopilot Campaign Management
import type { 
  Campaign, 
  PerformanceSnapshot, 
  CampaignFormData
} from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api-1.onrender.com';

// Enhanced error handling for API calls
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

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

// Campaign API Functions
export async function fetchCampaigns(): Promise<Campaign[]> {
  try {
    const response = await fetch(`${API_BASE}/campaigns`, {
      cache: 'no-store'
    });
    return await handleResponse<Campaign[]>(response);
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Failed to connect to the server. Please check your internet connection.');
  }
}

export async function fetchCampaign(id: string): Promise<Campaign> {
  try {
    const response = await fetch(`${API_BASE}/campaigns/${id}`, {
      cache: 'no-store'
    });
    return await handleResponse<Campaign>(response);
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Failed to connect to the server. Please check your internet connection.');
  }
}

export async function createCampaign(campaign: CampaignInput): Promise<Campaign> {
  const response = await fetch(`${API_BASE}/campaigns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(campaign)
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Failed to create campaign: ${response.status}`);
  }
  return response.json();
}

export async function updateCampaign(id: string, campaign: CampaignInput): Promise<Campaign> {
  const response = await fetch(`${API_BASE}/campaigns/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(campaign)
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Failed to update campaign: ${response.status}`);
  }
  return response.json();
}

export async function deleteCampaign(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/campaigns/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Failed to delete campaign: ${response.status}`);
  }
}

// Performance API Functions
export async function fetchCampaignPerformance(campaignId: string, limit = 100): Promise<PerformanceSnapshot[]> {
  const response = await fetch(`${API_BASE}/campaigns/${campaignId}/performance?limit=${limit}`, {
    cache: 'no-store'
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch performance data: ${response.status}`);
  }
  return response.json();
}

export async function addPerformanceSnapshot(campaignId: string, performance: PerformanceInput): Promise<PerformanceSnapshot> {
  const response = await fetch(`${API_BASE}/campaigns/${campaignId}/performance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(performance)
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `Failed to add performance data: ${response.status}`);
  }
  return response.json();
}

// Dashboard API Functions
export async function fetchDashboardOverview() {
  const response = await fetch(`${API_BASE}/dashboard/overview`, {
    cache: 'no-store'
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard overview: ${response.status}`);
  }
  return response.json();
}

export async function fetchKPISummary() {
  const response = await fetch(`${API_BASE}/kpi/summary`, {
    cache: 'no-store'
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch KPI summary: ${response.status}`);
  }
  return response.json();
}

export async function fetchDailyKPIs(days = 30) {
  const response = await fetch(`${API_BASE}/kpi/daily?days=${days}`, {
    cache: 'no-store'
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch daily KPIs: ${response.status}`);
  }
  return response.json();
}

// Analytics API Functions
export async function fetchAnalyticsPerformance(dateRange?: { start: string; end: string }) {
  const params = new URLSearchParams();
  if (dateRange) {
    params.append('start_date', dateRange.start);
    params.append('end_date', dateRange.end);
  }
  
  const response = await fetch(`${API_BASE}/analytics/performance?${params}`, {
    cache: 'no-store'
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch analytics performance: ${response.status}`);
  }
  return response.json();
}

export async function fetchROIAnalytics(dateRange?: { start: string; end: string }) {
  const params = new URLSearchParams();
  if (dateRange) {
    params.append('start_date', dateRange.start);
    params.append('end_date', dateRange.end);
  }
  
  const response = await fetch(`${API_BASE}/analytics/roi?${params}`, {
    cache: 'no-store'
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ROI analytics: ${response.status}`);
  }
  return response.json();
}

export async function fetchPlatformBreakdown() {
  const response = await fetch(`${API_BASE}/analytics/platform-breakdown`, {
    cache: 'no-store'
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch platform breakdown: ${response.status}`);
  }
  return response.json();
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