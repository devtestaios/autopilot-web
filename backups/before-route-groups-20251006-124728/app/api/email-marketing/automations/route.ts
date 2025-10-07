import { NextResponse } from 'next/server';

// Mock automations data
const mockAutomations = [
  {
    id: '1',
    name: 'Welcome Series',
    type: 'welcome',
    trigger: 'signup',
    status: 'active',
    steps: [
      {
        id: '1',
        type: 'email',
        template_id: '1',
        delay_hours: 0,
        subject: 'Welcome to PulseBridge.ai!'
      },
      {
        id: '2',
        type: 'email',
        template_id: '2',
        delay_hours: 24,
        subject: 'Getting Started Guide'
      }
    ],
    created_at: new Date('2024-01-10').toISOString(),
    updated_at: new Date('2024-01-10').toISOString(),
    recipients_count: 1250,
    open_rate: 0.65,
    click_rate: 0.23
  },
  {
    id: '2',
    name: 'Abandoned Cart Recovery',
    type: 'behavioral',
    trigger: 'cart_abandonment',
    status: 'active',
    steps: [
      {
        id: '1',
        type: 'email',
        template_id: '3',
        delay_hours: 2,
        subject: 'You left something behind!'
      },
      {
        id: '2',
        type: 'email',
        template_id: '4',
        delay_hours: 24,
        subject: 'Complete your purchase - 10% off'
      }
    ],
    created_at: new Date('2024-01-15').toISOString(),
    updated_at: new Date('2024-01-20').toISOString(),
    recipients_count: 890,
    open_rate: 0.45,
    click_rate: 0.18
  },
  {
    id: '3',
    name: 'Monthly Newsletter',
    type: 'scheduled',
    trigger: 'schedule',
    status: 'active',
    schedule: 'monthly',
    steps: [
      {
        id: '1',
        type: 'email',
        template_id: '2',
        delay_hours: 0,
        subject: 'Your Monthly Marketing Insights'
      }
    ],
    created_at: new Date('2024-02-01').toISOString(),
    updated_at: new Date('2024-02-01').toISOString(),
    recipients_count: 3200,
    open_rate: 0.58,
    click_rate: 0.31
  }
];

export async function GET() {
  try {
    // Add small delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 150));
    
    return NextResponse.json(mockAutomations);
  } catch (error) {
    console.error('Error fetching email automations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email automations' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const automationData = await request.json();
    
    const newAutomation = {
      id: (mockAutomations.length + 1).toString(),
      ...automationData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      recipients_count: 0,
      open_rate: 0,
      click_rate: 0
    };
    
    mockAutomations.push(newAutomation);
    
    return NextResponse.json(newAutomation, { status: 201 });
  } catch (error) {
    console.error('Error creating email automation:', error);
    return NextResponse.json(
      { error: 'Failed to create email automation' },
      { status: 500 }
    );
  }
}