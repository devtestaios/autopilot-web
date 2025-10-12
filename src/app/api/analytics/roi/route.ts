import { NextRequest, NextResponse } from 'next/server';

// =============================================================================
// TYPES
// =============================================================================

interface Attribution {
  touchpointId: string;
  campaignId: string;
  platform: string;
  channel: string;
  timestamp: string;
  touchpointType: 'impression' | 'click' | 'video_view' | 'engagement';
  position: number; // Position in the customer journey
  value: number; // Attributed value
}

interface CustomerJourney {
  customerId: string;
  conversionId: string;
  totalValue: number;
  conversionDate: string;
  touchpoints: Attribution[];
  journeyDuration: number; // In hours
  devicePath: string[]; // Device types used
  channelPath: string[]; // Marketing channels used
}

interface ROIAnalysis {
  campaignId: string;
  platform: string;
  totalSpend: number;
  totalRevenue: number;
  roi: number;
  roas: number;
  attribution: {
    firstTouch: number;
    lastTouch: number;
    linear: number;
    timeDecay: number;
    positionBased: number;
    datadriven: number;
  };
  breakdown: {
    impressions: { spend: number; revenue: number; count: number };
    clicks: { spend: number; revenue: number; count: number };
    conversions: { spend: number; revenue: number; count: number };
  };
  insights: {
    topPerformingChannels: string[];
    optimizationOpportunities: string[];
    budgetRecommendations: string[];
  };
}

interface AttributionModel {
  name: string;
  type: 'first_touch' | 'last_touch' | 'linear' | 'time_decay' | 'position_based' | 'data_driven';
  description: string;
  weightingFunction: (position: number, totalTouchpoints: number, timeSinceTouch: number) => number;
}

// =============================================================================
// ATTRIBUTION MODELS
// =============================================================================

const attributionModels: { [key: string]: AttributionModel } = {
  first_touch: {
    name: 'First Touch',
    type: 'first_touch',
    description: 'Gives 100% credit to the first touchpoint',
    weightingFunction: (position: number) => position === 0 ? 1 : 0
  },
  last_touch: {
    name: 'Last Touch',
    type: 'last_touch',
    description: 'Gives 100% credit to the last touchpoint',
    weightingFunction: (position: number, totalTouchpoints: number) => 
      position === totalTouchpoints - 1 ? 1 : 0
  },
  linear: {
    name: 'Linear',
    type: 'linear',
    description: 'Distributes credit equally across all touchpoints',
    weightingFunction: (position: number, totalTouchpoints: number) => 1 / totalTouchpoints
  },
  time_decay: {
    name: 'Time Decay',
    type: 'time_decay',
    description: 'Gives more credit to touchpoints closer to conversion',
    weightingFunction: (position: number, totalTouchpoints: number, timeSinceTouch: number) => {
      const decayRate = 0.5;
      const daysToConversion = timeSinceTouch / 24; // Convert hours to days
      return Math.exp(-decayRate * daysToConversion);
    }
  },
  position_based: {
    name: 'Position Based (40/20/40)',
    type: 'position_based',
    description: 'Gives 40% to first, 40% to last, 20% to middle touchpoints',
    weightingFunction: (position: number, totalTouchpoints: number) => {
      if (totalTouchpoints === 1) return 1;
      if (totalTouchpoints === 2) return 0.5;
      if (position === 0) return 0.4; // First
      if (position === totalTouchpoints - 1) return 0.4; // Last
      return 0.2 / (totalTouchpoints - 2); // Middle touchpoints
    }
  },
  data_driven: {
    name: 'Data Driven',
    type: 'data_driven',
    description: 'Uses machine learning to determine optimal attribution weights',
    weightingFunction: (position: number, totalTouchpoints: number, timeSinceTouch: number) => {
      // Simplified data-driven model
      const positionWeight = 1 / (1 + Math.exp(-0.5 * (position - totalTouchpoints / 2)));
      const timeWeight = Math.exp(-0.1 * (timeSinceTouch / 24));
      const channelWeight = 1; // Would be based on historical conversion rates
      
      return (positionWeight * timeWeight * channelWeight) / totalTouchpoints;
    }
  }
};

// =============================================================================
// MOCK DATA GENERATORS
// =============================================================================

const generateCustomerJourneys = (count: number = 100): CustomerJourney[] => {
  const journeys: CustomerJourney[] = [];
  const platforms = ['facebook', 'google-ads', 'linkedin', 'twitter', 'tiktok'];
  const channels = ['social', 'search', 'display', 'video', 'email'];
  const devices = ['desktop', 'mobile', 'tablet'];

  for (let i = 0; i < count; i++) {
    const journeyDuration = Math.random() * 168 + 1; // 1-168 hours (1 week)
    const touchpointCount = Math.floor(Math.random() * 8) + 1; // 1-8 touchpoints
    const conversionValue = Math.random() * 500 + 50; // $50-$550
    const conversionDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);

    const touchpoints: Attribution[] = [];
    const usedDevices: string[] = [];
    const usedChannels: string[] = [];

    for (let j = 0; j < touchpointCount; j++) {
      const platform = platforms[Math.floor(Math.random() * platforms.length)];
      const channel = channels[Math.floor(Math.random() * channels.length)];
      const device = devices[Math.floor(Math.random() * devices.length)];
      const touchpointTime = new Date(conversionDate.getTime() - (journeyDuration - (j * journeyDuration / touchpointCount)) * 60 * 60 * 1000);
      
      if (!usedDevices.includes(device)) usedDevices.push(device);
      if (!usedChannels.includes(channel)) usedChannels.push(channel);

      touchpoints.push({
        touchpointId: `tp_${i}_${j}`,
        campaignId: `campaign_${platform}_${Math.floor(Math.random() * 5) + 1}`,
        platform,
        channel,
        timestamp: touchpointTime.toISOString(),
        touchpointType: ['impression', 'click', 'video_view', 'engagement'][Math.floor(Math.random() * 4)] as any,
        position: j,
        value: 0 // Will be calculated based on attribution model
      });
    }

    journeys.push({
      customerId: `customer_${i}`,
      conversionId: `conversion_${i}`,
      totalValue: conversionValue,
      conversionDate: conversionDate.toISOString(),
      touchpoints,
      journeyDuration,
      devicePath: usedDevices,
      channelPath: usedChannels
    });
  }

  return journeys;
};

const calculateAttributedRevenue = (journey: CustomerJourney, modelType: string): CustomerJourney => {
  const model = attributionModels[modelType];
  if (!model) throw new Error(`Unknown attribution model: ${modelType}`);

  const totalTouchpoints = journey.touchpoints.length;
  let totalWeight = 0;

  // Calculate weights for each touchpoint
  const touchpointsWithWeights = journey.touchpoints.map((touchpoint, index) => {
    const conversionTime = new Date(journey.conversionDate).getTime();
    const touchpointTime = new Date(touchpoint.timestamp).getTime();
    const timeSinceTouch = (conversionTime - touchpointTime) / (1000 * 60 * 60); // Hours

    const weight = model.weightingFunction(index, totalTouchpoints, timeSinceTouch);
    totalWeight += weight;
    
    return {
      ...touchpoint,
      weight
    };
  });

  // Normalize weights and calculate attributed values
  const normalizedTouchpoints = touchpointsWithWeights.map(tp => ({
    ...tp,
    value: (tp.weight / totalWeight) * journey.totalValue
  }));

  return {
    ...journey,
    touchpoints: normalizedTouchpoints
  };
};

const generateROIAnalysis = (journeys: CustomerJourney[]): ROIAnalysis[] => {
  const campaignGroups = journeys.reduce((acc, journey) => {
    journey.touchpoints.forEach(tp => {
      const key = `${tp.campaignId}_${tp.platform}`;
      if (!acc[key]) {
        acc[key] = {
          campaignId: tp.campaignId,
          platform: tp.platform,
          touchpoints: [],
          totalRevenue: 0
        };
      }
      acc[key].touchpoints.push(tp);
      acc[key].totalRevenue += tp.value;
    });
    return acc;
  }, {} as any);

  return Object.values(campaignGroups).map((group: any) => {
    const totalSpend = Math.random() * 10000 + 5000; // $5k-$15k spend
    const totalRevenue = group.totalRevenue;
    const roi = ((totalRevenue - totalSpend) / totalSpend) * 100;
    const roas = totalRevenue / totalSpend;

    // Calculate attribution breakdown for different models
    const attribution = {};
    Object.keys(attributionModels).forEach(modelType => {
      const modelJourneys = journeys.map(j => calculateAttributedRevenue(j, modelType));
      const modelRevenue = modelJourneys.reduce((acc, journey) => {
        const campaignRevenue = journey.touchpoints
          .filter(tp => tp.campaignId === group.campaignId)
          .reduce((sum, tp) => sum + tp.value, 0);
        return acc + campaignRevenue;
      }, 0);
      attribution[modelType] = modelRevenue;
    });

    // Generate insights
    const topChannels = [...new Set(group.touchpoints.map(tp => tp.channel))]
      .sort((a, b) => {
        const revenueA = group.touchpoints.filter(tp => tp.channel === a).reduce((sum, tp) => sum + tp.value, 0);
        const revenueB = group.touchpoints.filter(tp => tp.channel === b).reduce((sum, tp) => sum + tp.value, 0);
        return revenueB - revenueA;
      });

    return {
      campaignId: group.campaignId,
      platform: group.platform,
      totalSpend,
      totalRevenue,
      roi,
      roas,
      attribution,
      breakdown: {
        impressions: {
          spend: totalSpend * 0.3,
          revenue: totalRevenue * 0.2,
          count: group.touchpoints.filter(tp => tp.touchpointType === 'impression').length
        },
        clicks: {
          spend: totalSpend * 0.5,
          revenue: totalRevenue * 0.6,
          count: group.touchpoints.filter(tp => tp.touchpointType === 'click').length
        },
        conversions: {
          spend: totalSpend * 0.2,
          revenue: totalRevenue * 0.2,
          count: group.touchpoints.filter(tp => tp.touchpointType === 'engagement').length
        }
      },
      insights: {
        topPerformingChannels: topChannels.slice(0, 3),
        optimizationOpportunities: [
          roi < 100 ? 'Consider reducing spend or improving targeting' : 'Strong performance - consider scaling',
          roas < 2 ? 'ROAS below target - optimize for higher value conversions' : 'ROAS above target',
          topChannels.length > 3 ? 'Consider consolidating to top performing channels' : 'Good channel focus'
        ],
        budgetRecommendations: [
          roi > 200 ? 'Increase budget by 25%' : roi > 100 ? 'Maintain current budget' : 'Decrease budget by 15%',
          `Focus 60% of budget on ${topChannels[0]} channel`,
          'Test attribution model impact on budget allocation'
        ]
      }
    };
  });
};

// =============================================================================
// API HANDLERS
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint') || 'overview';
    const model = searchParams.get('model') || 'data_driven';
    const timeframe = searchParams.get('timeframe') || '30d';
    const platform = searchParams.get('platform') || 'all';
    const campaignId = searchParams.get('campaignId');

    // Generate mock data
    const journeys = generateCustomerJourneys(200);
    const roiAnalysis = generateROIAnalysis(journeys);

    switch (endpoint) {
      case 'attribution': {
        if (!attributionModels[model]) {
          return NextResponse.json(
            { success: false, error: 'Invalid attribution model' },
            { status: 400 }
          );
        }

        const attributedJourneys = journeys.map(j => calculateAttributedRevenue(j, model));
        
        // Aggregate by campaign/platform
        const attributionResults = attributedJourneys.reduce((acc, journey) => {
          journey.touchpoints.forEach(tp => {
            const key = `${tp.campaignId}_${tp.platform}`;
            if (!acc[key]) {
              acc[key] = {
                campaignId: tp.campaignId,
                platform: tp.platform,
                totalAttributedRevenue: 0,
                touchpointCount: 0,
                avgAttributedValue: 0
              };
            }
            acc[key].totalAttributedRevenue += tp.value;
            acc[key].touchpointCount += 1;
          });
          return acc;
        }, {});

        // Calculate averages
        Object.values(attributionResults).forEach((result: any) => {
          result.avgAttributedValue = result.totalAttributedRevenue / result.touchpointCount;
        });

        return NextResponse.json({
          success: true,
          data: {
            model: attributionModels[model],
            results: Object.values(attributionResults),
            summary: {
              totalJourneys: attributedJourneys.length,
              totalAttributedRevenue: Object.values(attributionResults).reduce((acc: number, r: any) => acc + r.totalAttributedRevenue, 0),
              avgJourneyLength: journeys.reduce((acc, j) => acc + j.touchpoints.length, 0) / journeys.length,
              avgJourneyDuration: journeys.reduce((acc, j) => acc + j.journeyDuration, 0) / journeys.length
            }
          }
        });
      }

      case 'roi': {
        let filteredAnalysis = roiAnalysis;
        
        if (platform !== 'all') {
          filteredAnalysis = filteredAnalysis.filter(analysis => analysis.platform === platform);
        }
        
        if (campaignId) {
          filteredAnalysis = filteredAnalysis.filter(analysis => analysis.campaignId === campaignId);
        }

        const summary = {
          totalCampaigns: filteredAnalysis.length,
          totalSpend: filteredAnalysis.reduce((acc, a) => acc + a.totalSpend, 0),
          totalRevenue: filteredAnalysis.reduce((acc, a) => acc + a.totalRevenue, 0),
          avgROI: filteredAnalysis.reduce((acc, a) => acc + a.roi, 0) / filteredAnalysis.length,
          avgROAS: filteredAnalysis.reduce((acc, a) => acc + a.roas, 0) / filteredAnalysis.length,
          profitableCampaigns: filteredAnalysis.filter(a => a.roi > 0).length
        };

        return NextResponse.json({
          success: true,
          data: {
            analysis: filteredAnalysis,
            summary
          }
        });
      }

      case 'customer-journey': {
        const customerId = searchParams.get('customerId');
        
        if (customerId) {
          const customerJourney = journeys.find(j => j.customerId === customerId);
          if (!customerJourney) {
            return NextResponse.json(
              { success: false, error: 'Customer journey not found' },
              { status: 404 }
            );
          }

          const attributedJourney = calculateAttributedRevenue(customerJourney, model);
          return NextResponse.json({
            success: true,
            data: {
              journey: attributedJourney,
              attribution: attributionModels[model]
            }
          });
        }

        // Return journey patterns
        const journeyPatterns = {
          avgTouchpoints: journeys.reduce((acc, j) => acc + j.touchpoints.length, 0) / journeys.length,
          avgDuration: journeys.reduce((acc, j) => acc + j.journeyDuration, 0) / journeys.length,
          topDevicePaths: ['mobile > desktop', 'desktop > mobile', 'mobile only', 'desktop only'],
          topChannelPaths: ['social > search', 'search > social', 'display > search', 'email > social'],
          conversionPathLength: {
            '1': journeys.filter(j => j.touchpoints.length === 1).length,
            '2-3': journeys.filter(j => j.touchpoints.length >= 2 && j.touchpoints.length <= 3).length,
            '4-6': journeys.filter(j => j.touchpoints.length >= 4 && j.touchpoints.length <= 6).length,
            '7+': journeys.filter(j => j.touchpoints.length >= 7).length
          }
        };

        return NextResponse.json({
          success: true,
          data: {
            patterns: journeyPatterns,
            sampleJourneys: journeys.slice(0, 5).map(j => calculateAttributedRevenue(j, model))
          }
        });
      }

      case 'comparison': {
        const modelA = searchParams.get('modelA') || 'first_touch';
        const modelB = searchParams.get('modelB') || 'last_touch';

        if (!attributionModels[modelA] || !attributionModels[modelB]) {
          return NextResponse.json(
            { success: false, error: 'Invalid attribution models for comparison' },
            { status: 400 }
          );
        }

        const resultsA = journeys.map(j => calculateAttributedRevenue(j, modelA));
        const resultsB = journeys.map(j => calculateAttributedRevenue(j, modelB));

        const revenueA = resultsA.reduce((acc, j) => acc + j.totalValue, 0);
        const revenueB = resultsB.reduce((acc, j) => acc + j.totalValue, 0);

        return NextResponse.json({
          success: true,
          data: {
            comparison: {
              modelA: {
                name: attributionModels[modelA].name,
                totalRevenue: revenueA,
                avgRevenuePerJourney: revenueA / resultsA.length
              },
              modelB: {
                name: attributionModels[modelB].name,
                totalRevenue: revenueB,
                avgRevenuePerJourney: revenueB / resultsB.length
              },
              difference: {
                absolute: revenueB - revenueA,
                percentage: ((revenueB - revenueA) / revenueA) * 100
              }
            },
            recommendations: [
              revenueA > revenueB ? `${modelA} model shows higher attribution` : `${modelB} model shows higher attribution`,
              'Consider data-driven model for most accurate attribution',
              'Test model impact on budget allocation decisions'
            ]
          }
        });
      }

      default: {
        // Overview endpoint
        const totalRevenue = roiAnalysis.reduce((acc, a) => acc + a.totalRevenue, 0);
        const totalSpend = roiAnalysis.reduce((acc, a) => acc + a.totalSpend, 0);
        const avgROI = roiAnalysis.reduce((acc, a) => acc + a.roi, 0) / roiAnalysis.length;

        return NextResponse.json({
          success: true,
          data: {
            overview: {
              totalRevenue,
              totalSpend,
              overallROI: ((totalRevenue - totalSpend) / totalSpend) * 100,
              overallROAS: totalRevenue / totalSpend,
              avgROI,
              profitableCampaigns: roiAnalysis.filter(a => a.roi > 0).length,
              totalCampaigns: roiAnalysis.length
            },
            topPerformers: roiAnalysis
              .sort((a, b) => b.roi - a.roi)
              .slice(0, 5),
            attributionModels: Object.values(attributionModels).map(m => ({
              type: m.type,
              name: m.name,
              description: m.description
            }))
          }
        });
      }
    }

  } catch (error) {
    console.error('Error in ROI analytics API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ROI analytics' },
      { status: 500 }
    );
  }
}