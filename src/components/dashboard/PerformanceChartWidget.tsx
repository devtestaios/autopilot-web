'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Filter,
  Download,
  Maximize2,
  Eye,
  Target,
  DollarSign
} from 'lucide-react';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { PremiumBadge } from '@/components/ui/PremiumBadge';

interface DataPoint {
  date: string;
  value: number;
  label?: string;
  trend?: 'up' | 'down' | 'neutral';
}

interface ChartSeries {
  id: string;
  name: string;
  data: DataPoint[];
  color: string;
  visible: boolean;
}

interface PerformanceChartWidgetProps {
  title: string;
  subtitle?: string;
  series: ChartSeries[];
  timeRange: '7d' | '30d' | '90d' | '1y';
  onTimeRangeChange: (range: '7d' | '30d' | '90d' | '1y') => void;
  onExport?: () => void;
  onFullScreen?: () => void;
  showFilters?: boolean;
  loading?: boolean;
  className?: string;
}

const timeRangeLabels = {
  '7d': 'Last 7 Days',
  '30d': 'Last 30 Days',
  '90d': 'Last 90 Days',
  '1y': 'Last Year'
};

export function PerformanceChartWidget({
  title,
  subtitle,
  series,
  timeRange,
  onTimeRangeChange,
  onExport,
  onFullScreen,
  showFilters = true,
  loading = false,
  className = ''
}: PerformanceChartWidgetProps) {
  const [selectedSeries, setSelectedSeries] = useState<string[]>(
    series.filter(s => s.visible).map(s => s.id)
  );
  const [hoverPoint, setHoverPoint] = useState<{ seriesId: string; index: number } | null>(null);

  const toggleSeries = (seriesId: string) => {
    setSelectedSeries(prev => 
      prev.includes(seriesId) 
        ? prev.filter(id => id !== seriesId)
        : [...prev, seriesId]
    );
  };

  // Calculate chart dimensions and data points for visualization
  const chartHeight = 300;
  const chartWidth = 600;
  const padding = { top: 20, right: 30, bottom: 40, left: 60 };

  const activeSeries = series.filter(s => selectedSeries.includes(s.id));

  // Get value range for scaling
  const allValues = activeSeries.flatMap(s => s.data.map(d => d.value));
  const minValue = Math.min(...allValues, 0);
  const maxValue = Math.max(...allValues, 0);
  const valueRange = maxValue - minValue || 1;

  // Calculate chart points
  const getChartPoints = (data: DataPoint[]) => {
    const xStep = (chartWidth - padding.left - padding.right) / Math.max(data.length - 1, 1);
    
    return data.map((point, index) => ({
      x: padding.left + (index * xStep),
      y: padding.top + ((maxValue - point.value) / valueRange) * (chartHeight - padding.top - padding.bottom),
      value: point.value,
      date: point.date,
      index
    }));
  };

  // Generate SVG path for line chart
  const generatePath = (points: any[]) => {
    if (points.length === 0) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prevPoint = points[i - 1];
      const currentPoint = points[i];
      
      // Create smooth curves using quadratic Bézier curves
      const controlX = (prevPoint.x + currentPoint.x) / 2;
      path += ` Q ${controlX} ${prevPoint.y} ${currentPoint.x} ${currentPoint.y}`;
    }
    
    return path;
  };

  // Calculate summary stats
  const getSeriesStats = (seriesData: DataPoint[]) => {
    if (seriesData.length === 0) return { current: 0, change: 0, trend: 'neutral' as const };
    
    const current = seriesData[seriesData.length - 1].value;
    const previous = seriesData[seriesData.length - 2]?.value || current;
    const change = previous !== 0 ? ((current - previous) / previous) * 100 : 0;
    const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'neutral';
    
    return { current, change, trend };
  };

  if (loading) {
    return (
      <PremiumCard variant="glassmorphism" className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </PremiumCard>
    );
  }

  return (
    <PremiumCard variant="glassmorphism" className={`p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Time Range Selector */}
          <div className="flex items-center space-x-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {Object.entries(timeRangeLabels).map(([range, label]) => (
              <button
                key={range}
                onClick={() => onTimeRangeChange(range as any)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {label.split(' ')[1]} {/* Show only the time part */}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          {showFilters && (
            <PremiumButton size="sm" variant="ghost">
              <Filter className="w-4 h-4" />
            </PremiumButton>
          )}

          {onExport && (
            <PremiumButton size="sm" variant="ghost" onClick={onExport}>
              <Download className="w-4 h-4" />
            </PremiumButton>
          )}

          {onFullScreen && (
            <PremiumButton size="sm" variant="ghost" onClick={onFullScreen}>
              <Maximize2 className="w-4 h-4" />
            </PremiumButton>
          )}
        </div>
      </div>

      {/* Series Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {activeSeries.slice(0, 3).map((seriesItem) => {
          const stats = getSeriesStats(seriesItem.data);
          const TrendIcon = stats.trend === 'up' ? TrendingUp : TrendingDown;
          
          return (
            <motion.div
              key={seriesItem.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: seriesItem.color }}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {seriesItem.name}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <TrendIcon className={`w-3 h-3 ${
                    stats.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`} />
                  <span className={`text-xs font-medium ${
                    stats.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {Math.abs(stats.change).toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.current.toLocaleString()}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Chart Container */}
      <div className="relative">
        <svg
          width={chartWidth}
          height={chartHeight}
          className="w-full h-auto"
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        >
          {/* Grid Lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Chart Lines */}
          {activeSeries.map((seriesItem, seriesIndex) => {
            const points = getChartPoints(seriesItem.data);
            const path = generatePath(points);
            
            return (
              <g key={seriesItem.id}>
                {/* Area Fill */}
                <motion.path
                  d={`${path} L ${points[points.length - 1]?.x} ${chartHeight - padding.bottom} L ${padding.left} ${chartHeight - padding.bottom} Z`}
                  fill={seriesItem.color}
                  fillOpacity="0.1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: seriesIndex * 0.1 }}
                />
                
                {/* Line */}
                <motion.path
                  d={path}
                  fill="none"
                  stroke={seriesItem.color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: seriesIndex * 0.1 }}
                />

                {/* Data Points */}
                {points.map((point, index) => (
                  <motion.circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r={hoverPoint?.seriesId === seriesItem.id && hoverPoint?.index === index ? 6 : 4}
                    fill={seriesItem.color}
                    stroke="white"
                    strokeWidth="2"
                    className="cursor-pointer"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: seriesIndex * 0.1 + index * 0.05 }}
                    onMouseEnter={() => setHoverPoint({ seriesId: seriesItem.id, index })}
                    onMouseLeave={() => setHoverPoint(null)}
                  />
                ))}
              </g>
            );
          })}

          {/* Axes */}
          <line 
            x1={padding.left} 
            y1={chartHeight - padding.bottom}
            x2={chartWidth - padding.right}
            y2={chartHeight - padding.bottom}
            stroke="#6b7280"
            strokeWidth="1"
          />
          <line 
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={chartHeight - padding.bottom}
            stroke="#6b7280" 
            strokeWidth="1"
          />
        </svg>

        {/* Tooltip */}
        {hoverPoint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 pointer-events-none"
            style={{ 
              left: '50%', 
              top: '20px',
              transform: 'translateX(-50%)'
            }}
          >
            {activeSeries.map(seriesItem => {
              if (seriesItem.id !== hoverPoint.seriesId) return null;
              const point = seriesItem.data[hoverPoint.index];
              if (!point) return null;
              
              return (
                <div key={seriesItem.id} className="text-sm">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {seriesItem.name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {point.date}
                  </p>
                  <p className="font-bold text-lg" style={{ color: seriesItem.color }}>
                    {point.value.toLocaleString()}
                  </p>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-4">
        {series.map((seriesItem) => (
          <button
            key={seriesItem.id}
            onClick={() => toggleSeries(seriesItem.id)}
            className={`flex items-center space-x-2 transition-opacity ${
              selectedSeries.includes(seriesItem.id) ? 'opacity-100' : 'opacity-50'
            }`}
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: seriesItem.color }}
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {seriesItem.name}
            </span>
          </button>
        ))}
      </div>
    </PremiumCard>
  );
}

export default PerformanceChartWidget;