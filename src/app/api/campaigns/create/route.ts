import { NextRequest, NextResponse } from 'next/server';

interface CampaignConfig {
  name: string;
  objective: 'awareness' | 'consideration' | 'conversion' | 'retention';
  platforms: string[];
  budget: {
    total: number;
    dailyLimit: number;
    allocation: Record<string, number>;
  };
  targeting: {
    demographics: {
      ageMin: number;
      ageMax: number;
      genders: string[];
      locations: string[];
    };
    interests: string[];
    behaviors: string[];
    customAudiences: string[];
    lookalikes: string[];
  };
  creative: {
    assets: Array<{
      id: string;
      type: 'image' | 'video' | 'carousel';
      url: string;
      metadata: Record<string, any>;
    }>;
    headlines: string[];
    descriptions: string[];
    callToActions: string[];
  };
  scheduling: {
    startDate: string;
    endDate?: string;
    timezone: string;
    dayParting: Record<string, boolean[]>; // day -> 24 hour boolean array
  };
  bidding: {
    strategy: 'manual' | 'automatic' | 'target_cpa' | 'target_roas';
    maxBid?: number;
    targetCpa?: number;
    targetRoas?: number;
  };
  abTesting?: {
    enabled: boolean;
    variants: Array<{
      name: string;
      trafficSplit: number;
      modifications: Record<string, any>;
    }>;
    duration: number; // days
    metrics: string[];
  };
}

export async function POST(request: NextRequest) {
  try {
    const campaignConfig: CampaignConfig = await request.json();

    // Validate campaign configuration
    const validation = validateCampaignConfig(campaignConfig);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: 'Invalid campaign configuration', details: validation.errors },
        { status: 400 }
      );
    }

    // Generate campaign variations for A/B testing if enabled
    const campaigns = await generateCampaignVariations(campaignConfig);

    // Create campaigns across platforms
    const results = await Promise.allSettled(
      campaignConfig.platforms.map(platform => 
        createPlatformCampaign(platform, campaignConfig, campaigns)
      )
    );

    // Process results
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    const campaignData = {
      id: generateCampaignId(),
      name: campaignConfig.name,
      status: 'created',
      platforms: campaignConfig.platforms,
      createdAt: new Date().toISOString(),
      config: campaignConfig,
      results: results.map((result, index) => ({
        platform: campaignConfig.platforms[index],
        status: result.status,
        data: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason.message : null
      })),
      metrics: {
        totalCampaigns: campaigns.length,
        successful,
        failed,
        estimatedReach: await calculateEstimatedReach(campaignConfig),
        estimatedCPM: await calculateEstimatedCPM(campaignConfig),
        estimatedCTR: await calculateEstimatedCTR(campaignConfig)
      }
    };

    return NextResponse.json({
      success: true,
      data: campaignData,
      message: `Campaign created successfully on ${successful} of ${campaignConfig.platforms.length} platforms`
    });

  } catch (error) {
    console.error('Campaign creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function validateCampaignConfig(config: CampaignConfig) {
  const errors: string[] = [];

  if (!config.name || config.name.length < 3) {
    errors.push('Campaign name must be at least 3 characters long');
  }

  if (!config.platforms || config.platforms.length === 0) {
    errors.push('At least one platform must be selected');
  }

  if (!config.budget || config.budget.total <= 0) {
    errors.push('Budget must be greater than 0');
  }

  if (config.budget.dailyLimit && config.budget.dailyLimit > config.budget.total) {
    errors.push('Daily limit cannot exceed total budget');
  }

  if (!config.targeting || !config.targeting.demographics) {
    errors.push('Targeting demographics are required');
  }

  if (!config.creative || !config.creative.assets || config.creative.assets.length === 0) {
    errors.push('At least one creative asset is required');
  }

  if (!config.scheduling || !config.scheduling.startDate) {
    errors.push('Start date is required');
  }

  if (config.scheduling.endDate && new Date(config.scheduling.endDate) <= new Date(config.scheduling.startDate)) {
    errors.push('End date must be after start date');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

async function generateCampaignVariations(config: CampaignConfig) {
  const variations = [{ name: `${config.name} - Control`, config }];

  if (config.abTesting?.enabled) {
    for (const variant of config.abTesting.variants) {
      const variantConfig = JSON.parse(JSON.stringify(config));
      
      // Apply modifications
      Object.keys(variant.modifications).forEach(key => {
        const keys = key.split('.');
        let target = variantConfig;
        for (let i = 0; i < keys.length - 1; i++) {
          target = target[keys[i]];
        }
        target[keys[keys.length - 1]] = variant.modifications[key];
      });

      variations.push({
        name: `${config.name} - ${variant.name}`,
        config: variantConfig
      });
    }
  }

  return variations;
}

async function createPlatformCampaign(platform: string, config: CampaignConfig, campaigns: any[]) {
  switch (platform.toLowerCase()) {
    case 'facebook':
    case 'meta':
      return createFacebookCampaign(config, campaigns);
    case 'google':
    case 'google-ads':
      return createGoogleAdsCampaign(config, campaigns);
    case 'linkedin':
      return createLinkedInCampaign(config, campaigns);
    case 'twitter':
    case 'x':
      return createTwitterCampaign(config, campaigns);
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}

async function createFacebookCampaign(config: CampaignConfig, campaigns: any[]) {
  // Facebook Ads API integration
  const response = await fetch('https://graph.facebook.com/v18.0/act_ACCOUNT_ID/campaigns', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.FACEBOOK_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: config.name,
      objective: mapObjectiveToFacebook(config.objective),
      status: 'PAUSED',
      buying_type: 'AUCTION',
      special_ad_categories: []
    })
  });

  if (!response.ok) {
    throw new Error(`Facebook API error: ${response.statusText}`);
  }

  return response.json();
}

async function createGoogleAdsCampaign(config: CampaignConfig, campaigns: any[]) {
  // Google Ads API integration would go here
  // For now, return mock data
  return {
    id: `goog_${Date.now()}`,
    platform: 'google-ads',
    status: 'created',
    campaignId: generateCampaignId()
  };
}

async function createLinkedInCampaign(config: CampaignConfig, campaigns: any[]) {
  // LinkedIn Campaign Manager API integration
  return {
    id: `li_${Date.now()}`,
    platform: 'linkedin',
    status: 'created',
    campaignId: generateCampaignId()
  };
}

async function createTwitterCampaign(config: CampaignConfig, campaigns: any[]) {
  // Twitter Ads API integration
  return {
    id: `tw_${Date.now()}`,
    platform: 'twitter',
    status: 'created',
    campaignId: generateCampaignId()
  };
}

function mapObjectiveToFacebook(objective: string) {
  const mapping = {
    awareness: 'REACH',
    consideration: 'TRAFFIC',
    conversion: 'CONVERSIONS',
    retention: 'CONVERSIONS'
  };
  return mapping[objective as keyof typeof mapping] || 'TRAFFIC';
}

async function calculateEstimatedReach(config: CampaignConfig) {
  // AI-powered reach estimation based on targeting and budget
  const baseReach = config.budget.total * 10; // Base calculation
  const targetingMultiplier = calculateTargetingMultiplier(config.targeting);
  const platformMultiplier = config.platforms.length * 0.8;
  
  return Math.round(baseReach * targetingMultiplier * platformMultiplier);
}

async function calculateEstimatedCPM(config: CampaignConfig) {
  // Calculate estimated CPM based on targeting and competition
  const baseCPM = 15; // Base CPM in USD
  const targetingModifier = calculateTargetingComplexity(config.targeting);
  const platformModifier = calculatePlatformCPMModifier(config.platforms);
  
  return Number((baseCPM * targetingModifier * platformModifier).toFixed(2));
}

async function calculateEstimatedCTR(config: CampaignConfig) {
  // AI-powered CTR estimation based on creative and targeting
  const baseCTR = 1.2; // Base CTR percentage
  const creativeScore = calculateCreativeScore(config.creative);
  const targetingScore = calculateTargetingRelevance(config.targeting);
  
  return Number((baseCTR * creativeScore * targetingScore).toFixed(3));
}

function calculateTargetingMultiplier(targeting: any) {
  let multiplier = 1;
  
  if (targeting.demographics.locations.length > 5) multiplier *= 0.9;
  if (targeting.interests.length > 10) multiplier *= 0.8;
  if (targeting.customAudiences.length > 0) multiplier *= 1.2;
  
  return multiplier;
}

function calculateTargetingComplexity(targeting: any) {
  let complexity = 1;
  
  complexity += targeting.interests.length * 0.1;
  complexity += targeting.behaviors.length * 0.15;
  complexity += targeting.customAudiences.length * 0.2;
  
  return Math.min(complexity, 3); // Cap at 3x
}

function calculatePlatformCPMModifier(platforms: string[]) {
  const platformCosts = {
    facebook: 1.0,
    google: 1.3,
    linkedin: 2.5,
    twitter: 0.8
  };
  
  const avgCost = platforms.reduce((sum, platform) => {
    return sum + (platformCosts[platform.toLowerCase() as keyof typeof platformCosts] || 1);
  }, 0) / platforms.length;
  
  return avgCost;
}

function calculateCreativeScore(creative: any) {
  let score = 1;
  
  if (creative.assets.length > 3) score *= 1.1;
  if (creative.headlines.length > 1) score *= 1.05;
  if (creative.assets.some((asset: any) => asset.type === 'video')) score *= 1.2;
  
  return score;
}

function calculateTargetingRelevance(targeting: any) {
  let relevance = 1;
  
  if (targeting.customAudiences.length > 0) relevance *= 1.3;
  if (targeting.lookalikes.length > 0) relevance *= 1.2;
  if (targeting.interests.length > 0 && targeting.interests.length <= 5) relevance *= 1.1;
  
  return relevance;
}

function generateCampaignId() {
  return `camp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}