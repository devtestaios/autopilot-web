import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 [API] Social Media Analytics requested');
    
    // Return mock analytics data to prevent CORS errors during development
    const analyticsData = {
      success: true,
      data: {
        overview: {
          totalFollowers: 12500,
          totalEngagement: 8.4,
          totalReach: 45600,
          totalImpressions: 89200
        },
        platforms: {
          facebook: {
            followers: 5200,
            engagement: 7.8,
            reach: 18500,
            impressions: 32100
          },
          instagram: {
            followers: 4800,
            engagement: 9.2,
            reach: 16200,
            impressions: 28900
          },
          twitter: {
            followers: 2500,
            engagement: 6.9,
            reach: 10900,
            impressions: 28200
          }
        },
        recentPosts: [
          {
            id: '1',
            platform: 'instagram',
            content: 'Check out our latest marketing insights!',
            engagement: 142,
            reach: 1200,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '2',
            platform: 'facebook',
            content: 'New AI features launched today!',
            engagement: 89,
            reach: 950,
            createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
          }
        ]
      }
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('❌ [API] Social Media Analytics error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch social media analytics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📊 [API] Social Media Analytics POST request:', body);
    
    // Mock response for analytics operations
    return NextResponse.json({
      success: true,
      message: 'Analytics operation completed'
    });
  } catch (error) {
    console.error('❌ [API] Social Media Analytics POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process analytics request' },
      { status: 500 }
    );
  }
}