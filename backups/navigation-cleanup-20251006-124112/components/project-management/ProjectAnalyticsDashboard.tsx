'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useProjectManagement } from '@/contexts/ProjectManagementContext';
import {
  Calendar,
  Clock,
  Users,
  Target,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Activity,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';

// ============================================================================
// PROJECT ANALYTICS DASHBOARD
// ============================================================================

export default function ProjectAnalyticsDashboard() {
  const {
    projects,
    tasks,
    teamMembers,
    timeEntries,
    currentProject,
    getProjectAnalytics,
    getTeamAnalytics
  } = useProjectManagement();

  const [timeframe, setTimeframe] = useState('week'); // week, month, quarter, year

  // ========== ANALYTICS DATA ==========
  const teamAnalytics = getTeamAnalytics();
  const projectAnalytics = currentProject ? getProjectAnalytics(currentProject.id) : null;

  // ========== OVERALL METRICS ==========
  const overallMetrics = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'done').length,
    overdueTasks: tasks.filter(t => 
      t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done'
    ).length,
    totalBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
    totalSpent: projects.reduce((sum, p) => sum + (p.spent || 0), 0),
    teamUtilization: teamAnalytics.averageWorkload,
    completionRate: tasks.length > 0 ? (tasks.filter(t => t.status === 'done').length / tasks.length) * 100 : 0
  };

  // ========== PROJECT STATUS DISTRIBUTION ==========
  const statusDistribution = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // ========== PRIORITY DISTRIBUTION ==========
  const priorityDistribution = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // ========== TIMEFRAME OPTIONS ==========
  const timeframes = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  return (
    <div className="space-y-8">
      {/* ========== HEADER ========== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Project Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Comprehensive insights into your project performance and team productivity
          </p>
        </div>

        <div className="flex items-center gap-2">
          {timeframes.map((tf) => (
            <Button
              key={tf.value}
              variant={timeframe === tf.value ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe(tf.value)}
            >
              {tf.label}
            </Button>
          ))}
        </div>
      </div>

      {/* ========== KEY METRICS GRID ========== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Active Projects</p>
                  <p className="text-3xl font-bold">{overallMetrics.activeProjects}</p>
                  <p className="text-blue-100 text-xs mt-1">
                    {overallMetrics.totalProjects} total
                  </p>
                </div>
                <Target className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Task Completion</p>
                  <p className="text-3xl font-bold">{Math.round(overallMetrics.completionRate)}%</p>
                  <p className="text-green-100 text-xs mt-1">
                    {overallMetrics.completedTasks} completed
                  </p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Team Utilization</p>
                  <p className="text-3xl font-bold">{Math.round(overallMetrics.teamUtilization)}%</p>
                  <p className="text-purple-100 text-xs mt-1">
                    {teamAnalytics.activeMembers} active members
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className={`border-0 text-white bg-gradient-to-br ${
            overallMetrics.overdueTasks > 0 
              ? 'from-red-500 to-red-600' 
              : 'from-gray-500 to-gray-600'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Overdue Tasks</p>
                  <p className="text-3xl font-bold">{overallMetrics.overdueTasks}</p>
                  <p className="text-red-100 text-xs mt-1">
                    {overallMetrics.overdueTasks > 0 ? 'Needs attention' : 'On track'}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ========== CURRENT PROJECT DETAILS ========== */}
      {currentProject && projectAnalytics && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                {currentProject.name} - Detailed Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ========== PROJECT PROGRESS ========== */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <span className="text-sm text-gray-600">
                        {Math.round(projectAnalytics.completion)}%
                      </span>
                    </div>
                    <Progress value={projectAnalytics.completion} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Team Efficiency</span>
                      <span className="text-sm text-gray-600">
                        {Math.round(projectAnalytics.teamEfficiency)}%
                      </span>
                    </div>
                    <Progress value={projectAnalytics.teamEfficiency} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Milestone Progress</span>
                      <span className="text-sm text-gray-600">
                        {Math.round(projectAnalytics.milestoneProgress)}%
                      </span>
                    </div>
                    <Progress value={projectAnalytics.milestoneProgress} className="h-2" />
                  </div>
                </div>

                {/* ========== PROJECT METRICS ========== */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Tasks</span>
                    <span className="text-sm font-medium">{projectAnalytics.totalTasks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Completed Tasks</span>
                    <span className="text-sm font-medium">{projectAnalytics.tasksCompleted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Hours Spent</span>
                    <span className="text-sm font-medium">{projectAnalytics.hoursSpent}h</span>
                  </div>
                  {currentProject.budget && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Budget Used</span>
                      <span className="text-sm font-medium">
                        ${projectAnalytics.budgetUsed.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* ========== RISK FACTORS ========== */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Risk Assessment</h4>
                  {projectAnalytics.riskFactors.length > 0 ? (
                    <div className="space-y-2">
                      {projectAnalytics.riskFactors.map((risk, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          <span className="text-sm">{risk}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm">No significant risks detected</span>
                    </div>
                  )}

                  {projectAnalytics.bottlenecks.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium mb-2">Bottlenecks</h5>
                      <div className="space-y-1">
                        {projectAnalytics.bottlenecks.map((bottleneck, index) => (
                          <div key={index} className="text-sm text-orange-600">
                            • {bottleneck}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ========== CHARTS AND VISUALIZATIONS ========== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ========== PROJECT STATUS CHART ========== */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Project Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(statusDistribution).map(([status, count]) => {
                  const percentage = projects.length > 0 ? (count / projects.length) * 100 : 0;
                  const statusColors = {
                    planning: 'bg-gray-500',
                    active: 'bg-blue-500',
                    on_hold: 'bg-yellow-500',
                    completed: 'bg-green-500',
                    cancelled: 'bg-red-500'
                  };

                  return (
                    <div key={status}>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${statusColors[status as keyof typeof statusColors]}`} />
                          <span className="text-sm capitalize">{status.replace('_', ' ')}</span>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                      <Progress value={percentage} className="h-1" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ========== PRIORITY DISTRIBUTION ========== */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Task Priority Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(priorityDistribution).map(([priority, count]) => {
                  const percentage = tasks.length > 0 ? (count / tasks.length) * 100 : 0;
                  const priorityColors = {
                    lowest: 'bg-gray-300',
                    low: 'bg-blue-400',
                    medium: 'bg-yellow-400',
                    high: 'bg-orange-500',
                    highest: 'bg-red-500',
                    critical: 'bg-purple-600'
                  };

                  return (
                    <div key={priority}>
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${priorityColors[priority as keyof typeof priorityColors]}`} />
                          <span className="text-sm capitalize">{priority}</span>
                        </div>
                        <span className="text-sm font-medium">{count}</span>
                      </div>
                      <Progress value={percentage} className="h-1" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* ========== BUDGET OVERVIEW ========== */}
      {overallMetrics.totalBudget > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Budget Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${overallMetrics.totalBudget.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Budget</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    ${overallMetrics.totalSpent.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Spent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${(overallMetrics.totalBudget - overallMetrics.totalSpent).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Remaining</div>
                </div>
              </div>
              <div className="mt-4">
                <Progress 
                  value={overallMetrics.totalBudget > 0 ? (overallMetrics.totalSpent / overallMetrics.totalBudget) * 100 : 0} 
                  className="h-3"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}