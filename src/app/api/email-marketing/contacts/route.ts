/**
 * Email Marketing Contacts API - CONNECTED TO SUPABASE
 * Handles contact management, import, and segmentation
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const segment = searchParams.get('segment') || '';
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc');

    // Build Supabase query
    let query = supabase
      .from('email_subscribers')
      .select('*', { count: 'exact' });

    // Apply search filter (email, name, company)
    if (search) {
      query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%,company.ilike.%${search}%`);
    }

    // Apply status filter
    if (status) {
      query = query.eq('status', status);
    }

    // Apply segment filter
    if (segment) {
      query = query.contains('segments', [segment]);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    // Execute query
    const { data: contacts, error, count } = await query;

    if (error) {
      console.error('Error fetching contacts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch contacts', details: error.message },
        { status: 500 }
      );
    }

    // Get stats (separate query for performance)
    const { data: statsData } = await supabase
      .from('email_subscribers')
      .select('status');

    const stats = {
      total: count || 0,
      subscribed: statsData?.filter(c => c.status === 'subscribed').length || 0,
      unsubscribed: statsData?.filter(c => c.status === 'unsubscribed').length || 0,
      bounced: statsData?.filter(c => c.status === 'bounced').length || 0,
      complained: statsData?.filter(c => c.status === 'complained').length || 0
    };

    return NextResponse.json({
      contacts: contacts || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      },
      stats
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await request.json();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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
          const { data: existing } = await supabase
            .from('email_subscribers')
            .select('id')
            .eq('email', contactData.email)
            .eq('user_id', user.id)
            .single();

          if (existing) {
            errors.push({ contact: contactData, error: 'Email already exists' });
            continue;
          }

          // Insert contact
          const { data: newContact, error: insertError } = await supabase
            .from('email_subscribers')
            .insert([{
              email: contactData.email,
              first_name: contactData.firstName || null,
              last_name: contactData.lastName || null,
              company: contactData.company || null,
              tags: contactData.tags || [],
              segments: contactData.segments || [],
              status: contactData.status || 'subscribed',
              source: contactData.source || 'import',
              custom_fields: contactData.customFields || {},
              engagement_score: contactData.engagementScore || 50,
              last_engaged: contactData.lastEngaged || null,
              subscribed_at: new Date().toISOString(),
              user_id: user.id,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }])
            .select()
            .single();

          if (insertError) {
            errors.push({ contact: contactData, error: insertError.message });
            continue;
          }

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
    const { data: existing } = await supabase
      .from('email_subscribers')
      .select('id')
      .eq('email', contactData.email)
      .eq('user_id', user.id)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Contact with this email already exists' },
        { status: 409 }
      );
    }

    // Insert new contact
    const { data: newContact, error } = await supabase
      .from('email_subscribers')
      .insert([{
        email: contactData.email,
        first_name: contactData.firstName || null,
        last_name: contactData.lastName || null,
        company: contactData.company || null,
        tags: contactData.tags || [],
        segments: contactData.segments || [],
        status: contactData.status || 'subscribed',
        source: contactData.source || 'manual',
        custom_fields: contactData.customFields || {},
        engagement_score: contactData.engagementScore || 50,
        last_engaged: contactData.lastEngaged || null,
        subscribed_at: new Date().toISOString(),
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating contact:', error);
      return NextResponse.json(
        { error: 'Failed to create contact', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(newContact, { status: 201 });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Update contact
    const { data: contact, error } = await supabase
      .from('email_subscribers')
      .update({
        first_name: updates.firstName,
        last_name: updates.lastName,
        company: updates.company,
        tags: updates.tags,
        segments: updates.segments,
        status: updates.status,
        custom_fields: updates.customFields,
        engagement_score: updates.engagementScore,
        last_engaged: updates.lastEngaged,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating contact:', error);
      return NextResponse.json(
        { error: 'Failed to update contact', details: error.message },
        { status: 500 }
      );
    }

    if (!contact) {
      return NextResponse.json(
        { error: 'Contact not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json(contact);

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      );
    }

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Delete contact
    const { error } = await supabase
      .from('email_subscribers')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting contact:', error);
      return NextResponse.json(
        { error: 'Failed to delete contact', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Contact deleted successfully'
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
