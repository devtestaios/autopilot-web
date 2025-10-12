/**
 * Platform Data Sync Service
 * Syncs campaigns, metrics, and other data from connected ad platforms into Supabase
 */

import { createClient } from '@supabase/supabase-js';
import { MetaAdsAdapter } from './metaAds';
import { GoogleAdsAdapter } from './googleAds';
import { LinkedInAdsAdapter } from './linkedInAds';
import type { UnifiedCampaign, UnifiedMetrics, PlatformAdapter } from './base';

// Initialize Supabase client for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface PlatformConnection {
  userId: string;
  platform: 'meta_ads' | 'google_ads' | 'linkedin_ads' | 'pinterest_ads';
  credentials: Record<string, string>;
  isActive: boolean;
}

/**
 * Get platform adapter instance based on platform type
 */
function getPlatformAdapter(platform: string): PlatformAdapter | null {
  switch (platform) {
    case 'meta_ads':
      return new MetaAdsAdapter();
    case 'google_ads':
      return new GoogleAdsAdapter();
    case 'linkedin_ads':
      return new LinkedInAdsAdapter();
    default:
      console.warn(`Unknown platform: ${platform}`);
      return null;
  }
}

/**
 * Sync campaigns from a connected platform into Supabase
 */
export async function syncPlatformCampaigns(connection: PlatformConnection): Promise<{
  success: boolean;
  synced: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let syncedCount = 0;

  try {
    const adapter = getPlatformAdapter(connection.platform);
    if (!adapter) {
      return { success: false, synced: 0, errors: ['Invalid platform'] };
    }

    // Authenticate with platform
    const authenticated = await adapter.authenticate(connection.credentials);
    if (!authenticated) {
      return { success: false, synced: 0, errors: ['Authentication failed'] };
    }

    // Fetch campaigns from platform
    const platformCampaigns = await adapter.getCampaigns(100, 0);

    // Sync each campaign to Supabase
    for (const campaign of platformCampaigns) {
      try {
        const campaignData = {
          user_id: connection.userId,
          name: campaign.name,
          platform: connection.platform,
          status: campaign.status,
          client_name: null, // Can be set by user later
          budget: campaign.budget?.amount || 0,
          spend: 0, // Will be updated from metrics
          target_audience: campaign.targeting || {},
          metrics: {
            impressions: 0,
            clicks: 0,
            conversions: 0,
            ctr: 0,
            cpc: 0,
            cpa: 0,
            roas: 0,
            quality_score: 0,
          },
          ai_optimization: {
            enabled: false,
            strategy: 'balanced',
            auto_budget: false,
            auto_bidding: false,
            optimization_score: 0,
          },
          platform_campaign_id: campaign.platformCampaignId,
          platform_data: campaign,
          created_at: campaign.createdAt || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Upsert campaign (update if exists, insert if new)
        const { error } = await supabase
          .from('campaigns')
          .upsert(
            campaignData,
            {
              onConflict: 'platform_campaign_id',
              ignoreDuplicates: false,
            }
          );

        if (error) {
          errors.push(`Failed to sync campaign ${campaign.name}: ${error.message}`);
        } else {
          syncedCount++;
        }
      } catch (err) {
        errors.push(`Error syncing campaign: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }

    return {
      success: errors.length === 0,
      synced: syncedCount,
      errors,
    };
  } catch (error) {
    console.error('Platform sync error:', error);
    return {
      success: false,
      synced: syncedCount,
      errors: [error instanceof Error ? error.message : 'Unknown sync error'],
    };
  }
}

/**
 * Sync metrics for a specific campaign
 */
export async function syncCampaignMetrics(
  connection: PlatformConnection,
  campaignId: string,
  startDate: string,
  endDate: string
): Promise<{ success: boolean; metrics?: UnifiedMetrics[] }> {
  try {
    const adapter = getPlatformAdapter(connection.platform);
    if (!adapter) {
      return { success: false };
    }

    await adapter.authenticate(connection.credentials);

    // Fetch metrics from platform
    const metrics = await adapter.getMetrics(campaignId, startDate, endDate, 'daily');

    // Store metrics in Supabase (you'll need a metrics table)
    // For now, we'll just update the campaign's latest metrics
    if (metrics.length > 0) {
      const latestMetrics = metrics[metrics.length - 1];

      await supabase
        .from('campaigns')
        .update({
          spend: latestMetrics.spend,
          metrics: {
            impressions: latestMetrics.impressions,
            clicks: latestMetrics.clicks,
            conversions: latestMetrics.conversions,
            ctr: latestMetrics.ctr,
            cpc: latestMetrics.cpc,
            cpa: latestMetrics.cpa,
            roas: latestMetrics.roas,
            quality_score: 0, // Platform-specific
          },
          updated_at: new Date().toISOString(),
        })
        .eq('platform_campaign_id', campaignId);
    }

    return {
      success: true,
      metrics,
    };
  } catch (error) {
    console.error('Metrics sync error:', error);
    return { success: false };
  }
}

/**
 * Sync all active platform connections for a user
 */
export async function syncUserPlatforms(userId: string): Promise<{
  success: boolean;
  results: Record<string, { synced: number; errors: string[] }>;
}> {
  try {
    // Fetch user's platform connections from Supabase
    const { data: connections, error } = await supabase
      .from('platform_connections')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching connections:', error);
      return { success: false, results: {} };
    }

    if (!connections || connections.length === 0) {
      return { success: true, results: {} };
    }

    const results: Record<string, { synced: number; errors: string[] }> = {};

    // Sync each connected platform
    for (const connection of connections) {
      const syncResult = await syncPlatformCampaigns({
        userId: connection.user_id,
        platform: connection.platform,
        credentials: connection.credentials,
        isActive: connection.is_active,
      });

      results[connection.platform] = {
        synced: syncResult.synced,
        errors: syncResult.errors,
      };
    }

    return {
      success: true,
      results,
    };
  } catch (error) {
    console.error('User platforms sync error:', error);
    return { success: false, results: {} };
  }
}

/**
 * Get user's connected platforms
 */
export async function getUserConnections(userId: string) {
  const { data, error } = await supabase
    .from('platform_connections')
    .select('*')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user connections:', error);
    return [];
  }

  return data || [];
}

/**
 * Add or update a platform connection
 */
export async function savePlatformConnection(
  userId: string,
  platform: string,
  credentials: Record<string, string>
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate credentials by trying to authenticate
    const adapter = getPlatformAdapter(platform);
    if (!adapter) {
      return { success: false, error: 'Invalid platform' };
    }

    const isValid = await adapter.validateCredentials(credentials);
    if (!isValid) {
      return { success: false, error: 'Invalid credentials format' };
    }

    const authenticated = await adapter.authenticate(credentials);
    if (!authenticated) {
      return { success: false, error: 'Authentication failed' };
    }

    // Save connection to Supabase
    const { error } = await supabase
      .from('platform_connections')
      .upsert({
        user_id: userId,
        platform,
        credentials,
        is_active: true,
        last_synced_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,platform',
      });

    if (error) {
      return { success: false, error: error.message };
    }

    // Trigger initial sync
    await syncPlatformCampaigns({
      userId,
      platform: platform as any,
      credentials,
      isActive: true,
    });

    return { success: true };
  } catch (error) {
    console.error('Save connection error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
