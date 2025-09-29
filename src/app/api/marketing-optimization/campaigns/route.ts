/**
 * Marketing Optimization Platform API - Campaigns
 * Consolidates original PulseBridge.ai campaign management functionality
 */

import { NextRequest, NextResponse } from 'next/server';

// Mock data for development - replace with real database integration
const mockCampaigns = [
  {
    id: '1',
    name: 'Google Ads Q4 Campaign',
    platform: 'google_ads',
    status: 'active',
    client_name: 'TechCorp Inc.',
    budget: 10000,
    spend: 7500,
    target_audience: {
      demographics: { age_range: '25-45', gender: 'all' },
      interests: ['technology', 'business software'],
      locations: ['US', 'CA', 'UK'],
      custom_audiences: ['website-visitors', 'email-subscribers']
    },
    metrics: {
      impressions: 150000,
      clicks: 4500,
      conversions: 180,
      ctr: 3.0,
      cpc: 1.67,
      cpa: 41.67,
      roas: 4.2,
      quality_score: 8.5
    },
    ai_optimization: {
      enabled: true,
      strategy: 'balanced',
      auto_budget: true,
      auto_bidding: true,
      last_optimized: new Date('2024-12-20T10:30:00Z'),
      optimization_score: 87
    },
    created_at: new Date('2024-11-15T09:00:00Z'),
    updated_at: new Date('2024-12-20T10:30:00Z')
  },
  {
    id: '2',
    name: 'Meta Holiday Promotion',
    platform: 'meta',
    status: 'active',
    client_name: 'RetailPlus',
    budget: 8000,
    spend: 3200,
    target_audience: {
      demographics: { age_range: '18-55', gender: 'all' },
      interests: ['shopping', 'fashion', 'home decor'],
      locations: ['US'],
      custom_audiences: ['lookalike-customers']
    },
    metrics: {
      impressions: 95000,
      clicks: 2850,
      conversions: 142,
      ctr: 3.0,
      cpc: 1.12,
      cpa: 22.54,
      roas: 5.8,
      quality_score: 7.2
    },
    ai_optimization: {
      enabled: true,
      strategy: 'aggressive',
      auto_budget: true,
      auto_bidding: false,
      last_optimized: new Date('2024-12-19T14:15:00Z'),
      optimization_score: 92
    },
    created_at: new Date('2024-12-01T08:00:00Z'),
    updated_at: new Date('2024-12-19T14:15:00Z')
  },
  {
    id: '3',
    name: 'LinkedIn B2B Lead Gen',
    platform: 'linkedin',
    status: 'paused',
    client_name: 'SaaS Innovations',
    budget: 5000,
    spend: 4800,
    target_audience: {
      demographics: { age_range: '28-50', gender: 'all' },
      interests: ['software development', 'business intelligence'],
      locations: ['US', 'EU'],
      custom_audiences: ['c-level-executives']
    },
    metrics: {
      impressions: 45000,
      clicks: 900,
      conversions: 45,
      ctr: 2.0,
      cpc: 5.33,
      cpa: 106.67,
      roas: 2.4,
      quality_score: 6.8
    },
    ai_optimization: {
      enabled: false,
      strategy: 'conservative',
      auto_budget: false,
      auto_bidding: false,
      optimization_score: 65
    },
    created_at: new Date('2024-11-01T10:00:00Z'),
    updated_at: new Date('2024-12-10T16:20:00Z')
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    const status = searchParams.get('status');
    
    let filteredCampaigns = mockCampaigns;
    
    if (platform) {
      filteredCampaigns = filteredCampaigns.filter(campaign => campaign.platform === platform);
    }
    
    if (status) {
      filteredCampaigns = filteredCampaigns.filter(campaign => campaign.status === status);
    }
    
    return NextResponse.json(filteredCampaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const campaignData = await request.json();
    
    const newCampaign = {
      id: String(mockCampaigns.length + 1),
      ...campaignData,
      metrics: {
        impressions: 0,
        clicks: 0,
        conversions: 0,
        ctr: 0,
        cpc: 0,
        cpa: 0,
        roas: 0,
        quality_score: 0
      },
      ai_optimization: {
        enabled: campaignData.ai_optimization?.enabled || false,
        strategy: campaignData.ai_optimization?.strategy || 'balanced',
        auto_budget: campaignData.ai_optimization?.auto_budget || false,
        auto_bidding: campaignData.ai_optimization?.auto_bidding || false,
        optimization_score: 0
      },
      created_at: new Date(),
      updated_at: new Date()
    };
    
    mockCampaigns.push(newCampaign);
    
    return NextResponse.json(newCampaign, { status: 201 });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}