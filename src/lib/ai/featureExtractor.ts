/**
 * Feature Extraction Service - Handles campaign feature extraction
 * Extracted from MLOptimizationEngine to reduce complexity
 */

import { FeatureVector } from './mlOptimizationEngine';
import { UnifiedCampaign } from '@/lib/platforms/base';

export class FeatureExtractor {
  
  // ===== MAIN FEATURE EXTRACTION =====
  
  async extractFeatures(campaign: UnifiedCampaign): Promise<FeatureVector> {
    const now = new Date();
    
    return {
      // Time-based features
      ...this.extractTimeFeatures(now),
      
      // Campaign features
      ...this.extractCampaignFeatures(campaign),
      
      // Performance features (mock historical data)
      ...this.extractPerformanceFeatures(),
      
      // Market features
      ...this.extractMarketFeatures(now),
      
      // Cross-platform features
      ...this.extractCrossPlatformFeatures()
    };
  }

  // ===== TIME-BASED FEATURES =====

  private extractTimeFeatures(date: Date) {
    return {
      hourOfDay: date.getHours(),
      dayOfWeek: date.getDay(),
      dayOfMonth: date.getDate(),
      monthOfYear: date.getMonth(),
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
      isHoliday: this.isHoliday(date)
    };
  }

  private isHoliday(date: Date): boolean {
    // Simplified holiday detection
    const holidays = [
      '01-01', '07-04', '12-25', '11-23' // New Year, July 4th, Christmas, Thanksgiving
    ];
    const dateStr = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return holidays.includes(dateStr);
  }

  // ===== CAMPAIGN FEATURES =====

  private extractCampaignFeatures(campaign: UnifiedCampaign) {
    return {
      campaignAge: this.calculateCampaignAge(campaign),
      budgetUtilization: this.calculateBudgetUtilization(campaign),
      currentBid: this.extractCurrentBid(campaign),
      targetAudience: this.encodeTargetAudience(campaign.targeting || {}),
      adFormat: 'unknown' // UnifiedCampaign doesn't have type property
    };
  }

  private calculateCampaignAge(campaign: UnifiedCampaign): number {
    const createdDate = new Date(campaign.createdAt || Date.now());
    return Math.floor((Date.now() - createdDate.getTime()) / (24 * 60 * 60 * 1000));
  }

  private calculateBudgetUtilization(campaign: UnifiedCampaign): number {
    // In production, this would use real spend vs budget data
    // For now, return a reasonable mock value
    return Math.random() * 0.8 + 0.1; // Random between 0.1 and 0.9
  }

  private extractCurrentBid(campaign: UnifiedCampaign): number {
    return (typeof campaign.budget === 'object' ? campaign.budget.amount : campaign.budget) || 0;
  }

  private encodeTargetAudience(audience: any): string {
    // Simplified encoding - in production would use more sophisticated encoding
    return typeof audience === 'string' ? audience : 'general';
  }

  // ===== PERFORMANCE FEATURES =====

  private extractPerformanceFeatures() {
    // Mock historical data - in production would fetch from database
    return {
      historicalCtr: Math.random() * 0.05 + 0.01,
      historicalCpa: Math.random() * 100 + 20,
      historicalRoas: Math.random() * 3 + 1,
      recentTrend: (Math.random() - 0.5) * 2 // -1 to 1
    };
  }

  // ===== MARKET FEATURES =====

  private extractMarketFeatures(date: Date) {
    return {
      competitiveIndex: Math.random() * 100,
      seasonalityFactor: this.calculateSeasonality(date),
      marketSaturation: Math.random() * 100
    };
  }

  private calculateSeasonality(date: Date): number {
    // Simplified seasonality calculation
    const month = date.getMonth();
    const seasonalityMap = [60, 50, 70, 80, 85, 75, 65, 70, 80, 85, 95, 90]; // By month
    return seasonalityMap[month];
  }

  // ===== CROSS-PLATFORM FEATURES =====

  private extractCrossPlatformFeatures() {
    // Mock cross-platform data - in production would analyze account data
    return {
      crossPlatformSynergy: Math.random() * 100,
      audienceOverlap: Math.random() * 50,
      brandAwareness: Math.random() * 100
    };
  }

  // ===== ANOMALY DETECTION FEATURES =====

  extractAnomalyFeatures(metrics: any): number[] {
    return [
      metrics.ctr || 0,
      metrics.cpc || 0,
      metrics.cpa || 0,
      metrics.roas || 0,
      metrics.impressions || 0,
      metrics.clicks || 0,
      metrics.conversions || 0,
      metrics.spend || 0
    ];
  }

  // ===== UTILITY METHODS =====

  normalizeFeatures(features: number[]): number[] {
    // Simple min-max normalization
    const max = Math.max(...features);
    const min = Math.min(...features);
    const range = max - min;
    
    return features.map(f => range > 0 ? (f - min) / range : 0);
  }

  encodeState(features: FeatureVector): number[] {
    return [
      features.hourOfDay / 24,
      features.dayOfWeek / 7,
      features.budgetUtilization,
      features.historicalCtr * 100,
      features.historicalRoas / 5,
      features.competitiveIndex / 100,
      features.seasonalityFactor / 100
    ];
  }
}

export const featureExtractor = new FeatureExtractor();