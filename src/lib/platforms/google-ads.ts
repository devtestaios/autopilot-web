/**
 * Google Ads API Integration
 * Handles Google Ads campaign data, keywords, and performance metrics
 * 
 * Documentation: https://developers.google.com/google-ads/api/docs/start
 */

import { format, subDays } from 'date-fns';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface GoogleAdsCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  developerToken: string;
  customerId: string;
  loginCustomerId?: string;
}

export interface GoogleAdsCampaign {
  id: string;
  name: string;
  status: 'ENABLED' | 'PAUSED' | 'REMOVED';
  advertisingChannelType: string;
  startDate?: string;
  endDate?: string;
  budget: {
    name: string;
    amountMicros: number;
    deliveryMethod: string;
  };
  biddingStrategy: {
    type: string;
  };
}

export interface GoogleAdsMetrics {
  campaignId: string;
  campaignName: string;
  date: string;
  impressions: number;
  clicks: number;
  costMicros: number;
  conversions: number;
  conversionValue: number;
  ctr: number;
  averageCpc: number;
  searchImpressionShare?: number;
  qualityScore?: number;
}

export interface GoogleAdsKeyword {
  id: string;
  text: string;
  matchType: 'EXACT' | 'PHRASE' | 'BROAD';
  status: 'ENABLED' | 'PAUSED' | 'REMOVED';
  cpcBidMicros?: number;
  qualityScore?: number;
  firstPageCpcMicros?: number;
  topOfPageCpcMicros?: number;
}

// =============================================================================
// GOOGLE ADS API CLIENT
// =============================================================================

export class GoogleAdsAPI {
  private baseUrl = 'https://googleads.googleapis.com/v14';
  private credentials: GoogleAdsCredentials;
  private accessToken?: string;
  private tokenExpiry?: Date;

  constructor(credentials: GoogleAdsCredentials) {
    this.credentials = credentials;
  }

  /**
   * Get OAuth 2.0 access token using refresh token
   */
  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.credentials.clientId,
          client_secret: this.credentials.clientSecret,
          refresh_token: this.credentials.refreshToken,
          grant_type: 'refresh_token'
        })
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = new Date(Date.now() + (data.expires_in * 1000));
      
      return this.accessToken;
    } catch (error) {
      console.error('Error refreshing Google Ads access token:', error);
      throw error;
    }
  }

  /**
   * Make authenticated request to Google Ads API
   */
  private async makeRequest(endpoint: string, method = 'GET', body?: any): Promise<any> {
    const accessToken = await this.getAccessToken();
    
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${accessToken}`,
      'developer-token': this.credentials.developerToken,
      'Content-Type': 'application/json'
    };

    if (this.credentials.loginCustomerId) {
      headers['login-customer-id'] = this.credentials.loginCustomerId;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Ads API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  /**
   * Get all accessible customer accounts
   */
  async getCustomerAccounts(): Promise<any[]> {
    try {
      const endpoint = `/customers/${this.credentials.customerId}/customerClients`;
      const data = await this.makeRequest(endpoint);
      return data.results || [];
    } catch (error) {
      console.error('Error fetching Google Ads customer accounts:', error);
      throw error;
    }
  }

  /**
   * Get campaigns for a customer account
   */
  async getCampaigns(customerId?: string): Promise<GoogleAdsCampaign[]> {
    const targetCustomerId = customerId || this.credentials.customerId;
    
    try {
      const query = `
        SELECT 
          campaign.id,
          campaign.name,
          campaign.status,
          campaign.advertising_channel_type,
          campaign.start_date,
          campaign.end_date,
          campaign_budget.name,
          campaign_budget.amount_micros,
          campaign_budget.delivery_method,
          campaign.bidding_strategy_type
        FROM campaign
        WHERE campaign.status != 'REMOVED'
        ORDER BY campaign.name
      `;

      const endpoint = `/customers/${targetCustomerId}/googleAds:searchStream`;
      const body = { query };
      
      const data = await this.makeRequest(endpoint, 'POST', body);
      
      return this.transformCampaigns(data.results || []);
    } catch (error) {
      console.error('Error fetching Google Ads campaigns:', error);
      throw error;
    }
  }

  /**
   * Get campaign performance metrics
   */
  async getCampaignMetrics(
    customerId?: string,
    campaignIds?: string[],
    dateRange?: { start: string; end: string }
  ): Promise<GoogleAdsMetrics[]> {
    const targetCustomerId = customerId || this.credentials.customerId;
    const since = dateRange?.start || format(subDays(new Date(), 30), 'yyyy-MM-dd');
    const until = dateRange?.end || format(new Date(), 'yyyy-MM-dd');

    try {
      let whereClause = `segments.date BETWEEN '${since}' AND '${until}'`;
      
      if (campaignIds && campaignIds.length > 0) {
        const campaignFilter = campaignIds.map(id => `'${id}'`).join(',');
        whereClause += ` AND campaign.id IN (${campaignFilter})`;
      }

      const query = `
        SELECT 
          campaign.id,
          campaign.name,
          segments.date,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions,
          metrics.conversions_value,
          metrics.ctr,
          metrics.average_cpc,
          metrics.search_impression_share,
          metrics.quality_score
        FROM campaign
        WHERE ${whereClause}
        ORDER BY segments.date DESC, campaign.name
      `;

      const endpoint = `/customers/${targetCustomerId}/googleAds:searchStream`;
      const body = { query };
      
      const data = await this.makeRequest(endpoint, 'POST', body);
      
      return this.transformMetrics(data.results || []);
    } catch (error) {
      console.error('Error fetching Google Ads campaign metrics:', error);
      throw error;
    }
  }

  /**
   * Get keywords for campaigns
   */
  async getKeywords(
    customerId?: string,
    campaignIds?: string[]
  ): Promise<GoogleAdsKeyword[]> {
    const targetCustomerId = customerId || this.credentials.customerId;

    try {
      let whereClause = `ad_group_criterion.type = 'KEYWORD'`;
      
      if (campaignIds && campaignIds.length > 0) {
        const campaignFilter = campaignIds.map(id => `'${id}'`).join(',');
        whereClause += ` AND campaign.id IN (${campaignFilter})`;
      }

      const query = `
        SELECT 
          ad_group_criterion.criterion_id,
          ad_group_criterion.keyword.text,
          ad_group_criterion.keyword.match_type,
          ad_group_criterion.status,
          ad_group_criterion.cpc_bid_micros,
          ad_group_criterion.quality_info.quality_score,
          ad_group_criterion.position_estimates.first_page_cpc_micros,
          ad_group_criterion.position_estimates.top_of_page_cpc_micros
        FROM keyword_view
        WHERE ${whereClause}
        ORDER BY ad_group_criterion.keyword.text
      `;

      const endpoint = `/customers/${targetCustomerId}/googleAds:searchStream`;
      const body = { query };
      
      const data = await this.makeRequest(endpoint, 'POST', body);
      
      return this.transformKeywords(data.results || []);
    } catch (error) {
      console.error('Error fetching Google Ads keywords:', error);
      throw error;
    }
  }

  /**
   * Transform campaign data to standardized format
   */
  private transformCampaigns(rawCampaigns: any[]): GoogleAdsCampaign[] {
    return rawCampaigns.map(result => ({
      id: result.campaign.id,
      name: result.campaign.name,
      status: result.campaign.status,
      advertisingChannelType: result.campaign.advertisingChannelType,
      startDate: result.campaign.startDate,
      endDate: result.campaign.endDate,
      budget: {
        name: result.campaignBudget?.name || '',
        amountMicros: parseInt(result.campaignBudget?.amountMicros) || 0,
        deliveryMethod: result.campaignBudget?.deliveryMethod || ''
      },
      biddingStrategy: {
        type: result.campaign.biddingStrategyType || ''
      }
    }));
  }

  /**
   * Transform metrics data to standardized format
   */
  private transformMetrics(rawMetrics: any[]): GoogleAdsMetrics[] {
    return rawMetrics.map(result => ({
      campaignId: result.campaign.id,
      campaignName: result.campaign.name,
      date: result.segments.date,
      impressions: parseInt(result.metrics.impressions) || 0,
      clicks: parseInt(result.metrics.clicks) || 0,
      costMicros: parseInt(result.metrics.costMicros) || 0,
      conversions: parseFloat(result.metrics.conversions) || 0,
      conversionValue: parseFloat(result.metrics.conversionsValue) || 0,
      ctr: parseFloat(result.metrics.ctr) || 0,
      averageCpc: parseInt(result.metrics.averageCpc) || 0,
      searchImpressionShare: parseFloat(result.metrics.searchImpressionShare) || undefined,
      qualityScore: parseFloat(result.metrics.qualityScore) || undefined
    }));
  }

  /**
   * Transform keywords data to standardized format
   */
  private transformKeywords(rawKeywords: any[]): GoogleAdsKeyword[] {
    return rawKeywords.map(result => ({
      id: result.adGroupCriterion.criterionId,
      text: result.adGroupCriterion.keyword.text,
      matchType: result.adGroupCriterion.keyword.matchType,
      status: result.adGroupCriterion.status,
      cpcBidMicros: parseInt(result.adGroupCriterion.cpcBidMicros) || undefined,
      qualityScore: parseFloat(result.adGroupCriterion.qualityInfo?.qualityScore) || undefined,
      firstPageCpcMicros: parseInt(result.adGroupCriterion.positionEstimates?.firstPageCpcMicros) || undefined,
      topOfPageCpcMicros: parseInt(result.adGroupCriterion.positionEstimates?.topOfPageCpcMicros) || undefined
    }));
  }

  /**
   * Convert Google Ads metrics to unified platform metrics
   */
  async getUnifiedMetrics(
    customerId?: string,
    dateRange?: { start: string; end: string }
  ): Promise<any[]> {
    const metrics = await this.getCampaignMetrics(customerId, undefined, dateRange);
    
    // Group metrics by campaign and sum totals
    const campaignMetrics = new Map();
    
    metrics.forEach(metric => {
      const key = metric.campaignId;
      if (!campaignMetrics.has(key)) {
        campaignMetrics.set(key, {
          platformId: 'google-ads',
          platformName: 'google-ads',
          campaignId: metric.campaignId,
          campaignName: metric.campaignName,
          status: 'active',
          dateRange: dateRange || {
            start: metric.date,
            end: metric.date
          },
          metrics: {
            impressions: 0,
            clicks: 0,
            spend: 0,
            conversions: 0,
            ctr: 0,
            cpc: 0,
            conversionRate: 0
          },
          lastUpdated: new Date().toISOString()
        });
      }
      
      const campaign = campaignMetrics.get(key);
      campaign.metrics.impressions += metric.impressions;
      campaign.metrics.clicks += metric.clicks;
      campaign.metrics.spend += metric.costMicros / 1000000; // Convert micros to currency
      campaign.metrics.conversions += metric.conversions;
    });

    // Calculate derived metrics
    return Array.from(campaignMetrics.values()).map(campaign => {
      const { impressions, clicks, spend, conversions } = campaign.metrics;
      
      campaign.metrics.ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
      campaign.metrics.cpc = clicks > 0 ? spend / clicks : 0;
      campaign.metrics.conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
      
      return campaign;
    });
  }

  /**
   * Test API connection and credentials
   */
  async testConnection(): Promise<{ success: boolean; message: string; customerInfo?: any }> {
    try {
      const endpoint = `/customers/${this.credentials.customerId}`;
      const data = await this.makeRequest(endpoint);
      
      return {
        success: true,
        message: 'Google Ads API connection successful',
        customerInfo: data
      };
    } catch (error) {
      return {
        success: false,
        message: `Google Ads API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Create Google Ads API client from environment variables
 */
export function createGoogleAdsClient(): GoogleAdsAPI {
  const credentials: GoogleAdsCredentials = {
    clientId: process.env.GOOGLE_ADS_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_ADS_CLIENT_SECRET || '',
    refreshToken: process.env.GOOGLE_ADS_REFRESH_TOKEN || '',
    developerToken: process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '',
    customerId: process.env.GOOGLE_ADS_CUSTOMER_ID || '',
    loginCustomerId: process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID
  };

  const requiredFields = ['clientId', 'clientSecret', 'refreshToken', 'developerToken', 'customerId'];
  const missingFields = requiredFields.filter(field => !credentials[field as keyof GoogleAdsCredentials]);
  
  if (missingFields.length > 0) {
    throw new Error(`Google Ads API credentials missing: ${missingFields.join(', ')}. Please check your environment variables.`);
  }

  return new GoogleAdsAPI(credentials);
}

/**
 * Get Google OAuth URL for user authorization
 */
export function getGoogleAdsOAuthUrl(redirectUri: string, state?: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_ADS_CLIENT_ID || '',
    redirect_uri: redirectUri,
    scope: 'https://www.googleapis.com/auth/adwords',
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
    state: state || ''
  });

  return `https://accounts.google.com/oauth/authorize?${params}`;
}

/**
 * Convert micros to currency amount
 */
export function microsToAmount(micros: number): number {
  return micros / 1000000;
}

/**
 * Convert currency amount to micros
 */
export function amountToMicros(amount: number): number {
  return Math.round(amount * 1000000);
}

export default GoogleAdsAPI;