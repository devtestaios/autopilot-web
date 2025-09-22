'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
  Eye,
  MousePointer
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Chart Data Types
interface ChartPoint {
  label: string;
  value: number;
  color?: string;
  trend?: number;
}

interface TimeSeriesPoint {
  date: string;
  value: number;
  forecast?: boolean;
  confidence?: number;
}

interface HeatmapCell {
  x: string;
  y: string;
  value: number;
  label?: string;
}

// Component Props
interface InteractiveLineChartProps {
  data: TimeSeriesPoint[];
  title: string;
  height?: number;
  showForecast?: boolean;
  currency?: boolean;
}

interface InteractiveBarChartProps {
  data: ChartPoint[];
  title: string;
  height?: number;
  horizontal?: boolean;
}

interface InteractivePieChartProps {
  data: ChartPoint[];
  title: string;
  height?: number;
  donut?: boolean;
}

interface HeatmapChartProps {
  data: HeatmapCell[];
  title: string;
  xLabels: string[];
  yLabels: string[];
  height?: number;
}

// Interactive Line Chart Component
export function InteractiveLineChart({ 
  data, 
  title, 
  height = 300, 
  showForecast = false,
  currency = false 
}: InteractiveLineChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [selectedRange, setSelectedRange] = useState<[number, number] | null>(null);

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  const formatValue = (value: number) => {
    if (currency) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
    return value.toLocaleString();
  };

  const getPointY = (value: number) => {
    return height - 60 - ((value - minValue) / range) * (height - 100);
  };

  const generatePath = (dataPoints: TimeSeriesPoint[], forecast = false) => {
    if (dataPoints.length === 0) return '';
    
    const pathData = dataPoints.map((point, index) => {
      const x = 60 + (index / (dataPoints.length - 1)) * (400 - 120);
      const y = getPointY(point.value);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    return pathData;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LineChart className="h-5 w-5 text-blue-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <svg width="100%" height={height} viewBox="0 0 500 300" className="overflow-visible">
            {/* Grid Lines */}
            <defs>
              <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Y-Axis Labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
              const value = minValue + ratio * range;
              const y = height - 60 - ratio * (height - 100);
              return (
                <g key={index}>
                  <text
                    x="50"
                    y={y + 5}
                    textAnchor="end"
                    className="text-xs fill-gray-500 dark:fill-gray-400"
                  >
                    {formatValue(value)}
                  </text>
                  <line
                    x1="60"
                    y1={y}
                    x2="440"
                    y2={y}
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                </g>
              );
            })}

            {/* Main Data Line */}
            <path
              d={generatePath(data.filter(d => !d.forecast))}
              fill="none"
              stroke="url(#blueGradient)"
              strokeWidth="3"
              className="drop-shadow-sm"
            />

            {/* Forecast Line */}
            {showForecast && (
              <path
                d={generatePath(data.filter(d => d.forecast))}
                fill="none"
                stroke="url(#orangeGradient)"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="drop-shadow-sm"
              />
            )}

            {/* Data Points */}
            {data.map((point, index) => {
              const x = 60 + (index / (data.length - 1)) * (400 - 120);
              const y = getPointY(point.value);
              const isHovered = hoveredPoint === index;

              return (
                <g key={index}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 6 : 4}
                    fill={point.forecast ? "#f97316" : "#3b82f6"}
                    stroke="white"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredPoint(index)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  
                  {isHovered && (
                    <g>
                      <rect
                        x={x - 40}
                        y={y - 35}
                        width="80"
                        height="25"
                        rx="4"
                        fill="rgba(0,0,0,0.8)"
                      />
                      <text
                        x={x}
                        y={y - 20}
                        textAnchor="middle"
                        className="text-xs fill-white"
                      >
                        {formatValue(point.value)}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Gradients */}
            <defs>
              <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
              <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
          </svg>

          {/* X-Axis Labels */}
          <div className="flex justify-between mt-2 px-15">
            {data.map((point, index) => {
              if (index % Math.ceil(data.length / 6) === 0 || index === data.length - 1) {
                return (
                  <span key={index} className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                );
              }
              return null;
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Interactive Bar Chart Component
export function InteractiveBarChart({ 
  data, 
  title, 
  height = 300, 
  horizontal = false 
}: InteractiveBarChartProps) {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-purple-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, index) => {
            const percentage = (item.value / maxValue) * 100;
            const isHovered = hoveredBar === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.label}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {item.value.toLocaleString()}
                    </span>
                    {item.trend && (
                      <div className="flex items-center">
                        {item.trend > 0 ? (
                          <ArrowUpRight className="h-3 w-3 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 text-red-600" />
                        )}
                        <span className={cn(
                          'text-xs font-medium',
                          item.trend > 0 ? 'text-green-600' : 'text-red-600'
                        )}>
                          {Math.abs(item.trend).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={cn(
                      'h-full rounded-lg transition-all duration-200',
                      item.color || 'bg-gradient-to-r from-purple-500 to-purple-600',
                      isHovered && 'brightness-110 shadow-lg'
                    )}
                  />
                  
                  {isHovered && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-medium text-white">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// Interactive Pie Chart Component
export function InteractivePieChart({ 
  data, 
  title, 
  height = 300, 
  donut = false 
}: InteractivePieChartProps) {
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const centerX = 150;
  const centerY = 150;
  const radius = 100;
  const innerRadius = donut ? 40 : 0;

  const colors = [
    '#3b82f6', '#f59e0b', '#10b981', '#f97316', 
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
  ];

  let currentAngle = 0;
  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    currentAngle += angle;

    const largeArcFlag = angle > 180 ? 1 : 0;
    
    const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
    const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
    const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
    const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    return {
      ...item,
      pathData,
      percentage,
      color: item.color || colors[index % colors.length],
      startAngle,
      endAngle,
      midAngle: (startAngle + endAngle) / 2
    };
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5 text-green-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="relative">
            <svg width="300" height="300" viewBox="0 0 300 300">
              {segments.map((segment, index) => {
                const isHovered = hoveredSegment === index;
                
                return (
                  <g key={index}>
                    <path
                      d={segment.pathData}
                      fill={segment.color}
                      stroke="white"
                      strokeWidth="2"
                      className={cn(
                        'cursor-pointer transition-all duration-200',
                        isHovered && 'brightness-110 drop-shadow-lg'
                      )}
                      style={{
                        transformOrigin: `${centerX}px ${centerY}px`,
                        transform: isHovered ? 'scale(1.05)' : 'scale(1)'
                      }}
                      onMouseEnter={() => setHoveredSegment(index)}
                      onMouseLeave={() => setHoveredSegment(null)}
                    />
                    
                    {segment.percentage > 10 && (
                      <text
                        x={centerX + (radius * 0.7) * Math.cos((segment.midAngle * Math.PI) / 180)}
                        y={centerY + (radius * 0.7) * Math.sin((segment.midAngle * Math.PI) / 180)}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-xs font-medium fill-white"
                      >
                        {segment.percentage.toFixed(1)}%
                      </text>
                    )}
                  </g>
                );
              })}
              
              {donut && (
                <>
                  <circle
                    cx={centerX}
                    cy={centerY}
                    r={innerRadius}
                    fill="white"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <text
                    x={centerX}
                    y={centerY - 5}
                    textAnchor="middle"
                    className="text-lg font-bold fill-gray-900 dark:fill-white"
                  >
                    {total.toLocaleString()}
                  </text>
                  <text
                    x={centerX}
                    y={centerY + 15}
                    textAnchor="middle"
                    className="text-xs fill-gray-500"
                  >
                    Total
                  </text>
                </>
              )}
            </svg>
          </div>
          
          <div className="space-y-2">
            {segments.map((segment, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors',
                  hoveredSegment === index ? 'bg-gray-100 dark:bg-gray-800' : ''
                )}
                onMouseEnter={() => setHoveredSegment(index)}
                onMouseLeave={() => setHoveredSegment(null)}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {segment.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {segment.value.toLocaleString()} ({segment.percentage.toFixed(1)}%)
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Performance Heatmap Component
export function PerformanceHeatmap({ 
  data, 
  title, 
  xLabels, 
  yLabels, 
  height = 300 
}: HeatmapChartProps) {
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));

  const getIntensity = (value: number) => {
    return (value - minValue) / (maxValue - minValue);
  };

  const getCellColor = (intensity: number) => {
    const red = Math.round(255 * (1 - intensity));
    const green = Math.round(255 * intensity);
    return `rgb(${red}, ${green}, 100)`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-red-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-1" style={{ 
            gridTemplateColumns: `auto repeat(${xLabels.length}, 1fr)`,
            gridTemplateRows: `auto repeat(${yLabels.length}, 1fr)`
          }}>
            {/* Corner cell */}
            <div></div>
            
            {/* X-axis labels */}
            {xLabels.map((label, index) => (
              <div key={index} className="text-xs text-center font-medium text-gray-600 dark:text-gray-400 p-2">
                {label}
              </div>
            ))}
            
            {/* Y-axis labels and data cells */}
            {yLabels.map((yLabel, yIndex) => (
              <React.Fragment key={yIndex}>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 p-2 text-right">
                  {yLabel}
                </div>
                {xLabels.map((xLabel, xIndex) => {
                  const cellData = data.find(d => d.x === xLabel && d.y === yLabel);
                  const value = cellData?.value || 0;
                  const intensity = getIntensity(value);
                  
                  return (
                    <div
                      key={`${xIndex}-${yIndex}`}
                      className="relative h-12 rounded cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg"
                      style={{
                        backgroundColor: getCellColor(intensity),
                        opacity: intensity * 0.8 + 0.2
                      }}
                      onMouseEnter={() => setHoveredCell(cellData || { x: xLabel, y: yLabel, value })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-bold text-white drop-shadow">
                          {value.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          
          {/* Tooltip */}
          {hoveredCell && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 text-white p-3 rounded-lg shadow-lg"
            >
              <div className="text-sm font-medium">
                {hoveredCell.y} × {hoveredCell.x}
              </div>
              <div className="text-xs text-gray-300">
                Value: {hoveredCell.value.toFixed(2)}
                {hoveredCell.label && ` (${hoveredCell.label})`}
              </div>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Export all components
export {
  InteractiveLineChart,
  InteractiveBarChart,
  InteractivePieChart,
  PerformanceHeatmap
};