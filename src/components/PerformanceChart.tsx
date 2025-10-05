'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports for Recharts components
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
const BarChart = dynamic(() => import('recharts').then(mod => ({ default: mod.BarChart })), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => ({ default: mod.Bar })), { ssr: false });

// Import Legend normally due to TypeScript issues
import { Legend } from 'recharts';

interface PerformanceChartProps {
  data: Array<{
    date: string;
    spend: number;
    clicks: number;
    impressions: number;
    conversions: number;
  }>;
  metric: 'spend' | 'clicks' | 'impressions' | 'conversions';
  title?: string;
}

export default function PerformanceChart({ data, metric, title }: PerformanceChartProps) {
  const formatValue = (value: number) => {
    if (metric === 'spend') {
      return `$${value.toFixed(2)}`;
    }
    return value.toLocaleString();
  };

  const getColor = () => {
    switch (metric) {
      case 'spend': return '#ef4444';
      case 'clicks': return '#3b82f6';
      case 'impressions': return '#10b981';
      case 'conversions': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 capitalize">
        {title || `${metric} Over Time`}
      </h3>
      
      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          No performance data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300} data-testid="responsive-container">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              fontSize={12}
            />
            <YAxis 
              tickFormatter={formatValue}
              fontSize={12}
            />
            <Tooltip 
              labelFormatter={(value) => formatDate(value as string)}
              formatter={(value: any) => [formatValue(value as number), metric.charAt(0).toUpperCase() + metric.slice(1)]}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={metric} 
              stroke={getColor()} 
              strokeWidth={2}
              dot={{ fill: getColor(), strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

interface CampaignComparisonChartProps {
  campaigns: Array<{
    name: string;
    spend: number;
    budget: number;
    conversions?: number;
  }>;
}

export function CampaignComparisonChart({ campaigns }: CampaignComparisonChartProps) {
  const data = campaigns.map(campaign => ({
    name: campaign.name.length > 15 ? campaign.name.substring(0, 15) + '...' : campaign.name,
    spend: campaign.spend || 0,
    budget: campaign.budget || 0,
    conversions: campaign.conversions || 0,
    remaining: (campaign.budget || 0) - (campaign.spend || 0)
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Campaign Budget vs Spend</h3>
      
      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          No campaign data available
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300} data-testid="responsive-container">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              fontSize={12}
            />
            <Tooltip 
              formatter={(value: any, name: any) => [`$${(value as number).toLocaleString()}`, name as string]}
            />
            <Legend />
            <Bar dataKey="budget" fill="#e5e7eb" name="Budget" />
            <Bar dataKey="spend" fill="#3b82f6" name="Spend" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}