'use client';

import { memo, useMemo, useCallback, useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { PremiumButton } from '@/components/ui/PremiumButton';

interface ChartData {
  [key: string]: any;
}

interface OptimizedChartProps {
  type: 'line' | 'bar' | 'pie';
  data: ChartData[];
  title?: string;
  height?: number;
  loading?: boolean;
  error?: string;
  xKey: string;
  yKeys: string[];
  colors?: string[];
  showLegend?: boolean;
  showGrid?: boolean;
  animated?: boolean;
  responsive?: boolean;
  onDataPointClick?: (data: ChartData) => void;
}

// Memoized Tooltip component for better performance
const CustomTooltip = memo(({ active, payload, label, formatter }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
        {label}
      </p>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {entry.name}: {formatter ? formatter(entry.value) : entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
});

CustomTooltip.displayName = 'CustomTooltip';

// Memoized chart components for performance
const MemoizedLineChart = memo(({ 
  data, 
  xKey, 
  yKeys, 
  colors, 
  showGrid, 
  onDataPointClick,
  height 
}: any) => (
  <ResponsiveContainer width="100%" height={height}>
    <LineChart data={data} onClick={onDataPointClick}>
      {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
      <XAxis 
        dataKey={xKey} 
        fontSize={12}
        className="text-gray-600 dark:text-gray-400"
      />
      <YAxis 
        fontSize={12}
        className="text-gray-600 dark:text-gray-400"
      />
      <CustomTooltip />
      {yKeys.map((key: string, index: number) => (
        <Line
          key={key}
          type="monotone"
          dataKey={key}
          stroke={colors?.[index] || `hsl(${index * 60}, 70%, 50%)`}
          strokeWidth={2}
          dot={{ strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, strokeWidth: 0 }}
          animationDuration={300}
        />
      ))}
    </LineChart>
  </ResponsiveContainer>
));

MemoizedLineChart.displayName = 'MemoizedLineChart';

const MemoizedBarChart = memo(({ 
  data, 
  xKey, 
  yKeys, 
  colors, 
  showGrid, 
  onDataPointClick,
  height 
}: any) => (
  <ResponsiveContainer width="100%" height={height}>
    <BarChart data={data} onClick={onDataPointClick}>
      {showGrid && <CartesianGrid strokeDasharray="3 3" className="opacity-30" />}
      <XAxis 
        dataKey={xKey} 
        fontSize={12}
        className="text-gray-600 dark:text-gray-400"
      />
      <YAxis 
        fontSize={12}
        className="text-gray-600 dark:text-gray-400"
      />
      <CustomTooltip />
      {yKeys.map((key: string, index: number) => (
        <Bar
          key={key}
          dataKey={key}
          fill={colors?.[index] || `hsl(${index * 60}, 70%, 50%)`}
          radius={[2, 2, 0, 0]}
          animationDuration={300}
        />
      ))}
    </BarChart>
  </ResponsiveContainer>
));

MemoizedBarChart.displayName = 'MemoizedBarChart';

const MemoizedPieChart = memo(({ 
  data, 
  colors, 
  onDataPointClick,
  height 
}: any) => (
  <ResponsiveContainer width="100%" height={height}>
    <PieChart onClick={onDataPointClick}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={Math.min(height / 3, 80)}
        dataKey="value"
        animationDuration={300}
      >
        {data.map((entry: any, index: number) => (
          <Cell 
            key={`cell-${index}`} 
            fill={colors?.[index] || entry.color || `hsl(${index * 60}, 70%, 50%)`} 
          />
        ))}
      </Pie>
      <CustomTooltip />
    </PieChart>
  </ResponsiveContainer>
));

MemoizedPieChart.displayName = 'MemoizedPieChart';

// Loading skeleton for charts
const ChartSkeleton = memo(({ height }: { height: number }) => (
  <div className="animate-pulse" style={{ height }}>
    <div className="h-full bg-gray-200 dark:bg-gray-700 rounded"></div>
  </div>
));

ChartSkeleton.displayName = 'ChartSkeleton';

export const OptimizedChart = memo<OptimizedChartProps>(({
  type,
  data,
  title,
  height = 300,
  loading = false,
  error,
  xKey,
  yKeys,
  colors,
  showLegend = true,
  showGrid = true,
  animated = true,
  responsive = true,
  onDataPointClick
}) => {
  const [chartType, setChartType] = useState(type);

  // Memoize processed data to avoid recalculation
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Add any data processing logic here
    return data;
  }, [data]);

  // Memoize chart component selection
  const chartComponent = useMemo(() => {
    const props = {
      data: processedData,
      xKey,
      yKeys,
      colors,
      showGrid,
      onDataPointClick,
      height: height - (title ? 60 : 20)
    };

    switch (chartType) {
      case 'line':
        return <MemoizedLineChart {...props} />;
      case 'bar':
        return <MemoizedBarChart {...props} />;
      case 'pie':
        return <MemoizedPieChart {...props} />;
      default:
        return <MemoizedLineChart {...props} />;
    }
  }, [chartType, processedData, xKey, yKeys, colors, showGrid, onDataPointClick, height]);

  // Memoize chart type options
  const chartTypeOptions = useMemo(() => [
    { type: 'line', icon: TrendingUp, label: 'Line' },
    { type: 'bar', icon: BarChart3, label: 'Bar' },
    { type: 'pie', icon: PieChartIcon, label: 'Pie' }
  ], []);

  const handleChartTypeChange = useCallback((newType: 'line' | 'bar' | 'pie') => {
    setChartType(newType);
  }, []);

  if (loading) {
    return (
      <PremiumCard className="p-6">
        {title && (
          <div className="mb-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse"></div>
          </div>
        )}
        <ChartSkeleton height={height - (title ? 60 : 20)} />
      </PremiumCard>
    );
  }

  if (error) {
    return (
      <PremiumCard className="p-6">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {title}
          </h3>
        )}
        <div className="flex items-center justify-center h-48 text-center">
          <div>
            <TrendingDown className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <p className="text-red-600 dark:text-red-400 text-sm">
              {error}
            </p>
          </div>
        </div>
      </PremiumCard>
    );
  }

  return (
    <PremiumCard className="p-6">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          
          {/* Chart Type Selector */}
          <div className="flex items-center gap-1">
            {chartTypeOptions.map(({ type: optionType, icon: Icon, label }) => (
              <PremiumButton
                key={optionType}
                variant={chartType === optionType ? 'primary' : 'ghost'}
                size="sm"
                icon={<Icon className="w-4 h-4" />}
                onClick={() => handleChartTypeChange(optionType as 'line' | 'bar' | 'pie')}
                className="px-2"
                title={`Switch to ${label} chart`}
              >
                {label}
              </PremiumButton>
            ))}
          </div>
        </div>
      )}
      
      <AnimatePresence mode="wait">
        <motion.div
          key={chartType}
          initial={animated ? { opacity: 0, scale: 0.95 } : false}
          animate={{ opacity: 1, scale: 1 }}
          exit={animated ? { opacity: 0, scale: 0.95 } : undefined}
          transition={{ duration: 0.2 }}
          style={{ height: height - (title ? 60 : 20) }}
        >
          {chartComponent}
        </motion.div>
      </AnimatePresence>
      
      {showLegend && yKeys.length > 1 && chartType !== 'pie' && (
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          {yKeys.map((key, index) => (
            <div key={key} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: colors?.[index] || `hsl(${index * 60}, 70%, 50%)` }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
            </div>
          ))}
        </div>
      )}
    </PremiumCard>
  );
});

OptimizedChart.displayName = 'OptimizedChart';

export default OptimizedChart;