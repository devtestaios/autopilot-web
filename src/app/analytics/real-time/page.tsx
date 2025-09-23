'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Eye, 
  Users, 
  Clock, 
  TrendingUp, 
  Smartphone, 
  Monitor, 
  Tablet,
  RefreshCw,
  Calendar,
  Target,
  Zap
} from 'lucide-react';

interface AnalyticsMetrics {
  summary: {
    pageViews: number;
    uniqueUsers: number;
    totalSessions: number;
    avgSessionDuration: number;
    bounceRate: number;
  };
  devices: Record<string, number>;
  browsers: Record<string, number>;
  topPages: Record<string, number>;
}

interface ConversionMetrics {
  totalConversions: number;
  conversionsByType: Record<string, number>;
  funnelSteps: Record<string, number>;
  conversionRate: number;
}

interface ExperimentMetrics {
  activeTests: number;
  testMetrics: Record<string, any>;
}

export default function RealTimeAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsMetrics | null>(null);
  const [conversions, setConversions] = useState<ConversionMetrics | null>(null);
  const [experiments, setExperiments] = useState<ExperimentMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [analyticsRes, conversionsRes, experimentsRes] = await Promise.all([
        fetch(`/api/analytics?type=metrics&range=${dateRange}`),
        fetch(`/api/analytics?type=conversions&range=${dateRange}`),
        fetch(`/api/analytics?type=experiments&range=${dateRange}`)
      ]);

      const [analyticsData, conversionsData, experimentsData] = await Promise.all([
        analyticsRes.json(),
        conversionsRes.json(),
        experimentsRes.json()
      ]);

      setAnalytics(analyticsData);
      setConversions(conversionsData);
      setExperiments(experimentsData);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
    setLoading(false);
  };

  const deviceColors = ['#3B82F6', '#10B981', '#F59E0B'];

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading && !analytics) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="w-8 h-8 text-blue-500" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Real-Time Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Live insights into your platform performance and user behavior
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="1h">Last hour</option>
              <option value="1d">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </select>
            
            <button
              onClick={fetchAnalytics}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Page Views</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.summary.pageViews.toLocaleString()}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-blue-500" />
              </div>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Unique Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.summary.uniqueUsers.toLocaleString()}
                  </p>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Avg Session</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatDuration(analytics.summary.avgSessionDuration)}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </motion.div>

            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Bounce Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {(analytics.summary.bounceRate * 100).toFixed(1)}%
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </motion.div>

            {conversions && (
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Conversions</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {conversions.totalConversions}
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-pink-500" />
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Device Breakdown */}
          {analytics && Object.keys(analytics.devices).length > 0 && (
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Device Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(analytics.devices).map(([device, count]) => ({
                      name: device,
                      value: count
                    }))}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {Object.keys(analytics.devices).map((device, index) => (
                      <Cell key={device} fill={deviceColors[index % deviceColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* Browser Usage */}
          {analytics && Object.keys(analytics.browsers).length > 0 && (
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Browser Usage
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={Object.entries(analytics.browsers).map(([browser, count]) => ({
                    browser,
                    count
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="browser" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </div>

        {/* Top Pages */}
        {analytics && Object.keys(analytics.topPages).length > 0 && (
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Top Pages
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={Object.entries(analytics.topPages).map(([page, views]) => ({
                  page: page.length > 20 ? page.substring(0, 20) + '...' : page,
                  views
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="page" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="views" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Conversion Funnel */}
        {conversions && Object.keys(conversions.funnelSteps).length > 0 && (
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Conversion Funnel
            </h3>
            <div className="mb-4">
              <span className="text-2xl font-bold text-green-600">
                {conversions.conversionRate.toFixed(2)}%
              </span>
              <span className="text-gray-600 dark:text-gray-400 ml-2">
                Overall Conversion Rate
              </span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={Object.entries(conversions.funnelSteps).map(([step, count]) => ({
                  step: step.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                  count
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="step" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* A/B Tests */}
        {experiments && experiments.activeTests > 0 && (
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                A/B Test Results
              </h3>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Zap className="w-4 h-4 mr-1" />
                {experiments.activeTests} active tests
              </div>
            </div>
            
            <div className="space-y-4">
              {Object.entries(experiments.testMetrics).map(([testId, metrics]: [string, any]) => (
                <div key={testId} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Test: {testId}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Assignments</p>
                      {Object.entries(metrics.assignments || {}).map(([variant, count]: [string, any]) => (
                        <div key={variant} className="flex justify-between text-sm">
                          <span className="text-gray-700 dark:text-gray-300">{variant}:</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Events</p>
                      {Object.entries(metrics.events || {}).map(([variant, events]: [string, any]) => (
                        <div key={variant} className="text-sm">
                          <span className="text-gray-700 dark:text-gray-300">{variant}: </span>
                          <span className="font-medium">
                            {Object.values(events).reduce((a: any, b: any) => a + b, 0)} events
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Real-time status indicator */}
        <div className="fixed bottom-4 right-4">
          <motion.div
            className="bg-green-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          >
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <span className="text-sm font-medium">Live</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}