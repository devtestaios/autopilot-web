import { NextResponse } from 'next/server';

// Mock templates data
const mockTemplates = [
  {
    id: '1',
    name: 'Welcome Email',
    type: 'welcome',
    subject: 'Welcome to PulseBridge.ai!',
    content: '<p>Welcome to our platform! We\'re excited to have you on board.</p>',
    created_at: new Date('2024-01-15').toISOString(),
    updated_at: new Date('2024-01-15').toISOString(),
    is_active: true,
    category: 'onboarding'
  },
  {
    id: '2',
    name: 'Newsletter Template',
    type: 'newsletter',
    subject: 'Your Weekly Marketing Insights',
    content: '<p>Here are the latest marketing trends and insights...</p>',
    created_at: new Date('2024-01-20').toISOString(),
    updated_at: new Date('2024-01-20').toISOString(),
    is_active: true,
    category: 'newsletter'
  },
  {
    id: '3',
    name: 'Product Launch',
    type: 'promotional',
    subject: 'Introducing Our New AI Features!',
    content: '<p>We\'re excited to announce new AI-powered features...</p>',
    created_at: new Date('2024-02-01').toISOString(),
    updated_at: new Date('2024-02-01').toISOString(),
    is_active: true,
    category: 'promotional'
  }
];

export async function GET() {
  try {
    // Add small delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return NextResponse.json(mockTemplates);
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const templateData = await request.json();
    
    const newTemplate = {
      id: (mockTemplates.length + 1).toString(),
      ...templateData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_active: true
    };
    
    mockTemplates.push(newTemplate);
    
    return NextResponse.json(newTemplate, { status: 201 });
  } catch (error) {
    console.error('Error creating email template:', error);
    return NextResponse.json(
      { error: 'Failed to create email template' },
      { status: 500 }
    );
  }
}