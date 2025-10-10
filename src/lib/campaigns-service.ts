import { supabase } from '@/lib/supabase';

// Types matching the campaigns page interface
export interface DatabaseCampaign {
  id: string;
  name: string;
  type: 'cross-platform' | 'single-platform';
  platforms: string[];
  status: 'draft' | 'active' | 'paused' | 'completed' | 'optimizing';
  budget_total: number;
  budget_daily: number;
  budget_spent: number;
  created_at: string;
  updated_at: string;
}

export interface DatabasePerformance {
  id: string;
  campaign_id: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  revenue: number;
  date: string;
  platform: string;
}

// Enhanced Campaign interface for the UI
export interface EnhancedCampaign {
  id: string;
  name: string;
  type: 'cross-platform' | 'single-platform';
  platforms: ('google-ads' | 'meta' | 'linkedin' | 'tiktok' | 'twitter')[];
  status: 'draft' | 'active' | 'paused' | 'completed' | 'optimizing';
  budget: {
    total: number;
    daily: number;
    spent: number;
    remaining: number;
    allocation: Record<string, number>;
  };
  performance: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    cpc: number;
    cpa: number;
    roas: number;
    confidence: number;
  };
  splitTests: {
    active: number;
    total: number;
    winnerFound: boolean;
    confidence: number;
  };
  aiInsights: {
    score: number;
    recommendations: string[];
    predictions: {
      nextDaySpend: number;
      expectedROAS: number;
      riskLevel: 'low' | 'medium' | 'high';
    };
  };
  createdAt: string;
  lastOptimized: string;
}

/**
 * Fetch all campaigns from the database
 */
export async function fetchCampaigns(): Promise<{ campaigns: EnhancedCampaign[]; error?: string }> {
  try {
    console.log('🔍 Fetching campaigns from database...');
    
    // Fetch campaigns
    const { data: campaignsData, error: campaignsError } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (campaignsError) {
      console.error('❌ Error fetching campaigns:', campaignsError);
      return { campaigns: [], error: campaignsError.message };
    }

    if (!campaignsData || campaignsData.length === 0) {
      console.log('ℹ️ No campaigns found in database');
      return { campaigns: [] };
    }

    console.log(`✅ Found ${campaignsData.length} campaigns in database`);

    // Fetch performance data for all campaigns
    const campaignIds = campaignsData.map(c => c.id);
    const { data: performanceData, error: performanceError } = await supabase
      .from('performance_snapshots')
      .select('*')
      .in('campaign_id', campaignIds)
      .order('date', { ascending: false });

    if (performanceError) {
      console.warn('⚠️ Error fetching performance data:', performanceError);
    }

    // Transform database data to UI format
    const enhancedCampaigns: EnhancedCampaign[] = campaignsData.map(campaign => {
      // Get latest performance data for this campaign
      const latestPerformance = performanceData?.filter(p => p.campaign_id === campaign.id)?.[0];
      
      // Calculate metrics
      const impressions = latestPerformance?.impressions || 0;
      const clicks = latestPerformance?.clicks || 0;
      const conversions = latestPerformance?.conversions || 0;
      const cost = latestPerformance?.cost || 0;
      const revenue = latestPerformance?.revenue || 0;
      
      const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
      const cpc = clicks > 0 ? cost / clicks : 0;
      const cpa = conversions > 0 ? cost / conversions : 0;
      const roas = cost > 0 ? revenue / cost : 0;

      // Parse platforms array
      const platforms = Array.isArray(campaign.platforms) 
        ? campaign.platforms 
        : typeof campaign.platforms === 'string' 
          ? JSON.parse(campaign.platforms) 
          : [];

      return {
        id: campaign.id,
        name: campaign.name,
        type: campaign.type as 'cross-platform' | 'single-platform',
        platforms: platforms as ('google-ads' | 'meta' | 'linkedin' | 'tiktok' | 'twitter')[],
        status: campaign.status as 'draft' | 'active' | 'paused' | 'completed' | 'optimizing',
        budget: {
          total: campaign.budget_total || 0,
          daily: campaign.budget_daily || 0,
          spent: campaign.budget_spent || 0,
          remaining: Math.max(0, (campaign.budget_total || 0) - (campaign.budget_spent || 0)),
          allocation: generatePlatformAllocation(platforms)
        },
        performance: {
          impressions,
          clicks,
          conversions,
          ctr: Math.round(ctr * 100) / 100,
          cpc: Math.round(cpc * 100) / 100,
          cpa: Math.round(cpa * 100) / 100,
          roas: Math.round(roas * 100) / 100,
          confidence: Math.min(95, Math.max(60, impressions / 1000)) // Simple confidence calculation
        },
        splitTests: {
          active: Math.floor(Math.random() * 10) + 1, // Mock for now
          total: Math.floor(Math.random() * 15) + 5,
          winnerFound: Math.random() > 0.5,
          confidence: Math.floor(Math.random() * 30) + 70
        },
        aiInsights: {
          score: Math.min(100, Math.max(50, roas * 20 + Math.random() * 20)),
          recommendations: generateRecommendations(campaign, latestPerformance),
          predictions: {
            nextDaySpend: campaign.budget_daily * (0.8 + Math.random() * 0.4),
            expectedROAS: roas * (0.9 + Math.random() * 0.2),
            riskLevel: roas > 3 ? 'low' : roas > 1.5 ? 'medium' : 'high'
          }
        },
        createdAt: campaign.created_at,
        lastOptimized: campaign.updated_at || campaign.created_at
      };
    });

    console.log(`✅ Successfully transformed ${enhancedCampaigns.length} campaigns`);
    return { campaigns: enhancedCampaigns };

  } catch (error) {
    console.error('❌ Unexpected error fetching campaigns:', error);
    return { 
      campaigns: [], 
      error: `Failed to fetch campaigns: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

/**
 * Generate platform allocation percentages
 */
function generatePlatformAllocation(platforms: string[]): Record<string, number> {
  if (platforms.length === 0) return {};
  
  if (platforms.length === 1) {
    return { [platforms[0]]: 100 };
  }
  
  // Generate realistic allocation
  const allocation: Record<string, number> = {};
  let remaining = 100;
  
  platforms.forEach((platform, index) => {
    if (index === platforms.length - 1) {
      allocation[platform] = remaining;
    } else {
      const percent = Math.floor(remaining / (platforms.length - index) * (0.5 + Math.random()));
      allocation[platform] = percent;
      remaining -= percent;
    }
  });
  
  return allocation;
}

/**
 * Generate AI-powered recommendations
 */
function generateRecommendations(campaign: DatabaseCampaign, performance: DatabasePerformance | undefined): string[] {
  const recommendations: string[] = [];
  
  if (!performance) {
    recommendations.push('Set up performance tracking to get personalized recommendations');
    return recommendations;
  }
  
  const ctr = performance.impressions > 0 ? (performance.clicks / performance.impressions) * 100 : 0;
  const roas = performance.cost > 0 ? performance.revenue / performance.cost : 0;
  
  if (ctr < 1.0) {
    recommendations.push('Improve ad creative to increase click-through rate');
  }
  
  if (roas < 2.0) {
    recommendations.push('Optimize landing pages to improve conversion rates');
  }
  
  if (campaign.platforms.length > 1 && performance.cost > 0) {
    recommendations.push('Analyze platform performance to optimize budget allocation');
  }
  
  if (performance.impressions > 100000) {
    recommendations.push('Consider expanding to lookalike audiences');
  }
  
  return recommendations.length > 0 ? recommendations : ['Campaign is performing well - maintain current strategy'];
}

/**
 * Create a new campaign
 */
export async function createCampaign(campaignData: Partial<DatabaseCampaign>): Promise<{ success: boolean; error?: string; campaign?: EnhancedCampaign }> {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .insert([{
        name: campaignData.name,
        type: campaignData.type,
        platforms: campaignData.platforms,
        status: campaignData.status || 'draft',
        budget_total: campaignData.budget_total || 0,
        budget_daily: campaignData.budget_daily || 0,
        budget_spent: 0
      }])
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    // Transform to enhanced format
    const enhanced = await transformDatabaseCampaign(data);
    return { success: true, campaign: enhanced };

  } catch (error) {
    return { 
      success: false, 
      error: `Failed to create campaign: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

/**
 * Transform a single database campaign to enhanced format
 */
async function transformDatabaseCampaign(campaign: DatabaseCampaign): Promise<EnhancedCampaign> {
  // Get latest performance data
  const { data: performanceData } = await supabase
    .from('performance_snapshots')
    .select('*')
    .eq('campaign_id', campaign.id)
    .order('date', { ascending: false })
    .limit(1);

  const latestPerformance = performanceData?.[0];
  
  // Apply the same transformation logic as in fetchCampaigns
  const impressions = latestPerformance?.impressions || 0;
  const clicks = latestPerformance?.clicks || 0;
  const conversions = latestPerformance?.conversions || 0;
  const cost = latestPerformance?.cost || 0;
  const revenue = latestPerformance?.revenue || 0;
  
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
  const cpc = clicks > 0 ? cost / clicks : 0;
  const cpa = conversions > 0 ? cost / conversions : 0;
  const roas = cost > 0 ? revenue / cost : 0;

  const platforms = Array.isArray(campaign.platforms) 
    ? campaign.platforms 
    : typeof campaign.platforms === 'string' 
      ? JSON.parse(campaign.platforms) 
      : [];

  return {
    id: campaign.id,
    name: campaign.name,
    type: campaign.type,
    platforms: platforms as ('google-ads' | 'meta' | 'linkedin' | 'tiktok' | 'twitter')[],
    status: campaign.status,
    budget: {
      total: campaign.budget_total || 0,
      daily: campaign.budget_daily || 0,
      spent: campaign.budget_spent || 0,
      remaining: Math.max(0, (campaign.budget_total || 0) - (campaign.budget_spent || 0)),
      allocation: generatePlatformAllocation(platforms)
    },
    performance: {
      impressions,
      clicks,
      conversions,
      ctr: Math.round(ctr * 100) / 100,
      cpc: Math.round(cpc * 100) / 100,
      cpa: Math.round(cpa * 100) / 100,
      roas: Math.round(roas * 100) / 100,
      confidence: Math.min(95, Math.max(60, impressions / 1000))
    },
    splitTests: {
      active: Math.floor(Math.random() * 10) + 1,
      total: Math.floor(Math.random() * 15) + 5,
      winnerFound: Math.random() > 0.5,
      confidence: Math.floor(Math.random() * 30) + 70
    },
    aiInsights: {
      score: Math.min(100, Math.max(50, roas * 20 + Math.random() * 20)),
      recommendations: generateRecommendations(campaign, latestPerformance),
      predictions: {
        nextDaySpend: campaign.budget_daily * (0.8 + Math.random() * 0.4),
        expectedROAS: roas * (0.9 + Math.random() * 0.2),
        riskLevel: roas > 3 ? 'low' : roas > 1.5 ? 'medium' : 'high'
      }
    },
    createdAt: campaign.created_at,
    lastOptimized: campaign.updated_at || campaign.created_at
  };
}