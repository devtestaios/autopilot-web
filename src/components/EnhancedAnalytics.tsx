/**
 * Enhanced Social Media Analytics Dashboard
 * Real-time insights, sentiment analysis, and competitive intelligence
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  MessageSquare,
  Share2,
  Eye,
  BarChart3,
  PieChart,
  Calendar,
  Target,
  Zap,
  Activity,
  Award,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  RefreshCw
} from 'lucide-react';
import { 
  useSocialMediaService, 
  SocialMediaInsights, 
  CompetitorAnalysis, 
  SentimentAnalysis 
} from '@/services/socialMediaService';
import { SocialMediaAccount } from '@/types';

interface AnalyticsMetric {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color: string;
}

interface EnhancedAnalyticsProps {
  accounts: SocialMediaAccount[];
  dateRange: { start_date: string; end_date: string };
  onDateRangeChange: (range: { start_date: string; end_date: string }) => void;
}

export const EnhancedAnalytics: React.FC<EnhancedAnalyticsProps> = ({
  accounts,
  dateRange,
  onDateRangeChange
}) => {
  const socialMediaService = useSocialMediaService();
  
  // State management
  const [insights, setInsights] = useState<Record<string, SocialMediaInsights>>({});
  const [competitorData, setCompetitorData] = useState<CompetitorAnalysis[]>([]);
  const [sentimentData, setSentimentData] = useState<SentimentAnalysis[]>([]);
  const [dashboardMetrics, setDashboardMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Real-time updates
  const [realTimeUpdates, setRealTimeUpdates] = useState<any[]>([]);
  const [wsConnections, setWsConnections] = useState<WebSocket[]>([]);

  // Fetch dashboard metrics
  const fetchDashboardMetrics = useCallback(async () => {
    if (accounts.length === 0) return;
    
    try {
      const accountIds = accounts.map(acc => acc.id);
      const metrics = await socialMediaService.getDashboardMetrics(accountIds);
      setDashboardMetrics(metrics);
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
    }
  }, [accounts, socialMediaService]);

  // Fetch account insights
  const fetchInsights = useCallback(async () => {
    if (accounts.length === 0) return;
    
    const insightsPromises = accounts.map(async (account) => {
      try {
        const accountInsights = await socialMediaService.getAccountInsights(account.id, dateRange);
        return { [account.id]: accountInsights };
      } catch (error) {
        console.error(`Error fetching insights for account ${account.id}:`, error);
        return null;
      }
    });

    const results = await Promise.all(insightsPromises);
    const combinedInsights = results.reduce((acc, curr) => {
      if (curr) return { ...acc, ...curr };
      return acc;
    }, {});

    setInsights(combinedInsights);
  }, [accounts, dateRange, socialMediaService]);

  // Fetch competitor analysis
  const fetchCompetitorData = useCallback(async () => {
    try {
      // This would typically come from user input or configuration
      const competitorHandles = ['@competitor1', '@competitor2', '@competitor3'];
      const platform = 'instagram'; // Could be made dynamic
      
      const analysis = await socialMediaService.performCompetitorAnalysis(competitorHandles, platform);
      setCompetitorData(analysis);
    } catch (error) {
      console.error('Error fetching competitor data:', error);
    }
  }, [socialMediaService]);

  // Setup real-time connections
  useEffect(() => {
    const setupRealTimeConnections = async () => {
      const connections: WebSocket[] = [];
      
      for (const account of accounts) {
        try {
          const ws = await socialMediaService.subscribeToRealTimeUpdates(
            account.id,
            (update) => {
              setRealTimeUpdates(prev => [update, ...prev.slice(0, 49)]); // Keep last 50 updates
              setLastUpdated(new Date());
              
              // Update metrics if it's an engagement update
              if (update.type === 'engagement' || update.type === 'follower_change') {
                fetchDashboardMetrics();
              }
            }
          );
          connections.push(ws);
        } catch (error) {
          console.error(`Error setting up real-time connection for ${account.platform}:`, error);
        }
      }
      
      setWsConnections(connections);
    };

    if (accounts.length > 0) {
      setupRealTimeConnections();
    }

    return () => {
      wsConnections.forEach(ws => ws.close());
    };
  }, [accounts, socialMediaService]);

  // Load all data
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchDashboardMetrics(),
          fetchInsights(),
          fetchCompetitorData()
        ]);
      } catch (error) {
        console.error('Error loading analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [fetchDashboardMetrics, fetchInsights, fetchCompetitorData]);

  // Generate overview metrics
  const getOverviewMetrics = (): AnalyticsMetric[] => {
    if (!dashboardMetrics) return [];

    return [
      {
        label: 'Total Followers',
        value: dashboardMetrics.total_followers?.toLocaleString() || '0',
        change: dashboardMetrics.growth_metrics?.followers_growth || 0,
        trend: (dashboardMetrics.growth_metrics?.followers_growth || 0) > 0 ? 'up' : 'down',
        icon: <Users className="h-4 w-4" />,
        color: 'text-blue-600'
      },
      {
        label: 'Total Engagement',
        value: dashboardMetrics.total_engagement?.toLocaleString() || '0',
        change: dashboardMetrics.growth_metrics?.engagement_growth || 0,
        trend: (dashboardMetrics.growth_metrics?.engagement_growth || 0) > 0 ? 'up' : 'down',
        icon: <Heart className="h-4 w-4" />,
        color: 'text-red-600'
      },
      {
        label: 'Engagement Rate',
        value: `${(dashboardMetrics.avg_engagement_rate * 100).toFixed(1)}%`,
        change: 12.5,
        trend: 'up',
        icon: <TrendingUp className="h-4 w-4" />,
        color: 'text-green-600'
      },
      {
        label: 'Total Posts',
        value: dashboardMetrics.total_posts?.toString() || '0',
        change: dashboardMetrics.growth_metrics?.content_performance || 0,
        trend: (dashboardMetrics.growth_metrics?.content_performance || 0) > 0 ? 'up' : 'down',
        icon: <MessageSquare className="h-4 w-4" />,
        color: 'text-purple-600'
      }
    ];
  };

  const overviewMetrics = getOverviewMetrics();

  // Refresh data
  const refreshData = () => {
    fetchDashboardMetrics();
    fetchInsights();
    fetchCompetitorData();
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center p-8">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>Loading analytics...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Social Media Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
        <Button onClick={refreshData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Real-time updates banner */}
      {realTimeUpdates.length > 0 && (
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Live Updates Active
              </span>
              <Badge variant="outline" className="ml-auto">
                {realTimeUpdates.length} updates
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={metric.color}>
                  {metric.icon}
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  metric.trend === 'up' ? 'text-green-600' : 
                  metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {Math.abs(metric.change)}%
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {metric.label}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Platform Breakdown */}
          {dashboardMetrics?.platform_breakdown && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Platform Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardMetrics.platform_breakdown.map((platform: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="font-medium capitalize">{platform.platform}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span>{platform.followers.toLocaleString()} followers</span>
                        <span>{platform.posts} posts</span>
                        <span>{platform.engagement.toLocaleString()} engagement</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top Performing Content */}
          {dashboardMetrics?.top_performing_post && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Top Performing Post
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm">{dashboardMetrics.top_performing_post.content}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {dashboardMetrics.top_performing_post.engagement?.likes || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {dashboardMetrics.top_performing_post.engagement?.comments || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="h-3 w-3" />
                      {dashboardMetrics.top_performing_post.engagement?.shares || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="platforms" className="space-y-4">
          {Object.entries(insights).map(([accountId, insight]) => {
            const account = accounts.find(acc => acc.id === accountId);
            if (!account) return null;

            return (
              <Card key={accountId}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs">
                      {account.platform.charAt(0).toUpperCase()}
                    </div>
                    {account.platform.charAt(0).toUpperCase() + account.platform.slice(1)} Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{insight.insights.followers_growth}</div>
                      <div className="text-sm text-gray-600">Follower Growth</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{(insight.insights.engagement_rate * 100).toFixed(1)}%</div>
                      <div className="text-sm text-gray-600">Engagement Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{insight.insights.reach.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Reach</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{insight.insights.impressions.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Impressions</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="audience" className="space-y-4">
          {Object.entries(insights).map(([accountId, insight]) => {
            const account = accounts.find(acc => acc.id === accountId);
            if (!account || !insight.insights.audience_demographics) return null;

            return (
              <Card key={accountId}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {account.platform.charAt(0).toUpperCase() + account.platform.slice(1)} Audience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Age Groups */}
                    <div>
                      <h4 className="font-medium mb-3">Age Groups</h4>
                      <div className="space-y-2">
                        {Object.entries(insight.insights.audience_demographics.age_groups).map(([age, percentage]) => (
                          <div key={age} className="flex items-center justify-between">
                            <span className="text-sm">{age}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-gray-200 rounded-full">
                                <div 
                                  className="h-2 bg-blue-500 rounded-full" 
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-sm">{percentage}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top Locations */}
                    <div>
                      <h4 className="font-medium mb-3">Top Locations</h4>
                      <div className="space-y-2">
                        {Object.entries(insight.insights.audience_demographics.locations)
                          .slice(0, 5)
                          .map(([location, percentage]) => (
                          <div key={location} className="flex items-center justify-between">
                            <span className="text-sm">{location}</span>
                            <span className="text-sm font-medium">{percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="competitors" className="space-y-4">
          {competitorData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {competitorData.map((competitor, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      {competitor.competitor_name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Followers</span>
                        <span className="font-medium">{competitor.followers_count.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Engagement Rate</span>
                        <span className="font-medium">{(competitor.avg_engagement_rate * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Posting Frequency</span>
                        <span className="font-medium">{competitor.posting_frequency} posts/week</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Growth Rate</span>
                        <span className="font-medium">{competitor.growth_rate}%</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Top Hashtags</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {competitor.top_hashtags.slice(0, 3).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center p-8">
                <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Competitor Data</h3>
                <p className="text-gray-600">
                  Configure competitor tracking to see comparative analytics.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};