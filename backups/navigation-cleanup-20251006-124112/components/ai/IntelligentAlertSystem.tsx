/**
 * INTELLIGENT ALERT SYSTEM COMPONENT
 * Following ADVANCED_CODING_AI_DISSERTATION.md - AI Enhancement Protocol
 * 
 * AI-driven alert management with smart prioritization, pattern recognition,
 * predictive alerting, and intelligent clustering capabilities.
 */

'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { usePerformance, usePerformanceAnalytics } from '@/contexts/PerformanceContext';

// Alert System Types
interface SmartAlert {
  id: string;
  title: string;
  message: string;
  type: 'critical' | 'warning' | 'info' | 'success' | 'predictive';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category: 'performance' | 'budget' | 'campaign' | 'system' | 'opportunity' | 'anomaly';
  platform?: 'google_ads' | 'meta' | 'linkedin' | 'tiktok' | 'system';
  campaignId?: string;
  timestamp: number;
  severity: number; // 1-100 scale
  confidence: number; // AI confidence in alert accuracy
  aiGenerated: boolean;
  status: 'active' | 'acknowledged' | 'resolved' | 'dismissed';
  metadata: {
    source: string;
    affectedMetrics: string[];
    estimatedImpact: string;
    recommendedActions: string[];
    relatedAlerts: string[];
    patterns: string[];
    trends: string[];
  };
  clustering?: {
    clusterId: string;
    clusterSize: number;
    similarity: number;
  };
  predictions?: {
    likelihood: number;
    timeframe: string;
    preventable: boolean;
    actionWindow: number; // hours
  };
}

interface AlertCluster {
  id: string;
  name: string;
  description: string;
  alerts: SmartAlert[];
  priority: 'urgent' | 'high' | 'medium' | 'low';
  category: string;
  totalSeverity: number;
  affectedCampaigns: string[];
  createdAt: number;
  lastUpdated: number;
  pattern: {
    type: 'budget_depletion' | 'performance_decline' | 'anomaly_spike' | 'system_issue' | 'opportunity';
    confidence: number;
    frequency: string;
    predictability: number;
  };
}

interface AlertInsight {
  type: 'pattern' | 'recommendation' | 'prediction' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  relatedAlerts: string[];
  suggestedActions: string[];
}

interface IntelligentAlertSystemProps {
  className?: string;
  enablePredictiveAlerts?: boolean;
  enableSmartClustering?: boolean;
  alertRefreshInterval?: number;
  maxDisplayedAlerts?: number;
  onAlertAction?: (alertId: string, action: string) => void;
}

/**
 * AI-Powered Alert Intelligence Engine
 * 
 * ✅ INTELLIGENCE: Smart alert prioritization and clustering
 */
class AlertIntelligenceEngine {
  private historicalAlerts: SmartAlert[];
  private performanceData: any[];
  private patterns: Map<string, any>;
  
  constructor(historicalAlerts: SmartAlert[], performanceData: any[]) {
    this.historicalAlerts = historicalAlerts;
    this.performanceData = performanceData;
    this.patterns = new Map();
    this.analyzePatterns();
  }

  /**
   * Generate intelligent alerts based on AI analysis
   */
  generateSmartAlerts(currentData: any[]): SmartAlert[] {
    const alerts: SmartAlert[] = [];
    
    // Performance anomaly detection
    alerts.push(...this.detectPerformanceAnomalies(currentData));
    
    // Budget depletion predictions
    alerts.push(...this.predictBudgetDepletion(currentData));
    
    // Opportunity identification
    alerts.push(...this.identifyOpportunities(currentData));
    
    // System health monitoring
    alerts.push(...this.monitorSystemHealth(currentData));
    
    // Predictive issue alerts
    alerts.push(...this.generatePredictiveAlerts(currentData));
    
    // Prioritize and score alerts
    return this.prioritizeAlerts(alerts);
  }

  /**
   * Cluster related alerts using ML algorithms
   */
  clusterAlerts(alerts: SmartAlert[]): AlertCluster[] {
    const clusters: AlertCluster[] = [];
    const clusteredAlerts = new Set<string>();
    
    // Group by similarity patterns
    for (const alert of alerts) {
      if (clusteredAlerts.has(alert.id)) continue;
      
      const similarAlerts = this.findSimilarAlerts(alert, alerts);
      if (similarAlerts.length > 1) {
        const cluster = this.createAlertCluster(similarAlerts);
        clusters.push(cluster);
        similarAlerts.forEach(a => clusteredAlerts.add(a.id));
      }
    }
    
    // Add unclustered alerts as individual clusters
    for (const alert of alerts) {
      if (!clusteredAlerts.has(alert.id)) {
        clusters.push(this.createSingleAlertCluster(alert));
      }
    }
    
    return this.prioritizeClusters(clusters);
  }

  /**
   * Generate AI insights from alert patterns
   */
  generateAlertInsights(alerts: SmartAlert[], clusters: AlertCluster[]): AlertInsight[] {
    const insights: AlertInsight[] = [];
    
    // Pattern recognition insights
    insights.push(...this.analyzeAlertPatterns(alerts));
    
    // Optimization recommendations
    insights.push(...this.generateOptimizationInsights(clusters));
    
    // Predictive insights
    insights.push(...this.generatePredictiveInsights(alerts));
    
    // Performance improvement suggestions
    insights.push(...this.generatePerformanceInsights(alerts));
    
    return insights.sort((a, b) => (b.confidence * this.getImpactWeight(b.impact)) - 
                                   (a.confidence * this.getImpactWeight(a.impact)));
  }

  private detectPerformanceAnomalies(data: any[]): SmartAlert[] {
    const alerts: SmartAlert[] = [];
    
    // Simulate anomaly detection
    const campaigns = this.extractCampaignData(data);
    
    for (const campaign of campaigns) {
      // CTR anomaly detection
      if (campaign.ctr < campaign.historicalCTR * 0.7) {
        alerts.push({
          id: `anomaly-ctr-${campaign.id}-${Date.now()}`,
          title: 'CTR Performance Anomaly Detected',
          message: `Campaign "${campaign.name}" CTR dropped ${((1 - campaign.ctr/campaign.historicalCTR) * 100).toFixed(1)}% below historical average`,
          type: 'warning',
          priority: 'high',
          category: 'performance',
          platform: campaign.platform,
          campaignId: campaign.id,
          timestamp: Date.now(),
          severity: 75,
          confidence: 85,
          aiGenerated: true,
          status: 'active',
          metadata: {
            source: 'AI Anomaly Detection',
            affectedMetrics: ['CTR', 'Click Performance'],
            estimatedImpact: 'Reduced traffic and conversions',
            recommendedActions: [
              'Review ad creative performance',
              'Analyze audience targeting',
              'Check competitor activity',
              'Consider bid adjustments'
            ],
            relatedAlerts: [],
            patterns: ['performance_decline'],
            trends: ['decreasing_engagement']
          }
        });
      }
      
      // ROAS decline detection
      if (campaign.roas < campaign.targetROAS * 0.8) {
        alerts.push({
          id: `anomaly-roas-${campaign.id}-${Date.now()}`,
          title: 'ROAS Below Target Threshold',
          message: `Campaign "${campaign.name}" ROAS (${campaign.roas.toFixed(2)}) is ${((1 - campaign.roas/campaign.targetROAS) * 100).toFixed(1)}% below target`,
          type: 'critical',
          priority: 'urgent',
          category: 'performance',
          platform: campaign.platform,
          campaignId: campaign.id,
          timestamp: Date.now(),
          severity: 90,
          confidence: 92,
          aiGenerated: true,
          status: 'active',
          metadata: {
            source: 'AI Performance Monitor',
            affectedMetrics: ['ROAS', 'Revenue Efficiency'],
            estimatedImpact: 'Significant revenue loss',
            recommendedActions: [
              'Pause underperforming ad groups',
              'Optimize landing page conversion',
              'Adjust bid strategies',
              'Review attribution models'
            ],
            relatedAlerts: [],
            patterns: ['revenue_decline'],
            trends: ['efficiency_degradation']
          }
        });
      }
    }
    
    return alerts;
  }

  private predictBudgetDepletion(data: any[]): SmartAlert[] {
    const alerts: SmartAlert[] = [];
    const campaigns = this.extractCampaignData(data);
    
    for (const campaign of campaigns) {
      const dailySpend = campaign.spend / 30; // Approximate daily spend
      const remainingBudget = campaign.budget - campaign.spend;
      const daysRemaining = remainingBudget / dailySpend;
      
      if (daysRemaining < 3 && daysRemaining > 0) {
        const urgency = daysRemaining < 1 ? 'urgent' : 'high';
        const severity = daysRemaining < 1 ? 95 : 80;
        
        alerts.push({
          id: `budget-depletion-${campaign.id}-${Date.now()}`,
          title: 'Budget Depletion Warning',
          message: `Campaign "${campaign.name}" budget will be depleted in ${daysRemaining.toFixed(1)} days`,
          type: 'warning',
          priority: urgency,
          category: 'budget',
          platform: campaign.platform,
          campaignId: campaign.id,
          timestamp: Date.now(),
          severity,
          confidence: 88,
          aiGenerated: true,
          status: 'active',
          metadata: {
            source: 'AI Budget Predictor',
            affectedMetrics: ['Budget Utilization', 'Campaign Duration'],
            estimatedImpact: 'Campaign will pause automatically',
            recommendedActions: [
              'Increase campaign budget',
              'Optimize spend efficiency',
              'Adjust bid strategies',
              'Reallocate budget from underperforming campaigns'
            ],
            relatedAlerts: [],
            patterns: ['budget_depletion'],
            trends: ['accelerating_spend']
          },
          predictions: {
            likelihood: 95,
            timeframe: `${daysRemaining.toFixed(1)} days`,
            preventable: true,
            actionWindow: Math.max(1, daysRemaining * 24) // hours
          }
        });
      }
    }
    
    return alerts;
  }

  private identifyOpportunities(data: any[]): SmartAlert[] {
    const alerts: SmartAlert[] = [];
    const campaigns = this.extractCampaignData(data);
    
    for (const campaign of campaigns) {
      // High-performing campaign opportunity
      if (campaign.roas > campaign.targetROAS * 1.5 && campaign.budgetUtilization < 0.8) {
        alerts.push({
          id: `opportunity-scale-${campaign.id}-${Date.now()}`,
          title: 'Scaling Opportunity Identified',
          message: `Campaign "${campaign.name}" shows exceptional ROAS (${campaign.roas.toFixed(2)}) with available budget capacity`,
          type: 'success',
          priority: 'medium',
          category: 'opportunity',
          platform: campaign.platform,
          campaignId: campaign.id,
          timestamp: Date.now(),
          severity: 30, // Low severity for opportunities
          confidence: 82,
          aiGenerated: true,
          status: 'active',
          metadata: {
            source: 'AI Opportunity Scanner',
            affectedMetrics: ['ROAS', 'Budget Efficiency'],
            estimatedImpact: 'Potential revenue increase',
            recommendedActions: [
              'Increase campaign budget by 25-50%',
              'Expand successful ad groups',
              'Test additional audiences',
              'Scale winning creative variants'
            ],
            relatedAlerts: [],
            patterns: ['high_performance'],
            trends: ['efficiency_optimization']
          }
        });
      }
    }
    
    return alerts;
  }

  private monitorSystemHealth(data: any[]): SmartAlert[] {
    const alerts: SmartAlert[] = [];
    
    // Simulate system health metrics
    const systemMetrics = this.getSystemMetrics();
    
    if (systemMetrics.apiLatency > 2000) {
      alerts.push({
        id: `system-latency-${Date.now()}`,
        title: 'API Performance Degradation',
        message: `High API latency detected (${systemMetrics.apiLatency}ms). May affect data synchronization.`,
        type: 'warning',
        priority: 'medium',
        category: 'system',
        timestamp: Date.now(),
        severity: 60,
        confidence: 95,
        aiGenerated: true,
        status: 'active',
        metadata: {
          source: 'System Health Monitor',
          affectedMetrics: ['API Response Time', 'Data Sync'],
          estimatedImpact: 'Delayed campaign updates',
          recommendedActions: [
            'Check API endpoint status',
            'Verify network connectivity',
            'Review rate limiting',
            'Contact technical support if persistent'
          ],
          relatedAlerts: [],
          patterns: ['system_degradation'],
          trends: ['performance_decline']
        }
      });
    }
    
    return alerts;
  }

  private generatePredictiveAlerts(data: any[]): SmartAlert[] {
    const alerts: SmartAlert[] = [];
    const campaigns = this.extractCampaignData(data);
    
    // Predict potential issues based on trends
    for (const campaign of campaigns) {
      const trend = this.analyzeCampaignTrend(campaign);
      
      if (trend.direction === 'declining' && trend.confidence > 0.7) {
        alerts.push({
          id: `predictive-decline-${campaign.id}-${Date.now()}`,
          title: 'Predicted Performance Decline',
          message: `AI predicts ${trend.severity}% performance decline for "${campaign.name}" within ${trend.timeframe}`,
          type: 'predictive',
          priority: 'medium',
          category: 'performance',
          platform: campaign.platform,
          campaignId: campaign.id,
          timestamp: Date.now(),
          severity: 65,
          confidence: Math.round(trend.confidence * 100),
          aiGenerated: true,
          status: 'active',
          metadata: {
            source: 'AI Predictive Engine',
            affectedMetrics: ['Overall Performance'],
            estimatedImpact: `${trend.severity}% performance reduction`,
            recommendedActions: [
              'Review recent changes',
              'Prepare optimization strategies',
              'Monitor closely for early intervention',
              'Consider preemptive adjustments'
            ],
            relatedAlerts: [],
            patterns: ['predictive_decline'],
            trends: ['early_warning']
          },
          predictions: {
            likelihood: Math.round(trend.confidence * 100),
            timeframe: trend.timeframe,
            preventable: true,
            actionWindow: 48 // hours
          }
        });
      }
    }
    
    return alerts;
  }

  private prioritizeAlerts(alerts: SmartAlert[]): SmartAlert[] {
    return alerts.sort((a, b) => {
      // Priority weight
      const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
      const priorityScore = priorityWeight[b.priority] - priorityWeight[a.priority];
      
      if (priorityScore !== 0) return priorityScore;
      
      // Confidence and severity combination
      const aScore = a.confidence * (a.severity / 100);
      const bScore = b.confidence * (b.severity / 100);
      
      return bScore - aScore;
    });
  }

  private findSimilarAlerts(targetAlert: SmartAlert, alerts: SmartAlert[]): SmartAlert[] {
    const similar = [targetAlert];
    
    for (const alert of alerts) {
      if (alert.id === targetAlert.id) continue;
      
      const similarity = this.calculateAlertSimilarity(targetAlert, alert);
      if (similarity > 0.7) {
        similar.push(alert);
        // Add clustering metadata
        alert.clustering = {
          clusterId: `cluster-${targetAlert.id.split('-')[0]}`,
          clusterSize: 0, // Will be updated
          similarity
        };
      }
    }
    
    // Update cluster size
    similar.forEach(alert => {
      if (alert.clustering) {
        alert.clustering.clusterSize = similar.length;
      }
    });
    
    return similar;
  }

  private calculateAlertSimilarity(alert1: SmartAlert, alert2: SmartAlert): number {
    let similarity = 0;
    let factors = 0;
    
    // Category similarity
    if (alert1.category === alert2.category) similarity += 0.3;
    factors += 0.3;
    
    // Platform similarity
    if (alert1.platform === alert2.platform) similarity += 0.2;
    factors += 0.2;
    
    // Campaign similarity
    if (alert1.campaignId === alert2.campaignId) similarity += 0.2;
    factors += 0.2;
    
    // Type similarity
    if (alert1.type === alert2.type) similarity += 0.15;
    factors += 0.15;
    
    // Pattern similarity
    const commonPatterns = alert1.metadata.patterns.filter(p => 
      alert2.metadata.patterns.includes(p)
    );
    if (commonPatterns.length > 0) similarity += 0.15;
    factors += 0.15;
    
    return factors > 0 ? similarity / factors : 0;
  }

  private createAlertCluster(alerts: SmartAlert[]): AlertCluster {
    const categories = [...new Set(alerts.map(a => a.category))];
    const platforms = [...new Set(alerts.map(a => a.platform).filter(p => p))];
    const campaigns = [...new Set(alerts.map(a => a.campaignId).filter(c => c))];
    
    const highestPriority = alerts.reduce((highest, alert) => {
      const priorities = { urgent: 4, high: 3, medium: 2, low: 1 };
      return priorities[alert.priority] > priorities[highest.priority] ? alert : highest;
    });
    
    const totalSeverity = alerts.reduce((sum, alert) => sum + alert.severity, 0);
    const avgConfidence = alerts.reduce((sum, alert) => sum + alert.confidence, 0) / alerts.length;
    
    return {
      id: `cluster-${Date.now()}-${alerts.length}`,
      name: this.generateClusterName(alerts),
      description: this.generateClusterDescription(alerts),
      alerts,
      priority: highestPriority.priority,
      category: categories[0], // Primary category
      totalSeverity,
      affectedCampaigns: campaigns as string[],
      createdAt: Date.now(),
      lastUpdated: Date.now(),
      pattern: {
        type: this.detectClusterPattern(alerts),
        confidence: avgConfidence,
        frequency: this.calculateFrequency(alerts),
        predictability: this.calculatePredictability(alerts)
      }
    };
  }

  private createSingleAlertCluster(alert: SmartAlert): AlertCluster {
    return {
      id: `single-cluster-${alert.id}`,
      name: alert.title,
      description: alert.message,
      alerts: [alert],
      priority: alert.priority,
      category: alert.category,
      totalSeverity: alert.severity,
      affectedCampaigns: alert.campaignId ? [alert.campaignId] : [],
      createdAt: alert.timestamp,
      lastUpdated: alert.timestamp,
      pattern: {
        type: this.getPatternFromAlert(alert),
        confidence: alert.confidence,
        frequency: 'single',
        predictability: alert.aiGenerated ? 75 : 50
      }
    };
  }

  private prioritizeClusters(clusters: AlertCluster[]): AlertCluster[] {
    return clusters.sort((a, b) => {
      const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      
      // Consider total severity and cluster size
      const aScore = a.totalSeverity * Math.log(a.alerts.length + 1);
      const bScore = b.totalSeverity * Math.log(b.alerts.length + 1);
      
      return bScore - aScore;
    });
  }

  // Helper methods for data extraction and analysis
  private extractCampaignData(data: any[]) {
    // Simulate campaign data extraction
    return [
      {
        id: 'camp-001',
        name: 'Q4 Holiday Campaign',
        platform: 'google_ads' as const,
        ctr: 0.025,
        historicalCTR: 0.035,
        roas: 2.1,
        targetROAS: 3.0,
        spend: 1800,
        budget: 2500,
        budgetUtilization: 0.72
      },
      {
        id: 'camp-002',
        name: 'Brand Awareness Drive',
        platform: 'meta' as const,
        ctr: 0.042,
        historicalCTR: 0.038,
        roas: 4.2,
        targetROAS: 2.8,
        spend: 950,
        budget: 1500,
        budgetUtilization: 0.63
      }
    ];
  }

  private getSystemMetrics() {
    return {
      apiLatency: 800 + Math.random() * 2000,
      cpuUsage: 60 + Math.random() * 30,
      memoryUsage: 70 + Math.random() * 20,
      errorRate: Math.random() * 5
    };
  }

  private analyzeCampaignTrend(campaign: any) {
    // Simulate trend analysis
    const scenarios = [
      { direction: 'growing', severity: 15, confidence: 0.8, timeframe: '7 days' },
      { direction: 'stable', severity: 5, confidence: 0.6, timeframe: '14 days' },
      { direction: 'declining', severity: 20, confidence: 0.75, timeframe: '5 days' }
    ];
    
    return scenarios[Math.floor(Math.random() * scenarios.length)];
  }

  private analyzePatterns() {
    // Initialize pattern analysis
    this.patterns.set('performance_decline', { frequency: 'weekly', impact: 'high' });
    this.patterns.set('budget_depletion', { frequency: 'monthly', impact: 'critical' });
    this.patterns.set('opportunity', { frequency: 'daily', impact: 'medium' });
  }

  private analyzeAlertPatterns(alerts: SmartAlert[]): AlertInsight[] {
    const insights: AlertInsight[] = [];
    
    // Pattern frequency analysis
    const patternCounts = new Map<string, number>();
    alerts.forEach(alert => {
      alert.metadata.patterns.forEach(pattern => {
        patternCounts.set(pattern, (patternCounts.get(pattern) || 0) + 1);
      });
    });
    
    patternCounts.forEach((count, pattern) => {
      if (count >= 2) {
        insights.push({
          type: 'pattern',
          title: `Recurring ${pattern.replace('_', ' ')} Pattern`,
          description: `Detected ${count} instances of ${pattern} pattern. This suggests systematic issues requiring attention.`,
          confidence: Math.min(95, 60 + count * 10),
          impact: count >= 3 ? 'high' : 'medium',
          actionable: true,
          relatedAlerts: alerts.filter(a => a.metadata.patterns.includes(pattern)).map(a => a.id),
          suggestedActions: this.getPatternActions(pattern)
        });
      }
    });
    
    return insights;
  }

  private generateOptimizationInsights(clusters: AlertCluster[]): AlertInsight[] {
    const insights: AlertInsight[] = [];
    
    const highPriorityClusters = clusters.filter(c => c.priority === 'urgent' || c.priority === 'high');
    
    if (highPriorityClusters.length > 0) {
      insights.push({
        type: 'optimization',
        title: 'Campaign Optimization Opportunity',
        description: `${highPriorityClusters.length} high-priority alert clusters indicate optimization opportunities across ${highPriorityClusters.reduce((sum, c) => sum + c.affectedCampaigns.length, 0)} campaigns.`,
        confidence: 85,
        impact: 'high',
        actionable: true,
        relatedAlerts: highPriorityClusters.flatMap(c => c.alerts.map(a => a.id)),
        suggestedActions: [
          'Review campaign performance systematically',
          'Implement automated bid adjustments',
          'Optimize budget allocation',
          'Test new creative variants'
        ]
      });
    }
    
    return insights;
  }

  private generatePredictiveInsights(alerts: SmartAlert[]): AlertInsight[] {
    const insights: AlertInsight[] = [];
    
    const predictiveAlerts = alerts.filter(a => a.type === 'predictive');
    
    if (predictiveAlerts.length > 0) {
      insights.push({
        type: 'prediction',
        title: 'Proactive Issue Prevention',
        description: `AI has identified ${predictiveAlerts.length} potential issues before they occur. Early intervention can prevent performance degradation.`,
        confidence: 80,
        impact: 'medium',
        actionable: true,
        relatedAlerts: predictiveAlerts.map(a => a.id),
        suggestedActions: [
          'Monitor predicted issues closely',
          'Prepare contingency plans',
          'Schedule proactive optimizations',
          'Set up additional monitoring'
        ]
      });
    }
    
    return insights;
  }

  private generatePerformanceInsights(alerts: SmartAlert[]): AlertInsight[] {
    const insights: AlertInsight[] = [];
    
    const performanceAlerts = alerts.filter(a => a.category === 'performance');
    const avgSeverity = performanceAlerts.reduce((sum, a) => sum + a.severity, 0) / performanceAlerts.length;
    
    if (performanceAlerts.length > 0 && avgSeverity > 70) {
      insights.push({
        type: 'recommendation',
        title: 'Performance Improvement Strategy',
        description: `${performanceAlerts.length} performance alerts with average severity ${avgSeverity.toFixed(1)} suggest systematic performance issues requiring strategic intervention.`,
        confidence: 88,
        impact: 'high',
        actionable: true,
        relatedAlerts: performanceAlerts.map(a => a.id),
        suggestedActions: [
          'Conduct comprehensive performance audit',
          'Implement A/B testing framework',
          'Review and optimize landing pages',
          'Analyze competitor strategies'
        ]
      });
    }
    
    return insights;
  }

  // Utility methods
  private getImpactWeight(impact: string): number {
    const weights = { high: 3, medium: 2, low: 1 };
    return weights[impact as keyof typeof weights] || 1;
  }

  private generateClusterName(alerts: SmartAlert[]): string {
    const categories = alerts.map(a => a.category);
    const platforms = alerts.map(a => a.platform).filter(p => p);
    
    const primaryCategory = this.getMostCommon(categories);
    const primaryPlatform = this.getMostCommon(platforms);
    
    return `${primaryCategory.charAt(0).toUpperCase() + primaryCategory.slice(1)} Issues${primaryPlatform ? ` - ${primaryPlatform.toUpperCase()}` : ''} (${alerts.length})`;
  }

  private generateClusterDescription(alerts: SmartAlert[]): string {
    const categories = [...new Set(alerts.map(a => a.category))];
    const platforms = [...new Set(alerts.map(a => a.platform).filter(p => p))];
    
    return `Cluster of ${alerts.length} related alerts across ${categories.join(', ')} categories${platforms.length > 0 ? ` on ${platforms.join(', ')} platforms` : ''}`;
  }

  private detectClusterPattern(alerts: SmartAlert[]): 'budget_depletion' | 'performance_decline' | 'anomaly_spike' | 'system_issue' | 'opportunity' {
    const patterns = alerts.flatMap(a => a.metadata.patterns);
    const mostCommon = this.getMostCommon(patterns);
    
    const patternMap: { [key: string]: any } = {
      'performance_decline': 'performance_decline',
      'budget_depletion': 'budget_depletion',
      'revenue_decline': 'performance_decline',
      'system_degradation': 'system_issue',
      'high_performance': 'opportunity'
    };
    
    return patternMap[mostCommon] || 'anomaly_spike';
  }

  private calculateFrequency(alerts: SmartAlert[]): string {
    const timeSpan = Math.max(...alerts.map(a => a.timestamp)) - Math.min(...alerts.map(a => a.timestamp));
    const hours = timeSpan / (1000 * 60 * 60);
    
    if (hours < 24) return 'high';
    if (hours < 168) return 'weekly';
    return 'monthly';
  }

  private calculatePredictability(alerts: SmartAlert[]): number {
    const aiGenerated = alerts.filter(a => a.aiGenerated).length;
    const predictiveAlerts = alerts.filter(a => a.type === 'predictive').length;
    
    return Math.min(100, (aiGenerated / alerts.length) * 80 + (predictiveAlerts / alerts.length) * 20);
  }

  private getPatternFromAlert(alert: SmartAlert): 'budget_depletion' | 'performance_decline' | 'anomaly_spike' | 'system_issue' | 'opportunity' {
    if (alert.category === 'budget') return 'budget_depletion';
    if (alert.category === 'performance') return 'performance_decline';
    if (alert.category === 'system') return 'system_issue';
    if (alert.category === 'opportunity') return 'opportunity';
    return 'anomaly_spike';
  }

  private getPatternActions(pattern: string): string[] {
    const actionMap: { [key: string]: string[] } = {
      'performance_decline': [
        'Review campaign settings',
        'Optimize targeting parameters',
        'Test new creative variants',
        'Analyze competitor activity'
      ],
      'budget_depletion': [
        'Increase campaign budgets',
        'Optimize spend efficiency',
        'Reallocate budget from underperforming campaigns',
        'Implement automated bid strategies'
      ],
      'high_performance': [
        'Scale successful campaigns',
        'Expand to similar audiences',
        'Increase budget allocation',
        'Test creative variations'
      ]
    };
    
    return actionMap[pattern] || ['Monitor situation closely', 'Investigate root cause'];
  }

  private getMostCommon<T>(array: T[]): T {
    const counts = new Map<T, number>();
    array.forEach(item => counts.set(item, (counts.get(item) || 0) + 1));
    
    let mostCommon = array[0];
    let maxCount = 0;
    
    counts.forEach((count, item) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommon = item;
      }
    });
    
    return mostCommon;
  }
}

/**
 * Smart Alert Card Component
 * 
 * ✅ VISUALIZATION: Intelligent alert display with priority indicators
 */
const SmartAlertCard = React.memo(({ 
  alert,
  onAction
}: { 
  alert: SmartAlert;
  onAction: (alertId: string, action: string) => void;
}) => {
  const getTypeColor = (type: string) => {
    const colors = {
      critical: 'bg-red-50 border-red-200 text-red-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      success: 'bg-green-50 border-green-200 text-green-800',
      predictive: 'bg-purple-50 border-purple-200 text-purple-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-50 border-gray-200 text-gray-800';
  };

  const getPriorityIcon = (priority: string) => {
    const icons = {
      urgent: '🚨',
      high: '⚠️',
      medium: '🔔',
      low: 'ℹ️'
    };
    return icons[priority as keyof typeof icons] || '📋';
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      performance: '📊',
      budget: '💰',
      campaign: '🎯',
      system: '⚙️',
      opportunity: '🚀',
      anomaly: '🔍'
    };
    return icons[category as keyof typeof icons] || '📋';
  };

  return (
    <div className={`p-4 rounded-lg border ${getTypeColor(alert.type)} mb-3`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getPriorityIcon(alert.priority)}</span>
          <span className="text-lg">{getCategoryIcon(alert.category)}</span>
          <div>
            <h3 className="font-semibold text-sm">{alert.title}</h3>
            <div className="flex items-center space-x-2 text-xs opacity-75">
              <span className="uppercase">{alert.priority}</span>
              <span>•</span>
              <span>{alert.confidence}% confident</span>
              {alert.aiGenerated && (
                <>
                  <span>•</span>
                  <span className="bg-black/10 px-1 rounded">AI</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-xs text-right">
          <div>Severity: {alert.severity}/100</div>
          {alert.clustering && (
            <div className="mt-1">
              Cluster: {alert.clustering.clusterSize} alerts
            </div>
          )}
        </div>
      </div>

      <p className="text-sm mb-3 opacity-90">{alert.message}</p>

      {alert.metadata.estimatedImpact && (
        <div className="text-xs mb-3 p-2 bg-black/5 rounded">
          <strong>Impact:</strong> {alert.metadata.estimatedImpact}
        </div>
      )}

      {alert.predictions && (
        <div className="text-xs mb-3 p-2 bg-purple-100/50 rounded">
          <div className="font-medium">🔮 Prediction:</div>
          <div>{alert.predictions.likelihood}% likelihood in {alert.predictions.timeframe}</div>
          {alert.predictions.preventable && (
            <div>Preventable • Action window: {alert.predictions.actionWindow}h</div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-xs">
        <div className="text-gray-600 dark:text-gray-400">
          {new Date(alert.timestamp).toLocaleString()}
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onAction(alert.id, 'acknowledge')}
            className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Acknowledge
          </button>
          <button
            onClick={() => onAction(alert.id, 'resolve')}
            className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            Resolve
          </button>
        </div>
      </div>
    </div>
  );
});

SmartAlertCard.displayName = 'SmartAlertCard';

/**
 * Alert Cluster Component
 * 
 * ✅ CLUSTERING: Grouped alert visualization
 */
const AlertClusterCard = React.memo(({
  cluster,
  onExpand
}: {
  cluster: AlertCluster;
  onExpand: (clusterId: string) => void;
}) => {
  const getPriorityColor = (priority: string) => {
    const colors = {
      urgent: 'bg-red-100 border-red-300',
      high: 'bg-orange-100 border-orange-300',
      medium: 'bg-yellow-100 border-yellow-300',
      low: 'bg-blue-100 border-blue-300'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 border-gray-300';
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${getPriorityColor(cluster.priority)}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-bold text-lg">{cluster.name}</h3>
          <p className="text-sm text-gray-600">{cluster.description}</p>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold">{cluster.alerts.length}</div>
          <div className="text-xs uppercase">{cluster.priority}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
        <div>
          <strong>Total Severity:</strong> {cluster.totalSeverity}
        </div>
        <div>
          <strong>Campaigns:</strong> {cluster.affectedCampaigns.length}
        </div>
        <div>
          <strong>Pattern:</strong> {cluster.pattern.type.replace('_', ' ')}
        </div>
        <div>
          <strong>Confidence:</strong> {cluster.pattern.confidence.toFixed(1)}%
        </div>
      </div>

      <button
        onClick={() => onExpand(cluster.id)}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        View {cluster.alerts.length} Alert{cluster.alerts.length !== 1 ? 's' : ''}
      </button>
    </div>
  );
});

AlertClusterCard.displayName = 'AlertClusterCard';

/**
 * Alert Insights Component
 * 
 * ✅ INSIGHTS: AI-generated actionable insights
 */
const AlertInsightsPanel = React.memo(({ 
  insights
}: { 
  insights: AlertInsight[];
}) => {
  const getInsightIcon = (type: string) => {
    const icons = {
      pattern: '🔍',
      recommendation: '💡',
      prediction: '🔮',
      optimization: '⚡'
    };
    return icons[type as keyof typeof icons] || '📋';
  };

  const getImpactColor = (impact: string) => {
    const colors = {
      high: 'text-red-600',
      medium: 'text-yellow-600',
      low: 'text-green-600'
    };
    return colors[impact as keyof typeof colors] || 'text-gray-600';
  };

  return (
    <div className="space-y-4">
      {insights.map((insight, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xl">{getInsightIcon(insight.type)}</span>
              <h4 className="font-semibold">{insight.title}</h4>
            </div>
            <div className="text-sm">
              <span className={`font-medium ${getImpactColor(insight.impact)}`}>
                {insight.impact.toUpperCase()}
              </span>
              <span className="text-gray-500 ml-2">{insight.confidence}%</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {insight.description}
          </p>
          
          {insight.actionable && insight.suggestedActions.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
              <div className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                Suggested Actions:
              </div>
              <ul className="text-sm text-blue-700 dark:text-blue-300 list-disc list-inside space-y-1">
                {insight.suggestedActions.map((action, actionIndex) => (
                  <li key={actionIndex}>{action}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
});

AlertInsightsPanel.displayName = 'AlertInsightsPanel';

/**
 * Main Intelligent Alert System Component
 * 
 * ✅ INTELLIGENCE: Complete AI-powered alert management
 */
export default function IntelligentAlertSystem({
  className = '',
  enablePredictiveAlerts = true,
  enableSmartClustering = true,
  alertRefreshInterval = 60000, // 1 minute
  maxDisplayedAlerts = 20,
  onAlertAction
}: IntelligentAlertSystemProps) {
  const { current } = usePerformance();
  const { history, hasData } = usePerformanceAnalytics();
  
  const [alerts, setAlerts] = useState<SmartAlert[]>([]);
  const [clusters, setClusters] = useState<AlertCluster[]>([]);
  const [insights, setInsights] = useState<AlertInsight[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedCluster, setExpandedCluster] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'alerts' | 'clusters' | 'insights'>('alerts');

  // Generate intelligent alerts
  const generateAlerts = useCallback(async () => {
    setIsProcessing(true);
    
    try {
      const engine = new AlertIntelligenceEngine([], history || []);
      
      // Generate smart alerts
      const newAlerts = engine.generateSmartAlerts([current]);
      setAlerts(newAlerts.slice(0, maxDisplayedAlerts));
      
      // Generate clusters if enabled
      if (enableSmartClustering) {
        const newClusters = engine.clusterAlerts(newAlerts);
        setClusters(newClusters);
      }
      
      // Generate insights
      const newInsights = engine.generateAlertInsights(newAlerts, clusters);
      setInsights(newInsights.slice(0, 5)); // Top 5 insights
      
    } catch (error) {
      console.error('Alert generation error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [current, history, maxDisplayedAlerts, enableSmartClustering, clusters]);

  // Auto-refresh alerts
  useEffect(() => {
    if (!hasData) return;

    generateAlerts();
    
    const interval = setInterval(generateAlerts, alertRefreshInterval);
    return () => clearInterval(interval);
  }, [hasData, generateAlerts, alertRefreshInterval]);

  // Handle alert actions
  const handleAlertAction = useCallback((alertId: string, action: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: action === 'resolve' ? 'resolved' : 'acknowledged' }
        : alert
    ));
    
    onAlertAction?.(alertId, action);
  }, [onAlertAction]);

  const handleExpandCluster = useCallback((clusterId: string) => {
    setExpandedCluster(expandedCluster === clusterId ? null : clusterId);
  }, [expandedCluster]);

  // Get active alerts
  const activeAlerts = useMemo(() => 
    alerts.filter(alert => alert.status === 'active'), 
    [alerts]
  );

  const alertStats = useMemo(() => ({
    total: alerts.length,
    urgent: alerts.filter(a => a.priority === 'urgent').length,
    high: alerts.filter(a => a.priority === 'high').length,
    predictive: alerts.filter(a => a.type === 'predictive').length,
    opportunities: alerts.filter(a => a.category === 'opportunity').length
  }), [alerts]);

  if (!hasData) {
    return (
      <div className={`p-8 text-center ${className}`}>
        <div className="text-6xl mb-4">🔔</div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Intelligent Alerts Ready
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Start monitoring campaigns to enable AI-powered alert intelligence
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Alert System Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              🧠 Intelligent Alert System
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              AI-powered alert management with smart prioritization and predictive insights
            </p>
          </div>
          
          <button
            onClick={generateAlerts}
            disabled={isProcessing}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isProcessing
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {isProcessing ? '🔄 Processing...' : '🔔 Refresh Alerts'}
          </button>
        </div>
        
        {/* Alert Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {alertStats.total}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Total Alerts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {alertStats.urgent}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Urgent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {alertStats.high}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">High Priority</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {alertStats.predictive}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Predictive</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {alertStats.opportunities}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Opportunities</div>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex space-x-2">
        {['alerts', 'clusters', 'insights'].map(mode => (
          <button
            key={mode}
            onClick={() => setViewMode(mode as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
              viewMode === mode
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {mode}
            {mode === 'alerts' && ` (${activeAlerts.length})`}
            {mode === 'clusters' && ` (${clusters.length})`}
            {mode === 'insights' && ` (${insights.length})`}
          </button>
        ))}
      </div>

      {/* Content Based on View Mode */}
      {viewMode === 'alerts' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🔔 Active Alerts ({activeAlerts.length})
          </h3>
          {activeAlerts.length > 0 ? (
            <div className="space-y-3">
              {activeAlerts.map(alert => (
                <SmartAlertCard
                  key={alert.id}
                  alert={alert}
                  onAction={handleAlertAction}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">✅</div>
              <h4 className="font-semibold text-gray-900 dark:text-white">All Clear!</h4>
              <p className="text-gray-600 dark:text-gray-400">No active alerts at this time.</p>
            </div>
          )}
        </div>
      )}

      {viewMode === 'clusters' && enableSmartClustering && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🧩 Alert Clusters ({clusters.length})
          </h3>
          {clusters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clusters.map(cluster => (
                <AlertClusterCard
                  key={cluster.id}
                  cluster={cluster}
                  onExpand={handleExpandCluster}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🧩</div>
              <h4 className="font-semibold text-gray-900 dark:text-white">No Clusters Found</h4>
              <p className="text-gray-600 dark:text-gray-400">Alerts don't show clustering patterns yet.</p>
            </div>
          )}
        </div>
      )}

      {viewMode === 'insights' && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            💡 AI Insights ({insights.length})
          </h3>
          {insights.length > 0 ? (
            <AlertInsightsPanel insights={insights} />
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🤖</div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Generating Insights</h4>
              <p className="text-gray-600 dark:text-gray-400">AI is analyzing alert patterns to generate insights.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}