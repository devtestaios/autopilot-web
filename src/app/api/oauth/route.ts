/**
 * OAuth Initiation API
 * Generates OAuth authorization URLs for marketing platforms
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// =============================================================================
// OAUTH URL GENERATION
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { platform, redirectUrl } = body;

    if (!platform) {
      return NextResponse.json({ error: 'Platform is required' }, { status: 400 });
    }

    // Generate state parameter with user and platform info
    const state = encodeURIComponent(JSON.stringify({
      platform,
      userId: user.id,
      redirectUrl: redirectUrl || '/platforms',
      timestamp: Date.now()
    }));

    let authUrl: string;
    
    try {
      switch (platform) {
        case 'facebook':
          authUrl = generateFacebookOAuthUrl(state);
          break;
          
        case 'google-ads':
          authUrl = generateGoogleAdsOAuthUrl(state);
          break;
          
        case 'linkedin':
          authUrl = generateLinkedInOAuthUrl(state);
          break;
          
        case 'tiktok':
          authUrl = generateTikTokOAuthUrl(state);
          break;
          
        case 'twitter':
          authUrl = generateTwitterOAuthUrl(state);
          break;
          
        default:
          return NextResponse.json({ 
            error: `Platform '${platform}' is not supported yet` 
          }, { status: 400 });
      }
      
      return NextResponse.json({
        success: true,
        platform,
        authUrl,
        state
      });
      
    } catch (error) {
      console.error(`Error generating OAuth URL for ${platform}:`, error);
      return NextResponse.json({ 
        error: 'Failed to generate authorization URL' 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('OAuth initiation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// =============================================================================
// PLATFORM-SPECIFIC OAUTH URL GENERATORS
// =============================================================================

function generateFacebookOAuthUrl(state: string): string {
  const baseUrl = 'https://www.facebook.com/v18.0/dialog/oauth';
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/oauth/callback`,
    scope: 'ads_management,ads_read,business_management,pages_read_engagement,instagram_basic,instagram_content_publish',
    response_type: 'code',
    state: state
  });
  
  return `${baseUrl}?${params}`;
}

function generateGoogleAdsOAuthUrl(state: string): string {
  const baseUrl = 'https://accounts.google.com/oauth/authorize';
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/oauth/callback`,
    scope: 'https://www.googleapis.com/auth/adwords',
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
    state: state
  });
  
  return `${baseUrl}?${params}`;
}

function generateLinkedInOAuthUrl(state: string): string {
  const baseUrl = 'https://www.linkedin.com/oauth/v2/authorization';
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/oauth/callback`,
    scope: 'r_liteprofile r_emailaddress r_ads r_ads_reporting',
    state: state
  });
  
  return `${baseUrl}?${params}`;
}

function generateTikTokOAuthUrl(state: string): string {
  const baseUrl = 'https://business-api.tiktok.com/portal/auth';
  const params = new URLSearchParams({
    app_id: process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY!,
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/oauth/callback`,
    scope: 'business_info,ad_account_info,campaign_info,adgroup_info,ad_info,page_info,user_info',
    state: state
  });
  
  return `${baseUrl}?${params}`;
}

function generateTwitterOAuthUrl(state: string): string {
  const baseUrl = 'https://twitter.com/i/oauth2/authorize';
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/oauth/callback`,
    scope: 'tweet.read users.read offline.access',
    state: state,
    code_challenge: 'challenge',
    code_challenge_method: 'plain'
  });
  
  return `${baseUrl}?${params}`;
}

// =============================================================================
// GET: Platform Configuration Info
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const platform = searchParams.get('platform');
    
    if (!platform) {
      // Return all supported platforms
      return NextResponse.json({
        success: true,
        platforms: [
          {
            id: 'facebook',
            name: 'Facebook Ads',
            description: 'Connect your Facebook and Instagram advertising accounts',
            icon: 'facebook',
            color: '#1877F2',
            scopes: ['ads_management', 'ads_read', 'business_management', 'pages_read_engagement'],
            isEnabled: !!process.env.NEXT_PUBLIC_FACEBOOK_APP_ID
          },
          {
            id: 'google-ads',
            name: 'Google Ads',
            description: 'Connect your Google Ads campaigns and keywords',
            icon: 'google',
            color: '#4285F4',
            scopes: ['adwords'],
            isEnabled: !!process.env.GOOGLE_ADS_CLIENT_ID
          },
          {
            id: 'linkedin',
            name: 'LinkedIn Ads',
            description: 'Connect your LinkedIn Campaign Manager',
            icon: 'linkedin',
            color: '#0A66C2',
            scopes: ['r_ads', 'r_ads_reporting'],
            isEnabled: !!process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID
          },
          {
            id: 'tiktok',
            name: 'TikTok Business',
            description: 'Connect your TikTok advertising account',
            icon: 'tiktok',
            color: '#000000',
            scopes: ['business_info', 'ad_account_info', 'campaign_info'],
            isEnabled: !!process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY
          },
          {
            id: 'twitter',
            name: 'Twitter Ads',
            description: 'Connect your Twitter advertising account',
            icon: 'twitter',
            color: '#1DA1F2',
            scopes: ['tweet.read', 'users.read'],
            isEnabled: !!process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID
          }
        ]
      });
    }
    
    // Return specific platform info
    const platformConfigs: Record<string, any> = {
      facebook: {
        id: 'facebook',
        name: 'Facebook Ads',
        description: 'Connect your Facebook and Instagram advertising accounts',
        icon: 'facebook',
        color: '#1877F2',
        scopes: ['ads_management', 'ads_read', 'business_management', 'pages_read_engagement'],
        isEnabled: !!process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        requiredPermissions: [
          'Manage ad campaigns',
          'Read campaign performance',
          'Access business accounts',
          'Read page engagement data'
        ]
      },
      'google-ads': {
        id: 'google-ads',
        name: 'Google Ads',
        description: 'Connect your Google Ads campaigns and keywords',
        icon: 'google',
        color: '#4285F4',
        scopes: ['adwords'],
        isEnabled: !!process.env.GOOGLE_ADS_CLIENT_ID,
        requiredPermissions: [
          'View and manage Google Ads campaigns',
          'Access campaign performance data',
          'Read keyword information'
        ]
      },
      linkedin: {
        id: 'linkedin',
        name: 'LinkedIn Ads',
        description: 'Connect your LinkedIn Campaign Manager',
        icon: 'linkedin', 
        color: '#0A66C2',
        scopes: ['r_ads', 'r_ads_reporting'],
        isEnabled: !!process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID,
        requiredPermissions: [
          'Access LinkedIn advertising data',
          'Read campaign performance reports',
          'View advertising account information'
        ]
      }
    };
    
    const config = platformConfigs[platform];
    if (!config) {
      return NextResponse.json({ error: 'Platform not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      platform: config
    });
    
  } catch (error) {
    console.error('OAuth config error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}