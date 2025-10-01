'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Target, 
  Globe, 
  BarChart3, 
  PieChart, 
  Settings, 
  RefreshCw,
  Eye,
  MousePointer,
  DollarSign,
  Users,
  Sparkles,
  Brain,
  Network,
  ArrowRightLeft,
  Trophy,
  AlertTriangle,
  CheckCircle,
  Layers,
  Workflow,
  Share2,
  Filter,
  Download,
  Play,
  Pause,
  MoreHorizontal
} from 'lucide-react';

// Platform-specific icons
const PlatformIcon = ({ platform }: { platform: string }) => {
  switch (platform.toLowerCase()) {
    case 'google_ads':
    case 'google':
      return <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">G</div>;
    case 'meta_ads':
    case 'meta':
    case 'facebook':
      return <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">f</div>;
    case 'linkedin_ads':
    case 'linkedin':
      return <div className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center text-white text-xs font-bold">in</div>;
    default:
      return <Globe className="w-6 h-6 text-gray-600" />;
  }
};

interface UnifiedPlatformDashboardProps {
  className?: string;
}

// Mock data for demonstration - in real implementation, this would come from API
const mockPlatformData = {
  platforms: [
    {
      id: 'google_ads',
      name: 'Google Ads',
      connected: true,
      status: 'active',
      campaignCount: 12,
      totalSpend: 45250,
      totalConversions: 326,
      cpa: 138.8,
      roas: 4.2,
      efficiency: 92,
      recommendedBudgetShare: 45,
      currentBudgetShare: 42,
      lastSync: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    },
    {
      id: 'meta_ads',
      name: 'Meta Ads',
      connected: true,
      status: 'active',
      campaignCount: 8,
      totalSpend: 32100,
      totalConversions: 198,
      cpa: 162.1,
      roas: 3.8,
      efficiency: 87,
      recommendedBudgetShare: 35,
      currentBudgetShare: 38,
      lastSync: new Date(Date.now() - 3 * 60 * 1000), // 3 minutes ago
    },
    {
      id: 'linkedin_ads',
      name: 'LinkedIn Ads',
      connected: true,
      status: 'active',
      campaignCount: 5,
      totalSpend: 18600,
      totalConversions: 89,
      cpa: 209.0,
      roas: 3.2,
      efficiency: 78,
      recommendedBudgetShare: 20,
      currentBudgetShare: 20,
      lastSync: new Date(Date.now() - 7 * 60 * 1000), // 7 minutes ago
    }
  ],
  crossPlatformMetrics: {
    totalSpend: 95950,
    totalConversions: 613,
    averageRoas: 3.8,
    audienceOverlap: {
      'google_meta': { overlapPercentage: 23.5, uniqueReach: 425000, duplicateReach: 128000 },
      'google_linkedin': { overlapPercentage: 12.8, uniqueReach: 380000, duplicateReach: 55000 },
      'meta_linkedin': { overlapPercentage: 8.2, uniqueReach: 320000, duplicateReach: 28000 }
    }
  },
  optimization: {
    enabled: true,
    strategy: 'performance',
    budgetDistribution: 'performance_weighted',
    autoRebalancing: true,
    nextRebalance: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
  },
  realTimeSync: {
    enabled: true,
    interval: 300000, // 5 minutes
    lastSync: new Date(Date.now() - 3 * 60 * 1000),
    errors: [],
    syncedPlatforms: ['google_ads', 'meta_ads', 'linkedin_ads']
  }
};

export default function UnifiedPlatformDashboard({ className }: UnifiedPlatformDashboardProps) {
  const [platformData, setPlatformData] = useState(mockPlatformData);
  const [loading, setLoading] = useState(false);
  const [autoOptimization, setAutoOptimization] = useState(true);
  const [realTimeSync, setRealTimeSync] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value: number, decimals = 1) => {
    return `${value.toFixed(decimals)}%`;
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 90) return 'text-green-600';
    if (efficiency >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: string, connected: boolean) => {
    if (!connected) return <Badge variant="destructive">Disconnected</Badge>;
    
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'paused':
        return <Badge variant="secondary">Paused</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const refreshPlatforms = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setPlatformData({
        ...platformData,
        realTimeSync: {
          ...platformData.realTimeSync,
          lastSync: new Date()
        }
      });
      setLoading(false);
    }, 1000);
  };

  const totalCampaigns = platformData.platforms.reduce((sum, p) => sum + p.campaignCount, 0);
  const connectedPlatforms = platformData.platforms.filter(p => p.connected).length;
  const averageEfficiency = platformData.platforms.reduce((sum, p) => sum + p.efficiency, 0) / platformData.platforms.length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Network className="h-8 w-8 text-blue-600" />
            Advertising Command Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Multi-platform advertising orchestration with AI-powered optimization
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm" onClick={refreshPlatforms} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Sync All
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Connected Platforms</p>
                <p className="text-2xl font-bold">{connectedPlatforms}/3</p>
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">All Connected</span>
                </div>
              </div>
              <Network className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Campaigns</p>
                <p className="text-2xl font-bold">{totalCampaigns}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+12% this week</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cross-Platform ROAS</p>
                <p className="text-2xl font-bold">{platformData.crossPlatformMetrics.averageRoas.toFixed(1)}x</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+8.3% vs last period</span>
                </div>
              </div>
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Efficiency</p>
                <p className="text-2xl font-bold">{averageEfficiency.toFixed(0)}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-600">Optimized</span>
                </div>
              </div>
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Multi-Platform Control Panel
          </CardTitle>
          <CardDescription>Manage cross-platform optimization and synchronization settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Auto Optimization</h4>
                  <p className="text-xs text-muted-foreground">Cross-platform budget optimization</p>
                </div>
                <Switch 
                  checked={autoOptimization} 
                  onCheckedChange={setAutoOptimization}
                />
              </div>
              {autoOptimization && (
                <div className="ml-4 text-sm text-green-600">
                  Next rebalance: {platformData.optimization.nextRebalance.toLocaleTimeString()}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium">Real-Time Sync</h4>
                  <p className="text-xs text-muted-foreground">Automatic data synchronization</p>
                </div>
                <Switch 
                  checked={realTimeSync} 
                  onCheckedChange={setRealTimeSync}
                />
              </div>
              {realTimeSync && (
                <div className="ml-4 text-sm text-blue-600">
                  Sync interval: {(platformData.realTimeSync.interval / 60000).toFixed(0)} minutes
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium">Performance Mode</h4>
                <p className="text-xs text-muted-foreground">Optimization strategy</p>
              </div>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                <option value="performance">Performance Weighted</option>
                <option value="cost">Cost Efficiency</option>
                <option value="reach">Maximum Reach</option>
                <option value="custom">Custom Strategy</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform Details Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="attribution">Attribution</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Platform Performance Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {platformData.platforms.map((platform) => (
              <Card key={platform.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <PlatformIcon platform={platform.id} />
                      <div>
                        <CardTitle className="text-lg">{platform.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {platform.campaignCount} campaigns
                        </CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(platform.status, platform.connected)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Spend</p>
                      <p className="text-lg font-bold">{formatCurrency(platform.totalSpend)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Conversions</p>
                      <p className="text-lg font-bold">{platform.totalConversions}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ROAS</p>
                      <p className="text-lg font-bold">{platform.roas.toFixed(1)}x</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">CPA</p>
                      <p className="text-lg font-bold">{formatCurrency(platform.cpa)}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Performance Efficiency</span>
                      <span className={`font-medium ${getEfficiencyColor(platform.efficiency)}`}>
                        {platform.efficiency}%
                      </span>
                    </div>
                    <Progress value={platform.efficiency} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Budget Allocation</span>
                      <span>
                        <span className="font-medium">{platform.currentBudgetShare}%</span>
                        {platform.recommendedBudgetShare !== platform.currentBudgetShare && (
                          <span className="ml-2 text-blue-600">
                            → {platform.recommendedBudgetShare}%
                          </span>
                        )}
                      </span>
                    </div>
                    <Progress value={platform.currentBudgetShare} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Last sync: {platform.lastSync.toLocaleTimeString()}</span>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Cross-Platform Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                Cross-Platform Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium">Platform Efficiency Ranking</h4>
                  {platformData.platforms
                    .sort((a, b) => b.efficiency - a.efficiency)
                    .map((platform, index) => (
                      <div key={platform.id} className="flex items-center justify-between p-2 bg-muted rounded">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                            {index + 1}
                          </span>
                          <PlatformIcon platform={platform.id} />
                          <span className="text-sm font-medium">{platform.name}</span>
                        </div>
                        <span className={`text-sm font-bold ${getEfficiencyColor(platform.efficiency)}`}>
                          {platform.efficiency}%
                        </span>
                      </div>
                    ))}
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Budget Recommendations</h4>
                  {platformData.platforms.map((platform) => (
                    <div key={platform.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <PlatformIcon platform={platform.id} />
                        <span className="text-sm">{platform.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {platform.currentBudgetShare}% → {platform.recommendedBudgetShare}%
                        </div>
                        {platform.recommendedBudgetShare > platform.currentBudgetShare ? (
                          <div className="text-xs text-green-600">+{platform.recommendedBudgetShare - platform.currentBudgetShare}% increase</div>
                        ) : platform.recommendedBudgetShare < platform.currentBudgetShare ? (
                          <div className="text-xs text-red-600">{platform.recommendedBudgetShare - platform.currentBudgetShare}% decrease</div>
                        ) : (
                          <div className="text-xs text-gray-500">No change</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Zap className="h-4 w-4 mr-2" />
                      Apply Budget Recommendations
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <ArrowRightLeft className="h-4 w-4 mr-2" />
                      Sync All Platforms
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Brain className="h-4 w-4 mr-2" />
                      Run Optimization Analysis
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {platformData.platforms.map((platform) => (
              <Card key={platform.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <PlatformIcon platform={platform.id} />
                      <div>
                        <CardTitle>{platform.name}</CardTitle>
                        <CardDescription>
                          Detailed platform management and configuration
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(platform.status, platform.connected)}
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Target className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                        <p className="text-lg font-bold">{platform.campaignCount}</p>
                        <p className="text-sm text-muted-foreground">Active Campaigns</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4 text-center">
                        <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-600" />
                        <p className="text-lg font-bold">{formatCurrency(platform.totalSpend)}</p>
                        <p className="text-sm text-muted-foreground">Total Spend</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4 text-center">
                        <MousePointer className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                        <p className="text-lg font-bold">{platform.totalConversions}</p>
                        <p className="text-sm text-muted-foreground">Conversions</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Trophy className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                        <p className="text-lg font-bold">{platform.roas.toFixed(1)}x</p>
                        <p className="text-sm text-muted-foreground">ROAS</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Last synchronized: {platform.lastSync.toLocaleString()}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sync Now
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="attribution" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-5 w-5" />
                Cross-Platform Attribution Analysis
              </CardTitle>
              <CardDescription>
                Understand customer journey across all advertising platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Attribution Model Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium">Attribution Model</label>
                      <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm">
                        <option value="data_driven">Data-Driven</option>
                        <option value="first_click">First Click</option>
                        <option value="last_click">Last Click</option>
                        <option value="linear">Linear</option>
                        <option value="time_decay">Time Decay</option>
                        <option value="position_based">Position Based</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Lookback Window</label>
                      <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm">
                        <option value="7">7 days</option>
                        <option value="14">14 days</option>
                        <option value="30">30 days</option>
                        <option value="60">60 days</option>
                        <option value="90">90 days</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Cross-Platform Tracking</label>
                      <div className="mt-2">
                        <Switch checked={true} onCheckedChange={() => {}} />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Platform Attribution</h4>
                  <div className="space-y-3">
                    {platformData.platforms.map((platform) => (
                      <div key={platform.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <PlatformIcon platform={platform.id} />
                          <div>
                            <p className="font-medium">{platform.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {((platform.totalConversions / platformData.crossPlatformMetrics.totalConversions) * 100).toFixed(1)}% of total conversions
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{platform.totalConversions} conversions</p>
                          <p className="text-sm text-muted-foreground">
                            Attributed Revenue: {formatCurrency(platform.totalSpend * platform.roas)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Cross-Platform Audience Analysis
              </CardTitle>
              <CardDescription>
                Analyze audience overlap and reach across platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Audience Overlap Analysis</h4>
                  <div className="space-y-3">
                    {Object.entries(platformData.crossPlatformMetrics.audienceOverlap).map(([pair, data]) => {
                      const [platform1, platform2] = pair.split('_');
                      return (
                        <div key={pair} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <PlatformIcon platform={platform1} />
                              <span className="text-sm">×</span>
                              <PlatformIcon platform={platform2} />
                            </div>
                            <div>
                              <p className="font-medium">
                                {platform1.charAt(0).toUpperCase() + platform1.slice(1)} × {platform2.charAt(0).toUpperCase() + platform2.slice(1)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {formatPercentage(data.overlapPercentage)} audience overlap
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{data.uniqueReach.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">Unique reach</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Eye className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <p className="text-2xl font-bold">2.8M</p>
                      <p className="text-sm text-muted-foreground">Total Unique Reach</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Share2 className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <p className="text-2xl font-bold">14.8%</p>
                      <p className="text-sm text-muted-foreground">Avg Overlap Rate</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Target className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                      <p className="text-2xl font-bold">89%</p>
                      <p className="text-sm text-muted-foreground">Reach Efficiency</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI-Powered Cross-Platform Optimization
              </CardTitle>
              <CardDescription>
                Advanced optimization recommendations and automated actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Optimization Recommendations</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-green-800">
                              Increase Google Ads Budget
                            </p>
                            <p className="text-xs text-green-700">
                              +15% budget increase could generate 23% more conversions based on current performance
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <ArrowRightLeft className="h-4 w-4 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-800">
                              Reallocate Meta Ads Budget
                            </p>
                            <p className="text-xs text-blue-700">
                              Move 8% of Meta budget to Google Ads for 12% efficiency improvement
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-yellow-800">
                              LinkedIn Performance Alert
                            </p>
                            <p className="text-xs text-yellow-700">
                              CPA increased 18% - consider audience refinement or bid adjustments
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Automated Actions</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Auto Budget Rebalancing</p>
                          <p className="text-xs text-muted-foreground">Automatically adjust budgets based on performance</p>
                        </div>
                        <Switch checked={true} onCheckedChange={() => {}} />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Bid Optimization</p>
                          <p className="text-xs text-muted-foreground">AI-powered bid adjustments across platforms</p>
                        </div>
                        <Switch checked={true} onCheckedChange={() => {}} />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="text-sm font-medium">Audience Expansion</p>
                          <p className="text-xs text-muted-foreground">Automatically expand high-performing audiences</p>
                        </div>
                        <Switch checked={false} onCheckedChange={() => {}} />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Performance Projections</h4>
                  <Card>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-green-600">+24%</p>
                          <p className="text-sm text-muted-foreground">Projected ROAS Improvement</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-blue-600">+18%</p>
                          <p className="text-sm text-muted-foreground">Projected Conversion Increase</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-purple-600">-12%</p>
                          <p className="text-sm text-muted-foreground">Projected CPA Reduction</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}