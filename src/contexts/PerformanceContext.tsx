/**
 * PERFORMANCE CONTEXT PROVIDER
 * Following ADVANCED_CODING_AI_DISSERTATION.md - Performance Protocol
 * 
 * Centralized performance state management following Phase 3A Context optimization patterns
 * with data persistence and historical tracking capabilities.
 */

'use client';

import React, { createContext, useContext, useCallback, useMemo, useEffect, useRef } from 'react';
import { 
  WebVitalsData, 
  PerformanceMetric, 
  getWebVitalsCollector,
  WebVitalsCollector 
} from '@/lib/performance/webVitals';
import { savePerformanceData, loadPerformanceHistory, clearPerformanceData } from '@/lib/performance/performanceStorage';

// Performance analytics and historical data
export interface PerformanceSnapshot {
  id: string;
  timestamp: number;
  url: string;
  webVitals: WebVitalsData;
  summary: {
    overallRating: 'good' | 'needs-improvement' | 'poor';
    completedMetrics: number;
    totalMetrics: number;
  };
  pageLoadTime: number;
  sessionId: string;
  userAgent: string;
  viewport: {
    width: number;
    height: number;
  };
}

// Performance trends and analytics
export interface PerformanceTrends {
  averageRatings: {
    overall: { good: number; needsImprovement: number; poor: number };
    CLS: { good: number; needsImprovement: number; poor: number };
    LCP: { good: number; needsImprovement: number; poor: number };
    INP: { good: number; needsImprovement: number; poor: number };
    FCP: { good: number; needsImprovement: number; poor: number };
    TTFB: { good: number; needsImprovement: number; poor: number };
  };
  improvements: {
    metric: string;
    improvement: number;
    timeframe: string;
  }[];
  alerts: {
    metric: string;
    severity: 'warning' | 'critical';
    message: string;
    timestamp: number;
  }[];
}

// Context state interface
export interface PerformanceContextState {
  // Current performance data
  current: WebVitalsData | null;
  isCollecting: boolean;
  
  // Historical data
  history: PerformanceSnapshot[];
  trends: PerformanceTrends | null;
  
  // Settings
  settings: {
    enableCollection: boolean;
    enablePersistence: boolean;
    alertThresholds: {
      CLS: number;
      LCP: number;
      INP: number;
      FCP: number;
      TTFB: number;
    };
  };
  
  // Collector instance
  collector: WebVitalsCollector | null;
}

// Context actions interface
export interface PerformanceContextActions {
  // Collection controls
  startCollection: () => void;
  stopCollection: () => void;
  resetCollection: () => void;
  
  // Data management
  saveSnapshot: () => Promise<void>;
  loadHistory: () => Promise<void>;
  clearHistory: () => Promise<void>;
  
  // Settings
  updateSettings: (settings: Partial<PerformanceContextState['settings']>) => void;
  
  // Analytics
  generateTrends: () => void;
  exportData: () => string;
  
  // Utility
  getMetricByName: (name: string) => PerformanceMetric | null;
  getCurrentSummary: () => PerformanceContextState['current'] extends WebVitalsData ? ReturnType<WebVitalsCollector['getPerformanceSummary']> : null;
}

// Complete context interface
export interface PerformanceContextValue extends PerformanceContextState, PerformanceContextActions {}

// Context creation
const PerformanceContext = createContext<PerformanceContextValue | null>(null);

// Default settings
const DEFAULT_SETTINGS: PerformanceContextState['settings'] = {
  enableCollection: true,
  enablePersistence: true,
  alertThresholds: {
    CLS: 0.25,
    LCP: 4000,
    INP: 500,
    FCP: 3000,
    TTFB: 1800
  }
};

/**
 * Performance Context Provider with optimized patterns from Phase 3A
 * 
 * ✅ PERFORMANCE: Following Phase 3A Context optimization patterns
 * - useMemo for stable context values
 * - useCallback for stable function references
 * - Proper cleanup with useEffect
 */
export function PerformanceProvider({ children }: { children: React.ReactNode }) {
  // ✅ PERFORMANCE: Stable collector reference to prevent re-initialization
  const collectorRef = useRef<WebVitalsCollector | null>(null);
  
  // Internal state
  const [state, setState] = React.useState<PerformanceContextState>(() => ({
    current: null,
    isCollecting: false,
    history: [],
    trends: null,
    settings: DEFAULT_SETTINGS,
    collector: null
  }));

  // ✅ PERFORMANCE: Initialize collector only once
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!collectorRef.current) {
      collectorRef.current = getWebVitalsCollector();
      setState(prev => ({ ...prev, collector: collectorRef.current }));
    }

    const collector = collectorRef.current;

    // Set up metric collection callback
    const cleanup = collector.onMetric(() => {
      const snapshot = collector.getSnapshot();
      setState(prev => ({ ...prev, current: snapshot }));
    });

    // Load historical data on initialization
    loadHistory();

    // ✅ PERFORMANCE: Proper cleanup
    return cleanup;
  }, []);

  // ✅ PERFORMANCE: Memoized action functions with stable references
  const startCollection = useCallback(() => {
    if (!collectorRef.current) return;
    
    collectorRef.current.startCollection();
    setState(prev => ({ ...prev, isCollecting: true }));
  }, []);

  const stopCollection = useCallback(() => {
    if (!collectorRef.current) return;
    
    collectorRef.current.stopCollection();
    setState(prev => ({ ...prev, isCollecting: false }));
  }, []);

  const resetCollection = useCallback(() => {
    if (!collectorRef.current) return;
    
    collectorRef.current.reset();
    setState(prev => ({ 
      ...prev, 
      current: collectorRef.current!.getSnapshot() 
    }));
  }, []);

  const saveSnapshot = useCallback(async () => {
    if (!collectorRef.current || !state.current) return;

    const snapshot: PerformanceSnapshot = {
      id: `snapshot_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: Date.now(),
      url: window.location.href,
      webVitals: state.current,
      summary: collectorRef.current.getPerformanceSummary(),
      pageLoadTime: state.current.pageLoadTime,
      sessionId: state.current.sessionId,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    if (state.settings.enablePersistence) {
      await savePerformanceData(snapshot);
    }

    setState(prev => ({
      ...prev,
      history: [snapshot, ...prev.history].slice(0, 100) // Keep last 100 snapshots
    }));
  }, [state.current, state.settings.enablePersistence]);

  const loadHistory = useCallback(async () => {
    try {
      const history = await loadPerformanceHistory();
      setState(prev => ({ ...prev, history }));
    } catch (error) {
      console.error('Failed to load performance history:', error);
    }
  }, []);

  const clearHistory = useCallback(async () => {
    try {
      await clearPerformanceData();
      setState(prev => ({ ...prev, history: [], trends: null }));
    } catch (error) {
      console.error('Failed to clear performance history:', error);
    }
  }, []);

  const updateSettings = useCallback((newSettings: Partial<PerformanceContextState['settings']>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  }, []);

  const generateTrends = useCallback(() => {
    if (state.history.length < 2) {
      setState(prev => ({ ...prev, trends: null }));
      return;
    }

    // Calculate trends from historical data
    const trends: PerformanceTrends = {
      averageRatings: {
        overall: { good: 0, needsImprovement: 0, poor: 0 },
        CLS: { good: 0, needsImprovement: 0, poor: 0 },
        LCP: { good: 0, needsImprovement: 0, poor: 0 },
        INP: { good: 0, needsImprovement: 0, poor: 0 },
        FCP: { good: 0, needsImprovement: 0, poor: 0 },
        TTFB: { good: 0, needsImprovement: 0, poor: 0 }
      },
      improvements: [],
      alerts: []
    };

    // Calculate rating distributions
    state.history.forEach(snapshot => {
      const { summary } = snapshot;
      trends.averageRatings.overall[summary.overallRating === 'needs-improvement' ? 'needsImprovement' : summary.overallRating]++;
      
      // Individual metrics
      Object.entries(snapshot.webVitals).forEach(([key, metric]) => {
        if (metric && typeof metric === 'object' && 'rating' in metric) {
          const metricKey = key as keyof typeof trends.averageRatings;
          if (metricKey in trends.averageRatings) {
            const rating = metric.rating === 'needs-improvement' ? 'needsImprovement' : metric.rating;
            trends.averageRatings[metricKey][rating]++;
          }
        }
      });
    });

    // Generate alerts for poor performance
    if (state.current && collectorRef.current) {
      const summary = collectorRef.current.getPerformanceSummary();
      summary.metrics.forEach(metric => {
        const threshold = state.settings.alertThresholds[metric.name as keyof typeof state.settings.alertThresholds];
        if (metric.value > threshold && metric.rating === 'poor') {
          trends.alerts.push({
            metric: metric.name,
            severity: 'critical',
            message: `${metric.name} is performing poorly: ${metric.value > 1000 ? Math.round(metric.value) + 'ms' : metric.value.toFixed(3)}`,
            timestamp: Date.now()
          });
        }
      });
    }

    setState(prev => ({ ...prev, trends }));
  }, [state.history, state.current, state.settings.alertThresholds]);

  const exportData = useCallback((): string => {
    const exportData = {
      timestamp: Date.now(),
      current: state.current,
      history: state.history,
      trends: state.trends,
      settings: state.settings
    };

    return JSON.stringify(exportData, null, 2);
  }, [state]);

  const getMetricByName = useCallback((name: string): PerformanceMetric | null => {
    if (!state.current) return null;
    return state.current[name as keyof WebVitalsData] as PerformanceMetric || null;
  }, [state.current]);

  const getCurrentSummary = useCallback(() => {
    return collectorRef.current ? collectorRef.current.getPerformanceSummary() : null;
  }, []);

  // ✅ PERFORMANCE: Memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo<PerformanceContextValue>(() => ({
    // State
    current: state.current,
    isCollecting: state.isCollecting,
    history: state.history,
    trends: state.trends,
    settings: state.settings,
    collector: state.collector,
    
    // Actions
    startCollection,
    stopCollection,
    resetCollection,
    saveSnapshot,
    loadHistory,
    clearHistory,
    updateSettings,
    generateTrends,
    exportData,
    getMetricByName,
    getCurrentSummary
  }), [
    state,
    startCollection,
    stopCollection,
    resetCollection,
    saveSnapshot,
    loadHistory,
    clearHistory,
    updateSettings,
    generateTrends,
    exportData,
    getMetricByName,
    getCurrentSummary
  ]);

  // Auto-start collection if enabled
  useEffect(() => {
    if (state.settings.enableCollection && !state.isCollecting && collectorRef.current) {
      startCollection();
    }
  }, [state.settings.enableCollection, state.isCollecting, startCollection]);

  // Auto-save snapshots periodically
  useEffect(() => {
    if (!state.settings.enablePersistence || !state.current) return;

    const interval = setInterval(() => {
      if (state.current && Object.values(state.current).some(metric => 
        metric && typeof metric === 'object' && 'value' in metric
      )) {
        saveSnapshot();
      }
    }, 30000); // Save every 30 seconds

    // ✅ PERFORMANCE: Cleanup interval
    return () => clearInterval(interval);
  }, [state.settings.enablePersistence, state.current, saveSnapshot]);

  // Generate trends when history updates
  useEffect(() => {
    if (state.history.length > 0) {
      generateTrends();
    }
  }, [state.history.length, generateTrends]);

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
    </PerformanceContext.Provider>
  );
}

/**
 * Hook to access performance context
 * 
 * ✅ PERFORMANCE: Optimized context consumption
 */
export function usePerformance() {
  const context = useContext(PerformanceContext);
  
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  
  return context;
}

/**
 * Hook for simplified performance monitoring
 * 
 * ✅ PERFORMANCE: Lightweight hook for basic monitoring needs
 */
export function usePerformanceMonitoring() {
  const { current, isCollecting, startCollection, stopCollection, getCurrentSummary } = usePerformance();
  
  return {
    webVitals: current,
    isCollecting,
    summary: getCurrentSummary(),
    start: startCollection,
    stop: stopCollection
  };
}

/**
 * Hook for performance analytics and trends
 * 
 * ✅ PERFORMANCE: Focused hook for analytics features
 */
export function usePerformanceAnalytics() {
  const { history, trends, generateTrends, exportData, clearHistory } = usePerformance();
  
  return {
    history,
    trends,
    generateTrends,
    exportData,
    clearHistory,
    hasData: history.length > 0
  };
}