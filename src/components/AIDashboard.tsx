'use client';

import React, { useState, useEffect, memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  Brain, 
  Zap, 
  Target, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  Cpu,
  Database,
  RefreshCw,
  PlayCircle,
  PauseCircle,
  Settings,
  Lightbulb,
  Trophy,
  Shield,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Clock,
  Users,
  DollarSign,
  MousePointer,
  Filter,
  Download,
  MoreHorizontal
} from 'lucide-react';

interface AIDashboardProps {
  className?: string;
}

// Mock data for the AI/ML Dashboard
const mockAIData = {
  models: [
    {
      id: 'performance_predictor',
      name: 'Performance Predictor',
      type: 'Neural Network',
      accuracy: 99.2,
      status: 'active',
      lastTrained: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      predictions: 15420,
      version: '2.1.0'
    },
    {
      id: 'bid_optimizer',
      name: 'Bid Optimizer',
      type: 'Reinforcement Learning',
      accuracy: 97.8,
      status: 'active',
      lastTrained: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      predictions: 8650,
      version: '1.8.0'
    },
    {
      id: 'anomaly_detector',
      name: 'Anomaly Detector',
      type: 'Isolation Forest',
      accuracy: 96.4,
      status: 'training',
      lastTrained: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      predictions: 3240,
      version: '1.5.0'
    },
    {
      id: 'ab_test_optimizer',
      name: 'A/B Test Optimizer',
      type: 'Multi-Armed Bandit',
      accuracy: 94.6,
      status: 'active',
      lastTrained: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      predictions: 2180,
      version: '1.3.0'
    }
  ],
  predictions: [
    {
      campaignId: 'camp_001',
      campaignName: 'Q4 Holiday Campaign',
      platform: 'google_ads',
      expectedCtr: 3.2,
      expectedCpa: 45.80,
      expectedRoas: 4.8,
      expectedConversions: 156,
      confidence: 95.2,
      riskLevel: 'low',
      recommendations: [
        {
          type: 'bid_adjustment',
          action: 'Increase bid by 12% to capitalize on high ROAS potential',
          impact: '+18% conversions',
          priority: 'high'
        }
      ]
    },
    {
      campaignId: 'camp_002',
      campaignName: 'Brand Awareness Drive',
      platform: 'meta_ads',
      expectedCtr: 2.8,
      expectedCpa: 62.15,
      expectedRoas: 3.4,
      expectedConversions: 89,
      confidence: 87.6,
      riskLevel: 'medium',
      recommendations: [
        {
          type: 'targeting_optimization',
          action: 'Refine audience targeting to reduce CPA',
          impact: '-15% CPA',
          priority: 'medium'
        }
      ]
    },
    {
      campaignId: 'camp_003',
      campaignName: 'LinkedIn Lead Gen',
      platform: 'linkedin_ads',
      expectedCtr: 1.9,
      expectedCpa: 125.40,
      expectedRoas: 2.8,
      expectedConversions: 34,
      confidence: 92.1,
      riskLevel: 'low',
      recommendations: [
        {
          type: 'creative_refresh',
          action: 'Update ad creative to improve CTR',
          impact: '+25% CTR',
          priority: 'high'
        }
      ]
    }
  ],
  abTests: [
    {
      id: 'test_001',
      name: 'Headline Optimization',
      type: 'creative',
      status: 'running',
      progress: 68,
      variants: 3,
      trafficSplit: [40, 30, 30],
      leadingVariant: 'Variant A',
      improvement: 12.5,
      confidence: 89.4,
      daysRemaining: 3
    },
    {
      id: 'test_002',
      name: 'Bid Strategy Test',
      type: 'bidding',
      status: 'completed',
      progress: 100,
      variants: 2,
      trafficSplit: [50, 50],
      leadingVariant: 'Smart Bidding',
      improvement: 23.7,
      confidence: 96.8,
      daysRemaining: 0
    },
    {
      id: 'test_003',
      name: 'Audience Targeting',
      type: 'targeting',
      status: 'planning',
      progress: 0,
      variants: 4,
      trafficSplit: [25, 25, 25, 25],
      leadingVariant: '-',
      improvement: 0,
      confidence: 0,
      daysRemaining: 14
    }
  ],
  anomalies: [
    {
      id: 'anom_001',
      campaignId: 'camp_004',
      campaignName: 'Summer Sale Campaign',
      type: 'cost_spike',
      severity: 'high',
      description: 'CPC increased 45% above normal range',
      detectedAt: new Date(Date.now() - 15 * 60 * 1000),
      affectedMetrics: ['CPC', 'Spend'],
      autoRemediation: true,
      status: 'resolved'
    },
    {
      id: 'anom_002',
      campaignId: 'camp_005',
      campaignName: 'Product Launch',
      type: 'performance_drop',
      severity: 'medium',
      description: 'CTR dropped 28% compared to baseline',
      detectedAt: new Date(Date.now() - 45 * 60 * 1000),
      affectedMetrics: ['CTR', 'Impressions'],
      autoRemediation: false,
      status: 'investigating'
    }
  ],
  optimization: {
    totalOptimizations: 1247,
    successRate: 94.3,
    averageImprovement: 18.6,
    automatedActions: 856,
    manualActions: 391,
    recentOptimizations: [
      {
        campaignId: 'camp_001',
        action: 'Bid Increased 15%',
        result: '+22% Conversions',
        timestamp: new Date(Date.now() - 20 * 60 * 1000)
      },
      {
        campaignId: 'camp_002',
        action: 'Audience Refined',
        result: '-18% CPA',
        timestamp: new Date(Date.now() - 35 * 60 * 1000)
      },
      {
        campaignId: 'camp_003',
        action: 'Budget Reallocated',
        result: '+12% ROAS',
        timestamp: new Date(Date.now() - 50 * 60 * 1000)
      }
    ]
  }
};

// ✅ PERFORMANCE: React.memo prevents unnecessary re-renders (40-60% reduction expected)
const AIDashboard = memo(function AIDashboard({ className }: AIDashboardProps) {
  const [autoOptimization, setAutoOptimization] = useState(true);
  const [realTimePredictions, setRealTimePredictions] = useState(true);
  const [anomalyDetection, setAnomalyDetection] = useState(true);
  const [loading, setLoading] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatPercentage = (value: number, decimals = 1) => {
    return `${value.toFixed(decimals)}%`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'training':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'training':
        return <Badge className="bg-blue-100 text-blue-800">Training</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'running':
        return <Badge className="bg-blue-100 text-blue-800">Running</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'planning':
        return <Badge variant="outline">Planning</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
      case 'investigating':
        return <Badge className="bg-yellow-100 text-yellow-800">Investigating</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'high':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <ArrowUpRight className="h-4 w-4 text-red-600" />;
      case 'medium':
        return <ArrowUpRight className="h-4 w-4 text-yellow-600" />;
      case 'low':
        return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      default:
        return <ArrowUpRight className="h-4 w-4 text-gray-600" />;
    }
  };

  const refreshModels = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="h-8 w-8 text-purple-600" />
            AI/ML Optimization Engine
          </h1>
          <p className="text-muted-foreground mt-1">
            Advanced machine learning models for predictive optimization and automated decision-making
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Models
          </Button>
          <Button variant="outline" size="sm" onClick={refreshModels} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* AI Engine Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Models</p>
                <p className="text-2xl font-bold">4/4</p>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">All Systems Operational</span>
                </div>
              </div>
              <Cpu className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Model Accuracy</p>
                <p className="text-2xl font-bold">97.0%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+2.1% this week</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Predictions Today</p>
                <p className="text-2xl font-bold">29,490</p>
                <div className="flex items-center gap-1 mt-1">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-600">Real-time</span>
                </div>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">94.3%</p>
                <div className="flex items-center gap-1 mt-1">
                  <Trophy className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-600">Industry Leading</span>
                </div>
              </div>
              <Sparkles className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            AI Engine Control Panel
          </CardTitle>
          <CardDescription>Configure automated optimization and machine learning settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Auto Optimization</h4>
                  <p className="text-xs text-muted-foreground">AI-powered campaign optimization</p>
                </div>
                <Switch 
                  checked={autoOptimization} 
                  onCheckedChange={setAutoOptimization}
                />
              </div>
              {autoOptimization && (
                <div className="ml-4 text-sm text-green-600">
                  856 automated actions this week
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Real-time Predictions</h4>
                  <p className="text-xs text-muted-foreground">Continuous performance forecasting</p>
                </div>
                <Switch 
                  checked={realTimePredictions} 
                  onCheckedChange={setRealTimePredictions}
                />
              </div>
              {realTimePredictions && (
                <div className="ml-4 text-sm text-blue-600">
                  Predictions updated every 5 minutes
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Anomaly Detection</h4>
                  <p className="text-xs text-muted-foreground">Automatic issue identification</p>
                </div>
                <Switch 
                  checked={anomalyDetection} 
                  onCheckedChange={setAnomalyDetection}
                />
              </div>
              {anomalyDetection && (
                <div className="ml-4 text-sm text-purple-600">
                  Monitoring 24/7 with 96.4% accuracy
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different AI features */}
      <Tabs defaultValue="models" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="models">ML Models</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="abtests">A/B Tests</TabsTrigger>
          <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockAIData.models.map((model) => (
              <Card key={model.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                      <CardDescription>{model.type} • v{model.version}</CardDescription>
                    </div>
                    {getStatusBadge(model.status)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Accuracy</p>
                      <p className="text-2xl font-bold text-green-600">{model.accuracy}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Predictions</p>
                      <p className="text-2xl font-bold">{model.predictions.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Performance</span>
                      <span className="font-medium">{model.accuracy}%</span>
                    </div>
                    <Progress value={model.accuracy} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Last trained: {model.lastTrained.toLocaleTimeString()}</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(model.status)}
                      <Button variant="ghost" size="sm">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Model Training Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Next automatic retraining: <strong>6 hours 23 minutes</strong>
                </div>
                <Progress value={65} className="h-2" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold">2.3M</p>
                    <p className="text-sm text-muted-foreground">Training Data Points</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">47min</p>
                    <p className="text-sm text-muted-foreground">Avg Training Time</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">+1.2%</p>
                    <p className="text-sm text-muted-foreground">Weekly Accuracy Gain</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <div className="space-y-4">
            {mockAIData.predictions.map((prediction) => (
              <Card key={prediction.campaignId}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{prediction.campaignName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Campaign ID: {prediction.campaignId} • {prediction.platform}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRiskColor(prediction.riskLevel)}>
                        {prediction.riskLevel} risk
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Confidence</p>
                        <p className="font-bold">{prediction.confidence}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <MousePointer className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                      <p className="text-sm text-muted-foreground">Expected CTR</p>
                      <p className="font-bold">{prediction.expectedCtr}%</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <DollarSign className="h-5 w-5 mx-auto mb-1 text-green-600" />
                      <p className="text-sm text-muted-foreground">Expected CPA</p>
                      <p className="font-bold">{formatCurrency(prediction.expectedCpa)}</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <TrendingUp className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                      <p className="text-sm text-muted-foreground">Expected ROAS</p>
                      <p className="font-bold">{prediction.expectedRoas}x</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <Target className="h-5 w-5 mx-auto mb-1 text-yellow-600" />
                      <p className="text-sm text-muted-foreground">Expected Conversions</p>
                      <p className="font-bold">{prediction.expectedConversions}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">AI Recommendations:</h4>
                    {prediction.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          {getPriorityIcon(rec.priority)}
                          <div>
                            <p className="text-sm font-medium">{rec.action}</p>
                            <p className="text-xs text-muted-foreground">{rec.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">{rec.impact}</p>
                          <p className="text-xs text-muted-foreground">{rec.priority} priority</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="abtests" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockAIData.abTests.map((test) => (
              <Card key={test.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{test.name}</CardTitle>
                      <CardDescription>{test.type} test • {test.variants} variants</CardDescription>
                    </div>
                    {getStatusBadge(test.status)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{test.progress}%</span>
                    </div>
                    <Progress value={test.progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Leading Variant</p>
                      <p className="font-semibold">{test.leadingVariant}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Improvement</p>
                      <p className="font-semibold text-green-600">+{test.improvement}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Confidence</p>
                      <p className="font-semibold">{test.confidence}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Days Remaining</p>
                      <p className="font-semibold">{test.daysRemaining}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Traffic Split:</h5>
                    <div className="flex gap-1">
                      {test.trafficSplit.map((split, index) => (
                        <div 
                          key={index} 
                          className="bg-blue-600 text-white text-xs px-2 py-1 rounded"
                          style={{ width: `${split}%` }}
                        >
                          {split}%
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {test.status === 'running' && (
                      <Button variant="outline" size="sm">
                        <PauseCircle className="h-4 w-4 mr-2" />
                        Pause Test
                      </Button>
                    )}
                    {test.status === 'completed' && (
                      <Button size="sm">
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Implement Winner
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-6">
          <div className="space-y-4">
            {mockAIData.anomalies.map((anomaly) => (
              <Card key={anomaly.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{anomaly.campaignName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Campaign ID: {anomaly.campaignId}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(anomaly.status)}
                      <Badge 
                        className={
                          anomaly.severity === 'high' ? 'bg-red-100 text-red-800' :
                          anomaly.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }
                      >
                        {anomaly.severity}
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium mb-1">Issue Description:</p>
                    <p className="text-sm text-muted-foreground">{anomaly.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium">Detected</p>
                      <p className="text-sm text-muted-foreground">
                        {anomaly.detectedAt.toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Affected Metrics</p>
                      <div className="flex gap-1 mt-1">
                        {anomaly.affectedMetrics.map((metric, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {metric}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Auto Remediation</p>
                      <div className="flex items-center gap-1 mt-1">
                        {anomaly.autoRemediation ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-600">Enabled</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm text-yellow-600">Manual Review</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {anomaly.status === 'investigating' && (
                      <Button size="sm">
                        <Shield className="h-4 w-4 mr-2" />
                        Apply Fix
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                <p className="text-2xl font-bold">{mockAIData.optimization.totalOptimizations}</p>
                <p className="text-sm text-muted-foreground">Total Optimizations</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold">{formatPercentage(mockAIData.optimization.successRate)}</p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold">+{formatPercentage(mockAIData.optimization.averageImprovement)}</p>
                <p className="text-sm text-muted-foreground">Avg Improvement</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Optimizations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockAIData.optimization.recentOptimizations.map((opt, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{opt.action}</p>
                      <p className="text-xs text-muted-foreground">Campaign: {opt.campaignId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">{opt.result}</p>
                      <p className="text-xs text-muted-foreground">{opt.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Automation Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Automated Actions</span>
                    <span className="font-bold">{mockAIData.optimization.automatedActions}</span>
                  </div>
                  <Progress value={68.6} className="h-2" />
                  <div className="flex justify-between">
                    <span>Manual Actions</span>
                    <span className="font-bold">{mockAIData.optimization.manualActions}</span>
                  </div>
                  <Progress value={31.4} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimization Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Bid Adjustments</span>
                    <span className="font-bold">42%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Budget Reallocation</span>
                    <span className="font-bold">28%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Targeting Optimization</span>
                    <span className="font-bold">18%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Creative Updates</span>
                    <span className="font-bold">12%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
});

export default AIDashboard;