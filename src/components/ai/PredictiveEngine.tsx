/**
 * Predictive Analytics Engine - Advanced AI Feature
 * AI-powered forecasting and trend prediction for marketing campaigns
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Brain,
  Calendar,
  DollarSign,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  LineChart,
  PieChart,
  Zap,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Prediction {
  id: string;
  type: 'performance' | 'budget' | 'timing' | 'audience';
  title: string;
  description: string;
  confidence: number;
  timeframe: string;
  impact: 'high' | 'medium' | 'low';
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  factors: string[];
}

interface BudgetForecast {
  period: string;
  recommended: number;
  conservative: number;
  aggressive: number;
  confidence: number;
  reasoning: string[];
}

interface TimingRecommendation {
  content: string;
  platform: string;
  optimalTime: string;
  dayOfWeek: string;
  expectedEngagement: number;
  confidence: number;
  reasoning: string;
}

interface TrendAnalysis {
  metric: string;
  currentValue: number;
  predictedValue: number;
  changePercent: number;
  trendDirection: 'up' | 'down' | 'stable';
  significance: 'high' | 'medium' | 'low';
  dataPoints: { date: string; value: number }[];
}

const PredictiveEngine: React.FC = () => {
  const [activeTab, setActiveTab] = useState('predictions');
  const [predictions, setPredictions] = useState<Prediction[]>([
    {
      id: '1',
      type: 'performance',
      title: 'Campaign Performance Surge Expected',
      description: 'Social media engagement likely to increase significantly during upcoming holiday period',
      confidence: 92,
      timeframe: 'Next 14 days',
      impact: 'high',
      value: 28.5,
      unit: '% increase',
      trend: 'up',
      factors: ['Holiday shopping season', 'Historical performance patterns', 'Competitor analysis'],
    },
    {
      id: '2',
      type: 'budget',
      title: 'Budget Optimization Opportunity',
      description: 'Reallocating budget from Display to Search can improve ROI',
      confidence: 87,
      timeframe: 'Immediate',
      impact: 'medium',
      value: 15.2,
      unit: '% ROI improvement',
      trend: 'up',
      factors: ['Search volume trends', 'Cost per conversion analysis', 'Competition levels'],
    },
    {
      id: '3',
      type: 'timing',
      title: 'Optimal Launch Window Identified',
      description: 'Tuesday 2-4 PM shows highest conversion probability for your audience',
      confidence: 94,
      timeframe: 'This week',
      impact: 'medium',
      value: 22.1,
      unit: '% higher conversions',
      trend: 'up',
      factors: ['User activity patterns', 'Historical conversion data', 'Industry benchmarks'],
    },
    {
      id: '4',
      type: 'audience',
      title: 'Emerging Audience Segment',
      description: 'New high-value customer segment detected in analytics data',
      confidence: 78,
      timeframe: 'Next 30 days',
      impact: 'high',
      value: 35.7,
      unit: '% higher LTV',
      trend: 'up',
      factors: ['Behavioral clustering', 'Purchase history analysis', 'Demographic shifts'],
    },
  ]);

  const [budgetForecasts, setBudgetForecasts] = useState<BudgetForecast[]>([
    {
      period: 'Next Month',
      recommended: 15000,
      conservative: 12000,
      aggressive: 20000,
      confidence: 89,
      reasoning: [
        'Seasonal trends indicate 18% increase in demand',
        'Competition levels expected to rise by 12%',
        'Historical ROI suggests budget efficiency at this level'
      ],
    },
    {
      period: 'Next Quarter',
      recommended: 42000,
      conservative: 35000,
      aggressive: 55000,
      confidence: 85,
      reasoning: [
        'Market expansion opportunities identified',
        'Product launch campaign requirements',
        'Competitive positioning needs'
      ],
    },
  ]);

  const [timingRecommendations, setTimingRecommendations] = useState<TimingRecommendation[]>([
    {
      content: 'Product announcements',
      platform: 'LinkedIn',
      optimalTime: '9:00 AM - 11:00 AM',
      dayOfWeek: 'Tuesday',
      expectedEngagement: 23.5,
      confidence: 91,
      reasoning: 'Professional audience most active during mid-week mornings',
    },
    {
      content: 'Brand storytelling',
      platform: 'Instagram',
      optimalTime: '6:00 PM - 8:00 PM',
      dayOfWeek: 'Thursday',
      expectedEngagement: 31.2,
      confidence: 88,
      reasoning: 'Visual content performs best during evening leisure hours',
    },
    {
      content: 'Educational content',
      platform: 'Twitter',
      optimalTime: '12:00 PM - 2:00 PM',
      dayOfWeek: 'Wednesday',
      expectedEngagement: 18.7,
      confidence: 85,
      reasoning: 'Information-seeking behavior peaks during lunch hours',
    },
  ]);

  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis[]>([
    {
      metric: 'Click-through Rate',
      currentValue: 2.3,
      predictedValue: 2.8,
      changePercent: 21.7,
      trendDirection: 'up',
      significance: 'high',
      dataPoints: [
        { date: '2025-09-01', value: 2.1 },
        { date: '2025-09-15', value: 2.3 },
        { date: '2025-10-01', value: 2.5 },
        { date: '2025-10-15', value: 2.8 },
      ],
    },
    {
      metric: 'Cost per Acquisition',
      currentValue: 45.20,
      predictedValue: 38.90,
      changePercent: -13.9,
      trendDirection: 'down',
      significance: 'high',
      dataPoints: [
        { date: '2025-09-01', value: 48.50 },
        { date: '2025-09-15', value: 45.20 },
        { date: '2025-10-01', value: 42.10 },
        { date: '2025-10-15', value: 38.90 },
      ],
    },
    {
      metric: 'Return on Ad Spend',
      currentValue: 3.2,
      predictedValue: 4.1,
      changePercent: 28.1,
      trendDirection: 'up',
      significance: 'high',
      dataPoints: [
        { date: '2025-09-01', value: 2.9 },
        { date: '2025-09-15', value: 3.2 },
        { date: '2025-10-01', value: 3.7 },
        { date: '2025-10-15', value: 4.1 },
      ],
    },
  ]);

  const getPredictionIcon = (type: string) => {
    switch (type) {
      case 'performance':
        return <TrendingUp className="w-5 h-5" />;
      case 'budget':
        return <DollarSign className="w-5 h-5" />;
      case 'timing':
        return <Clock className="w-5 h-5" />;
      case 'audience':
        return <Target className="w-5 h-5" />;
      default:
        return <Brain className="w-5 h-5" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 75) return 'text-blue-600';
    if (confidence >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default:
        return <TrendingUp className="w-4 h-4 text-gray-500 rotate-90" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle>Predictive Analytics Engine</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI-powered forecasting and trend prediction
                </p>
              </div>
            </div>
            <Badge variant="default" className="bg-purple-100 text-purple-800">
              <Zap className="w-4 h-4 mr-1" />
              Active
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="budget">Budget Forecast</TabsTrigger>
          <TabsTrigger value="timing">Timing</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid gap-6">
            {predictions.map((prediction) => (
              <motion.div
                key={prediction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group"
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg ${
                        prediction.impact === 'high' ? 'bg-red-100 dark:bg-red-900' :
                        prediction.impact === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900' :
                        'bg-green-100 dark:bg-green-900'
                      }`}>
                        {getPredictionIcon(prediction.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg">{prediction.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {prediction.description}
                            </p>
                          </div>
                          <Badge variant={prediction.impact === 'high' ? 'destructive' : 
                                       prediction.impact === 'medium' ? 'default' : 'secondary'}>
                            {prediction.impact} impact
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-6 mb-3">
                          <div className="flex items-center space-x-2">
                            {getTrendIcon(prediction.trend)}
                            <span className="font-medium text-lg">
                              {prediction.value}{prediction.unit}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4 text-gray-500" />
                            <span className={`font-medium ${getConfidenceColor(prediction.confidence)}`}>
                              {prediction.confidence}% confidence
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {prediction.timeframe}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Key Factors:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {prediction.factors.map((factor, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {factor}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="budget" className="space-y-6">
          {budgetForecasts.map((forecast, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Budget Forecast - {forecast.period}</span>
                  <Badge variant="outline">{forecast.confidence}% confidence</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Conservative</div>
                    <div className="text-2xl font-bold text-blue-600">
                      ${forecast.conservative.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Recommended</div>
                    <div className="text-2xl font-bold text-green-600">
                      ${forecast.recommended.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Aggressive</div>
                    <div className="text-2xl font-bold text-orange-600">
                      ${forecast.aggressive.toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Reasoning:</h4>
                  <ul className="space-y-2">
                    {forecast.reasoning.map((reason, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="timing" className="space-y-6">
          <div className="grid gap-4">
            {timingRecommendations.map((rec, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{rec.content}</h3>
                      <Badge variant="outline" className="mt-1">{rec.platform}</Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        +{rec.expectedEngagement}%
                      </div>
                      <div className="text-sm text-gray-600">expected engagement</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Optimal Time</div>
                      <div className="font-medium">{rec.optimalTime}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Best Day</div>
                      <div className="font-medium">{rec.dayOfWeek}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex-1">
                      {rec.reasoning}
                    </p>
                    <Badge variant="default" className="ml-4">
                      {rec.confidence}% confident
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid gap-6">
            {trendAnalysis.map((trend, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">{trend.metric}</h3>
                    <Badge variant={trend.significance === 'high' ? 'destructive' : 
                                 trend.significance === 'medium' ? 'default' : 'secondary'}>
                      {trend.significance} significance
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Current</div>
                      <div className="text-xl font-bold">
                        {typeof trend.currentValue === 'number' && trend.currentValue < 10 
                          ? trend.currentValue.toFixed(1) 
                          : Math.round(trend.currentValue)}
                        {trend.metric === 'Cost per Acquisition' ? '$' : ''}
                        {trend.metric === 'Click-through Rate' ? '%' : ''}
                        {trend.metric === 'Return on Ad Spend' ? 'x' : ''}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Predicted</div>
                      <div className="text-xl font-bold text-blue-600">
                        {typeof trend.predictedValue === 'number' && trend.predictedValue < 10 
                          ? trend.predictedValue.toFixed(1) 
                          : Math.round(trend.predictedValue)}
                        {trend.metric === 'Cost per Acquisition' ? '$' : ''}
                        {trend.metric === 'Click-through Rate' ? '%' : ''}
                        {trend.metric === 'Return on Ad Spend' ? 'x' : ''}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Change</div>
                      <div className={`text-xl font-bold flex items-center justify-center space-x-1 ${
                        trend.trendDirection === 'up' ? 'text-green-600' : 
                        trend.trendDirection === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {getTrendIcon(trend.trendDirection)}
                        <span>{Math.abs(trend.changePercent).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        trend.trendDirection === 'up' ? 'bg-green-500' : 
                        trend.trendDirection === 'down' ? 'bg-red-500' : 'bg-gray-500'
                      }`}
                      style={{ width: `${Math.min(Math.abs(trend.changePercent), 100)}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PredictiveEngine;