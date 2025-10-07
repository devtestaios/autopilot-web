'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamic imports for Recharts components
const BarChart = dynamic(() => import('recharts').then(mod => ({ default: mod.BarChart })), { 
  ssr: false,
  loading: () => <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded animate-pulse flex items-center justify-center"><span className="text-gray-500">Loading chart...</span></div>
});
const Bar = dynamic(() => import('recharts').then(mod => ({ default: mod.Bar })), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.XAxis })), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.YAxis })), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => ({ default: mod.CartesianGrid })), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => ({ default: mod.Tooltip })), { ssr: false });
const LineChart = dynamic(() => import('recharts').then(mod => ({ default: mod.LineChart })), { ssr: false });
const Line = dynamic(() => import('recharts').then(mod => ({ default: mod.Line })), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => ({ default: mod.ResponsiveContainer })), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(mod => ({ default: mod.PieChart })), { ssr: false });
const Pie = dynamic(() => import('recharts').then(mod => ({ default: mod.Pie })), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => ({ default: mod.Cell })), { ssr: false });
import { TrendingUp, TrendingDown, DollarSign, MousePointer, Eye, Target, Calendar, Filter } from 'lucide-react';

interface PerformanceMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number;
  cpc: number;
  cpa: number;
  roas?: number;
}

interface CampaignPerformance {
  campaignId: string;
  campaignName: string;
  platform: string;
  date: string;
  metrics: PerformanceMetrics;
}

interface GoogleAdsPerformanceDashboardProps {
  campaigns?: any[];
}

export default function GoogleAdsPerformanceDashboard({ campaigns = [] }: GoogleAdsPerformanceDashboardProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [performanceData, setPerformanceData] = useState<CampaignPerformance[]>([]);
  const [loading, setLoading] = useState(false);

  // Sample performance data for demonstration
  const generateSampleData = () => {
    const sampleData: CampaignPerformance[] = [];
    const today = new Date();
    
    campaigns.filter(c => c.platform === 'google_ads').forEach((campaign, campaignIndex) => {
      for (let i = 0; i < parseInt(timeRange); i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        // Generate realistic performance metrics with some variation
        const baseImpressions = 1000 + Math.random() * 2000;
        const baseCtr = 0.03 + Math.random() * 0.05;
        const clicks = Math.floor(baseImpressions * baseCtr);
        const conversions = Math.floor(clicks * (0.02 + Math.random() * 0.08));
        const cpc = 0.5 + Math.random() * 2;
        const spend = clicks * cpc;
        
        sampleData.push({
          campaignId: campaign.id,
          campaignName: campaign.name,
          platform: campaign.platform,
          date: date.toISOString().split('T')[0],
          metrics: {
            impressions: Math.floor(baseImpressions),
            clicks,
            conversions,
            spend: Math.round(spend * 100) / 100,
            ctr: Math.round(baseCtr * 10000) / 100,
            cpc: Math.round(cpc * 100) / 100,
            cpa: conversions > 0 ? Math.round((spend / conversions) * 100) / 100 : 0,
            roas: conversions > 0 ? Math.round((conversions * 50 / spend) * 100) / 100 : 0
          }
        });
      }
    });
    
    return sampleData.reverse(); // Show oldest to newest
  };

  useEffect(() => {
    if (campaigns.length > 0) {
      setLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        setPerformanceData(generateSampleData());
        setLoading(false);
      }, 1000);
    }
  }, [campaigns, timeRange]);

  // Aggregate metrics by date for charts
  const dailyMetrics = performanceData.reduce((acc: any[], curr) => {
    const existingDay = acc.find(day => day.date === curr.date);
    if (existingDay) {
      existingDay.impressions += curr.metrics.impressions;
      existingDay.clicks += curr.metrics.clicks;
      existingDay.conversions += curr.metrics.conversions;
      existingDay.spend += curr.metrics.spend;
    } else {
      acc.push({
        date: curr.date,
        impressions: curr.metrics.impressions,
        clicks: curr.metrics.clicks,
        conversions: curr.metrics.conversions,
        spend: curr.metrics.spend
      });
    }
    return acc;
  }, []);

  // Calculate total metrics
  const totalMetrics = performanceData.reduce((acc, curr) => ({
    impressions: acc.impressions + curr.metrics.impressions,
    clicks: acc.clicks + curr.metrics.clicks,
    conversions: acc.conversions + curr.metrics.conversions,
    spend: acc.spend + curr.metrics.spend
  }), { impressions: 0, clicks: 0, conversions: 0, spend: 0 });

  const avgCtr = totalMetrics.impressions > 0 ? (totalMetrics.clicks / totalMetrics.impressions * 100) : 0;
  const avgCpc = totalMetrics.clicks > 0 ? (totalMetrics.spend / totalMetrics.clicks) : 0;
  const avgCpa = totalMetrics.conversions > 0 ? (totalMetrics.spend / totalMetrics.conversions) : 0;

  // Campaign performance breakdown
  const campaignBreakdown = campaigns
    .filter(c => c.platform === 'google_ads')
    .map(campaign => {
      const campaignData = performanceData.filter(p => p.campaignId === campaign.id);
      const campaignTotals = campaignData.reduce((acc, curr) => ({
        impressions: acc.impressions + curr.metrics.impressions,
        clicks: acc.clicks + curr.metrics.clicks,
        conversions: acc.conversions + curr.metrics.conversions,
        spend: acc.spend + curr.metrics.spend
      }), { impressions: 0, clicks: 0, conversions: 0, spend: 0 });
      
      return {
        name: campaign.name,
        ...campaignTotals,
        ctr: campaignTotals.impressions > 0 ? (campaignTotals.clicks / campaignTotals.impressions * 100) : 0,
        cpc: campaignTotals.clicks > 0 ? (campaignTotals.spend / campaignTotals.clicks) : 0,
        cpa: campaignTotals.conversions > 0 ? (campaignTotals.spend / campaignTotals.conversions) : 0
      };
    });

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  if (campaigns.filter(c => c.platform === 'google_ads').length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Google Ads Campaigns</h3>
          <p className="text-gray-600">
            Connect your Google Ads account and sync campaigns to see performance analytics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold">Google Ads Performance Analytics</h3>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Impressions</span>
            </div>
            <div className="text-2xl font-bold text-blue-900">
              {totalMetrics.impressions.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MousePointer className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">Clicks</span>
            </div>
            <div className="text-2xl font-bold text-green-900">
              {totalMetrics.clicks.toLocaleString()}
            </div>
            <div className="text-xs text-green-700">
              CTR: {avgCtr.toFixed(2)}%
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-900">Conversions</span>
            </div>
            <div className="text-2xl font-bold text-purple-900">
              {totalMetrics.conversions.toLocaleString()}
            </div>
            <div className="text-xs text-purple-700">
              CPA: ${avgCpa.toFixed(2)}
            </div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-900">Spend</span>
            </div>
            <div className="text-2xl font-bold text-orange-900">
              ${totalMetrics.spend.toFixed(2)}
            </div>
            <div className="text-xs text-orange-700">
              CPC: ${avgCpc.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Performance Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-md font-semibold mb-4">Daily Performance Trends</h4>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-gray-500">Loading performance data...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dailyMetrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: any, name: any) => [
                    String(name) === 'spend' ? `$${value.toFixed(2)}` : value.toLocaleString(),
                    String(name).charAt(0).toUpperCase() + String(name).slice(1)
                  ]}
                />
                <Line type="monotone" dataKey="clicks" stroke="#3B82F6" strokeWidth={2} />
                <Line type="monotone" dataKey="conversions" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="spend" stroke="#F59E0B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Campaign Performance Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-md font-semibold mb-4">Campaign Spend Distribution</h4>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-gray-500">Loading campaign data...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={campaignBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => name ? `${name.split(' ')[0]} ${(Number(percent) * 100).toFixed(0)}%` : ''}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="spend"
                >
                  {campaignBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => [`$${value.toFixed(2)}`, 'Spend']} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Campaign Performance Table */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h4 className="text-md font-semibold mb-4">Campaign Performance Breakdown</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3">Campaign</th>
                <th className="text-right py-2 px-3">Impressions</th>
                <th className="text-right py-2 px-3">Clicks</th>
                <th className="text-right py-2 px-3">CTR</th>
                <th className="text-right py-2 px-3">Conversions</th>
                <th className="text-right py-2 px-3">CPC</th>
                <th className="text-right py-2 px-3">CPA</th>
                <th className="text-right py-2 px-3">Spend</th>
              </tr>
            </thead>
            <tbody>
              {campaignBreakdown.map((campaign, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-3 font-medium">{campaign.name}</td>
                  <td className="text-right py-2 px-3">{campaign.impressions.toLocaleString()}</td>
                  <td className="text-right py-2 px-3">{campaign.clicks.toLocaleString()}</td>
                  <td className="text-right py-2 px-3">{campaign.ctr.toFixed(2)}%</td>
                  <td className="text-right py-2 px-3">{campaign.conversions.toLocaleString()}</td>
                  <td className="text-right py-2 px-3">${campaign.cpc.toFixed(2)}</td>
                  <td className="text-right py-2 px-3">${campaign.cpa.toFixed(2)}</td>
                  <td className="text-right py-2 px-3 font-semibold">${campaign.spend.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}