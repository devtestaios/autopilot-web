// API Helper Functions for Autopilot Campaign Management

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api-1.onrender.com';

// Types matching backend models
export type Campaign = {
  id: string;
  name: string;
  platform: string;
  client_name: string;
  budget?: number;
  spend?: number;
  metrics?: Record<string, any>;
  created_at?: string;
};

export type CampaignInput = {
  name: string;
  platform: string;
  client_name: string;
  budget?: number;
  spend?: number;
  metrics?: Record<string, any>;
};

export type PerformanceSnapshot = {
  id: string;
  campaign_id: string;
  snapshot_date: string;
  metrics: Record<string, any>;
  created_at?: string;
};

export type PerformanceInput = {
  snapshot_date: string;
  metrics: Record<string, any>;
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
  } catch (error: any) {
    return {
      health: `❌ Error: ${error.message}`,
      version: '❌ Unreachable',
      database: '❌ Unreachable'
    };
  }
}