/**
 * WEB VITALS MONITORING SYSTEM
 * Following ADVANCED_CODING_AI_DISSERTATION.md - Performance Protocol
 * 
 * This module provides comprehensive Web Vitals collection and monitoring
 * for data-driven performance optimization following Phase 3A success.
 */

import { onCLS, onINP, onFCP, onLCP, onTTFB, type Metric } from 'web-vitals';

// Web Vitals thresholds based on Google Core Web Vitals guidelines
export const WEB_VITALS_THRESHOLDS = {
  CLS: {
    good: 0.1,
    needsImprovement: 0.25,
    poor: Infinity
  },
  LCP: {
    good: 2500, // milliseconds
    needsImprovement: 4000,
    poor: Infinity
  },
  INP: {
    good: 200, // milliseconds (Interaction to Next Paint)
    needsImprovement: 500,
    poor: Infinity
  },
  FCP: {
    good: 1800, // milliseconds
    needsImprovement: 3000,
    poor: Infinity
  },
  TTFB: {
    good: 800, // milliseconds
    needsImprovement: 1800,
    poor: Infinity
  }
} as const;

// Performance metric data structure
export interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  url: string;
  navigationType: 'navigate' | 'reload' | 'back_forward' | 'prerender';
  connection?: {
    effectiveType: string;
    rtt: number;
    downlink: number;
  };
}

// Performance metrics collection state
export interface WebVitalsData {
  CLS: PerformanceMetric | null;
  LCP: PerformanceMetric | null;
  INP: PerformanceMetric | null;
  FCP: PerformanceMetric | null;
  TTFB: PerformanceMetric | null;
  sessionId: string;
  pageLoadTime: number;
  collectionStartTime: number;
}

// Performance analytics callback type
export type PerformanceCallback = (metric: PerformanceMetric) => void;

/**
 * Get performance rating based on metric value and thresholds
 */
function getPerformanceRating(
  metricName: keyof typeof WEB_VITALS_THRESHOLDS,
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = WEB_VITALS_THRESHOLDS[metricName];
  
  if (value <= thresholds.good) {
    return 'good';
  } else if (value <= thresholds.needsImprovement) {
    return 'needs-improvement';
  } else {
    return 'poor';
  }
}

/**
 * Get network connection information if available
 */
function getConnectionInfo() {
  if (typeof navigator !== 'undefined' && 'connection' in navigator) {
    const connection = (navigator as any).connection;
    return {
      effectiveType: connection.effectiveType || 'unknown',
      rtt: connection.rtt || 0,
      downlink: connection.downlink || 0
    };
  }
  return undefined;
}

/**
 * Get navigation type for performance context
 */
function getNavigationType(): 'navigate' | 'reload' | 'back_forward' | 'prerender' {
  if (typeof performance !== 'undefined' && performance.navigation) {
    const type = performance.navigation.type;
    switch (type) {
      case 0: return 'navigate';
      case 1: return 'reload';
      case 2: return 'back_forward';
      case 255: return 'prerender';
      default: return 'navigate';
    }
  }
  return 'navigate';
}

/**
 * Generate unique session ID for performance tracking
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create standardized performance metric object
 */
function createPerformanceMetric(metric: Metric): PerformanceMetric {
  return {
    id: metric.id,
    name: metric.name,
    value: metric.value,
    rating: getPerformanceRating(metric.name as keyof typeof WEB_VITALS_THRESHOLDS, metric.value),
    timestamp: Date.now(),
    url: window.location.href,
    navigationType: getNavigationType(),
    connection: getConnectionInfo()
  };
}

/**
 * Web Vitals collection class with enhanced analytics
 */
export class WebVitalsCollector {
  private callbacks: Set<PerformanceCallback> = new Set();
  private data: WebVitalsData;
  private isCollecting = false;

  constructor() {
    this.data = {
      CLS: null,
      LCP: null,
      INP: null,
      FCP: null,
      TTFB: null,
      sessionId: generateSessionId(),
      pageLoadTime: 0,
      collectionStartTime: Date.now()
    };
  }

  /**
   * Start Web Vitals collection
   */
  startCollection(): void {
    if (this.isCollecting || typeof window === 'undefined') {
      return;
    }

    this.isCollecting = true;
    const startTime = performance.now();

    // ✅ PERFORMANCE: Collect Core Web Vitals with enhanced context
    onCLS((metric: Metric) => {
      const performanceMetric = createPerformanceMetric(metric);
      this.data.CLS = performanceMetric;
      this.notifyCallbacks(performanceMetric);
    });

    onLCP((metric: Metric) => {
      const performanceMetric = createPerformanceMetric(metric);
      this.data.LCP = performanceMetric;
      this.notifyCallbacks(performanceMetric);
    });

    onINP((metric: Metric) => {
      const performanceMetric = createPerformanceMetric(metric);
      this.data.INP = performanceMetric;
      this.notifyCallbacks(performanceMetric);
    });

    onFCP((metric: Metric) => {
      const performanceMetric = createPerformanceMetric(metric);
      this.data.FCP = performanceMetric;
      this.notifyCallbacks(performanceMetric);
    });

    onTTFB((metric: Metric) => {
      const performanceMetric = createPerformanceMetric(metric);
      this.data.TTFB = performanceMetric;
      this.notifyCallbacks(performanceMetric);
    });

    // Record page load completion time
    if (document.readyState === 'complete') {
      this.data.pageLoadTime = performance.now() - startTime;
    } else {
      window.addEventListener('load', () => {
        this.data.pageLoadTime = performance.now() - startTime;
      });
    }
  }

  /**
   * Stop Web Vitals collection and cleanup
   */
  stopCollection(): void {
    this.isCollecting = false;
    this.callbacks.clear();
  }

  /**
   * Add callback for Web Vitals updates
   */
  onMetric(callback: PerformanceCallback): () => void {
    this.callbacks.add(callback);
    
    // Return cleanup function
    return () => {
      this.callbacks.delete(callback);
    };
  }

  /**
   * Get current Web Vitals data snapshot
   */
  getSnapshot(): WebVitalsData {
    return { ...this.data };
  }

  /**
   * Get performance summary with ratings
   */
  getPerformanceSummary(): {
    overallRating: 'good' | 'needs-improvement' | 'poor';
    metrics: Array<{ name: string; value: number; rating: string; threshold: string }>;
    completedMetrics: number;
    totalMetrics: number;
  } {
    const metrics: Array<{ name: string; value: number; rating: string; threshold: string }> = [];
    let goodCount = 0;
    let totalCount = 0;

    // Analyze each collected metric
    Object.entries(this.data).forEach(([key, value]) => {
      if (value && typeof value === 'object' && 'rating' in value) {
        const metric = value as PerformanceMetric;
        totalCount++;
        
        if (metric.rating === 'good') {
          goodCount++;
        }

        const thresholds = WEB_VITALS_THRESHOLDS[key as keyof typeof WEB_VITALS_THRESHOLDS];
        metrics.push({
          name: key,
          value: metric.value,
          rating: metric.rating,
          threshold: key === 'CLS' ? 
            `Good: <${thresholds.good}, Poor: >${thresholds.needsImprovement}` :
            `Good: <${thresholds.good}ms, Poor: >${thresholds.needsImprovement}ms`
        });
      }
    });

    // Calculate overall rating
    const goodPercentage = totalCount > 0 ? goodCount / totalCount : 0;
    let overallRating: 'good' | 'needs-improvement' | 'poor';
    
    if (goodPercentage >= 0.75) {
      overallRating = 'good';
    } else if (goodPercentage >= 0.5) {
      overallRating = 'needs-improvement';
    } else {
      overallRating = 'poor';
    }

    return {
      overallRating,
      metrics,
      completedMetrics: totalCount,
      totalMetrics: 5 // CLS, LCP, INP, FCP, TTFB
    };
  }

  /**
   * Reset collection data for new page/session
   */
  reset(): void {
    this.data = {
      CLS: null,
      LCP: null,
      INP: null,
      FCP: null,
      TTFB: null,
      sessionId: generateSessionId(),
      pageLoadTime: 0,
      collectionStartTime: Date.now()
    };
  }

  /**
   * Notify all registered callbacks
   */
  private notifyCallbacks(metric: PerformanceMetric): void {
    this.callbacks.forEach(callback => {
      try {
        callback(metric);
      } catch (error) {
        console.error('Web Vitals callback error:', error);
      }
    });
  }
}

// Global Web Vitals collector instance
let globalCollector: WebVitalsCollector | null = null;

/**
 * Get or create global Web Vitals collector instance
 */
export function getWebVitalsCollector(): WebVitalsCollector {
  if (!globalCollector) {
    globalCollector = new WebVitalsCollector();
  }
  return globalCollector;
}

/**
 * Initialize Web Vitals collection with automatic startup
 */
export function initializeWebVitals(onMetric?: PerformanceCallback): () => void {
  const collector = getWebVitalsCollector();
  
  // Start collection
  collector.startCollection();
  
  // Add callback if provided
  const cleanup = onMetric ? collector.onMetric(onMetric) : () => {};
  
  // Return cleanup function
  return () => {
    cleanup();
    collector.stopCollection();
  };
}

/**
 * Export utilities for manual usage
 */
export {
  onCLS,
  onINP,
  onFCP,
  onLCP,
  onTTFB
} from 'web-vitals';

export type { Metric } from 'web-vitals';