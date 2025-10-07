import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Database Health Check Endpoint
 * Verifies Supabase connection and basic query functionality
 */
export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          error: 'Database configuration missing',
          service: 'Database Health Check'
        },
        { status: 503 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test basic connection with a simple query
    const startTime = Date.now();
    const { data, error } = await supabase
      .from('campaigns')
      .select('id')
      .limit(1);

    const responseTime = Date.now() - startTime;

    if (error) {
      console.error('Database health check error:', error);
      return NextResponse.json(
        {
          status: 'unhealthy',
          timestamp: new Date().toISOString(),
          error: 'Database query failed',
          details: error.message,
          service: 'Database Health Check'
        },
        { status: 503 }
      );
    }

    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'Database Health Check',
      database: {
        connected: true,
        responseTime: `${responseTime}ms`,
        status: responseTime < 100 ? 'excellent' : responseTime < 500 ? 'good' : 'slow'
      },
      supabase: {
        url: supabaseUrl.replace(/\/\/.*@/, '//***@'), // Hide credentials
        region: 'auto-detected',
        version: 'latest'
      }
    };

    return NextResponse.json(healthCheck, { status: 200 });
  } catch (error) {
    console.error('Database health check failed:', error);
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Database health check failed',
        service: 'Database Health Check'
      },
      { status: 503 }
    );
  }
}