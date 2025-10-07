'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, TrendingUp, Clock, Target, Zap, AlertCircle, 
  ChevronRight, Lightbulb, BarChart3, Users, DollarSign,
  Calendar, MessageSquare, Settings2
} from 'lucide-react';

// Intelligent Widget System - AI-powered dashboard components
interface SmartWidget {
  id: string;
  type: 'insight' | 'metric' | 'suggestion' | 'alert' | 'quick-action';
  title: string;
  content: React.ReactNode;
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  lastUpdated: Date;
  interacted: boolean;
  learningData?: any;
}

interface BusinessContext {
  currentFocus: 'marketing' | 'operations' | 'growth' | 'optimization';
  timeOfDay: 'morning' | 'working' | 'evening';
  recentActivity: string[];
  urgentItems: number;
  teamActivity: 'high' | 'medium' | 'low';
}

interface ProactiveInsight {
  type: 'opportunity' | 'efficiency' | 'warning' | 'trend';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  suggestedAction: string;
  automationAvailable: boolean;
  confidence: number;
}

export default function IntelligentDashboardCore() {
  const [businessContext, setBusinessContext] = useState<BusinessContext>({
    currentFocus: 'marketing',
    timeOfDay: 'working',
    recentActivity: ['Checked social media analytics', 'Reviewed email campaign', 'Updated project status'],
    urgentItems: 3,
    teamActivity: 'high'
  });

  const [proactiveInsights, setProactiveInsights] = useState<ProactiveInsight[]>([
    {
      type: 'opportunity',
      title: 'Marketing Campaign Optimization Detected',
      description: 'Your social media engagement is 35% higher on Tuesdays. Consider scheduling major campaigns then.',
      impact: 'high',
      effort: 'low',
      suggestedAction: 'Auto-schedule high-priority content for Tuesdays',
      automationAvailable: true,
      confidence: 0.87
    },
    {
      type: 'efficiency',
      title: 'Team Workflow Bottleneck Identified',
      description: 'Project approvals taking 2.3x longer than industry average. Automation could save 8 hours/week.',
      impact: 'medium',
      effort: 'medium',
      suggestedAction: 'Implement automated approval workflows for routine tasks',
      automationAvailable: true,
      confidence: 0.92
    },
    {
      type: 'trend',
      title: 'Competitor Activity Spike',
      description: 'Your top 3 competitors increased social posting by 40% this week. Consider response strategy.',
      impact: 'medium',
      effort: 'low',
      suggestedAction: 'Review competitor content and adjust posting frequency',
      automationAvailable: false,
      confidence: 0.78
    }
  ]);

  const [smartWidgets, setSmartWidgets] = useState<SmartWidget[]>([]);

  // Generate contextual widgets based on current business context
  useEffect(() => {
    const generateContextualWidgets = () => {
      const currentHour = new Date().getHours();
      const timeOfDay = currentHour < 10 ? 'morning' : currentHour > 17 ? 'evening' : 'working';
      
      let widgets: SmartWidget[] = [];

      // Morning widgets - focus on overnight performance and day planning
      if (timeOfDay === 'morning') {
        widgets.push({
          id: 'overnight-performance',
          type: 'insight',
          title: 'Overnight Performance Summary',
          content: (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Email Campaign</span>
                <span className="text-sm font-medium text-green-600">+12% open rate</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Social Media</span>
                <span className="text-sm font-medium text-blue-600">+23% engagement</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Lead Generation</span>
                <span className="text-sm font-medium text-purple-600">8 new leads</span>
              </div>
            </div>
          ),
          priority: 'high',
          confidence: 0.95,
          lastUpdated: new Date(),
          interacted: false
        });

        widgets.push({
          id: 'daily-priorities',
          type: 'suggestion',
          title: 'AI-Suggested Daily Priorities',
          content: (
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-sm">Review Tuesday social media performance</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm">Optimize high-performing email template</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded">
                <Users className="w-4 h-4 text-purple-600" />
                <span className="text-sm">Schedule team sync for project milestone</span>
              </div>
            </div>
          ),
          priority: 'high',
          confidence: 0.89,
          lastUpdated: new Date(),
          interacted: false
        });
      }

      // Working hours widgets - focus on productivity and current tasks
      if (timeOfDay === 'working') {
        widgets.push({
          id: 'focus-optimization',
          type: 'insight',
          title: 'Current Focus Optimization',
          content: (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Marketing Campaign Focus</span>
                <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">Active</span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Based on your recent activity, you're in marketing optimization mode. 
                Social media and email platforms are prioritized in your interface.
              </div>
              <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                Switch to Operations Focus →
              </button>
            </div>
          ),
          priority: 'medium',
          confidence: 0.82,
          lastUpdated: new Date(),
          interacted: false
        });

        widgets.push({
          id: 'quick-wins',
          type: 'quick-action',
          title: 'Quick Wins Available',
          content: (
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-2 text-left bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded transition-colors">
                <span className="text-sm">Duplicate successful social post</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button className="w-full flex items-center justify-between p-2 text-left bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors">
                <span className="text-sm">Send follow-up to warm leads</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button className="w-full flex items-center justify-between p-2 text-left bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors">
                <span className="text-sm">Schedule content for peak hours</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ),
          priority: 'medium',
          confidence: 0.91,
          lastUpdated: new Date(),
          interacted: false
        });
      }

      // Evening widgets - focus on performance review and tomorrow's planning
      if (timeOfDay === 'evening') {
        widgets.push({
          id: 'daily-performance',
          type: 'metric',
          title: 'Today\'s Performance Summary',
          content: (
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">+18%</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Revenue Growth</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">2.4x</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Engagement Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">12</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">New Leads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">94%</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Goal Progress</div>
              </div>
            </div>
          ),
          priority: 'high',
          confidence: 0.97,
          lastUpdated: new Date(),
          interacted: false
        });
      }

      // Always include urgent alerts if any
      if (businessContext.urgentItems > 0) {
        widgets.unshift({
          id: 'urgent-alerts',
          type: 'alert',
          title: `${businessContext.urgentItems} Urgent Items`,
          content: (
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm">Campaign budget 90% depleted</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="text-sm">Project deadline in 2 days</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                <MessageSquare className="w-4 h-4 text-yellow-600" />
                <span className="text-sm">Client response needed</span>
              </div>
            </div>
          ),
          priority: 'high',
          confidence: 1.0,
          lastUpdated: new Date(),
          interacted: false
        });
      }

      setSmartWidgets(widgets);
      setBusinessContext(prev => ({ ...prev, timeOfDay }));
    };

    generateContextualWidgets();
    
    // Update context every 30 seconds (in production, this would be more sophisticated)
    const interval = setInterval(generateContextualWidgets, 30000);
    return () => clearInterval(interval);
  }, [businessContext.urgentItems]);

  const getInsightIcon = (type: ProactiveInsight['type']) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'efficiency': return <Zap className="w-5 h-5 text-blue-600" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'trend': return <BarChart3 className="w-5 h-5 text-purple-600" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-orange-600 dark:text-orange-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Intelligence Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800"
      >
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Business Intelligence Engine
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              AI-powered insights • Learning from your patterns • Context: {businessContext.currentFocus}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-600 dark:text-gray-400">AI Active</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">Last Learning: 2 minutes ago</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">{proactiveInsights.length} insights available</span>
          </div>
        </div>
      </motion.div>

      {/* Smart Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {smartWidgets.map((widget, index) => (
            <motion.div
              key={widget.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border-l-4 ${
                widget.priority === 'high' ? 'border-red-500' :
                widget.priority === 'medium' ? 'border-yellow-500' : 'border-green-500'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  {widget.title}
                </h3>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${
                    widget.confidence > 0.9 ? 'bg-green-500' :
                    widget.confidence > 0.7 ? 'bg-yellow-500' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-xs text-gray-500">
                    {Math.round(widget.confidence * 100)}%
                  </span>
                </div>
              </div>
              {widget.content}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Proactive Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Proactive Business Insights
          </h2>
        </div>

        <div className="space-y-4">
          {proactiveInsights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                {getInsightIcon(insight.type)}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {insight.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`font-medium ${getImpactColor(insight.impact)}`}>
                        {insight.impact.toUpperCase()} IMPACT
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-500">
                        {Math.round(insight.confidence * 100)}% confidence
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {insight.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button className="px-3 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors">
                        {insight.suggestedAction}
                      </button>
                      {insight.automationAvailable && (
                        <button className="px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors">
                          <Zap className="w-3 h-3 inline mr-1" />
                          Automate
                        </button>
                      )}
                    </div>
                    <button className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                      Learn More →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}