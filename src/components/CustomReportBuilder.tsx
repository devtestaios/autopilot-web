'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Minus,
  Settings,
  Calendar,
  Download,
  Save,
  Share2,
  FileText,
  BarChart3,
  LineChart,
  PieChart,
  Target,
  Filter,
  Clock,
  Mail,
  Users,
  DollarSign,
  TrendingUp,
  Eye,
  MousePointer,
  ShoppingCart,
  Zap,
  Layers,
  Grid3X3,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface ReportMetric {
  id: string;
  name: string;
  description: string;
  category: 'financial' | 'performance' | 'engagement' | 'conversion';
  icon: React.ElementType;
  format: 'currency' | 'percentage' | 'number' | 'decimal';
  color: string;
}

interface VisualizationType {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  suitable_for: string[];
  complexity: 'simple' | 'medium' | 'advanced';
}

interface ReportSchedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  time: string;
  timezone: string;
  recipients: string[];
  format: 'pdf' | 'excel' | 'csv';
}

interface CustomReportConfig {
  id: string;
  name: string;
  description: string;
  metrics: string[];
  visualizations: string[];
  dateRange: {
    type: 'last_7_days' | 'last_30_days' | 'last_quarter' | 'custom';
    start?: Date;
    end?: Date;
  };
  filters: {
    campaigns: string[];
    platforms: string[];
    devices: string[];
    locations: string[];
  };
  schedule?: ReportSchedule;
  sharing: {
    public: boolean;
    allowedUsers: string[];
    embedEnabled: boolean;
  };
}

export default function CustomReportBuilder() {
  const [currentStep, setCurrentStep] = useState(1);
  const [reportConfig, setReportConfig] = useState<CustomReportConfig>({
    id: '',
    name: '',
    description: '',
    metrics: [],
    visualizations: [],
    dateRange: { type: 'last_30_days' },
    filters: {
      campaigns: [],
      platforms: [],
      devices: [],
      locations: []
    },
    sharing: {
      public: false,
      allowedUsers: [],
      embedEnabled: false
    }
  });

  // Available Metrics
  const availableMetrics: ReportMetric[] = [
    {
      id: 'revenue',
      name: 'Revenue',
      description: 'Total revenue generated',
      category: 'financial',
      icon: DollarSign,
      format: 'currency',
      color: 'text-green-600'
    },
    {
      id: 'spend',
      name: 'Ad Spend',
      description: 'Total advertising spend',
      category: 'financial',
      icon: TrendingUp,
      format: 'currency',
      color: 'text-red-600'
    },
    {
      id: 'roas',
      name: 'ROAS',
      description: 'Return on advertising spend',
      category: 'financial',
      icon: Target,
      format: 'decimal',
      color: 'text-blue-600'
    },
    {
      id: 'impressions',
      name: 'Impressions',
      description: 'Total ad impressions',
      category: 'performance',
      icon: Eye,
      format: 'number',
      color: 'text-purple-600'
    },
    {
      id: 'clicks',
      name: 'Clicks',
      description: 'Total clicks on ads',
      category: 'performance',
      icon: MousePointer,
      format: 'number',
      color: 'text-orange-600'
    },
    {
      id: 'ctr',
      name: 'Click-Through Rate',
      description: 'Percentage of impressions that resulted in clicks',
      category: 'performance',
      icon: Zap,
      format: 'percentage',
      color: 'text-yellow-600'
    },
    {
      id: 'conversions',
      name: 'Conversions',
      description: 'Total number of conversions',
      category: 'conversion',
      icon: ShoppingCart,
      format: 'number',
      color: 'text-indigo-600'
    },
    {
      id: 'cpa',
      name: 'Cost Per Acquisition',
      description: 'Average cost to acquire a customer',
      category: 'conversion',
      icon: Users,
      format: 'currency',
      color: 'text-pink-600'
    }
  ];

  // Available Visualizations
  const availableVisualizations: VisualizationType[] = [
    {
      id: 'line_chart',
      name: 'Line Chart',
      description: 'Show trends over time',
      icon: LineChart,
      suitable_for: ['revenue', 'spend', 'impressions', 'clicks'],
      complexity: 'simple'
    },
    {
      id: 'bar_chart',
      name: 'Bar Chart',
      description: 'Compare values across categories',
      icon: BarChart3,
      suitable_for: ['revenue', 'spend', 'conversions', 'cpa'],
      complexity: 'simple'
    },
    {
      id: 'pie_chart',
      name: 'Pie Chart',
      description: 'Show proportional distribution',
      icon: PieChart,
      suitable_for: ['spend', 'conversions', 'impressions'],
      complexity: 'simple'
    },
    {
      id: 'heatmap',
      name: 'Heatmap',
      description: 'Visualize data intensity across dimensions',
      icon: Grid3X3,
      suitable_for: ['ctr', 'roas', 'cpa'],
      complexity: 'advanced'
    },
    {
      id: 'funnel_chart',
      name: 'Funnel Chart',
      description: 'Show conversion flow',
      icon: Layers,
      suitable_for: ['impressions', 'clicks', 'conversions'],
      complexity: 'medium'
    }
  ];

  const totalSteps = 5;

  const toggleMetric = (metricId: string) => {
    setReportConfig(prev => ({
      ...prev,
      metrics: prev.metrics.includes(metricId)
        ? prev.metrics.filter(id => id !== metricId)
        : [...prev.metrics, metricId]
    }));
  };

  const toggleVisualization = (vizId: string) => {
    setReportConfig(prev => ({
      ...prev,
      visualizations: prev.visualizations.includes(vizId)
        ? prev.visualizations.filter(id => id !== vizId)
        : [...prev.visualizations, vizId]
    }));
  };

  const generateReport = () => {
    const newReportConfig = {
      ...reportConfig,
      id: `report_${Date.now()}`,
      name: reportConfig.name || `Custom Report ${Date.now()}`
    };
    
    console.log('Generating report:', newReportConfig);
    // Implementation would save the report and generate it
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return 'Report Details';
      case 2: return 'Select Metrics';
      case 3: return 'Choose Visualizations';
      case 4: return 'Configure Filters';
      case 5: return 'Schedule & Share';
      default: return 'Report Builder';
    }
  };

  const getStepDescription = (step: number) => {
    switch (step) {
      case 1: return 'Set up basic report information';
      case 2: return 'Choose which metrics to include in your report';
      case 3: return 'Select how you want to visualize your data';
      case 4: return 'Apply filters to focus on specific data';
      case 5: return 'Set up automated delivery and sharing options';
      default: return 'Build your custom analytics report';
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1: return reportConfig.name.length > 0;
      case 2: return reportConfig.metrics.length > 0;
      case 3: return reportConfig.visualizations.length > 0;
      case 4: return true; // Filters are optional
      case 5: return true; // Scheduling is optional
      default: return false;
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Custom Report Builder
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create personalized analytics reports with custom metrics and visualizations
          </p>
        </div>
        <Button onClick={generateReport} disabled={!isStepValid(currentStep)}>
          <Save className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {getStepTitle(currentStep)}
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {getStepDescription(currentStep)}
          </p>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        </CardContent>
      </Card>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Report Details
                </CardTitle>
                <CardDescription>
                  Provide basic information about your custom report
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Report Name *
                  </label>
                  <input
                    type="text"
                    value={reportConfig.name}
                    onChange={(e) => setReportConfig(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter report name"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={reportConfig.description}
                    onChange={(e) => setReportConfig(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this report will track"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date Range
                  </label>
                  <select
                    value={reportConfig.dateRange.type}
                    onChange={(e) => setReportConfig(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, type: e.target.value as any }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="last_7_days">Last 7 Days</option>
                    <option value="last_30_days">Last 30 Days</option>
                    <option value="last_quarter">Last Quarter</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Select Metrics ({reportConfig.metrics.length} selected)
                </CardTitle>
                <CardDescription>
                  Choose the metrics you want to include in your report
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableMetrics.map((metric) => {
                    const IconComponent = metric.icon;
                    const isSelected = reportConfig.metrics.includes(metric.id);
                    
                    return (
                      <motion.div
                        key={metric.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          className={cn(
                            'cursor-pointer transition-all duration-200',
                          )}
                          onClick={() => toggleMetric(metric.id)}
                        >
                          <Card
                            className={cn(
                              'border-2 h-full',
                              isSelected
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            )}
                          >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className={cn('p-2 rounded-lg bg-gray-100 dark:bg-gray-800')}>
                                <IconComponent className={cn('h-5 w-5', metric.color)} />
                              </div>
                              {isSelected && (
                                <div className="bg-blue-500 text-white rounded-full p-1">
                                  <Plus className="h-3 w-3" />
                                </div>
                              )}
                            </div>
                            <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                              {metric.name}
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                              {metric.description}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {metric.category}
                            </Badge>
                          </CardContent>
                        </Card>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Choose Visualizations ({reportConfig.visualizations.length} selected)
                </CardTitle>
                <CardDescription>
                  Select how you want to visualize your selected metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availableVisualizations.map((viz) => {
                    const IconComponent = viz.icon;
                    const isSelected = reportConfig.visualizations.includes(viz.id);
                    const hasCompatibleMetrics = viz.suitable_for.some(metricId => 
                      reportConfig.metrics.includes(metricId)
                    );
                    
                    return (
                      <motion.div
                        key={viz.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => hasCompatibleMetrics && toggleVisualization(viz.id)}
                        className="cursor-pointer"
                      >
                        <Card
                          className={cn(
                            'transition-all duration-200 border-2',
                            isSelected
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : hasCompatibleMetrics
                              ? 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                              : 'border-gray-100 dark:border-gray-800 opacity-50 cursor-not-allowed'
                          )}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className={cn('p-2 rounded-lg bg-gray-100 dark:bg-gray-800')}>
                                <IconComponent className="h-5 w-5 text-purple-600" />
                              </div>
                              <div className="flex flex-col items-end space-y-1">
                                {isSelected && (
                                  <div className="bg-blue-500 text-white rounded-full p-1">
                                    <Plus className="h-3 w-3" />
                                  </div>
                                )}
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    'text-xs',
                                    viz.complexity === 'simple' && 'border-green-500 text-green-700',
                                    viz.complexity === 'medium' && 'border-yellow-500 text-yellow-700',
                                    viz.complexity === 'advanced' && 'border-red-500 text-red-700'
                                  )}
                                >
                                  {viz.complexity}
                                </Badge>
                              </div>
                            </div>
                            <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                              {viz.name}
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                              {viz.description}
                            </p>
                            {!hasCompatibleMetrics && (
                              <p className="text-xs text-red-500 dark:text-red-400">
                                No compatible metrics selected
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Configure Filters
                </CardTitle>
                <CardDescription>
                  Apply filters to focus on specific segments of your data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Platforms
                    </label>
                    <div className="space-y-2">
                      {['Google Ads', 'Meta Ads', 'LinkedIn Ads', 'TikTok Ads'].map((platform) => (
                        <label key={platform} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{platform}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Device Types
                    </label>
                    <div className="space-y-2">
                      {['Desktop', 'Mobile', 'Tablet'].map((device) => (
                        <label key={device} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{device}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 5 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Schedule & Share
                </CardTitle>
                <CardDescription>
                  Set up automated delivery and sharing options for your report
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Automated Delivery
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Frequency
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                        <option value="">No automation</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Format
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                        <option value="pdf">PDF</option>
                        <option value="excel">Excel</option>
                        <option value="csv">CSV</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Sharing Options
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-2">
                      <Switch 
                        checked={false} 
                        onCheckedChange={() => {}}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Make report publicly accessible
                      </span>
                    </label>
                    
                    <label className="flex items-center space-x-2">
                      <Switch 
                        checked={false} 
                        onCheckedChange={() => {}}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Enable embedding in external websites
                      </span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            <div className="flex space-x-2">
              {Array.from({ length: totalSteps }, (_, index) => (
                <div
                  key={index}
                  className={cn(
                    'w-3 h-3 rounded-full transition-colors',
                    index + 1 === currentStep
                      ? 'bg-blue-600'
                      : index + 1 < currentStep
                      ? 'bg-green-600'
                      : 'bg-gray-300 dark:bg-gray-600'
                  )}
                />
              ))}
            </div>
            
            {currentStep < totalSteps ? (
              <Button
                onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
                disabled={!isStepValid(currentStep)}
              >
                Next
              </Button>
            ) : (
              <Button onClick={generateReport} disabled={!isStepValid(currentStep)}>
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}