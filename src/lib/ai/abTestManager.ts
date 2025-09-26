import { UnifiedCampaign } from '@/lib/platforms/base';
import { FeatureVector } from './mlOptimizationEngine';

interface ABTestConfig {
  id: string;
  name: string;
  description: string;
  testType: 'bid_strategy' | 'ad_creative' | 'targeting' | 'landing_page' | 'budget_allocation';
  duration: number; // days
  trafficSplit: number; // 0-1, percentage for variant
  variants: ABTestVariant[];
  successMetric: 'ctr' | 'cpa' | 'roas' | 'conversions';
  minimumSampleSize: number;
  significanceLevel: number; // 0.01, 0.05, 0.10
}

interface ABTestVariant {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
  campaignIds: string[];
}

interface ABTestResult {
  testId: string;
  status: 'running' | 'completed' | 'stopped' | 'inconclusive';
  startDate: Date;
  endDate?: Date;
  variants: ABTestVariantResult[];
  winner?: string;
  confidence: number;
  pValue?: number;
  effect: number; // percentage improvement
  recommendation: string;
  significantDifference: boolean;
}

interface ABTestVariantResult {
  variantId: string;
  name: string;
  sampleSize: number;
  conversions: number;
  conversionRate: number;
  cost: number;
  cpa: number;
  roas: number;
  confidence_interval: [number, number];
}

interface ABTestSuggestion {
  priority: 'high' | 'medium' | 'low';
  testType: ABTestConfig['testType'];
  title: string;
  description: string;
  expectedImpact: number;
  confidence: number;
  estimatedDuration: number;
  suggestedConfig: Partial<ABTestConfig>;
}

/**
 * Manages A/B testing for campaign optimization
 * Extracted from MLOptimizationEngine God Object for single responsibility
 */
export class ABTestManager {
  private activeTests: Map<string, ABTestConfig> = new Map();
  private testResults: Map<string, ABTestResult> = new Map();
  private testHistory: ABTestResult[] = [];

  /**
   * Suggest A/B tests based on campaign performance
   */
  async suggestABTests(
    campaigns: UnifiedCampaign[],
    features: FeatureVector[]
  ): Promise<ABTestSuggestion[]> {
    const suggestions: ABTestSuggestion[] = [];

    for (let i = 0; i < campaigns.length; i++) {
      const campaign = campaigns[i];
      const campaignFeatures = features[i];
      
      if (!campaignFeatures) continue;

      // Analyze campaign for test opportunities
      suggestions.push(...this.analyzeBidOpportunities(campaign, campaignFeatures));
      suggestions.push(...this.analyzeCreativeOpportunities(campaign, campaignFeatures));
      suggestions.push(...this.analyzeTargetingOpportunities(campaign, campaignFeatures));
      suggestions.push(...this.analyzeBudgetOpportunities(campaign, campaignFeatures));
    }

    // Sort by priority and expected impact
    return suggestions
      .sort((a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        return priorityDiff !== 0 ? priorityDiff : b.expectedImpact - a.expectedImpact;
      })
      .slice(0, 5); // Return top 5 suggestions
  }

  /**
   * Create and start an A/B test
   */
  async createABTest(config: ABTestConfig): Promise<string> {
    // Validate configuration
    this.validateTestConfig(config);

    // Store test configuration
    this.activeTests.set(config.id, config);

    // Initialize test result tracking
    const testResult: ABTestResult = {
      testId: config.id,
      status: 'running',
      startDate: new Date(),
      variants: config.variants.map(variant => ({
        variantId: variant.id,
        name: variant.name,
        sampleSize: 0,
        conversions: 0,
        conversionRate: 0,
        cost: 0,
        cpa: 0,
        roas: 0,
        confidence_interval: [0, 0]
      })),
      confidence: 0,
      effect: 0,
      recommendation: 'Test in progress',
      significantDifference: false
    };

    this.testResults.set(config.id, testResult);

    return config.id;
  }

  /**
   * Update A/B test with new performance data
   */
  async updateABTest(
    testId: string, 
    variantId: string, 
    metrics: {
      impressions?: number;
      clicks?: number;
      conversions?: number;
      cost?: number;
    }
  ): Promise<void> {
    const testResult = this.testResults.get(testId);
    const testConfig = this.activeTests.get(testId);
    
    if (!testResult || !testConfig) return;

    // Find variant result
    const variantResult = testResult.variants.find(v => v.variantId === variantId);
    if (!variantResult) return;

    // Update metrics
    if (metrics.impressions) variantResult.sampleSize += metrics.impressions;
    if (metrics.conversions) {
      variantResult.conversions += metrics.conversions;
      variantResult.conversionRate = variantResult.conversions / variantResult.sampleSize;
    }
    if (metrics.cost) {
      variantResult.cost += metrics.cost;
      variantResult.cpa = variantResult.conversions > 0 ? 
        variantResult.cost / variantResult.conversions : 0;
      variantResult.roas = variantResult.cost > 0 ? 
        (variantResult.conversions * 50) / variantResult.cost : 0; // Assume $50 per conversion
    }

    // Check if test is ready for analysis
    await this.analyzeABTest(testId);
  }

  /**
   * Analyze A/B test results for statistical significance
   */
  async analyzeABTest(testId: string): Promise<ABTestResult | null> {
    const testResult = this.testResults.get(testId);
    const testConfig = this.activeTests.get(testId);
    
    if (!testResult || !testConfig || testResult.status !== 'running') return null;

    const variants = testResult.variants;
    if (variants.length !== 2) return null; // Currently only support 2-variant tests

    const [control, treatment] = variants;
    
    // Check minimum sample size
    const hasMinSample = control.sampleSize >= testConfig.minimumSampleSize && 
                        treatment.sampleSize >= testConfig.minimumSampleSize;
    
    if (!hasMinSample) return testResult;

    // Calculate statistical significance
    const significance = this.calculateSignificance(control, treatment, testConfig.successMetric);
    
    testResult.confidence = significance.confidence;
    testResult.pValue = significance.pValue;
    testResult.significantDifference = significance.pValue < testConfig.significanceLevel;

    // Calculate effect size
    const controlMetric = this.getMetricValue(control, testConfig.successMetric);
    const treatmentMetric = this.getMetricValue(treatment, testConfig.successMetric);
    testResult.effect = ((treatmentMetric - controlMetric) / controlMetric) * 100;

    // Determine winner and recommendation
    if (testResult.significantDifference) {
      testResult.winner = treatmentMetric > controlMetric ? treatment.variantId : control.variantId;
      testResult.recommendation = this.generateRecommendation(testResult, testConfig);
      testResult.status = 'completed';
      
      // Move to history
      this.testHistory.push({ ...testResult, endDate: new Date() });
      this.activeTests.delete(testId);
    } else {
      // Check if test should continue or be stopped
      const testDuration = (Date.now() - testResult.startDate.getTime()) / (1000 * 60 * 60 * 24);
      if (testDuration > testConfig.duration) {
        testResult.status = 'inconclusive';
        testResult.recommendation = 'No significant difference found. Consider extending test duration or increasing sample size.';
        testResult.endDate = new Date();
        
        this.testHistory.push({ ...testResult });
        this.activeTests.delete(testId);
      }
    }

    return testResult;
  }

  /**
   * Get all active A/B tests
   */
  getActiveTests(): ABTestResult[] {
    return Array.from(this.testResults.values()).filter(test => test.status === 'running');
  }

  /**
   * Get A/B test history
   */
  getTestHistory(): ABTestResult[] {
    return [...this.testHistory].sort((a, b) => 
      new Date(b.endDate || b.startDate).getTime() - new Date(a.endDate || a.startDate).getTime()
    );
  }

  /**
   * Analyze bid strategy opportunities
   */
  private analyzeBidOpportunities(
    campaign: UnifiedCampaign, 
    features: FeatureVector
  ): ABTestSuggestion[] {
    const suggestions: ABTestSuggestion[] = [];

    // Check for bid optimization opportunity
    if (features.historicalCpa > 0 && features.recentTrend < -0.2) {
      suggestions.push({
        priority: 'high',
        testType: 'bid_strategy',
        title: 'Optimize Bid Strategy',
        description: 'Test automated bidding vs manual bidding to improve performance',
        expectedImpact: 15,
        confidence: 0.75,
        estimatedDuration: 14,
        suggestedConfig: {
          testType: 'bid_strategy',
          duration: 14,
          trafficSplit: 0.5,
          successMetric: 'cpa',
          minimumSampleSize: 1000,
          significanceLevel: 0.05
        }
      });
    }

    return suggestions;
  }

  /**
   * Analyze creative opportunities
   */
  private analyzeCreativeOpportunities(
    campaign: UnifiedCampaign, 
    features: FeatureVector
  ): ABTestSuggestion[] {
    const suggestions: ABTestSuggestion[] = [];

    // Check for creative fatigue
    if (features.historicalCtr < 0.02 && features.campaignAge > 30) {
      suggestions.push({
        priority: 'medium',
        testType: 'ad_creative',
        title: 'Test New Ad Creative',
        description: 'Campaign showing signs of creative fatigue. Test fresh creative concepts.',
        expectedImpact: 25,
        confidence: 0.65,
        estimatedDuration: 10,
        suggestedConfig: {
          testType: 'ad_creative',
          duration: 10,
          trafficSplit: 0.5,
          successMetric: 'ctr',
          minimumSampleSize: 500,
          significanceLevel: 0.05
        }
      });
    }

    return suggestions;
  }

  /**
   * Analyze targeting opportunities
   */
  private analyzeTargetingOpportunities(
    campaign: UnifiedCampaign, 
    features: FeatureVector
  ): ABTestSuggestion[] {
    const suggestions: ABTestSuggestion[] = [];

    // Check for targeting refinement opportunity
    if (features.competitiveIndex > 0.7 && features.historicalRoas < 2.0) {
      suggestions.push({
        priority: 'medium',
        testType: 'targeting',
        title: 'Refine Audience Targeting',
        description: 'High competition suggests opportunity for more precise targeting',
        expectedImpact: 20,
        confidence: 0.60,
        estimatedDuration: 21,
        suggestedConfig: {
          testType: 'targeting',
          duration: 21,
          trafficSplit: 0.5,
          successMetric: 'roas',
          minimumSampleSize: 800,
          significanceLevel: 0.05
        }
      });
    }

    return suggestions;
  }

  /**
   * Analyze budget allocation opportunities
   */
  private analyzeBudgetOpportunities(
    campaign: UnifiedCampaign, 
    features: FeatureVector
  ): ABTestSuggestion[] {
    const suggestions: ABTestSuggestion[] = [];

    // Check for budget optimization
    if (features.budgetUtilization < 0.8 && features.historicalRoas > 3.0) {
      suggestions.push({
        priority: 'low',
        testType: 'budget_allocation',
        title: 'Increase Budget Allocation',
        description: 'Strong ROAS with unused budget suggests scaling opportunity',
        expectedImpact: 30,
        confidence: 0.80,
        estimatedDuration: 14,
        suggestedConfig: {
          testType: 'budget_allocation',
          duration: 14,
          trafficSplit: 0.5,
          successMetric: 'conversions',
          minimumSampleSize: 1200,
          significanceLevel: 0.05
        }
      });
    }

    return suggestions;
  }

  /**
   * Calculate statistical significance between two variants
   */
  private calculateSignificance(
    control: ABTestVariantResult, 
    treatment: ABTestVariantResult, 
    metric: ABTestConfig['successMetric']
  ): { confidence: number; pValue: number } {
    // Simplified statistical calculation for demo
    // In production, use proper statistical libraries
    
    const controlValue = this.getMetricValue(control, metric);
    const treatmentValue = this.getMetricValue(treatment, metric);
    
    if (controlValue === 0 || treatmentValue === 0) {
      return { confidence: 0, pValue: 1 };
    }

    // Calculate relative difference
    const relativeDiff = Math.abs(treatmentValue - controlValue) / controlValue;
    
    // Calculate sample size factor
    const minSample = Math.min(control.sampleSize, treatment.sampleSize);
    const sampleFactor = Math.min(minSample / 1000, 1);
    
    // Simplified confidence calculation
    const confidence = Math.min(0.95, relativeDiff * sampleFactor);
    const pValue = 1 - confidence;
    
    return { confidence, pValue };
  }

  /**
   * Get metric value from variant result
   */
  private getMetricValue(variant: ABTestVariantResult, metric: ABTestConfig['successMetric']): number {
    switch (metric) {
      case 'ctr': return variant.conversionRate;
      case 'cpa': return variant.cpa;
      case 'roas': return variant.roas;
      case 'conversions': return variant.conversions;
      default: return 0;
    }
  }

  /**
   * Generate recommendation based on test results
   */
  private generateRecommendation(result: ABTestResult, config: ABTestConfig): string {
    const winnerVariant = result.variants.find(v => v.variantId === result.winner);
    const effect = Math.abs(result.effect);
    
    if (!winnerVariant) return 'Unable to determine winner';

    if (effect > 20) {
      return `Strong winner: ${winnerVariant.name} shows ${effect.toFixed(1)}% improvement. Implement immediately.`;
    } else if (effect > 10) {
      return `Clear winner: ${winnerVariant.name} shows ${effect.toFixed(1)}% improvement. Recommended for implementation.`;
    } else if (effect > 5) {
      return `Marginal winner: ${winnerVariant.name} shows ${effect.toFixed(1)}% improvement. Consider implementing with monitoring.`;
    } else {
      return `Small difference: ${winnerVariant.name} shows ${effect.toFixed(1)}% improvement. Monitor for consistency before implementing.`;
    }
  }

  /**
   * Validate A/B test configuration
   */
  private validateTestConfig(config: ABTestConfig): void {
    if (!config.id || !config.name) {
      throw new Error('Test ID and name are required');
    }
    
    if (config.variants.length < 2) {
      throw new Error('At least 2 variants are required for A/B testing');
    }
    
    if (config.trafficSplit < 0.1 || config.trafficSplit > 0.9) {
      throw new Error('Traffic split must be between 0.1 and 0.9');
    }
    
    if (config.duration < 3) {
      throw new Error('Test duration must be at least 3 days');
    }
  }
}

export default ABTestManager;