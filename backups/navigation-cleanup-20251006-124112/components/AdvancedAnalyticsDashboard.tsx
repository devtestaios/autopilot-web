'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Users, 
  BarChart, 
  PieChart, 
  LineChart,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Brain,
  Zap,
  Eye,
  MousePointer,
  ShoppingCart,
  Trophy,
  AlertTriangle,
  Info
} from 'lucide-react';
import { 
  AnalyticsMetrics, 
  AttributionReport, 
  ForecastingReport, 
  CohortAnalysis, 
  CompetitiveIntelligence,
  advancedAnalyticsEngine 
} from '@/lib/advancedAnalyticsEngine';

interface AdvancedAnalyticsDashboardProps {
  className?: string;
}

export default function AdvancedAnalyticsDashboard({ className }: AdvancedAnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsMetrics | null>(null);
  const [attribution, setAttribution] = useState<AttributionReport | null>(null);
  const [forecasting, setForecastingReport] = useState<ForecastingReport | null>(null);
  const [cohortAnalysis, setCohortAnalysis] = useState<CohortAnalysis | null>(null);
  const [competitive, setCompetitive] = useState<CompetitiveIntelligence | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date()
  });

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [analyticsData, attributionData, forecastingData, cohortData, competitiveData] = await Promise.all([
        advancedAnalyticsEngine.getComprehensiveAnalytics(dateRange),
        advancedAnalyticsEngine.getAttributionReport(dateRange),
        advancedAnalyticsEngine.getForecastingReport(dateRange),
        advancedAnalyticsEngine.getCohortAnalysis(dateRange),
        advancedAnalyticsEngine.getCompetitiveIntelligence()
      ]);

      setAnalytics(analyticsData);
      setAttribution(attributionData);
      setForecastingReport(forecastingData);
      setCohortAnalysis(cohortData);
      setCompetitive(competitiveData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const getTrendIcon = (trend: number) => {
    return trend >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getTrendColor = (trend: number) => {
    return trend >= 0 ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Analytics Data</h3>
        <p className="text-muted-foreground">Unable to load analytics data.</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics</h1>
          <p className="text-muted-foreground">Comprehensive performance insights and forecasting</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Date Range
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={loadAnalytics}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(analytics.totalRevenue)}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(analytics.revenueTrend)}
                  <span className={`text-sm ${getTrendColor(analytics.revenueTrend)}`}>
                    {formatPercentage(Math.abs(analytics.revenueTrend))}
                  </span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">ROAS</p>
                <p className="text-2xl font-bold">{analytics.overallROAS.toFixed(2)}x</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(analytics.roasTrend)}
                  <span className={`text-sm ${getTrendColor(analytics.roasTrend)}`}>
                    {formatPercentage(Math.abs(analytics.roasTrend))}
                  </span>
                </div>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Conversions</p>
                <p className="text-2xl font-bold">{analytics.totalConversions.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  {getTrendIcon(analytics.conversionTrend)}
                  <span className={`text-sm ${getTrendColor(analytics.conversionTrend)}`}>
                    {formatPercentage(Math.abs(analytics.conversionTrend))}
                  </span>
                </div>
              </div>
              <ShoppingCart className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Profit</p>
                <p className="text-2xl font-bold">{formatCurrency(analytics.totalProfit)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-sm text-muted-foreground">
                    ROI: {formatPercentage(analytics.overallROI)}
                  </span>
                </div>
              </div>
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attribution">Attribution</TabsTrigger>
          <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          <TabsTrigger value="cohorts">Cohorts</TabsTrigger>
          <TabsTrigger value="competitive">Competitive</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Performance Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Click-through Rate</span>
                    <span className="font-medium">{formatPercentage(analytics.avgClickThroughRate)}</span>
                  </div>
                  <Progress value={analytics.avgClickThroughRate} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Conversion Rate</span>
                    <span className="font-medium">{formatPercentage(analytics.avgConversionRate)}</span>
                  </div>
                  <Progress value={analytics.avgConversionRate} className="h-2" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cost per Click</span>
                    <span className="font-medium">{formatCurrency(analytics.avgCostPerClick)}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Cost per Acquisition</span>
                    <span className="font-medium">{formatCurrency(analytics.costPerAcquisition)}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Customer LTV</span>
                    <span className="font-medium">{formatCurrency(analytics.lifetimeValue)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Campaigns */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Top Performing Campaigns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.topPerformingCampaigns.map((campaign, index) => (
                    <div key={campaign.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{campaign.name}</p>
                          <p className="text-sm text-muted-foreground">Spend: {formatCurrency(campaign.spend)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">{campaign.roas.toFixed(2)}x</p>
                        <p className="text-xs text-muted-foreground">ROAS</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Best Performing Keywords */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Best Performing Keywords
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.bestPerformingKeywords.map((keyword, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{keyword.keyword}</p>
                      <p className="text-sm text-muted-foreground">{keyword.conversions} conversions</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(keyword.cpa)}</p>
                      <p className="text-xs text-muted-foreground">CPA</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attribution" className="space-y-6">
          {attribution && (
            <>
              {/* Channel Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Multi-Channel Attribution
                  </CardTitle>
                  <CardDescription>Performance breakdown by channel and platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {attribution.channelPerformance.map((channel, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium">{channel.channel}</h4>
                            <Badge variant="outline">{channel.platform}</Badge>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${channel.contribution}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {formatPercentage(channel.contribution)} contribution
                          </p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="font-bold">{formatCurrency(channel.revenue)}</p>
                          <p className="text-sm text-muted-foreground">Revenue</p>
                          <p className="text-sm">ROAS: {channel.roas.toFixed(2)}x</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Customer Journey */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Customer Journey Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {attribution.customerJourney.map((touchpoint, index) => (
                      <Card key={index}>
                        <CardContent className="p-4 text-center">
                          <h4 className="font-medium mb-2">{touchpoint.touchpoint}</h4>
                          <p className="text-2xl font-bold text-primary mb-1">
                            {formatPercentage(touchpoint.influence)}
                          </p>
                          <p className="text-sm text-muted-foreground">{touchpoint.conversions} conversions</p>
                          <Badge variant="outline" className="mt-2">{touchpoint.stage}</Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-6">
          {forecasting && (
            <>
              {/* Budget Optimization */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Budget Optimization
                  </CardTitle>
                  <CardDescription>
                    Projected {formatPercentage(forecasting.budgetOptimization.totalUpliftPotential)} performance uplift
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Current Allocation</h4>
                      <div className="space-y-2">
                        {forecasting.budgetOptimization.currentAllocation.map((alloc, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                            <span className="text-sm">{alloc.campaign}</span>
                            <span className="font-medium">{formatCurrency(alloc.budget)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Recommended Allocation</h4>
                      <div className="space-y-2">
                        {forecasting.budgetOptimization.recommendedAllocation.map((alloc, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                            <span className="text-sm">{alloc.campaign}</span>
                            <div className="text-right">
                              <span className="font-medium">{formatCurrency(alloc.budget)}</span>
                              {alloc.expectedUplift !== 0 && (
                                <div className="text-xs text-green-600">
                                  {alloc.expectedUplift > 0 ? '+' : ''}{formatPercentage(alloc.expectedUplift)}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Seasonality Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Seasonality Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Seasonal Patterns</h4>
                      <div className="space-y-3">
                        {forecasting.seasonalityAnalysis.patterns.map((pattern, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded">
                            <div>
                              <p className="font-medium">{pattern.period}</p>
                              <p className="text-sm text-muted-foreground">{pattern.description}</p>
                            </div>
                            <div className="text-right">
                              <span className={`font-bold ${pattern.factor > 1 ? 'text-green-600' : 'text-red-600'}`}>
                                {pattern.factor > 1 ? '+' : ''}{formatPercentage((pattern.factor - 1) * 100)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Recommendations</h4>
                      <div className="space-y-2">
                        {forecasting.seasonalityAnalysis.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start gap-2 p-2">
                            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="cohorts" className="space-y-6">
          {cohortAnalysis && (
            <>
              {/* Cohort Retention */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Customer Cohort Analysis
                  </CardTitle>
                  <CardDescription>Customer retention and value progression over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Cohort</th>
                          <th className="text-right p-2">Month 0</th>
                          <th className="text-right p-2">Month 1</th>
                          <th className="text-right p-2">Month 3</th>
                          <th className="text-right p-2">Month 6</th>
                          <th className="text-right p-2">Month 12</th>
                          <th className="text-right p-2">LTV</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cohortAnalysis.acquisitionCohorts.map((cohort, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2 font-medium">{cohort.cohort}</td>
                            <td className="text-right p-2">{cohort.month0}%</td>
                            <td className="text-right p-2">{cohort.month1}%</td>
                            <td className="text-right p-2">{cohort.month3}%</td>
                            <td className="text-right p-2">{cohort.month6}%</td>
                            <td className="text-right p-2">{cohort.month12 > 0 ? `${cohort.month12}%` : '-'}</td>
                            <td className="text-right p-2 font-medium">{formatCurrency(cohort.ltv)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Value Segments */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Value Segments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {cohortAnalysis.valueProgression.map((segment, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <h4 className="font-medium mb-3">{segment.segment} Customers</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Avg Order Value</span>
                              <span className="font-medium">{formatCurrency(segment.avgOrderValue)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Purchase Frequency</span>
                              <span className="font-medium">{segment.frequency.toFixed(1)}x</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">Lifetime Value</span>
                              <span className="font-bold text-primary">{formatCurrency(segment.ltv)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="competitive" className="space-y-6">
          {competitive && (
            <>
              {/* Market Share */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Market Position
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <div className="text-center mb-4">
                        <p className="text-3xl font-bold text-primary">{formatPercentage(competitive.marketShare.estimatedShare)}</p>
                        <p className="text-muted-foreground">Estimated Market Share</p>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          {getTrendIcon(competitive.marketShare.trend)}
                          <span className={`text-sm ${getTrendColor(competitive.marketShare.trend)}`}>
                            {formatPercentage(Math.abs(competitive.marketShare.trend))} vs last period
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Top Competitors</h4>
                      <div className="space-y-2">
                        {competitive.marketShare.topCompetitors.map((competitor, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">{competitor.name}</span>
                            <span className="font-medium">{formatPercentage(competitor.estimatedShare)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Auction Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Auction Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Competitor</th>
                          <th className="text-right p-2">Impression Share</th>
                          <th className="text-right p-2">Avg Position</th>
                          <th className="text-right p-2">Overlap Rate</th>
                          <th className="text-right p-2">Outranking Share</th>
                        </tr>
                      </thead>
                      <tbody>
                        {competitive.auctionInsights.map((insight, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2 font-medium">{insight.competitor}</td>
                            <td className="text-right p-2">{formatPercentage(insight.impressionShare)}</td>
                            <td className="text-right p-2">{insight.avgPosition.toFixed(1)}</td>
                            <td className="text-right p-2">{formatPercentage(insight.overlap)}</td>
                            <td className="text-right p-2">{formatPercentage(insight.outranking)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{analytics.totalImpressions.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Impressions</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <MousePointer className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{analytics.totalClicks.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Clicks</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <ShoppingCart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold">{analytics.totalConversions.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Conversions</p>
              </CardContent>
            </Card>
          </div>

          {/* Forecasting Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  30-Day Spend Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(analytics.projectedSpend30d)}
                  </p>
                  <p className="text-sm text-muted-foreground">Projected 30-day spend</p>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="text-sm">
                      Based on current trends and seasonality factor of {analytics.seasonalityFactor.toFixed(2)}x
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  30-Day Revenue Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(analytics.projectedRevenue30d)}
                  </p>
                  <p className="text-sm text-muted-foreground">Projected 30-day revenue</p>
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm">
                      Expected ROAS: {analytics.projectedROAS30d.toFixed(2)}x
                    </p>
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