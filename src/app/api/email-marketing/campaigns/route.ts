/**
 * Email Marketing Campaigns API
 * Handles campaign CRUD operations and management
 */

import { NextRequest, NextResponse } from 'next/server';

// Mock campaign data
const mockCampaigns = [
  {
    id: 'campaign-1',
    name: 'Welcome Series - January 2024',
    subject: 'Welcome to PulseBridge! Let\'s get started 🚀',
    templateId: 'template-1',
    htmlContent: '<h1>Welcome!</h1><p>Thanks for joining us...</p>',
    textContent: 'Welcome! Thanks for joining us...',
    preheader: 'Your journey to better marketing starts here',
    fromName: 'PulseBridge Team',
    fromEmail: 'hello@pulsebridge.ai',
    replyTo: 'support@pulsebridge.ai',
    segments: ['new-subscribers'],
    tags: ['welcome', 'onboarding'],
    excludeSegments: [],
    scheduledDate: null,
    sentDate: new Date('2024-01-15T10:00:00Z'),
    timezone: 'America/New_York',
    status: 'sent',
    stats: {
      totalSent: 1547,
      delivered: 1523,
      bounced: 24,
      opened: 634,
      clicked: 187,
      unsubscribed: 8,
      complained: 2,
      openRate: 41.6,
      clickRate: 12.1,
      unsubscribeRate: 0.5,
      bounceRate: 1.6
    },
    abTest: null,
    createdAt: new Date('2024-01-10T14:30:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z')
  },
  {
    id: 'campaign-2',
    name: 'Product Update - New Features',
    subject: 'New AI Features Are Here! 🤖',
    templateId: 'template-2',
    htmlContent: '<h1>Exciting Updates!</h1><p>Check out our new AI features...</p>',
    textContent: 'Exciting Updates! Check out our new AI features...',
    preheader: 'Discover powerful new automation capabilities',
    fromName: 'Product Team',
    fromEmail: 'product@pulsebridge.ai',
    replyTo: 'feedback@pulsebridge.ai',
    segments: ['active-users', 'premium-customers'],
    tags: ['product-update', 'features'],
    excludeSegments: ['churned-users'],
    scheduledDate: new Date('2024-01-25T14:00:00Z'),
    sentDate: null,
    timezone: 'America/New_York',
    status: 'scheduled',
    stats: {
      totalSent: 0,
      delivered: 0,
      bounced: 0,
      opened: 0,
      clicked: 0,
      unsubscribed: 0,
      complained: 0,
      openRate: 0,
      clickRate: 0,
      unsubscribeRate: 0,
      bounceRate: 0
    },
    abTest: {
      isEnabled: true,
      testType: 'subject',
      variants: [
        {
          id: 'variant-a',
          name: 'Current Subject',
          percentage: 50,
          subject: 'New AI Features Are Here! 🤖'
        },
        {
          id: 'variant-b',
          name: 'Alternative Subject',
          percentage: 50,
          subject: 'Transform Your Marketing with AI ⚡'
        }
      ],
      winnerCriteria: 'open_rate',
      testDuration: 4,
      winnerVariant: null
    },
    createdAt: new Date('2024-01-20T09:15:00Z'),
    updatedAt: new Date('2024-01-22T16:45:00Z')
  },
  {
    id: 'campaign-3',
    name: 'Monthly Newsletter - January',
    subject: 'January Insights: Marketing Trends & Tips',
    templateId: 'template-3',
    htmlContent: '<h1>Monthly Newsletter</h1><p>This month\'s marketing insights...</p>',
    textContent: 'Monthly Newsletter - This month\'s marketing insights...',
    preheader: 'Stay ahead with the latest marketing strategies',
    fromName: 'Content Team',
    fromEmail: 'newsletter@pulsebridge.ai',
    replyTo: 'content@pulsebridge.ai',
    segments: ['newsletter-subscribers', 'engaged-users'],
    tags: ['newsletter', 'content'],
    excludeSegments: [],
    scheduledDate: null,
    sentDate: null,
    timezone: 'America/New_York',
    status: 'draft',
    stats: {
      totalSent: 0,
      delivered: 0,
      bounced: 0,
      opened: 0,
      clicked: 0,
      unsubscribed: 0,
      complained: 0,
      openRate: 0,
      clickRate: 0,
      unsubscribeRate: 0,
      bounceRate: 0
    },
    abTest: null,
    createdAt: new Date('2024-01-18T11:20:00Z'),
    updatedAt: new Date('2024-01-23T15:10:00Z')
  },
  {
    id: 'campaign-4',
    name: 'Re-engagement Campaign',
    subject: 'We miss you! Come back for exclusive offers 💝',
    templateId: 'template-4',
    htmlContent: '<h1>We Miss You!</h1><p>Special offer just for you...</p>',
    textContent: 'We Miss You! Special offer just for you...',
    preheader: 'Exclusive 30% discount for inactive subscribers',
    fromName: 'Marketing Team',
    fromEmail: 'offers@pulsebridge.ai',
    replyTo: 'hello@pulsebridge.ai',
    segments: ['inactive-users'],
    tags: ['re-engagement', 'offer'],
    excludeSegments: ['active-users'],
    scheduledDate: null,
    sentDate: new Date('2024-01-12T13:30:00Z'),
    timezone: 'America/New_York',
    status: 'sent',
    stats: {
      totalSent: 892,
      delivered: 856,
      bounced: 36,
      opened: 198,
      clicked: 47,
      unsubscribed: 15,
      complained: 3,
      openRate: 23.1,
      clickRate: 5.5,
      unsubscribeRate: 1.7,
      bounceRate: 4.0
    },
    abTest: null,
    createdAt: new Date('2024-01-08T08:45:00Z'),
    updatedAt: new Date('2024-01-12T13:30:00Z')
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    let filteredCampaigns = [...mockCampaigns];
    
    // Apply status filter
    if (status) {
      filteredCampaigns = filteredCampaigns.filter(campaign => campaign.status === status);
    }
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredCampaigns = filteredCampaigns.filter(campaign => 
        campaign.name.toLowerCase().includes(searchLower) ||
        campaign.subject.toLowerCase().includes(searchLower) ||
        campaign.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply sorting
    filteredCampaigns.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'name':
          aVal = a.name;
          bVal = b.name;
          break;
        case 'sentDate':
          aVal = a.sentDate || new Date(0);
          bVal = b.sentDate || new Date(0);
          break;
        case 'openRate':
          aVal = a.stats.openRate;
          bVal = b.stats.openRate;
          break;
        case 'status':
          aVal = a.status;
          bVal = b.status;
          break;
        default:
          aVal = a.createdAt;
          bVal = b.createdAt;
      }
      
      if (sortOrder === 'desc') {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      } else {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      }
    });
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCampaigns = filteredCampaigns.slice(startIndex, endIndex);
    
    // Calculate summary stats
    const stats = {
      total: mockCampaigns.length,
      draft: mockCampaigns.filter(c => c.status === 'draft').length,
      scheduled: mockCampaigns.filter(c => c.status === 'scheduled').length,
      sending: mockCampaigns.filter(c => c.status === 'sending').length,
      sent: mockCampaigns.filter(c => c.status === 'sent').length,
      paused: mockCampaigns.filter(c => c.status === 'paused').length,
      cancelled: mockCampaigns.filter(c => c.status === 'cancelled').length,
      totalSent: mockCampaigns.reduce((sum, c) => sum + c.stats.totalSent, 0),
      avgOpenRate: mockCampaigns.length > 0 
        ? (mockCampaigns.reduce((sum, c) => sum + c.stats.openRate, 0) / mockCampaigns.length).toFixed(1)
        : 0,
      avgClickRate: mockCampaigns.length > 0 
        ? (mockCampaigns.reduce((sum, c) => sum + c.stats.clickRate, 0) / mockCampaigns.length).toFixed(1)
        : 0
    };
    
    return NextResponse.json({
      campaigns: paginatedCampaigns,
      pagination: {
        page,
        limit,
        total: filteredCampaigns.length,
        totalPages: Math.ceil(filteredCampaigns.length / limit)
      },
      stats
    });
    
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
    
    // Validate required fields
    const requiredFields = ['name', 'subject', 'htmlContent', 'fromName', 'fromEmail'];
    const missingFields = requiredFields.filter(field => !campaignData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Create new campaign
    const newCampaign = {
      id: `campaign-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: campaignData.name,
      subject: campaignData.subject,
      templateId: campaignData.templateId || null,
      htmlContent: campaignData.htmlContent,
      textContent: campaignData.textContent || stripHtml(campaignData.htmlContent),
      preheader: campaignData.preheader || '',
      fromName: campaignData.fromName,
      fromEmail: campaignData.fromEmail,
      replyTo: campaignData.replyTo || campaignData.fromEmail,
      segments: campaignData.segments || [],
      tags: campaignData.tags || [],
      excludeSegments: campaignData.excludeSegments || [],
      scheduledDate: campaignData.scheduledDate ? new Date(campaignData.scheduledDate) : null,
      sentDate: null,
      timezone: campaignData.timezone || 'America/New_York',
      status: campaignData.status || 'draft',
      stats: {
        totalSent: 0,
        delivered: 0,
        bounced: 0,
        opened: 0,
        clicked: 0,
        unsubscribed: 0,
        complained: 0,
        openRate: 0,
        clickRate: 0,
        unsubscribeRate: 0,
        bounceRate: 0
      },
      abTest: campaignData.abTest || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add to mock data (in real app, this would be database)
    mockCampaigns.unshift(newCampaign);
    
    return NextResponse.json(newCampaign, { status: 201 });
    
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }
    
    const campaignIndex = mockCampaigns.findIndex(c => c.id === id);
    if (campaignIndex === -1) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    // Update campaign
    const updatedCampaign = {
      ...mockCampaigns[campaignIndex],
      ...updates,
      id, // Ensure ID cannot be changed
      updatedAt: new Date()
    };
    
    mockCampaigns[campaignIndex] = updatedCampaign;
    
    return NextResponse.json(updatedCampaign);
    
  } catch (error) {
    console.error('Error updating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to update campaign' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }
    
    const campaignIndex = mockCampaigns.findIndex(c => c.id === id);
    if (campaignIndex === -1) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    // Check if campaign can be deleted
    const campaign = mockCampaigns[campaignIndex];
    if (['sending', 'sent'].includes(campaign.status)) {
      return NextResponse.json(
        { error: 'Cannot delete sent or sending campaigns' },
        { status: 400 }
      );
    }
    
    // Remove campaign
    const deletedCampaign = mockCampaigns.splice(campaignIndex, 1)[0];
    
    return NextResponse.json({
      success: true,
      deletedCampaign
    });
    
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return NextResponse.json(
      { error: 'Failed to delete campaign' },
      { status: 500 }
    );
  }
}

// Helper function to strip HTML tags for text content
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}