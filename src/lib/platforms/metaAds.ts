/**
 * Meta Ads Platform Adapter
 * 
 * Implements the PlatformAdapter interface for Meta (Facebook/Instagram) Ads,
 * providing unified access to Meta advertising campaigns and metrics.
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
  CampaignObjective,
  calculateDerivedMetrics,
  normalizePlatformData
} from './base';

// ===== META ADS SPECIFIC TYPES =====

interface MetaAdsCredentials extends PlatformCredentials {
  accessToken: string;
  appId: string;
  appSecret: string;
  adAccountId: string;
}

interface MetaCampaign {
  id: string;
  name: string;
  status: string;
  objective: string;
  daily_budget?: string;
  lifetime_budget?: string;
  budget_remaining?: string;
  start_time?: string;
  stop_time?: string;
  targeting?: {
    geo_locations?: any;
    age_min?: number;
    age_max?: number;
    genders?: number[];
    interests?: any[];
    behaviors?: any[];
    custom_audiences?: any[];
  };
  created_time: string;
  updated_time: string;
}

interface MetaInsights {
  campaign_id: string;
  date_start: string;
  date_stop: string;
  impressions: string;
  clicks: string;
  spend: string;
  actions?: Array<{
    action_type: string;
    value: string;
  }>;
  ctr: string;
  cpc: string;
  cpm: string;
  cpp: string;
  reach?: string;
  frequency?: string;
  video_views?: string;
  video_view_rate?: string;
}

// ===== FIELD MAPPINGS =====

const CAMPAIGN_STATUS_MAP: Record<string, CampaignStatus> = {
  'ACTIVE': CampaignStatus.ACTIVE,
  'PAUSED': CampaignStatus.PAUSED,
  'DELETED': CampaignStatus.ENDED,
  'ARCHIVED': CampaignStatus.ENDED,
  'IN_PROCESS': CampaignStatus.PENDING,
  'WITH_ISSUES': CampaignStatus.PAUSED
};

const CAMPAIGN_OBJECTIVE_MAP: Record<string, CampaignObjective> = {
  'BRAND_AWARENESS': CampaignObjective.AWARENESS,
  'REACH': CampaignObjective.AWARENESS,
  'TRAFFIC': CampaignObjective.TRAFFIC,
  'ENGAGEMENT': CampaignObjective.ENGAGEMENT,
  'APP_INSTALLS': CampaignObjective.APP_PROMOTION,
  'VIDEO_VIEWS': CampaignObjective.VIDEO_VIEWS,
  'LEAD_GENERATION': CampaignObjective.LEADS,
  'MESSAGES': CampaignObjective.LEADS,
  'CONVERSIONS': CampaignObjective.SALES,
  'CATALOG_SALES': CampaignObjective.SALES,
  'STORE_VISITS': CampaignObjective.STORE_VISITS
};

const REVERSE_OBJECTIVE_MAP: Record<CampaignObjective, string> = {
  [CampaignObjective.AWARENESS]: 'BRAND_AWARENESS',
  [CampaignObjective.TRAFFIC]: 'TRAFFIC',
  [CampaignObjective.ENGAGEMENT]: 'ENGAGEMENT',
  [CampaignObjective.APP_PROMOTION]: 'APP_INSTALLS',
  [CampaignObjective.VIDEO_VIEWS]: 'VIDEO_VIEWS',
  [CampaignObjective.LEADS]: 'LEAD_GENERATION',
  [CampaignObjective.SALES]: 'CONVERSIONS',
  [CampaignObjective.STORE_VISITS]: 'STORE_VISITS',
  [CampaignObjective.CONVERSIONS]: 'CONVERSIONS',
  [CampaignObjective.CATALOG_SALES]: 'CATALOG_SALES'
};

// ===== META ADS ADAPTER =====

export class MetaAdsAdapter implements PlatformAdapter {
  readonly config: PlatformConfig = {
    name: 'meta_ads',
    displayName: 'Meta Ads',
    supportedFeatures: [
      PlatformFeature.CAMPAIGN_MANAGEMENT,
      PlatformFeature.AUDIENCE_TARGETING,
      PlatformFeature.AUTOMATED_BIDDING,
      PlatformFeature.CONVERSION_TRACKING,
      PlatformFeature.A_B_TESTING,
      PlatformFeature.DEMOGRAPHIC_INSIGHTS,
      PlatformFeature.CUSTOM_AUDIENCES,
      PlatformFeature.LOOKALIKE_AUDIENCES,
      PlatformFeature.REAL_TIME_REPORTING,
      PlatformFeature.BULK_OPERATIONS
    ],
    requiredCredentials: [
      'accessToken',
      'appId',
      'appSecret', 
      'adAccountId'
    ],
    apiEndpoint: 'https://graph.facebook.com/v18.0',
    rateLimit: {
      requests: 200,
      period: 3600 // 1 hour
    }
  };

  private credentials?: MetaAdsCredentials;

  // ===== AUTHENTICATION =====

  async authenticate(credentials: PlatformCredentials): Promise<boolean> {
    try {
      this.credentials = credentials as MetaAdsCredentials;
      
      // Test authentication by making a simple API call
      const response = await this.makeApiRequest('me', { fields: 'id,name' });
      return !!response.id;
    } catch (error) {
      console.error('Meta Ads authentication failed:', error);
      return false;
    }
  }

  async validateCredentials(credentials: PlatformCredentials): Promise<boolean> {
    const required = this.config.requiredCredentials;
    return required.every(field => 
      credentials[field] && 
      typeof credentials[field] === 'string' && 
      (credentials[field] as string).length > 0
    );
  }

  private async makeApiRequest(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    if (!this.credentials) {
      throw new Error('Not authenticated');
    }

    const url = new URL(`${this.config.apiEndpoint}/${endpoint}`);
    url.searchParams.append('access_token', this.credentials.accessToken);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Meta API error: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    return response.json();
  }

  private async makeApiPostRequest(endpoint: string, data: Record<string, any>): Promise<any> {
    if (!this.credentials) {
      throw new Error('Not authenticated');
    }

    const url = `${this.config.apiEndpoint}/${endpoint}`;
    
    const formData = new FormData();
    formData.append('access_token', this.credentials.accessToken);
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value.toString());
      }
    });

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Meta API error: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    return response.json();
  }

  // ===== CAMPAIGN MANAGEMENT =====

  async getCampaigns(limit = 100, offset = 0): Promise<UnifiedCampaign[]> {
    const adAccountId = `act_${this.credentials!.adAccountId}`;
    
    const response = await this.makeApiRequest(`${adAccountId}/campaigns`, {
      fields: [
        'id', 'name', 'status', 'objective', 'daily_budget', 'lifetime_budget',
        'budget_remaining', 'start_time', 'stop_time', 'targeting', 
        'created_time', 'updated_time'
      ].join(','),
      limit,
      offset
    });

    return response.data?.map((campaign: MetaCampaign) => this.convertToUnifiedCampaign(campaign)) || [];
  }

  async getCampaign(campaignId: string): Promise<UnifiedCampaign> {
    // Remove platform prefix if present
    const metaCampaignId = campaignId.replace('meta_ads_', '');
    
    const response = await this.makeApiRequest(metaCampaignId, {
      fields: [
        'id', 'name', 'status', 'objective', 'daily_budget', 'lifetime_budget',
        'budget_remaining', 'start_time', 'stop_time', 'targeting', 
        'created_time', 'updated_time'
      ].join(',')
    });

    return this.convertToUnifiedCampaign(response);
  }

  async createCampaign(campaign: Partial<UnifiedCampaign>): Promise<UnifiedCampaign> {
    const adAccountId = `act_${this.credentials!.adAccountId}`;
    
    const metaCampaign = this.convertFromUnifiedCampaign(campaign);

    const response = await this.makeApiPostRequest(`${adAccountId}/campaigns`, metaCampaign);

    return this.getCampaign(response.id);
  }

  async updateCampaign(campaignId: string, updates: Partial<UnifiedCampaign>): Promise<UnifiedCampaign> {
    const metaCampaignId = campaignId.replace('meta_ads_', '');
    const metaUpdates = this.convertFromUnifiedCampaign(updates);

    await this.makeApiPostRequest(metaCampaignId, metaUpdates);

    return this.getCampaign(campaignId);
  }

  async deleteCampaign(campaignId: string): Promise<boolean> {
    try {
      const metaCampaignId = campaignId.replace('meta_ads_', '');
      
      await this.makeApiPostRequest(metaCampaignId, {
        status: 'DELETED'
      });
      
      return true;
    } catch (error) {
      console.error('Failed to delete campaign:', error);
      return false;
    }
  }

  // ===== CAMPAIGN CONTROL =====

  async pauseCampaign(campaignId: string): Promise<boolean> {
    try {
      await this.updateCampaign(campaignId, { status: CampaignStatus.PAUSED });
      return true;
    } catch (error) {
      console.error('Failed to pause campaign:', error);
      return false;
    }
  }

  async resumeCampaign(campaignId: string): Promise<boolean> {
    try {
      await this.updateCampaign(campaignId, { status: CampaignStatus.ACTIVE });
      return true;
    } catch (error) {
      console.error('Failed to resume campaign:', error);
      return false;
    }
  }

  // ===== PERFORMANCE DATA =====

  async getMetrics(
    campaignId: string,
    startDate: string,
    endDate: string,
    granularity: 'daily' | 'weekly' | 'monthly' = 'daily'
  ): Promise<UnifiedMetrics[]> {
    const metaCampaignId = campaignId.replace('meta_ads_', '');
    
    const timeIncrement = granularity === 'daily' ? 1 : 
                         granularity === 'weekly' ? 7 : 
                         granularity === 'monthly' ? 'monthly' : 1;

    const response = await this.makeApiRequest(`${metaCampaignId}/insights`, {
      fields: [
        'campaign_id', 'date_start', 'date_stop', 'impressions', 'clicks', 
        'spend', 'actions', 'ctr', 'cpc', 'cpm', 'cpp', 'reach', 'frequency',
        'video_views', 'video_view_rate'
      ].join(','),
      time_range: `{"since":"${startDate}","until":"${endDate}"}`,
      time_increment: timeIncrement,
      level: 'campaign'
    });

    return response.data?.map((insight: MetaInsights) => this.convertToUnifiedMetrics(insight)) || [];
  }

  async getAccountMetrics(
    startDate: string,
    endDate: string,
    granularity: 'daily' | 'weekly' | 'monthly' = 'daily'
  ): Promise<UnifiedMetrics[]> {
    const adAccountId = `act_${this.credentials!.adAccountId}`;
    
    const timeIncrement = granularity === 'daily' ? 1 : 
                         granularity === 'weekly' ? 7 : 
                         granularity === 'monthly' ? 'monthly' : 1;

    const response = await this.makeApiRequest(`${adAccountId}/insights`, {
      fields: [
        'date_start', 'date_stop', 'impressions', 'clicks', 
        'spend', 'actions', 'ctr', 'cpc', 'cpm', 'cpp', 'reach', 'frequency',
        'video_views', 'video_view_rate'
      ].join(','),
      time_range: `{"since":"${startDate}","until":"${endDate}"}`,
      time_increment: timeIncrement,
      level: 'account'
    });

    return response.data?.map((insight: MetaInsights) => {
      const unified = this.convertToUnifiedMetrics(insight);
      unified.campaignId = 'account';
      return unified;
    }) || [];
  }

  // ===== AUDIENCE MANAGEMENT =====

  async getAudiences(): Promise<UnifiedAudience[]> {
    const adAccountId = `act_${this.credentials!.adAccountId}`;
    
    const response = await this.makeApiRequest(`${adAccountId}/customaudiences`, {
      fields: [
        'id', 'name', 'description', 'approximate_count_lower_bound', 
        'approximate_count_upper_bound', 'subtype', 'created_time', 'updated_time'
      ].join(',')
    });

    return response.data?.map((audience: any) => this.convertToUnifiedAudience(audience)) || [];
  }

  async createAudience(audience: Partial<UnifiedAudience>): Promise<UnifiedAudience> {
    const adAccountId = `act_${this.credentials!.adAccountId}`;
    
    const metaAudience = {
      name: audience.name,
      description: audience.description,
      subtype: audience.type === 'custom' ? 'CUSTOM' : 'LOOKALIKE'
    };

    const response = await this.makeApiPostRequest(`${adAccountId}/customaudiences`, metaAudience);
    
    return {
      id: `meta_ads_${response.id}`,
      platformId: this.config.name,
      platformAudienceId: response.id,
      name: audience.name!,
      type: audience.type!,
      description: audience.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // ===== CONVERSION HELPERS =====

  private convertToUnifiedCampaign(metaCampaign: MetaCampaign): UnifiedCampaign {
    const budgetAmount = metaCampaign.daily_budget ? 
      parseFloat(metaCampaign.daily_budget) / 100 : // Meta returns budget in cents
      parseFloat(metaCampaign.lifetime_budget || '0') / 100;
    
    const budgetType = metaCampaign.daily_budget ? 'daily' : 'lifetime';

    return {
      id: `meta_ads_${metaCampaign.id}`,
      platformId: this.config.name,
      platformCampaignId: metaCampaign.id,
      name: metaCampaign.name,
      status: CAMPAIGN_STATUS_MAP[metaCampaign.status] || CampaignStatus.DRAFT,
      objective: CAMPAIGN_OBJECTIVE_MAP[metaCampaign.objective] || CampaignObjective.TRAFFIC,
      budget: {
        amount: budgetAmount,
        currency: 'USD', // Meta API uses account currency
        type: budgetType
      },
      targeting: {
        locations: metaCampaign.targeting?.geo_locations?.countries || [],
        demographics: {
          ageMin: metaCampaign.targeting?.age_min,
          ageMax: metaCampaign.targeting?.age_max,
          genders: metaCampaign.targeting?.genders?.map(g => g === 1 ? 'male' : 'female')
        },
        interests: metaCampaign.targeting?.interests?.map(i => i.name) || [],
        behaviors: metaCampaign.targeting?.behaviors?.map(b => b.name) || [],
        customAudiences: metaCampaign.targeting?.custom_audiences?.map(a => a.id) || []
      },
      schedule: {
        startDate: metaCampaign.start_time ? metaCampaign.start_time.split('T')[0] : new Date().toISOString().split('T')[0],
        endDate: metaCampaign.stop_time ? metaCampaign.stop_time.split('T')[0] : undefined
      },
      createdAt: metaCampaign.created_time,
      updatedAt: metaCampaign.updated_time,
      platformSpecific: {
        budgetRemaining: metaCampaign.budget_remaining ? parseFloat(metaCampaign.budget_remaining) / 100 : undefined,
        metaObjective: metaCampaign.objective
      }
    };
  }

  private convertFromUnifiedCampaign(campaign: Partial<UnifiedCampaign>): any {
    const metaCampaign: any = {};

    if (campaign.name) {
      metaCampaign.name = campaign.name;
    }

    if (campaign.status) {
      const metaStatus = Object.entries(CAMPAIGN_STATUS_MAP)
        .find(([, unifiedStatus]) => unifiedStatus === campaign.status)?.[0];
      if (metaStatus) {
        metaCampaign.status = metaStatus;
      }
    }

    if (campaign.objective) {
      const metaObjective = REVERSE_OBJECTIVE_MAP[campaign.objective];
      if (metaObjective) {
        metaCampaign.objective = metaObjective;
      }
    }

    if (campaign.budget) {
      const budgetCents = Math.round(campaign.budget.amount * 100);
      if (campaign.budget.type === 'daily') {
        metaCampaign.daily_budget = budgetCents.toString();
      } else {
        metaCampaign.lifetime_budget = budgetCents.toString();
      }
    }

    if (campaign.schedule?.startDate) {
      metaCampaign.start_time = `${campaign.schedule.startDate}T00:00:00+0000`;
    }

    if (campaign.schedule?.endDate) {
      metaCampaign.stop_time = `${campaign.schedule.endDate}T23:59:59+0000`;
    }

    if (campaign.targeting) {
      const targeting: any = {};
      
      if (campaign.targeting.locations?.length) {
        targeting.geo_locations = {
          countries: campaign.targeting.locations
        };
      }
      
      if (campaign.targeting.demographics) {
        if (campaign.targeting.demographics.ageMin) {
          targeting.age_min = campaign.targeting.demographics.ageMin;
        }
        if (campaign.targeting.demographics.ageMax) {
          targeting.age_max = campaign.targeting.demographics.ageMax;
        }
        if (campaign.targeting.demographics.genders?.length) {
          targeting.genders = campaign.targeting.demographics.genders.map(g => g === 'male' ? 1 : 2);
        }
      }
      
      if (Object.keys(targeting).length > 0) {
        metaCampaign.targeting = targeting;
      }
    }

    return metaCampaign;
  }

  private convertToUnifiedMetrics(metaInsight: MetaInsights): UnifiedMetrics {
    const conversions = metaInsight.actions?.find(action => 
      ['offsite_conversion.fb_pixel_purchase', 'app_install', 'lead'].includes(action.action_type)
    )?.value || '0';

    const baseMetrics = {
      campaignId: `meta_ads_${metaInsight.campaign_id}`,
      platformId: this.config.name,
      date: metaInsight.date_start,
      impressions: parseInt(metaInsight.impressions || '0'),
      clicks: parseInt(metaInsight.clicks || '0'),
      conversions: parseFloat(conversions),
      spend: parseFloat(metaInsight.spend || '0'),
      currency: 'USD',
      ctr: parseFloat(metaInsight.ctr || '0') / 100, // Meta returns as percentage
      cpc: parseFloat(metaInsight.cpc || '0'),
      cpm: parseFloat(metaInsight.cpm || '0'),
      cpa: 0, // Will be calculated
      roas: 0, // Would need revenue data
      platformMetrics: {
        reach: parseInt(metaInsight.reach || '0'),
        frequency: parseFloat(metaInsight.frequency || '0'),
        videoViews: parseInt(metaInsight.video_views || '0'),
        videoViewRate: parseFloat(metaInsight.video_view_rate || '0'),
        cpp: parseFloat(metaInsight.cpp || '0') // Cost per person reached
      }
    };

    return calculateDerivedMetrics(baseMetrics) as UnifiedMetrics;
  }

  private convertToUnifiedAudience(metaAudience: any): UnifiedAudience {
    const avgSize = metaAudience.approximate_count_lower_bound && metaAudience.approximate_count_upper_bound ?
      (parseInt(metaAudience.approximate_count_lower_bound) + parseInt(metaAudience.approximate_count_upper_bound)) / 2 :
      undefined;

    return {
      id: `meta_ads_${metaAudience.id}`,
      platformId: this.config.name,
      platformAudienceId: metaAudience.id,
      name: metaAudience.name,
      type: metaAudience.subtype === 'LOOKALIKE' ? 'lookalike' : 'custom',
      size: avgSize,
      description: metaAudience.description,
      createdAt: metaAudience.created_time,
      updatedAt: metaAudience.updated_time
    };
  }

  // ===== CUSTOM OPERATIONS =====

  async executeCustomOperation(operation: string, params: Record<string, any>): Promise<any> {
    switch (operation) {
      case 'getAdSets':
        return this.getAdSets(params.campaignId);
      case 'getAds':
        return this.getAds(params.adSetId);
      case 'getPixels':
        return this.getPixels();
      case 'createLookalikeAudience':
        return this.createLookalikeAudience(params.sourceAudienceId, params.targetCountries);
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }

  private async getAdSets(campaignId: string): Promise<any[]> {
    const metaCampaignId = campaignId.replace('meta_ads_', '');
    
    const response = await this.makeApiRequest(`${metaCampaignId}/adsets`, {
      fields: [
        'id', 'name', 'status', 'daily_budget', 'lifetime_budget',
        'optimization_goal', 'billing_event', 'targeting', 'created_time'
      ].join(',')
    });

    return response.data || [];
  }

  private async getAds(adSetId: string): Promise<any[]> {
    const response = await this.makeApiRequest(`${adSetId}/ads`, {
      fields: [
        'id', 'name', 'status', 'creative', 'effective_status',
        'configured_status', 'created_time', 'updated_time'
      ].join(',')
    });

    return response.data || [];
  }

  private async getPixels(): Promise<any[]> {
    const adAccountId = `act_${this.credentials!.adAccountId}`;
    
    const response = await this.makeApiRequest(`${adAccountId}/adspixels`, {
      fields: 'id,name,code,creation_time,last_fired_time'
    });

    return response.data || [];
  }

  private async createLookalikeAudience(sourceAudienceId: string, targetCountries: string[]): Promise<any> {
    const adAccountId = `act_${this.credentials!.adAccountId}`;
    
    const lookalikeSpec = {
      ratio: 0.01, // 1% lookalike
      country: targetCountries[0] || 'US'
    };

    const response = await this.makeApiPostRequest(`${adAccountId}/customaudiences`, {
      name: `Lookalike - ${sourceAudienceId}`,
      subtype: 'LOOKALIKE',
      origin_audience_id: sourceAudienceId,
      lookalike_spec: JSON.stringify(lookalikeSpec)
    });

    return response;
  }
}