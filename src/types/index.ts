// Core application types for Autopilot Marketing Platform

export interface Lead {
  id: string;
  name: string | null;
  email: string;
  company?: string;
  source: string | null;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  name: string;
  platform: string;
  client_name: string;
  budget?: number;
  spend: number;
  status: 'active' | 'paused' | 'ended';
  metrics: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface PerformanceSnapshot {
  id: string;
  campaign_id: string;
  date: string;
  snapshot_date?: string; // For backward compatibility
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr?: number;
  cpc?: number;
  cpa?: number;
  roas?: number;
  metrics?: Record<string, unknown>; // For additional metrics
  created_at: string;
}

export interface DashboardOverview {
  total_campaigns: number;
  total_spend: number;
  recent_spend_7d: number;
  recent_conversions_7d: number;
  campaigns_by_status: Record<string, number>;
}

// Analytics and Dashboard Types
export interface AnalyticsPerformanceData {
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  ctr: number;
  cpc: number;
  cpa: number;
  roas: number;
}

export interface ROIAnalyticsData {
  campaign: string;
  platform: string;
  spend: number;
  revenue: number;
  roas: number;
  profit: number;
  margin: number;
}

export interface PlatformBreakdown {
  platform: string;
  spend: number;
  revenue: number;
  campaigns: number;
  conversions: number;
  roas: number;
}

export interface KPISummary {
  total_campaigns: number;
  active_campaigns: number;
  total_spend: number;
  total_revenue: number;
  total_conversions: number;
  average_roas: number;
  average_cpc: number;
  average_ctr: number;
}

export interface DailyKPI {
  date: string;
  spend: number;
  revenue: number;
  conversions: number;
  roas: number;
  campaigns_active: number;
}

export interface KPISummary {
  total_leads: number;
  total_campaigns: number;
  total_revenue: number;
  avg_cpa: number;
  avg_roas: number;
}

export interface DailyKPI {
  date: string;
  leads: number;
  spend: number;
  revenue: number;
  roas: number;
}

export interface HealthStatus {
  status: string;
  message: string;
  timestamp: string;
  database_connected: boolean;
  environment: string;
}

// Form types
export interface CampaignFormData {
  name: string;
  platform: string;
  client_name: string;
  budget?: number;
  spend?: number;
  status?: string;
  metrics?: Record<string, unknown>;
}

export interface LeadFormData {
  name: string;
  email: string;
  company?: string;
  source: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Error types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}