import { UnifiedCampaign } from '@/lib/platforms/base';
import { FeatureVector } from './mlOptimizationEngine';

interface AnomalyAlert {
  id: string;
  campaignId: string;
  type: 'performance' | 'spend' | 'volume' | 'quality' | 'competitive';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  detectedAt: Date;
  metric: string;
  currentValue: number;
  expectedValue: number;
  deviation: number; // Standard deviations from expected
  confidence: number;
  suggestedAction?: string;
  autoActionTaken?: boolean;
}

interface AnomalyDetectionResult {
  totalAnomalies: number;
  criticalCount: number;
  highCount: number;
  anomalies: AnomalyAlert[];
  summary: {
    mostCommonType: string;
    avgSeverity: string;
    autoActionsCount: number;
  };
}

interface AnomalyThresholds {
  performanceThreshold: number; // Standard deviations
  spendThreshold: number;
  volumeThreshold: number;
  qualityThreshold: number;
  competitiveThreshold: number;
  minDataPoints: number;
}

/**
 * Detects anomalies in campaign performance and spending patterns
 * Extracted from MLOptimizationEngine God Object for single responsibility
 */
export class AnomalyDetector {
  private thresholds: AnomalyThresholds = {
    performanceThreshold: 2.0, // 2 standard deviations
    spendThreshold: 2.5,
    volumeThreshold: 2.0,
    qualityThreshold: 1.8,
    competitiveThreshold: 2.2,
    minDataPoints: 7 // Need at least 7 days of data
  };

  private historicalData: Map<string, FeatureVector[]> = new Map();

  /**
   * Detect anomalies across all campaigns
   */
  async detectAnomalies(
    campaigns: UnifiedCampaign[],
    currentFeatures: FeatureVector[],
    customThresholds: Partial<AnomalyThresholds> = {}
  ): Promise<AnomalyDetectionResult> {
    const finalThresholds = { ...this.thresholds, ...customThresholds };
    const anomalies: AnomalyAlert[] = [];

    for (let i = 0; i < campaigns.length; i++) {
      const campaign = campaigns[i];
      const features = currentFeatures[i];
      
      if (!features) continue;

      const campaignAnomalies = await this.detectCampaignAnomalies(
        campaign,
        features,
        finalThresholds
      );

      anomalies.push(...campaignAnomalies);
    }

    return this.summarizeAnomalies(anomalies);
  }

  /**
   * Detect anomalies for a single campaign
   */
  private async detectCampaignAnomalies(
    campaign: UnifiedCampaign,
    currentFeatures: FeatureVector,
    thresholds: AnomalyThresholds
  ): Promise<AnomalyAlert[]> {
    const anomalies: AnomalyAlert[] = [];
    const historical = this.getHistoricalData(campaign.id);

    if (historical.length < thresholds.minDataPoints) {
      // Not enough historical data for reliable anomaly detection
      return anomalies;
    }

    // Check different types of anomalies
    anomalies.push(...this.detectPerformanceAnomalies(campaign, currentFeatures, historical, thresholds));
    anomalies.push(...this.detectSpendAnomalies(campaign, currentFeatures, historical, thresholds));
    anomalies.push(...this.detectVolumeAnomalies(campaign, currentFeatures, historical, thresholds));
    anomalies.push(...this.detectQualityAnomalies(campaign, currentFeatures, historical, thresholds));
    anomalies.push(...this.detectCompetitiveAnomalies(campaign, currentFeatures, historical, thresholds));

    return anomalies;
  }

  /**
   * Detect performance-related anomalies (CTR, CVR, ROAS)
   */
  private detectPerformanceAnomalies(
    campaign: UnifiedCampaign,
    current: FeatureVector,
    historical: FeatureVector[],
    thresholds: AnomalyThresholds
  ): AnomalyAlert[] {
    const anomalies: AnomalyAlert[] = [];

    // Historical CTR anomaly
    const ctrAnomaly = this.detectMetricAnomaly(
      'historicalCtr',
      current.historicalCtr || 0,
      historical,
      thresholds.performanceThreshold
    );

    if (ctrAnomaly) {
      anomalies.push({
        id: `ctr_${campaign.id}_${Date.now()}`,
        campaignId: campaign.id,
        type: 'performance',
        severity: this.calculateSeverity(ctrAnomaly.deviation),
        title: `Click-Through Rate ${ctrAnomaly.deviation > 0 ? 'Spike' : 'Drop'}`,
        description: `CTR is ${Math.abs(ctrAnomaly.deviation).toFixed(1)} standard deviations ${ctrAnomaly.deviation > 0 ? 'above' : 'below'} normal`,
        detectedAt: new Date(),
        metric: 'CTR',
        currentValue: ctrAnomaly.currentValue,
        expectedValue: ctrAnomaly.expectedValue,
        deviation: ctrAnomaly.deviation,
        confidence: ctrAnomaly.confidence,
        suggestedAction: ctrAnomaly.deviation < -2 ? 'Review ad creative and targeting' : 'Monitor for sustainability'
      });
    }

    // Historical ROAS anomaly (using as conversion proxy)
    const roasAnomaly = this.detectMetricAnomaly(
      'historicalRoas',
      current.historicalRoas || 0,
      historical,
      thresholds.performanceThreshold
    );

    if (roasAnomaly) {
      anomalies.push({
        id: `roas_${campaign.id}_${Date.now()}`,
        campaignId: campaign.id,
        type: 'performance',
        severity: this.calculateSeverity(roasAnomaly.deviation),
        title: `Return on Ad Spend ${roasAnomaly.deviation > 0 ? 'Improvement' : 'Decline'}`,
        description: `ROAS is ${Math.abs(roasAnomaly.deviation).toFixed(1)} standard deviations ${roasAnomaly.deviation > 0 ? 'above' : 'below'} normal`,
        detectedAt: new Date(),
        metric: 'ROAS',
        currentValue: roasAnomaly.currentValue,
        expectedValue: roasAnomaly.expectedValue,
        deviation: roasAnomaly.deviation,
        confidence: roasAnomaly.confidence,
        suggestedAction: roasAnomaly.deviation < -2 ? 'Check landing page and offer' : 'Identify success factors'
      });
    }

    return anomalies;
  }

  /**
   * Detect spending-related anomalies
   */
  private detectSpendAnomalies(
    campaign: UnifiedCampaign,
    current: FeatureVector,
    historical: FeatureVector[],
    thresholds: AnomalyThresholds
  ): AnomalyAlert[] {
    const anomalies: AnomalyAlert[] = [];

    // Budget utilization anomaly (as spending proxy)
    const budgetAnomaly = this.detectMetricAnomaly(
      'budgetUtilization',
      current.budgetUtilization || 0,
      historical,
      thresholds.spendThreshold
    );

    if (budgetAnomaly) {
      const isOverspend = budgetAnomaly.deviation > 0;
      anomalies.push({
        id: `budget_${campaign.id}_${Date.now()}`,
        campaignId: campaign.id,
        type: 'spend',
        severity: this.calculateSeverity(budgetAnomaly.deviation),
        title: `Budget Utilization ${isOverspend ? 'Exceeded' : 'Below'} Normal`,
        description: `Budget utilization is ${Math.abs(budgetAnomaly.deviation).toFixed(1)} standard deviations ${isOverspend ? 'above' : 'below'} expected`,
        detectedAt: new Date(),
        metric: 'Budget Utilization',
        currentValue: budgetAnomaly.currentValue,
        expectedValue: budgetAnomaly.expectedValue,
        deviation: budgetAnomaly.deviation,
        confidence: budgetAnomaly.confidence,
        suggestedAction: isOverspend ? 'Check bid strategy and competition' : 'Review budget allocation and bid levels',
        autoActionTaken: Math.abs(budgetAnomaly.deviation) > 3 // Auto-action for extreme cases
      });
    }

    // Current bid anomaly (as CPC proxy)
    const bidAnomaly = this.detectMetricAnomaly(
      'currentBid',
      current.currentBid || 0,
      historical,
      thresholds.spendThreshold
    );

    if (bidAnomaly) {
      anomalies.push({
        id: `bid_${campaign.id}_${Date.now()}`,
        campaignId: campaign.id,
        type: 'spend',
        severity: this.calculateSeverity(bidAnomaly.deviation),
        title: `Bid Level ${bidAnomaly.deviation > 0 ? 'Increase' : 'Decrease'}`,
        description: `Current bid is ${Math.abs(bidAnomaly.deviation).toFixed(1)} standard deviations ${bidAnomaly.deviation > 0 ? 'higher' : 'lower'} than expected`,
        detectedAt: new Date(),
        metric: 'Current Bid',
        currentValue: bidAnomaly.currentValue,
        expectedValue: bidAnomaly.expectedValue,
        deviation: bidAnomaly.deviation,
        confidence: bidAnomaly.confidence,
        suggestedAction: bidAnomaly.deviation > 2 ? 'Analyze competition and adjust bids' : 'Monitor trend continuation'
      });
    }

    return anomalies;
  }

  /**
   * Detect volume-related anomalies (impressions, clicks)
   */
  private detectVolumeAnomalies(
    campaign: UnifiedCampaign,
    current: FeatureVector,
    historical: FeatureVector[],
    thresholds: AnomalyThresholds
  ): AnomalyAlert[] {
    const anomalies: AnomalyAlert[] = [];

    // Competitive index anomaly (as impressions proxy)
    const competitiveAnomaly = this.detectMetricAnomaly(
      'competitiveIndex',
      current.competitiveIndex || 0,
      historical,
      thresholds.volumeThreshold
    );

    if (competitiveAnomaly) {
      const isHighCompetition = competitiveAnomaly.deviation > 0;
      anomalies.push({
        id: `competitive_${campaign.id}_${Date.now()}`,
        campaignId: campaign.id,
        type: 'volume',
        severity: this.calculateSeverity(competitiveAnomaly.deviation),
        title: `${isHighCompetition ? 'High' : 'Low'} Competition Detected`,
        description: `Competitive index is ${Math.abs(competitiveAnomaly.deviation).toFixed(1)} standard deviations ${isHighCompetition ? 'above' : 'below'} normal`,
        detectedAt: new Date(),
        metric: 'Competitive Index',
        currentValue: competitiveAnomaly.currentValue,
        expectedValue: competitiveAnomaly.expectedValue,
        deviation: competitiveAnomaly.deviation,
        confidence: competitiveAnomaly.confidence,
        suggestedAction: isHighCompetition ? 'Consider bid adjustments or targeting refinements' : 'Opportunity to increase market share'
      });
    }

    return anomalies;
  }

  /**
   * Detect quality-related anomalies
   */
  private detectQualityAnomalies(
    campaign: UnifiedCampaign,
    current: FeatureVector,
    historical: FeatureVector[],
    thresholds: AnomalyThresholds
  ): AnomalyAlert[] {
    const anomalies: AnomalyAlert[] = [];

    // Recent trend anomaly (as quality proxy)
    const trendAnomaly = this.detectMetricAnomaly(
      'recentTrend',
      current.recentTrend,
      historical,
      thresholds.qualityThreshold
    );

    if (trendAnomaly) {
      anomalies.push({
        id: `trend_${campaign.id}_${Date.now()}`,
        campaignId: campaign.id,
        type: 'quality',
        severity: this.calculateSeverity(Math.abs(trendAnomaly.deviation)),
        title: `Performance Trend ${trendAnomaly.deviation < 0 ? 'Decline' : 'Improvement'}`,
        description: `Recent performance trend changed by ${Math.abs(trendAnomaly.deviation).toFixed(1)} standard deviations`,
        detectedAt: new Date(),
        metric: 'Recent Trend',
        currentValue: trendAnomaly.currentValue,
        expectedValue: trendAnomaly.expectedValue,
        deviation: trendAnomaly.deviation,
        confidence: trendAnomaly.confidence,
        suggestedAction: trendAnomaly.deviation < -1.5 ? 'Review campaign performance factors' : 'Continue monitoring'
      });
    }

    return anomalies;
  }

  /**
   * Detect competitive anomalies
   */
  private detectCompetitiveAnomalies(
    campaign: UnifiedCampaign,
    current: FeatureVector,
    historical: FeatureVector[],
    thresholds: AnomalyThresholds
  ): AnomalyAlert[] {
    const anomalies: AnomalyAlert[] = [];

    // Market saturation anomaly (as competitive proxy)
    const marketAnomaly = this.detectMetricAnomaly(
      'marketSaturation',
      current.marketSaturation,
      historical,
      thresholds.competitiveThreshold
    );

    if (marketAnomaly) {
      anomalies.push({
        id: `market_${campaign.id}_${Date.now()}`,
        campaignId: campaign.id,
        type: 'competitive',
        severity: this.calculateSeverity(Math.abs(marketAnomaly.deviation)),
        title: `Market Saturation ${marketAnomaly.deviation > 0 ? 'Increase' : 'Decrease'}`,
        description: `Market saturation changed by ${Math.abs(marketAnomaly.deviation).toFixed(1)} standard deviations`,
        detectedAt: new Date(),
        metric: 'Market Saturation',
        currentValue: marketAnomaly.currentValue,
        expectedValue: marketAnomaly.expectedValue,
        deviation: marketAnomaly.deviation,
        confidence: marketAnomaly.confidence,
        suggestedAction: marketAnomaly.deviation > 2 ? 'Analyze market conditions and adjust strategy' : 'Monitor competitive landscape'
      });
    }

    return anomalies;
  }

  /**
   * Generic metric anomaly detection using statistical methods
   */
  private detectMetricAnomaly(
    metricName: keyof FeatureVector,
    currentValue: number,
    historical: FeatureVector[],
    threshold: number
  ): { currentValue: number; expectedValue: number; deviation: number; confidence: number } | null {
    // Get historical values for this metric
    const historicalValues = historical
      .map(f => f[metricName] as number)
      .filter(v => v !== undefined && v !== null && !isNaN(v));

    if (historicalValues.length < 3) return null;

    // Calculate statistical measures
    const mean = historicalValues.reduce((sum, val) => sum + val, 0) / historicalValues.length;
    const variance = historicalValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / historicalValues.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev === 0) return null; // No variation in historical data

    // Calculate z-score (how many standard deviations from mean)
    const zScore = (currentValue - mean) / stdDev;

    // Check if anomaly threshold is exceeded
    if (Math.abs(zScore) > threshold) {
      // Calculate confidence based on sample size and consistency
      const confidence = Math.min(
        0.95,
        0.5 + (historicalValues.length / 30) * 0.3 + (Math.abs(zScore) / 4) * 0.2
      );

      return {
        currentValue,
        expectedValue: mean,
        deviation: zScore,
        confidence
      };
    }

    return null;
  }

  /**
   * Calculate anomaly severity based on deviation
   */
  private calculateSeverity(deviation: number): 'low' | 'medium' | 'high' | 'critical' {
    const absDeviation = Math.abs(deviation);
    
    if (absDeviation >= 4) return 'critical';
    if (absDeviation >= 3) return 'high';
    if (absDeviation >= 2) return 'medium';
    return 'low';
  }

  /**
   * Add historical data point for a campaign
   */
  addHistoricalData(campaignId: string, features: FeatureVector): void {
    if (!this.historicalData.has(campaignId)) {
      this.historicalData.set(campaignId, []);
    }

    const history = this.historicalData.get(campaignId)!;
    history.push(features);

    // Keep only last 30 days of data
    if (history.length > 30) {
      history.shift();
    }
  }

  /**
   * Get historical data for a campaign
   */
  private getHistoricalData(campaignId: string): FeatureVector[] {
    return this.historicalData.get(campaignId) || [];
  }

  /**
   * Summarize all detected anomalies
   */
  private summarizeAnomalies(anomalies: AnomalyAlert[]): AnomalyDetectionResult {
    if (anomalies.length === 0) {
      return {
        totalAnomalies: 0,
        criticalCount: 0,
        highCount: 0,
        anomalies: [],
        summary: {
          mostCommonType: 'none',
          avgSeverity: 'low',
          autoActionsCount: 0
        }
      };
    }

    const criticalCount = anomalies.filter(a => a.severity === 'critical').length;
    const highCount = anomalies.filter(a => a.severity === 'high').length;
    const autoActionsCount = anomalies.filter(a => a.autoActionTaken).length;

    // Find most common anomaly type
    const typeCounts = anomalies.reduce((counts, anomaly) => {
      counts[anomaly.type] = (counts[anomaly.type] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);

    const mostCommonType = Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'performance';

    // Calculate average severity
    const severityScores = { low: 1, medium: 2, high: 3, critical: 4 };
    const avgSeverityScore = anomalies.reduce((sum, a) => 
      sum + severityScores[a.severity], 0) / anomalies.length;
    
    const avgSeverity = avgSeverityScore >= 3.5 ? 'critical' :
                       avgSeverityScore >= 2.5 ? 'high' :
                       avgSeverityScore >= 1.5 ? 'medium' : 'low';

    return {
      totalAnomalies: anomalies.length,
      criticalCount,
      highCount,
      anomalies: anomalies.sort((a, b) => 
        severityScores[b.severity] - severityScores[a.severity]
      ),
      summary: {
        mostCommonType,
        avgSeverity,
        autoActionsCount
      }
    };
  }
}

export default AnomalyDetector;