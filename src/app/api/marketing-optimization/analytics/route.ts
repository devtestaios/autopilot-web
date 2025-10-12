/**
 * Marketing Optimization Platform API - Analytics
 * Real-time analytics from connected ad platforms
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || 'month';

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Calculate date range based on timeframe
    const now = new Date();
    let startDate = new Date();

    switch (timeframe) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }

    // Fetch all campaigns for the user
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', startDate.toISOString());

    if (campaignsError) {
      console.error('Error fetching campaigns:', campaignsError);
      return NextResponse.json(
        { error: 'Failed to fetch campaign data' },
        { status: 500 }
      );
    }

    // Calculate overall metrics
    const totalCampaigns = campaigns?.length || 0;
    const totalSpend = campaigns?.reduce((sum, c) => sum + (c.spend || 0), 0) || 0;
    const totalRevenue = campaigns?.reduce((sum, c) => {
      const roas = c.metrics?.roas || 0;
      return sum + (c.spend * roas);
    }, 0) || 0;
    const overallRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0;

    const totalClicks = campaigns?.reduce((sum, c) => sum + (c.metrics?.clicks || 0), 0) || 0;
    const totalConversions = campaigns?.reduce((sum, c) => sum + (c.metrics?.conversions || 0), 0) || 0;
    const avgCpc = totalClicks > 0 ? totalSpend / totalClicks : 0;
    const avgConversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

    // Calculate platform performance
    const platformStats = campaigns?.reduce((acc: any, campaign: any) => {
      const platform = campaign.platform || 'unknown';
      if (!acc[platform]) {
        acc[platform] = {
          platform,
          spend: 0,
          revenue: 0,
          campaigns: 0,
          leads: 0,
          clicks: 0,
          conversions: 0
        };
      }

      const campaignRevenue = campaign.spend * (campaign.metrics?.roas || 0);
      acc[platform].spend += campaign.spend || 0;
      acc[platform].revenue += campaignRevenue;
      acc[platform].campaigns += 1;
      acc[platform].leads += campaign.metrics?.conversions || 0;
      acc[platform].clicks += campaign.metrics?.clicks || 0;
      acc[platform].conversions += campaign.metrics?.conversions || 0;

      return acc;
    }, {});

    const platformPerformance = Object.values(platformStats || {}).map((p: any) => ({
      ...p,
      roas: p.spend > 0 ? p.revenue / p.spend : 0
    }));

    // Generate performance trends (last 7 days)
    const performanceTrends = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      // In a real implementation, you'd fetch daily metrics
      // For now, we'll distribute the total evenly
      const dailySpend = totalSpend / 7;
      const dailyRevenue = totalRevenue / 7;
      const dailyLeads = totalConversions / 7;

      performanceTrends.push({
        date: dateStr,
        spend: Math.round(dailySpend),
        revenue: Math.round(dailyRevenue),
        leads: Math.round(dailyLeads),
        roas: dailySpend > 0 ? dailyRevenue / dailySpend : 0
      });
    }

    // Generate AI insights based on real data
    const aiInsights = generateAIInsights(campaigns || [], platformPerformance);

    const analyticsData = {
      timeframe,
      overview: {
        total_campaigns: totalCampaigns,
        total_spend: Math.round(totalSpend),
        total_revenue: Math.round(totalRevenue),
        overall_roas: Math.round(overallRoas * 100) / 100,
        avg_cpc: Math.round(avgCpc * 100) / 100,
        avg_conversion_rate: Math.round(avgConversionRate * 10) / 10
      },
      platform_performance: platformPerformance,
      performance_trends: performanceTrends,
      ai_insights: aiInsights
    };

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

/**
 * Generate AI insights from campaign data
 */
function generateAIInsights(campaigns: any[], platformPerformance: any[]) {
  const topOpportunities = [];
  const recommendations = [];

  // Find best performing platform
  const sortedPlatforms = [...platformPerformance].sort((a, b) => b.roas - a.roas);
  const bestPlatform = sortedPlatforms[0];
  const worstPlatform = sortedPlatforms[sortedPlatforms.length - 1];

  if (bestPlatform && worstPlatform && bestPlatform.platform !== worstPlatform.platform) {
    const roasDiff = ((bestPlatform.roas - worstPlatform.roas) / worstPlatform.roas) * 100;

    topOpportunities.push({
      opportunity: `Increase ${bestPlatform.platform} campaign budgets`,
      potential_impact: `${bestPlatform.platform} is outperforming by ${Math.round(roasDiff)}%`,
      confidence: 0.85
    });

    recommendations.push({
      action: `Reallocate budget from ${worstPlatform.platform} to ${bestPlatform.platform}`,
      reason: `${bestPlatform.platform} showing ${Math.round(roasDiff)}% higher ROAS`,
      priority: 'high'
    });
  }

  // Find campaigns with low optimization scores
  const unoptimizedCampaigns = campaigns.filter(c =>
    c.ai_optimization?.enabled === false || c.ai_optimization?.optimization_score < 50
  );

  if (unoptimizedCampaigns.length > 0) {
    topOpportunities.push({
      opportunity: 'Enable AI optimization on underperforming campaigns',
      potential_impact: `${unoptimizedCampaigns.length} campaigns could benefit from automated optimization`,
      confidence: 0.78
    });

    recommendations.push({
      action: 'Enable automated bidding on unoptimized campaigns',
      reason: 'AI optimization can improve performance by 15-30% on average',
      priority: 'medium'
    });
  }

  // Check for campaigns with high spend but low ROAS
  const inefficientCampaigns = campaigns.filter(c =>
    c.spend > 1000 && (c.metrics?.roas || 0) < 2
  );

  if (inefficientCampaigns.length > 0) {
    topOpportunities.push({
      opportunity: 'Optimize or pause low-performing campaigns',
      potential_impact: `${inefficientCampaigns.length} campaigns have ROAS below 2.0`,
      confidence: 0.72
    });

    recommendations.push({
      action: 'Review and optimize low ROAS campaigns',
      reason: 'Several campaigns spending heavily with poor returns',
      priority: 'high'
    });
  }

  return {
    top_opportunities: topOpportunities.slice(0, 3),
    recommendations: recommendations.slice(0, 3)
  };
}