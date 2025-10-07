'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Target,
  DollarSign,
  Zap,
  Play,
  Pause,
  Eye,
  BarChart3,
  Activity,
  Bot
} from 'lucide-react';

interface OptimizationRecommendation {
  campaign_id: string;
  campaign_name: string;
  platform: string;
  optimization_type: string;
  expected_impact: string;
  confidence_score: number;
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
  auto_execute: boolean;
  created_at: string;
}

interface CampaignStatus {
  campaign_id: string;
  optimization_score: number;
  status: 'optimal' | 'needs_attention' | 'critical';
  active_optimizations: number;
  last_optimization: string;
  recommendations_count: number;
}

interface PerformanceInsight {
  category: string;
  score: number;
  insight: string;
  recommendation: string;
}

interface OptimizationDashboardData {
  total_recommendations: number;
  auto_executable: number;
  high_priority: number;
  recommendations: OptimizationRecommendation[];
}

const RealTimeOptimizationDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<OptimizationDashboardData | null>(null);
  const [campaignStatuses, setCampaignStatuses] = useState<CampaignStatus[]>([]);
  const [performanceInsights, setPerformanceInsights] = useState<PerformanceInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState<string[]>([]);
  const [autoMode, setAutoMode] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    loadOptimizationData();
    loadCampaignStatuses();
    loadPerformanceInsights();
    
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      if (autoMode) {
        loadOptimizationData();
        loadCampaignStatuses();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [autoMode]);

  const loadOptimizationData = async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api-1.onrender.com';
      const response = await fetch(`${API_BASE}/api/v1/optimization/recommendations/all`);
      const data = await response.json();
      setDashboardData(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load optimization data:', error);
    }
  };

  const loadCampaignStatuses = async () => {
    // Mock campaign IDs - in real app, fetch from campaigns API
    const campaignIds = ['campaign_1', 'campaign_2', 'campaign_3'];
    
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api-1.onrender.com';
      const statuses = await Promise.all(
        campaignIds.map(async (id) => {
          const response = await fetch(`${API_BASE}/api/v1/optimization/status/${id}`);
          return response.json();
        })
      );
      setCampaignStatuses(statuses);
    } catch (error) {
      console.error('Failed to load campaign statuses:', error);
    }
  };

  const loadPerformanceInsights = async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api-1.onrender.com';
      const response = await fetch(`${API_BASE}/api/v1/optimization/performance-insights/campaign_1`);
      const data = await response.json();
      setPerformanceInsights(data.key_insights || []);
    } catch (error) {
      console.error('Failed to load performance insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const executeOptimization = async (campaignId: string, optimizationType: string) => {
    setExecuting(prev => [...prev, campaignId]);
    
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api-1.onrender.com';
      const response = await fetch(`${API_BASE}/api/v1/optimization/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recommendation_id: `rec_${campaignId}_${Date.now()}`,
          campaign_id: campaignId,
          optimization_type: optimizationType,
          recommended_value: 150.0,
          force_execute: false
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Refresh data after successful execution
        await loadOptimizationData();
        await loadCampaignStatuses();
      }
      
      console.log('Optimization executed:', result);
    } catch (error) {
      console.error('Failed to execute optimization:', error);
    } finally {
      setExecuting(prev => prev.filter(id => id !== campaignId));
    }
  };

  const batchExecuteOptimizations = async () => {
    if (!dashboardData) return;
    
    const autoExecutableRecs = dashboardData.recommendations.filter(r => r.auto_execute);
    const campaignIds = autoExecutableRecs.map(r => r.campaign_id);
    const optimizationTypes = autoExecutableRecs.map(r => r.optimization_type);
    
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api-1.onrender.com';
      const response = await fetch(`${API_BASE}/api/v1/optimization/batch-execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaign_ids: campaignIds,
          optimization_types: optimizationTypes
        })
      });
      
      const result = await response.json();
      console.log('Batch execution result:', result);
      
      // Refresh data
      await loadOptimizationData();
      await loadCampaignStatuses();
    } catch (error) {
      console.error('Failed to execute batch optimizations:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-green-600 dark:text-green-400';
      case 'needs_attention': return 'text-yellow-600 dark:text-yellow-400';
      case 'critical': return 'text-red-600 dark:text-red-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimal': return <CheckCircle className="w-4 h-4" />;
      case 'needs_attention': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <TrendingDown className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Bot className="w-8 h-8 text-blue-600" />
            Real-Time Optimization Engine
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            AI-powered campaign optimization and performance monitoring
          </p>
          {lastUpdate && (
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant={autoMode ? "default" : "outline"}
            onClick={() => setAutoMode(!autoMode)}
            className="flex items-center gap-2"
          >
            {autoMode ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {autoMode ? 'Auto Mode ON' : 'Auto Mode OFF'}
          </Button>
          
          <Button
            onClick={batchExecuteOptimizations}
            disabled={!dashboardData?.auto_executable}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Zap className="w-4 h-4" />
            Execute All ({dashboardData?.auto_executable || 0})
          </Button>
        </div>
      </div>

      {/* Live Status Indicator */}
      <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-700 dark:text-green-300">
            Live Optimization Engine Active
          </span>
        </div>
        <Activity className="w-4 h-4 text-green-600" />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Total Recommendations
                </p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  {dashboardData?.total_recommendations || 0}
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  Auto-Executable
                </p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                  {dashboardData?.auto_executable || 0}
                </p>
              </div>
              <Zap className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-700 dark:text-red-300">
                  High Priority
                </p>
                <p className="text-3xl font-bold text-red-900 dark:text-red-100">
                  {dashboardData?.high_priority || 0}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Active Campaigns
                </p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                  {campaignStatuses.length}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Campaign Optimization Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {campaignStatuses.map((status) => (
              <div
                key={status.campaign_id}
                className="p-4 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Campaign {status.campaign_id.replace('campaign_', '')}
                  </h3>
                  <div className={`flex items-center gap-1 ${getStatusColor(status.status)}`}>
                    {getStatusIcon(status.status)}
                    <span className="text-sm capitalize">{status.status.replace('_', ' ')}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Optimization Score</span>
                      <span className="font-medium">{status.optimization_score}%</span>
                    </div>
                    <Progress value={status.optimization_score} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Recommendations</span>
                    <Badge variant="secondary" className="text-xs">
                      {status.recommendations_count}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Active Optimizations</span>
                    <Badge variant={status.active_optimizations > 0 ? "default" : "outline"} className="text-xs">
                      {status.active_optimizations}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            AI Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {performanceInsights.map((insight, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {insight.category}
                  </h3>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      insight.score >= 80 ? 'border-green-500 text-green-700' :
                      insight.score >= 60 ? 'border-yellow-500 text-yellow-700' :
                      'border-red-500 text-red-700'
                    }`}
                  >
                    Score: {insight.score}%
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {insight.insight}
                </p>
                
                <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="font-medium">{insight.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Live Optimization Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData?.recommendations.map((rec, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {rec.campaign_name}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {rec.platform}
                      </Badge>
                      <Badge className={`text-xs ${getPriorityColor(rec.priority)}`}>
                        {rec.priority} priority
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Type: <span className="font-medium capitalize">{rec.optimization_type.replace('_', ' ')}</span>
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Expected: <span className="font-medium text-green-600">{rec.expected_impact}</span>
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Confidence: <span className="font-medium">{Math.round(rec.confidence_score * 100)}%</span>
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {rec.reasoning}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {rec.auto_execute && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Auto-Execute
                      </Badge>
                    )}
                    
                    <Button
                      size="sm"
                      onClick={() => executeOptimization(rec.campaign_id, rec.optimization_type)}
                      disabled={executing.includes(rec.campaign_id)}
                      className="flex items-center gap-1"
                    >
                      {executing.includes(rec.campaign_id) ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                          Executing...
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3" />
                          Execute
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )) || (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No optimization recommendations available</p>
                <p className="text-sm">The AI is analyzing your campaigns...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeOptimizationDashboard;