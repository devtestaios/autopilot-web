'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  TrendingUp, TrendingDown, Calendar, DollarSign, MousePointer, 
  Eye, Target, ArrowRight, AlertTriangle, CheckCircle, Lightbulb,
  Download, Share2, Zap
} from 'lucide-react';
import type { Campaign, PerformanceSnapshot } from '@/types';
import { fetchCampaign, fetchCampaignPerformance, deleteCampaign } from '@/lib/api';
import CampaignDetailsLoading from '@/components/CampaignDetailsLoading';

// Dynamic imports for Recharts components to reduce initial bundle size
const LineChart = dynamic(() => import('recharts').then(mod => ({ default: mod.LineChart })), { 
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded animate-pulse flex items-center justify-center"><span className="text-gray-500">Loading chart...</span></div>
});
const Line = dynamic(() => import('recharts').then(mod => ({ default: mod.Line })), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.XAxis })), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.YAxis })), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => ({ default: mod.CartesianGrid })), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => ({ default: mod.Tooltip })), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => ({ default: mod.ResponsiveContainer })), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(mod => ({ default: mod.BarChart })), { 
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded animate-pulse flex items-center justify-center"><span className="text-gray-500">Loading chart...</span></div>
});
const Bar = dynamic(() => import('recharts').then(mod => ({ default: mod.Bar })), { ssr: false });
const AreaChart = dynamic(() => import('recharts').then(mod => ({ default: mod.AreaChart })), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => ({ default: mod.Area })), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(mod => ({ default: mod.PieChart })), { 
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded animate-pulse flex items-center justify-center"><span className="text-gray-500">Loading chart...</span></div>
});
const Pie = dynamic(() => import('recharts').then(mod => ({ default: mod.Pie })), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => ({ default: mod.Cell })), { ssr: false });

// Import Legend normally as it has TypeScript issues with dynamic import
import { Legend } from 'recharts';

// Dynamic imports for less critical icons
const BarChart3 = dynamic(() => import('lucide-react').then(mod => ({ default: mod.BarChart3 })), { 
  ssr: false,
  loading: () => <div className="w-5 h-5 bg-gray-300 rounded animate-pulse" />
});
const Settings = dynamic(() => import('lucide-react').then(mod => ({ default: mod.Settings })), { 
  ssr: false,
  loading: () => <div className="w-5 h-5 bg-gray-300 rounded animate-pulse" />
});

interface MetricCard {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface OptimizationRecommendation {
  type: 'warning' | 'info' | 'success';
  title: string;
  description: string;
  action?: string;
  impact: 'high' | 'medium' | 'low';
}

export default function EnhancedCampaignDetailsPage() {
  const params = useParams();
  const campaignId = params.id as string;
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [performance, setPerformance] = useState<PerformanceSnapshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'recommendations'>('overview');

  const loadCampaignData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [campaignData, performanceData] = await Promise.all([
        fetchCampaign(campaignId),
        fetchCampaignPerformance(campaignId)
      ]);
      
      setCampaign(campaignData);
      setPerformance(performanceData);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load campaign data';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    if (campaignId) {
      loadCampaignData();
    }
  }, [campaignId, loadCampaignData]);

  const handleDeleteCampaign = async () => {
    if (!confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) return;
    
    try {
      await deleteCampaign(campaignId);
      if (typeof window !== 'undefined') {
        window.location.href = '/campaigns';
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete campaign';
      alert(`Failed to delete campaign: ${errorMessage}`);
    }
  };

  // Generate mock performance data for charts
  const generateChartData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const baseSpend = 150 + Math.random() * 100;
      const impressions = Math.floor(5000 + Math.random() * 3000);
      const clicks = Math.floor(impressions * (0.02 + Math.random() * 0.02));
      const conversions = Math.floor(clicks * (0.05 + Math.random() * 0.03));
      
      data.push({
        date: date.toISOString().split('T')[0],
        spend: baseSpend,
        impressions,
        clicks,
        conversions,
        ctr: (clicks / impressions) * 100,
        cpc: baseSpend / clicks,
        roas: (conversions * 35) / baseSpend
      });
    }
    
    return data;
  };

  // Generate optimization recommendations
  const generateRecommendations = (): OptimizationRecommendation[] => {
    return [
      {
        type: 'warning',
        title: 'High CPC Detected',
        description: 'Your cost per click is 23% above industry average. Consider optimizing keywords or adjusting bids.',
        action: 'Review Keywords',
        impact: 'high'
      },
      {
        type: 'info',
        title: 'Budget Optimization Opportunity',
        description: 'Your campaign is under-spending. Consider increasing budget by 15% to capture more traffic.',
        action: 'Increase Budget',
        impact: 'medium'
      },
      {
        type: 'success',
        title: 'Strong Performance',
        description: 'Your conversion rate is 18% above platform average. Great targeting!',
        impact: 'low'
      },
      {
        type: 'info',
        title: 'Ad Schedule Optimization',
        description: 'Performance is 25% higher on weekdays. Consider adjusting ad schedule.',
        action: 'Optimize Schedule',
        impact: 'medium'
      }
    ];
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  const chartData = generateChartData();
  const recommendations = generateRecommendations();

  // Calculate metrics for cards
  const metricCards: MetricCard[] = [
    {
      title: 'Total Spend',
      value: formatCurrency(campaign?.spend || 0),
      change: -5.2,
      icon: <DollarSign className="w-5 h-5" />,
      color: 'red'
    },
    {
      title: 'Total Clicks',
      value: formatNumber(12450),
      change: 12.3,
      icon: <MousePointer className="w-5 h-5" />,
      color: 'blue'
    },
    {
      title: 'Impressions',
      value: formatNumber(245680),
      change: 8.7,
      icon: <Eye className="w-5 h-5" />,
      color: 'purple'
    },
    {
      title: 'Conversions',
      value: formatNumber(342),
      change: 15.4,
      icon: <Target className="w-5 h-5" />,
      color: 'green'
    }
  ];

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4 w-1/3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-8 w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !campaign) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-md">
            <strong>Error:</strong> {error || 'Campaign not found'}
            <button 
              onClick={loadCampaignData}
              className="ml-4 text-red-600 dark:text-red-400 underline hover:text-red-800 dark:hover:text-red-200"
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  const spendPercentage = campaign.budget && campaign.spend 
    ? Math.min((campaign.spend / campaign.budget) * 100, 100) 
    : 0;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">Dashboard</Link>
          <span>→</span>
          <Link href="/campaigns" className="hover:text-blue-600 dark:hover:text-blue-400">Campaigns</Link>
          <span>→</span>
          <span className="text-gray-900 dark:text-white">{campaign.name}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-8 gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{campaign.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Client: {campaign.client_name}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                {campaign.platform}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                Active
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Created {formatDate(campaign.created_at)}
              </span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <Link
              href={`/campaigns/${campaign.id}/edit`}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Settings className="w-4 h-4" />
              Edit
            </Link>
            <button
              onClick={handleDeleteCampaign}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricCards.map((metric, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${
                  metric.color === 'red' ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
                  metric.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                  metric.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' :
                  'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                }`}>
                  {metric.icon}
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  metric.change > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {metric.change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {Math.abs(metric.change)}%
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.title}</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{metric.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {[
              { key: 'overview', label: 'Overview', icon: BarChart3 },
              { key: 'performance', label: 'Performance', icon: TrendingUp },
              { key: 'recommendations', label: 'Recommendations', icon: Lightbulb }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === key
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Budget Progress */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Budget Progress</h3>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <span>Campaign Spend</span>
                      <span>{spendPercentage.toFixed(1)}% of budget</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          spendPercentage >= 90 ? 'bg-red-500' :
                          spendPercentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${spendPercentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm mt-2">
                      <span className="text-gray-600 dark:text-gray-400">Spent: {formatCurrency(campaign.spend)}</span>
                      <span className="text-gray-600 dark:text-gray-400">Budget: {formatCurrency(campaign.budget)}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Average CTR</h4>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">2.85%</p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">+12% vs last month</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Average CPC</h4>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">$1.24</p>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">+8% vs last month</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">ROAS</h4>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">4.2x</p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">+5% vs last month</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-6">
                {/* Time Range Selector */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Analytics</h3>
                  <div className="flex gap-2">
                    {['7d', '30d', '90d'].map((range) => (
                      <button
                        key={range}
                        onClick={() => setSelectedTimeRange(range)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          selectedTimeRange === range
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Performance Chart */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#6b7280"
                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb', 
                          borderRadius: '8px' 
                        }} 
                      />
                      <Legend />
                      <Line type="monotone" dataKey="spend" stroke="#ef4444" strokeWidth={2} dot={false} name="Spend ($)" />
                      <Line type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2} dot={false} name="Clicks" />
                      <Line type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={2} dot={false} name="Conversions" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI-Powered Optimization Recommendations</h3>
                </div>
                
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <div key={index} className={`border rounded-lg p-4 ${
                      rec.type === 'warning' ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20' :
                      rec.type === 'success' ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' :
                      'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
                    }`}>
                      <div className="flex items-start gap-3">
                        <div className={`p-1 rounded-full ${
                          rec.type === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                          rec.type === 'success' ? 'text-green-600 dark:text-green-400' :
                          'text-blue-600 dark:text-blue-400'
                        }`}>
                          {rec.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> :
                           rec.type === 'success' ? <CheckCircle className="w-5 h-5" /> :
                           <Lightbulb className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{rec.title}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              rec.impact === 'high' ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300' :
                              rec.impact === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300' :
                              'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                            }`}>
                              {rec.impact} impact
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">{rec.description}</p>
                          {rec.action && (
                            <button className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                              {rec.action}
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}