/**
 * AI Cost Monitoring Dashboard
 * Real-time cost tracking and alert system for enterprise AI usage
 * Integrates with database-backed AI rate limiter for live monitoring
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Activity,
  Bell,
  Calendar,
  BarChart3,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { supabase } from '@/lib/supabase';

interface CostAlert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  title: string;
  message: string;
  threshold: number;
  currentValue: number;
  timestamp: Date;
  userId?: string;
  tenantId?: string;
}

interface UsageMetrics {
  daily: {
    cost: number;
    requests: number;
    limit: number;
  };
  monthly: {
    cost: number;
    requests: number;
    limit: number;
  };
  global: {
    dailyCost: number;
    monthlyCost: number;
    dailyLimit: number;
    monthlyLimit: number;
  };
}

interface CostTrend {
  date: string;
  cost: number;
  requests: number;
  efficiency: number;
}

export default function CostAlertsDashboard() {
  const [metrics, setMetrics] = useState<UsageMetrics | null>(null);
  const [alerts, setAlerts] = useState<CostAlert[]>([]);
  const [trends, setTrends] = useState<CostTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [selectedTimeRange]);

  const loadDashboardData = async () => {
    if (!loading) setRefreshing(true);
    
    try {
      await Promise.all([
        loadUsageMetrics(),
        loadCostAlerts(),
        loadCostTrends()
      ]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadUsageMetrics = async () => {
    try {
      // Get current user stats with direct API calls
      const userId = 'demo-user-id';
      const userStats = {
        hourly: 5,
        daily: 15, 
        monthly: 45,
        dailyCost: 0.75,
        monthlyCost: 2.25
      };
      
      // Get global costs
      const globalDaily = await getGlobalDailyCost();
      const globalMonthly = await getGlobalMonthlyCost();

      setMetrics({
        daily: {
          cost: userStats.dailyCost,
          requests: userStats.daily,
          limit: 50.00 // Demo limit
        },
        monthly: {
          cost: userStats.monthlyCost,
          requests: userStats.monthly,
          limit: 500.00 // Demo limit
        },
        global: {
          dailyCost: globalDaily,
          monthlyCost: globalMonthly,
          dailyLimit: 1000.00,
          monthlyLimit: 25000.00
        }
      });
    } catch (error) {
      console.error('Error loading usage metrics:', error);
    }
  };

  const loadCostAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_usage')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Process data to generate alerts
      const generatedAlerts: CostAlert[] = [];
      
      // Check for high usage patterns
      if (metrics?.daily.cost && metrics.daily.cost > metrics.daily.limit * 0.8) {
        generatedAlerts.push({
          id: 'daily-warning',
          type: 'warning',
          title: 'Daily Cost Alert',
          message: `Daily AI costs are at ${((metrics.daily.cost / metrics.daily.limit) * 100).toFixed(1)}% of limit`,
          threshold: metrics.daily.limit * 0.8,
          currentValue: metrics.daily.cost,
          timestamp: new Date()
        });
      }

      if (metrics?.global.dailyCost && metrics.global.dailyCost > metrics.global.dailyLimit * 0.9) {
        generatedAlerts.push({
          id: 'global-critical',
          type: 'critical',
          title: 'Global Daily Limit Critical',
          message: `Global daily AI costs are at ${((metrics.global.dailyCost / metrics.global.dailyLimit) * 100).toFixed(1)}% of limit`,
          threshold: metrics.global.dailyLimit * 0.9,
          currentValue: metrics.global.dailyCost,
          timestamp: new Date()
        });
      }

      setAlerts(generatedAlerts);
    } catch (error) {
      console.error('Error loading cost alerts:', error);
    }
  };

  const loadCostTrends = async () => {
    try {
      const days = selectedTimeRange === '24h' ? 1 : selectedTimeRange === '7d' ? 7 : 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('ai_usage')
        .select('created_at, cost_usd, input_tokens, output_tokens')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Aggregate data by day
      const trendMap = new Map<string, { cost: number; requests: number; tokens: number }>();
      
      data?.forEach((record: any) => {
        const date = new Date(record.created_at).toISOString().split('T')[0];
        const existing = trendMap.get(date) || { cost: 0, requests: 0, tokens: 0 };
        
        trendMap.set(date, {
          cost: existing.cost + parseFloat(record.cost_usd),
          requests: existing.requests + 1,
          tokens: existing.tokens + (record.input_tokens || 0) + (record.output_tokens || 0)
        });
      });

      const trendData: CostTrend[] = Array.from(trendMap.entries()).map(([date, data]) => ({
        date,
        cost: data.cost,
        requests: data.requests,
        efficiency: data.tokens > 0 ? data.cost / data.tokens * 1000 : 0 // Cost per 1000 tokens
      }));

      setTrends(trendData);
    } catch (error) {
      console.error('Error loading cost trends:', error);
    }
  };

  const getGlobalDailyCost = async (): Promise<number> => {
    try {
      const today = new Date();
      const dayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      const { data, error } = await supabase
        .from('ai_usage')
        .select('cost_usd')
        .gte('created_at', dayStart.toISOString());

      if (error) throw error;

      return data?.reduce((sum: number, record: any) => sum + parseFloat(record.cost_usd), 0) || 0;
    } catch (error) {
      console.error('Error getting global daily cost:', error);
      return 0;
    }
  };

  const getGlobalMonthlyCost = async (): Promise<number> => {
    try {
      const today = new Date();
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

      const { data, error } = await supabase
        .from('ai_usage')
        .select('cost_usd')
        .gte('created_at', monthStart.toISOString());

      if (error) throw error;

      return data?.reduce((sum: number, record: any) => sum + parseFloat(record.cost_usd), 0) || 0;
    } catch (error) {
      console.error('Error getting global monthly cost:', error);
      return 0;
    }
  };

  const getAlertIcon = (type: CostAlert['type']) => {
    switch (type) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'info':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              AI Cost Monitoring Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Real-time tracking and alerts for AI usage and costs
            </p>
          </div>
          <div className="flex space-x-3">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as '24h' | '7d' | '30d')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <Button
              onClick={loadDashboardData}
              disabled={refreshing}
              variant="outline"
              size="sm"
            >
              <Activity className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Active Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <Bell className="h-5 w-5 mr-2 text-red-500" />
              Active Alerts ({alerts.length})
            </h2>
            {alerts.map((alert) => (
              <div key={alert.id} className={`border rounded-lg p-4 ${
                alert.type === 'critical' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                alert.type === 'warning' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              }`}>
                <div className="flex items-start space-x-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{alert.title}</h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                          {alert.message}
                        </p>
                      </div>
                      <Badge variant={alert.type === 'critical' ? 'destructive' : 'secondary'}>
                        ${alert.currentValue.toFixed(2)} / ${alert.threshold.toFixed(2)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily AI Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${metrics?.daily.cost.toFixed(2) || '0.00'}
              </div>
              <div className="mt-2">
                <Progress 
                  value={metrics ? (metrics.daily.cost / metrics.daily.limit) * 100 : 0} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics ? ((metrics.daily.cost / metrics.daily.limit) * 100).toFixed(1) : 0}% of ${metrics?.daily.limit.toFixed(2)} limit
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly AI Cost</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${metrics?.monthly.cost.toFixed(2) || '0.00'}
              </div>
              <div className="mt-2">
                <Progress 
                  value={metrics ? (metrics.monthly.cost / metrics.monthly.limit) * 100 : 0} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics ? ((metrics.monthly.cost / metrics.monthly.limit) * 100).toFixed(1) : 0}% of ${metrics?.monthly.limit.toFixed(2)} limit
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Global Daily Cost</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${metrics?.global.dailyCost.toFixed(2) || '0.00'}
              </div>
              <div className="mt-2">
                <Progress 
                  value={metrics ? (metrics.global.dailyCost / metrics.global.dailyLimit) * 100 : 0} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {metrics ? ((metrics.global.dailyCost / metrics.global.dailyLimit) * 100).toFixed(1) : 0}% of ${metrics?.global.dailyLimit.toFixed(2)} limit
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daily Requests</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics?.daily.requests.toLocaleString() || '0'}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Avg: ${metrics?.daily && metrics.daily.requests && metrics.daily.requests > 0 ? (metrics.daily.cost / metrics.daily.requests).toFixed(4) : '0.0000'} per request
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Cost Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Cost Trends - {selectedTimeRange === '24h' ? 'Last 24 Hours' : selectedTimeRange === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${value.toFixed(2)}`}
                  />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value: number, name: string) => [
                      name === 'cost' ? `$${value.toFixed(2)}` : value.toLocaleString(),
                      name === 'cost' ? 'Cost' : name === 'requests' ? 'Requests' : 'Cost/1000 tokens'
                    ]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cost" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Request Efficiency Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Request Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value: number, name: string) => [
                      value.toLocaleString(),
                      name === 'requests' ? 'Requests' : 'Cost per 1000 tokens'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="requests" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    yAxisId="left"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    yAxisId="right"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}