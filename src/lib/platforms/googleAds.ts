/**
 * Google Ads Platform Adapter
 * 
 * Implements the PlatformAdapter interface for Google Ads,
 * providing unified access to Google Ads campaigns and metrics.
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

// ===== GOOGLE ADS SPECIFIC TYPES =====

interface GoogleAdsCredentials extends PlatformCredentials {
  developerToken: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  customerId: string;
}

interface GoogleAdsCampaign {
  id: string;
  name: string;
  status: string;
  campaignBudget: {
    amountMicros: string;
    deliveryMethod: string;
  };
  biddingStrategy: {
    type: string;
  };
  advertisingChannelType: string;
  startDate: string;
  endDate?: string;
  targetCpa?: {
    targetCpaMicros: string;
  };
  targetRoas?: {
    targetRoas: number;
  };
}

interface GoogleAdsMetrics {
  campaignId: string;
  date: string;
  impressions: string;
  clicks: string;
  conversions: string;
  costMicros: string;
  ctr: string;
  averageCpc: string;
  averageCpm: string;
  costPerConversion: string;
  valuePerConversion?: string;
}

// ===== FIELD MAPPINGS =====

const CAMPAIGN_STATUS_MAP: Record<string, CampaignStatus> = {
  'ENABLED': CampaignStatus.ACTIVE,
  'PAUSED': CampaignStatus.PAUSED,
  'REMOVED': CampaignStatus.ENDED,
  'UNKNOWN': CampaignStatus.DRAFT
};

const CAMPAIGN_OBJECTIVE_MAP: Record<string, CampaignObjective> = {
  'SEARCH': CampaignObjective.TRAFFIC,
  'DISPLAY': CampaignObjective.AWARENESS,
  'SHOPPING': CampaignObjective.SALES,
  'VIDEO': CampaignObjective.VIDEO_VIEWS,
  'DISCOVERY': CampaignObjective.ENGAGEMENT,
  'LOCAL': CampaignObjective.STORE_VISITS,
  'SMART': CampaignObjective.LEADS
};

// ===== GOOGLE ADS ADAPTER =====

export class GoogleAdsAdapter implements PlatformAdapter {
  readonly config: PlatformConfig = {
    name: 'google_ads',
    displayName: 'Google Ads',
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
      'developerToken',
      'clientId', 
      'clientSecret',
      'refreshToken',
      'customerId'
    ],
    apiEndpoint: 'https://googleads.googleapis.com',
    rateLimit: {
      requests: 10000,
      period: 86400 // 24 hours
    }
  };

  private credentials?: GoogleAdsCredentials;
  private accessToken?: string;
  private tokenExpiry?: Date;

  // ===== AUTHENTICATION =====

  async authenticate(credentials: PlatformCredentials): Promise<boolean> {
    try {
      this.credentials = credentials as GoogleAdsCredentials;
      await this.refreshAccessToken();
      return true;
    } catch (error) {
      console.error('Google Ads authentication failed:', error);
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

  private async refreshAccessToken(): Promise<void> {
    if (!this.credentials) {
      throw new Error('No credentials available');
    }

    // Check if token is still valid
    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return;
    }

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: this.credentials.clientId,
        client_secret: this.credentials.clientSecret,
        refresh_token: this.credentials.refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`);
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.tokenExpiry = new Date(Date.now() + (data.expires_in * 1000));
  }

  private async makeApiRequest(endpoint: string, body?: any): Promise<any> {
    await this.refreshAccessToken();

    if (!this.credentials || !this.accessToken) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${this.config.apiEndpoint}/v14/customers/${this.credentials.customerId}/${endpoint}`, {
      method: body ? 'POST' : 'GET',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'developer-token': this.credentials.developerToken,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Google Ads API error: ${response.statusText}`);
    }

    return response.json();
  }

  // ===== CAMPAIGN MANAGEMENT =====

  async getCampaigns(limit = 100, offset = 0): Promise<UnifiedCampaign[]> {
    const query = `
      SELECT 
        campaign.id,
        campaign.name,
        campaign.status,
        campaign.campaign_budget,
        campaign.bidding_strategy_type,
        campaign.advertising_channel_type,
        campaign.start_date,
        campaign.end_date,
        campaign.target_cpa.target_cpa_micros,
        campaign.target_roas.target_roas
      FROM campaign 
      ORDER BY campaign.id 
      LIMIT ${limit} 
      OFFSET ${offset}
    `;

    const response = await this.makeApiRequest('googleAds:searchStream', {
      query
    });

    return response.results?.map((result: any) => this.convertToUnifiedCampaign(result.campaign)) || [];
  }

  async getCampaign(campaignId: string): Promise<UnifiedCampaign> {
    const query = `
      SELECT 
        campaign.id,
        campaign.name,
        campaign.status,
        campaign.campaign_budget,
        campaign.bidding_strategy_type,
        campaign.advertising_channel_type,
        campaign.start_date,
        campaign.end_date,
        campaign.target_cpa.target_cpa_micros,
        campaign.target_roas.target_roas
      FROM campaign 
      WHERE campaign.id = ${campaignId}
    `;

    const response = await this.makeApiRequest('googleAds:searchStream', {
      query
    });

    if (!response.results?.length) {
      throw new Error(`Campaign ${campaignId} not found`);
    }

    return this.convertToUnifiedCampaign(response.results[0].campaign);
  }

  async createCampaign(campaign: Partial<UnifiedCampaign>): Promise<UnifiedCampaign> {
    // Convert unified campaign to Google Ads format
    const googleAdsCampaign = this.convertFromUnifiedCampaign(campaign);

    const response = await this.makeApiRequest('campaigns:mutate', {
      operations: [{
        create: googleAdsCampaign
      }]
    });

    const createdCampaign = response.results[0];
    return this.getCampaign(createdCampaign.resourceName.split('/').pop());
  }

  async updateCampaign(campaignId: string, updates: Partial<UnifiedCampaign>): Promise<UnifiedCampaign> {
    const googleAdsUpdates = this.convertFromUnifiedCampaign(updates);

    await this.makeApiRequest('campaigns:mutate', {
      operations: [{
        update: {
          resourceName: `customers/${this.credentials!.customerId}/campaigns/${campaignId}`,
          ...googleAdsUpdates
        },
        updateMask: Object.keys(googleAdsUpdates).join(',')
      }]
    });

    return this.getCampaign(campaignId);
  }

  async deleteCampaign(campaignId: string): Promise<boolean> {
    try {
      await this.makeApiRequest('campaigns:mutate', {
        operations: [{
          remove: `customers/${this.credentials!.customerId}/campaigns/${campaignId}`
        }]
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
    const dateSegment = granularity === 'daily' ? 'segments.date' : 
                       granularity === 'weekly' ? 'segments.week' : 'segments.month';

    const query = `
      SELECT 
        campaign.id,
        ${dateSegment},
        metrics.impressions,
        metrics.clicks,
        metrics.conversions,
        metrics.cost_micros,
        metrics.ctr,
        metrics.average_cpc,
        metrics.average_cpm,
        metrics.cost_per_conversion,
        metrics.value_per_conversion
      FROM campaign 
      WHERE campaign.id = ${campaignId}
        AND segments.date BETWEEN '${startDate}' AND '${endDate}'
      ORDER BY segments.date
    `;

    const response = await this.makeApiRequest('googleAds:searchStream', {
      query
    });

    return response.results?.map((result: any) => this.convertToUnifiedMetrics(result)) || [];
  }

  async getAccountMetrics(
    startDate: string,
    endDate: string,
    granularity: 'daily' | 'weekly' | 'monthly' = 'daily'
  ): Promise<UnifiedMetrics[]> {
    const dateSegment = granularity === 'daily' ? 'segments.date' : 
                       granularity === 'weekly' ? 'segments.week' : 'segments.month';

    const query = `
      SELECT 
        ${dateSegment},
        metrics.impressions,
        metrics.clicks,
        metrics.conversions,
        metrics.cost_micros,
        metrics.ctr,
        metrics.average_cpc,
        metrics.average_cpm,
        metrics.cost_per_conversion,
        metrics.value_per_conversion
      FROM campaign 
      WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
      ORDER BY segments.date
    `;

    const response = await this.makeApiRequest('googleAds:searchStream', {
      query
    });

    // Aggregate metrics by date
    const aggregated = new Map<string, UnifiedMetrics>();

    response.results?.forEach((result: any) => {
      const date = result.segments?.date || result.segments?.week || result.segments?.month;
      const existing = aggregated.get(date) || {
        campaignId: 'account',
        platformId: this.config.name,
        date,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        spend: 0,
        currency: 'USD',
        ctr: 0,
        cpc: 0,
        cpm: 0,
        cpa: 0,
        roas: 0
      };

      existing.impressions += parseInt(result.metrics?.impressions || '0');
      existing.clicks += parseInt(result.metrics?.clicks || '0');
      existing.conversions += parseFloat(result.metrics?.conversions || '0');
      existing.spend += parseInt(result.metrics?.cost_micros || '0') / 1000000;

      aggregated.set(date, calculateDerivedMetrics(existing) as UnifiedMetrics);
    });

    return Array.from(aggregated.values());
  }

  // ===== AUDIENCE MANAGEMENT =====

  async getAudiences(): Promise<UnifiedAudience[]> {
    const query = `
      SELECT 
        user_list.id,
        user_list.name,
        user_list.description,
        user_list.membership_status,
        user_list.size_for_display,
        user_list.type
      FROM user_list
      ORDER BY user_list.name
    `;

    const response = await this.makeApiRequest('googleAds:searchStream', {
      query
    });

    return response.results?.map((result: any) => this.convertToUnifiedAudience(result.userList)) || [];
  }

  async createAudience(audience: Partial<UnifiedAudience>): Promise<UnifiedAudience> {
    const googleAdsUserList = {
      name: audience.name,
      description: audience.description,
      membershipStatus: 'OPEN',
      type: audience.type === 'custom' ? 'CRM_BASED' : 'LOOKALIKE'
    };

    const response = await this.makeApiRequest('userLists:mutate', {
      operations: [{
        create: googleAdsUserList
      }]
    });

    const createdUserList = response.results[0];
    const userListId = createdUserList.resourceName.split('/').pop();
    
    return {
      id: userListId,
      platformId: this.config.name,
      platformAudienceId: userListId,
      name: audience.name!,
      type: audience.type!,
      description: audience.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // ===== CONVERSION HELPERS =====

  private convertToUnifiedCampaign(googleCampaign: any): UnifiedCampaign {
    return {
      id: `google_ads_${googleCampaign.id}`,
      platformId: this.config.name,
      platformCampaignId: googleCampaign.id,
      name: googleCampaign.name,
      status: CAMPAIGN_STATUS_MAP[googleCampaign.status] || CampaignStatus.DRAFT,
      objective: CAMPAIGN_OBJECTIVE_MAP[googleCampaign.advertisingChannelType] || CampaignObjective.TRAFFIC,
      budget: {
        amount: parseInt(googleCampaign.campaignBudget?.amountMicros || '0') / 1000000,
        currency: 'USD', // Google Ads API doesn't always return currency in campaign data
        type: googleCampaign.campaignBudget?.deliveryMethod === 'ACCELERATED' ? 'daily' : 'daily'
      },
      targeting: {
        // Google Ads targeting would require additional API calls to get detailed info
      },
      schedule: {
        startDate: googleCampaign.startDate,
        endDate: googleCampaign.endDate
      },
      createdAt: new Date().toISOString(), // Google Ads doesn't provide creation date in basic query
      updatedAt: new Date().toISOString(),
      platformSpecific: {
        biddingStrategyType: googleCampaign.biddingStrategyType,
        targetCpaMicros: googleCampaign.targetCpa?.targetCpaMicros,
        targetRoas: googleCampaign.targetRoas?.targetRoas
      }
    };
  }

  private convertFromUnifiedCampaign(campaign: Partial<UnifiedCampaign>): any {
    const googleCampaign: any = {};

    if (campaign.name) {
      googleCampaign.name = campaign.name;
    }

    if (campaign.status) {
      const googleStatus = Object.entries(CAMPAIGN_STATUS_MAP)
        .find(([, unifiedStatus]) => unifiedStatus === campaign.status)?.[0];
      if (googleStatus) {
        googleCampaign.status = googleStatus;
      }
    }

    if (campaign.budget) {
      googleCampaign.campaignBudget = {
        amountMicros: Math.round(campaign.budget.amount * 1000000).toString()
      };
    }

    return googleCampaign;
  }

  private convertToUnifiedMetrics(result: any): UnifiedMetrics {
    const metrics = result.metrics || {};
    const date = result.segments?.date || result.segments?.week || result.segments?.month;

    const baseMetrics = {
      campaignId: `google_ads_${result.campaign?.id || 'account'}`,
      platformId: this.config.name,
      date,
      impressions: parseInt(metrics.impressions || '0'),
      clicks: parseInt(metrics.clicks || '0'),
      conversions: parseFloat(metrics.conversions || '0'),
      spend: parseInt(metrics.cost_micros || '0') / 1000000,
      currency: 'USD',
      ctr: parseFloat(metrics.ctr || '0'),
      cpc: parseInt(metrics.average_cpc || '0') / 1000000,
      cpm: parseInt(metrics.average_cpm || '0') / 1000000,
      cpa: parseInt(metrics.cost_per_conversion || '0') / 1000000,
      roas: 0, // Would need revenue data
      platformMetrics: {
        valuePerConversion: parseInt(metrics.value_per_conversion || '0') / 1000000
      }
    };

    return calculateDerivedMetrics(baseMetrics) as UnifiedMetrics;
  }

  private convertToUnifiedAudience(googleUserList: any): UnifiedAudience {
    return {
      id: `google_ads_${googleUserList.id}`,
      platformId: this.config.name,
      platformAudienceId: googleUserList.id,
      name: googleUserList.name,
      type: googleUserList.type === 'CRM_BASED' ? 'custom' : 'lookalike',
      size: parseInt(googleUserList.sizeForDisplay || '0'),
      description: googleUserList.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // ===== CUSTOM OPERATIONS =====

  async executeCustomOperation(operation: string, params: Record<string, any>): Promise<any> {
    switch (operation) {
      case 'getKeywords':
        return this.getKeywords(params.campaignId, params.adGroupId);
      case 'addKeywords':
        return this.addKeywords(params.adGroupId, params.keywords);
      case 'getBiddingStrategies':
        return this.getBiddingStrategies();
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }

  private async getKeywords(campaignId?: string, adGroupId?: string): Promise<any[]> {
    let whereClause = '';
    if (campaignId) {
      whereClause = `WHERE campaign.id = ${campaignId}`;
      if (adGroupId) {
        whereClause += ` AND ad_group.id = ${adGroupId}`;
      }
    }

    const query = `
      SELECT 
        ad_group_criterion.keyword.text,
        ad_group_criterion.keyword.match_type,
        ad_group_criterion.quality_info.search_predicted_ctr,
        ad_group_criterion.quality_info.creative_quality_score,
        metrics.impressions,
        metrics.clicks,
        metrics.cost_micros
      FROM keyword_view 
      ${whereClause}
      ORDER BY metrics.impressions DESC
    `;

    const response = await this.makeApiRequest('googleAds:searchStream', {
      query
    });

    return response.results || [];
  }

  private async addKeywords(adGroupId: string, keywords: string[]): Promise<boolean> {
    const operations = keywords.map(keyword => ({
      create: {
        adGroup: `customers/${this.credentials!.customerId}/adGroups/${adGroupId}`,
        keyword: {
          text: keyword,
          matchType: 'BROAD'
        },
        status: 'ENABLED'
      }
    }));

    try {
      await this.makeApiRequest('adGroupCriteria:mutate', {
        operations
      });
      return true;
    } catch (error) {
      console.error('Failed to add keywords:', error);
      return false;
    }
  }

  private async getBiddingStrategies(): Promise<any[]> {
    const query = `
      SELECT 
        bidding_strategy.id,
        bidding_strategy.name,
        bidding_strategy.type,
        bidding_strategy.status
      FROM bidding_strategy
      ORDER BY bidding_strategy.name
    `;

    const response = await this.makeApiRequest('googleAds:searchStream', {
      query
    });

    return response.results || [];
  }
}