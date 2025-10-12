/**
 * Unified Platform Manager
 * Coordinates all marketing platform APIs and provides standardized data access
 * 
 * Supported Platforms:
 * - Facebook/Meta Ads & Instagram Business
 * - Google Ads
 * - LinkedIn Ads  
 * - TikTok Business
 * - Twitter Ads
 */

import { FacebookAdsAPI, createFacebookClient } from './facebook';
import { GoogleAdsAPI, createGoogleAdsClient } from './google-ads';

// =============================================================================
// UNIFIED TYPES & INTERFACES
// =============================================================================

export type PlatformType = 'facebook' | 'google-ads' | 'linkedin' | 'tiktok' | 'twitter' | 'instagram';

export interface UnifiedCampaignMetrics {
  platformId: PlatformType;
  platformName: string;
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

export interface PlatformConnection {
  id: string;
  userId: string;
  platformType: PlatformType;
  platformName: string;
  accountId: string;
  accountName: string;
  isActive: boolean;
  credentials: Record<string, any>;
  lastSync: string;
  syncStatus: 'success' | 'error' | 'pending';
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformSyncResult {
  platformId: PlatformType;
  success: boolean;
  campaignCount: number;
  metricsCount: number;
  errorMessage?: string;
  syncDuration: number;
  lastSync: string;
}

export interface AggregatedMetrics {
  totalImpressions: number;
  totalClicks: number;
  totalSpend: number;
  totalConversions: number;
  averageCtr: number;
  averageCpc: number;
  averageRoas?: number;
  averageConversionRate: number;
  platformBreakdown: Record<PlatformType, UnifiedCampaignMetrics[]>;
}

// =============================================================================
// PLATFORM MANAGER CLASS
// =============================================================================

export class PlatformManager {
  private facebookClient?: FacebookAdsAPI;
  private googleAdsClient?: GoogleAdsAPI;
  private supabaseClient: any; // Will be injected

  constructor(supabaseClient?: any) {
    this.supabaseClient = supabaseClient;
  }

  /**
   * Initialize platform clients based on available credentials
   */
  async initializePlatforms(): Promise<{ [key in PlatformType]?: boolean }> {
    const initialized: { [key in PlatformType]?: boolean } = {};

    // Initialize Facebook/Meta
    try {
      this.facebookClient = createFacebookClient();
      const testResult = await this.facebookClient.testConnection();
      initialized.facebook = testResult.success;
    } catch (error) {
      console.warn('Facebook API not available:', error);
      initialized.facebook = false;
    }

    // Initialize Google Ads
    try {
      this.googleAdsClient = createGoogleAdsClient();
      const testResult = await this.googleAdsClient.testConnection();
      initialized['google-ads'] = testResult.success;
    } catch (error) {
      console.warn('Google Ads API not available:', error);
      initialized['google-ads'] = false;
    }

    return initialized;
  }

  /**
   * Get all campaign metrics from all connected platforms
   */
  async getAllCampaignMetrics(
    userId: string,
    dateRange?: { start: string; end: string }
  ): Promise<UnifiedCampaignMetrics[]> {
    const allMetrics: UnifiedCampaignMetrics[] = [];

    // Get user's platform connections
    const connections = await this.getUserPlatformConnections(userId);

    // Fetch metrics from each connected platform
    await Promise.allSettled(
      connections.map(async (connection) => {
        try {
          const metrics = await this.getPlatformMetrics(connection, dateRange);
          allMetrics.push(...metrics);
        } catch (error) {
          console.error(`Error fetching metrics for ${connection.platformType}:`, error);
          await this.updateConnectionError(connection.id, error instanceof Error ? error.message : 'Unknown error');
        }
      })
    );

    return allMetrics;
  }

  /**
   * Get metrics from a specific platform
   */
  private async getPlatformMetrics(
    connection: PlatformConnection,
    dateRange?: { start: string; end: string }
  ): Promise<UnifiedCampaignMetrics[]> {
    switch (connection.platformType) {
      case 'facebook':
        if (this.facebookClient) {
          return await this.facebookClient.getUnifiedMetrics(connection.accountId, dateRange);
        }
        break;

      case 'google-ads':
        if (this.googleAdsClient) {
          return await this.googleAdsClient.getUnifiedMetrics(connection.accountId, dateRange);
        }
        break;

      case 'linkedin':
        // TODO: Implement LinkedIn API
        break;

      case 'tiktok':
        // TODO: Implement TikTok API
        break;

      case 'twitter':
        // TODO: Implement Twitter API
        break;
    }

    return [];
  }

  /**
   * Sync all platforms for a user
   */
  async syncAllPlatforms(userId: string): Promise<PlatformSyncResult[]> {
    const results: PlatformSyncResult[] = [];
    const connections = await this.getUserPlatformConnections(userId);

    await Promise.allSettled(
      connections.map(async (connection) => {
        const startTime = Date.now();
        try {
          const metrics = await this.getPlatformMetrics(connection);
          
          // Store metrics in database
          await this.storeCampaignMetrics(userId, metrics);
          
          // Update connection sync status
          await this.updateConnectionSync(connection.id, 'success');

          results.push({
            platformId: connection.platformType,
            success: true,
            campaignCount: metrics.length,
            metricsCount: metrics.length,
            syncDuration: Date.now() - startTime,
            lastSync: new Date().toISOString()
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          
          await this.updateConnectionError(connection.id, errorMessage);

          results.push({
            platformId: connection.platformType,
            success: false,
            campaignCount: 0,
            metricsCount: 0,
            errorMessage,
            syncDuration: Date.now() - startTime,
            lastSync: new Date().toISOString()
          });
        }
      })
    );

    return results;
  }

  /**
   * Get aggregated metrics across all platforms
   */
  async getAggregatedMetrics(
    userId: string,
    dateRange?: { start: string; end: string }
  ): Promise<AggregatedMetrics> {
    const allMetrics = await this.getAllCampaignMetrics(userId, dateRange);

    const platformBreakdown: Record<PlatformType, UnifiedCampaignMetrics[]> = {
      facebook: [],
      'google-ads': [],
      linkedin: [],
      tiktok: [],
      twitter: [],
      instagram: []
    };

    let totalImpressions = 0;
    let totalClicks = 0;
    let totalSpend = 0;
    let totalConversions = 0;
    let totalRoas = 0;
    let roasCount = 0;

    // Aggregate metrics and group by platform
    allMetrics.forEach(metric => {
      platformBreakdown[metric.platformId].push(metric);
      
      totalImpressions += metric.metrics.impressions;
      totalClicks += metric.metrics.clicks;
      totalSpend += metric.metrics.spend;
      totalConversions += metric.metrics.conversions;
      
      if (metric.metrics.roas) {
        totalRoas += metric.metrics.roas;
        roasCount++;
      }
    });

    // Calculate averages
    const averageCtr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const averageCpc = totalClicks > 0 ? totalSpend / totalClicks : 0;
    const averageRoas = roasCount > 0 ? totalRoas / roasCount : undefined;
    const averageConversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

    return {
      totalImpressions,
      totalClicks,
      totalSpend,
      totalConversions,
      averageCtr,
      averageCpc,
      averageRoas,
      averageConversionRate,
      platformBreakdown
    };
  }

  /**
   * Test connection to a specific platform
   */
  async testPlatformConnection(platformType: PlatformType): Promise<{ success: boolean; message: string }> {
    try {
      switch (platformType) {
        case 'facebook':
          if (!this.facebookClient) this.facebookClient = createFacebookClient();
          return await this.facebookClient.testConnection();

        case 'google-ads':
          if (!this.googleAdsClient) this.googleAdsClient = createGoogleAdsClient();
          return await this.googleAdsClient.testConnection();

        default:
          return { success: false, message: `Platform ${platformType} not yet implemented` };
      }
    } catch (error) {
      return {
        success: false,
        message: `Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // =============================================================================
  // DATABASE OPERATIONS
  // =============================================================================

  /**
   * Get user's platform connections from database
   */
  private async getUserPlatformConnections(userId: string): Promise<PlatformConnection[]> {
    if (!this.supabaseClient) {
      console.warn('Supabase client not available, returning empty connections');
      return [];
    }

    try {
      const { data, error } = await this.supabaseClient
        .from('platform_connections')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching platform connections:', error);
      return [];
    }
  }

  /**
   * Store campaign metrics in database
   */
  private async storeCampaignMetrics(userId: string, metrics: UnifiedCampaignMetrics[]): Promise<void> {
    if (!this.supabaseClient || metrics.length === 0) return;

    try {
      const campaignData = metrics.map(metric => ({
        user_id: userId,
        platform_type: metric.platformId,
        campaign_id: metric.campaignId,
        campaign_name: metric.campaignName,
        status: metric.status,
        date_start: metric.dateRange.start,
        date_end: metric.dateRange.end,
        impressions: metric.metrics.impressions,
        clicks: metric.metrics.clicks,
        spend: metric.metrics.spend,
        conversions: metric.metrics.conversions,
        ctr: metric.metrics.ctr,
        cpc: metric.metrics.cpc,
        roas: metric.metrics.roas,
        conversion_rate: metric.metrics.conversionRate,
        last_updated: metric.lastUpdated
      }));

      const { error } = await this.supabaseClient
        .from('campaign_metrics')
        .upsert(campaignData, {
          onConflict: 'user_id,platform_type,campaign_id,date_start'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error storing campaign metrics:', error);
      throw error;
    }
  }

  /**
   * Update platform connection sync status
   */
  private async updateConnectionSync(connectionId: string, status: 'success' | 'error' | 'pending'): Promise<void> {
    if (!this.supabaseClient) return;

    try {
      const { error } = await this.supabaseClient
        .from('platform_connections')
        .update({
          sync_status: status,
          last_sync: new Date().toISOString(),
          error_message: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', connectionId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating connection sync status:', error);
    }
  }

  /**
   * Update platform connection with error
   */
  private async updateConnectionError(connectionId: string, errorMessage: string): Promise<void> {
    if (!this.supabaseClient) return;

    try {
      const { error } = await this.supabaseClient
        .from('platform_connections')
        .update({
          sync_status: 'error',
          error_message: errorMessage,
          updated_at: new Date().toISOString()
        })
        .eq('id', connectionId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating connection error:', error);
    }
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Create platform manager instance with Supabase client
 */
export function createPlatformManager(supabaseClient?: any): PlatformManager {
  return new PlatformManager(supabaseClient);
}

/**
 * Get platform display name
 */
export function getPlatformDisplayName(platformType: PlatformType): string {
  const displayNames: Record<PlatformType, string> = {
    facebook: 'Facebook Ads',
    'google-ads': 'Google Ads',
    linkedin: 'LinkedIn Ads',
    tiktok: 'TikTok Business',
    twitter: 'Twitter Ads',
    instagram: 'Instagram Business'
  };

  return displayNames[platformType] || platformType;
}

/**
 * Get platform brand colors for UI
 */
export function getPlatformColor(platformType: PlatformType): string {
  const colors: Record<PlatformType, string> = {
    facebook: '#1877F2',
    'google-ads': '#4285F4',
    linkedin: '#0A66C2',
    tiktok: '#000000',
    twitter: '#1DA1F2',
    instagram: '#E4405F'
  };

  return colors[platformType] || '#6B7280';
}

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format large numbers with K/M/B suffixes
 */
export function formatNumber(num: number): string {
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num.toString();
}

export default PlatformManager;