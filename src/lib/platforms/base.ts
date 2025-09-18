/**
 * Base Platform Integration Architecture
 * 
 * This file defines the abstract interfaces and types that all advertising platforms
 * must implement. This creates a consistent API across Google Ads, Meta, LinkedIn, etc.
 */

// ===== CORE TYPES =====

export interface PlatformCredentials {
  [key: string]: string | number | boolean;
}

export interface PlatformConfig {
  name: string;
  displayName: string;
  supportedFeatures: PlatformFeature[];
  requiredCredentials: string[];
  apiEndpoint?: string;
  rateLimit?: {
    requests: number;
    period: number; // in seconds
  };
}

export enum PlatformFeature {
  CAMPAIGN_MANAGEMENT = 'campaign_management',
  AUDIENCE_TARGETING = 'audience_targeting',
  AUTOMATED_BIDDING = 'automated_bidding',
  CONVERSION_TRACKING = 'conversion_tracking',
  A_B_TESTING = 'a_b_testing',
  DEMOGRAPHIC_INSIGHTS = 'demographic_insights',
  CUSTOM_AUDIENCES = 'custom_audiences',
  LOOKALIKE_AUDIENCES = 'lookalike_audiences',
  REAL_TIME_REPORTING = 'real_time_reporting',
  BULK_OPERATIONS = 'bulk_operations'
}

export enum CampaignStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  ENDED = 'ended',
  PENDING = 'pending',
  DRAFT = 'draft'
}

export enum CampaignObjective {
  AWARENESS = 'awareness',
  TRAFFIC = 'traffic',
  ENGAGEMENT = 'engagement',
  LEADS = 'leads',
  SALES = 'sales',
  APP_PROMOTION = 'app_promotion',
  VIDEO_VIEWS = 'video_views',
  STORE_VISITS = 'store_visits'
}

// ===== UNIFIED DATA MODELS =====

export interface UnifiedCampaign {
  id: string;
  platformId: string; // google_ads, meta, linkedin, etc.
  platformCampaignId: string; // Original platform's campaign ID
  name: string;
  status: CampaignStatus;
  objective: CampaignObjective;
  budget: {
    amount: number;
    currency: string;
    type: 'daily' | 'lifetime';
  };
  targeting: {
    locations?: string[];
    demographics?: {
      ageMin?: number;
      ageMax?: number;
      genders?: string[];
    };
    interests?: string[];
    behaviors?: string[];
    customAudiences?: string[];
  };
  schedule?: {
    startDate: string;
    endDate?: string;
    dayParting?: {
      [day: string]: { start: string; end: string }[];
    };
  };
  createdAt: string;
  updatedAt: string;
  platformSpecific?: Record<string, any>; // Platform-specific fields
}

export interface UnifiedMetrics {
  campaignId: string;
  platformId: string;
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  currency: string;
  
  // Calculated metrics
  ctr: number; // Click-through rate
  cpc: number; // Cost per click
  cpm: number; // Cost per mille (1000 impressions)
  cpa: number; // Cost per acquisition
  roas: number; // Return on ad spend
  
  // Platform-specific metrics
  platformMetrics?: Record<string, number>;
}

export interface UnifiedAudience {
  id: string;
  platformId: string;
  platformAudienceId: string;
  name: string;
  type: 'custom' | 'lookalike' | 'saved' | 'interest';
  size?: number;
  description?: string;
  targeting?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// ===== PLATFORM INTERFACE =====

export interface PlatformAdapter {
  // Platform identification
  readonly config: PlatformConfig;
  
  // Authentication & Setup
  authenticate(credentials: PlatformCredentials): Promise<boolean>;
  validateCredentials(credentials: PlatformCredentials): Promise<boolean>;
  
  // Campaign Management
  getCampaigns(limit?: number, offset?: number): Promise<UnifiedCampaign[]>;
  getCampaign(campaignId: string): Promise<UnifiedCampaign>;
  createCampaign(campaign: Partial<UnifiedCampaign>): Promise<UnifiedCampaign>;
  updateCampaign(campaignId: string, updates: Partial<UnifiedCampaign>): Promise<UnifiedCampaign>;
  deleteCampaign(campaignId: string): Promise<boolean>;
  
  // Campaign Control
  pauseCampaign(campaignId: string): Promise<boolean>;
  resumeCampaign(campaignId: string): Promise<boolean>;
  
  // Performance Data
  getMetrics(
    campaignId: string, 
    startDate: string, 
    endDate: string,
    granularity?: 'daily' | 'weekly' | 'monthly'
  ): Promise<UnifiedMetrics[]>;
  
  getAccountMetrics(
    startDate: string, 
    endDate: string,
    granularity?: 'daily' | 'weekly' | 'monthly'
  ): Promise<UnifiedMetrics[]>;
  
  // Audience Management (if supported)
  getAudiences?(): Promise<UnifiedAudience[]>;
  createAudience?(audience: Partial<UnifiedAudience>): Promise<UnifiedAudience>;
  
  // Platform-specific operations
  executeCustomOperation?(operation: string, params: Record<string, any>): Promise<any>;
}

// ===== PLATFORM REGISTRY =====

export class PlatformRegistry {
  private platforms = new Map<string, PlatformAdapter>();
  private credentials = new Map<string, PlatformCredentials>();
  
  register(platformId: string, adapter: PlatformAdapter): void {
    this.platforms.set(platformId, adapter);
  }
  
  unregister(platformId: string): void {
    this.platforms.delete(platformId);
    this.credentials.delete(platformId);
  }
  
  get(platformId: string): PlatformAdapter | undefined {
    return this.platforms.get(platformId);
  }
  
  getAll(): PlatformAdapter[] {
    return Array.from(this.platforms.values());
  }
  
  getAvailable(): PlatformAdapter[] {
    return Array.from(this.platforms.values()).filter(platform => 
      this.credentials.has(platform.config.name)
    );
  }
  
  async setCredentials(platformId: string, credentials: PlatformCredentials): Promise<boolean> {
    const platform = this.platforms.get(platformId);
    if (!platform) {
      throw new Error(`Platform ${platformId} not registered`);
    }
    
    const isValid = await platform.validateCredentials(credentials);
    if (isValid) {
      this.credentials.set(platformId, credentials);
      await platform.authenticate(credentials);
    }
    return isValid;
  }
  
  getCredentials(platformId: string): PlatformCredentials | undefined {
    return this.credentials.get(platformId);
  }
  
  hasCredentials(platformId: string): boolean {
    return this.credentials.has(platformId);
  }
}

// ===== UTILITY FUNCTIONS =====

export function validateUnifiedCampaign(campaign: Partial<UnifiedCampaign>): string[] {
  const errors: string[] = [];
  
  if (!campaign.name || campaign.name.trim().length === 0) {
    errors.push('Campaign name is required');
  }
  
  if (!campaign.platformId) {
    errors.push('Platform ID is required');
  }
  
  if (!campaign.budget || campaign.budget.amount <= 0) {
    errors.push('Budget amount must be greater than 0');
  }
  
  if (!campaign.budget?.currency) {
    errors.push('Budget currency is required');
  }
  
  if (!campaign.objective) {
    errors.push('Campaign objective is required');
  }
  
  return errors;
}

export function calculateDerivedMetrics(metrics: Partial<UnifiedMetrics>): Partial<UnifiedMetrics> {
  const derived = { ...metrics };
  
  if (metrics.clicks && metrics.impressions) {
    derived.ctr = metrics.clicks / metrics.impressions;
  }
  
  if (metrics.spend && metrics.clicks) {
    derived.cpc = metrics.spend / metrics.clicks;
  }
  
  if (metrics.spend && metrics.impressions) {
    derived.cpm = (metrics.spend / metrics.impressions) * 1000;
  }
  
  if (metrics.spend && metrics.conversions) {
    derived.cpa = metrics.spend / metrics.conversions;
  }
  
  // ROAS calculation would need revenue data, which varies by platform
  
  return derived;
}

export function normalizePlatformData<T>(
  platformData: any,
  mapping: Record<string, string>
): Partial<T> {
  const normalized: any = {};
  
  for (const [unifiedField, platformField] of Object.entries(mapping)) {
    if (platformData[platformField] !== undefined) {
      normalized[unifiedField] = platformData[platformField];
    }
  }
  
  return normalized;
}

// ===== GLOBAL REGISTRY INSTANCE =====

export const platformRegistry = new PlatformRegistry();