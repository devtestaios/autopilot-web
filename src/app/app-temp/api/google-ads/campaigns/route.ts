import { NextRequest, NextResponse } from 'next/server';
import { GoogleAdsApi, enums } from 'google-ads-api';

// Google Ads API client initialization
function getGoogleAdsClient() {
  return new GoogleAdsApi({
    client_id: process.env.GOOGLE_ADS_CLIENT_ID!,
    client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!,
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
  });
}

export async function GET(request: NextRequest) {
  try {
    // Check if Google Ads credentials are configured
    const requiredEnvVars = [
      'GOOGLE_ADS_DEVELOPER_TOKEN',
      'GOOGLE_ADS_CLIENT_ID',
      'GOOGLE_ADS_CLIENT_SECRET',
      'GOOGLE_ADS_REFRESH_TOKEN',
      'GOOGLE_ADS_CUSTOMER_ID'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      return NextResponse.json({
        error: 'Google Ads API not fully configured',
        missing: missingVars,
        status: 'configuration_incomplete'
      }, { status: 503 });
    }

    // Initialize Google Ads client and customer
    const client = getGoogleAdsClient();
    const customer = client.Customer({
      customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID!,
      refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
    });

    try {
      // Fetch real campaigns from Google Ads
      const campaigns = await customer.query(`
        SELECT 
          campaign.id,
          campaign.name,
          campaign.status,
          campaign.advertising_channel_type,
          campaign_budget.amount_micros,
          metrics.impressions,
          metrics.clicks,
          metrics.cost_micros,
          metrics.conversions
        FROM campaign 
        WHERE campaign.status != 'REMOVED'
        ORDER BY campaign.name
        LIMIT 50
      `);

      const formattedCampaigns = campaigns.map((row: any) => ({
        id: row.campaign.id,
        name: row.campaign.name,
        status: row.campaign.status,
        type: row.campaign.advertising_channel_type,
        budget: {
          amount: row.campaign_budget?.amount_micros ? (row.campaign_budget.amount_micros / 1000000) : 0,
          currency: 'USD'
        },
        performance: {
          impressions: row.metrics?.impressions || 0,
          clicks: row.metrics?.clicks || 0,
          cost: row.metrics?.cost_micros ? (row.metrics.cost_micros / 1000000) : 0,
          conversions: row.metrics?.conversions || 0
        }
      }));

      return NextResponse.json({
        campaigns: formattedCampaigns,
        total: formattedCampaigns.length,
        status: 'active',
        platform: 'google_ads',
        message: 'Successfully connected to Google Ads API'
      });

    } catch (apiError: any) {
      console.error('Google Ads API query error:', apiError);
      
      // Return helpful error information
      return NextResponse.json({
        error: 'Google Ads API query failed',
        details: apiError.message || 'Unknown API error',
        status: 'api_error',
        suggestions: [
          'Verify your customer ID is correct',
          'Check that your refresh token is valid',
          'Ensure your developer token is approved',
          'Confirm API access permissions'
        ]
      }, { status: 502 });
    }

  } catch (error: any) {
    console.error('Google Ads integration error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to connect to Google Ads API',
        details: error.message,
        status: 'connection_error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, campaignData } = await request.json();

    // Initialize Google Ads client and customer
    const client = getGoogleAdsClient();
    const customer = client.Customer({
      customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID!,
      refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
    });

    switch (action) {
      case 'create':
        try {
          // Create campaign using the campaigns service
          const campaignOperation = {
            name: campaignData.name,
            advertising_channel_type: campaignData.type || enums.AdvertisingChannelType.SEARCH,
            status: enums.CampaignStatus.PAUSED, // Start paused for review
            network_settings: {
              target_google_search: true,
              target_search_network: campaignData.targetSearchNetwork || false,
              target_content_network: campaignData.targetContentNetwork || false,
            }
          };
          
          const result = await customer.campaigns.create(campaignOperation);
          return NextResponse.json({ 
            success: true, 
            campaignId: result.resource_name,
            action,
            platform: 'google_ads'
          });

        } catch (createError: any) {
          return NextResponse.json({
            error: 'Failed to create campaign',
            details: createError.message,
            action,
            suggestion: 'Campaign creation requires a valid budget. Create a budget first.'
          }, { status: 400 });
        }

      case 'update':
        try {
          // Update existing campaign
          const updateOperation = {
            resource_name: `customers/${process.env.GOOGLE_ADS_CUSTOMER_ID}/campaigns/${campaignData.campaignId}`,
            ...campaignData.updates
          };
          
          const result = await customer.campaigns.update(updateOperation);
          return NextResponse.json({ 
            success: true, 
            result: result.resource_name,
            action,
            platform: 'google_ads'
          });

        } catch (updateError: any) {
          return NextResponse.json({
            error: 'Failed to update campaign',
            details: updateError.message,
            action
          }, { status: 400 });
        }

      case 'pause':
      case 'enable':
        try {
          // Update campaign status
          const statusOperation = {
            resource_name: `customers/${process.env.GOOGLE_ADS_CUSTOMER_ID}/campaigns/${campaignData.campaignId}`,
            status: action === 'pause' ? enums.CampaignStatus.PAUSED : enums.CampaignStatus.ENABLED
          };
          
          const result = await customer.campaigns.update(statusOperation);
          return NextResponse.json({ 
            success: true, 
            result: result.resource_name,
            action,
            platform: 'google_ads'
          });

        } catch (statusError: any) {
          return NextResponse.json({
            error: `Failed to ${action} campaign`,
            details: statusError.message,
            action
          }, { status: 400 });
        }

      case 'test':
        // Test API connection
        try {
          const testQuery = await customer.query(`
            SELECT customer.id, customer.descriptive_name
            FROM customer
            LIMIT 1
          `);
          
          return NextResponse.json({
            success: true,
            action: 'test',
            customer: testQuery[0]?.customer,
            message: 'Google Ads API connection successful',
            platform: 'google_ads'
          });

        } catch (testError: any) {
          return NextResponse.json({
            error: 'API connection test failed',
            details: testError.message,
            action: 'test'
          }, { status: 400 });
        }

      default:
        return NextResponse.json({ 
          error: 'Invalid action',
          validActions: ['create', 'update', 'pause', 'enable', 'test'],
          action 
        }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Google Ads campaign management error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to manage Google Ads campaign',
        details: error.message,
        platform: 'google_ads'
      },
      { status: 500 }
    );
  }
}