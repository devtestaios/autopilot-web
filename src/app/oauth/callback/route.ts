/**
 * OAuth Callback Handler
 * Handles OAuth authorization callbacks from marketing platforms
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// =============================================================================
// OAUTH CALLBACK HANDLER
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);
    
    // Extract OAuth parameters
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    // Parse state parameter to get platform and user info
    let stateData: any = {};
    try {
      stateData = state ? JSON.parse(decodeURIComponent(state)) : {};
    } catch (e) {
      console.error('Error parsing state parameter:', e);
    }
    
    const { platform, userId, redirectUrl } = stateData;
    
    // Handle OAuth error
    if (error) {
      console.error(`OAuth error for ${platform}:`, error, errorDescription);
      const errorUrl = new URL(redirectUrl || '/platforms', request.url);
      errorUrl.searchParams.set('error', error);
      errorUrl.searchParams.set('platform', platform);
      return NextResponse.redirect(errorUrl);
    }
    
    // Handle missing authorization code
    if (!code) {
      const errorUrl = new URL(redirectUrl || '/platforms', request.url);
      errorUrl.searchParams.set('error', 'missing_code');
      errorUrl.searchParams.set('platform', platform);
      return NextResponse.redirect(errorUrl);
    }
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      const errorUrl = new URL('/auth/login', request.url);
      errorUrl.searchParams.set('redirect', `/oauth/callback?code=${code}&state=${state}`);
      return NextResponse.redirect(errorUrl);
    }
    
    // Verify user matches the one in state
    if (userId && user.id !== userId) {
      const errorUrl = new URL(redirectUrl || '/platforms', request.url);
      errorUrl.searchParams.set('error', 'user_mismatch');
      return NextResponse.redirect(errorUrl);
    }
    
    // Exchange authorization code for access token
    let tokenData: any = {};
    let platformAccountInfo: any = {};
    
    try {
      switch (platform) {
        case 'facebook':
          tokenData = await exchangeFacebookCode(code);
          platformAccountInfo = await getFacebookAccountInfo(tokenData.access_token);
          break;
          
        case 'google-ads':
          tokenData = await exchangeGoogleAdsCode(code);
          platformAccountInfo = await getGoogleAdsAccountInfo(tokenData);
          break;
          
        case 'linkedin':
          tokenData = await exchangeLinkedInCode(code);
          platformAccountInfo = await getLinkedInAccountInfo(tokenData.access_token);
          break;
          
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }
    } catch (tokenError) {
      console.error(`Token exchange error for ${platform}:`, tokenError);
      const errorUrl = new URL(redirectUrl || '/platforms', request.url);
      errorUrl.searchParams.set('error', 'token_exchange_failed');
      errorUrl.searchParams.set('platform', platform);
      return NextResponse.redirect(errorUrl);
    }
    
    // Store platform connection in database
    try {
      const { data: connection, error: dbError } = await supabase
        .from('platform_connections')
        .upsert({
          user_id: user.id,
          platform_type: platform,
          platform_name: getPlatformDisplayName(platform),
          account_id: platformAccountInfo.id,
          account_name: platformAccountInfo.name,
          is_active: true,
          credentials: {
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token,
            expires_at: tokenData.expires_in ? 
              new Date(Date.now() + tokenData.expires_in * 1000).toISOString() : null,
            scope: tokenData.scope,
            ...platformAccountInfo
          },
          sync_status: 'success',
          last_sync: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,platform_type,account_id'
        })
        .select()
        .single();
        
      if (dbError) {
        throw dbError;
      }
      
      // Redirect to success page
      const successUrl = new URL(redirectUrl || '/platforms', request.url);
      successUrl.searchParams.set('success', 'true');
      successUrl.searchParams.set('platform', platform);
      successUrl.searchParams.set('account', platformAccountInfo.name);
      
      return NextResponse.redirect(successUrl);
      
    } catch (dbError) {
      console.error('Database error:', dbError);
      const errorUrl = new URL(redirectUrl || '/platforms', request.url);
      errorUrl.searchParams.set('error', 'database_error');
      errorUrl.searchParams.set('platform', platform);
      return NextResponse.redirect(errorUrl);
    }
    
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(new URL('/platforms?error=callback_error', request.url));
  }
}

// =============================================================================
// PLATFORM-SPECIFIC TOKEN EXCHANGE FUNCTIONS
// =============================================================================

async function exchangeFacebookCode(code: string) {
  const response = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
      client_secret: process.env.FACEBOOK_APP_SECRET!,
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/oauth/callback`,
      code: code
    })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Facebook token exchange failed: ${error}`);
  }
  
  return response.json();
}

async function getFacebookAccountInfo(accessToken: string) {
  const response = await fetch(`https://graph.facebook.com/v18.0/me?fields=id,name,email&access_token=${accessToken}`);
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Facebook account info failed: ${error}`);
  }
  
  return response.json();
}

async function exchangeGoogleAdsCode(code: string) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/oauth/callback`,
      grant_type: 'authorization_code',
      code: code
    })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google Ads token exchange failed: ${error}`);
  }
  
  return response.json();
}

async function getGoogleAdsAccountInfo(tokenData: any) {
  // For Google Ads, we'll use the customer ID from environment variables
  // In a real implementation, you'd call the Google Ads API to get account info
  return {
    id: process.env.GOOGLE_ADS_CUSTOMER_ID || 'google_account',
    name: 'Google Ads Account'
  };
}

async function exchangeLinkedInCode(code: string) {
  const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID!,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/oauth/callback`,
      code: code
    })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`LinkedIn token exchange failed: ${error}`);
  }
  
  return response.json();
}

async function getLinkedInAccountInfo(accessToken: string) {
  const response = await fetch('https://api.linkedin.com/v2/people/~?projection=(id,firstName,lastName,emailAddress)', {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`LinkedIn account info failed: ${error}`);
  }
  
  const data = await response.json();
  return {
    id: data.id,
    name: `${data.firstName?.localized?.en_US || ''} ${data.lastName?.localized?.en_US || ''}`.trim()
  };
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function getPlatformDisplayName(platform: string): string {
  const displayNames: Record<string, string> = {
    facebook: 'Facebook Ads',
    'google-ads': 'Google Ads',
    linkedin: 'LinkedIn Ads',
    tiktok: 'TikTok Business',
    twitter: 'Twitter Ads',
    instagram: 'Instagram Business'
  };
  
  return displayNames[platform] || platform;
}