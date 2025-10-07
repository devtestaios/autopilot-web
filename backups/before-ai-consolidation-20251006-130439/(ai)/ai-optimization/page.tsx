'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Brain,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Cpu,
  Database,
  Globe,
  RefreshCw,
  Settings,
  Play,
  Pause,
  Home,
  ArrowRight,
  Target,
  Lightbulb,
  Rocket,
  Shield
} from 'lucide-react';
import { useAIOptimization } from '@/lib/ai/aiOptimizer';
import { Card, Badge, Progress, Button } from '@/components/ui/EnhancedComponents';
import NavigationTabs from '@/components/NavigationTabs';

export default function AIOptimizationPage() {
  const [autoMode, setAutoMode] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const router = useRouter();

  const {
    insights,
    recommendations,
    autoApplied,
    isAnalyzing,
    lastAnalysis,
    analyzePerformance,
    applyOptimization,
    getOptimizationStatus,
    updateConfig,
    getPerformanceTrends
  } = useAIOptimization();

  const [optimizationStatus, setOptimizationStatus] = useState(getOptimizationStatus());
  const [performanceTrends, setPerformanceTrends] = useState(getPerformanceTrends());

  useEffect(() => {
    // Initial analysis on mount
    if (!lastAnalysis && !isAnalyzing) {
      handleAnalyze();
    }
  }, []);

  useEffect(() => {
    // Update status and trends when analysis completes
    if (!isAnalyzing && lastAnalysis) {
      setOptimizationStatus(getOptimizationStatus());
      setPerformanceTrends(getPerformanceTrends());
    }
  }, [isAnalyzing, lastAnalysis]);

  const handleAnalyze = async () => {
    setIsRunning(true);
    try {
      await analyzePerformance();
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleApplyOptimization = async (recommendation: any) => {
    try {
      await applyOptimization(recommendation);
    } catch (error) {
      console.error('Failed to apply optimization:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'good': return <CheckCircle className="w-5 h-5 text-green-500" />;
      default: return <BarChart3 className="w-5 h-5 text-gray-500" />;
    }
  };

  const criticalIssues = insights.filter(i => i.severity === 'critical').length;
  const warningIssues = insights.filter(i => i.severity === 'warning').length;
  const appliedCount = recommendations.filter(r => r.applied).length;
  const pendingCount = recommendations.filter(r => !r.applied).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationTabs />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/')}
                className="p-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 transition-all shadow-sm"
                title="Back to Home"
              >
                <Home className="w-5 h-5 text-teal-600" />
              </motion.button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Brain className="w-8 h-8 text-blue-500" />
                  AI Performance Optimization
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Intelligent system optimization with autonomous performance improvements
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Auto Mode Toggle */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Auto Mode</span>
                <button
                  onClick={() => {
                    setAutoMode(!autoMode);
                    updateConfig({ autoApplyLowRisk: !autoMode });
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autoMode ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <motion.span
                    layout
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Analyze Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAnalyze}
                disabled={isAnalyzing || isRunning}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                {isAnalyzing || isRunning ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                <span>{isAnalyzing || isRunning ? 'Analyzing...' : 'Run Analysis'}</span>
              </motion.button>
            </div>
          </div>

          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Critical Issues</h3>
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{criticalIssues}</p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">Requires immediate attention</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Warnings</h3>
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{warningIssues}</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">Monitor closely</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Applied</h3>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{appliedCount}</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">Optimizations active</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</h3>
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingCount}</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Awaiting approval</p>
            </motion.div>
          </div>

          {/* Auto-Applied Optimizations */}
          {autoApplied.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 mb-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <Rocket className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Auto-Applied Optimizations
                </h3>
                <Badge variant="success" className="ml-2">
                  {autoApplied.length} applied
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {autoApplied.map((optimization) => (
                  <div
                    key={optimization.id}
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">{optimization.title}</h4>
                      <Badge variant="success">Applied</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {optimization.description}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Impact: {optimization.impact}</span>
                      <span className="text-gray-500">
                        {optimization.appliedAt?.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Performance Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                Performance Insights
              </h3>
              <div className="space-y-4">
                {insights.length > 0 ? (
                  insights.map((insight, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getSeverityIcon(insight.severity)}
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white capitalize">
                            {insight.domain.replace('-', ' ')} - {insight.metric.replace('_', ' ')}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Value: {insight.value} | Threshold: {insight.threshold}
                          </p>
                        </div>
                      </div>
                      <Badge variant={insight.severity === 'critical' ? 'destructive' : insight.severity === 'warning' ? 'warning' : 'success'}>
                        {insight.severity}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">No critical issues detected</p>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-500" />
                Optimization Recommendations
              </h3>
              <div className="space-y-4">
                {recommendations.length > 0 ? (
                  recommendations.slice(0, 3).map((recommendation) => (
                    <div
                      key={recommendation.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {recommendation.title}
                        </h4>
                        <Badge className={getPriorityColor(recommendation.priority)}>
                          {recommendation.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {recommendation.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Impact: {recommendation.impact}</span>
                          <span>Effort: {recommendation.effort}</span>
                        </div>
                        {!recommendation.applied && (
                          <Button
                            size="sm"
                            onClick={() => handleApplyOptimization(recommendation)}
                            disabled={isAnalyzing}
                          >
                            Apply
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Lightbulb className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                    <p className="text-gray-600 dark:text-gray-400">Run analysis to get recommendations</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Performance Trends by Domain */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Domain Performance Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(performanceTrends).map(([domain, metrics]: [string, any]) => (
                <div key={domain} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 capitalize flex items-center gap-2">
                    {domain === 'social-media' && <Globe className="w-4 h-4" />}
                    {domain === 'email-marketing' && <Database className="w-4 h-4" />}
                    {domain === 'collaboration' && <Cpu className="w-4 h-4" />}
                    {domain === 'platform' && <Shield className="w-4 h-4" />}
                    {domain.replace('-', ' ')}
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(metrics).map(([metric, data]: [string, any]) => (
                      <div key={metric} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400 capitalize">
                          {metric.replace('_', ' ')}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="font-medium">{data.value}</span>
                          {getSeverityIcon(data.severity)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/analytics"
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
              >
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Analytics Dashboard</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">View detailed metrics</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </Link>

              <Link
                href="/performance"
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
              >
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Performance Monitor</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Real-time monitoring</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </Link>

              <Link
                href="/settings"
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
              >
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">AI Settings</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Configure optimization</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}