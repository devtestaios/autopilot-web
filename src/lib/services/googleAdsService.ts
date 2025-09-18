/**
 * Google Ads Service for Live API Integration
 * 
 * This service handles the transition from mock data to live Google Ads API data.
 * It provides intelligent fallbacks and can detect when real endpoints are available.
 */

import type { Campaign } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api-1.onrender.com';

export interface GoogleAdsConnectionStatus {
  connected: boolean;
  status: 'connected' | 'disconnected' | 'error' | 'checking';
  customer_id?: string;
  message?: string;
  error?: string;
  last_checked?: string;
}

export interface GoogleAdsCampaign {
  id: string;
  name: string;
  status: string;
  budget_amount: number;
  spend: number;
  clicks: number;
  impressions: number;
  conversions: number;
  ctr: number;
  cpc: number;
  cpa: number;
  created_at: string;
  updated_at: string;
  campaign_type: string;
  bidding_strategy?: string;
}

export interface GoogleAdsMetrics {
  campaign_id: string;
  date: string;
  spend: number;
  clicks: number;
  impressions: number;
  conversions: number;
  ctr: number;
  cpc: number;
  cpa: number;
  quality_score?: number;
  search_impression_share?: number;
}

class GoogleAdsService {
  private isConnected: boolean = false;
  private lastConnectionCheck: Date | null = null;
  private connectionStatus: GoogleAdsConnectionStatus = {
    connected: false,
    status: 'checking'
  };

  /**
   * Check if Google Ads API is available and connected
   */
  async checkConnection(): Promise<GoogleAdsConnectionStatus> {
    try {
      const response = await fetch(`${API_BASE}/google-ads/status`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.status === 404) {
        // Endpoint not implemented yet
        this.connectionStatus = {
          connected: false,
          status: 'disconnected',
          message: 'Google Ads integration not yet deployed. Using demo data.',
          last_checked: new Date().toISOString()
        };
        this.isConnected = false;
        return this.connectionStatus;
      }

      if (!response.ok) {
        throw new Error(`Connection check failed: ${response.status}`);
      }

      const data = await response.json();
      this.connectionStatus = {
        ...data,
        last_checked: new Date().toISOString()
      };
      this.isConnected = data.connected || false;
      this.lastConnectionCheck = new Date();

      return this.connectionStatus;
    } catch (error) {
      this.connectionStatus = {
        connected: false,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        last_checked: new Date().toISOString()
      };
      this.isConnected = false;
      return this.connectionStatus;
    }
  }

  /**
   * Get current connection status without making a new request
   */
  getConnectionStatus(): GoogleAdsConnectionStatus {
    return this.connectionStatus;
  }

  /**
   * Fetch campaigns from Google Ads API or return demo data
   */
  async fetchCampaigns(): Promise<Campaign[]> {
    // Check connection status first
    await this.checkConnection();

    if (this.isConnected) {
      try {
        const response = await fetch(`${API_BASE}/google-ads/campaigns`);
        if (response.ok) {
          const googleAdsCampaigns: GoogleAdsCampaign[] = await response.json();
          return this.transformGoogleAdsCampaigns(googleAdsCampaigns);
        }
      } catch (error) {
        console.warn('Failed to fetch live Google Ads data, falling back to demo data:', error);
      }
    }

    // Return demo data when live API is not available
    return this.getDemoCampaigns();
  }

  /**
   * Sync campaigns from Google Ads API
   */
  async syncCampaigns(): Promise<{ success: boolean; synced: number; message: string }> {
    await this.checkConnection();

    if (!this.isConnected) {
      // Create demo campaigns in local database
      const demoCampaigns = this.getDemoCampaigns();
      await this.createDemoCampaigns(demoCampaigns);
      
      return {
        success: true,
        synced: demoCampaigns.length,
        message: `Demo sync completed: ${demoCampaigns.length} sample campaigns created`
      };
    }

    try {
      const response = await fetch(`${API_BASE}/google-ads/sync-campaigns`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Sync failed: ${response.status}`);
      }

      const result = await response.json();
      return {
        success: true,
        synced: result.synced || 0,
        message: result.message || `Successfully synced ${result.synced || 0} campaigns`
      };
    } catch (error) {
      return {
        success: false,
        synced: 0,
        message: error instanceof Error ? error.message : 'Sync failed'
      };
    }
  }

  /**
   * Fetch performance metrics for a specific campaign
   */
  async fetchCampaignMetrics(
    campaignId: string, 
    days: number = 30
  ): Promise<GoogleAdsMetrics[]> {
    await this.checkConnection();

    if (this.isConnected) {
      try {
        const response = await fetch(
          `${API_BASE}/google-ads/campaigns/${campaignId}/metrics?days=${days}`
        );
        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        console.warn('Failed to fetch live metrics, using demo data:', error);
      }
    }

    // Return demo metrics
    return this.getDemoMetrics(campaignId, days);
  }

  /**
   * Transform Google Ads API campaigns to our unified format
   */
  private transformGoogleAdsCampaigns(googleCampaigns: GoogleAdsCampaign[]): Campaign[] {
    return googleCampaigns.map(gc => ({
      id: gc.id,
      name: gc.name,
      platform: 'google_ads' as const,
      client_name: 'Google Ads Client', // This should come from API
      budget: gc.budget_amount,
      spend: gc.spend,
      status: this.mapGoogleAdsStatus(gc.status),
      metrics: {
        impressions: gc.impressions,
        clicks: gc.clicks,
        conversions: gc.conversions,
        ctr: gc.ctr,
        cpc: gc.cpc,
        cpa: gc.cpa,
        campaign_type: gc.campaign_type,
        bidding_strategy: gc.bidding_strategy
      },
      created_at: gc.created_at,
      updated_at: gc.updated_at
    }));
  }

  /**
   * Map Google Ads status to our unified status format
   */
  private mapGoogleAdsStatus(googleStatus: string): 'active' | 'paused' | 'ended' {
    switch (googleStatus.toLowerCase()) {
      case 'enabled':
      case 'serving':
        return 'active';
      case 'paused':
        return 'paused';
      case 'removed':
      case 'ended':
        return 'ended';
      default:
        return 'paused';
    }
  }

  /**
   * Create demo campaigns in the local database
   */
  private async createDemoCampaigns(campaigns: Campaign[]): Promise<void> {
    for (const campaign of campaigns) {
      try {
        await fetch(`${API_BASE}/campaigns`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(campaign)
        });
      } catch (error) {
        console.warn('Failed to create demo campaign:', error);
      }
    }
  }

  /**
   * Generate demo campaigns with realistic Google Ads data
   */
  private getDemoCampaigns(): Campaign[] {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    return [
      {
        id: 'gads-brand-001',
        name: 'Google Ads - Brand Search Campaign',
        platform: 'google_ads',
        client_name: 'Demo Client - E-commerce',
        budget: 5000,
        spend: 3420.50,
        status: 'active',
        metrics: {
          impressions: 45230,
          clicks: 2341,
          conversions: 127,
          ctr: 5.17,
          cpc: 1.46,
          cpa: 26.93,
          campaign_type: 'Search',
          bidding_strategy: 'Target CPA',
          quality_score: 8.2,
          search_impression_share: 78.5
        },
        created_at: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: yesterday.toISOString()
      },
      {
        id: 'gads-shopping-002',
        name: 'Google Shopping - Product Catalog',
        platform: 'google_ads',
        client_name: 'Demo Client - E-commerce',
        budget: 3000,
        spend: 2156.75,
        status: 'active',
        metrics: {
          impressions: 67890,
          clicks: 1523,
          conversions: 89,
          ctr: 2.24,
          cpc: 1.42,
          cpa: 24.23,
          campaign_type: 'Shopping',
          bidding_strategy: 'Target ROAS',
          quality_score: 7.8,
          search_impression_share: 65.2
        },
        created_at: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: yesterday.toISOString()
      },
      {
        id: 'gads-display-003',
        name: 'Google Display - Remarketing Campaign',
        platform: 'google_ads',
        client_name: 'Demo Client - E-commerce',
        budget: 2000,
        spend: 1340.25,
        status: 'active',
        metrics: {
          impressions: 234567,
          clicks: 892,
          conversions: 34,
          ctr: 0.38,
          cpc: 1.50,
          cpa: 39.42,
          campaign_type: 'Display',
          bidding_strategy: 'Maximize Conversions',
          quality_score: 6.5
        },
        created_at: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: yesterday.toISOString()
      },
      {
        id: 'gads-video-004',
        name: 'YouTube Ads - Brand Awareness',
        platform: 'google_ads',
        client_name: 'Demo Client - E-commerce',
        budget: 1500,
        spend: 892.30,
        status: 'paused',
        metrics: {
          impressions: 156789,
          clicks: 445,
          conversions: 18,
          ctr: 0.28,
          cpc: 2.01,
          cpa: 49.57,
          campaign_type: 'Video',
          bidding_strategy: 'Target CPM'
        },
        created_at: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: yesterday.toISOString()
      }
    ];
  }

  /**
   * Generate demo metrics for a campaign
   */
  private getDemoMetrics(campaignId: string, days: number): GoogleAdsMetrics[] {
    const metrics: GoogleAdsMetrics[] = [];
    const now = new Date();

    for (let i = 0; i < days; i++) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      
      // Generate realistic daily variations
      const baseSpend = 100 + Math.random() * 200;
      const baseClicks = Math.floor(baseSpend / (1.2 + Math.random() * 0.8));
      const baseImpressions = baseClicks * (30 + Math.random() * 20);
      const baseConversions = Math.floor(baseClicks * (0.02 + Math.random() * 0.08));

      metrics.push({
        campaign_id: campaignId,
        date: date.toISOString().split('T')[0],
        spend: Math.round(baseSpend * 100) / 100,
        clicks: baseClicks,
        impressions: baseImpressions,
        conversions: baseConversions,
        ctr: Math.round((baseClicks / baseImpressions) * 10000) / 100,
        cpc: Math.round((baseSpend / baseClicks) * 100) / 100,
        cpa: baseConversions > 0 ? Math.round((baseSpend / baseConversions) * 100) / 100 : 0,
        quality_score: 6 + Math.random() * 4,
        search_impression_share: 60 + Math.random() * 30
      });
    }

    return metrics.reverse(); // Return chronological order
  }
}

// Export singleton instance
export const googleAdsService = new GoogleAdsService();

// Export individual functions for convenience
export const checkGoogleAdsConnection = () => googleAdsService.checkConnection();
export const fetchGoogleAdsCampaigns = () => googleAdsService.fetchCampaigns();
export const syncGoogleAdsCampaigns = () => googleAdsService.syncCampaigns();
export const fetchGoogleAdsMetrics = (campaignId: string, days?: number) => 
  googleAdsService.fetchCampaignMetrics(campaignId, days);