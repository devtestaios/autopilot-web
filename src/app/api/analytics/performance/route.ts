import { NextRequest, NextResponse } from 'next/server';

// =============================================================================
// TYPES
// =============================================================================

interface PerformanceMetric {
  timestamp: string;
  metric: string;
  value: number;
  platform: string;
  campaignId?: string;
  adGroupId?: string;
}

interface TrendAnalysis {
  metric: string;
  timeframe: string;
  trend: 'up' | 'down' | 'stable';
  changePercentage: number;
  variance: number;
  forecast: {
    nextPeriod: number;
    confidence: number;
    range: {
      low: number;
      high: number;
    };
  };
  insights: string[];
  anomalies: {
    timestamp: string;
    value: number;
    expectedValue: number;
    severity: 'low' | 'medium' | 'high';
    explanation: string;
  }[];
}

interface PerformanceInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'success' | 'info';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: {
    metric: string;
    currentValue: number;
    potentialValue: number;
    improvementPercentage: number;
  };
  recommendations: string[];
  dataPoints: PerformanceMetric[];
  confidence: number;
  createdAt: string;
}

// =============================================================================
// MOCK DATA GENERATORS
// =============================================================================

const generateTimeSeriesData = (
  metric: string, 
  days: number, 
  baseValue: number, 
  trend: number = 0,
  volatility: number = 0.1
): PerformanceMetric[] => {
  const data: PerformanceMetric[] = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const trendValue = baseValue + (trend * (days - i));
    const randomVariation = (Math.random() - 0.5) * 2 * volatility * baseValue;
    const seasonality = Math.sin((days - i) * Math.PI / 7) * 0.05 * baseValue; // Weekly pattern
    
    data.push({
      timestamp: timestamp.toISOString(),
      metric,
      value: Math.max(0, trendValue + randomVariation + seasonality),
      platform: ['facebook', 'google-ads', 'linkedin'][Math.floor(Math.random() * 3)]
    });
  }
  
  return data;
};

const calculateTrendAnalysis = (data: PerformanceMetric[], metric: string): TrendAnalysis => {
  if (data.length < 7) {
    throw new Error('Insufficient data for trend analysis');
  }

  const values = data.map(d => d.value);
  const recent = values.slice(-7);
  const previous = values.slice(-14, -7);
  
  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const previousAvg = previous.reduce((a, b) => a + b, 0) / previous.length;
  const changePercentage = ((recentAvg - previousAvg) / previousAvg) * 100;
  
  // Calculate variance
  const variance = values.reduce((acc, val) => {
    const diff = val - recentAvg;
    return acc + (diff * diff);
  }, 0) / values.length;
  
  // Simple linear regression for forecast
  const n = values.length;
  const sumX = (n * (n + 1)) / 2;
  const sumY = values.reduce((a, b) => a + b, 0);
  const sumXY = values.reduce((val, idx) => val * (idx + 1), 0);
  const sumXX = (n * (n + 1) * (2 * n + 1)) / 6;
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  const nextPeriod = slope * (n + 1) + intercept;
  
  // Confidence based on R-squared
  const yMean = sumY / n;
  const totalSumSquares = values.reduce((acc, val) => acc + Math.pow(val - yMean, 2), 0);
  const residualSumSquares = values.reduce((acc, val, idx) => {
    const predicted = slope * (idx + 1) + intercept;
    return acc + Math.pow(val - predicted, 2);
  }, 0);
  const rSquared = 1 - (residualSumSquares / totalSumSquares);
  const confidence = Math.max(0.1, Math.min(0.95, rSquared)) * 100;
  
  // Detect anomalies
  const anomalies = data.filter((point, idx) => {
    if (idx < 3) return false; // Need some history
    const localAvg = data.slice(Math.max(0, idx - 3), idx).reduce((acc, p) => acc + p.value, 0) / 3;
    const deviation = Math.abs(point.value - localAvg) / localAvg;
    return deviation > 0.3; // 30% deviation threshold
  }).map(point => {
    const expectedValue = recentAvg; // Simplified
    const deviation = Math.abs(point.value - expectedValue) / expectedValue;
    return {
      timestamp: point.timestamp,
      value: point.value,
      expectedValue,
      severity: deviation > 0.5 ? 'high' : deviation > 0.3 ? 'medium' : 'low' as const,
      explanation: point.value > expectedValue ? 
        `${metric} spike detected - ${(deviation * 100).toFixed(1)}% above expected` :
        `${metric} drop detected - ${(deviation * 100).toFixed(1)}% below expected`
    };
  });

  return {
    metric,
    timeframe: `${data.length} days`,
    trend: changePercentage > 5 ? 'up' : changePercentage < -5 ? 'down' : 'stable',
    changePercentage,
    variance,
    forecast: {
      nextPeriod,
      confidence,
      range: {
        low: nextPeriod * 0.85,
        high: nextPeriod * 1.15
      }
    },
    insights: [
      changePercentage > 10 ? `Strong ${metric} growth trend detected` :
      changePercentage < -10 ? `Declining ${metric} trend requires attention` :
      `${metric} performance is stable`,
      
      variance > recentAvg * 0.5 ? `High volatility in ${metric} - consider optimization` :
      `${metric} shows consistent performance`,
      
      anomalies.length > 0 ? `${anomalies.length} anomalies detected in the period` :
      'No significant anomalies detected'
    ],
    anomalies
  };
};

const generatePerformanceInsights = (): PerformanceInsight[] => {
  const insights: PerformanceInsight[] = [
    {
      id: 'insight_001',
      type: 'opportunity',
      priority: 'high',
      title: 'Mobile Campaign Optimization Opportunity',
      description: 'Mobile campaigns are underperforming compared to desktop. CTR is 40% lower but conversion rate is actually higher.',
      impact: {
        metric: 'CTR',
        currentValue: 1.2,
        potentialValue: 2.1,
        improvementPercentage: 75
      },
      recommendations: [
        'Increase mobile bid adjustments by 25%',
        'Create mobile-specific ad creative',
        'Optimize landing pages for mobile experience',
        'Test different call-to-action buttons for mobile'
      ],
      dataPoints: generateTimeSeriesData('CTR', 30, 1.2, 0.01, 0.15),
      confidence: 87,
      createdAt: new Date().toISOString()
    },
    {
      id: 'insight_002',
      type: 'warning',
      priority: 'high',
      title: 'Rising CPA Trend Detected',
      description: 'Cost per acquisition has increased 35% over the last 14 days across Google Ads campaigns.',
      impact: {
        metric: 'CPA',
        currentValue: 45.20,
        potentialValue: 33.50,
        improvementPercentage: -26
      },
      recommendations: [
        'Pause underperforming keywords',
        'Tighten audience targeting',
        'Review and optimize ad quality scores',
        'Test lower bid strategies'
      ],
      dataPoints: generateTimeSeriesData('CPA', 30, 33.5, 0.4, 0.1),
      confidence: 92,
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
    },
    {
      id: 'insight_003',
      type: 'success',
      priority: 'medium',
      title: 'LinkedIn Campaign Outperforming',
      description: 'LinkedIn B2B campaigns are delivering 150% higher ROAS than other platforms.',
      impact: {
        metric: 'ROAS',
        currentValue: 4.8,
        potentialValue: 6.2,
        improvementPercentage: 29
      },
      recommendations: [
        'Increase budget allocation to LinkedIn campaigns',
        'Replicate successful LinkedIn creative on other platforms',
        'Expand LinkedIn audience segments',
        'Create LinkedIn-specific landing pages'
      ],
      dataPoints: generateTimeSeriesData('ROAS', 30, 4.8, 0.05, 0.08),
      confidence: 94,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'insight_004',
      type: 'info',
      priority: 'low',
      title: 'Seasonal Pattern Identified',
      description: 'Weekend performance consistently drops 20% across all campaigns.',
      impact: {
        metric: 'Impressions',
        currentValue: 125000,
        potentialValue: 140000,
        improvementPercentage: 12
      },
      recommendations: [
        'Adjust weekend bid schedules',
        'Create weekend-specific campaigns',
        'Test different creative for weekend audience',
        'Consider dayparting optimizations'
      ],
      dataPoints: generateTimeSeriesData('Impressions', 30, 125000, 500, 0.12),
      confidence: 78,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    }
  ];

  return insights;
};

// =============================================================================
// API HANDLERS
// =============================================================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint') || 'overview';
    const metric = searchParams.get('metric') || 'all';
    const timeframe = searchParams.get('timeframe') || '30d';
    const platform = searchParams.get('platform') || 'all';

    // Parse timeframe
    const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : timeframe === '90d' ? 90 : 30;

    switch (endpoint) {
      case 'trends': {
        const metrics = metric === 'all' ? 
          ['impressions', 'clicks', 'conversions', 'spend', 'ctr', 'cpc', 'cpa', 'roas'] : 
          [metric];

        const trendAnalysis = metrics.map(m => {
          const data = generateTimeSeriesData(m, days, 
            m === 'impressions' ? 50000 :
            m === 'clicks' ? 2500 :
            m === 'conversions' ? 125 :
            m === 'spend' ? 5000 :
            m === 'ctr' ? 2.8 :
            m === 'cpc' ? 1.85 :
            m === 'cpa' ? 35.5 :
            m === 'roas' ? 4.2 : 100
          );
          return calculateTrendAnalysis(data, m);
        });

        return NextResponse.json({
          success: true,
          data: {
            trends: trendAnalysis,
            summary: {
              totalMetrics: trendAnalysis.length,
              upTrends: trendAnalysis.filter(t => t.trend === 'up').length,
              downTrends: trendAnalysis.filter(t => t.trend === 'down').length,
              stableTrends: trendAnalysis.filter(t => t.trend === 'stable').length,
              avgConfidence: trendAnalysis.reduce((acc, t) => acc + t.forecast.confidence, 0) / trendAnalysis.length,
              totalAnomalies: trendAnalysis.reduce((acc, t) => acc + t.anomalies.length, 0)
            }
          }
        });
      }

      case 'insights': {
        const insights = generatePerformanceInsights();
        const filteredInsights = platform === 'all' ? 
          insights : 
          insights.filter(insight => 
            insight.dataPoints.some(point => point.platform === platform)
          );

        return NextResponse.json({
          success: true,
          data: {
            insights: filteredInsights,
            summary: {
              total: filteredInsights.length,
              opportunities: filteredInsights.filter(i => i.type === 'opportunity').length,
              warnings: filteredInsights.filter(i => i.type === 'warning').length,
              successes: filteredInsights.filter(i => i.type === 'success').length,
              avgConfidence: filteredInsights.reduce((acc, i) => acc + i.confidence, 0) / filteredInsights.length,
              potentialImpact: filteredInsights
                .filter(i => i.type === 'opportunity')
                .reduce((acc, i) => acc + i.impact.improvementPercentage, 0)
            }
          }
        });
      }

      case 'forecasting': {
        const metrics = ['impressions', 'clicks', 'conversions', 'spend'];
        const forecasts = metrics.map(m => {
          const data = generateTimeSeriesData(m, days, 
            m === 'impressions' ? 50000 :
            m === 'clicks' ? 2500 :
            m === 'conversions' ? 125 :
            m === 'spend' ? 5000 : 100
          );
          const trend = calculateTrendAnalysis(data, m);
          
          // Generate 30-day forecast
          const forecastPeriods = 30;
          const forecastData = [];
          for (let i = 1; i <= forecastPeriods; i++) {
            const baseValue = trend.forecast.nextPeriod;
            const trendAdjustment = (trend.changePercentage / 100) * baseValue * (i / 30);
            const seasonality = Math.sin(i * Math.PI / 7) * 0.05 * baseValue;
            const uncertainty = Math.random() * 0.1 * baseValue; // Increase uncertainty over time
            
            forecastData.push({
              date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              predicted: baseValue + trendAdjustment + seasonality,
              low: (baseValue + trendAdjustment + seasonality) * (1 - (0.1 + uncertainty)),
              high: (baseValue + trendAdjustment + seasonality) * (1 + (0.1 + uncertainty)),
              confidence: Math.max(0.3, trend.forecast.confidence - (i * 0.01)) // Decrease confidence over time
            });
          }
          
          return {
            metric: m,
            forecast: forecastData,
            accuracy: trend.forecast.confidence,
            methodology: 'Linear regression with seasonal adjustment'
          };
        });

        return NextResponse.json({
          success: true,
          data: {
            forecasts,
            metadata: {
              generatedAt: new Date().toISOString(),
              timeframe: `${days} days historical`,
              forecastPeriod: '30 days',
              models: ['linear_regression', 'seasonal_decomposition']
            }
          }
        });
      }

      case 'comparison': {
        const platformA = searchParams.get('platformA') || 'facebook';
        const platformB = searchParams.get('platformB') || 'google-ads';
        
        const metricsToCompare = ['impressions', 'clicks', 'conversions', 'spend', 'ctr', 'cpc', 'cpa', 'roas'];
        const comparison = metricsToCompare.map(m => {
          const dataA = generateTimeSeriesData(m, days, 
            m === 'impressions' ? 40000 : m === 'clicks' ? 2000 : m === 'spend' ? 4000 : 100
          ).map(d => ({ ...d, platform: platformA }));
          
          const dataB = generateTimeSeriesData(m, days,
            m === 'impressions' ? 45000 : m === 'clicks' ? 2200 : m === 'spend' ? 4500 : 110
          ).map(d => ({ ...d, platform: platformB }));

          const avgA = dataA.reduce((acc, d) => acc + d.value, 0) / dataA.length;
          const avgB = dataB.reduce((acc, d) => acc + d.value, 0) / dataB.length;
          const difference = ((avgB - avgA) / avgA) * 100;

          return {
            metric: m,
            [platformA]: {
              average: avgA,
              data: dataA
            },
            [platformB]: {
              average: avgB,
              data: dataB
            },
            difference,
            winner: difference > 5 ? platformB : difference < -5 ? platformA : 'tie'
          };
        });

        return NextResponse.json({
          success: true,
          data: {
            comparison,
            summary: {
              platformA: {
                name: platformA,
                wins: comparison.filter(c => c.winner === platformA).length,
                avgPerformance: comparison.reduce((acc, c) => acc + c[platformA].average, 0) / comparison.length
              },
              platformB: {
                name: platformB,
                wins: comparison.filter(c => c.winner === platformB).length,
                avgPerformance: comparison.reduce((acc, c) => acc + c[platformB].average, 0) / comparison.length
              },
              ties: comparison.filter(c => c.winner === 'tie').length
            }
          }
        });
      }

      default: {
        // Overview endpoint
        const overviewMetrics = ['impressions', 'clicks', 'conversions', 'spend'];
        const overview = overviewMetrics.map(m => {
          const data = generateTimeSeriesData(m, days, 
            m === 'impressions' ? 50000 :
            m === 'clicks' ? 2500 :
            m === 'conversions' ? 125 :
            m === 'spend' ? 5000 : 100
          );
          const trend = calculateTrendAnalysis(data, m);
          return {
            metric: m,
            current: data[data.length - 1].value,
            trend: trend.trend,
            changePercentage: trend.changePercentage,
            forecast: trend.forecast.nextPeriod
          };
        });

        return NextResponse.json({
          success: true,
          data: {
            overview,
            insights: generatePerformanceInsights().slice(0, 3), // Top 3 insights
            lastUpdated: new Date().toISOString()
          }
        });
      }
    }

  } catch (error) {
    console.error('Error in performance analytics API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch performance analytics' },
      { status: 500 }
    );
  }
}