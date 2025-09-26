import { UnifiedCampaign } from '@/lib/platforms/base';
import { FeatureVector } from './mlOptimizationEngine';

interface BidRecommendation {
  campaignId: string;
  currentBid: number;
  recommendedBid: number;
  confidence: number;
  reason: string;
  expectedImpact: {
    impressions: number;
    clicks: number;
    conversions: number;
    costChange: number;
  };
}

interface OptimizationConstraints {
  maxBidIncrease: number;
  maxBidDecrease: number;
  minBid: number;
  maxBid: number;
  targetRoas?: number;
  targetCpa?: number;
}

interface BidOptimizationResult {
  totalRecommendations: number;
  totalEstimatedImprovement: number;
  recommendations: BidRecommendation[];
  summary: {
    avgConfidence: number;
    totalCostImpact: number;
    totalConversionImpact: number;
  };
}

/**
 * Handles bid optimization recommendations and calculations
 * Extracted from MLOptimizationEngine God Object for single responsibility
 */
export class BidOptimizer {
  private defaultConstraints: OptimizationConstraints = {
    maxBidIncrease: 0.50, // 50% max increase
    maxBidDecrease: 0.30, // 30% max decrease
    minBid: 0.10,
    maxBid: 100.00
  };

  /**
   * Generate bid optimization recommendations for campaigns
   */
  async optimizeBids(
    campaigns: UnifiedCampaign[],
    features: FeatureVector[],
    constraints: Partial<OptimizationConstraints> = {}
  ): Promise<BidOptimizationResult> {
    const finalConstraints = { ...this.defaultConstraints, ...constraints };
    const recommendations: BidRecommendation[] = [];

    for (let i = 0; i < campaigns.length; i++) {
      const campaign = campaigns[i];
      const campaignFeatures = features[i];
      
      if (!campaignFeatures || !campaign.budget?.amount) continue;

      const recommendation = await this.generateBidRecommendation(
        campaign,
        campaignFeatures,
        finalConstraints
      );

      if (recommendation) {
        recommendations.push(recommendation);
      }
    }

    return this.summarizeRecommendations(recommendations);
  }

  /**
   * Generate individual campaign bid recommendation
   */
  private async generateBidRecommendation(
    campaign: UnifiedCampaign,
    features: FeatureVector,
    constraints: OptimizationConstraints
  ): Promise<BidRecommendation | null> {
    try {
      const currentBid = features.currentBid || campaign.budget.amount / 1000 || 1.0; // Use feature vector or estimate
      if (currentBid === 0) return null;

      // Calculate performance-based bid adjustment
      const performanceScore = this.calculatePerformanceScore(features);
      const marketScore = this.calculateMarketScore(features);
      const competitionScore = this.calculateCompetitionScore(features);
      
      // Combined optimization score
      const optimizationScore = (
        performanceScore * 0.5 + 
        marketScore * 0.3 + 
        competitionScore * 0.2
      );

      // Calculate recommended bid based on scores
      let bidMultiplier = 1.0;
      if (optimizationScore > 0.7) {
        bidMultiplier = 1.0 + (constraints.maxBidIncrease * (optimizationScore - 0.7) / 0.3);
      } else if (optimizationScore < 0.3) {
        bidMultiplier = 1.0 - (constraints.maxBidDecrease * (0.3 - optimizationScore) / 0.3);
      }

      let recommendedBid = currentBid * bidMultiplier;

      // Apply constraints
      recommendedBid = Math.max(constraints.minBid, Math.min(constraints.maxBid, recommendedBid));

      // Don't recommend tiny changes
      const changeThreshold = currentBid * 0.05; // 5% minimum change
      if (Math.abs(recommendedBid - currentBid) < changeThreshold) {
        return null;
      }

      // Calculate confidence based on data quality
      const confidence = this.calculateConfidence(features, optimizationScore);

      // Calculate expected impact
      const expectedImpact = this.calculateExpectedImpact(
        currentBid,
        recommendedBid,
        features
      );

      return {
        campaignId: campaign.id,
        currentBid,
        recommendedBid: Math.round(recommendedBid * 100) / 100, // Round to cents
        confidence,
        reason: this.generateRecommendationReason(optimizationScore, bidMultiplier),
        expectedImpact
      };

    } catch (error) {
      console.error(`Error generating bid recommendation for ${campaign.id}:`, error);
      return null;
    }
  }

  /**
   * Calculate performance score from features
   */
  private calculatePerformanceScore(features: FeatureVector): number {
    const conversionRate = features.historicalCtr || 0; // Use historical CTR as proxy
    const ctr = features.historicalCtr || 0;
    const roas = features.historicalRoas || 0;

    // Normalize scores (0-1 range)
    const conversionScore = Math.min(conversionRate * 20, 1); // 5% = 1.0
    const ctrScore = Math.min(ctr * 10, 1); // 10% = 1.0
    const roasScore = Math.min(roas / 4, 1); // ROAS of 4 = 1.0

    return (conversionScore + ctrScore + roasScore) / 3;
  }

  /**
   * Calculate market conditions score
   */
  private calculateMarketScore(features: FeatureVector): number {
    const impressionShare = features.competitiveIndex || 0.5; // Use competitive index as proxy
    const avgPosition = 3.0; // Default average position
    const competitorActivity = features.competitiveIndex || 0.5;

    // Higher impression share = good
    const shareScore = impressionShare;
    
    // Lower average position = better (position 1 is best)
    const positionScore = Math.max(0, (6 - avgPosition) / 5);
    
    // Moderate competition is optimal
    const competitionScore = 1 - Math.abs(0.6 - competitorActivity);

    return (shareScore + positionScore + competitionScore) / 3;
  }

  /**
   * Calculate competition intensity score
   */
  private calculateCompetitionScore(features: FeatureVector): number {
    const cpc = features.historicalCpa || features.currentBid || 1.0; // Use historical CPA as CPC proxy
    const competitorBids: [number, number] = [cpc * 0.8, cpc * 1.5]; // Estimate range
    const marketCpc = cpc * 1.1; // Estimate market average

    // How competitive our current bid is
    const bidCompetitiveness = competitorBids[1] > 0 ? 
      Math.min(cpc / competitorBids[1], 1) : 0.5;

    // How we compare to market average
    const marketComparison = marketCpc > 0 ? 
      Math.min(cpc / marketCpc, 2) / 2 : 0.5;

    return (bidCompetitiveness + marketComparison) / 2;
  }

  /**
   * Calculate recommendation confidence
   */
  private calculateConfidence(features: FeatureVector, optimizationScore: number): number {
    const dataQuality = 0.8; // Default data quality score
    const sampleSize = Math.min(1000 / 10000, 1); // Estimate sample size
    const scoreReliability = 1 - Math.abs(0.5 - optimizationScore);

    return (dataQuality + sampleSize + scoreReliability) / 3;
  }

  /**
   * Calculate expected impact of bid change
   */
  private calculateExpectedImpact(
    currentBid: number,
    recommendedBid: number,
    features: FeatureVector
  ) {
    const bidRatio = recommendedBid / currentBid;
    const currentImpressions = 1000; // Default estimate
    const currentClicks = currentImpressions * (features.historicalCtr || 0.02); // Estimate clicks from CTR
    const currentConversions = currentClicks * 0.05; // Estimate 5% conversion rate

    // Estimate impact using elasticity models
    const impressionElasticity = 0.7; // 70% of bid increase translates to impression increase
    const clickElasticity = 0.8; // Clicks are more sensitive to position changes
    const conversionElasticity = 0.9; // Conversions closely follow click changes

    return {
      impressions: Math.round(currentImpressions * (Math.pow(bidRatio, impressionElasticity) - 1)),
      clicks: Math.round(currentClicks * (Math.pow(bidRatio, clickElasticity) - 1)),
      conversions: Math.round(currentConversions * (Math.pow(bidRatio, conversionElasticity) - 1)),
      costChange: (recommendedBid - currentBid) * (currentClicks || 0)
    };
  }

  /**
   * Generate human-readable recommendation reason
   */
  private generateRecommendationReason(optimizationScore: number, bidMultiplier: number): string {
    if (bidMultiplier > 1.1) {
      return `Strong performance metrics suggest increasing bid by ${Math.round((bidMultiplier - 1) * 100)}% to capture more impressions and conversions`;
    } else if (bidMultiplier < 0.9) {
      return `Performance below expectations suggests decreasing bid by ${Math.round((1 - bidMultiplier) * 100)}% to improve efficiency`;
    } else if (bidMultiplier > 1.0) {
      return `Moderate performance improvement opportunity with ${Math.round((bidMultiplier - 1) * 100)}% bid increase`;
    } else {
      return `Small efficiency gain possible with ${Math.round((1 - bidMultiplier) * 100)}% bid reduction`;
    }
  }

  /**
   * Summarize all recommendations
   */
  private summarizeRecommendations(recommendations: BidRecommendation[]): BidOptimizationResult {
    if (recommendations.length === 0) {
      return {
        totalRecommendations: 0,
        totalEstimatedImprovement: 0,
        recommendations: [],
        summary: {
          avgConfidence: 0,
          totalCostImpact: 0,
          totalConversionImpact: 0
        }
      };
    }

    const totalCostImpact = recommendations.reduce((sum, rec) => 
      sum + rec.expectedImpact.costChange, 0);
    
    const totalConversionImpact = recommendations.reduce((sum, rec) => 
      sum + rec.expectedImpact.conversions, 0);
    
    const avgConfidence = recommendations.reduce((sum, rec) => 
      sum + rec.confidence, 0) / recommendations.length;

    // Estimate overall improvement as conversion value minus cost increase
    const avgConversionValue = 50; // Assume $50 per conversion
    const totalEstimatedImprovement = (totalConversionImpact * avgConversionValue) - totalCostImpact;

    return {
      totalRecommendations: recommendations.length,
      totalEstimatedImprovement,
      recommendations,
      summary: {
        avgConfidence: Math.round(avgConfidence * 100) / 100,
        totalCostImpact: Math.round(totalCostImpact * 100) / 100,
        totalConversionImpact
      }
    };
  }
}

export default BidOptimizer;