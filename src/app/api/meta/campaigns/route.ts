import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const accessToken = process.env.META_ACCESS_TOKEN;
    const adAccountId = process.env.META_AD_ACCOUNT_ID;

    if (!accessToken || !adAccountId) {
      return NextResponse.json({
        error: 'Meta API credentials not configured',
        missing: {
          access_token: !accessToken,
          ad_account_id: !adAccountId
        },
        status: 'configuration_incomplete'
      }, { status: 503 });
    }

    try {
      // Fetch campaigns from Meta Business API
      const campaignsResponse = await fetch(
        `https://graph.facebook.com/v19.0/act_${adAccountId}/campaigns?` +
        new URLSearchParams({
          fields: 'id,name,status,objective,budget_remaining,spend,created_time,updated_time',
          access_token: accessToken,
          limit: '50'
        })
      );

      if (!campaignsResponse.ok) {
        const errorData = await campaignsResponse.json();
        throw new Error(`Meta API error: ${campaignsResponse.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await campaignsResponse.json();

      // Fetch additional performance metrics for each campaign
      const campaignsWithMetrics = await Promise.all(
        data.data.map(async (campaign: any) => {
          try {
            // Get insights for the campaign
            const insightsResponse = await fetch(
              `https://graph.facebook.com/v19.0/${campaign.id}/insights?` +
              new URLSearchParams({
                fields: 'impressions,clicks,spend,reach,frequency,cpm,cpc,ctr',
                date_preset: 'last_30d',
                access_token: accessToken
              })
            );

            let insights = null;
            if (insightsResponse.ok) {
              const insightsData = await insightsResponse.json();
              insights = insightsData.data[0] || null;
            }

            return {
              id: campaign.id,
              name: campaign.name,
              status: campaign.status,
              objective: campaign.objective,
              budget: {
                remaining: parseFloat(campaign.budget_remaining || '0'),
                spent: parseFloat(campaign.spend || '0'),
                currency: 'USD'
              },
              performance: insights ? {
                impressions: parseInt(insights.impressions || '0'),
                clicks: parseInt(insights.clicks || '0'),
                spend: parseFloat(insights.spend || '0'),
                reach: parseInt(insights.reach || '0'),
                cpm: parseFloat(insights.cpm || '0'),
                cpc: parseFloat(insights.cpc || '0'),
                ctr: parseFloat(insights.ctr || '0'),
              } : {
                impressions: 0,
                clicks: 0,
                spend: parseFloat(campaign.spend || '0'),
                reach: 0,
                cpm: 0,
                cpc: 0,
                ctr: 0,
              },
              created_time: campaign.created_time,
              updated_time: campaign.updated_time
            };
          } catch (error) {
            console.warn(`Failed to fetch insights for campaign ${campaign.id}:`, error);
            return {
              id: campaign.id,
              name: campaign.name,
              status: campaign.status,
              objective: campaign.objective,
              budget: {
                remaining: parseFloat(campaign.budget_remaining || '0'),
                spent: parseFloat(campaign.spend || '0'),
                currency: 'USD'
              },
              performance: {
                impressions: 0,
                clicks: 0,
                spend: parseFloat(campaign.spend || '0'),
                reach: 0,
                cpm: 0,
                cpc: 0,
                ctr: 0,
              }
            };
          }
        })
      );

      return NextResponse.json({
        campaigns: campaignsWithMetrics,
        total: campaignsWithMetrics.length,
        status: 'active',
        platform: 'meta',
        message: 'Successfully connected to Meta Business API'
      });

    } catch (apiError: any) {
      console.error('Meta API error:', apiError);
      return NextResponse.json({
        error: 'Meta Business API query failed',
        details: apiError.message,
        status: 'api_error',
        suggestions: [
          'Verify your access token is valid and not expired',
          'Check that your ad account ID is correct (format: act_123456789)',
          'Ensure your app has the required permissions: ads_management, ads_read',
          'Confirm your access token has access to this ad account'
        ]
      }, { status: 502 });
    }

  } catch (error: any) {
    console.error('Meta API integration error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to connect to Meta Business API',
        details: error.message,
        status: 'connection_error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { platform, action, data } = await request.json();
    const accessToken = process.env.META_ACCESS_TOKEN;
    const adAccountId = process.env.META_AD_ACCOUNT_ID;

    if (!accessToken || !adAccountId) {
      return NextResponse.json({
        error: 'Meta API credentials not configured',
        missing: {
          access_token: !accessToken,
          ad_account_id: !adAccountId
        }
      }, { status: 503 });
    }

    switch (action) {
      case 'create':
        try {
          // Create new campaign
          const campaignData = {
            name: data.name,
            objective: data.objective || 'TRAFFIC',
            status: 'PAUSED', // Start paused for review
            special_ad_categories: data.special_ad_categories || [],
            access_token: accessToken
          };

          // Add Instagram-specific settings if platform is Instagram
          if (platform === 'instagram') {
            campaignData.special_ad_categories = data.special_ad_categories || [];
          }

          const createResponse = await fetch(
            `https://graph.facebook.com/v19.0/act_${adAccountId}/campaigns`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(campaignData)
            }
          );

          if (!createResponse.ok) {
            const errorData = await createResponse.json();
            throw new Error(`Meta API error: ${createResponse.status} - ${errorData.error?.message || 'Unknown error'}`);
          }

          const createResult = await createResponse.json();
          return NextResponse.json({ 
            success: true, 
            campaignId: createResult.id,
            action,
            platform 
          });

        } catch (createError: any) {
          return NextResponse.json({
            error: 'Failed to create campaign',
            details: createError.message,
            action,
            platform
          }, { status: 400 });
        }

      case 'update':
        try {
          // Update existing campaign
          const updateData = {
            ...data.updates,
            access_token: accessToken
          };

          const updateResponse = await fetch(
            `https://graph.facebook.com/v19.0/${data.campaignId}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(updateData)
            }
          );

          if (!updateResponse.ok) {
            const errorData = await updateResponse.json();
            throw new Error(`Meta API error: ${updateResponse.status} - ${errorData.error?.message || 'Unknown error'}`);
          }

          const updateResult = await updateResponse.json();
          return NextResponse.json({ 
            success: true, 
            result: updateResult,
            action,
            platform 
          });

        } catch (updateError: any) {
          return NextResponse.json({
            error: 'Failed to update campaign',
            details: updateError.message,
            action,
            platform
          }, { status: 400 });
        }

      case 'pause':
      case 'activate':
        try {
          // Update campaign status
          const statusData = {
            status: action === 'pause' ? 'PAUSED' : 'ACTIVE',
            access_token: accessToken
          };

          const statusResponse = await fetch(
            `https://graph.facebook.com/v19.0/${data.campaignId}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(statusData)
            }
          );

          if (!statusResponse.ok) {
            const errorData = await statusResponse.json();
            throw new Error(`Meta API error: ${statusResponse.status} - ${errorData.error?.message || 'Unknown error'}`);
          }

          const statusResult = await statusResponse.json();
          return NextResponse.json({ 
            success: true, 
            result: statusResult,
            action,
            platform 
          });

        } catch (statusError: any) {
          return NextResponse.json({
            error: `Failed to ${action} campaign`,
            details: statusError.message,
            action,
            platform
          }, { status: 400 });
        }

      case 'test':
        try {
          // Test API connection
          const testResponse = await fetch(
            `https://graph.facebook.com/v19.0/act_${adAccountId}?` +
            new URLSearchParams({
              fields: 'id,name,account_status,business',
              access_token: accessToken
            })
          );

          if (!testResponse.ok) {
            const errorData = await testResponse.json();
            throw new Error(`Meta API error: ${testResponse.status} - ${errorData.error?.message || 'Unknown error'}`);
          }

          const testResult = await testResponse.json();
          return NextResponse.json({
            success: true,
            action: 'test',
            account: testResult,
            message: 'Meta Business API connection successful',
            platform
          });

        } catch (testError: any) {
          return NextResponse.json({
            error: 'API connection test failed',
            details: testError.message,
            action: 'test',
            platform
          }, { status: 400 });
        }

      default:
        return NextResponse.json({ 
          error: 'Invalid action',
          validActions: ['create', 'update', 'pause', 'activate', 'test'],
          action,
          platform 
        }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Meta API management error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to manage Meta campaign',
        details: error.message,
        platform: 'meta'
      },
      { status: 500 }
    );
  }
}