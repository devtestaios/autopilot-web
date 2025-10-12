import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// =============================================================================
// DASHBOARD PLATFORMS API ENDPOINT
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '7d';
    
    // Mock platform data
    const mockPlatforms = [
      {
        platform: 'facebook',
        status: 'connected',
        spend: 15420,
        impressions: 450000,
        clicks: 12300,
        ctr: 0.027,
        cpc: 1.25,
        lastSync: new Date(Date.now() - 300000).toISOString(), // 5 min ago
        campaigns: 8,
        health: 'excellent'
      },
      {
        platform: 'google-ads',
        status: 'connected',
        spend: 18750,
        impressions: 520000,
        clicks: 15200,
        ctr: 0.029,
        cpc: 1.23,
        lastSync: new Date(Date.now() - 600000).toISOString(), // 10 min ago
        campaigns: 12,
        health: 'good'
      },
      {
        platform: 'linkedin',
        status: 'connected',
        spend: 8930,
        impressions: 185000,
        clicks: 4200,
        ctr: 0.023,
        cpc: 2.13,
        lastSync: new Date(Date.now() - 900000).toISOString(), // 15 min ago
        campaigns: 5,
        health: 'good'
      },
      {
        platform: 'tiktok',
        status: 'error',
        spend: 2130,
        impressions: 95000,
        clicks: 800,
        ctr: 0.008,
        cpc: 2.66,
        lastSync: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        campaigns: 3,
        health: 'warning'
      },
      {
        platform: 'twitter',
        status: 'disconnected',
        spend: 0,
        impressions: 0,
        clicks: 0,
        ctr: 0,
        cpc: 0,
        lastSync: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        campaigns: 0,
        health: 'critical'
      },
      {
        platform: 'instagram',
        status: 'syncing',
        spend: 6420,
        impressions: 210000,
        clicks: 5100,
        ctr: 0.024,
        cpc: 1.26,
        lastSync: new Date().toISOString(), // now
        campaigns: 4,
        health: 'good'
      }
    ];
    
    // Simulate data variation based on time range
    const multipliers = {
      '24h': 0.1,
      '7d': 1,
      '30d': 3.5,
      '90d': 8.2
    };
    
    const multiplier = multipliers[timeRange as keyof typeof multipliers] || 1;
    
    const adjustedPlatforms = mockPlatforms.map(platform => ({
      ...platform,
      spend: Math.round(platform.spend * multiplier),
      impressions: Math.round(platform.impressions * multiplier),
      clicks: Math.round(platform.clicks * multiplier),
    }));
    
    return NextResponse.json({
      success: true,
      platforms: adjustedPlatforms,
      timeRange
    });
    
  } catch (error) {
    console.error('Dashboard platforms error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch platform data' 
      },
      { status: 500 }
    );
  }
}