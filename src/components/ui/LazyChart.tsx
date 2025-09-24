'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Lazy-loaded chart components with intersection observer
const LazyLineChart = dynamic(() => import('recharts').then(mod => ({ default: mod.LineChart })), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg animate-pulse flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-gray-500 text-sm">Loading chart...</p>
      </div>
    </div>
  )
});

const LazyBarChart = dynamic(() => import('recharts').then(mod => ({ default: mod.BarChart })), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg animate-pulse flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-gray-500 text-sm">Loading chart...</p>
      </div>
    </div>
  )
});

const LazyAreaChart = dynamic(() => import('recharts').then(mod => ({ default: mod.AreaChart })), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg animate-pulse flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-gray-500 text-sm">Loading chart...</p>
      </div>
    </div>
  )
});

// Chart components
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => ({ default: mod.ResponsiveContainer })), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.XAxis })), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => ({ default: mod.YAxis })), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => ({ default: mod.CartesianGrid })), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => ({ default: mod.Tooltip })), { ssr: false });
const Line = dynamic(() => import('recharts').then(mod => ({ default: mod.Line })), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => ({ default: mod.Bar })), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => ({ default: mod.Area })), { ssr: false });

export interface LazyChartProps {
  type: 'line' | 'bar' | 'area';
  data: any[];
  height?: number;
  dataKey?: string;
  xAxisKey?: string;
  color?: string;
  title?: string;
}

export default function LazyChart({ 
  type, 
  data, 
  height = 300, 
  dataKey = 'value', 
  xAxisKey = 'name',
  color = '#3b82f6',
  title 
}: LazyChartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
        }
      },
      {
        threshold: 0.1, // Load when 10% visible
        rootMargin: '50px' // Start loading 50px before visibility
      }
    );

    if (chartRef.current) {
      observer.observe(chartRef.current);
    }

    return () => {
      if (chartRef.current) {
        observer.unobserve(chartRef.current);
      }
    };
  }, [hasLoaded]);

  const renderChart = () => {
    if (!isVisible && !hasLoaded) {
      return (
        <div 
          className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600"
          style={{ height }}
        >
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 text-gray-400">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
              </svg>
            </div>
            <p className="text-gray-500 text-sm">{title || 'Chart will load when visible'}</p>
          </div>
        </div>
      );
    }

    const chartProps = {
      data,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    const Chart = type === 'line' ? LazyLineChart : type === 'bar' ? LazyBarChart : LazyAreaChart;

    return (
      <ResponsiveContainer width="100%" height={height}>
        <Chart {...chartProps}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis dataKey={xAxisKey} fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          {type === 'line' && (
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: color }}
            />
          )}
          {type === 'bar' && (
            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
          )}
          {type === 'area' && (
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              fill={`${color}20`}
              strokeWidth={2}
            />
          )}
        </Chart>
      </ResponsiveContainer>
    );
  };

  return (
    <div ref={chartRef} className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
      )}
      {renderChart()}
    </div>
  );
}

// Export individual optimized chart components
export { LazyLineChart, LazyBarChart, LazyAreaChart };