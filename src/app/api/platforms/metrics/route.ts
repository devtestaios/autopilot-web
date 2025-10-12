/**
 * Campaign Metrics API Endpoints
 * Handles real-time campaign data synchronization and metrics aggregation
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { PlatformManager, createPlatformManager } from '@/lib/platforms';
import { format, subDays } from 'date-fns';

// =============================================================================
// GET: Fetch campaign metrics for authenticated user
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const startDate = searchParams.get('start') || format(subDays(new Date(), 30), 'yyyy-MM-dd');
    const endDate = searchParams.get('end') || format(new Date(), 'yyyy-MM-dd');
    const live = searchParams.get('live') === 'true';

    const platformManager = createPlatformManager(supabase);

    if (live) {
      // Fetch live data from APIs
      const metrics = await platformManager.getAllCampaignMetrics(user.id, {
        start: startDate,
        end: endDate
      });

      return NextResponse.json({
        success: true,
        source: 'live',
        metrics,
        dateRange: { start: startDate, end: endDate },
        lastUpdated: new Date().toISOString()
      });
    } else {
      // Fetch cached data from database
      let query = supabase
        .from('campaign_metrics')
        .select('*')
        .eq('user_id', user.id)
        .gte('date_start', startDate)
        .lte('date_end', endDate)
        .order('date_start', { ascending: false });

      if (platform && platform !== 'all') {
        query = query.eq('platform_type', platform);
      }

      const { data: metrics, error } = await query;

      if (error) {
        console.error('Error fetching campaign metrics:', error);
        return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        source: 'cached',
        metrics: metrics || [],
        dateRange: { start: startDate, end: endDate },
        lastUpdated: metrics?.[0]?.last_updated || null
      });
    }

  } catch (error) {
    console.error('Campaign metrics GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// =============================================================================
// POST: Sync campaign data from all platforms
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, platforms, dateRange } = body;

    const platformManager = createPlatformManager(supabase);

    if (action === 'sync') {
      // Sync data from all connected platforms
      const syncResults = await platformManager.syncAllPlatforms(user.id);

      // Calculate summary statistics
      const successCount = syncResults.filter(r => r.success).length;
      const totalCampaigns = syncResults.reduce((sum, r) => sum + r.campaignCount, 0);
      const totalMetrics = syncResults.reduce((sum, r) => sum + r.metricsCount, 0);
      const avgSyncTime = syncResults.reduce((sum, r) => sum + r.syncDuration, 0) / syncResults.length;

      return NextResponse.json({
        success: true,
        syncResults,
        summary: {
          platformsConnected: syncResults.length,
          platformsSuccessful: successCount,
          totalCampaigns,
          totalMetrics,
          averageSyncTime: Math.round(avgSyncTime),
          lastSync: new Date().toISOString()
        }
      });
    }

    if (action === 'aggregate') {
      // Get aggregated metrics across all platforms
      const aggregatedMetrics = await platformManager.getAggregatedMetrics(user.id, dateRange);

      return NextResponse.json({
        success: true,
        aggregatedMetrics,
        dateRange: dateRange || {
          start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
          end: format(new Date(), 'yyyy-MM-dd')
        },
        lastUpdated: new Date().toISOString()
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Campaign metrics POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// =============================================================================
// PUT: Update campaign metrics or settings
// =============================================================================

export async function PUT(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, campaignId, platformType, settings } = body;

    if (action === 'updateSettings') {
      // Update campaign tracking settings
      const { error } = await supabase
        .from('campaign_settings')
        .upsert({
          user_id: user.id,
          campaign_id: campaignId,
          platform_type: platformType,
          settings: settings,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,campaign_id,platform_type'
        });

      if (error) {
        console.error('Error updating campaign settings:', error);
        return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: 'Campaign settings updated successfully'
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Campaign metrics PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}