'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useProjectManagement } from '@/contexts/ProjectManagementContext';
import { useUserTier } from '@/contexts/UserTierContext';
import UpgradePrompt from '@/components/UpgradePrompt';

// Enhanced Design System Imports - Phase 1 Visual Polish
import { designTokens } from '@/lib/designTokens';
import { animations } from '@/lib/animations';
import visualEffects from '@/lib/visualEffects';
import { Container, Grid, Flex, Section, Stack, Header, ContentArea, CardGrid } from '@/components/ui/LayoutSystem';
import { Button as EnhancedButton, Card as EnhancedCard, Badge, Spinner, Avatar, Progress } from '@/components/ui/EnhancedComponents';

// SSR-safe imports using social-media pattern
const UnifiedSidebar = dynamic(() => import('@/components/UnifiedSidebar'), {
  ssr: false,
  loading: () => <div className="fixed left-0 top-0 h-screen w-56 bg-gray-900 animate-pulse" />
});

const AdvancedNavigation = dynamic(() => import('@/components/ui/AdvancedNavigation'), {
  ssr: false,
  loading: () => <div className="h-16 bg-white dark:bg-gray-900 border-b animate-pulse" />
});

const AIControlChat = dynamic(() => import('@/components/AIControlChat'), {
  ssr: false,
  loading: () => null
});

const MasterTerminalBreadcrumb = dynamic(() => import('@/components/MasterTerminalBreadcrumb'), {
  ssr: false,
  loading: () => <div className="h-8 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
});

const NavigationTabs = dynamic(() => import('@/components/NavigationTabs'), {
  ssr: false,
  loading: () => <div className="h-12 bg-white dark:bg-gray-900 border-b animate-pulse" />
});

// Project management skeleton component for lazy loading states
const ProjectManagementSkeleton = ({ type }: { type: 'wizard' | 'kanban' | 'seeder' | 'analytics' }) => {
  const getSkeletonConfig = (type: string) => {
    switch (type) {
      case 'wizard': 
        return { height: 'h-96', cols: 1, rows: 6 };
      case 'kanban': 
        return { height: 'h-[600px]', cols: 3, rows: 4 };
      case 'seeder': 
        return { height: 'h-32', cols: 4, rows: 2 };
      case 'analytics': 
        return { height: 'h-80', cols: 2, rows: 5 };
      default: 
        return { height: 'h-64', cols: 2, rows: 4 };
    }
  };

  const config = getSkeletonConfig(type);

  return (
    <div className={`${config.height} bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse`}>
      <div className="flex items-center justify-between mb-6">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
      </div>
      <div className={`grid grid-cols-${config.cols} gap-4`}>
        {Array.from({ length: config.cols * config.rows }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        ))}
      </div>
    </div>
  );
};

// Phase 2B.2: Lazy-loaded project management components for 25-30kB bundle reduction
const ProjectCreationWizard = dynamic(
  () => import('@/components/project-management/ProjectCreationWizard').then(mod => ({ default: mod.ProjectCreationWizard })),
  { 
    ssr: false, 
    loading: () => <ProjectManagementSkeleton type="wizard" />
  }
);

const KanbanBoard = dynamic(
  () => import('@/components/project-management/KanbanBoard').then(mod => ({ default: mod.KanbanBoard })),
  { 
    ssr: false, 
    loading: () => <ProjectManagementSkeleton type="kanban" />
  }
);

const ProjectManagementSeeder = dynamic(
  () => import('@/components/project-management/ProjectManagementSeeder').then(mod => ({ default: mod.ProjectManagementSeeder })),
  { 
    ssr: false, 
    loading: () => <ProjectManagementSkeleton type="seeder" />
  }
);

const ProjectAnalyticsDashboard = dynamic(
  () => import('@/components/project-management/ProjectAnalyticsDashboard'),
  { 
    ssr: false, 
    loading: () => <ProjectManagementSkeleton type="analytics" />
  }
);

const TimerWidget = dynamic(
  () => import('@/components/project-management/TimerWidget'),
  { 
    ssr: false, 
    loading: () => <div className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse"><div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div></div>
  }
);

const BudgetTracking = dynamic(
  () => import('@/components/project-management/BudgetTracking'),
  { 
    ssr: false, 
    loading: () => <div className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse"><div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div></div>
  }
);
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3, 
  Users, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Filter,
  Search,
  MoreVertical,
  Grid3X3,
  List,
  Calendar as CalendarIcon,
  Activity,
  PieChart
} from 'lucide-react';// ============================================================================
// PROJECT MANAGEMENT DASHBOARD
// ============================================================================

export default function ProjectManagementDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const {
    currentProject,
    projects,
    tasks,
    teamMembers,
    currentView,
    setCurrentView,
    getProjectAnalytics,
    getTeamAnalytics,
    createProject,
    createTask
  } = useProjectManagement();

  const { canAccess } = useUserTier();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showCreateWizard, setShowCreateWizard] = useState(false);

  // ========== ANALYTICS DATA ==========
  const projectAnalytics = currentProject ? getProjectAnalytics(currentProject.id) : null;
  const teamAnalytics = getTeamAnalytics();

  // ========== OVERVIEW STATISTICS ==========
  const overallStats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'done').length,
    overdueTasks: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length,
    teamMembers: teamMembers.length,
    activeMembers: teamMembers.filter(m => m.isActive).length
  };

  // ========== VIEW TYPES ==========
  const viewTypes = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'kanban', label: 'Kanban', icon: Grid3X3 },
    { id: 'list', label: 'List', icon: List },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'timeline', label: 'Timeline', icon: Activity }
  ];

  // ========== PRIORITY COLORS ==========
  const priorityColors = {
    lowest: 'bg-gray-100 text-gray-800',
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    highest: 'bg-red-100 text-red-800',
    critical: 'bg-purple-100 text-purple-800'
  };

  // ========== STATUS COLORS ==========
  const statusColors = {
    planning: 'bg-gray-100 text-gray-800',
    active: 'bg-blue-100 text-blue-800',
    on_hold: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Unified Sidebar */}
      <UnifiedSidebar onCollapseChange={setSidebarCollapsed} />
      
      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${
        sidebarCollapsed ? 'ml-14' : 'ml-56'
      }`}>
        {/* Advanced Navigation */}
        <AdvancedNavigation sidebarCollapsed={sidebarCollapsed} />
        
        {/* Navigation Tabs */}
        <NavigationTabs />
        
        {/* Content Container */}
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <MasterTerminalBreadcrumb />
          
          {/* Header with Project Status */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Project Command Center
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Enterprise project management with advanced analytics and team collaboration
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setShowCreateWizard(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  // TODO: Open create task modal
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </div>
          </div>

          {/* ========== VIEW SELECTOR ========== */}
          <div className="flex flex-wrap items-center gap-2 mt-6 p-2 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
            {viewTypes.map((view) => {
              const IconComponent = view.icon;
              return (
                <Button
                  key={view.id}
                  variant={currentView === view.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView(view.id as any)}
                  className={`flex items-center gap-2 ${
                    currentView === view.id 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  {view.label}
                </Button>
              );
            })}
          </div>

          {/* ========== SEARCH AND FILTERS ========== */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects, tasks, or team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </motion.div>

        {/* ========== DASHBOARD OVERVIEW ========== */}
        {currentView === 'dashboard' && (
          <>
            {/* ========== KEY METRICS ========== */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Active Projects
                  </CardTitle>
                  <Target className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {overallStats.activeProjects}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {overallStats.totalProjects} total projects
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Tasks Progress
                  </CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {overallStats.totalTasks > 0 ? Math.round((overallStats.completedTasks / overallStats.totalTasks) * 100) : 0}%
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {overallStats.completedTasks} of {overallStats.totalTasks} completed
                  </p>
                </CardContent>
              </Card>

              {canAccess('teamManagement') ? (
                <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Team Members
                    </CardTitle>
                    <Users className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {overallStats.activeMembers}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {overallStats.teamMembers} total members
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800 relative overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                      Team Management
                    </CardTitle>
                    <Users className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                      Pro Feature
                    </div>
                    <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                      <UpgradePrompt 
                        size="small"
                        feature="Team Management"
                        description="Invite team members, track collaboration"
                      />
                    </p>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Overdue Tasks
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {overallStats.overdueTasks}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Requiring attention
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* ========== TIMER & QUICK ACTIONS ========== */}
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <div className="lg:col-span-1">
                <TimerWidget 
                  taskId={tasks.find(t => t.status === 'in_progress')?.id}
                  taskTitle={tasks.find(t => t.status === 'in_progress')?.title}
                />
              </div>
              
              <div className="lg:col-span-2">
                <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 h-full">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-900 dark:text-white">
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {tasks.slice(0, 3).map((task) => (
                        <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                          <div className={`w-2 h-2 rounded-full ${
                            task.status === 'done' ? 'bg-green-500' :
                            task.status === 'in_progress' ? 'bg-blue-500' :
                            'bg-gray-400'
                          }`} />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {task.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {task.timeSpent ? `${Math.round(task.timeSpent / 60)}h logged` : 'No time logged'}
                            </div>
                          </div>
                          <Badge
                            className={`text-xs ${
                              task.priority === 'highest' || task.priority === 'critical' ? 'bg-red-100 text-red-800' :
                              task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                      ))}
                      {tasks.length === 0 && (
                        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                          No recent activity
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* ========== BUDGET TRACKING ========== */}
            {canAccess('budgetTracking') ? (
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                <BudgetTracking 
                  projectId={currentProject?.id}
                  showDetailed={true}
                />
              </motion.div>
            ) : (
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
              >
                <UpgradePrompt 
                  size="medium"
                  feature="Budget Tracking & Financial Management"
                  description="Track project budgets, expenses, and financial performance with detailed analytics and forecasting."
                />
              </motion.div>
            )}

            {/* ========== CURRENT PROJECT OVERVIEW ========== */}
            {currentProject && projectAnalytics && (
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl text-gray-900 dark:text-white">
                          {currentProject.name}
                        </CardTitle>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                          {currentProject.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={statusColors[currentProject.status]}>
                          {currentProject.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={priorityColors[currentProject.priority]}>
                          {currentProject.priority}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-300">Progress</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {Math.round(projectAnalytics.completion)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${projectAnalytics.completion}%` }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Tasks</div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {projectAnalytics.tasksCompleted} / {projectAnalytics.totalTasks}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Team Size</div>
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          {currentProject.team.length} members
                        </div>
                      </div>
                    </div>

                    {currentProject.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {currentProject.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* ========== PROJECTS GRID ========== */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  All Projects
                </h2>
                <Button variant="outline" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              {/* ========== EMPTY STATE WITH SEEDER ========== */}
              {projects.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mb-8">
                    <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No Projects Yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                      Get started by creating your first project or loading some sample data to explore all features.
                    </p>
                  </div>
                  <ProjectManagementSeeder />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {projects.map((project) => {
                  const projectTasks = tasks.filter(t => t.projectId === project.id);
                  const completedTasks = projectTasks.filter(t => t.status === 'done');
                  const projectProgress = projectTasks.length > 0 ? (completedTasks.length / projectTasks.length) * 100 : 0;

                  return (
                    <Card 
                      key={project.id} 
                      className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200 cursor-pointer"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg text-gray-900 dark:text-white mb-1">
                              {project.name}
                            </CardTitle>
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                              {project.description}
                            </p>
                          </div>
                          <div 
                            className="w-3 h-3 rounded-full ml-2 flex-shrink-0"
                            style={{ backgroundColor: project.color }}
                          />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-300">Progress</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {Math.round(projectProgress)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${projectProgress}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between">
                            <Badge className={statusColors[project.status]}>
                              {project.status.replace('_', ' ')}
                            </Badge>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <CheckCircle2 className="h-3 w-3" />
                              {completedTasks.length}/{projectTasks.length}
                            </div>
                          </div>

                          {project.team.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-600 dark:text-gray-300">
                                {project.team.length} member{project.team.length !== 1 ? 's' : ''}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                  {/* ========== CREATE PROJECT CARD ========== */}
                  {(canAccess('multipleProjects') || projects.length === 0) ? (
                    <Card className="bg-white dark:bg-slate-800 border-2 border-dashed border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-400 transition-colors duration-200 cursor-pointer">
                      <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                        <Plus className="h-8 w-8 text-gray-400 dark:text-slate-500 mb-3" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          Create New Project
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                          Start a new project from scratch or use a template
                        </p>
                        <Button size="sm" onClick={() => setShowCreateWizard(true)}>
                          Get Started
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800">
                      <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] text-center">
                        <div className="mb-4">
                          <UpgradePrompt 
                            size="medium"
                            feature="Multiple Projects"
                            description="TaskMaster includes 1 project. Upgrade to ProjectSuite for unlimited projects and advanced team collaboration."
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}

        {/* ========== KANBAN VIEW ========== */}
        {currentView === 'kanban' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <KanbanBoard />
          </motion.div>
        )}

        {/* ========== ANALYTICS VIEW ========== */}
        {currentView === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {canAccess('advancedAnalytics') ? (
              <ProjectAnalyticsDashboard />
            ) : (
              <div className="max-w-4xl mx-auto">
                <UpgradePrompt 
                  size="large"
                  feature="Advanced Analytics & Reporting"
                  description="Access comprehensive project analytics, team performance insights, time tracking reports, and predictive project forecasting to optimize your team's productivity."
                  icon={BarChart3}
                />
              </div>
            )}
          </motion.div>
        )}

        {/* ========== OTHER VIEWS PLACEHOLDER ========== */}
        {currentView !== 'dashboard' && currentView !== 'kanban' && currentView !== 'analytics' && (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-8 max-w-md mx-auto">
              <PieChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {currentView.charAt(0).toUpperCase() + currentView.slice(1)} View
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                The {currentView} view is currently under development. Advanced project visualization coming soon!
              </p>
              <Button 
                variant="outline" 
                onClick={() => setCurrentView('dashboard')}
              >
                Back to Dashboard
              </Button>
            </div>
          </motion.div>
        )}

        {/* ========== PROJECT CREATION WIZARD ========== */}
        <ProjectCreationWizard
          isOpen={showCreateWizard}
          onClose={() => setShowCreateWizard(false)}
        />
        </div>
      </div>

      {/* AI Control Chat - Bottom Right */}
      <AIControlChat defaultMinimized={true} />
    </div>
  );
}