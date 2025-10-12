import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// =============================================================================
// DASHBOARD METRICS API ENDPOINT
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '7d';
    
    // For demo purposes, we'll return mock data
    // In production, this would fetch real data from your database
    const mockMetrics = {
      totalConnections: 6,
      activeConnections: 4,
      totalSpend: 45230,
      totalImpressions: 1250000,
      totalClicks: 32500,
      avgCTR: 0.026,
      avgCPC: 1.39,
      lastSyncTime: new Date().toISOString(),
    };
    
    // Simulate data variation based on time range
    const multipliers = {
      '24h': 0.1,
      '7d': 1,
      '30d': 3.5,
      '90d': 8.2
    };
    
    const multiplier = multipliers[timeRange as keyof typeof multipliers] || 1;
    
    const adjustedMetrics = {
      ...mockMetrics,
      totalSpend: Math.round(mockMetrics.totalSpend * multiplier),
      totalImpressions: Math.round(mockMetrics.totalImpressions * multiplier),
      totalClicks: Math.round(mockMetrics.totalClicks * multiplier),
    };
    
    return NextResponse.json({
      success: true,
      metrics: adjustedMetrics,
      timeRange
    });
    
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch dashboard metrics' 
      },
      { status: 500 }
    );
  }
}