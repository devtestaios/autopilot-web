import { Campaign, PerformanceSnapshot } from '@/types';
import { googleAdsService } from './services/googleAdsService';

export interface AnalyticsMetrics {
  // Financial Metrics
  totalSpend: number;
  totalRevenue: number;
  totalProfit: number;
  overallROAS: number;
  overallROI: number;
  costPerAcquisition: number;
  lifetimeValue: number;
  
  // Performance Metrics
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  avgClickThroughRate: number;
  avgConversionRate: number;
  avgCostPerClick: number;
  
  // Trend Analysis
  spendTrend: number; // Percentage change
  revenueTrend: number;
  roasTrend: number;
  conversionTrend: number;
  
  // Attribution
  topPerformingCampaigns: Array<{ id: string; name: string; roas: number; spend: number }>;
  underperformingCampaigns: Array<{ id: string; name: string; roas: number; spend: number }>;
  bestPerformingKeywords: Array<{ keyword: string; conversions: number; cpa: number }>;
  
  // Forecasting
  projectedSpend30d: number;
  projectedRevenue30d: number;
  projectedROAS30d: number;
  seasonalityFactor: number;
}

export interface AttributionReport {
  channelPerformance: Array<{
    channel: string;
    platform: string;
    spend: number;
    revenue: number;
    conversions: number;
    roas: number;
    contribution: number; // Percentage of total performance
  }>;
  
  customerJourney: Array<{
    touchpoint: string;
    stage: string;
    conversions: number;
    influence: number; // Attribution percentage
  }>;
  
  crossChannelInsights: {
    bestCombinations: Array<{ channels: string[]; uplift: number }>;
    cannibalizations: Array<{ channel1: string; channel2: string; impact: number }>;
  };
}

export interface ForecastingReport {
  spendForecast: Array<{ date: string; predicted: number; confidence: number }>;
  revenueForecast: Array<{ date: string; predicted: number; confidence: number }>;
  seasonalityAnalysis: {
    patterns: Array<{ period: string; factor: number; description: string }>;
    recommendations: string[];
  };
  
  budgetOptimization: {
    currentAllocation: Array<{ campaign: string; budget: number; efficiency: number }>;
    recommendedAllocation: Array<{ campaign: string; budget: number; expectedUplift: number }>;
    totalUpliftPotential: number;
  };
}

export interface CohortAnalysis {
  acquisitionCohorts: Array<{
    cohort: string;
    month0: number;
    month1: number;
    month3: number;
    month6: number;
    month12: number;
    ltv: number;
  }>;
  
  retentionRates: Array<{
    period: string;
    rate: number;
    change: number;
  }>;
  
  valueProgression: Array<{
    segment: string;
    avgOrderValue: number;
    frequency: number;
    ltv: number;
  }>;
}

export interface CompetitiveIntelligence {
  marketShare: {
    estimatedShare: number;
    trend: number;
    topCompetitors: Array<{ name: string; estimatedShare: number }>;
  };
  
  auctionInsights: Array<{
    competitor: string;
    impressionShare: number;
    avgPosition: number;
    overlap: number;
    outranking: number;
  }>;
  
  bidLandscape: Array<{
    bidRange: string;
    impressions: number;
    clicks: number;
    cost: number;
    conversions: number;
  }>;
}

class AdvancedAnalyticsEngine {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    return cached ? Date.now() - cached.timestamp < this.CACHE_DURATION : false;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private getCache(key: string): any {
    return this.cache.get(key)?.data;
  }

  async getComprehensiveAnalytics(dateRange: { start: Date; end: Date }): Promise<AnalyticsMetrics> {
    const cacheKey = `analytics-${dateRange.start.toISOString()}-${dateRange.end.toISOString()}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    try {
      const campaigns = await googleAdsService.fetchCampaigns();
      const analytics = await this.calculateAnalytics(campaigns, dateRange);
      
      this.setCache(cacheKey, analytics);
      return analytics;
    } catch (error) {
      console.error('Error generating comprehensive analytics:', error);
      throw error;
    }
  }

  private async calculateAnalytics(campaigns: Campaign[], dateRange: { start: Date; end: Date }): Promise<AnalyticsMetrics> {
    let totalSpend = 0;
    let totalRevenue = 0;
    let totalImpressions = 0;
    let totalClicks = 0;
    let totalConversions = 0;
    
    const campaignPerformance: Array<{ id: string; name: string; roas: number; spend: number }> = [];
    
    // Calculate current period metrics
    for (const campaign of campaigns) {
      const performance = await googleAdsService.fetchCampaignMetrics(campaign.id, 30);
      const relevantData = this.filterByDateRange(performance.map(p => ({
        id: `${campaign.id}-${p.date}`,
        campaign_id: campaign.id,
        date: p.date,
        spend: p.spend,
        clicks: p.clicks,
        impressions: p.impressions,
        conversions: p.conversions,
        ctr: p.ctr,
        cpc: p.cpc,
        cpa: p.cpa,
        roas: p.spend > 0 ? (p.conversions * 100) / p.spend : 0, // Simplified ROAS calculation
        created_at: new Date().toISOString()
      })), dateRange);
      
      const campaignSpend = relevantData.reduce((sum, p) => sum + p.spend, 0);
      const campaignConversions = relevantData.reduce((sum, p) => sum + p.conversions, 0);
      const campaignClicks = relevantData.reduce((sum, p) => sum + p.clicks, 0);
      const campaignImpressions = relevantData.reduce((sum, p) => sum + p.impressions, 0);
      
      // Estimate revenue (using ROAS from latest data point)
      const latestROAS = relevantData[relevantData.length - 1]?.roas || 0;
      const campaignRevenue = campaignSpend * latestROAS;
      
      totalSpend += campaignSpend;
      totalRevenue += campaignRevenue;
      totalImpressions += campaignImpressions;
      totalClicks += campaignClicks;
      totalConversions += campaignConversions;
      
      campaignPerformance.push({
        id: campaign.id,
        name: campaign.name,
        roas: latestROAS,
        spend: campaignSpend
      });
    }

    // Calculate previous period for trend analysis
    const previousPeriod = this.getPreviousPeriod(dateRange);
    const previousMetrics = await this.calculatePreviousPeriodMetrics(campaigns, previousPeriod);

    // Calculate derived metrics
    const overallROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;
    const overallROI = totalSpend > 0 ? ((totalRevenue - totalSpend) / totalSpend) * 100 : 0;
    const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
    const avgConversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;
    const avgCPC = totalClicks > 0 ? totalSpend / totalClicks : 0;
    const costPerAcquisition = totalConversions > 0 ? totalSpend / totalConversions : 0;

    // Trend calculations
    const spendTrend = previousMetrics.totalSpend > 0 
      ? ((totalSpend - previousMetrics.totalSpend) / previousMetrics.totalSpend) * 100 
      : 0;
    const revenueTrend = previousMetrics.totalRevenue > 0 
      ? ((totalRevenue - previousMetrics.totalRevenue) / previousMetrics.totalRevenue) * 100 
      : 0;
    const roasTrend = previousMetrics.overallROAS > 0 
      ? ((overallROAS - previousMetrics.overallROAS) / previousMetrics.overallROAS) * 100 
      : 0;
    const conversionTrend = previousMetrics.totalConversions > 0 
      ? ((totalConversions - previousMetrics.totalConversions) / previousMetrics.totalConversions) * 100 
      : 0;

    // Sort campaigns by performance
    campaignPerformance.sort((a, b) => b.roas - a.roas);
    const topPerformingCampaigns = campaignPerformance.slice(0, 5);
    const underperformingCampaigns = campaignPerformance
      .filter(c => c.roas < overallROAS * 0.8)
      .slice(0, 5);

    // Forecasting (simplified)
    const projectedSpend30d = totalSpend * (1 + spendTrend / 100) * 1.1; // 10% growth assumption
    const projectedRevenue30d = totalRevenue * (1 + revenueTrend / 100) * 1.1;
    const projectedROAS30d = projectedSpend30d > 0 ? projectedRevenue30d / projectedSpend30d : 0;

    return {
      // Financial Metrics
      totalSpend,
      totalRevenue,
      totalProfit: totalRevenue - totalSpend,
      overallROAS,
      overallROI,
      costPerAcquisition,
      lifetimeValue: costPerAcquisition * 3.5, // Estimated LTV multiplier
      
      // Performance Metrics
      totalImpressions,
      totalClicks,
      totalConversions,
      avgClickThroughRate: avgCTR,
      avgConversionRate,
      avgCostPerClick: avgCPC,
      
      // Trend Analysis
      spendTrend,
      revenueTrend,
      roasTrend,
      conversionTrend,
      
      // Attribution
      topPerformingCampaigns,
      underperformingCampaigns,
      bestPerformingKeywords: [
        { keyword: 'marketing automation', conversions: 45, cpa: 23.50 },
        { keyword: 'digital marketing', conversions: 38, cpa: 28.75 },
        { keyword: 'campaign optimization', conversions: 32, cpa: 31.20 }
      ],
      
      // Forecasting
      projectedSpend30d,
      projectedRevenue30d,
      projectedROAS30d,
      seasonalityFactor: this.calculateSeasonalityFactor()
    };
  }

  private filterByDateRange(performance: PerformanceSnapshot[], dateRange: { start: Date; end: Date }): PerformanceSnapshot[] {
    return performance.filter(p => {
      const date = new Date(p.date);
      return date >= dateRange.start && date <= dateRange.end;
    });
  }

  private getPreviousPeriod(dateRange: { start: Date; end: Date }): { start: Date; end: Date } {
    const duration = dateRange.end.getTime() - dateRange.start.getTime();
    return {
      start: new Date(dateRange.start.getTime() - duration),
      end: new Date(dateRange.start.getTime())
    };
  }

  private async calculatePreviousPeriodMetrics(campaigns: Campaign[], dateRange: { start: Date; end: Date }) {
    // Simplified previous period calculation
    const currentMetrics = await this.calculateAnalytics(campaigns, dateRange);
    return {
      totalSpend: currentMetrics.totalSpend * 0.9, // Mock previous period
      totalRevenue: currentMetrics.totalRevenue * 0.85,
      overallROAS: currentMetrics.overallROAS * 0.95,
      totalConversions: currentMetrics.totalConversions * 0.88
    };
  }

  private calculateSeasonalityFactor(): number {
    const month = new Date().getMonth();
    // Simplified seasonality based on typical e-commerce patterns
    const seasonalFactors = [0.8, 0.7, 0.9, 1.0, 1.1, 1.0, 0.9, 0.9, 1.0, 1.1, 1.3, 1.4];
    return seasonalFactors[month];
  }

  async getAttributionReport(dateRange: { start: Date; end: Date }): Promise<AttributionReport> {
    const cacheKey = `attribution-${dateRange.start.toISOString()}-${dateRange.end.toISOString()}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    // Mock attribution data - in real implementation, this would analyze cross-channel data
    const report: AttributionReport = {
      channelPerformance: [
        {
          channel: 'Google Ads Search',
          platform: 'Google Ads',
          spend: 15420,
          revenue: 62380,
          conversions: 186,
          roas: 4.04,
          contribution: 45.2
        },
        {
          channel: 'Google Ads Display',
          platform: 'Google Ads',
          spend: 8750,
          revenue: 26250,
          conversions: 78,
          roas: 3.00,
          contribution: 19.1
        },
        {
          channel: 'Facebook Ads',
          platform: 'Meta',
          spend: 12300,
          revenue: 44280,
          conversions: 142,
          roas: 3.60,
          contribution: 32.1
        },
        {
          channel: 'LinkedIn Ads',
          platform: 'LinkedIn',
          spend: 5680,
          revenue: 19880,
          conversions: 34,
          roas: 3.50,
          contribution: 3.6
        }
      ],
      
      customerJourney: [
        { touchpoint: 'Display Awareness', stage: 'Awareness', conversions: 245, influence: 15.3 },
        { touchpoint: 'Search Interest', stage: 'Consideration', conversions: 198, influence: 42.7 },
        { touchpoint: 'Social Engagement', stage: 'Consideration', conversions: 156, influence: 23.4 },
        { touchpoint: 'Direct Conversion', stage: 'Decision', conversions: 89, influence: 18.6 }
      ],
      
      crossChannelInsights: {
        bestCombinations: [
          { channels: ['Display', 'Search'], uplift: 23.4 },
          { channels: ['Social', 'Search'], uplift: 18.7 },
          { channels: ['Display', 'Social', 'Search'], uplift: 31.2 }
        ],
        cannibalizations: [
          { channel1: 'Search Brand', channel2: 'Display Retargeting', impact: -8.3 },
          { channel1: 'Facebook', channel2: 'Instagram', impact: -5.7 }
        ]
      }
    };

    this.setCache(cacheKey, report);
    return report;
  }

  async getForecastingReport(dateRange: { start: Date; end: Date }): Promise<ForecastingReport> {
    const cacheKey = `forecasting-${dateRange.start.toISOString()}-${dateRange.end.toISOString()}`;
    
    if (this.isCacheValid(cacheKey)) {
      return this.getCache(cacheKey);
    }

    const campaigns = await googleAdsService.fetchCampaigns();
    const analytics = await this.getComprehensiveAnalytics(dateRange);

    // Generate forecasting data
    const report: ForecastingReport = {
      spendForecast: this.generateSpendForecast(analytics),
      revenueForecast: this.generateRevenueForecast(analytics),
      seasonalityAnalysis: {
        patterns: [
          { period: 'Q4', factor: 1.35, description: 'Holiday shopping season drives 35% increase' },
          { period: 'Q1', factor: 0.75, description: 'Post-holiday dip reduces activity by 25%' },
          { period: 'Q2', factor: 1.05, description: 'Spring recovery with 5% increase' },
          { period: 'Q3', factor: 0.95, description: 'Summer slowdown with 5% decrease' }
        ],
        recommendations: [
          'Increase budgets by 40% in November-December',
          'Reduce spend by 20% in January-February',
          'Focus on brand awareness in Q1 for Q2 recovery',
          'Prepare creative refreshes for seasonal campaigns'
        ]
      },
      budgetOptimization: this.generateBudgetOptimization(campaigns, analytics)
    };

    this.setCache(cacheKey, report);
    return report;
  }

  private generateSpendForecast(analytics: AnalyticsMetrics): Array<{ date: string; predicted: number; confidence: number }> {
    const forecast = [];
    const baseSpend = analytics.totalSpend / 30; // Daily average
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      // Apply trend and seasonality
      const trendFactor = 1 + (analytics.spendTrend / 100) * (i / 30);
      const seasonalityNoise = Math.sin(i / 7) * 0.1; // Weekly pattern
      const predicted = baseSpend * trendFactor * (1 + seasonalityNoise) * analytics.seasonalityFactor;
      const confidence = Math.max(0.6, 0.95 - (i / 30) * 0.3); // Confidence decreases over time
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        predicted: Math.round(predicted),
        confidence: Math.round(confidence * 100) / 100
      });
    }
    
    return forecast;
  }

  private generateRevenueForecast(analytics: AnalyticsMetrics): Array<{ date: string; predicted: number; confidence: number }> {
    const forecast = [];
    const baseRevenue = analytics.totalRevenue / 30; // Daily average
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      const trendFactor = 1 + (analytics.revenueTrend / 100) * (i / 30);
      const seasonalityNoise = Math.sin(i / 7) * 0.15;
      const predicted = baseRevenue * trendFactor * (1 + seasonalityNoise) * analytics.seasonalityFactor;
      const confidence = Math.max(0.5, 0.9 - (i / 30) * 0.4);
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        predicted: Math.round(predicted),
        confidence: Math.round(confidence * 100) / 100
      });
    }
    
    return forecast;
  }

  private generateBudgetOptimization(campaigns: Campaign[], analytics: AnalyticsMetrics): ForecastingReport['budgetOptimization'] {
    const currentAllocation = campaigns.map(campaign => ({
      campaign: campaign.name,
      budget: campaign.budget || 0,
      efficiency: Math.random() * 0.5 + 0.5 // Mock efficiency score
    }));

    const recommendedAllocation = campaigns.map(campaign => {
      const topCampaign = analytics.topPerformingCampaigns.find(c => c.id === campaign.id);
      const currentBudget = campaign.budget || 0;
      
      let budgetMultiplier = 1.0;
      if (topCampaign && topCampaign.roas > analytics.overallROAS * 1.2) {
        budgetMultiplier = 1.3; // Increase high performers
      } else if (analytics.underperformingCampaigns.find(c => c.id === campaign.id)) {
        budgetMultiplier = 0.7; // Decrease underperformers
      }

      return {
        campaign: campaign.name,
        budget: Math.round(currentBudget * budgetMultiplier),
        expectedUplift: (budgetMultiplier - 1) * 100
      };
    });

    const totalUpliftPotential = recommendedAllocation.reduce((sum, rec) => {
      return sum + Math.max(0, rec.expectedUplift);
    }, 0) / recommendedAllocation.length;

    return {
      currentAllocation,
      recommendedAllocation,
      totalUpliftPotential: Math.round(totalUpliftPotential * 100) / 100
    };
  }

  async getCohortAnalysis(dateRange: { start: Date; end: Date }): Promise<CohortAnalysis> {
    // Mock cohort analysis - in real implementation, this would analyze customer data
    return {
      acquisitionCohorts: [
        { cohort: '2024-01', month0: 100, month1: 85, month3: 72, month6: 65, month12: 58, ltv: 285.50 },
        { cohort: '2024-02', month0: 100, month1: 88, month3: 75, month6: 68, month12: 0, ltv: 290.25 },
        { cohort: '2024-03', month0: 100, month1: 92, month3: 78, month6: 0, month12: 0, ltv: 295.75 },
        { cohort: '2024-04', month0: 100, month1: 90, month3: 0, month6: 0, month12: 0, ltv: 298.60 }
      ],
      
      retentionRates: [
        { period: '30 days', rate: 87.5, change: 2.3 },
        { period: '90 days', rate: 74.2, change: 1.8 },
        { period: '180 days', rate: 66.8, change: -0.5 },
        { period: '365 days', rate: 58.9, change: -1.2 }
      ],
      
      valueProgression: [
        { segment: 'High Value', avgOrderValue: 125.80, frequency: 2.3, ltv: 425.60 },
        { segment: 'Medium Value', avgOrderValue: 78.50, frequency: 1.8, ltv: 285.30 },
        { segment: 'Low Value', avgOrderValue: 42.30, frequency: 1.2, ltv: 125.80 }
      ]
    };
  }

  async getCompetitiveIntelligence(): Promise<CompetitiveIntelligence> {
    // Mock competitive intelligence - in real implementation, this would use Google Ads auction insights
    return {
      marketShare: {
        estimatedShare: 15.7,
        trend: 2.3,
        topCompetitors: [
          { name: 'Competitor A', estimatedShare: 22.1 },
          { name: 'Competitor B', estimatedShare: 18.9 },
          { name: 'Competitor C', estimatedShare: 16.3 }
        ]
      },
      
      auctionInsights: [
        { competitor: 'competitor1.com', impressionShare: 24.5, avgPosition: 1.8, overlap: 68.2, outranking: 42.3 },
        { competitor: 'competitor2.com', impressionShare: 19.7, avgPosition: 2.1, overlap: 58.9, outranking: 51.7 },
        { competitor: 'competitor3.com', impressionShare: 16.8, avgPosition: 2.3, overlap: 45.6, outranking: 63.2 }
      ],
      
      bidLandscape: [
        { bidRange: '$0.50-$1.00', impressions: 12450, clicks: 890, cost: 750, conversions: 45 },
        { bidRange: '$1.00-$2.00', impressions: 18920, clicks: 1560, cost: 1890, conversions: 89 },
        { bidRange: '$2.00-$3.00', impressions: 15680, clicks: 1120, cost: 2580, conversions: 78 },
        { bidRange: '$3.00+', impressions: 8750, clicks: 450, cost: 1680, conversions: 34 }
      ]
    };
  }
}

export const advancedAnalyticsEngine = new AdvancedAnalyticsEngine();