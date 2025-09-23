'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  Users, 
  BarChart3, 
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
  Info,
  Settings,
  Share2,
  Clock,
  ArrowUpDown,
  Plus,
  Minus,
  RotateCcw,
  Save,
  FileText,
  Mail,
  Smartphone,
  Globe,
  Activity,
  Gauge,
  Layers,
  BarChart2,
  TrendingUp as TrendIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Enhanced Types for Advanced Analytics
interface MetricCard {
  id: string;
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  color: string;
  format: 'currency' | 'percentage' | 'number';
}

interface ChartData {
  id: string;
  type: 'line' | 'bar' | 'area' | 'pie' | 'donut' | 'heatmap';
  title: string;
  data: any[];
  options: any;
}

interface CustomReport {
  id: string;
  name: string;
  description: string;
  metrics: string[];
  dateRange: { start: Date; end: Date };
  visualizations: ChartData[];
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
  };
}

interface DashboardFilter {
  dateRange: { start: Date; end: Date };
  campaigns: string[];
  platforms: string[];
  metrics: string[];
  comparison: 'previous_period' | 'previous_year' | 'custom';
}

export default function EnhancedAnalyticsDashboard() {
  // State Management
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds
  const [customizeMode, setCustomizeMode] = useState(false);
  
  // Filter State
  const [filters, setFilters] = useState<DashboardFilter>({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      end: new Date()
    },
    campaigns: [],
    platforms: ['google_ads', 'meta', 'linkedin'],
    metrics: ['spend', 'revenue', 'roas', 'conversions'],
    comparison: 'previous_period'
  });

  // Real-time Data State
  const [realTimeMetrics, setRealTimeMetrics] = useState({
    activeUsers: 0,
    conversionsToday: 0,
    revenueToday: 0,
    topCampaignNow: '',
    lastUpdated: new Date()
  });

  // Custom Reports State
  const [customReports, setCustomReports] = useState<CustomReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  // Mock Data - In real implementation, this would come from the analytics engine
  const mockMetrics: MetricCard[] = [
    {
      id: 'revenue',
      title: 'Total Revenue',
      value: '$124,450',
      change: 12.5,
      changeLabel: 'vs last month',
      icon: DollarSign,
      color: 'text-green-600',
      format: 'currency'
    },
    {
      id: 'roas',
      title: 'Return on Ad Spend',
      value: '3.24x',
      change: 8.2,
      changeLabel: 'vs last month',
      icon: TrendingUp,
      color: 'text-blue-600',
      format: 'number'
    },
    {
      id: 'conversions',
      title: 'Total Conversions',
      value: '2,847',
      change: -5.3,
      changeLabel: 'vs last month',
      icon: Target,
      color: 'text-purple-600',
      format: 'number'
    },
    {
      id: 'ctr',
      title: 'Click-Through Rate',
      value: '3.45%',
      change: 15.7,
      changeLabel: 'vs last month',
      icon: MousePointer,
      color: 'text-orange-600',
      format: 'percentage'
    },
    {
      id: 'cpa',
      title: 'Cost Per Acquisition',
      value: '$43.72',
      change: -18.4,
      changeLabel: 'vs last month',
      icon: ShoppingCart,
      color: 'text-red-600',
      format: 'currency'
    },
    {
      id: 'ltv',
      title: 'Customer LTV',
      value: '$287.50',
      change: 22.1,
      changeLabel: 'vs last month',
      icon: Users,
      color: 'text-indigo-600',
      format: 'currency'
    }
  ];

  // Real-time Updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      updateRealTimeMetrics();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const updateRealTimeMetrics = async () => {
    // Simulate real-time data updates
    setRealTimeMetrics({
      activeUsers: Math.floor(Math.random() * 1000) + 500,
      conversionsToday: Math.floor(Math.random() * 50) + 20,
      revenueToday: Math.floor(Math.random() * 5000) + 2000,
      topCampaignNow: 'Holiday Sale Campaign',
      lastUpdated: new Date()
    });
  };

  // Utility Functions
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

  const createCustomReport = () => {
    const newReport: CustomReport = {
      id: `report_${Date.now()}`,
      name: `Custom Report ${customReports.length + 1}`,
      description: 'Custom analytics report',
      metrics: filters.metrics,
      dateRange: filters.dateRange,
      visualizations: []
    };
    setCustomReports([...customReports, newReport]);
  };

  const exportReport = (format: 'pdf' | 'csv' | 'excel') => {
    // Implementation for report export
    console.log(`Exporting report as ${format}`);
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Enhanced Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive performance analytics with real-time insights
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Real-time Indicator */}
          <div className="flex items-center space-x-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            )} />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {autoRefresh ? 'Live' : 'Static'}
            </span>
            <Switch
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
            />
          </div>
          
          {/* Dashboard Controls */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCustomizeMode(!customizeMode)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Customize
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={createCustomReport}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportReport('pdf')}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Real-time Metrics Bar */}
      <AnimatePresence>
        {autoRefresh && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-4 text-white"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <p className="text-lg font-bold">{realTimeMetrics.activeUsers}</p>
                  <p className="text-xs opacity-80">Active Users</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold">{realTimeMetrics.conversionsToday}</p>
                  <p className="text-xs opacity-80">Conversions Today</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold">{formatCurrency(realTimeMetrics.revenueToday)}</p>
                  <p className="text-xs opacity-80">Revenue Today</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{realTimeMetrics.topCampaignNow}</p>
                  <p className="text-xs opacity-80">Top Performing Campaign</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-80">Last Updated</p>
                <p className="text-sm">{realTimeMetrics.lastUpdated.toLocaleTimeString()}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {mockMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group" data-testid="metric-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className={cn('p-2 rounded-lg bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors')}>
                      <IconComponent className={cn('h-5 w-5', metric.color)} />
                    </div>
                    <div className="flex items-center space-x-1">
                      {getTrendIcon(metric.change)}
                      <span className={cn('text-xs font-medium', getTrendColor(metric.change))}>
                        {Math.abs(metric.change)}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      {metric.title}
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {metric.value}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {metric.changeLabel}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Advanced Analytics Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Advanced Analytics
              </CardTitle>
              <CardDescription>
                Comprehensive performance analysis with interactive visualizations
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Date Range
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLoading(!loading)}
              >
                <RefreshCw className={cn('h-4 w-4 mr-2', loading && 'animate-spin')} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} className="w-full">
            <TabsList className="grid grid-cols-7 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="attribution">Attribution</TabsTrigger>
              <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
              <TabsTrigger value="cohorts">Cohorts</TabsTrigger>
              <TabsTrigger value="competitive">Competitive</TabsTrigger>
              <TabsTrigger value="custom">Custom Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Interactive Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="h-5 w-5 text-blue-600" />
                      Revenue Trend (30 Days)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <LineChart className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Interactive Line Chart
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Revenue trending upward 15.3%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-purple-600" />
                      Channel Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <PieChart className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Interactive Pie Chart
                        </p>
                        <div className="flex items-center justify-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-xs">Google Ads 45%</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <span className="text-xs">Meta 35%</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-xs">LinkedIn 20%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-indigo-600" />
                    AI-Powered Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800 dark:text-green-200">
                          Opportunity
                        </span>
                      </div>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Increase budget for "Holiday Sale" campaign by 25% to capture additional 18% revenue growth
                      </p>
                    </div>

                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                          Warning
                        </span>
                      </div>
                      <p className="text-sm text-orange-700 dark:text-orange-300">
                        "Product Demo" campaign showing declining CTR - consider refreshing ad creatives
                      </p>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          Insight
                        </span>
                      </div>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Mobile traffic converts 23% better on weekends - consider time-based bidding adjustments
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6 mt-6">
              {/* Performance Deep Dive */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart2 className="h-5 w-5" />
                      Campaign Performance Matrix
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Activity className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                          Interactive Performance Matrix
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          Bubble chart showing spend vs. ROAS with conversion volume
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gauge className="h-5 w-5" />
                      Performance Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600 mb-2">87</div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Overall Score</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Quality Score</span>
                          <span>9.2/10</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Relevance</span>
                          <span>8.7/10</span>
                        </div>
                        <Progress value={87} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Landing Page</span>
                          <span>8.1/10</span>
                        </div>
                        <Progress value={81} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Expected CTR</span>
                          <span>9.0/10</span>
                        </div>
                        <Progress value={90} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-6 mt-6">
              {/* Custom Reports Section */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Custom Reports
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Create and manage custom analytics reports
                  </p>
                </div>
                <Button onClick={createCustomReport}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Report
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customReports.map((report) => (
                  <Card key={report.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{report.name}</CardTitle>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardDescription>{report.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Metrics:</span>
                          <span>{report.metrics.length}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Date Range:</span>
                          <span>30 days</span>
                        </div>
                        {report.schedule && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Schedule:</span>
                            <Badge variant="outline">{report.schedule.frequency}</Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Add New Report Card */}
                <div 
                  className="cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={createCustomReport}
                >
                  <Card className="border-dashed border-2 border-gray-300 dark:border-gray-600">
                    <CardContent className="flex flex-col items-center justify-center h-full p-6">
                      <Plus className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                        Create New Report
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Other tabs content would be implemented similarly */}
            <TabsContent value="attribution" className="space-y-6 mt-6">
              <div className="text-center py-8">
                <Layers className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Attribution Analysis
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Multi-touch attribution and customer journey analysis
                </p>
              </div>
            </TabsContent>

            <TabsContent value="forecasting" className="space-y-6 mt-6">
              <div className="text-center py-8">
                <TrendIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Forecasting & Predictions
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  AI-powered revenue and performance forecasting
                </p>
              </div>
            </TabsContent>

            <TabsContent value="cohorts" className="space-y-6 mt-6">
              <div className="text-center py-8">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Cohort Analysis
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Customer retention and value progression analysis
                </p>
              </div>
            </TabsContent>

            <TabsContent value="competitive" className="space-y-6 mt-6">
              <div className="text-center py-8">
                <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Competitive Intelligence
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Market position and competitor analysis
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}