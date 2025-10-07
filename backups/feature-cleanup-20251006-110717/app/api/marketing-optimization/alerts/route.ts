/**
 * Marketing Optimization Platform API - Smart Alerts
 * Consolidates original PulseBridge.ai alerts functionality
 */

import { NextRequest, NextResponse } from 'next/server';

// Mock alerts data for development
const mockAlerts = [
  {
    id: '1',
    type: 'budget',
    severity: 'high',
    title: 'Budget Threshold Exceeded',
    message: 'Google Ads Q4 Campaign has exceeded 80% of monthly budget with 10 days remaining.',
    campaign_id: '1',
    platform: 'google_ads',
    threshold_exceeded: {
      metric: 'budget_utilization',
      current_value: 0.85,
      threshold: 0.80
    },
    ai_recommendation: {
      action: 'Increase budget by 15% or pause low-performing ad groups',
      expected_impact: 'Maintain current performance levels through month-end',
      confidence: 0.88
    },
    status: 'active',
    created_at: new Date('2024-12-20T08:30:00Z')
  },
  {
    id: '2',
    type: 'performance',
    severity: 'medium',
    title: 'Declining Click-Through Rate',
    message: 'Meta Holiday Promotion CTR has dropped by 15% over the last 3 days.',
    campaign_id: '2',
    platform: 'meta',
    threshold_exceeded: {
      metric: 'ctr_decline',
      current_value: 0.15,
      threshold: 0.10
    },
    ai_recommendation: {
      action: 'Refresh ad creative and test new audience segments',
      expected_impact: 'Restore CTR to previous levels within 5-7 days',
      confidence: 0.75
    },
    status: 'active',
    created_at: new Date('2024-12-19T16:45:00Z')
  },
  {
    id: '3',
    type: 'opportunity',
    severity: 'medium',
    title: 'Keyword Expansion Opportunity',
    message: 'Search terms report shows high-volume related keywords not currently targeted.',
    campaign_id: '1',
    platform: 'google_ads',
    ai_recommendation: {
      action: 'Add 12 new related keywords to existing ad groups',
      expected_impact: '18-25% increase in qualified traffic',
      confidence: 0.82
    },
    status: 'active',
    created_at: new Date('2024-12-18T11:20:00Z')
  },
  {
    id: '4',
    type: 'anomaly',
    severity: 'low',
    title: 'Unusual Traffic Spike',
    message: 'LinkedIn B2B Campaign received 40% more impressions than usual yesterday.',
    campaign_id: '3',
    platform: 'linkedin',
    ai_recommendation: {
      action: 'Monitor for next 24 hours to confirm if trend continues',
      expected_impact: 'Potential opportunity for increased lead generation',
      confidence: 0.65
    },
    status: 'acknowledged',
    created_at: new Date('2024-12-17T09:15:00Z')
  },
  {
    id: '5',
    type: 'error',
    severity: 'critical',
    title: 'Campaign Delivery Issue',
    message: 'Meta campaign stopped delivering due to payment method failure.',
    campaign_id: '2',
    platform: 'meta',
    ai_recommendation: {
      action: 'Update payment method immediately to resume campaign delivery',
      expected_impact: 'Restore normal campaign delivery within 2-4 hours',
      confidence: 0.95
    },
    status: 'resolved',
    created_at: new Date('2024-12-16T14:30:00Z'),
    resolved_at: new Date('2024-12-16T15:45:00Z')
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const severity = searchParams.get('severity');
    const type = searchParams.get('type');
    
    let filteredAlerts = mockAlerts;
    
    if (status) {
      filteredAlerts = filteredAlerts.filter(alert => alert.status === status);
    }
    
    if (severity) {
      filteredAlerts = filteredAlerts.filter(alert => alert.severity === severity);
    }
    
    if (type) {
      filteredAlerts = filteredAlerts.filter(alert => alert.type === type);
    }
    
    // Sort by created_at descending (newest first)
    filteredAlerts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    return NextResponse.json(filteredAlerts);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const alertData = await request.json();
    
    const newAlert = {
      id: String(mockAlerts.length + 1),
      status: 'active',
      created_at: new Date(),
      ...alertData
    };
    
    mockAlerts.unshift(newAlert); // Add to beginning of array (newest first)
    
    return NextResponse.json(newAlert, { status: 201 });
  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    );
  }
}