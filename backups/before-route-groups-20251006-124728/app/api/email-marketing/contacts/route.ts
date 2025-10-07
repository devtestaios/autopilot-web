/**
 * Email Marketing Contacts API
 * Handles contact management, import, and segmentation
 */

import { NextRequest, NextResponse } from 'next/server';

// Mock data for development
const mockContacts = [
  {
    id: 'contact-1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    company: 'Acme Corp',
    tags: ['customer', 'premium'],
    segments: ['vip-customers', 'tech-industry'],
    status: 'subscribed',
    source: 'import',
    customFields: {
      job_title: 'Marketing Director',
      industry: 'Technology',
      company_size: '50-200'
    },
    engagementScore: 85,
    lastEngaged: new Date('2024-01-15'),
    subscribeDate: new Date('2023-06-15'),
    unsubscribeDate: null
  },
  {
    id: 'contact-2',
    email: 'jane.smith@startup.com',
    firstName: 'Jane',
    lastName: 'Smith',
    company: 'StartupCo',
    tags: ['lead', 'interested'],
    segments: ['startup-founders', 'early-adopters'],
    status: 'subscribed',
    source: 'form',
    customFields: {
      job_title: 'CEO',
      industry: 'SaaS',
      company_size: '1-10'
    },
    engagementScore: 92,
    lastEngaged: new Date('2024-01-20'),
    subscribeDate: new Date('2023-11-08'),
    unsubscribeDate: null
  },
  {
    id: 'contact-3',
    email: 'mike.wilson@enterprise.com',
    firstName: 'Mike',
    lastName: 'Wilson',
    company: 'Enterprise Ltd',
    tags: ['prospect', 'enterprise'],
    segments: ['enterprise-prospects', 'high-value'],
    status: 'subscribed',
    source: 'api',
    customFields: {
      job_title: 'VP of Marketing',
      industry: 'Finance',
      company_size: '1000+'
    },
    engagementScore: 67,
    lastEngaged: new Date('2024-01-10'),
    subscribeDate: new Date('2023-09-22'),
    unsubscribeDate: null
  },
  {
    id: 'contact-4',
    email: 'sarah.brown@agency.com',
    firstName: 'Sarah',
    lastName: 'Brown',
    company: 'Creative Agency',
    tags: ['customer', 'agency'],
    segments: ['agency-partners', 'creative-industry'],
    status: 'unsubscribed',
    source: 'manual',
    customFields: {
      job_title: 'Account Manager',
      industry: 'Marketing',
      company_size: '20-50'
    },
    engagementScore: 45,
    lastEngaged: new Date('2023-12-05'),
    subscribeDate: new Date('2023-04-12'),
    unsubscribeDate: new Date('2023-12-20')
  },
  {
    id: 'contact-5',
    email: 'david.lee@consulting.com',
    firstName: 'David',
    lastName: 'Lee',
    company: 'Consulting Group',
    tags: ['lead', 'consultant'],
    segments: ['consultants', 'b2b-services'],
    status: 'bounced',
    source: 'import',
    customFields: {
      job_title: 'Senior Consultant',
      industry: 'Consulting',
      company_size: '200-500'
    },
    engagementScore: 23,
    lastEngaged: new Date('2023-11-15'),
    subscribeDate: new Date('2023-08-03'),
    unsubscribeDate: null
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const segment = searchParams.get('segment') || '';
    
    let filteredContacts = [...mockContacts];
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredContacts = filteredContacts.filter(contact => 
        contact.email.toLowerCase().includes(searchLower) ||
        contact.firstName?.toLowerCase().includes(searchLower) ||
        contact.lastName?.toLowerCase().includes(searchLower) ||
        contact.company?.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply status filter
    if (status) {
      filteredContacts = filteredContacts.filter(contact => contact.status === status);
    }
    
    // Apply segment filter
    if (segment) {
      filteredContacts = filteredContacts.filter(contact => 
        contact.segments.includes(segment)
      );
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedContacts = filteredContacts.slice(startIndex, endIndex);
    
    return NextResponse.json({
      contacts: paginatedContacts,
      pagination: {
        page,
        limit,
        total: filteredContacts.length,
        totalPages: Math.ceil(filteredContacts.length / limit)
      },
      stats: {
        total: mockContacts.length,
        subscribed: mockContacts.filter(c => c.status === 'subscribed').length,
        unsubscribed: mockContacts.filter(c => c.status === 'unsubscribed').length,
        bounced: mockContacts.filter(c => c.status === 'bounced').length,
        complained: mockContacts.filter(c => c.status === 'complained').length
      }
    });
    
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle bulk contact creation/import
    if (body.contacts && Array.isArray(body.contacts)) {
      const imported = [];
      const errors = [];
      
      for (const contactData of body.contacts) {
        try {
          // Validate required fields
          if (!contactData.email) {
            errors.push({ contact: contactData, error: 'Email is required' });
            continue;
          }
          
          // Check for duplicates
          const existingContact = mockContacts.find(c => c.email === contactData.email);
          if (existingContact) {
            errors.push({ contact: contactData, error: 'Email already exists' });
            continue;
          }
          
          // Create new contact
          const newContact = {
            id: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            email: contactData.email,
            firstName: contactData.firstName || '',
            lastName: contactData.lastName || '',
            company: contactData.company || '',
            tags: contactData.tags || [],
            segments: contactData.segments || [],
            status: contactData.status || 'subscribed',
            source: contactData.source || 'import',
            customFields: contactData.customFields || {},
            engagementScore: contactData.engagementScore || 50,
            lastEngaged: contactData.lastEngaged ? new Date(contactData.lastEngaged) : null,
            subscribeDate: new Date(),
            unsubscribeDate: null
          };
          
          // Add to mock data (in real app, this would be database)
          mockContacts.push(newContact);
          imported.push(newContact);
          
        } catch (contactError) {
          errors.push({ contact: contactData, error: 'Invalid contact data' });
        }
      }
      
      return NextResponse.json({
        imported,
        errors,
        summary: {
          total: body.contacts.length,
          imported: imported.length,
          failed: errors.length
        }
      });
    }
    
    // Handle single contact creation
    const contactData = body;
    
    // Validate required fields
    if (!contactData.email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Check for duplicates
    const existingContact = mockContacts.find(c => c.email === contactData.email);
    if (existingContact) {
      return NextResponse.json(
        { error: 'Contact with this email already exists' },
        { status: 409 }
      );
    }
    
    // Create new contact
    const newContact = {
      id: `contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email: contactData.email,
      firstName: contactData.firstName || '',
      lastName: contactData.lastName || '',
      company: contactData.company || '',
      tags: contactData.tags || [],
      segments: contactData.segments || [],
      status: contactData.status || 'subscribed',
      source: contactData.source || 'manual',
      customFields: contactData.customFields || {},
      engagementScore: contactData.engagementScore || 50,
      lastEngaged: contactData.lastEngaged ? new Date(contactData.lastEngaged) : null,
      subscribeDate: new Date(),
      unsubscribeDate: null
    };
    
    // Add to mock data (in real app, this would be database)
    mockContacts.push(newContact);
    
    return NextResponse.json(newContact, { status: 201 });
    
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Failed to create contact' },
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
        { error: 'Contact ID is required' },
        { status: 400 }
      );
    }
    
    const contactIndex = mockContacts.findIndex(c => c.id === id);
    if (contactIndex === -1) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }
    
    // Update contact
    const updatedContact = {
      ...mockContacts[contactIndex],
      ...updates,
      id // Ensure ID cannot be changed
    };
    
    mockContacts[contactIndex] = updatedContact;
    
    return NextResponse.json(updatedContact);
    
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { error: 'Failed to update contact' },
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
        { error: 'Contact ID is required' },
        { status: 400 }
      );
    }
    
    const contactIndex = mockContacts.findIndex(c => c.id === id);
    if (contactIndex === -1) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      );
    }
    
    // Remove contact
    const deletedContact = mockContacts.splice(contactIndex, 1)[0];
    
    return NextResponse.json({
      success: true,
      deletedContact
    });
    
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    );
  }
}