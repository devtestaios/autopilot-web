import { NextRequest, NextResponse } from 'next/server';

interface AnalyticsMetrics {
  summary: {
    pageViews: number;
    uniqueUsers: number;
    totalSessions: number;
    avgSessionDuration: number;
    bounceRate: number;
  };
  devices: Record<string, number>;
  browsers: Record<string, number>;
  topPages: Record<string, number>;
}

// Mock analytics data for demonstration
const analyticsData: AnalyticsMetrics = {
  summary: {
    pageViews: 15420,
    uniqueUsers: 3847,
    totalSessions: 4192,
    avgSessionDuration: 247,
    bounceRate: 0.42
  },
  devices: {
    'desktop': 2547,
    'mobile': 1325,
    'tablet': 320
  },
  browsers: {
    'Chrome': 2890,
    'Safari': 867,
    'Firefox': 285,
    'Edge': 150
  },
  topPages: {
    '/': 5420,
    '/campaigns': 2847,
    '/analytics': 1923,
    '/dashboard': 1547,
    '/pricing': 945
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'metrics';
    const range = searchParams.get('range') || '7d';

    switch (type) {
      case 'metrics':
        return NextResponse.json(analyticsData);

      case 'conversions':
        return NextResponse.json({
          totalConversions: 234,
          conversionsByType: {
            'signup': 156,
            'purchase': 78
          },
          funnelSteps: {
            'landing_page': 5420,
            'pricing_page': 945,
            'signup_form': 456,
            'completed_signup': 234
          },
          conversionRate: 4.32
        });

      case 'experiments':
        return NextResponse.json({
          activeTests: 2,
          testMetrics: {
            'landing_hero_test': {
              assignments: {
                'control': 125,
                'variant_a': 128
              },
              events: {
                'control': { clicks: 45, conversions: 8 },
                'variant_a': { clicks: 52, conversions: 12 }
              }
            },
            'pricing_layout_test': {
              assignments: {
                'control': 89,
                'variant_a': 91
              },
              events: {
                'control': { clicks: 32, conversions: 5 },
                'variant_a': { clicks: 38, conversions: 9 }
              }
            }
          }
        });

      default:
        return NextResponse.json(analyticsData);
    }
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // In a real implementation, you would:
    // 1. Validate the event data
    // 2. Store it in a database
    // 3. Process it for real-time analytics
    
    console.log('Analytics event received:', body);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics POST error:', error);
    return NextResponse.json(
      { error: 'Failed to process analytics event' },
      { status: 500 }
    );
  }
}