import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Server-side environment check
    const serverEnv = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET',
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      NODE_ENV: process.env.NODE_ENV,
      // Server-side only variables
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT_SET',
      // Count all environment variables
      totalEnvVars: Object.keys(process.env).length,
      nextPublicVars: Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_')),
    };

    console.log('🔍 Server-side Environment Check:', serverEnv);

    return NextResponse.json({
      success: true,
      environment: serverEnv,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Environment check error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}