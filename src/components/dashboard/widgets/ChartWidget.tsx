'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { PremiumCard } from '@/components/ui/PremiumCard';
import type { DashboardWidget } from '@/components/DashboardCustomizer';

// Dynamic imports for Recharts components to reduce bundle size
const BarChart = dynamic(() => import('recharts').then(mod => ({ default: mod.BarChart })), { 
  ssr: false,
  loading: () => <div className="h-[200px] bg-gray-100 dark:bg-gray-700 rounded animate-pulse flex items-center justify-center"><span className="text-gray-500 text-sm">Loading chart...</span></div>
});
const Bar = dynamic(() => import('recharts').then(mod => ({ default: mod.Bar })), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.XAxis })), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.YAxis })), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => ({ default: mod.CartesianGrid })), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => ({ default: mod.Tooltip })), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => ({ default: mod.ResponsiveContainer })), { ssr: false });
const LineChart = dynamic(() => import('recharts').then(mod => ({ default: mod.LineChart })), { 
  ssr: false,
  loading: () => <div className="h-[200px] bg-gray-100 dark:bg-gray-700 rounded animate-pulse flex items-center justify-center"><span className="text-gray-500 text-sm">Loading chart...</span></div>
});
const Line = dynamic(() => import('recharts').then(mod => ({ default: mod.Line })), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(mod => ({ default: mod.PieChart })), { 
  ssr: false,
  loading: () => <div className="h-[200px] bg-gray-100 dark:bg-gray-700 rounded animate-pulse flex items-center justify-center"><span className="text-gray-500 text-sm">Loading chart...</span></div>
});
const Pie = dynamic(() => import('recharts').then(mod => ({ default: mod.Pie })), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => ({ default: mod.Cell })), { ssr: false });

interface ChartWidgetProps {
  widget: DashboardWidget;
  data: any;
  isEditMode: boolean;
  onSelect: () => void;
}

export default function ChartWidget({ widget, data, isEditMode, onSelect }: ChartWidgetProps) {
  // Sample data for charts
  const performanceData = [
    { date: '2024-01-01', impressions: 12000, clicks: 480, conversions: 24 },
    { date: '2024-01-02', impressions: 15000, clicks: 620, conversions: 31 },
    { date: '2024-01-03', impressions: 18000, clicks: 720, conversions: 36 },
    { date: '2024-01-04', impressions: 16000, clicks: 680, conversions: 34 },
    { date: '2024-01-05', impressions: 20000, clicks: 840, conversions: 42 },
    { date: '2024-01-06', impressions: 22000, clicks: 920, conversions: 46 },
    { date: '2024-01-07', impressions: 25000, clicks: 1050, conversions: 52 }
  ];

  const platformData = [
    { name: 'Google Ads', value: 45, color: '#4285f4' },
    { name: 'Meta', value: 30, color: '#1877f2' },
    { name: 'LinkedIn', value: 15, color: '#0077b5' },
    { name: 'Others', value: 10, color: '#6b7280' }
  ];

  const renderChart = () => {
    switch (widget.component) {
      case 'PerformanceChart':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date" 
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis fontSize={12} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: any, name: any) => [value.toLocaleString(), String(name)]}
              />
              <Line 
                type="monotone" 
                dataKey="clicks" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="conversions" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'PlatformChart':
        return (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={platformData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {platformData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [`${value}%`, 'Share']} />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="date" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="impressions" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <motion.div
      whileHover={{ scale: isEditMode ? 1 : 1.02 }}
      onClick={isEditMode ? onSelect : undefined}
      className={`h-full ${isEditMode ? 'cursor-pointer' : ''}`}
    >
      <PremiumCard className="p-6 h-full">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {widget.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Last 7 days performance
          </p>
        </div>
        
        <div className="h-[200px]">
          {renderChart()}
        </div>
      </PremiumCard>
    </motion.div>
  );
}