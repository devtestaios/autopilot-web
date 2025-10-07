'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import NavigationTabs from '@/components/NavigationTabs';
import { useProjectManagement } from '@/contexts/ProjectManagementContext';
import { useUserTier } from '@/contexts/UserTierContext';
import UpgradePrompt from '@/components/UpgradePrompt';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Clock,
  Plus,
  Play,
  Pause,
  Calendar,
  User,
  Target,
  TrendingUp,
  BarChart3,
  Users,
  DollarSign,
  Settings
} from 'lucide-react';

// Simplified components for TaskMaster
const SimpleKanbanBoard = dynamic(
  () => import('@/components/task-master/SimpleKanbanBoard'),
  { 
    ssr: false, 
    loading: () => <div className="h-96 bg-white dark:bg-gray-800 rounded-lg animate-pulse"></div>
  }
);

const SimpleTimer = dynamic(
  () => import('@/components/project-management/TimerWidget'),
  { 
    ssr: false, 
    loading: () => <div className="h-32 bg-white dark:bg-gray-800 rounded-lg animate-pulse"></div>
  }
);

// ============================================================================
// TASK MASTER DASHBOARD
// ============================================================================

export default function TaskMasterDashboard() {
  const { tasks, activeTimer, startTimer, stopTimer, formatElapsedTime } = useProjectManagement();
  const { tier, canAccess } = useUserTier();
  
  // Filter to single project view for TaskMaster
  const myTasks = tasks.slice(0, 10); // Limit tasks for simplicity
  const completedTasks = myTasks.filter(t => t.status === 'done');
  const inProgressTasks = myTasks.filter(t => t.status === 'in_progress');
  const todoTasks = myTasks.filter(t => t.status === 'todo' || t.status === 'backlog');

  // Simple analytics for TaskMaster
  const todayTasks = myTasks.filter(t => {
    const today = new Date().toDateString();
    return new Date(t.createdAt).toDateString() === today;
  });

  const completionRate = myTasks.length > 0 ? Math.round((completedTasks.length / myTasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <NavigationTabs />
      
      <div className="container mx-auto px-4 py-8">
        {/* ========== HEADER ========== */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  TaskMaster
                </h1>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  Simple & Focused
                </Badge>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Your personal productivity dashboard for getting things done
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
              {tier === 'taskmaster' && (
                <Button 
                  variant="outline"
                  className="border-purple-200 text-purple-700 hover:bg-purple-50"
                  onClick={() => {/* Trigger upgrade flow */}}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Upgrade
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* ========== QUICK STATS ========== */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {completedTasks.length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Completed
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {inProgressTasks.length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    In Progress
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-orange-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {completionRate}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Completion Rate
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {todayTasks.length}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Today's Tasks
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ========== MAIN CONTENT GRID ========== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ========== KANBAN BOARD ========== */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white dark:bg-gray-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    My Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SimpleKanbanBoard />
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* ========== SIDEBAR ========== */}
          <div className="space-y-6">
            
            {/* ========== TIMER WIDGET ========== */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <SimpleTimer 
                taskId={inProgressTasks[0]?.id}
                taskTitle={inProgressTasks[0]?.title}
              />
            </motion.div>

            {/* ========== ENTERPRISE FEATURES PREVIEW ========== */}
            {!canAccess('advancedAnalytics') && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <UpgradePrompt 
                  feature="Advanced Analytics"
                  description="Get detailed insights into your productivity patterns"
                  icon={BarChart3}
                />
              </motion.div>
            )}

            {!canAccess('teamManagement') && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <UpgradePrompt 
                  feature="Team Collaboration"
                  description="Work together with your team on shared projects"
                  icon={Users}
                />
              </motion.div>
            )}

            {!canAccess('budgetTracking') && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <UpgradePrompt 
                  feature="Budget Tracking"
                  description="Track project costs and profitability"
                  icon={DollarSign}
                />
              </motion.div>
            )}

          </div>
        </div>

        {/* ========== TODAY'S FOCUS ========== */}
        {todayTasks.length > 0 && (
          <motion.div 
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
                  <Calendar className="h-5 w-5" />
                  Today's Focus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {todayTasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <div className={`w-3 h-3 rounded-full ${
                        task.status === 'done' ? 'bg-green-500' :
                        task.status === 'in_progress' ? 'bg-blue-500' :
                        'bg-gray-400'
                      }`} />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {task.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {task.status === 'done' ? 'Completed' : 'In Progress'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}