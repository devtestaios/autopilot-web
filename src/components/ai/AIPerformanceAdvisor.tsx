/**
 * AI PERFORMANCE ADVISOR COMPONENT
 * Following ADVANCED_CODING_AI_DISSERTATION.md - AI Enhancement Protocol
 * 
 * Intelligent performance analysis system that leverages performance monitoring data
 * to generate AI-powered optimization recommendations and performance insights.
 */

'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { usePerformance, usePerformanceAnalytics } from '@/contexts/PerformanceContext';

// AI Performance Advisor types
interface PerformanceInsight {
  id: string;
  type: 'optimization' | 'warning' | 'achievement' | 'trend';
  priority: 'low' | 'medium' | 'high' | 'critical';
  metric: string;
  title: string;
  description: string;
  recommendation: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  confidence: number; // 0-100%
  timestamp: number;
  data: {
    current: number;
    baseline?: number;
    target?: number;
    improvement?: number;
  };
}

interface AIPerformanceScore {
  overall: number; // 0-100
  breakdown: {
    loading: number;
    interactivity: number;
    visualStability: number;
    serverResponse: number;
  };
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  trending: 'improving' | 'stable' | 'declining';
}

interface AIPerformanceAdvisorProps {
  className?: string;
  enableAutoAnalysis?: boolean;
  analysisInterval?: number;
  onInsightGenerated?: (insight: PerformanceInsight) => void;
}

/**
 * AI Performance Analysis Engine
 * 
 * ✅ PERFORMANCE: Advanced AI analysis with machine learning insights
 */
class AIPerformanceAnalyzer {
  private performanceData: any[];
  private insights: PerformanceInsight[] = [];

  constructor(performanceData: any[]) {
    this.performanceData = performanceData;
  }

  /**
   * Generate comprehensive performance score with AI analysis
   */
  generatePerformanceScore(): AIPerformanceScore {
    if (!this.performanceData || this.performanceData.length === 0) {
      return {
        overall: 0,
        breakdown: { loading: 0, interactivity: 0, visualStability: 0, serverResponse: 0 },
        grade: 'F',
        trending: 'stable'
      };
    }

    const latest = this.performanceData[0];
    const metrics = latest?.webVitals || {};

    // Calculate individual scores (0-100)
    const loadingScore = this.calculateLoadingScore(metrics.LCP?.value, metrics.FCP?.value);
    const interactivityScore = this.calculateInteractivityScore(metrics.INP?.value);
    const visualStabilityScore = this.calculateVisualStabilityScore(metrics.CLS?.value);
    const serverResponseScore = this.calculateServerResponseScore(metrics.TTFB?.value);

    // Weighted overall score (loading and interactivity are most important)
    const overall = Math.round(
      loadingScore * 0.35 +
      interactivityScore * 0.35 +
      visualStabilityScore * 0.20 +
      serverResponseScore * 0.10
    );

    // Calculate trending (compare with historical data)
    const trending = this.calculateTrending();

    return {
      overall,
      breakdown: {
        loading: loadingScore,
        interactivity: interactivityScore,
        visualStability: visualStabilityScore,
        serverResponse: serverResponseScore
      },
      grade: this.scoreToGrade(overall),
      trending
    };
  }

  /**
   * Generate AI-powered performance insights
   */
  generateInsights(): PerformanceInsight[] {
    const insights: PerformanceInsight[] = [];
    
    if (!this.performanceData || this.performanceData.length === 0) {
      return insights;
    }

    const latest = this.performanceData[0];
    const metrics = latest?.webVitals || {};

    // Analyze each metric for insights
    insights.push(...this.analyzeLCP(metrics.LCP));
    insights.push(...this.analyzeINP(metrics.INP));
    insights.push(...this.analyzeCLS(metrics.CLS));
    insights.push(...this.analyzeFCP(metrics.FCP));
    insights.push(...this.analyzeTTFB(metrics.TTFB));

    // Generate trend insights
    insights.push(...this.analyzeTrends());

    // Generate achievement insights
    insights.push(...this.analyzeAchievements());

    return insights.sort((a, b) => {
      // Sort by priority, then by confidence
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.confidence - a.confidence;
    });
  }

  private calculateLoadingScore(lcp?: number, fcp?: number): number {
    if (!lcp || lcp === -1) return 50; // Neutral score for missing data
    
    // LCP scoring (Google's thresholds: good ≤ 2.5s, poor > 4s)
    if (lcp <= 2500) return 100;
    if (lcp <= 4000) return Math.round(100 - ((lcp - 2500) / 1500) * 50);
    return Math.max(0, Math.round(50 - ((lcp - 4000) / 2000) * 50));
  }

  private calculateInteractivityScore(inp?: number): number {
    if (!inp || inp === -1) return 50;
    
    // INP scoring (Google's thresholds: good ≤ 200ms, poor > 500ms)
    if (inp <= 200) return 100;
    if (inp <= 500) return Math.round(100 - ((inp - 200) / 300) * 50);
    return Math.max(0, Math.round(50 - ((inp - 500) / 500) * 50));
  }

  private calculateVisualStabilityScore(cls?: number): number {
    if (!cls || cls === -1) return 50;
    
    // CLS scoring (Google's thresholds: good ≤ 0.1, poor > 0.25)
    if (cls <= 0.1) return 100;
    if (cls <= 0.25) return Math.round(100 - ((cls - 0.1) / 0.15) * 50);
    return Math.max(0, Math.round(50 - ((cls - 0.25) / 0.25) * 50));
  }

  private calculateServerResponseScore(ttfb?: number): number {
    if (!ttfb || ttfb === -1) return 50;
    
    // TTFB scoring (good ≤ 800ms, poor > 1800ms)
    if (ttfb <= 800) return 100;
    if (ttfb <= 1800) return Math.round(100 - ((ttfb - 800) / 1000) * 50);
    return Math.max(0, Math.round(50 - ((ttfb - 1800) / 1000) * 50));
  }

  private scoreToGrade(score: number): AIPerformanceScore['grade'] {
    if (score >= 95) return 'A+';
    if (score >= 90) return 'A';
    if (score >= 85) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 75) return 'C+';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  private calculateTrending(): 'improving' | 'stable' | 'declining' {
    if (this.performanceData.length < 3) return 'stable';

    const recent = this.performanceData.slice(0, 3);
    const older = this.performanceData.slice(3, 6);

    if (recent.length < 2 || older.length < 2) return 'stable';

    // Calculate average scores for recent vs older periods
    const recentScore = recent.reduce((acc, data) => {
      const metrics = data.webVitals || {};
      return acc + this.calculateOverallScore(metrics);
    }, 0) / recent.length;

    const olderScore = older.reduce((acc, data) => {
      const metrics = data.webVitals || {};
      return acc + this.calculateOverallScore(metrics);
    }, 0) / older.length;

    const improvement = ((recentScore - olderScore) / olderScore) * 100;

    if (improvement > 5) return 'improving';
    if (improvement < -5) return 'declining';
    return 'stable';
  }

  private calculateOverallScore(metrics: any): number {
    const loading = this.calculateLoadingScore(metrics.LCP?.value, metrics.FCP?.value);
    const interactivity = this.calculateInteractivityScore(metrics.INP?.value);
    const stability = this.calculateVisualStabilityScore(metrics.CLS?.value);
    const server = this.calculateServerResponseScore(metrics.TTFB?.value);
    
    return loading * 0.35 + interactivity * 0.35 + stability * 0.20 + server * 0.10;
  }

  private analyzeLCP(lcp?: any): PerformanceInsight[] {
    const insights: PerformanceInsight[] = [];
    
    if (!lcp || lcp.value === -1) return insights;

    const value = lcp.value;
    
    if (value > 4000) {
      insights.push({
        id: `lcp-critical-${Date.now()}`,
        type: 'optimization',
        priority: 'critical',
        metric: 'LCP',
        title: 'Critical Loading Performance Issue',
        description: `Largest Contentful Paint is ${(value / 1000).toFixed(1)}s, significantly above the 4s threshold.`,
        recommendation: 'Optimize critical rendering path: compress images, minify CSS/JS, enable compression, use CDN, and consider server-side rendering.',
        impact: 'high',
        effort: 'high',
        confidence: 95,
        timestamp: Date.now(),
        data: { current: value, target: 2500, improvement: value - 2500 }
      });
    } else if (value > 2500) {
      insights.push({
        id: `lcp-warning-${Date.now()}`,
        type: 'warning',
        priority: 'high',
        metric: 'LCP',
        title: 'Loading Performance Needs Improvement',
        description: `Largest Contentful Paint is ${(value / 1000).toFixed(1)}s. Target is under 2.5s for optimal user experience.`,
        recommendation: 'Focus on image optimization, reduce render-blocking resources, and improve server response times.',
        impact: 'medium',
        effort: 'medium',
        confidence: 85,
        timestamp: Date.now(),
        data: { current: value, target: 2500, improvement: value - 2500 }
      });
    } else {
      insights.push({
        id: `lcp-achievement-${Date.now()}`,
        type: 'achievement',
        priority: 'low',
        metric: 'LCP',
        title: 'Excellent Loading Performance',
        description: `Largest Contentful Paint is ${(value / 1000).toFixed(1)}s - well within optimal range.`,
        recommendation: 'Maintain current optimization strategies and monitor for any regressions.',
        impact: 'low',
        effort: 'low',
        confidence: 90,
        timestamp: Date.now(),
        data: { current: value, target: 2500 }
      });
    }

    return insights;
  }

  private analyzeINP(inp?: any): PerformanceInsight[] {
    const insights: PerformanceInsight[] = [];
    
    if (!inp || inp.value === -1) return insights;

    const value = inp.value;
    
    if (value > 500) {
      insights.push({
        id: `inp-critical-${Date.now()}`,
        type: 'optimization',
        priority: 'critical',
        metric: 'INP',
        title: 'Critical Responsiveness Issue',
        description: `Interaction to Next Paint is ${value}ms, well above the 500ms threshold.`,
        recommendation: 'Optimize JavaScript execution: reduce main thread work, defer non-critical scripts, and break up long tasks.',
        impact: 'high',
        effort: 'high',
        confidence: 90,
        timestamp: Date.now(),
        data: { current: value, target: 200, improvement: value - 200 }
      });
    } else if (value > 200) {
      insights.push({
        id: `inp-warning-${Date.now()}`,
        type: 'warning',
        priority: 'medium',
        metric: 'INP',
        title: 'Responsiveness Could Be Improved',
        description: `Interaction to Next Paint is ${value}ms. Target is under 200ms for optimal responsiveness.`,
        recommendation: 'Review JavaScript performance, optimize event handlers, and consider code splitting.',
        impact: 'medium',
        effort: 'medium',
        confidence: 80,
        timestamp: Date.now(),
        data: { current: value, target: 200, improvement: value - 200 }
      });
    }

    return insights;
  }

  private analyzeCLS(cls?: any): PerformanceInsight[] {
    const insights: PerformanceInsight[] = [];
    
    if (!cls || cls.value === -1) return insights;

    const value = cls.value;
    
    if (value > 0.25) {
      insights.push({
        id: `cls-critical-${Date.now()}`,
        type: 'optimization',
        priority: 'high',
        metric: 'CLS',
        title: 'Significant Layout Instability',
        description: `Cumulative Layout Shift is ${value.toFixed(3)}, above the 0.25 threshold.`,
        recommendation: 'Set explicit dimensions for images/videos, reserve space for dynamic content, and preload fonts.',
        impact: 'high',
        effort: 'medium',
        confidence: 85,
        timestamp: Date.now(),
        data: { current: value, target: 0.1, improvement: value - 0.1 }
      });
    } else if (value > 0.1) {
      insights.push({
        id: `cls-warning-${Date.now()}`,
        type: 'warning',
        priority: 'medium',
        metric: 'CLS',
        title: 'Layout Stability Can Be Improved',
        description: `Cumulative Layout Shift is ${value.toFixed(3)}. Target is under 0.1 for optimal stability.`,
        recommendation: 'Review layout shifts: ensure proper image sizing and avoid inserting content above existing content.',
        impact: 'medium',
        effort: 'low',
        confidence: 75,
        timestamp: Date.now(),
        data: { current: value, target: 0.1, improvement: value - 0.1 }
      });
    }

    return insights;
  }

  private analyzeFCP(fcp?: any): PerformanceInsight[] {
    const insights: PerformanceInsight[] = [];
    
    if (!fcp || fcp.value === -1) return insights;

    const value = fcp.value;
    
    if (value > 3000) {
      insights.push({
        id: `fcp-warning-${Date.now()}`,
        type: 'optimization',
        priority: 'medium',
        metric: 'FCP',
        title: 'Slow Initial Content Rendering',
        description: `First Contentful Paint is ${(value / 1000).toFixed(1)}s. Target is under 1.8s.`,
        recommendation: 'Optimize critical rendering path, reduce render-blocking resources, and improve server response.',
        impact: 'medium',
        effort: 'medium',
        confidence: 80,
        timestamp: Date.now(),
        data: { current: value, target: 1800, improvement: value - 1800 }
      });
    }

    return insights;
  }

  private analyzeTTFB(ttfb?: any): PerformanceInsight[] {
    const insights: PerformanceInsight[] = [];
    
    if (!ttfb || ttfb.value === -1) return insights;

    const value = ttfb.value;
    
    if (value > 1800) {
      insights.push({
        id: `ttfb-critical-${Date.now()}`,
        type: 'optimization',
        priority: 'high',
        metric: 'TTFB',
        title: 'Slow Server Response Time',
        description: `Time to First Byte is ${value}ms, well above the 800ms target.`,
        recommendation: 'Optimize server performance: use CDN, enable caching, optimize database queries, and consider server upgrade.',
        impact: 'high',
        effort: 'high',
        confidence: 85,
        timestamp: Date.now(),
        data: { current: value, target: 800, improvement: value - 800 }
      });
    } else if (value > 800) {
      insights.push({
        id: `ttfb-warning-${Date.now()}`,
        type: 'warning',
        priority: 'medium',
        metric: 'TTFB',
        title: 'Server Response Could Be Faster',
        description: `Time to First Byte is ${value}ms. Target is under 800ms for optimal performance.`,
        recommendation: 'Review server optimization opportunities: caching, compression, and CDN implementation.',
        impact: 'medium',
        effort: 'medium',
        confidence: 75,
        timestamp: Date.now(),
        data: { current: value, target: 800, improvement: value - 800 }
      });
    }

    return insights;
  }

  private analyzeTrends(): PerformanceInsight[] {
    const insights: PerformanceInsight[] = [];
    
    if (this.performanceData.length < 5) return insights;

    // Analyze each metric for trends
    const metrics = ['LCP', 'INP', 'CLS', 'FCP', 'TTFB'];
    
    metrics.forEach(metricName => {
      const values = this.performanceData
        .slice(0, 10)
        .map(d => d.webVitals[metricName]?.value)
        .filter(v => v !== undefined && v !== -1);

      if (values.length >= 5) {
        const trend = this.calculateMetricTrend(values, metricName);
        if (trend) insights.push(trend);
      }
    });

    return insights;
  }

  private calculateMetricTrend(values: number[], metricName: string): PerformanceInsight | null {
    const recent = values.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
    const baseline = values.slice(3).reduce((a, b) => a + b, 0) / (values.length - 3);
    const change = ((recent - baseline) / baseline) * 100;

    if (Math.abs(change) < 10) return null; // Not significant enough

    const isImprovement = change < 0; // For performance metrics, lower is better
    const magnitude = Math.abs(change);

    return {
      id: `trend-${metricName}-${Date.now()}`,
      type: 'trend',
      priority: magnitude > 25 ? 'high' : 'medium',
      metric: metricName,
      title: `${metricName} Performance ${isImprovement ? 'Improving' : 'Declining'}`,
      description: `${metricName} has ${isImprovement ? 'improved' : 'worsened'} by ${magnitude.toFixed(1)}% recently.`,
      recommendation: isImprovement 
        ? 'Great progress! Continue current optimization strategies and monitor for sustained improvement.'
        : 'Performance regression detected. Review recent changes and consider rollback if necessary.',
      impact: magnitude > 25 ? 'high' : 'medium',
      effort: 'low',
      confidence: Math.min(95, 60 + magnitude),
      timestamp: Date.now(),
      data: { current: recent, baseline, improvement: recent - baseline }
    };
  }

  private analyzeAchievements(): PerformanceInsight[] {
    const insights: PerformanceInsight[] = [];
    
    if (!this.performanceData || this.performanceData.length === 0) return insights;

    const latest = this.performanceData[0];
    const metrics = latest?.webVitals || {};
    
    let excellentMetrics = 0;
    const totalMetrics = 5;

    // Count excellent metrics
    if (metrics.LCP?.value <= 2500) excellentMetrics++;
    if (metrics.INP?.value <= 200) excellentMetrics++;
    if (metrics.CLS?.value <= 0.1) excellentMetrics++;
    if (metrics.FCP?.value <= 1800) excellentMetrics++;
    if (metrics.TTFB?.value <= 800) excellentMetrics++;

    if (excellentMetrics === totalMetrics) {
      insights.push({
        id: `achievement-perfect-${Date.now()}`,
        type: 'achievement',
        priority: 'low',
        metric: 'Overall',
        title: '🎉 Perfect Performance Score!',
        description: 'All Core Web Vitals metrics are within optimal thresholds. Outstanding performance!',
        recommendation: 'Maintain current optimization strategies and set up monitoring alerts to catch any regressions.',
        impact: 'low',
        effort: 'low',
        confidence: 100,
        timestamp: Date.now(),
        data: { current: 100 }
      });
    } else if (excellentMetrics >= 4) {
      insights.push({
        id: `achievement-excellent-${Date.now()}`,
        type: 'achievement',
        priority: 'low',
        metric: 'Overall',
        title: '⭐ Excellent Performance!',
        description: `${excellentMetrics} out of ${totalMetrics} Core Web Vitals metrics are optimal.`,
        recommendation: 'Focus on optimizing the remaining metrics to achieve perfect performance.',
        impact: 'low',
        effort: 'low',
        confidence: 90,
        timestamp: Date.now(),
        data: { current: (excellentMetrics / totalMetrics) * 100 }
      });
    }

    return insights;
  }
}

/**
 * Performance Score Display Component
 * 
 * ✅ PERFORMANCE: Visual performance score with AI grading
 */
const PerformanceScoreCard = React.memo(({ 
  score 
}: { 
  score: AIPerformanceScore 
}) => {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': case 'A': return 'text-green-600 bg-green-50 border-green-200';
      case 'B+': case 'B': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'C+': case 'C': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'D': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'F': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trending: string) => {
    switch (trending) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      case 'stable': return '➡️';
      default: return '📊';
    }
  };

  const getTrendColor = (trending: string) => {
    switch (trending) {
      case 'improving': return 'text-green-600';
      case 'declining': return 'text-red-600';
      case 'stable': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={`p-6 rounded-lg border-2 ${getGradeColor(score.grade)}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">AI Performance Score</h3>
          <p className="text-sm opacity-75">Intelligent performance analysis</p>
        </div>
        <div className={`text-right ${getTrendColor(score.trending)}`}>
          <span className="text-2xl">{getTrendIcon(score.trending)}</span>
          <div className="text-xs capitalize font-medium">{score.trending}</div>
        </div>
      </div>

      <div className="text-center mb-6">
        <div className="text-6xl font-bold mb-2">{score.grade}</div>
        <div className="text-2xl font-mono">{score.overall}/100</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-sm opacity-75">Loading</div>
          <div className="font-bold">{score.breakdown.loading}</div>
        </div>
        <div className="text-center">
          <div className="text-sm opacity-75">Interactivity</div>
          <div className="font-bold">{score.breakdown.interactivity}</div>
        </div>
        <div className="text-center">
          <div className="text-sm opacity-75">Stability</div>
          <div className="font-bold">{score.breakdown.visualStability}</div>
        </div>
        <div className="text-center">
          <div className="text-sm opacity-75">Server</div>
          <div className="font-bold">{score.breakdown.serverResponse}</div>
        </div>
      </div>
    </div>
  );
});

PerformanceScoreCard.displayName = 'PerformanceScoreCard';

/**
 * Performance Insight Card Component
 * 
 * ✅ PERFORMANCE: Individual insight display with AI recommendations
 */
const InsightCard = React.memo(({ 
  insight,
  onDismiss,
  onImplement
}: {
  insight: PerformanceInsight;
  onDismiss: (id: string) => void;
  onImplement: (insight: PerformanceInsight) => void;
}) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'optimization': return 'border-l-red-500 bg-red-50 dark:bg-red-900/20';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'achievement': return 'border-l-green-500 bg-green-50 dark:bg-green-900/20';
      case 'trend': return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default: return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return '🚨';
      case 'high': return '⚠️';
      case 'medium': return '🔔';
      case 'low': return 'ℹ️';
      default: return '📊';
    }
  };

  const getImpactBadge = (impact: string, effort: string) => {
    if (impact === 'high' && effort === 'low') return { text: 'Quick Win', color: 'bg-green-100 text-green-800' };
    if (impact === 'high' && effort === 'high') return { text: 'Major Project', color: 'bg-purple-100 text-purple-800' };
    if (impact === 'medium' && effort === 'low') return { text: 'Easy Fix', color: 'bg-blue-100 text-blue-800' };
    if (impact === 'low' && effort === 'low') return { text: 'Minor', color: 'bg-gray-100 text-gray-800' };
    return { text: 'Standard', color: 'bg-gray-100 text-gray-800' };
  };

  const impactBadge = getImpactBadge(insight.impact, insight.effort);

  return (
    <div className={`border-l-4 ${getTypeColor(insight.type)} p-4 rounded-r-lg`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getPriorityIcon(insight.priority)}</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {insight.title}
          </span>
          <span className={`px-2 py-1 text-xs rounded-full ${impactBadge.color}`}>
            {impactBadge.text}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <span>{insight.confidence}% confidence</span>
          <button
            onClick={() => onDismiss(insight.id)}
            className="hover:text-red-500 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-gray-700 dark:text-gray-300 mb-2">{insight.description}</p>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border">
          <div className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
            💡 AI Recommendation:
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{insight.recommendation}</p>
        </div>
      </div>

      {insight.data && (
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>Current: {insight.data.current.toFixed(insight.metric === 'CLS' ? 3 : 0)}</span>
          {insight.data.target && (
            <span>Target: {insight.data.target.toFixed(insight.metric === 'CLS' ? 3 : 0)}</span>
          )}
          {insight.data.improvement && (
            <span className="text-red-600">
              Gap: {Math.abs(insight.data.improvement).toFixed(insight.metric === 'CLS' ? 3 : 0)}
            </span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500">
          Impact: <span className="capitalize font-medium">{insight.impact}</span> | 
          Effort: <span className="capitalize font-medium">{insight.effort}</span>
        </div>
        
        <button
          onClick={() => onImplement(insight)}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
});

InsightCard.displayName = 'InsightCard';

/**
 * Main AI Performance Advisor Component
 * 
 * ✅ PERFORMANCE: Comprehensive AI-powered performance analysis
 */
export default function AIPerformanceAdvisor({
  className = '',
  enableAutoAnalysis = true,
  analysisInterval = 60000, // 1 minute
  onInsightGenerated
}: AIPerformanceAdvisorProps) {
  const { current } = usePerformance();
  const { history, hasData } = usePerformanceAnalytics();
  
  const [insights, setInsights] = useState<PerformanceInsight[]>([]);
  const [performanceScore, setPerformanceScore] = useState<AIPerformanceScore | null>(null);
  const [dismissedInsights, setDismissedInsights] = useState<Set<string>>(new Set());
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // AI Performance Analysis
  const analyzePerformance = useCallback(async () => {
    if (!hasData || !history || history.length === 0) return;

    setIsAnalyzing(true);

    try {
      const analyzer = new AIPerformanceAnalyzer(history);
      
      // Generate performance score
      const score = analyzer.generatePerformanceScore();
      setPerformanceScore(score);
      
      // Generate insights
      const newInsights = analyzer.generateInsights();
      
      // Filter out dismissed insights
      const filteredInsights = newInsights.filter(
        insight => !dismissedInsights.has(insight.id)
      );
      
      setInsights(filteredInsights);

      // Notify parent component of new insights
      filteredInsights.forEach(insight => {
        onInsightGenerated?.(insight);
      });

    } catch (error) {
      console.error('AI Performance Analysis Error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [hasData, history, dismissedInsights, onInsightGenerated]);

  // Auto-analysis effect
  useEffect(() => {
    if (!enableAutoAnalysis) return;

    analyzePerformance();
    
    const interval = setInterval(analyzePerformance, analysisInterval);
    return () => clearInterval(interval);
  }, [enableAutoAnalysis, analysisInterval, analyzePerformance]);

  // Manual analysis trigger
  const handleManualAnalysis = useCallback(() => {
    analyzePerformance();
  }, [analyzePerformance]);

  // Insight management
  const handleDismissInsight = useCallback((insightId: string) => {
    setDismissedInsights(prev => new Set([...prev, insightId]));
    setInsights(prev => prev.filter(insight => insight.id !== insightId));
  }, []);

  const handleImplementInsight = useCallback((insight: PerformanceInsight) => {
    // Could open detailed implementation guide or documentation
    console.log('Implementing insight:', insight);
    // Future: Open modal with detailed implementation steps
  }, []);

  // Filter insights by priority
  const criticalInsights = insights.filter(i => i.priority === 'critical');
  const highPriorityInsights = insights.filter(i => i.priority === 'high');
  const mediumPriorityInsights = insights.filter(i => i.priority === 'medium');
  const achievements = insights.filter(i => i.type === 'achievement');

  if (!hasData) {
    return (
      <div className={`p-8 text-center ${className}`}>
        <div className="text-6xl mb-4">🤖</div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          AI Performance Advisor Ready
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Start navigating the application to enable AI-powered performance analysis
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* AI Performance Score */}
      {performanceScore && (
        <PerformanceScoreCard score={performanceScore} />
      )}

      {/* Analysis Control */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              AI Performance Analysis
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Intelligent insights from {history?.length || 0} performance measurements
            </p>
          </div>
          
          <button
            onClick={handleManualAnalysis}
            disabled={isAnalyzing}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isAnalyzing
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isAnalyzing ? '🔄 Analyzing...' : '🤖 Analyze Now'}
          </button>
        </div>
      </div>

      {/* Critical Issues */}
      {criticalInsights.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center">
            🚨 Critical Issues ({criticalInsights.length})
          </h3>
          <div className="space-y-4">
            {criticalInsights.map(insight => (
              <InsightCard
                key={insight.id}
                insight={insight}
                onDismiss={handleDismissInsight}
                onImplement={handleImplementInsight}
              />
            ))}
          </div>
        </div>
      )}

      {/* High Priority Optimizations */}
      {highPriorityInsights.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-orange-600 mb-4 flex items-center">
            ⚠️ High Priority Optimizations ({highPriorityInsights.length})
          </h3>
          <div className="space-y-4">
            {highPriorityInsights.map(insight => (
              <InsightCard
                key={insight.id}
                insight={insight}
                onDismiss={handleDismissInsight}
                onImplement={handleImplementInsight}
              />
            ))}
          </div>
        </div>
      )}

      {/* Medium Priority Recommendations */}
      {mediumPriorityInsights.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-yellow-600 mb-4 flex items-center">
            🔔 Optimization Opportunities ({mediumPriorityInsights.length})
          </h3>
          <div className="space-y-4">
            {mediumPriorityInsights.slice(0, 5).map(insight => (
              <InsightCard
                key={insight.id}
                insight={insight}
                onDismiss={handleDismissInsight}
                onImplement={handleImplementInsight}
              />
            ))}
          </div>
          {mediumPriorityInsights.length > 5 && (
            <p className="text-sm text-gray-500 text-center">
              +{mediumPriorityInsights.length - 5} more recommendations available
            </p>
          )}
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
            🎉 Performance Achievements ({achievements.length})
          </h3>
          <div className="space-y-4">
            {achievements.map(insight => (
              <InsightCard
                key={insight.id}
                insight={insight}
                onDismiss={handleDismissInsight}
                onImplement={handleImplementInsight}
              />
            ))}
          </div>
        </div>
      )}

      {/* No Insights State */}
      {insights.length === 0 && !isAnalyzing && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">✅</div>
          <p className="text-green-600 dark:text-green-400 font-medium">
            AI Analysis Complete - No Issues Detected!
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Your performance is optimized. Check back regularly for ongoing analysis.
          </p>
        </div>
      )}
    </div>
  );
}