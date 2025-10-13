/**
 * Marketing Optimization Platform API - Leads - CONNECTED TO SUPABASE
 * Consolidates original PulseBridge.ai lead management functionality
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const status = searchParams.get('status');
    const platform = searchParams.get('platform');
    const minScore = searchParams.get('min_score');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build Supabase query
    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' });

    // Apply status filter
    if (status) {
      query = query.eq('status', status);
    }

    // Apply platform filter
    if (platform) {
      query = query.eq('platform', platform);
    }

    // Apply minimum score filter
    if (minScore) {
      query = query.gte('score', parseInt(minScore));
    }

    // Apply search filter (search in name, email, company)
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    // Execute query
    const { data: leads, error, count } = await query;

    if (error) {
      console.error('Error fetching leads:', error);
      return NextResponse.json(
        { error: 'Failed to fetch leads', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      leads: leads || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
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
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const body = await request.json();

    // Validate required fields
    if (!body.email) {
      return NextResponse.json(
        { error: 'Email is required' },
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

    // Calculate initial lead score based on engagement data
    let score = 50; // Base score

    if (body.engagement?.email_opened) score += 10;
    if (body.engagement?.link_clicked) score += 15;
    if (body.engagement?.form_submitted) score += 20;
    if (body.company) score += 10;
    if (body.phone) score += 5;

    // Prepare engagement data
    const engagement = {
      email_opened: false,
      link_clicked: false,
      form_submitted: false,
      page_views: 0,
      time_on_site: 0,
      last_activity: new Date().toISOString(),
      ...body.engagement
    };

    // Prepare AI insights
    const ai_insights = {
      conversion_probability: score / 100,
      recommended_actions: [
        'Send welcome email',
        'Provide relevant content',
        'Schedule follow-up'
      ],
      predicted_value: Math.round(score * 100),
      ...body.ai_insights
    };

    // Insert new lead
    const { data: lead, error } = await supabase
      .from('leads')
      .insert([{
        email: body.email,
        name: body.name || null,
        company: body.company || null,
        phone: body.phone || null,
        source: body.source || 'Direct',
        campaign_id: body.campaign_id || null,
        platform: body.platform || null,
        score,
        status: body.status || 'new',
        stage: body.stage || 'awareness',
        engagement,
        ai_insights,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating lead:', error);
      return NextResponse.json(
        { error: 'Failed to create lead', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      lead,
      message: 'Lead created successfully'
    }, { status: 201 });

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
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
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

    // Recalculate score if engagement changes
    if (updates.engagement) {
      let score = 50;
      if (updates.engagement.email_opened) score += 10;
      if (updates.engagement.link_clicked) score += 15;
      if (updates.engagement.form_submitted) score += 20;
      if (updates.company) score += 10;
      if (updates.phone) score += 5;
      updates.score = score;

      // Update AI insights
      if (!updates.ai_insights) {
        updates.ai_insights = {};
      }
      updates.ai_insights.conversion_probability = score / 100;
    }

    // Update lead
    const { data: lead, error } = await supabase
      .from('leads')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', user.id) // Ensure user owns the lead
      .select()
      .single();

    if (error) {
      console.error('Error updating lead:', error);
      return NextResponse.json(
        { error: 'Failed to update lead', details: error.message },
        { status: 500 }
      );
    }

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      lead,
      message: 'Lead updated successfully'
    });

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
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
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

    // Delete lead
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id); // Ensure user owns the lead

    if (error) {
      console.error('Error deleting lead:', error);
      return NextResponse.json(
        { error: 'Failed to delete lead', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Lead deleted successfully'
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
