/**
 * Platform Integration API Endpoints
 * Handles platform connections, data synchronization, and metrics aggregation
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { PlatformManager, createPlatformManager, PlatformType } from '@/lib/platforms';

// =============================================================================
// GET: Fetch all platform connections for authenticated user
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's platform connections
    const { data: connections, error } = await supabase
      .from('platform_connections')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching platform connections:', error);
      return NextResponse.json({ error: 'Failed to fetch connections' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      connections: connections || []
    });

  } catch (error) {
    console.error('Platform connections API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// =============================================================================
// POST: Create new platform connection or test existing one
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
    const { action, platformType, credentials, accountId, accountName } = body;

    const platformManager = createPlatformManager(supabase);

    if (action === 'test') {
      // Test platform connection
      const result = await platformManager.testPlatformConnection(platformType as PlatformType);
      return NextResponse.json(result);
    }

    if (action === 'connect') {
      // Create new platform connection
      if (!platformType || !credentials || !accountId) {
        return NextResponse.json({ 
          error: 'Missing required fields: platformType, credentials, accountId' 
        }, { status: 400 });
      }

      // Check if connection already exists
      const { data: existing } = await supabase
        .from('platform_connections')
        .select('id')
        .eq('user_id', user.id)
        .eq('platform_type', platformType)
        .eq('account_id', accountId)
        .single();

      if (existing) {
        return NextResponse.json({ 
          error: 'Connection already exists for this platform and account' 
        }, { status: 409 });
      }

      // Create new connection
      const { data: connection, error } = await supabase
        .from('platform_connections')
        .insert({
          user_id: user.id,
          platform_type: platformType,
          platform_name: getPlatformDisplayName(platformType),
          account_id: accountId,
          account_name: accountName || `${platformType} Account`,
          is_active: true,
          credentials: credentials,
          sync_status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating platform connection:', error);
        return NextResponse.json({ error: 'Failed to create connection' }, { status: 500 });
      }

      // Test the new connection
      const testResult = await platformManager.testPlatformConnection(platformType as PlatformType);
      
      // Update connection status based on test
      await supabase
        .from('platform_connections')
        .update({
          sync_status: testResult.success ? 'success' : 'error',
          error_message: testResult.success ? null : testResult.message,
          last_sync: new Date().toISOString()
        })
        .eq('id', connection.id);

      return NextResponse.json({
        success: true,
        connection: {
          ...connection,
          sync_status: testResult.success ? 'success' : 'error',
          error_message: testResult.success ? null : testResult.message
        },
        testResult
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Platform connection POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// =============================================================================
// PUT: Update existing platform connection
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
    const { connectionId, isActive, credentials } = body;

    if (!connectionId) {
      return NextResponse.json({ error: 'Connection ID required' }, { status: 400 });
    }

    // Verify user owns this connection
    const { data: connection, error: fetchError } = await supabase
      .from('platform_connections')
      .select('*')
      .eq('id', connectionId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !connection) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    }

    // Update connection
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (typeof isActive === 'boolean') {
      updateData.is_active = isActive;
    }

    if (credentials) {
      updateData.credentials = credentials;
      updateData.sync_status = 'pending'; // Reset status when credentials change
      updateData.error_message = null;
    }

    const { data: updated, error } = await supabase
      .from('platform_connections')
      .update(updateData)
      .eq('id', connectionId)
      .select()
      .single();

    if (error) {
      console.error('Error updating platform connection:', error);
      return NextResponse.json({ error: 'Failed to update connection' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      connection: updated
    });

  } catch (error) {
    console.error('Platform connection PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// =============================================================================
// DELETE: Remove platform connection
// =============================================================================

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const connectionId = searchParams.get('id');

    if (!connectionId) {
      return NextResponse.json({ error: 'Connection ID required' }, { status: 400 });
    }

    // Verify user owns this connection
    const { data: connection, error: fetchError } = await supabase
      .from('platform_connections')
      .select('id')
      .eq('id', connectionId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !connection) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    }

    // Delete connection (this will cascade to related campaign metrics)
    const { error } = await supabase
      .from('platform_connections')
      .delete()
      .eq('id', connectionId);

    if (error) {
      console.error('Error deleting platform connection:', error);
      return NextResponse.json({ error: 'Failed to delete connection' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Connection deleted successfully'
    });

  } catch (error) {
    console.error('Platform connection DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function getPlatformDisplayName(platformType: string): string {
  const displayNames: Record<string, string> = {
    facebook: 'Facebook Ads',
    'google-ads': 'Google Ads',
    linkedin: 'LinkedIn Ads',
    tiktok: 'TikTok Business',
    twitter: 'Twitter Ads',
    instagram: 'Instagram Business'
  };

  return displayNames[platformType] || platformType;
}