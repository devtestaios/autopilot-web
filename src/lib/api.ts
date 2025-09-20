// API Helper Functions for Autopilot Campaign Management
import type { 
  Campaign, 
  PerformanceSnapshot, 
  CampaignFormData
} from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api-1.onrender.com';

// Legacy types for backward compatibility (remove when all components updated)
export type CampaignInput = CampaignFormData;
export type PerformanceInput = {
  snapshot_date: string;
  metrics: Record<string, unknown>;
};

// Campaign API Functions
export async function fetchCampaigns(): Promise<Campaign[]> {
  const response = await fetch(`${API_BASE}/campaigns`, {
    cache: 'no-store'
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch campaigns: ${response.status}`);
  }
  return response.json();
}

export async function fetchCampaign(id: string): Promise<Campaign> {
  const response = await fetch(`${API_BASE}/campaigns/${id}`, {
    cache: 'no-store'
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch campaign: ${response.status}`);
  }
  return response.json();
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

// Aggregate performance data across all campaigns
export async function fetchOverallPerformance(days = 30): Promise<PerformanceSnapshot[]> {
  const response = await fetch(`${API_BASE}/performance?days=${days}`, {
    cache: 'no-store'
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch overall performance data: ${response.status}`);
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