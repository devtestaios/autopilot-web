/**
 * Pinterest Ads Platform Adapter
 * 
 * Implements the PlatformAdapter interface for Pinterest Ads,
 * providing unified access to Pinterest advertising campaigns and metrics.
 */

import {
  PlatformAdapter,
  PlatformConfig,
  PlatformCredentials,
  PlatformFeature,
  UnifiedCampaign,
  UnifiedMetrics,
  UnifiedAudience,
  CampaignStatus,
  CampaignObjective
} from './base';

// ===== PINTEREST ADS SPECIFIC TYPES =====

interface PinterestAdsCredentials extends PlatformCredentials {
  accessToken: string;
  appId: string;
  appSecret: string;
  adAccountId: string;
}

interface PinterestCampaign {
  id: string;
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  objective_type: 'AWARENESS' | 'CONSIDERATION' | 'VIDEO_VIEW' | 'WEB_CONVERSION' | 'CATALOG_SALES';
  daily_spend_cap: number;
  lifetime_spend_cap?: number;
  start_time: string;
  end_time?: string;
  created_time: string;
  updated_time: string;
}

interface PinterestMetrics {
  campaign_id: string;
  date: string;
  impressions: number;
  clicks: number;
  spend: number;
  saves: number;
  pin_clicks: number;
  outbound_clicks: number;
  conversions: number;
  conversion_value: number;
}

interface PinterestAudience {
  id: string;
  name: string;
  audience_type: 'CUSTOMER_LIST' | 'VISITOR' | 'ENGAGEMENT' | 'LOOKALIKE';
  status: 'READY' | 'PROCESSING' | 'TOO_SMALL' | 'ERROR';
  size: number;
  created_time: string;
  updated_time: string;
}

// Status mapping
const PINTEREST_STATUS_MAP: Record<string, CampaignStatus> = {
  'ACTIVE': CampaignStatus.ACTIVE,
  'PAUSED': CampaignStatus.PAUSED,
  'ARCHIVED': CampaignStatus.ENDED,
};

// Objective mapping
const PINTEREST_OBJECTIVE_MAP: Record<string, CampaignObjective> = {
  'AWARENESS': CampaignObjective.AWARENESS,
  'CONSIDERATION': CampaignObjective.ENGAGEMENT,
  'VIDEO_VIEW': CampaignObjective.VIDEO_VIEWS,
  'WEB_CONVERSION': CampaignObjective.LEADS, // Map to closest available objective
  'CATALOG_SALES': CampaignObjective.SALES, // Map to closest available objective
};

// ===== PINTEREST ADS ADAPTER =====

export class PinterestAdsAdapter implements PlatformAdapter {
  readonly config: PlatformConfig = {
    name: 'pinterest_ads',
    displayName: 'Pinterest Ads',
    supportedFeatures: [
      PlatformFeature.CAMPAIGN_MANAGEMENT,
      PlatformFeature.AUDIENCE_TARGETING,
      PlatformFeature.CONVERSION_TRACKING,
      PlatformFeature.DEMOGRAPHIC_INSIGHTS,
      PlatformFeature.CUSTOM_AUDIENCES,
      PlatformFeature.REAL_TIME_REPORTING
    ],
    requiredCredentials: [
      'accessToken',
      'appId',
      'appSecret',
      'adAccountId'
    ],
    apiEndpoint: 'https://api.pinterest.com/v5',
    rateLimit: {
      requests: 1000,
      period: 3600 // 1 hour
    }
  };

  private credentials?: PinterestAdsCredentials;
  private baseUrl: string = 'https://api.pinterest.com/v5';

  // ===== CORE INTERFACE METHODS =====

  async authenticate(credentials: PlatformCredentials): Promise<boolean> {
    try {
      this.credentials = credentials as PinterestAdsCredentials;
      const response = await this.makeRequest('/user_account', 'GET');
      return response && response.username;
    } catch (error) {
      console.error('Pinterest authentication failed:', error);
      return false;
    }
  }

  async validateCredentials(credentials: PlatformCredentials): Promise<boolean> {
    try {
      this.credentials = credentials as PinterestAdsCredentials;
      return await this.authenticate(credentials);
    } catch (error) {
      console.error('Pinterest credentials validation failed:', error);
      return false;
    }
  }

  async getCampaigns(limit: number = 25, offset: number = 0): Promise<UnifiedCampaign[]> {
    if (!this.credentials) {
      throw new Error('Pinterest credentials not configured');
    }

    try {
      const params = new URLSearchParams({
        entity_statuses: 'ACTIVE,PAUSED,ARCHIVED',
        limit: limit.toString(),
        offset: offset.toString()
      });

      const response = await this.makeRequest(
        `/ad_accounts/${this.credentials.adAccountId}/campaigns?${params}`, 
        'GET'
      );

      const campaigns = response.items || [];
      return campaigns.map((campaign: PinterestCampaign) => this.convertToUnifiedCampaign(campaign));
    } catch (error) {
      console.error('Failed to fetch Pinterest campaigns:', error);
      return [];
    }
  }

  async getCampaign(campaignId: string): Promise<UnifiedCampaign> {
    if (!this.credentials) {
      throw new Error('Pinterest credentials not configured');
    }

    try {
      const response = await this.makeRequest(
        `/ad_accounts/${this.credentials.adAccountId}/campaigns/${campaignId}`,
        'GET'
      );

      return this.convertToUnifiedCampaign(response);
    } catch (error) {
      console.error('Failed to fetch Pinterest campaign:', error);
      throw error;
    }
  }

  async createCampaign(campaign: Partial<UnifiedCampaign>): Promise<UnifiedCampaign> {
    if (!this.credentials) {
      throw new Error('Pinterest credentials not configured');
    }

    try {
      const pinterestCampaign = {
        name: campaign.name,
        status: campaign.status === CampaignStatus.ACTIVE ? 'ACTIVE' : 'PAUSED',
        objective_type: this.mapObjectiveToPinterest(campaign.objective),
        daily_spend_cap: campaign.budget?.amount || 1000,
      };

      const response = await this.makeRequest(
        `/ad_accounts/${this.credentials.adAccountId}/campaigns`,
        'POST',
        pinterestCampaign
      );

      return this.convertToUnifiedCampaign(response);
    } catch (error) {
      console.error('Failed to create Pinterest campaign:', error);
      throw error;
    }
  }

  async updateCampaign(campaignId: string, updates: Partial<UnifiedCampaign>): Promise<UnifiedCampaign> {
    if (!this.credentials) {
      throw new Error('Pinterest credentials not configured');
    }

    try {
      const pinterestUpdates: any = {};
      
      if (updates.name) pinterestUpdates.name = updates.name;
      if (updates.status) pinterestUpdates.status = updates.status === CampaignStatus.ACTIVE ? 'ACTIVE' : 'PAUSED';
      if (updates.budget?.amount) pinterestUpdates.daily_spend_cap = updates.budget.amount;

      const response = await this.makeRequest(
        `/ad_accounts/${this.credentials.adAccountId}/campaigns/${campaignId}`,
        'PATCH',
        pinterestUpdates
      );

      return this.convertToUnifiedCampaign(response);
    } catch (error) {
      console.error('Failed to update Pinterest campaign:', error);
      throw error;
    }
  }

  async deleteCampaign(campaignId: string): Promise<boolean> {
    if (!this.credentials) {
      throw new Error('Pinterest credentials not configured');
    }

    try {
      await this.makeRequest(
        `/ad_accounts/${this.credentials.adAccountId}/campaigns/${campaignId}`,
        'DELETE'
      );
      return true;
    } catch (error) {
      console.error('Failed to delete Pinterest campaign:', error);
      return false;
    }
  }

  async pauseCampaign(campaignId: string): Promise<boolean> {
    try {
      await this.updateCampaign(campaignId, { status: CampaignStatus.PAUSED });
      return true;
    } catch (error) {
      console.error('Failed to pause Pinterest campaign:', error);
      return false;
    }
  }

  async resumeCampaign(campaignId: string): Promise<boolean> {
    try {
      await this.updateCampaign(campaignId, { status: CampaignStatus.ACTIVE });
      return true;
    } catch (error) {
      console.error('Failed to resume Pinterest campaign:', error);
      return false;
    }
  }

  async getMetrics(
    campaignId: string,
    startDate: string,
    endDate: string,
    granularity: 'daily' | 'weekly' | 'monthly' = 'daily'
  ): Promise<UnifiedMetrics[]> {
    if (!this.credentials) {
      throw new Error('Pinterest credentials not configured');
    }

    try {
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        granularity: granularity.toUpperCase(),
        columns: 'IMPRESSION,CLICKTHROUGH,SPEND,PIN_CLICK,OUTBOUND_CLICK,SAVE,TOTAL_CONVERSIONS,TOTAL_CONVERSION_VALUE'
      });

      const response = await this.makeRequest(
        `/ad_accounts/${this.credentials.adAccountId}/campaigns/analytics?campaign_ids=${campaignId}&${params}`,
        'GET'
      );

      const metrics = response.items || [];
      return metrics.map((metric: any) => this.convertToUnifiedMetrics(metric, campaignId));
    } catch (error) {
      console.error('Failed to fetch Pinterest metrics:', error);
      return [];
    }
  }

  async getAccountMetrics(
    startDate: string,
    endDate: string,
    granularity: 'daily' | 'weekly' | 'monthly' = 'daily'
  ): Promise<UnifiedMetrics[]> {
    if (!this.credentials) {
      throw new Error('Pinterest credentials not configured');
    }

    try {
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        granularity: granularity.toUpperCase(),
        columns: 'IMPRESSION,CLICKTHROUGH,SPEND,PIN_CLICK,OUTBOUND_CLICK,SAVE,TOTAL_CONVERSIONS,TOTAL_CONVERSION_VALUE'
      });

      const response = await this.makeRequest(
        `/ad_accounts/${this.credentials.adAccountId}/analytics?${params}`,
        'GET'
      );

      const metrics = response.items || [];
      return metrics.map((metric: any) => this.convertToUnifiedMetrics(metric, 'account'));
    } catch (error) {
      console.error('Failed to fetch Pinterest account metrics:', error);
      return [];
    }
  }

  async getAudiences(): Promise<UnifiedAudience[]> {
    if (!this.credentials) {
      throw new Error('Pinterest credentials not configured');
    }

    try {
      const response = await this.makeRequest(
        `/ad_accounts/${this.credentials.adAccountId}/audiences`,
        'GET'
      );

      const audiences = response.items || [];
      return audiences.map((audience: PinterestAudience) => this.convertToUnifiedAudience(audience));
    } catch (error) {
      console.error('Failed to fetch Pinterest audiences:', error);
      return [];
    }
  }

  async createAudience(audience: Partial<UnifiedAudience>): Promise<UnifiedAudience> {
    if (!this.credentials) {
      throw new Error('Pinterest credentials not configured');
    }

    try {
      const pinterestAudience = {
        name: audience.name,
        audience_type: audience.type?.toUpperCase() || 'CUSTOMER_LIST',
      };

      const response = await this.makeRequest(
        `/ad_accounts/${this.credentials.adAccountId}/audiences`,
        'POST',
        pinterestAudience
      );

      return this.convertToUnifiedAudience(response);
    } catch (error) {
      console.error('Failed to create Pinterest audience:', error);
      throw error;
    }
  }

  // ===== HELPER METHODS =====

  private async makeRequest(endpoint: string, method: string, data?: any): Promise<any> {
    if (!this.credentials) {
      throw new Error('Pinterest credentials not configured');
    }

    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.credentials.accessToken}`,
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      method,
      headers,
    };

    if (data && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`Pinterest API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  private convertToUnifiedCampaign(pinterestCampaign: PinterestCampaign): UnifiedCampaign {
    return {
      id: pinterestCampaign.id,
      platformId: 'pinterest_ads',
      platformCampaignId: pinterestCampaign.id,
      name: pinterestCampaign.name,
      status: PINTEREST_STATUS_MAP[pinterestCampaign.status] || CampaignStatus.PAUSED,
      objective: PINTEREST_OBJECTIVE_MAP[pinterestCampaign.objective_type] || CampaignObjective.AWARENESS,
      budget: {
        amount: pinterestCampaign.daily_spend_cap,
        currency: 'USD',
        type: 'daily'
      },
      targeting: {},
      schedule: pinterestCampaign.start_time ? {
        startDate: pinterestCampaign.start_time,
        endDate: pinterestCampaign.end_time
      } : undefined,
      createdAt: pinterestCampaign.created_time,
      updatedAt: pinterestCampaign.updated_time,
      platformSpecific: pinterestCampaign
    };
  }

  private convertToUnifiedMetrics(pinterestMetrics: any, campaignId: string): UnifiedMetrics {
    const impressions = pinterestMetrics.IMPRESSION || 0;
    const clicks = pinterestMetrics.CLICKTHROUGH || 0;
    const spend = pinterestMetrics.SPEND || 0;
    const conversions = pinterestMetrics.TOTAL_CONVERSIONS || 0;

    return {
      campaignId,
      platformId: 'pinterest_ads',
      date: pinterestMetrics.date || new Date().toISOString().split('T')[0],
      impressions,
      clicks,
      conversions,
      spend,
      currency: 'USD',
      ctr: impressions > 0 ? clicks / impressions : 0,
      cpc: clicks > 0 ? spend / clicks : 0,
      cpm: impressions > 0 ? (spend / impressions) * 1000 : 0,
      cpa: conversions > 0 ? spend / conversions : 0,
      roas: spend > 0 ? (pinterestMetrics.TOTAL_CONVERSION_VALUE || 0) / spend : 0,
      platformMetrics: {
        pin_clicks: pinterestMetrics.PIN_CLICK || 0,
        outbound_clicks: pinterestMetrics.OUTBOUND_CLICK || 0,
        saves: pinterestMetrics.SAVE || 0,
        conversion_value: pinterestMetrics.TOTAL_CONVERSION_VALUE || 0
      }
    };
  }

  private convertToUnifiedAudience(pinterestAudience: PinterestAudience): UnifiedAudience {
    return {
      id: pinterestAudience.id,
      platformId: 'pinterest_ads',
      platformAudienceId: pinterestAudience.id,
      name: pinterestAudience.name,
      type: pinterestAudience.audience_type.toLowerCase() as any,
      size: pinterestAudience.size,
      createdAt: pinterestAudience.created_time,
      updatedAt: pinterestAudience.updated_time
    };
  }

  private mapObjectiveToPinterest(objective?: CampaignObjective): string {
    switch (objective) {
      case CampaignObjective.AWARENESS: return 'AWARENESS';
      case CampaignObjective.ENGAGEMENT: return 'CONSIDERATION';
      case CampaignObjective.VIDEO_VIEWS: return 'VIDEO_VIEW';
      case CampaignObjective.LEADS: return 'WEB_CONVERSION';
      case CampaignObjective.SALES: return 'CATALOG_SALES';
      default: return 'AWARENESS';
    }
  }
}