/**
 * Autonomous Campaign Optimizer - Advanced AI Feature
 * Automatically optimizes campaigns based on performance data and machine learning
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  TrendingUp,
  DollarSign,
  Target,
  Zap,
  Settings,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart3,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface OptimizationRule {
  id: string;
  name: string;
  description: string;
  condition: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  enabled: boolean;
  lastTriggered?: Date;
  successRate: number;
}

interface PerformanceThreshold {
  metric: string;
  operator: 'gt' | 'lt' | 'eq';
  value: number;
  timeframe: string;
}

interface CampaignOptimization {
  campaignId: string;
  optimizationType: 'budget' | 'targeting' | 'creative' | 'bidding';
  change: string;
  impact: number;
  confidence: number;
  appliedAt: Date;
  status: 'pending' | 'applied' | 'reverted';
}

interface AutonomousOptimizerProps {
  campaignId?: string;
  mode: 'single' | 'portfolio';
}

const AutonomousOptimizer: React.FC<AutonomousOptimizerProps> = ({
  campaignId,
  mode = 'portfolio'
}) => {
  const [isAutonomousMode, setIsAutonomousMode] = useState(false);
  const [optimizationRules, setOptimizationRules] = useState<OptimizationRule[]>([
    {
      id: '1',
      name: 'Budget Reallocation',
      description: 'Automatically move budget from underperforming campaigns to high-performers',
      condition: 'ROI < 2.0 for 48 hours',
      action: 'Reduce budget by 20%, increase top performer budget',
      priority: 'high',
      enabled: true,
      successRate: 87,
    },
    {
      id: '2',
      name: 'Bid Optimization',
      description: 'Adjust bids based on conversion probability and competition',
      condition: 'CPC > target by 25% or conversion rate drops',
      action: 'Optimize bid strategy and adjust targeting',
      priority: 'high',
      enabled: true,
      successRate: 92,
    },
    {
      id: '3',
      name: 'Creative Rotation',
      description: 'Automatically test and rotate ad creatives based on performance',
      condition: 'CTR decline > 15% over 3 days',
      action: 'Rotate to backup creative or generate new variant',
      priority: 'medium',
      enabled: false,
      successRate: 78,
    },
    {
      id: '4',
      name: 'Audience Expansion',
      description: 'Gradually expand successful audience segments',
      condition: 'Audience saturation > 80% and performance stable',
      action: 'Expand lookalike audiences by 10%',
      priority: 'medium',
      enabled: true,
      successRate: 83,
    },
  ]);

  const [recentOptimizations, setRecentOptimizations] = useState<CampaignOptimization[]>([
    {
      campaignId: 'camp_001',
      optimizationType: 'budget',
      change: 'Increased budget by $200/day based on 3.2x ROI',
      impact: 15.2,
      confidence: 94,
      appliedAt: new Date(Date.now() - 3600000),
      status: 'applied',
    },
    {
      campaignId: 'camp_002',
      optimizationType: 'targeting',
      change: 'Refined audience targeting to focus on high-intent segments',
      impact: 8.7,
      confidence: 89,
      appliedAt: new Date(Date.now() - 7200000),
      status: 'applied',
    },
    {
      campaignId: 'camp_003',
      optimizationType: 'bidding',
      change: 'Switched to value-based bidding strategy',
      impact: 22.1,
      confidence: 96,
      appliedAt: new Date(Date.now() - 10800000),
      status: 'pending',
    },
  ]);

  const [autonomousStats, setAutonomousStats] = useState({
    optimizationsToday: 12,
    performanceImprovement: 18.5,
    budgetSaved: 2450,
    confidenceScore: 94,
    activeRules: optimizationRules.filter(rule => rule.enabled).length,
  });

  const toggleAutonomousMode = useCallback(() => {
    setIsAutonomousMode(prev => !prev);
    // In real implementation, this would enable/disable the AI optimization engine
  }, []);

  const toggleRule = useCallback((ruleId: string) => {
    setOptimizationRules(prev => 
      prev.map(rule => 
        rule.id === ruleId 
          ? { ...rule, enabled: !rule.enabled }
          : rule
      )
    );
  }, []);

  const applyOptimization = useCallback((optimization: CampaignOptimization) => {
    setRecentOptimizations(prev =>
      prev.map(opt =>
        opt === optimization
          ? { ...opt, status: 'applied' as const }
          : opt
      )
    );
  }, []);

  const revertOptimization = useCallback((optimization: CampaignOptimization) => {
    setRecentOptimizations(prev =>
      prev.map(opt =>
        opt === optimization
          ? { ...opt, status: 'reverted' as const }
          : opt
      )
    );
  }, []);

  return (
    <div className="space-y-6">
      {/* Autonomous Mode Control */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle>Autonomous Optimization</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI-powered campaign optimization running 24/7
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant={isAutonomousMode ? "default" : "secondary"}>
                {isAutonomousMode ? 'Active' : 'Manual'}
              </Badge>
              <Switch
                checked={isAutonomousMode}
                onCheckedChange={toggleAutonomousMode}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {autonomousStats.optimizationsToday}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Optimizations Today
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                +{autonomousStats.performanceImprovement}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Performance Lift
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                ${autonomousStats.budgetSaved.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Budget Saved
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {autonomousStats.confidenceScore}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Confidence Score
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Optimization Rules</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {optimizationRules.map((rule) => (
              <motion.div
                key={rule.id}
                layout
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-medium">{rule.name}</h4>
                      <Badge variant={rule.priority === 'high' ? 'destructive' : 
                                   rule.priority === 'medium' ? 'default' : 'secondary'}>
                        {rule.priority}
                      </Badge>
                      <div className="flex items-center space-x-1 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>{rule.successRate}% success</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {rule.description}
                    </p>
                    <div className="text-xs text-gray-500 mt-2">
                      <strong>Condition:</strong> {rule.condition}
                    </div>
                    <div className="text-xs text-gray-500">
                      <strong>Action:</strong> {rule.action}
                    </div>
                  </div>
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={() => toggleRule(rule.id)}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Optimizations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Recent Optimizations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOptimizations.map((optimization, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Badge variant="outline">{optimization.optimizationType}</Badge>
                      <Badge 
                        variant={optimization.status === 'applied' ? 'default' : 
                                optimization.status === 'pending' ? 'secondary' : 'destructive'}
                      >
                        {optimization.status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {optimization.appliedAt.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{optimization.change}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span>+{optimization.impact}% impact</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Target className="w-4 h-4 text-blue-500" />
                        <span>{optimization.confidence}% confidence</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {optimization.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => applyOptimization(optimization)}
                      >
                        Apply
                      </Button>
                    )}
                    {optimization.status === 'applied' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => revertOptimization(optimization)}
                      >
                        Revert
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <span>Optimization Impact</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Performance Improvement</span>
                <span className="font-medium">+{autonomousStats.performanceImprovement}%</span>
              </div>
              <Progress value={autonomousStats.performanceImprovement} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">
                  ${autonomousStats.budgetSaved.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Budget Optimized
                </div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">
                  {autonomousStats.activeRules}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Active Rules
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutonomousOptimizer;