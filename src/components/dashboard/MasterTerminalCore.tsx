'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, BarChart3, Users, DollarSign, TrendingUp, Activity, 
  RefreshCw, Zap, Settings, Grid3X3, List, Calendar,
  ChevronRight, ExternalLink, Play, Pause, AlertCircle
} from 'lucide-react';
import Link from 'next/link';

// Modular component interfaces following dissertation patterns
interface PlatformModule {
  id: string;
  name: string;
  description: string;
  route: string;
  status: 'active' | 'inactive' | 'maintenance';
  color: string;
  icon: React.ComponentType<any>;
  stats?: {
    label: string;
    value: string;
    change?: string;
  }[];
  quickActions?: {
    label: string;
    action: () => void;
    icon: React.ComponentType<any>;
  }[];
}

interface SuiteConfiguration {
  id: string;
  name: string;
  description: string;
  platforms: string[];
  color: string;
  recommended?: boolean;
}

// Platform Registry - Extensible platform management
const platformRegistry: PlatformModule[] = [
  {
    id: 'social-media',
    name: 'Social Media',
    description: 'Multi-platform management with Instagram OAuth',
    route: '/social-media',
    status: 'active',
    color: 'bg-pink-500',
    icon: Target,
    stats: [
      { label: 'Connected Accounts', value: '6', change: '+2' },
      { label: 'Posts Today', value: '12', change: '+5' }
    ]
  },
  {
    id: 'email-marketing',
    name: 'Email Marketing',
    description: 'Campaign automation and analytics',
    route: '/email-marketing',
    status: 'active',
    color: 'bg-blue-500',
    icon: BarChart3,
    stats: [
      { label: 'Active Campaigns', value: '8', change: '+3' },
      { label: 'Open Rate', value: '24.5%', change: '+2.1%' }
    ]
  },
  {
    id: 'project-management',
    name: 'Project Management',
    description: 'Team collaboration and task management',
    route: '/project-management',
    status: 'active',
    color: 'bg-green-500',
    icon: Users,
    stats: [
      { label: 'Active Projects', value: '15', change: '+4' },
      { label: 'Team Members', value: '12', change: '+2' }
    ]
  },
  {
    id: 'marketing-command-center',
    name: 'Marketing Command Center',
    description: 'Unified marketing ecosystem hub',
    route: '/marketing',
    status: 'active',
    color: 'bg-purple-500',
    icon: Zap,
    stats: [
      { label: 'Campaigns', value: '25', change: '+8' },
      { label: 'ROI', value: '285%', change: '+15%' }
    ]
  }
];

// Suite Configurations - Business-oriented platform bundles
const suiteConfigurations: SuiteConfiguration[] = [
  {
    id: 'marketing-suite',
    name: 'Marketing Suite',
    description: 'Social media, email marketing, and campaign management',
    platforms: ['social-media', 'email-marketing', 'marketing-command-center'],
    color: 'from-pink-500 to-purple-500',
    recommended: true
  },
  {
    id: 'operations-suite',
    name: 'Operations Suite',
    description: 'Project management, team collaboration, and workflows',
    platforms: ['project-management', 'team-collaboration', 'workflow-automation'],
    color: 'from-green-500 to-blue-500'
  },
  {
    id: 'analytics-suite',
    name: 'Analytics Suite',
    description: 'Business intelligence, performance tracking, and insights',
    platforms: ['business-intelligence', 'performance-analytics', 'predictive-insights'],
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: 'enterprise-suite',
    name: 'Enterprise Suite',
    description: 'Complete business ecosystem with all platforms',
    platforms: ['all'],
    color: 'from-gray-600 to-gray-900'
  }
];

interface MasterTerminalCoreProps {
  selectedSuite?: string;
  viewMode?: 'grid' | 'list' | 'analytics';
  onSuiteChange?: (suiteId: string) => void;
  onPlatformAccess?: (platformId: string) => void;
}

export default function MasterTerminalCore({
  selectedSuite,
  viewMode = 'grid',
  onSuiteChange,
  onPlatformAccess
}: MasterTerminalCoreProps) {
  const [currentView, setCurrentView] = useState(viewMode);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [systemStatus, setSystemStatus] = useState({
    uptime: '99.9%',
    response: '245ms',
    routes: '105',
    status: 'Active'
  });

  // Filter platforms based on selected suite
  const getActivePlatforms = () => {
    if (!selectedSuite) return platformRegistry;
    
    const suite = suiteConfigurations.find(s => s.id === selectedSuite);
    if (!suite) return platformRegistry;
    
    if (suite.platforms.includes('all')) return platformRegistry;
    
    return platformRegistry.filter(platform => 
      suite.platforms.includes(platform.id)
    );
  };

  // Real-time system monitoring (following dissertation async patterns)
  useEffect(() => {
    const updateSystemStatus = () => {
      setSystemStatus(prev => ({
        ...prev,
        response: `${Math.floor(Math.random() * 100 + 200)}ms`,
        uptime: '99.9%' // In production, this would come from real monitoring
      }));
    };

    const interval = setInterval(updateSystemStatus, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const activePlatforms = getActivePlatforms();

  return (
    <div className="space-y-8">
      {/* Enhanced Header with Suite Selection */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-center gap-4">
          <motion.div 
            className="p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Target className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Master Terminal
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enterprise command center • {activePlatforms.length} platforms active
            </p>
          </div>
        </div>
        
        {/* View Controls & Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <div className="flex bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            {[
              { mode: 'grid', icon: Grid3X3, label: 'Grid' },
              { mode: 'list', icon: List, label: 'List' },
              { mode: 'analytics', icon: BarChart3, label: 'Analytics' }
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setCurrentView(mode as any)}
                className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${
                  currentView === mode
                    ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </div>
          
          <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          
          <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </button>
        </div>
      </div>

      {/* Suite Selector */}
      {!selectedSuite && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Business Suite
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {suiteConfigurations.map((suite) => (
              <motion.button
                key={suite.id}
                onClick={() => onSuiteChange?.(suite.id)}
                className={`relative p-4 bg-white dark:bg-gray-800 rounded-lg border-2 transition-all text-left ${
                  suite.recommended 
                    ? 'border-teal-300 dark:border-teal-600 ring-2 ring-teal-100 dark:ring-teal-900/30' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {suite.recommended && (
                  <div className="absolute -top-2 -right-2 bg-teal-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Recommended
                  </div>
                )}
                <div className={`w-12 h-12 bg-gradient-to-r ${suite.color} rounded-lg mb-3`}></div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{suite.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{suite.description}</p>
                <div className="flex items-center text-sm text-teal-600 dark:text-teal-400">
                  <span>Select Suite</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Platform Grid/List View */}
      <AnimatePresence mode="wait">
        {currentView === 'grid' && (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {activePlatforms.map((platform, index) => (
              <motion.div
                key={platform.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${platform.color}`}></div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{platform.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{platform.description}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                    platform.status === 'active' 
                      ? 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30'
                      : 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900/30'
                  }`}>
                    {platform.status}
                  </div>
                </div>

                {platform.stats && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {platform.stats.map((stat) => (
                      <div key={stat.label} className="text-center">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</div>
                        {stat.change && (
                          <div className="text-xs text-green-600 dark:text-green-400">{stat.change}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Link
                    href={platform.route}
                    className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Platform
                  </Link>
                  <button
                    onClick={() => onPlatformAccess?.(platform.id)}
                    className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* System Status Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-teal-50 via-blue-50 to-purple-50 dark:from-teal-900/20 dark:via-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-teal-200 dark:border-teal-800"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Enterprise System Status
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                All systems operational • Last updated: {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-600 dark:text-green-400">Live</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Uptime', value: systemStatus.uptime, color: 'text-green-600 dark:text-green-400' },
            { label: 'Response', value: systemStatus.response, color: 'text-blue-600 dark:text-blue-400' },
            { label: 'Routes', value: systemStatus.routes, color: 'text-purple-600 dark:text-purple-400' },
            { label: 'Status', value: systemStatus.status, color: 'text-orange-600 dark:text-orange-400' }
          ].map((metric) => (
            <div key={metric.label} className="text-center">
              <motion.div 
                className={`text-2xl font-bold ${metric.color}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                {metric.value}
              </motion.div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}