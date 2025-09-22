'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Zap,
  DollarSign,
  Target,
  Users
} from 'lucide-react';

interface AIMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  status: 'excellent' | 'good' | 'warning' | 'critical';
  unit: string;
  description: string;
}

interface OptimizationEvent {
  id: string;
  timestamp: Date;
  type: 'budget_increase' | 'budget_decrease' | 'bid_optimization' | 'keyword_addition' | 'pause_campaign';
  campaign: string;
  description: string;
  impact: string;
  confidence: number;
}

export default function AIMonitoringDashboard() {
  const [metrics, setMetrics] = useState<AIMetric[]>([
    {
      id: 'roas',
      name: 'Average ROAS',
      value: 4.2,
      previousValue: 3.8,
      change: 10.5,
      trend: 'up',
      status: 'excellent',
      unit: 'x',
      description: 'Return on Ad Spend across all platforms'
    },
    {
      id: 'cpa',
      name: 'Average CPA',
      value: 24.50,
      previousValue: 28.30,
      change: -13.4,
      trend: 'down',
      status: 'good',
      unit: '$',
      description: 'Cost per acquisition'
    },
    {
      id: 'conversion_rate',
      name: 'Conversion Rate',
      value: 3.7,
      previousValue: 3.2,
      change: 15.6,
      trend: 'up',
      status: 'excellent',
      unit: '%',
      description: 'Overall conversion rate'
    },
    {
      id: 'daily_spend',
      name: 'Daily Spend',
      value: 4770.25,
      previousValue: 5124.80,
      change: -6.9,
      trend: 'down',
      status: 'good',
      unit: '$',
      description: 'Total daily ad spend'
    }
  ]);

  const [recentEvents, setRecentEvents] = useState<OptimizationEvent[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 300000),
      type: 'budget_increase',
      campaign: 'Holiday Sale 2024',
      description: 'Increased daily budget by $300 due to 420% ROAS',
      impact: '+$1,260 daily revenue',
      confidence: 94
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 900000),
      type: 'bid_optimization',
      campaign: 'Black Friday Collection',
      description: 'Optimized keyword bids, reduced CPC by 18%',
      impact: '-$145 daily spend',
      confidence: 87
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 1800000),
      type: 'pause_campaign',
      campaign: 'Summer Clearance',
      description: 'Paused underperforming campaign (CPA exceeded target by 200%)',
      impact: '-$890 daily waste',
      confidence: 91
    }
  ]);

  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Simulate real-time updates
      setMetrics(prev => prev.map(metric => {
        const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
        const newValue = metric.value * (1 + variation);
        const change = ((newValue - metric.previousValue) / metric.previousValue) * 100;
        
        return {
          ...metric,
          previousValue: metric.value,
          value: parseFloat(newValue.toFixed(2)),
          change: parseFloat(change.toFixed(1)),
          trend: change > 2 ? 'up' : change < -2 ? 'down' : 'stable'
        };
      }));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'good': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'warning': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'critical': return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'budget_increase': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'budget_decrease': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'bid_optimization': return <Zap className="h-4 w-4 text-yellow-600" />;
      case 'keyword_addition': return <Target className="h-4 w-4 text-blue-600" />;
      case 'pause_campaign': return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">AI Performance Monitoring</h2>
          <p className="text-gray-600 dark:text-gray-400">Real-time campaign optimization tracking</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${isLive ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isLive ? 'Live' : 'Paused'}
            </span>
          </div>
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isLive 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isLive ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <motion.div
            key={metric.id}
            layout
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.name}</h3>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                {metric.status}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metric.unit === '$' ? '$' : ''}{metric.value.toLocaleString()}{metric.unit !== '$' ? metric.unit : ''}
                </p>
                <div className="flex items-center space-x-1 mt-1">
                  {getTrendIcon(metric.trend, metric.change)}
                  <span className={`text-sm font-medium ${
                    metric.change > 0 ? 'text-green-600' : 
                    metric.change < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{metric.description}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent AI Events */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent AI Optimizations</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentEvents.map((event) => (
              <div key={event.id} className="flex items-start space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white">{event.campaign}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{event.description}</p>
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-1">{event.impact}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatTime(event.timestamp)}</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{event.confidence}% confidence</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">AI Performance Trends</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-center">
            <Activity className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 dark:text-gray-400">Real-time performance chart coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
}