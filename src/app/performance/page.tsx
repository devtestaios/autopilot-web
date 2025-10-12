'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { 
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  Target,
  DollarSign,
  Eye,
  MousePointer,
  Zap,
  Brain,
  Calendar,
  Download,
  Share,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Info,
  ArrowUp,
  ArrowDown,
  Minus,
  Settings,
  Play,
  Pause,
  MoreHorizontal,
  ExternalLink,
  Users,
  Globe,
  Smartphone,
  Monitor,
  Clock,
  Star,
  Lightbulb
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface PerformanceMetric {
  metric: string;
  current: number;
  trend: 'up' | 'down' | 'stable';
  changePercentage: number;
  forecast: number;
}

interface TrendAnalysis {
  metric: string;
  timeframe: string;
  trend: 'up' | 'down' | 'stable';
  changePercentage: number;
  variance: number;
  forecast: {
    nextPeriod: number;
    confidence: number;
    range: { low: number; high: number };
  };
  insights: string[];
  anomalies: any[];
}

interface PerformanceInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'success' | 'info';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: {
    metric: string;
    currentValue: number;
    potentialValue: number;
    improvementPercentage: number;
  };
  recommendations: string[];
  confidence: number;
  createdAt: string;
}

interface ROIOverview {
  totalRevenue: number;
  totalSpend: number;
  overallROI: number;
  overallROAS: number;
  avgROI: number;
  profitableCampaigns: number;
  totalCampaigns: number;
}

// =============================================================================
// PERFORMANCE ANALYTICS COMPONENT
// =============================================================================

export default function PerformanceAnalytics() {
  const [overview, setOverview] = useState<PerformanceMetric[]>([]);
  const [trends, setTrends] = useState<TrendAnalysis[]>([]);
  const [insights, setInsights] = useState<PerformanceInsight[]>([]);
  const [roiOverview, setROIOverview] = useState<ROIOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    loadAnalyticsData();
  }, [selectedTimeframe, selectedMetric, selectedPlatform]);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load performance overview
      const overviewResponse = await fetch('/api/analytics/performance?endpoint=overview');
      const overviewData = await overviewResponse.json();
      
      if (overviewData.success) {
        setOverview(overviewData.data.overview);
        setInsights(overviewData.data.insights);
      }

      // Load trends analysis
      const trendsParams = new URLSearchParams({
        endpoint: 'trends',
        timeframe: selectedTimeframe,
        metric: selectedMetric,
        platform: selectedPlatform
      });
      
      const trendsResponse = await fetch(`/api/analytics/performance?${trendsParams}`);
      const trendsData = await trendsResponse.json();
      
      if (trendsData.success) {
        setTrends(trendsData.data.trends);
      }

      // Load ROI overview
      const roiResponse = await fetch('/api/analytics/roi?endpoint=overview');
      const roiData = await roiResponse.json();
      
      if (roiData.success) {
        setROIOverview(roiData.data.overview);
      }

    } catch (error) {
      console.error('Error loading analytics data:', error);
      setError('Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportReport = async () => {
    try {
      const response = await fetch('/api/analytics/reports?endpoint=generate&templateId=template_performance');
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Report Generated',
          description: 'Performance report has been generated successfully.',
        });
      }
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to generate report. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUp className="h-4 w-4 text-green-600" />;
      case 'down': return <ArrowDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Lightbulb className="h-5 w-5 text-yellow-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'bg-yellow-50 border-yellow-200';
      case 'warning': return 'bg-red-50 border-red-200';
      case 'success': return 'bg-green-50 border-green-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  const formatMetricValue = (metric: string, value: number) => {
    if (metric.includes('spend') || metric.includes('revenue') || metric === 'cpc' || metric === 'cpa') {
      return `$${value.toLocaleString()}`;
    }
    if (metric.includes('rate') || metric === 'ctr' || metric === 'roi') {
      return `${value.toFixed(2)}%`;
    }
    if (metric === 'roas') {
      return `${value.toFixed(2)}x`;
    }
    return value.toLocaleString();
  };

  if (isLoading && overview.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              Performance Analytics
            </h1>
            <p className="text-gray-600 mt-1">
              Advanced performance insights with trend analysis and forecasting
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
            
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="all">All Platforms</option>
              <option value="facebook">Facebook</option>
              <option value="google-ads">Google Ads</option>
              <option value="linkedin">LinkedIn</option>
            </select>
            
            <Button
              onClick={handleExportReport}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            
            <Button
              onClick={loadAnalyticsData}
              variant="outline"
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="roi">ROI Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {overview.map((metric) => (
                <Card key={metric.metric} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 capitalize">
                          {metric.metric.replace('_', ' ')}
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatMetricValue(metric.metric, metric.current)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {getTrendIcon(metric.trend)}
                        <span className={`text-sm font-medium ${
                          metric.trend === 'up' ? 'text-green-600' : 
                          metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {Math.abs(metric.changePercentage).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Forecast</span>
                        <span>{formatMetricValue(metric.metric, metric.forecast)}</span>
                      </div>
                      <Progress
                        value={Math.min(100, (metric.current / metric.forecast) * 100)}
                        className="mt-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* ROI Overview */}
            {roiOverview && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    ROI Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${roiOverview.totalRevenue.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total Spend</p>
                      <p className="text-2xl font-bold text-red-600">
                        ${roiOverview.totalSpend.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Overall ROAS</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {roiOverview.overallROAS.toFixed(2)}x
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Profitable Campaigns</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {roiOverview.profitableCampaigns}/{roiOverview.totalCampaigns}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {trends.map((trend) => (
                <Card key={trend.metric} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="capitalize">{trend.metric.replace('_', ' ')} Trend</span>
                      <Badge className={
                        trend.trend === 'up' ? 'bg-green-100 text-green-800' :
                        trend.trend === 'down' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {trend.trend}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Change</p>
                        <p className={`text-lg font-semibold ${
                          trend.changePercentage > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {trend.changePercentage > 0 ? '+' : ''}{trend.changePercentage.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Confidence</p>
                        <p className="text-lg font-semibold text-blue-600">
                          {trend.forecast.confidence.toFixed(0)}%
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Forecast Range</p>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between text-sm">
                          <span>Low: {formatMetricValue(trend.metric, trend.forecast.range.low)}</span>
                          <span>High: {formatMetricValue(trend.metric, trend.forecast.range.high)}</span>
                        </div>
                        <Progress 
                          value={50} 
                          className="mt-2"
                        />
                        <p className="text-center text-sm text-gray-600 mt-1">
                          Predicted: {formatMetricValue(trend.metric, trend.forecast.nextPeriod)}
                        </p>
                      </div>
                    </div>

                    {trend.insights.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Key Insights</p>
                        <ul className="space-y-1">
                          {trend.insights.map((insight, idx) => (
                            <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {trend.anomalies.length > 0 && (
                      <Alert className="border-yellow-200 bg-yellow-50">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          {trend.anomalies.length} anomalies detected in the analysis period
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="space-y-4">
              {insights.map((insight) => (
                <Card key={insight.id} className={`hover:shadow-md transition-shadow ${getInsightColor(insight.type)}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-2 rounded-lg bg-white">
                          {getInsightIcon(insight.type)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                            <Badge className={getPriorityBadge(insight.priority)}>
                              {insight.priority}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-700 mb-4">{insight.description}</p>
                          
                          <div className="bg-white p-4 rounded-lg mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Impact Analysis</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-gray-600">Current</p>
                                <p className="font-semibold">
                                  {formatMetricValue(insight.impact.metric, insight.impact.currentValue)}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Potential</p>
                                <p className="font-semibold text-green-600">
                                  {formatMetricValue(insight.impact.metric, insight.impact.potentialValue)}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Improvement</p>
                                <p className="font-semibold text-blue-600">
                                  +{insight.impact.improvementPercentage}%
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Recommendations</h4>
                            <ul className="space-y-1">
                              {insight.recommendations.map((rec, idx) => (
                                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Confidence</p>
                          <p className="font-semibold text-blue-600">{insight.confidence}%</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="roi" className="space-y-6">
            {roiOverview && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Overall ROI</h3>
                      <p className="text-3xl font-bold text-green-600">
                        {roiOverview.overallROI.toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Return on Investment across all campaigns
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                        <Target className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">ROAS</h3>
                      <p className="text-3xl font-bold text-blue-600">
                        {roiOverview.overallROAS.toFixed(2)}x
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        Return on Ad Spend ratio
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                        <Activity className="h-6 w-6 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Success Rate</h3>
                      <p className="text-3xl font-bold text-purple-600">
                        {((roiOverview.profitableCampaigns / roiOverview.totalCampaigns) * 100).toFixed(0)}%
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        {roiOverview.profitableCampaigns} of {roiOverview.totalCampaigns} campaigns profitable
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue vs Spend Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-600">Total Revenue</p>
                          <p className="text-2xl font-bold text-green-600">
                            ${roiOverview.totalRevenue.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Spend</p>
                          <p className="text-2xl font-bold text-red-600">
                            ${roiOverview.totalSpend.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Net Profit</p>
                          <p className="text-2xl font-bold text-blue-600">
                            ${(roiOverview.totalRevenue - roiOverview.totalSpend).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Revenue Breakdown</p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Direct Revenue</span>
                              <span className="font-medium">${(roiOverview.totalRevenue * 0.7).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Attributed Revenue</span>
                              <span className="font-medium">${(roiOverview.totalRevenue * 0.3).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-600 mb-2">Campaign Performance</p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Top Performers</span>
                              <span className="font-medium text-green-600">
                                {Math.floor(roiOverview.profitableCampaigns * 0.3)} campaigns
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Needs Optimization</span>
                              <span className="font-medium text-yellow-600">
                                {roiOverview.totalCampaigns - roiOverview.profitableCampaigns} campaigns
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}