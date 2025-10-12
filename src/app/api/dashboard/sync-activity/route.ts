import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// =============================================================================
// DASHBOARD SYNC ACTIVITY API ENDPOINT
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    // Mock sync activity data
    const mockActivities = [
      {
        id: '1',
        platform: 'facebook',
        type: 'incremental',
        status: 'success',
        timestamp: new Date(Date.now() - 300000).toISOString(), // 5 min ago
        recordsProcessed: 1250,
        duration: 45,
        message: 'Campaign data updated successfully'
      },
      {
        id: '2',
        platform: 'google-ads',
        type: 'full_sync',
        status: 'success',
        timestamp: new Date(Date.now() - 600000).toISOString(), // 10 min ago
        recordsProcessed: 3420,
        duration: 120,
        message: 'Complete data refresh completed'
      },
      {
        id: '3',
        platform: 'linkedin',
        type: 'incremental',
        status: 'success',
        timestamp: new Date(Date.now() - 900000).toISOString(), // 15 min ago
        recordsProcessed: 680,
        duration: 32,
        message: 'Ad performance metrics updated'
      },
      {
        id: '4',
        platform: 'tiktok',
        type: 'error_recovery',
        status: 'error',
        timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
        recordsProcessed: 0,
        duration: 15,
        message: 'Authentication failed - token expired'
      },
      {
        id: '5',
        platform: 'instagram',
        type: 'incremental',
        status: 'in_progress',
        timestamp: new Date().toISOString(), // now
        recordsProcessed: 450,
        duration: 0,
        message: 'Syncing campaign data...'
      },
      {
        id: '6',
        platform: 'facebook',
        type: 'full_sync',
        status: 'success',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        recordsProcessed: 5680,
        duration: 180,
        message: 'Daily full sync completed'
      },
      {
        id: '7',
        platform: 'google-ads',
        type: 'incremental',
        status: 'success',
        timestamp: new Date(Date.now() - 5400000).toISOString(), // 1.5 hours ago
        recordsProcessed: 2100,
        duration: 85,
        message: 'Keywords and bid adjustments synced'
      },
      {
        id: '8',
        platform: 'linkedin',
        type: 'full_sync',
        status: 'success',
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        recordsProcessed: 1890,
        duration: 95,
        message: 'Campaign and audience data refreshed'
      }
    ];
    
    // Sort by timestamp (most recent first)
    const sortedActivities = mockActivities.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    return NextResponse.json({
      success: true,
      activities: sortedActivities.slice(0, 20) // Return last 20 activities
    });
    
  } catch (error) {
    console.error('Dashboard sync activity error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch sync activity' 
      },
      { status: 500 }
    );
  }
}