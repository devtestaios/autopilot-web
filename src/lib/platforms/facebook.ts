/**
 * Facebook/Meta Business API Integration
 * Handles Facebook Ads, Instagram Business, and Meta Business Manager APIs
 * 
 * Documentation: https://developers.facebook.com/docs/marketing-apis/
 */

import { format, subDays } from 'date-fns';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface FacebookCredentials {
  appId: string;
  appSecret: string;
  accessToken: string;
  userId?: string;
  accountId: string;
}

export interface FacebookCampaign {
  id: string;
  name: string;
  status: 'ACTIVE' | 'PAUSED' | 'DELETED' | 'ARCHIVED';
  objective: string;
  created_time: string;
  updated_time: string;
  start_time?: string;
  stop_time?: string;
  budget_remaining?: string;
  daily_budget?: string;
  lifetime_budget?: string;
}

export interface FacebookInsights {
  campaign_id: string;
  campaign_name: string;
  date_start: string;
  date_stop: string;
  impressions: number;
  reach: number;
  clicks: number;
  spend: number;
  ctr: number;
  cpm: number;
  cpp: number;
  frequency: number;
  actions?: FacebookAction[];
  cost_per_action_type?: FacebookCostPerAction[];
}

export interface FacebookAction {
  action_type: string;
  value: number;
}

export interface FacebookCostPerAction {
  action_type: string;
  value: number;
}

export interface UnifiedCampaignMetrics {
  platformId: string;
  platformName: 'facebook' | 'instagram';
  campaignId: string;
  campaignName: string;
  status: string;
  dateRange: {
    start: string;
    end: string;
  };
  metrics: {
    impressions: number;
    clicks: number;
    spend: number;
    conversions: number;
    ctr: number;
    cpc: number;
    roas?: number;
    conversionRate: number;
  };
  lastUpdated: string;
}

// =============================================================================
// FACEBOOK API CLIENT
// =============================================================================

export class FacebookAdsAPI {
  private baseUrl = 'https://graph.facebook.com/v18.0';
  private credentials: FacebookCredentials;

  constructor(credentials: FacebookCredentials) {
    this.credentials = credentials;
  }

  /**
   * Get all ad accounts associated with the user
   */
  async getAdAccounts(): Promise<any[]> {
    try {
      const url = `${this.baseUrl}/me/adaccounts`;
      const params = new URLSearchParams({
        fields: 'id,name,account_status,currency,timezone_name,business',
        access_token: this.credentials.accessToken
      });

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Facebook API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching Facebook ad accounts:', error);
      throw error;
    }
  }

  /**
   * Get campaigns for a specific ad account
   */
  async getCampaigns(adAccountId: string, limit = 100): Promise<FacebookCampaign[]> {
    try {
      const url = `${this.baseUrl}/${adAccountId}/campaigns`;
      const params = new URLSearchParams({
        fields: 'id,name,status,objective,created_time,updated_time,start_time,stop_time,budget_remaining,daily_budget,lifetime_budget',
        limit: limit.toString(),
        access_token: this.credentials.accessToken
      });

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Facebook API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Error fetching Facebook campaigns:', error);
      throw error;
    }
  }

  /**
   * Get campaign insights/metrics for the last 30 days
   */
  async getCampaignInsights(
    adAccountId: string,
    campaignIds?: string[],
    dateRange?: { start: string; end: string }
  ): Promise<FacebookInsights[]> {
    try {
      const since = dateRange?.start || format(subDays(new Date(), 30), 'yyyy-MM-dd');
      const until = dateRange?.end || format(new Date(), 'yyyy-MM-dd');

      const fields = [
        'campaign_id',
        'campaign_name', 
        'date_start',
        'date_stop',
        'impressions',
        'reach',
        'clicks',
        'spend',
        'ctr',
        'cpm',
        'cpp',
        'frequency',
        'actions',
        'cost_per_action_type'
      ].join(',');

      const url = `${this.baseUrl}/${adAccountId}/insights`;
      const params = new URLSearchParams({
        level: 'campaign',
        fields: fields,
        time_range: JSON.stringify({ since, until }),
        access_token: this.credentials.accessToken
      });

      // Add campaign filter if specific campaigns requested
      if (campaignIds && campaignIds.length > 0) {
        params.append('filtering', JSON.stringify([{
          field: 'campaign.id',
          operator: 'IN',
          value: campaignIds
        }]));
      }

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        throw new Error(`Facebook API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return this.transformInsights(data.data || []);
    } catch (error) {
      console.error('Error fetching Facebook campaign insights:', error);
      throw error;
    }
  }

  /**
   * Transform raw Facebook insights to standardized format
   */
  private transformInsights(rawInsights: any[]): FacebookInsights[] {
    return rawInsights.map(insight => ({
      campaign_id: insight.campaign_id,
      campaign_name: insight.campaign_name,
      date_start: insight.date_start,
      date_stop: insight.date_stop,
      impressions: parseInt(insight.impressions) || 0,
      reach: parseInt(insight.reach) || 0,
      clicks: parseInt(insight.clicks) || 0,
      spend: parseFloat(insight.spend) || 0,
      ctr: parseFloat(insight.ctr) || 0,
      cpm: parseFloat(insight.cpm) || 0,
      cpp: parseFloat(insight.cpp) || 0,
      frequency: parseFloat(insight.frequency) || 0,
      actions: insight.actions || [],
      cost_per_action_type: insight.cost_per_action_type || []
    }));
  }

  /**
   * Convert Facebook insights to unified platform metrics
   */
  async getUnifiedMetrics(
    adAccountId: string,
    dateRange?: { start: string; end: string }
  ): Promise<UnifiedCampaignMetrics[]> {
    const insights = await this.getCampaignInsights(adAccountId, undefined, dateRange);
    
    return insights.map(insight => {
      // Calculate conversions from actions
      const conversions = insight.actions?.reduce((total, action) => {
        if (['purchase', 'lead', 'complete_registration'].includes(action.action_type)) {
          return total + action.value;
        }
        return total;
      }, 0) || 0;

      // Calculate conversion rate
      const conversionRate = insight.clicks > 0 ? (conversions / insight.clicks) * 100 : 0;

      // Calculate CPC (Cost Per Click)
      const cpc = insight.clicks > 0 ? insight.spend / insight.clicks : 0;

      // Calculate ROAS if purchase value is available
      const purchaseValue = insight.actions?.find(action => 
        action.action_type === 'purchase'
      )?.value || 0;
      const roas = insight.spend > 0 && purchaseValue > 0 ? purchaseValue / insight.spend : undefined;

      return {
        platformId: 'facebook',
        platformName: 'facebook' as const,
        campaignId: insight.campaign_id,
        campaignName: insight.campaign_name,
        status: 'active', // Would need to fetch campaign status separately
        dateRange: {
          start: insight.date_start,
          end: insight.date_stop
        },
        metrics: {
          impressions: insight.impressions,
          clicks: insight.clicks,
          spend: insight.spend,
          conversions: conversions,
          ctr: insight.ctr,
          cpc: cpc,
          roas: roas,
          conversionRate: conversionRate
        },
        lastUpdated: new Date().toISOString()
      };
    });
  }

  /**
   * Test API connection and credentials
   */
  async testConnection(): Promise<{ success: boolean; message: string; userInfo?: any }> {
    try {
      const url = `${this.baseUrl}/me`;
      const params = new URLSearchParams({
        fields: 'id,name,email',
        access_token: this.credentials.accessToken
      });

      const response = await fetch(`${url}?${params}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          message: `Authentication failed: ${errorData.error?.message || 'Unknown error'}`
        };
      }

      const userInfo = await response.json();
      return {
        success: true,
        message: 'Facebook API connection successful',
        userInfo
      };
    } catch (error) {
      return {
        success: false,
        message: `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Create Facebook API client from environment variables
 */
export function createFacebookClient(): FacebookAdsAPI {
  const credentials: FacebookCredentials = {
    appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
    appSecret: process.env.FACEBOOK_APP_SECRET || '',
    accessToken: process.env.FACEBOOK_ACCESS_TOKEN || '',
    accountId: process.env.FACEBOOK_AD_ACCOUNT_ID || ''
  };

  if (!credentials.appId || !credentials.appSecret || !credentials.accessToken) {
    throw new Error('Facebook API credentials not configured. Please check your environment variables.');
  }

  return new FacebookAdsAPI(credentials);
}

/**
 * Validate Facebook webhook signature (for real-time updates)
 */
export function validateFacebookWebhook(payload: string, signature: string): boolean {
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', process.env.FACEBOOK_APP_SECRET)
    .update(payload)
    .digest('hex');
  
  return `sha256=${expectedSignature}` === signature;
}

/**
 * Get Facebook OAuth URL for user authorization
 */
export function getFacebookOAuthUrl(redirectUri: string, state?: string): string {
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
    redirect_uri: redirectUri,
    scope: 'ads_management,ads_read,business_management,pages_read_engagement',
    response_type: 'code',
    state: state || ''
  });

  return `https://www.facebook.com/v18.0/dialog/oauth?${params}`;
}

export default FacebookAdsAPI;