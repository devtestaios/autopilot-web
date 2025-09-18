'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Radar, 
  TrendingUp, 
  TrendingDown,
  Search,
  Eye,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Activity,
  Users,
  DollarSign,
  MousePointer,
  Lightbulb,
  Trophy,
  Shield,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Clock,
  Filter,
  Download,
  MoreHorizontal,
  Building,
  Calendar,
  MapPin,
  Star,
  ThumbsUp,
  Share,
  MessageSquare,
  Heart,
  Bookmark,
  Link,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

interface CompetitiveIntelligenceProps {
  className?: string;
}

// Mock competitor data
const mockCompetitorData = {
  competitors: [
    {
      id: 'comp_001',
      name: 'TechFlow Solutions',
      domain: 'techflow.com',
      industry: 'B2B SaaS',
      size: 'Enterprise',
      adSpend: 125000,
      adSpendTrend: 12.5,
      marketShare: 23.4,
      rankingPosition: 2,
      adCount: 34,
      platforms: ['google_ads', 'linkedin_ads', 'meta_ads'],
      strongestPlatform: 'linkedin_ads',
      weakestPlatform: 'meta_ads',
      avgCPC: 3.45,
      avgCTR: 2.8,
      estimatedConversions: 2340,
      threat_level: 'high',
      trending: 'up',
      lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 'comp_002',
      name: 'InnovateCorp',
      domain: 'innovatecorp.io',
      industry: 'B2B SaaS',
      size: 'Mid-market',
      adSpend: 89000,
      adSpendTrend: -5.2,
      marketShare: 18.7,
      rankingPosition: 3,
      adCount: 28,
      platforms: ['google_ads', 'meta_ads'],
      strongestPlatform: 'google_ads',
      weakestPlatform: 'meta_ads',
      avgCPC: 2.89,
      avgCTR: 3.2,
      estimatedConversions: 1890,
      threat_level: 'medium',
      trending: 'down',
      lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000)
    },
    {
      id: 'comp_003',
      name: 'DataDrive Inc',
      domain: 'datadrive.com',
      industry: 'B2B SaaS',
      size: 'Startup',
      adSpend: 45000,
      adSpendTrend: 34.8,
      marketShare: 8.9,
      rankingPosition: 6,
      adCount: 19,
      platforms: ['google_ads', 'linkedin_ads'],
      strongestPlatform: 'google_ads',
      weakestPlatform: 'linkedin_ads',
      avgCPC: 4.12,
      avgCTR: 2.1,
      estimatedConversions: 780,
      threat_level: 'low',
      trending: 'up',
      lastUpdated: new Date(Date.now() - 30 * 60 * 1000)
    }
  ],
  marketInsights: {
    totalMarketSize: 450000,
    yourMarketShare: 28.9,
    growthRate: 15.6,
    averageCPC: 3.24,
    averageCTR: 2.7,
    topKeywords: [
      { keyword: 'project management software', volume: 12500, difficulty: 78 },
      { keyword: 'team collaboration tools', volume: 8900, difficulty: 65 },
      { keyword: 'workflow automation', volume: 6700, difficulty: 82 },
      { keyword: 'business productivity', volume: 5400, difficulty: 59 },
      { keyword: 'remote work solutions', volume: 4800, difficulty: 71 }
    ],
    seasonalTrends: [
      { month: 'Jan', yourSpend: 45000, competitorAvg: 38000 },
      { month: 'Feb', yourSpend: 52000, competitorAvg: 41000 },
      { month: 'Mar', yourSpend: 48000, competitorAvg: 44000 },
      { month: 'Apr', yourSpend: 55000, competitorAvg: 47000 },
      { month: 'May', yourSpend: 59000, competitorAvg: 52000 },
      { month: 'Jun', yourSpend: 62000, competitorAvg: 55000 }
    ]
  },
  adAnalysis: [
    {
      competitorId: 'comp_001',
      competitorName: 'TechFlow Solutions',
      adId: 'ad_001',
      headline: 'Transform Your Workflow with AI-Powered Project Management',
      description: 'Boost team productivity by 40% with our intelligent task automation and real-time collaboration features.',
      platform: 'google_ads',
      estimatedImpressions: 15000,
      estimatedClicks: 420,
      estimatedCTR: 2.8,
      sentiment: 'positive',
      keywords: ['project management', 'AI workflow', 'team productivity'],
      creativeScore: 87,
      performanceRating: 'high',
      firstSeen: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isActive: true
    },
    {
      competitorId: 'comp_001',
      competitorName: 'TechFlow Solutions',
      adId: 'ad_002',
      headline: 'Join 50,000+ Teams Already Using TechFlow',
      description: 'See why leading companies choose TechFlow for project management. Start your free trial today.',
      platform: 'linkedin_ads',
      estimatedImpressions: 8500,
      estimatedClicks: 238,
      estimatedCTR: 2.8,
      sentiment: 'positive',
      keywords: ['social proof', 'free trial', 'enterprise'],
      creativeScore: 92,
      performanceRating: 'high',
      firstSeen: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      lastSeen: new Date(Date.now() - 1 * 60 * 60 * 1000),
      isActive: true
    },
    {
      competitorId: 'comp_002',
      competitorName: 'InnovateCorp',
      adId: 'ad_003',
      headline: 'The Future of Work is Here - Try InnovateCorp',
      description: 'Revolutionary collaboration platform that adapts to your team&apos;s workflow. 30-day money-back guarantee.',
      platform: 'google_ads',
      estimatedImpressions: 12000,
      estimatedClicks: 384,
      estimatedCTR: 3.2,
      sentiment: 'positive',
      keywords: ['future of work', 'collaboration', 'guarantee'],
      creativeScore: 85,
      performanceRating: 'high',
      firstSeen: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      lastSeen: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isActive: true
    }
  ],
  gapAnalysis: {
    opportunities: [
      {
        type: 'keyword_gap',
        title: 'Untapped High-Value Keywords',
        description: 'Competitors are not targeting "AI-powered project management" (8.5K searches/month)',
        impact: 'high',
        difficulty: 'medium',
        estimatedTraffic: 2300,
        estimatedCost: 12000
      },
      {
        type: 'geographic_gap',
        title: 'Underserved Geographic Markets',
        description: 'Limited competitor presence in European markets, especially Germany and France',
        impact: 'medium',
        difficulty: 'low',
        estimatedTraffic: 1800,
        estimatedCost: 8500
      },
      {
        type: 'audience_gap',
        title: 'Startup Segment Opportunity',
        description: 'Competitors focus on enterprise; startup segment (1-50 employees) is underserved',
        impact: 'high',
        difficulty: 'low',
        estimatedTraffic: 3200,
        estimatedCost: 15000
      },
      {
        type: 'content_gap',
        title: 'Video Ad Creative Gap',
        description: 'Only 15% of competitor ads use video; opportunity for higher engagement',
        impact: 'medium',
        difficulty: 'medium',
        estimatedTraffic: 1200,
        estimatedCost: 6000
      }
    ],
    threats: [
      {
        type: 'aggressive_bidding',
        title: 'TechFlow Increasing Ad Spend',
        description: 'TechFlow has increased ad spend by 45% in the last month, driving up CPCs',
        severity: 'high',
        impact: 'Estimated 18% increase in our CPCs',
        timeline: 'Immediate',
        recommendation: 'Consider geographic bid adjustments or long-tail keyword targeting'
      },
      {
        type: 'new_competitor',
        title: 'New Enterprise Player Entry',
        description: 'Microsoft announced competing product launch targeting our core market',
        severity: 'critical',
        impact: 'Potential 25% market share loss',
        timeline: '3-6 months',
        recommendation: 'Accelerate feature development and strengthen customer retention'
      }
    ]
  }
};

export default function CompetitiveIntelligence({ className }: CompetitiveIntelligenceProps) {
  const [selectedCompetitor, setSelectedCompetitor] = useState(mockCompetitorData.competitors[0]);
  const [loading, setLoading] = useState(false);

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

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'text-red-600 bg-red-100';
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-purple-600';
      case 'medium':
        return 'text-blue-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? 
      <TrendingUp className="h-4 w-4 text-green-600" /> : 
      <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  const refreshData = async () => {
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
            <Radar className="h-8 w-8 text-blue-600" />
            Competitive Intelligence
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time competitor analysis and market insights powered by AI
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm" onClick={refreshData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Market Size</p>
                <p className="text-2xl font-bold">{formatCurrency(mockCompetitorData.marketInsights.totalMarketSize)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">+{mockCompetitorData.marketInsights.growthRate}% YoY</span>
                </div>
              </div>
              <Globe className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Your Market Share</p>
                <p className="text-2xl font-bold">{formatPercentage(mockCompetitorData.marketInsights.yourMarketShare)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Trophy className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-600">Market Leader</span>
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
                <p className="text-sm font-medium text-muted-foreground">Tracked Competitors</p>
                <p className="text-2xl font-bold">{mockCompetitorData.competitors.length}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-600">24/7 Monitoring</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Threat Level</p>
                <p className="text-2xl font-bold text-yellow-600">Medium</p>
                <div className="flex items-center gap-1 mt-1">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-600">2 Active Threats</span>
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Intelligence Tabs */}
      <Tabs defaultValue="competitors" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="ads">Ad Analysis</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="gaps">Gap Analysis</TabsTrigger>
          <TabsTrigger value="insights">Market Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="competitors" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Competitor List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tracked Competitors</h3>
              {mockCompetitorData.competitors.map((competitor) => (
                <div
                  key={competitor.id} 
                  className="cursor-pointer"
                  onClick={() => setSelectedCompetitor(competitor)}
                >
                  <Card className={`transition-all ${selectedCompetitor.id === competitor.id ? 'ring-2 ring-blue-500' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{competitor.name}</h4>
                        <p className="text-sm text-muted-foreground">{competitor.domain}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(competitor.trending)}
                        <Badge className={getThreatLevelColor(competitor.threat_level)}>
                          {competitor.threat_level}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Ad Spend:</span>
                        <span className="font-medium ml-1">{formatCurrency(competitor.adSpend)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Market Share:</span>
                        <span className="font-medium ml-1">{formatPercentage(competitor.marketShare)}</span>
                      </div>
                    </div>
                  </CardContent>
                  </Card>
                </div>
              ))}
            </div>            {/* Competitor Details */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        {selectedCompetitor.name}
                      </CardTitle>
                      <CardDescription>{selectedCompetitor.domain} • {selectedCompetitor.industry}</CardDescription>
                    </div>
                    <Badge className={getThreatLevelColor(selectedCompetitor.threat_level)}>
                      {selectedCompetitor.threat_level} threat
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <DollarSign className="h-5 w-5 mx-auto mb-1 text-green-600" />
                      <p className="text-sm text-muted-foreground">Ad Spend</p>
                      <p className="font-bold">{formatCurrency(selectedCompetitor.adSpend)}</p>
                      <p className="text-xs text-green-600">+{selectedCompetitor.adSpendTrend}%</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <Target className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                      <p className="text-sm text-muted-foreground">Market Share</p>
                      <p className="font-bold">{formatPercentage(selectedCompetitor.marketShare)}</p>
                      <p className="text-xs text-muted-foreground">#{selectedCompetitor.rankingPosition} Position</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <BarChart3 className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                      <p className="text-sm text-muted-foreground">Active Ads</p>
                      <p className="font-bold">{selectedCompetitor.adCount}</p>
                      <p className="text-xs text-muted-foreground">{selectedCompetitor.platforms.length} Platforms</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <MousePointer className="h-5 w-5 mx-auto mb-1 text-yellow-600" />
                      <p className="text-sm text-muted-foreground">Avg CTR</p>
                      <p className="font-bold">{formatPercentage(selectedCompetitor.avgCTR)}</p>
                      <p className="text-xs text-muted-foreground">${selectedCompetitor.avgCPC} CPC</p>
                    </div>
                  </div>

                  {/* Platform Performance */}
                  <div>
                    <h4 className="font-medium mb-3">Platform Performance</h4>
                    <div className="space-y-2">
                      {selectedCompetitor.platforms.map((platform) => (
                        <div key={platform} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm font-medium capitalize">
                            {platform.replace('_', ' ')}
                          </span>
                          <div className="flex items-center gap-2">
                            {platform === selectedCompetitor.strongestPlatform && (
                              <Badge className="bg-green-100 text-green-800">Strongest</Badge>
                            )}
                            {platform === selectedCompetitor.weakestPlatform && (
                              <Badge variant="outline">Weakest</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div>
                    <h4 className="font-medium mb-3">Recent Activity</h4>
                    <div className="text-sm text-muted-foreground">
                      Last updated: {selectedCompetitor.lastUpdated.toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ads" className="space-y-6">
          <div className="space-y-4">
            {mockCompetitorData.adAnalysis.map((ad) => (
              <Card key={ad.adId}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{ad.headline}</h3>
                      <p className="text-sm text-muted-foreground">
                        {ad.competitorName} • {ad.platform.replace('_', ' ')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={ad.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {ad.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge className={getImpactColor(ad.performanceRating)}>
                        {ad.performanceRating} performance
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm mb-2">{ad.description}</p>
                    <div className="flex gap-2">
                      {ad.keywords.map((keyword, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <Eye className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                      <p className="text-xs text-muted-foreground">Impressions</p>
                      <p className="font-bold text-sm">{ad.estimatedImpressions.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <MousePointer className="h-4 w-4 mx-auto mb-1 text-green-600" />
                      <p className="text-xs text-muted-foreground">Clicks</p>
                      <p className="font-bold text-sm">{ad.estimatedClicks.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <Target className="h-4 w-4 mx-auto mb-1 text-purple-600" />
                      <p className="text-xs text-muted-foreground">CTR</p>
                      <p className="font-bold text-sm">{formatPercentage(ad.estimatedCTR)}</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <Star className="h-4 w-4 mx-auto mb-1 text-yellow-600" />
                      <p className="text-xs text-muted-foreground">Creative Score</p>
                      <p className="font-bold text-sm">{ad.creativeScore}/100</p>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <Heart className="h-4 w-4 mx-auto mb-1 text-red-600" />
                      <p className="text-xs text-muted-foreground">Sentiment</p>
                      <p className="font-bold text-sm capitalize">{ad.sentiment}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>First seen: {ad.firstSeen.toLocaleDateString()}</span>
                    <span>Last seen: {ad.lastSeen.toLocaleString()}</span>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      View Ad
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="keywords" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Top Market Keywords
              </CardTitle>
              <CardDescription>High-value keywords in your market with competition analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCompetitorData.marketInsights.topKeywords.map((keyword, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{keyword.keyword}</h4>
                      <p className="text-sm text-muted-foreground">
                        {keyword.volume.toLocaleString()} searches/month
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">Difficulty: {keyword.difficulty}%</p>
                      <Progress value={keyword.difficulty} className="w-20 h-2 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gaps" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Opportunities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <Lightbulb className="h-5 w-5" />
                  Market Opportunities
                </CardTitle>
                <CardDescription>Gaps in competitor coverage that you can exploit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCompetitorData.gapAnalysis.opportunities.map((opportunity, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{opportunity.title}</h4>
                        <Badge className={getImpactColor(opportunity.impact)}>
                          {opportunity.impact} impact
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{opportunity.description}</p>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Traffic:</span>
                          <span className="font-medium ml-1">{opportunity.estimatedTraffic}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Cost:</span>
                          <span className="font-medium ml-1">{formatCurrency(opportunity.estimatedCost)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Difficulty:</span>
                          <span className="font-medium ml-1">{opportunity.difficulty}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Threats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Market Threats
                </CardTitle>
                <CardDescription>Competitive actions that could impact your position</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCompetitorData.gapAnalysis.threats.map((threat, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{threat.title}</h4>
                        <Badge className={getThreatLevelColor(threat.severity)}>
                          {threat.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{threat.description}</p>
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Impact:</span>
                          <span className="font-medium ml-1">{threat.impact}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Timeline:</span>
                          <span className="font-medium ml-1">{threat.timeline}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Recommendation:</span>
                          <p className="text-xs mt-1">{threat.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Spending Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCompetitorData.marketInsights.seasonalTrends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{trend.month}</span>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-blue-600">
                            {formatCurrency(trend.yourSpend)}
                          </p>
                          <p className="text-xs text-muted-foreground">Your Spend</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-600">
                            {formatCurrency(trend.competitorAvg)}
                          </p>
                          <p className="text-xs text-muted-foreground">Competitor Avg</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Market Benchmarks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Average CPC</span>
                    <span className="font-bold">${mockCompetitorData.marketInsights.averageCPC}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Average CTR</span>
                    <span className="font-bold">{formatPercentage(mockCompetitorData.marketInsights.averageCTR)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm font-medium">Market Growth</span>
                    <span className="font-bold text-green-600">+{formatPercentage(mockCompetitorData.marketInsights.growthRate)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}