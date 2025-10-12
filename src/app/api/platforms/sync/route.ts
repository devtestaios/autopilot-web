/**
 * Platform Sync API
 * Triggers synchronization of campaign data from connected ad platforms
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import {
  syncPlatformCampaigns,
  syncUserPlatforms,
  savePlatformConnection,
  getUserConnections
} from '@/lib/platforms/sync';

/**
 * POST /api/platforms/sync
 * Connect a new platform or trigger sync for existing connection
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, platform, credentials } = body;

    // Handle different sync actions
    switch (action) {
      case 'connect': {
        // Connect a new platform
        if (!platform || !credentials) {
          return NextResponse.json(
            { error: 'Platform and credentials are required' },
            { status: 400 }
          );
        }

        const result = await savePlatformConnection(user.id, platform, credentials);

        if (!result.success) {
          return NextResponse.json(
            { error: result.error || 'Failed to connect platform' },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          message: `${platform} connected successfully`,
        });
      }

      case 'sync_all': {
        // Sync all user's connected platforms
        const syncResult = await syncUserPlatforms(user.id);

        return NextResponse.json({
          success: syncResult.success,
          results: syncResult.results,
        });
      }

      case 'sync_platform': {
        // Sync a specific platform
        if (!platform) {
          return NextResponse.json(
            { error: 'Platform is required' },
            { status: 400 }
          );
        }

        // Get user's connection for this platform
        const { data: connection, error: connError } = await supabase
          .from('platform_connections')
          .select('*')
          .eq('user_id', user.id)
          .eq('platform', platform)
          .single();

        if (connError || !connection) {
          return NextResponse.json(
            { error: 'Platform not connected' },
            { status: 404 }
          );
        }

        const syncResult = await syncPlatformCampaigns({
          userId: user.id,
          platform: connection.platform,
          credentials: connection.credentials,
          isActive: connection.is_active,
        });

        // Update last synced timestamp
        await supabase
          .from('platform_connections')
          .update({
            last_synced_at: new Date().toISOString(),
            sync_status: syncResult.success ? 'completed' : 'failed',
            sync_error: syncResult.errors.length > 0 ? syncResult.errors.join(', ') : null,
          })
          .eq('id', connection.id);

        return NextResponse.json({
          success: syncResult.success,
          synced: syncResult.synced,
          errors: syncResult.errors,
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: connect, sync_all, or sync_platform' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Platform sync error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/platforms/sync
 * Get user's platform connections and sync status
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const connections = await getUserConnections(user.id);

    return NextResponse.json({
      success: true,
      connections,
    });
  } catch (error) {
    console.error('Error fetching connections:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
