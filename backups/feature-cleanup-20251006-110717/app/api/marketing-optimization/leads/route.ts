/**
 * Marketing Optimization Platform API - Leads
 * Consolidates original PulseBridge.ai lead management functionality
 */

import { NextRequest, NextResponse } from 'next/server';

// Mock leads data for development
const mockLeads = [
  {
    id: '1',
    email: 'john.doe@techcorp.com',
    name: 'John Doe',
    company: 'TechCorp Solutions',
    phone: '+1-555-0123',
    source: 'Google Ads Campaign',
    campaign_id: '1',
    platform: 'google_ads',
    score: 85,
    status: 'qualified',
    stage: 'consideration',
    engagement: {
      email_opened: true,
      link_clicked: true,
      form_submitted: true,
      page_views: 15,
      time_on_site: 420,
      last_activity: new Date('2024-12-19T14:30:00Z')
    },
    ai_insights: {
      conversion_probability: 0.78,
      recommended_actions: [
        'Schedule demo call within 48 hours',
        'Send case study for similar company size',
        'Follow up with pricing information'
      ],
      best_contact_time: new Date('2024-12-21T10:00:00Z'),
      predicted_value: 12500
    },
    created_at: new Date('2024-12-15T09:30:00Z'),
    updated_at: new Date('2024-12-19T14:30:00Z')
  },
  {
    id: '2',
    email: 'sarah.wilson@retailplus.com',
    name: 'Sarah Wilson',
    company: 'RetailPlus Inc',
    phone: '+1-555-0456',
    source: 'Meta Holiday Campaign',
    campaign_id: '2',
    platform: 'meta',
    score: 72,
    status: 'contacted',
    stage: 'interest',
    engagement: {
      email_opened: true,
      link_clicked: false,
      form_submitted: true,
      page_views: 8,
      time_on_site: 180,
      last_activity: new Date('2024-12-18T11:15:00Z')
    },
    ai_insights: {
      conversion_probability: 0.65,
      recommended_actions: [
        'Send product demo video',
        'Offer limited-time discount',
        'Connect via LinkedIn'
      ],
      best_contact_time: new Date('2024-12-20T15:00:00Z'),
      predicted_value: 8900
    },
    created_at: new Date('2024-12-12T16:45:00Z'),
    updated_at: new Date('2024-12-18T11:15:00Z')
  },
  {
    id: '3',
    email: 'mike.chen@saasinnov.com',
    name: 'Mike Chen',
    company: 'SaaS Innovations',
    phone: '+1-555-0789',
    source: 'LinkedIn B2B Campaign',
    campaign_id: '3',
    platform: 'linkedin',
    score: 91,
    status: 'converted',
    stage: 'purchase',
    engagement: {
      email_opened: true,
      link_clicked: true,
      form_submitted: true,
      page_views: 25,
      time_on_site: 680,
      last_activity: new Date('2024-12-20T09:45:00Z')
    },
    ai_insights: {
      conversion_probability: 0.95,
      recommended_actions: [
        'Complete onboarding process',
        'Schedule success manager introduction',
        'Explore upsell opportunities'
      ],
      predicted_value: 25000
    },
    created_at: new Date('2024-11-28T08:20:00Z'),
    updated_at: new Date('2024-12-20T09:45:00Z')
  },
  {
    id: '4',
    email: 'lisa.rodriguez@startup.io',
    name: 'Lisa Rodriguez',
    company: 'Startup.io',
    source: 'Organic Search',
    score: 45,
    status: 'new',
    stage: 'awareness',
    engagement: {
      email_opened: false,
      link_clicked: false,
      form_submitted: true,
      page_views: 3,
      time_on_site: 90,
      last_activity: new Date('2024-12-20T16:20:00Z')
    },
    ai_insights: {
      conversion_probability: 0.32,
      recommended_actions: [
        'Send welcome email sequence',
        'Provide free resource download',
        'Nurture with educational content'
      ],
      best_contact_time: new Date('2024-12-21T09:00:00Z'),
      predicted_value: 3500
    },
    created_at: new Date('2024-12-20T16:20:00Z'),
    updated_at: new Date('2024-12-20T16:20:00Z')
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const platform = searchParams.get('platform');
    const minScore = searchParams.get('min_score');
    
    let filteredLeads = mockLeads;
    
    if (status) {
      filteredLeads = filteredLeads.filter(lead => lead.status === status);
    }
    
    if (platform) {
      filteredLeads = filteredLeads.filter(lead => lead.platform === platform);
    }
    
    if (minScore) {
      filteredLeads = filteredLeads.filter(lead => lead.score >= parseInt(minScore));
    }
    
    return NextResponse.json(filteredLeads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const leadData = await request.json();
    
    // Calculate initial lead score based on engagement data
    let score = 50; // Base score
    
    if (leadData.engagement?.email_opened) score += 10;
    if (leadData.engagement?.link_clicked) score += 15;
    if (leadData.engagement?.form_submitted) score += 20;
    if (leadData.company) score += 10;
    if (leadData.phone) score += 5;
    
    const newLead = {
      id: String(mockLeads.length + 1),
      score,
      status: 'new',
      stage: 'awareness',
      engagement: {
        email_opened: false,
        link_clicked: false,
        form_submitted: false,
        page_views: 0,
        time_on_site: 0,
        ...leadData.engagement
      },
      ai_insights: {
        conversion_probability: score / 100,
        recommended_actions: [
          'Send welcome email',
          'Provide relevant content',
          'Schedule follow-up'
        ],
        predicted_value: Math.round(score * 100)
      },
      created_at: new Date(),
      updated_at: new Date(),
      ...leadData
    };
    
    mockLeads.push(newLead);
    
    return NextResponse.json(newLead, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}