/**
 * AI-Powered Campaign Optimization Engine
 * 
 * This service analyzes campaign performance data and provides AI-driven
 * optimization recommendations for better ROI and performance.
 */

import type { Campaign } from '@/types';
import { googleAdsService } from './googleAdsService';

// Helper functions for safe metric extraction
function getNumericMetric(campaign: Campaign, key: string, defaultValue: number = 0): number {
  const value = campaign.metrics?.[key];
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
}

function hasBudget(campaign: Campaign): campaign is Campaign & { budget: number } {
  return typeof campaign.budget === 'number' && campaign.budget > 0;
}

// Simplified optimization insight type
export interface OptimizationInsight {
  id: string;
  campaignId: string;
  type: 'budget' | 'performance' | 'targeting' | 'creative';
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  recommendation: string;
  estimatedImpact: string;
  confidence: number; // 0-1
}

export interface PerformanceAnalysis {
  campaignId: string;
  overallScore: number; // 0-100
  insights: OptimizationInsight[];
  trends: {
    spending: 'increasing' | 'decreasing' | 'stable';
    performance: 'improving' | 'declining' | 'stable';
    efficiency: 'improving' | 'declining' | 'stable';
  };
  budgetUtilization: {
    current: number;
    optimal: number;
    recommendation: string;
  };
}

export class CampaignOptimizationEngine {
  private insights: OptimizationInsight[] = [];

  /**
   * Analyze a single campaign and generate optimization insights
   */
  async analyzeCampaign(campaign: Campaign): Promise<PerformanceAnalysis> {
    const insights: OptimizationInsight[] = [];
    
    // Budget Analysis
    if (hasBudget(campaign)) {
      const budgetInsights = this.analyzeBudget(campaign);
      insights.push(...budgetInsights);
    }

    // Performance Analysis
    const performanceInsights = this.analyzePerformance(campaign);
    insights.push(...performanceInsights);

    // Calculate overall score
    const overallScore = this.calculateOverallScore(campaign);

    // Analyze trends (simplified for demo)
    const trends = this.analyzeTrends(campaign);

    // Budget utilization analysis
    const budgetUtilization = this.analyzeBudgetUtilization(campaign);

    return {
      campaignId: campaign.id,
      overallScore,
      insights,
      trends,
      budgetUtilization
    };
  }

  /**
   * Analyze budget utilization and opportunities
   */
  private analyzeBudget(campaign: Campaign & { budget: number }): OptimizationInsight[] {
    const insights: OptimizationInsight[] = [];
    const spendRatio = campaign.spend / campaign.budget;

    // Under-spending analysis
    if (spendRatio < 0.7 && campaign.status === 'active') {
      insights.push({
        id: `budget-underspend-${campaign.id}`,
        campaignId: campaign.id,
        type: 'budget',
        priority: 'medium',
        title: 'Budget Under-utilization',
        description: `Campaign is only using ${(spendRatio * 100).toFixed(1)}% of allocated budget`,
        recommendation: 'Consider increasing bids or expanding targeting to utilize remaining budget',
        estimatedImpact: '25-40% more conversions possible',
        confidence: 0.8
      });
    }

    // Over-spending warning
    if (spendRatio > 0.95) {
      insights.push({
        id: `budget-overspend-${campaign.id}`,
        campaignId: campaign.id,
        type: 'budget',
        priority: 'high',
        title: 'Budget Nearly Exhausted',
        description: `Campaign has spent ${(spendRatio * 100).toFixed(1)}% of budget`,
        recommendation: 'Consider increasing budget to maintain performance',
        estimatedImpact: 'Prevent traffic loss',
        confidence: 0.9
      });
    }

    return insights;
  }

  /**
   * Analyze performance metrics
   */
  private analyzePerformance(campaign: Campaign): OptimizationInsight[] {
    const insights: OptimizationInsight[] = [];

    // CTR analysis
    const ctr = getNumericMetric(campaign, 'ctr', 0);
    if (ctr > 0 && ctr < 2.0) {
      insights.push({
        id: `low-ctr-${campaign.id}`,
        campaignId: campaign.id,
        type: 'creative',
        priority: 'medium',
        title: 'Low Click-Through Rate',
        description: `CTR at ${ctr.toFixed(2)}% is below industry benchmarks`,
        recommendation: 'Consider refreshing ad copy or improving targeting',
        estimatedImpact: '15-30% improvement in traffic',
        confidence: 0.75
      });
    }

    // CPA analysis
    const cpa = getNumericMetric(campaign, 'costPerAcquisition', 0);
    if (cpa > 50) {
      insights.push({
        id: `high-cpa-${campaign.id}`,
        campaignId: campaign.id,
        type: 'performance',
        priority: 'high',
        title: 'High Cost Per Acquisition',
        description: `CPA at $${cpa.toFixed(2)} exceeds target thresholds`,
        recommendation: 'Consider lowering bids, improving landing pages, or refining targeting',
        estimatedImpact: '20-35% cost reduction possible',
        confidence: 0.8
      });
    }

    // Conversion analysis
    const clicks = getNumericMetric(campaign, 'clicks', 0);
    const conversions = getNumericMetric(campaign, 'conversions', 0);
    
    if (clicks > 50 && conversions === 0) {
      insights.push({
        id: `no-conversions-${campaign.id}`,
        campaignId: campaign.id,
        type: 'targeting',
        priority: 'high',
        title: 'No Conversions Despite Traffic',
        description: `${clicks} clicks but no conversions recorded`,
        recommendation: 'Check conversion tracking and landing page experience',
        estimatedImpact: 'Enable proper performance measurement',
        confidence: 0.9
      });
    }

    return insights;
  }

  /**
   * Calculate overall performance score
   */
  private calculateOverallScore(campaign: Campaign): number {
    let score = 50; // Start with baseline

    // Factor in CTR
    const ctr = getNumericMetric(campaign, 'ctr', 0);
    if (ctr >= 3.0) score += 20;
    else if (ctr >= 2.0) score += 10;
    else if (ctr < 1.0) score -= 10;

    // Factor in conversion rate
    const clicks = getNumericMetric(campaign, 'clicks', 0);
    const conversions = getNumericMetric(campaign, 'conversions', 0);
    const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
    
    if (conversionRate >= 5.0) score += 20;
    else if (conversionRate >= 2.0) score += 10;
    else if (conversionRate === 0 && clicks > 10) score -= 15;

    // Factor in budget utilization
    if (hasBudget(campaign)) {
      const utilization = campaign.spend / campaign.budget;
      if (utilization >= 0.7 && utilization <= 0.95) score += 10;
      else if (utilization < 0.3) score -= 10;
    }

    // Factor in spend efficiency
    const roas = getNumericMetric(campaign, 'roas', 0);
    if (roas >= 4.0) score += 15;
    else if (roas >= 2.0) score += 5;
    else if (roas < 1.0 && roas > 0) score -= 10;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Analyze performance trends
   */
  private analyzeTrends(campaign: Campaign): PerformanceAnalysis['trends'] {
    // Simplified trend analysis - in real implementation, this would compare historical data
    const spending = 'stable' as const;
    const performance = 'stable' as const;
    const efficiency = 'stable' as const;

    return { spending, performance, efficiency };
  }

  /**
   * Analyze budget utilization
   */
  private analyzeBudgetUtilization(campaign: Campaign): PerformanceAnalysis['budgetUtilization'] {
    if (!hasBudget(campaign)) {
      return {
        current: 0,
        optimal: 0,
        recommendation: 'Set a campaign budget to enable utilization analysis'
      };
    }

    const current = (campaign.spend / campaign.budget) * 100;
    const optimal = 85; // Target 85% utilization

    let recommendation = '';
    if (current < 70) {
      recommendation = 'Increase bids or expand targeting to better utilize budget';
    } else if (current > 95) {
      recommendation = 'Consider increasing budget to prevent traffic loss';
    } else {
      recommendation = 'Budget utilization is within optimal range';
    }

    return { current, optimal, recommendation };
  }

  /**
   * Generate portfolio-level insights across multiple campaigns
   */
  async analyzePortfolio(campaigns: Campaign[]): Promise<{
    totalInsights: number;
    highPriorityInsights: number;
    topRecommendations: OptimizationInsight[];
    portfolioScore: number;
  }> {
    const allInsights: OptimizationInsight[] = [];
    
    for (const campaign of campaigns) {
      const analysis = await this.analyzeCampaign(campaign);
      allInsights.push(...analysis.insights);
    }

    const highPriorityInsights = allInsights.filter(i => i.priority === 'high').length;
    const topRecommendations = allInsights
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5);

    // Calculate portfolio score as average of campaign scores
    const portfolioScore = campaigns.length > 0 
      ? Math.round(
          (await Promise.all(campaigns.map(c => this.analyzeCampaign(c))))
            .reduce((sum, analysis) => sum + analysis.overallScore, 0) / campaigns.length
        )
      : 0;

    return {
      totalInsights: allInsights.length,
      highPriorityInsights,
      topRecommendations,
      portfolioScore
    };
  }
}

// Export singleton instance
export const campaignOptimizationEngine = new CampaignOptimizationEngine();