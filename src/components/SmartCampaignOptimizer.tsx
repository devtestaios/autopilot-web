'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Target, 
  DollarSign, 
  TrendingUp, 
  Bot, 
  Sparkles, 
  Clock, 
  Settings,
  Play,
  Pause,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Info,
  BarChart3,
  Filter,
  Calendar,
  ArrowUp,
  ArrowDown,
  Activity,
  Bell,
  Shield,
  Gauge,
  AlertCircle,
  TrendingDown,
  Eye,
  Zap as ZapIcon,
  Lightbulb,
  Rocket
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { Campaign } from '@/types';

// Enhanced interfaces for real-time features
interface PerformanceAlert {
  id: string;
  type: 'warning' | 'critical' | 'opportunity' | 'info';
  title: string;
  message: string;
  metric: string;
  value: number;
  threshold: number;
  timestamp: Date;
  campaignId?: string;
  autoAction?: () => Promise<void>;
}

interface CampaignHealth {
  score: number; // 0-100
  status: 'excellent' | 'good' | 'needs_attention' | 'critical';
  factors: {
    performance: number;
    budget_utilization: number;
    targeting_efficiency: number;
    creative_freshness: number;
    bid_optimization: number;
  };
  recommendations: string[];
}

interface RealTimeMetric {
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  unit: string;
  target?: number;
}

interface PredictiveInsight {
  id: string;
  type: 'forecast' | 'trend' | 'anomaly';
  title: string;
  description: string;
  confidence: number;
  timeframe: string;
  impact: 'positive' | 'negative' | 'neutral';
  action_recommended: boolean;
}

interface OptimizationAction {
  id: string;
  title: string;
  description: string;
  type: 'budget' | 'bidding' | 'targeting' | 'creative' | 'scheduling';
  impact: {
    metric: string;
    estimated_change: number;
    confidence: number;
  };
  automation_ready: boolean;
  requires_approval: boolean;
  estimated_time: string;
  risk_level: 'low' | 'medium' | 'high';
  data_sources: string[];
  action: () => Promise<void>;
}

interface SmartCampaignOptimizerProps {
  campaignId?: string;
  campaigns?: Campaign[];
  campaignData?: any;
  className?: string;
}

const SmartCampaignOptimizer: React.FC<SmartCampaignOptimizerProps> = ({
  campaignId,
  campaigns,
  campaignData,
  className
}) => {
  const [optimizations, setOptimizations] = useState<OptimizationAction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [autoOptimizationEnabled, setAutoOptimizationEnabled] = useState(true);
  const [selectedOptimization, setSelectedOptimization] = useState<string | null>(null);
  const [executingActions, setExecutingActions] = useState<Set<string>>(new Set());
  
  // New real-time features state
  const [realTimeMonitoring, setRealTimeMonitoring] = useState(true);
  const [performanceAlerts, setPerformanceAlerts] = useState<PerformanceAlert[]>([]);
  const [campaignHealth, setCampaignHealth] = useState<CampaignHealth | null>(null);
  const [realTimeMetrics, setRealTimeMetrics] = useState<RealTimeMetric[]>([]);
  const [predictiveInsights, setPredictiveInsights] = useState<PredictiveInsight[]>([]);
  const [activeTab, setActiveTab] = useState<'optimizations' | 'alerts' | 'health' | 'insights'>('optimizations');
  
  // Real-time monitoring interval
  useEffect(() => {
    if (!realTimeMonitoring) return;
    
    const interval = setInterval(() => {
      updateRealTimeMetrics();
      checkPerformanceAlerts();
      updateCampaignHealth();
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [realTimeMonitoring]);
  
  // Initialize real-time data
  useEffect(() => {
    updateRealTimeMetrics();
    checkPerformanceAlerts();
    updateCampaignHealth();
    generatePredictiveInsights();
  }, [campaignData]);

  const updateRealTimeMetrics = useCallback(() => {
    const metrics: RealTimeMetric[] = [
      {
        name: 'Cost per Click',
        value: 1.25,
        change: -0.08,
        trend: 'down',
        unit: '$',
        target: 1.50
      },
      {
        name: 'Click-through Rate',
        value: 3.42,
        change: 0.15,
        trend: 'up',
        unit: '%',
        target: 3.00
      },
      {
        name: 'Conversion Rate',
        value: 4.8,
        change: 0.3,
        trend: 'up',
        unit: '%',
        target: 4.0
      },
      {
        name: 'Cost per Acquisition',
        value: 24.50,
        change: -2.10,
        trend: 'down',
        unit: '$',
        target: 30.00
      },
      {
        name: 'Return on Ad Spend',
        value: 4.2,
        change: 0.3,
        trend: 'up',
        unit: 'x',
        target: 4.0
      }
    ];
    setRealTimeMetrics(metrics);
  }, []);

  const checkPerformanceAlerts = useCallback(() => {
    const alerts: PerformanceAlert[] = [
      {
        id: 'budget-threshold-1',
        type: 'warning',
        title: 'Budget Threshold Reached',
        message: 'Campaign "Summer Sale 2024" has consumed 85% of daily budget',
        metric: 'Budget Utilization',
        value: 85,
        threshold: 80,
        timestamp: new Date(),
        campaignId: 'summer-sale-2024'
      },
      {
        id: 'cpa-spike-1',
        type: 'critical',
        title: 'CPA Spike Detected',
        message: 'Cost per acquisition increased by 45% in the last 2 hours',
        metric: 'Cost per Acquisition',
        value: 35.80,
        threshold: 25.00,
        timestamp: new Date(),
        autoAction: async () => {
          console.log('Auto-adjusting bids to reduce CPA');
        }
      },
      {
        id: 'opportunity-1',
        type: 'opportunity',
        title: 'Scaling Opportunity',
        message: 'High-performing ad group ready for budget increase',
        metric: 'Performance Score',
        value: 92,
        threshold: 85,
        timestamp: new Date()
      }
    ];
    setPerformanceAlerts(alerts);
  }, []);

  const updateCampaignHealth = useCallback(() => {
    const health: CampaignHealth = {
      score: 82,
      status: 'good',
      factors: {
        performance: 85,
        budget_utilization: 78,
        targeting_efficiency: 88,
        creative_freshness: 72,
        bid_optimization: 90
      },
      recommendations: [
        'Refresh ad creatives - current creatives are 3 weeks old',
        'Expand high-performing audiences',
        'Optimize ad schedule for peak hours'
      ]
    };
    setCampaignHealth(health);
  }, []);

  const generatePredictiveInsights = useCallback(() => {
    const insights: PredictiveInsight[] = [
      {
        id: 'forecast-1',
        type: 'forecast',
        title: 'Performance Forecast',
        description: 'Based on current trends, expect 12% increase in conversions next week',
        confidence: 87,
        timeframe: 'Next 7 days',
        impact: 'positive',
        action_recommended: true
      },
      {
        id: 'anomaly-1',
        type: 'anomaly',
        title: 'Traffic Anomaly',
        description: 'Unusual traffic pattern detected from mobile devices',
        confidence: 94,
        timeframe: 'Last 4 hours',
        impact: 'neutral',
        action_recommended: false
      },
      {
        id: 'trend-1',
        type: 'trend',
        title: 'Seasonal Trend',
        description: 'Historical data suggests 25% traffic increase expected in 2 weeks',
        confidence: 79,
        timeframe: 'Next 14 days',
        impact: 'positive',
        action_recommended: true
      }
    ];
    setPredictiveInsights(insights);
  }, []);

  // Generate optimization recommendations
  useEffect(() => {
    const generateOptimizations = () => {
      const actions: OptimizationAction[] = [
        {
          id: 'budget-reallocation-1',
          title: 'Reallocate Budget to Top Performers',
          description: 'Move $1,500 budget from underperforming ad groups to top 3 converting ad groups',
          type: 'budget',
          impact: {
            metric: 'Conversions',
            estimated_change: 23.5,
            confidence: 94
          },
          automation_ready: true,
          requires_approval: false,
          estimated_time: '5 minutes',
          risk_level: 'low',
          data_sources: ['30-day performance data', 'Conversion tracking', 'Ad group analysis'],
          action: async () => {
            // Implementation for budget reallocation
            console.log('Executing budget reallocation...');
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
        },
        {
          id: 'bid-optimization-1',
          title: 'Optimize Bid Strategy',
          description: 'Switch to Target CPA bidding with enhanced CPC for better conversion optimization',
          type: 'bidding',
          impact: {
            metric: 'Cost per Acquisition',
            estimated_change: -18.2,
            confidence: 87
          },
          automation_ready: true,
          requires_approval: true,
          estimated_time: '10 minutes',
          risk_level: 'medium',
          data_sources: ['Historical CPA data', 'Bidding performance', 'Conversion patterns'],
          action: async () => {
            console.log('Executing bid optimization...');
            await new Promise(resolve => setTimeout(resolve, 4000));
          }
        },
        {
          id: 'audience-expansion-1',
          title: 'Expand High-Value Audiences',
          description: 'Add 3 similar audience segments based on your best converting customers',
          type: 'targeting',
          impact: {
            metric: 'Reach',
            estimated_change: 45.7,
            confidence: 82
          },
          automation_ready: false,
          requires_approval: true,
          estimated_time: '15 minutes',
          risk_level: 'medium',
          data_sources: ['Customer data', 'Lookalike modeling', 'Conversion analysis'],
          action: async () => {
            console.log('Executing audience expansion...');
            await new Promise(resolve => setTimeout(resolve, 5000));
          }
        },
        {
          id: 'schedule-optimization-1',
          title: 'Optimize Ad Schedule',
          description: 'Adjust ad schedule based on peak conversion times (2-6 PM weekdays)',
          type: 'scheduling',
          impact: {
            metric: 'Click-Through Rate',
            estimated_change: 31.4,
            confidence: 91
          },
          automation_ready: true,
          requires_approval: false,
          estimated_time: '3 minutes',
          risk_level: 'low',
          data_sources: ['Time-of-day analysis', 'Day-of-week patterns', 'Conversion timing'],
          action: async () => {
            console.log('Executing schedule optimization...');
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        },
        {
          id: 'creative-refresh-1',
          title: 'Creative Performance Enhancement',
          description: 'Replace 2 underperforming ad creatives with AI-generated variations',
          type: 'creative',
          impact: {
            metric: 'Click-Through Rate',
            estimated_change: 28.9,
            confidence: 79
          },
          automation_ready: false,
          requires_approval: true,
          estimated_time: '25 minutes',
          risk_level: 'high',
          data_sources: ['Creative performance data', 'A/B test results', 'Engagement metrics'],
          action: async () => {
            console.log('Executing creative refresh...');
            await new Promise(resolve => setTimeout(resolve, 6000));
          }
        }
      ];

      setOptimizations(actions);
    };

    generateOptimizations();
  }, [campaignData]);

  const executeOptimization = async (optimization: OptimizationAction) => {
    setExecutingActions(prev => new Set(prev).add(optimization.id));
    
    try {
      await optimization.action();
      // Show success notification
      console.log(`Successfully executed: ${optimization.title}`);
    } catch (error) {
      console.error(`Failed to execute: ${optimization.title}`, error);
    } finally {
      setExecutingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(optimization.id);
        return newSet;
      });
    }
  };

  const analyzeNewOptimizations = async () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsAnalyzing(false);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'budget': return DollarSign;
      case 'bidding': return Target;
      case 'targeting': return Bot;
      case 'creative': return Sparkles;
      case 'scheduling': return Clock;
      default: return Settings;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'budget': return 'text-green-500';
      case 'bidding': return 'text-blue-500';
      case 'targeting': return 'text-purple-500';
      case 'creative': return 'text-pink-500';
      case 'scheduling': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Smart Campaign Optimizer
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              AI-powered optimization recommendations and automation
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Auto-Optimization</span>
            <button
              onClick={() => setAutoOptimizationEnabled(!autoOptimizationEnabled)}
              className={cn(
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                autoOptimizationEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
              )}
            >
              <span
                className={cn(
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  autoOptimizationEnabled ? 'translate-x-6' : 'translate-x-1'
                )}
              />
            </button>
          </div>
          <button
            onClick={analyzeNewOptimizations}
            disabled={isAnalyzing}
            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className={cn('h-4 w-4', isAnalyzing && 'animate-spin')} />
            <span>{isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}</span>
          </button>
        </div>
      </div>

      {/* Real-time Monitoring Toggle */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
        <div className="flex items-center space-x-3">
          <Activity className="h-5 w-5 text-blue-500" />
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Real-time Monitoring</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Live performance tracking and alerts</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {realTimeMonitoring ? 'Active' : 'Inactive'}
          </span>
          <button
            onClick={() => setRealTimeMonitoring(!realTimeMonitoring)}
            className={cn(
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              realTimeMonitoring ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
            )}
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                realTimeMonitoring ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'optimizations', label: 'Optimizations', icon: Zap },
            { id: 'alerts', label: 'Alerts', icon: Bell },
            { id: 'health', label: 'Health Score', icon: Gauge },
            { id: 'insights', label: 'Insights', icon: Eye }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={cn(
                'flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                activeTab === id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
              {id === 'alerts' && performanceAlerts.length > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {performanceAlerts.length}
                </Badge>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Content based on active tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'optimizations' && (
          <motion.div
            key="optimizations"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Optimization Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 mb-2">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Available Actions</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{optimizations.length}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">optimization opportunities</p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Auto-Ready</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {optimizations.filter(o => o.automation_ready).length}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">can run automatically</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Est. Impact</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">+24%</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">average improvement</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Setup Time</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">8 min</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">average implementation</p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'alerts' && (
          <motion.div
            key="alerts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="space-y-4">
              {performanceAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">All Clear!</h3>
                  <p className="text-gray-600 dark:text-gray-400">No performance alerts at this time.</p>
                </div>
              ) : (
                performanceAlerts.map((alert) => (
                  <Card key={alert.id} className={cn(
                    'border-l-4',
                    alert.type === 'critical' && 'border-l-red-500 bg-red-50 dark:bg-red-900/20',
                    alert.type === 'warning' && 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
                    alert.type === 'opportunity' && 'border-l-green-500 bg-green-50 dark:bg-green-900/20',
                    alert.type === 'info' && 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  )}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {alert.type === 'critical' && <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />}
                          {alert.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />}
                          {alert.type === 'opportunity' && <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />}
                          {alert.type === 'info' && <Info className="h-5 w-5 text-blue-500 mt-0.5" />}
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{alert.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{alert.message}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                              <span>{alert.metric}: {alert.value}{alert.metric.includes('Rate') ? '%' : ''}</span>
                              <span>Threshold: {alert.threshold}</span>
                              <span>{alert.timestamp.toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>
                        {alert.autoAction && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => alert.autoAction?.()}
                            className="ml-4"
                          >
                            Auto-Fix
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'health' && campaignHealth && (
          <motion.div
            key="health"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="space-y-6">
              {/* Overall Health Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Gauge className="h-5 w-5" />
                    <span>Campaign Health Score</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-6">
                    <div className="relative w-24 h-24">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          className="text-gray-200 dark:text-gray-700"
                          transform="translate(36, 36)"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                          strokeDasharray={`${(campaignHealth.score / 100) * 62.83} 62.83`}
                          className={cn(
                            campaignHealth.score >= 80 ? 'text-green-500' :
                            campaignHealth.score >= 60 ? 'text-yellow-500' :
                            'text-red-500'
                          )}
                          transform="translate(36, 36)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          {campaignHealth.score}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {campaignHealth.status === 'excellent' && 'Excellent'}
                        {campaignHealth.status === 'good' && 'Good'}
                        {campaignHealth.status === 'needs_attention' && 'Needs Attention'}
                        {campaignHealth.status === 'critical' && 'Critical'}
                      </h3>
                      <Badge 
                        variant={
                          campaignHealth.status === 'excellent' ? 'default' :
                          campaignHealth.status === 'good' ? 'secondary' :
                          campaignHealth.status === 'needs_attention' ? 'outline' :
                          'destructive'
                        }
                      >
                        {campaignHealth.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Health Factors */}
                  <div className="mt-6 space-y-3">
                    {Object.entries(campaignHealth.factors).map(([factor, score]) => (
                      <div key={factor} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                          {factor.replace('_', ' ')}
                        </span>
                        <div className="flex items-center space-x-2">
                          <Progress value={score} className="w-20" />
                          <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                            {score}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recommendations */}
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Recommendations</h4>
                    <ul className="space-y-2">
                      {campaignHealth.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-400">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {activeTab === 'insights' && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="space-y-4">
              {predictiveInsights.map((insight) => (
                <Card key={insight.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {insight.type === 'forecast' && <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />}
                        {insight.type === 'trend' && <BarChart3 className="h-5 w-5 text-purple-500 mt-0.5" />}
                        {insight.type === 'anomaly' && <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">{insight.title}</h4>
                            <Badge 
                              variant={insight.impact === 'positive' ? 'default' : insight.impact === 'negative' ? 'destructive' : 'secondary'}
                            >
                              {insight.impact}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{insight.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                            <span>Confidence: {insight.confidence}%</span>
                            <span>Timeframe: {insight.timeframe}</span>
                          </div>
                        </div>
                      </div>
                      {insight.action_recommended && (
                        <Button size="sm" variant="outline" className="ml-4">
                          <Rocket className="h-3 w-3 mr-1" />
                          Take Action
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Real-time Metrics Dashboard (only show when monitoring is active) */}
      {realTimeMonitoring && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
            <Activity className="h-4 w-4 text-green-500" />
            <span>Live Performance Metrics</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Real-time
            </Badge>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {realTimeMetrics.map((metric) => (
              <div key={metric.name} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{metric.name}</span>
                  {metric.trend === 'up' && <ArrowUp className="h-3 w-3 text-green-500" />}
                  {metric.trend === 'down' && <ArrowDown className="h-3 w-3 text-red-500" />}
                  {metric.trend === 'stable' && <div className="h-3 w-3 rounded-full bg-gray-400" />}
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {metric.unit === '$' && metric.unit}{metric.value}{metric.unit !== '$' && metric.unit}
                  </span>
                  <span className={cn(
                    'text-xs',
                    metric.change > 0 ? 'text-green-600' : metric.change < 0 ? 'text-red-600' : 'text-gray-500'
                  )}>
                    {metric.change > 0 ? '+' : ''}{metric.change}{metric.unit}
                  </span>
                </div>
                {metric.target && (
                  <div className="mt-1">
                    <Progress 
                      value={(metric.value / metric.target) * 100} 
                      className="h-1"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Original Optimization Actions (only show in optimizations tab) */}
      {activeTab === 'optimizations' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Available Actions</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{optimizations.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">optimization opportunities</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Potential Impact</span>
              </div>
              <p className="text-2xl font-bold text-green-600">+$4,200</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">estimated monthly savings</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Auto-Ready</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                {optimizations.filter(o => o.automation_ready).length}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">can auto-execute</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-2">
                <Bot className="h-5 w-5 text-pink-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Confidence</span>
              </div>
              <p className="text-2xl font-bold text-pink-600">
                {Math.round(optimizations.reduce((acc, o) => acc + o.impact.confidence, 0) / optimizations.length)}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">average confidence</p>
            </div>
          </div>

          {/* Optimization Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recommended Optimizations
            </h3>
            
            {optimizations.map((optimization, index) => {
              const TypeIcon = getTypeIcon(optimization.type);
              const isExecuting = executingActions.has(optimization.id);
              
              return (
                <motion.div
                  key={optimization.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={cn('p-2 rounded-lg bg-gray-100 dark:bg-gray-700')}>
                          <TypeIcon className={cn('h-5 w-5', getTypeColor(optimization.type))} />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {optimization.title}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={cn('px-2 py-1 text-xs font-medium rounded-full', getRiskColor(optimization.risk_level))}>
                              {optimization.risk_level} risk
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {optimization.type}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              • Est. {optimization.estimated_time}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {optimization.description}
                      </p>

                      {/* Impact Prediction */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Expected Impact on {optimization.impact.metric}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                {optimization.impact.estimated_change > 0 ? '+' : ''}{optimization.impact.estimated_change}%
                              </span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                confidence: {optimization.impact.confidence}%
                              </span>
                            </div>
                          </div>
                          <div className="w-16 h-16 relative">
                            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                              <circle
                                cx="18"
                                cy="18"
                                r="16"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="text-gray-200 dark:text-gray-700"
                              />
                              <circle
                                cx="18"
                                cy="18"
                                r="16"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeDasharray={`${optimization.impact.confidence}, 100`}
                                className="text-blue-500"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-xs font-medium text-gray-900 dark:text-white">
                                {optimization.impact.confidence}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Data Sources */}
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Based on analysis of:</p>
                        <div className="flex flex-wrap gap-1">
                          {optimization.data_sources.map((source, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                            >
                              {source}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2 ml-6">
                      {optimization.automation_ready && !optimization.requires_approval && (
                        <button
                          onClick={() => executeOptimization(optimization)}
                          disabled={isExecuting}
                          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-colors disabled:opacity-50"
                        >
                          {isExecuting ? (
                            <>
                              <RefreshCw className="h-4 w-4 animate-spin" />
                              <span>Executing...</span>
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4" />
                              <span>Auto-Apply</span>
                            </>
                          )}
                        </button>
                      )}
                      
                      {optimization.requires_approval && (
                        <button
                          onClick={() => executeOptimization(optimization)}
                          disabled={isExecuting}
                          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-colors disabled:opacity-50"
                        >
                          {isExecuting ? (
                            <>
                              <RefreshCw className="h-4 w-4 animate-spin" />
                              <span>Applying...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              <span>Apply with Approval</span>
                            </>
                          )}
                        </button>
                      )}
                      
                      {!optimization.automation_ready && (
                        <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg">
                          <Settings className="h-4 w-4" />
                          <span>Manual Setup</span>
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default SmartCampaignOptimizer;