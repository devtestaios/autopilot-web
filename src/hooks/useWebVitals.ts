/**
 * REACT WEB VITALS HOOK
 * Following ADVANCED_CODING_AI_DISSERTATION.md - Performance Protocol
 * 
 * React hook for seamless Web Vitals integration with component lifecycle
 * and state management following Phase 3A Context optimization patterns.
 */

'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  WebVitalsCollector,
  getWebVitalsCollector,
  type WebVitalsData,
  type PerformanceMetric,
  type PerformanceCallback
} from '@/lib/performance/webVitals';

// Hook return type for Web Vitals monitoring
export interface UseWebVitalsReturn {
  data: WebVitalsData;
  isCollecting: boolean;
  summary: {
    overallRating: 'good' | 'needs-improvement' | 'poor';
    metrics: Array<{ name: string; value: number; rating: string; threshold: string }>;
    completedMetrics: number;
    totalMetrics: number;
  };
  collector: WebVitalsCollector;
  startCollection: () => void;
  stopCollection: () => void;
  resetCollection: () => void;
}

// Hook options for customization
export interface UseWebVitalsOptions {
  autoStart?: boolean;
  onMetric?: PerformanceCallback;
  enabled?: boolean;
}

/**
 * React hook for Web Vitals monitoring with automatic lifecycle management
 * 
 * ✅ PERFORMANCE: Optimized following Phase 3A Context patterns
 * - Proper cleanup in useEffect
 * - Stable references with useRef
 * - Memoized state updates
 */
export function useWebVitals(options: UseWebVitalsOptions = {}): UseWebVitalsReturn {
  const {
    autoStart = true,
    onMetric,
    enabled = true
  } = options;

  // ✅ PERFORMANCE: Stable collector reference to prevent re-initialization
  const collectorRef = useRef<WebVitalsCollector | null>(null);
  
  // State management for Web Vitals data
  const [data, setData] = useState<WebVitalsData>(() => ({
    CLS: null,
    LCP: null,
    INP: null,
    FCP: null,
    TTFB: null,
    sessionId: '',
    pageLoadTime: 0,
    collectionStartTime: 0
  }));
  
  const [isCollecting, setIsCollecting] = useState(false);

  // ✅ PERFORMANCE: Initialize collector only once with stable reference
  if (!collectorRef.current && enabled && typeof window !== 'undefined') {
    collectorRef.current = getWebVitalsCollector();
  }

  // ✅ PERFORMANCE: Update data state when metrics change
  useEffect(() => {
    if (!collectorRef.current || !enabled) return;

    const collector = collectorRef.current;
    
    // Internal callback to update state and call user callback
    const handleMetricUpdate = (metric: PerformanceMetric) => {
      // Update internal state with fresh snapshot
      setData(collector.getSnapshot());
      
      // Call user-provided callback if available
      if (onMetric) {
        onMetric(metric);
      }
    };

    // Register for metric updates
    const cleanup = collector.onMetric(handleMetricUpdate);
    
    // Initialize data state
    setData(collector.getSnapshot());

    // ✅ PERFORMANCE: Proper cleanup function following Phase 3A patterns
    return cleanup;
  }, [onMetric, enabled]);

  // ✅ PERFORMANCE: Auto-start collection on mount if enabled
  useEffect(() => {
    if (!collectorRef.current || !enabled || !autoStart) return;

    const collector = collectorRef.current;
    collector.startCollection();
    setIsCollecting(true);

    // ✅ PERFORMANCE: Cleanup on unmount
    return () => {
      collector.stopCollection();
      setIsCollecting(false);
    };
  }, [autoStart, enabled]);

  // Manual collection controls
  const startCollection = () => {
    if (!collectorRef.current || !enabled) return;
    
    collectorRef.current.startCollection();
    setIsCollecting(true);
  };

  const stopCollection = () => {
    if (!collectorRef.current) return;
    
    collectorRef.current.stopCollection();
    setIsCollecting(false);
  };

  const resetCollection = () => {
    if (!collectorRef.current) return;
    
    collectorRef.current.reset();
    setData(collectorRef.current.getSnapshot());
  };

  // Generate performance summary
  const summary = collectorRef.current ? collectorRef.current.getPerformanceSummary() : {
    overallRating: 'needs-improvement' as const,
    metrics: [],
    completedMetrics: 0,
    totalMetrics: 5
  };

  return {
    data,
    isCollecting,
    summary,
    collector: collectorRef.current!,
    startCollection,
    stopCollection,
    resetCollection
  };
}

/**
 * Lightweight hook for simple Web Vitals monitoring
 * 
 * ✅ PERFORMANCE: Minimal overhead for basic monitoring needs
 */
export function useWebVitalsSimple(onMetric?: PerformanceCallback) {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const collector = getWebVitalsCollector();
    
    const handleMetric = (metric: PerformanceMetric) => {
      setMetrics(prev => {
        const filtered = prev.filter(m => m.name !== metric.name);
        return [...filtered, metric];
      });
      
      if (onMetric) {
        onMetric(metric);
      }
    };

    const cleanup = collector.onMetric(handleMetric);
    collector.startCollection();

    // ✅ PERFORMANCE: Proper cleanup
    return () => {
      cleanup();
      collector.stopCollection();
    };
  }, [onMetric]);

  return metrics;
}

/**
 * Hook for monitoring specific Web Vital metric
 * 
 * ✅ PERFORMANCE: Focused monitoring for specific performance concerns
 */
export function useWebVital(metricName: 'CLS' | 'LCP' | 'INP' | 'FCP' | 'TTFB') {
  const [metric, setMetric] = useState<PerformanceMetric | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const collector = getWebVitalsCollector();
    
    const handleMetric = (newMetric: PerformanceMetric) => {
      if (newMetric.name === metricName) {
        setMetric(newMetric);
        setLoading(false);
      }
    };

    const cleanup = collector.onMetric(handleMetric);
    collector.startCollection();

    // Check if metric already exists
    const currentData = collector.getSnapshot();
    const existingMetric = currentData[metricName];
    if (existingMetric) {
      setMetric(existingMetric);
      setLoading(false);
    }

    // ✅ PERFORMANCE: Proper cleanup
    return () => {
      cleanup();
    };
  }, [metricName]);

  return { metric, loading };
}

/**
 * Development helper hook for Web Vitals debugging
 * 
 * ✅ DEVELOPMENT: Console logging and detailed analysis for development
 */
export function useWebVitalsDebug() {
  const { data, summary, isCollecting } = useWebVitals({
    autoStart: true,
    onMetric: (metric) => {
      console.group(`🔍 Web Vital: ${metric.name}`);
      console.log('Value:', metric.value);
      console.log('Rating:', metric.rating);
      console.log('URL:', metric.url);
      console.log('Navigation:', metric.navigationType);
      if (metric.connection) {
        console.log('Connection:', metric.connection);
      }
      console.groupEnd();
    }
  });

  useEffect(() => {
    console.log('📊 Web Vitals Summary:', summary);
  }, [summary.completedMetrics]);

  return {
    data,
    summary,
    isCollecting,
    debug: {
      logSnapshot: () => console.table(data),
      logSummary: () => console.log('Performance Summary:', summary)
    }
  };
}