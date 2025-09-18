/**
 * LinkedIn Ads Platform Adapter
 * 
 * Implements the PlatformAdapter interface for LinkedIn Ads,
 * providing unified access to LinkedIn advertising campaigns and metrics.
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

// ===== LINKEDIN ADS SPECIFIC TYPES =====

interface LinkedInAdsCredentials extends PlatformCredentials {
  accessToken: string;
  clientId: string;
  clientSecret: string;
  adAccountId: string;
}

interface LinkedInCampaign {
  id: string;
  name: string;
  status: string;
  type: string;
  objectiveType: string;
  dailyBudget?: {
    amount: string;
    currencyCode: string;
  };
  totalBudget?: {
    amount: string;
    currencyCode: string;
  };
  runSchedule?: {
    start: number;
    end?: number;
  };
  targeting?: {
    includedTargetingFacets?: any;
    excludedTargetingFacets?: any;
  };
  created: number;
  lastModified: number;
}

interface LinkedInAnalytics {
  pivotValue: string;
  dateRange: {
    start: {
      day: number;
      month: number;
      year: number;
    };
    end: {
      day: number;
      month: number;
      year: number;
    };
  };
  impressions: number;
  clicks: number;
  costInUsd: number;
  externalWebsiteConversions?: number;
  leadGenerationMailInterestedClicks?: number;
  oneClickLeads?: number;
  videoViews?: number;
  videoFirstQuartileCompletions?: number;
  videoMidpointCompletions?: number;
  videoThirdQuartileCompletions?: number;
  videoCompletions?: number;
  shares?: number;
  comments?: number;
  likes?: number;
  follows?: number;
}

// ===== FIELD MAPPINGS =====

const CAMPAIGN_STATUS_MAP: Record<string, CampaignStatus> = {
  'ACTIVE': CampaignStatus.ACTIVE,
  'PAUSED': CampaignStatus.PAUSED,
  'ARCHIVED': CampaignStatus.ENDED,
  'COMPLETED': CampaignStatus.ENDED,
  'CANCELED': CampaignStatus.ENDED,
  'DRAFT': CampaignStatus.DRAFT,
  'PENDING_DELETION': CampaignStatus.ENDED
};

const CAMPAIGN_OBJECTIVE_MAP: Record<string, CampaignObjective> = {
  'BRAND_AWARENESS': CampaignObjective.AWARENESS,
  'WEBSITE_VISITS': CampaignObjective.TRAFFIC,
  'ENGAGEMENT': CampaignObjective.ENGAGEMENT,
  'VIDEO_VIEWS': CampaignObjective.VIDEO_VIEWS,
  'LEAD_GENERATION': CampaignObjective.LEADS,
  'WEBSITE_CONVERSIONS': CampaignObjective.SALES,
  'JOB_APPLICANTS': CampaignObjective.LEADS,
  'TALENT_LEADS': CampaignObjective.LEADS
};

const REVERSE_OBJECTIVE_MAP: Record<CampaignObjective, string> = {
  [CampaignObjective.AWARENESS]: 'BRAND_AWARENESS',
  [CampaignObjective.TRAFFIC]: 'WEBSITE_VISITS',
  [CampaignObjective.ENGAGEMENT]: 'ENGAGEMENT',
  [CampaignObjective.VIDEO_VIEWS]: 'VIDEO_VIEWS',
  [CampaignObjective.LEADS]: 'LEAD_GENERATION',
  [CampaignObjective.SALES]: 'WEBSITE_CONVERSIONS',
  [CampaignObjective.APP_PROMOTION]: 'WEBSITE_VISITS', // Closest match
  [CampaignObjective.STORE_VISITS]: 'WEBSITE_VISITS' // Closest match
};

// ===== LINKEDIN ADS ADAPTER =====

export class LinkedInAdsAdapter implements PlatformAdapter {
  readonly config: PlatformConfig = {
    name: 'linkedin_ads',
    displayName: 'LinkedIn Ads',
    supportedFeatures: [
      PlatformFeature.CAMPAIGN_MANAGEMENT,
      PlatformFeature.AUDIENCE_TARGETING,
      PlatformFeature.CONVERSION_TRACKING,
      PlatformFeature.DEMOGRAPHIC_INSIGHTS,
      PlatformFeature.CUSTOM_AUDIENCES,
      PlatformFeature.REAL_TIME_REPORTING,
      PlatformFeature.BULK_OPERATIONS
    ],
    requiredCredentials: [
      'accessToken',
      'clientId',
      'clientSecret',
      'adAccountId'
    ],
    apiEndpoint: 'https://api.linkedin.com/rest',
    rateLimit: {
      requests: 100,
      period: 3600 // 1 hour
    }
  };

  private credentials?: LinkedInAdsCredentials;

  // ===== AUTHENTICATION =====

  async authenticate(credentials: PlatformCredentials): Promise<boolean> {
    try {
      this.credentials = credentials as LinkedInAdsCredentials;
      
      // Test authentication by making a simple API call
      const response = await this.makeApiRequest('people/~:(id,firstName,lastName)');
      return !!response.id;
    } catch (error) {
      console.error('LinkedIn Ads authentication failed:', error);
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
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.credentials.accessToken}`,
        'Content-Type': 'application/json',
        'LinkedIn-Version': '202401',
        'X-Restli-Protocol-Version': '2.0.0'
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`LinkedIn API error: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    return response.json();
  }

  private async makeApiPostRequest(endpoint: string, data: Record<string, any>): Promise<any> {
    if (!this.credentials) {
      throw new Error('Not authenticated');
    }

    const url = `${this.config.apiEndpoint}/${endpoint}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.credentials.accessToken}`,
        'Content-Type': 'application/json',
        'LinkedIn-Version': '202401',
        'X-Restli-Protocol-Version': '2.0.0'
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`LinkedIn API error: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    return response.json();
  }

  // ===== CAMPAIGN MANAGEMENT =====

  async getCampaigns(limit = 100, offset = 0): Promise<UnifiedCampaign[]> {
    const response = await this.makeApiRequest('adCampaignsV2', {
      q: 'account',
      account: `urn:li:sponsoredAccount:${this.credentials!.adAccountId}`,
      count: limit,
      start: offset,
      projection: '(elements*(id,name,status,type,objectiveType,dailyBudget,totalBudget,runSchedule,targeting,created,lastModified))'
    });

    return response.elements?.map((campaign: LinkedInCampaign) => this.convertToUnifiedCampaign(campaign)) || [];
  }

  async getCampaign(campaignId: string): Promise<UnifiedCampaign> {
    // Remove platform prefix if present
    const linkedInCampaignId = campaignId.replace('linkedin_ads_', '');
    
    const response = await this.makeApiRequest(`adCampaignsV2/${linkedInCampaignId}`, {
      projection: '(id,name,status,type,objectiveType,dailyBudget,totalBudget,runSchedule,targeting,created,lastModified)'
    });

    return this.convertToUnifiedCampaign(response);
  }

  async createCampaign(campaign: Partial<UnifiedCampaign>): Promise<UnifiedCampaign> {
    const linkedInCampaign = this.convertFromUnifiedCampaign(campaign);

    const response = await this.makeApiPostRequest('adCampaignsV2', linkedInCampaign);

    const createdCampaignId = response.id || response.elements?.[0]?.id;
    return this.getCampaign(createdCampaignId);
  }

  async updateCampaign(campaignId: string, updates: Partial<UnifiedCampaign>): Promise<UnifiedCampaign> {
    const linkedInCampaignId = campaignId.replace('linkedin_ads_', '');
    const linkedInUpdates = this.convertFromUnifiedCampaign(updates);

    await this.makeApiPostRequest(`adCampaignsV2/${linkedInCampaignId}`, linkedInUpdates);

    return this.getCampaign(campaignId);
  }

  async deleteCampaign(campaignId: string): Promise<boolean> {
    try {
      const linkedInCampaignId = campaignId.replace('linkedin_ads_', '');
      
      await this.makeApiPostRequest(`adCampaignsV2/${linkedInCampaignId}`, {
        status: 'ARCHIVED'
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
    const linkedInCampaignId = campaignId.replace('linkedin_ads_', '');
    
    const timeGranularity = granularity.toUpperCase();
    
    const response = await this.makeApiRequest('adAnalyticsV2', {
      q: 'analytics',
      pivot: 'CAMPAIGN',
      campaigns: `List(urn:li:sponsoredCampaign:${linkedInCampaignId})`,
      timeGranularity,
      dateRange: `(start:(year:${startDate.split('-')[0]},month:${parseInt(startDate.split('-')[1])},day:${parseInt(startDate.split('-')[2])}),end:(year:${endDate.split('-')[0]},month:${parseInt(endDate.split('-')[1])},day:${parseInt(endDate.split('-')[2])}))`,
      fields: 'impressions,clicks,costInUsd,externalWebsiteConversions,leadGenerationMailInterestedClicks,oneClickLeads,videoViews,videoCompletions,shares,comments,likes,follows'
    });

    return response.elements?.map((analytics: LinkedInAnalytics) => this.convertToUnifiedMetrics(analytics, linkedInCampaignId)) || [];
  }

  async getAccountMetrics(
    startDate: string,
    endDate: string,
    granularity: 'daily' | 'weekly' | 'monthly' = 'daily'
  ): Promise<UnifiedMetrics[]> {
    const timeGranularity = granularity.toUpperCase();
    
    const response = await this.makeApiRequest('adAnalyticsV2', {
      q: 'analytics',
      pivot: 'ACCOUNT',
      accounts: `List(urn:li:sponsoredAccount:${this.credentials!.adAccountId})`,
      timeGranularity,
      dateRange: `(start:(year:${startDate.split('-')[0]},month:${parseInt(startDate.split('-')[1])},day:${parseInt(startDate.split('-')[2])}),end:(year:${endDate.split('-')[0]},month:${parseInt(endDate.split('-')[1])},day:${parseInt(endDate.split('-')[2])}))`,
      fields: 'impressions,clicks,costInUsd,externalWebsiteConversions,leadGenerationMailInterestedClicks,oneClickLeads,videoViews,videoCompletions,shares,comments,likes,follows'
    });

    return response.elements?.map((analytics: LinkedInAnalytics) => {
      const unified = this.convertToUnifiedMetrics(analytics, 'account');
      unified.campaignId = 'account';
      return unified;
    }) || [];
  }

  // ===== AUDIENCE MANAGEMENT =====

  async getAudiences(): Promise<UnifiedAudience[]> {
    // LinkedIn uses "matched audiences" for custom audiences
    const response = await this.makeApiRequest('dmpSegments', {
      q: 'account',
      account: `urn:li:sponsoredAccount:${this.credentials!.adAccountId}`,
      projection: '(elements*(id,name,description,status,type,audienceCountHistory))'
    });

    return response.elements?.map((audience: any) => this.convertToUnifiedAudience(audience)) || [];
  }

  async createAudience(audience: Partial<UnifiedAudience>): Promise<UnifiedAudience> {
    // LinkedIn matched audience creation
    const linkedInAudience = {
      name: audience.name,
      description: audience.description,
      type: audience.type === 'lookalike' ? 'LOOKALIKE' : 'USER_GENERATED'
    };

    const response = await this.makeApiPostRequest('dmpSegments', linkedInAudience);
    
    const audienceId = response.id || response.elements?.[0]?.id;
    
    return {
      id: `linkedin_ads_${audienceId}`,
      platformId: this.config.name,
      platformAudienceId: audienceId,
      name: audience.name!,
      type: audience.type!,
      description: audience.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  // ===== CONVERSION HELPERS =====

  private convertToUnifiedCampaign(linkedInCampaign: LinkedInCampaign): UnifiedCampaign {
    const budgetAmount = linkedInCampaign.dailyBudget?.amount ? 
      parseFloat(linkedInCampaign.dailyBudget.amount) : 
      parseFloat(linkedInCampaign.totalBudget?.amount || '0');
    
    const budgetType = linkedInCampaign.dailyBudget ? 'daily' : 'lifetime';
    const currency = linkedInCampaign.dailyBudget?.currencyCode || linkedInCampaign.totalBudget?.currencyCode || 'USD';

    const startDate = linkedInCampaign.runSchedule?.start ? 
      new Date(linkedInCampaign.runSchedule.start).toISOString().split('T')[0] :
      new Date().toISOString().split('T')[0];
    
    const endDate = linkedInCampaign.runSchedule?.end ? 
      new Date(linkedInCampaign.runSchedule.end).toISOString().split('T')[0] :
      undefined;

    return {
      id: `linkedin_ads_${linkedInCampaign.id}`,
      platformId: this.config.name,
      platformCampaignId: linkedInCampaign.id,
      name: linkedInCampaign.name,
      status: CAMPAIGN_STATUS_MAP[linkedInCampaign.status] || CampaignStatus.DRAFT,
      objective: CAMPAIGN_OBJECTIVE_MAP[linkedInCampaign.objectiveType] || CampaignObjective.AWARENESS,
      budget: {
        amount: budgetAmount,
        currency,
        type: budgetType
      },
      targeting: {
        // LinkedIn targeting is complex - would need additional processing
        // This is a simplified version
      },
      schedule: {
        startDate,
        endDate
      },
      createdAt: new Date(linkedInCampaign.created).toISOString(),
      updatedAt: new Date(linkedInCampaign.lastModified).toISOString(),
      platformSpecific: {
        campaignType: linkedInCampaign.type,
        linkedInObjective: linkedInCampaign.objectiveType
      }
    };
  }

  private convertFromUnifiedCampaign(campaign: Partial<UnifiedCampaign>): any {
    const linkedInCampaign: any = {
      account: `urn:li:sponsoredAccount:${this.credentials!.adAccountId}`
    };

    if (campaign.name) {
      linkedInCampaign.name = campaign.name;
    }

    if (campaign.status) {
      const linkedInStatus = Object.entries(CAMPAIGN_STATUS_MAP)
        .find(([, unifiedStatus]) => unifiedStatus === campaign.status)?.[0];
      if (linkedInStatus) {
        linkedInCampaign.status = linkedInStatus;
      }
    }

    if (campaign.objective) {
      const linkedInObjective = REVERSE_OBJECTIVE_MAP[campaign.objective];
      if (linkedInObjective) {
        linkedInCampaign.objectiveType = linkedInObjective;
      }
    }

    if (campaign.budget) {
      const budgetData = {
        amount: campaign.budget.amount.toString(),
        currencyCode: campaign.budget.currency
      };
      
      if (campaign.budget.type === 'daily') {
        linkedInCampaign.dailyBudget = budgetData;
      } else {
        linkedInCampaign.totalBudget = budgetData;
      }
    }

    if (campaign.schedule) {
      const runSchedule: any = {};
      
      if (campaign.schedule.startDate) {
        runSchedule.start = new Date(campaign.schedule.startDate).getTime();
      }
      
      if (campaign.schedule.endDate) {
        runSchedule.end = new Date(campaign.schedule.endDate).getTime();
      }
      
      if (Object.keys(runSchedule).length > 0) {
        linkedInCampaign.runSchedule = runSchedule;
      }
    }

    // Default campaign type for LinkedIn
    if (!linkedInCampaign.type) {
      linkedInCampaign.type = 'SPONSORED_CONTENT';
    }

    return linkedInCampaign;
  }

  private convertToUnifiedMetrics(linkedInAnalytics: LinkedInAnalytics, campaignId: string): UnifiedMetrics {
    // LinkedIn combines multiple conversion types
    const conversions = (linkedInAnalytics.externalWebsiteConversions || 0) + 
                       (linkedInAnalytics.leadGenerationMailInterestedClicks || 0) + 
                       (linkedInAnalytics.oneClickLeads || 0);

    // Format date from LinkedIn's date structure
    const date = `${linkedInAnalytics.dateRange.start.year}-${String(linkedInAnalytics.dateRange.start.month).padStart(2, '0')}-${String(linkedInAnalytics.dateRange.start.day).padStart(2, '0')}`;

    const baseMetrics = {
      campaignId: `linkedin_ads_${campaignId}`,
      platformId: this.config.name,
      date,
      impressions: linkedInAnalytics.impressions || 0,
      clicks: linkedInAnalytics.clicks || 0,
      conversions,
      spend: linkedInAnalytics.costInUsd || 0,
      currency: 'USD',
      ctr: 0, // Will be calculated
      cpc: 0, // Will be calculated
      cpm: 0, // Will be calculated
      cpa: 0, // Will be calculated
      roas: 0, // Would need revenue data
      platformMetrics: {
        videoViews: linkedInAnalytics.videoViews || 0,
        videoCompletions: linkedInAnalytics.videoCompletions || 0,
        shares: linkedInAnalytics.shares || 0,
        comments: linkedInAnalytics.comments || 0,
        likes: linkedInAnalytics.likes || 0,
        follows: linkedInAnalytics.follows || 0,
        leadGenClicks: linkedInAnalytics.leadGenerationMailInterestedClicks || 0,
        oneClickLeads: linkedInAnalytics.oneClickLeads || 0
      }
    };

    return calculateDerivedMetrics(baseMetrics) as UnifiedMetrics;
  }

  private convertToUnifiedAudience(linkedInAudience: any): UnifiedAudience {
    const latestCount = linkedInAudience.audienceCountHistory?.elements?.[0]?.audienceCount || 0;

    return {
      id: `linkedin_ads_${linkedInAudience.id}`,
      platformId: this.config.name,
      platformAudienceId: linkedInAudience.id,
      name: linkedInAudience.name,
      type: linkedInAudience.type === 'LOOKALIKE' ? 'lookalike' : 'custom',
      size: latestCount,
      description: linkedInAudience.description,
      createdAt: new Date().toISOString(), // LinkedIn doesn't always provide creation date
      updatedAt: new Date().toISOString()
    };
  }

  // ===== CUSTOM OPERATIONS =====

  async executeCustomOperation(operation: string, params: Record<string, any>): Promise<any> {
    switch (operation) {
      case 'getCreatives':
        return this.getCreatives(params.campaignId);
      case 'getAccountInfo':
        return this.getAccountInfo();
      case 'getCompanyPages':
        return this.getCompanyPages();
      case 'getTargetingFacets':
        return this.getTargetingFacets(params.facetType);
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  }

  private async getCreatives(campaignId?: string): Promise<any[]> {
    let query: any = {
      q: 'account',
      account: `urn:li:sponsoredAccount:${this.credentials!.adAccountId}`,
      projection: '(elements*(id,name,status,type,content,review))'
    };

    if (campaignId) {
      const linkedInCampaignId = campaignId.replace('linkedin_ads_', '');
      query.campaign = `urn:li:sponsoredCampaign:${linkedInCampaignId}`;
    }

    const response = await this.makeApiRequest('creatives', query);
    return response.elements || [];
  }

  private async getAccountInfo(): Promise<any> {
    const response = await this.makeApiRequest(`adAccountsV2/${this.credentials!.adAccountId}`, {
      projection: '(id,name,type,status,currency,accountManager,notificationSettings)'
    });

    return response;
  }

  private async getCompanyPages(): Promise<any[]> {
    const response = await this.makeApiRequest('organizationAcls', {
      q: 'roleAssignee',
      projection: '(elements*(organization~(id,name,logoV2)))'
    });

    return response.elements?.map((acl: any) => acl['organization~']) || [];
  }

  private async getTargetingFacets(facetType: string): Promise<any[]> {
    // LinkedIn targeting facets (skills, companies, job titles, etc.)
    const validFacetTypes = ['skills', 'companies', 'jobTitles', 'industries', 'seniorities', 'jobFunctions'];
    
    if (!validFacetTypes.includes(facetType)) {
      throw new Error(`Invalid facet type. Valid types: ${validFacetTypes.join(', ')}`);
    }

    const response = await this.makeApiRequest(`adTargetingFacets`, {
      facetType: facetType.toUpperCase(),
      locale: 'en_US'
    });

    return response.elements || [];
  }
}