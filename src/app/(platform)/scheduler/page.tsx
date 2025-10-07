'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Calendar, 
  Clock, 
  Play, 
  Pause, 
  Settings, 
  Plus,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Zap,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import NavigationTabs from '@/components/NavigationTabs';
import UnifiedSidebar from '@/components/UnifiedSidebar';

// Types for scheduler
interface ScheduledTask {
  id: string;
  name: string;
  type: 'sync_campaigns' | 'sync_performance' | 'optimization' | 'report_generation';
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  nextRun: string;
  lastRun?: string;
  status: 'active' | 'paused' | 'running' | 'error';
  platform?: string;
  description: string;
  duration: string;
  successRate: number;
}

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  type: 'sync' | 'optimization' | 'report';
  status: 'completed' | 'scheduled' | 'running' | 'failed';
}

// Mock data for demonstration
const mockScheduledTasks: ScheduledTask[] = [
  {
    id: '1',
    name: 'Campaign Performance Sync',
    type: 'sync_performance',
    frequency: 'hourly',
    nextRun: '2025-09-20T15:00:00Z',
    lastRun: '2025-09-20T14:00:00Z',
    status: 'active',
    platform: 'Google Ads',
    description: 'Sync campaign performance metrics from Google Ads',
    duration: '2m 34s',
    successRate: 98.5
  },
  {
    id: '2',
    name: 'Daily Campaign Optimization',
    type: 'optimization',
    frequency: 'daily',
    nextRun: '2025-09-21T09:00:00Z',
    lastRun: '2025-09-20T09:00:00Z',
    status: 'active',
    description: 'AI-powered campaign optimization recommendations',
    duration: '5m 12s',
    successRate: 95.2
  },
  {
    id: '3',
    name: 'Weekly Performance Reports',
    type: 'report_generation',
    frequency: 'weekly',
    nextRun: '2025-09-23T10:00:00Z',
    lastRun: '2025-09-16T10:00:00Z',
    status: 'active',
    description: 'Generate comprehensive performance reports',
    duration: '3m 45s',
    successRate: 100
  },
  {
    id: '4',
    name: 'Campaign Data Backup',
    type: 'sync_campaigns',
    frequency: 'daily',
    nextRun: '2025-09-21T02:00:00Z',
    lastRun: '2025-09-20T02:00:00Z',
    status: 'paused',
    description: 'Backup campaign data and configurations',
    duration: '1m 18s',
    successRate: 92.1
  }
];

const mockCalendarEvents: CalendarEvent[] = [
  { id: '1', title: 'Performance Sync', time: '14:00', type: 'sync', status: 'completed' },
  { id: '2', title: 'Campaign Optimization', time: '15:00', type: 'optimization', status: 'running' },
  { id: '3', title: 'Weekly Report', time: '16:30', type: 'report', status: 'scheduled' },
  { id: '4', title: 'Data Backup', time: '02:00', type: 'sync', status: 'scheduled' },
];

export default function SchedulerPage() {
  const { theme } = useTheme();
  const [selectedView, setSelectedView] = useState<'overview' | 'calendar' | 'tasks'>('overview');
  const [tasks, setTasks] = useState<ScheduledTask[]>(mockScheduledTasks);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'paused': return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'running': return 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      case 'error': return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      default: return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sync_campaigns': return <RefreshCw className="w-4 h-4" />;
      case 'sync_performance': return <TrendingUp className="w-4 h-4" />;
      case 'optimization': return <Zap className="w-4 h-4" />;
      case 'report_generation': return <Calendar className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'active' ? 'paused' : 'active' }
        : task
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedSidebar onCollapseChange={setSidebarCollapsed} />
      
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-14' : 'lg:ml-56'
      }`}>
        <NavigationTabs />
        
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Automation Scheduler
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage automated tasks and sync schedules
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                New Task
              </button>
            </div>
          </div>

          {/* View Tabs */}
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
            {[
              { id: 'overview', label: 'Overview', icon: <Calendar className="w-4 h-4" /> },
              { id: 'calendar', label: 'Calendar', icon: <Clock className="w-4 h-4" /> },
              { id: 'tasks', label: 'Tasks', icon: <Settings className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedView(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedView === tab.id
                    ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview View */}
          {selectedView === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Stats Cards */}
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {tasks.filter(t => t.status === 'active').length}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Active Tasks
                  </h3>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    Running smoothly
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      96.9%
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Success Rate
                  </h3>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    +2.1% from last week
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                      <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      24
                    </span>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Runs Today
                  </h3>
                  <p className="text-xs text-purple-600 dark:text-purple-400">
                    Next in 45 min
                  </p>
                </motion.div>
              </div>

              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Recent Activity
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    {mockCalendarEvents.slice(0, 4).map((event, index) => (
                      <div key={event.id} className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          event.status === 'completed' ? 'bg-green-100 dark:bg-green-900/20' :
                          event.status === 'running' ? 'bg-blue-100 dark:bg-blue-900/20' :
                          'bg-gray-100 dark:bg-gray-900/20'
                        }`}>
                          {getTypeIcon(event.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {event.title}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {event.time} - {event.status}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Quick Actions
                  </h3>
                </div>
                <div className="p-6 space-y-3">
                  <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Sync Now
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Run manual sync
                      </p>
                    </div>
                  </button>
                  
                  <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Optimize Campaigns
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Run AI optimization
                      </p>
                    </div>
                  </button>
                  
                  <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Generate Report
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Create performance report
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tasks View */}
          {selectedView === 'tasks' && (
            <div className="space-y-4">
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${
                        task.status === 'active' ? 'bg-green-100 dark:bg-green-900/20' :
                        'bg-gray-100 dark:bg-gray-900/20'
                      }`}>
                        {getTypeIcon(task.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {task.name}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                          {task.platform && (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                              {task.platform}
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {task.description}
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 dark:text-gray-500 mb-1">Frequency</p>
                            <p className="font-medium text-gray-900 dark:text-white capitalize">
                              {task.frequency}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-500 mb-1">Next Run</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {new Date(task.nextRun).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-500 mb-1">Duration</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {task.duration}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-500 mb-1">Success Rate</p>
                            <p className="font-medium text-green-600 dark:text-green-400">
                              {task.successRate}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          task.status === 'active'
                            ? 'text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                            : 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
                        }`}
                      >
                        {task.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Calendar View - Simple Implementation */}
          {selectedView === 'calendar' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    September 2025
                  </h3>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="text-center text-gray-600 dark:text-gray-400 py-12">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Calendar view coming soon</p>
                  <p className="text-sm mt-2">Full calendar integration in the next update</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}