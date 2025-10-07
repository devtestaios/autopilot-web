'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useProjectManagement } from '@/contexts/ProjectManagementContext';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Calculator,
  Clock,
  Target
} from 'lucide-react';

interface BudgetTrackingProps {
  projectId?: string;
  showDetailed?: boolean;
}

export default function BudgetTracking({ projectId, showDetailed = false }: BudgetTrackingProps) {
  const { projects, tasks, timeEntries, teamMembers } = useProjectManagement();

  // Calculate budget metrics
  const budgetData = useMemo(() => {
    if (projectId) {
      // Single project budget
      const project = projects.find(p => p.id === projectId);
      if (!project) return null;

      const projectTimeEntries = timeEntries.filter(entry => 
        tasks.find(task => task.id === entry.taskId && task.projectId === projectId)
      );

      const laborCost = projectTimeEntries.reduce((total, entry) => {
        const member = teamMembers.find(m => m.id === entry.userId);
        const rate = member?.hourlyRate || 75; // Default rate
        return total + (entry.hours * rate);
      }, 0);

      const actualSpent = (project.spent || 0) + laborCost;
      const budget = project.budget || 0;
      const remaining = budget - actualSpent;
      const percentUsed = budget > 0 ? (actualSpent / budget) * 100 : 0;

      return {
        type: 'single',
        project,
        budget,
        actualSpent,
        laborCost,
        materialCost: project.spent || 0,
        remaining,
        percentUsed,
        isOverBudget: actualSpent > budget,
        burnRate: projectTimeEntries.length > 0 ? laborCost / Math.max(project.progress, 1) * 100 : 0
      };
    } else {
      // Portfolio overview
      const portfolioData = projects.map(project => {
        const projectTimeEntries = timeEntries.filter(entry => 
          tasks.find(task => task.id === entry.taskId && task.projectId === project.id)
        );

        const laborCost = projectTimeEntries.reduce((total, entry) => {
          const member = teamMembers.find(m => m.id === entry.userId);
          const rate = member?.hourlyRate || 75;
          return total + (entry.hours * rate);
        }, 0);

        const actualSpent = (project.spent || 0) + laborCost;
        const budget = project.budget || 0;

        return {
          project,
          budget,
          actualSpent,
          laborCost,
          remaining: budget - actualSpent,
          percentUsed: budget > 0 ? (actualSpent / budget) * 100 : 0,
          isOverBudget: actualSpent > budget
        };
      });

      const totalBudget = portfolioData.reduce((sum, p) => sum + p.budget, 0);
      const totalSpent = portfolioData.reduce((sum, p) => sum + p.actualSpent, 0);
      const projectsOverBudget = portfolioData.filter(p => p.isOverBudget).length;

      return {
        type: 'portfolio',
        totalBudget,
        totalSpent,
        totalRemaining: totalBudget - totalSpent,
        portfolioPercentUsed: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
        projectsOverBudget,
        projects: portfolioData
      };
    }
  }, [projects, tasks, timeEntries, teamMembers, projectId]);

  if (!budgetData) {
    return (
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardContent className="p-6 text-center">
          <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No budget data available</p>
        </CardContent>
      </Card>
    );
  }

  if (budgetData.type === 'single') {
    const { project, budget, actualSpent, laborCost, materialCost, remaining, percentUsed, isOverBudget, burnRate } = budgetData;

    return (
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Budget Tracking
            </CardTitle>
            <Badge 
              className={`${
                isOverBudget ? 'bg-red-100 text-red-800' :
                (percentUsed ?? 0) > 80 ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}
            >
              {isOverBudget ? 'Over Budget' : (percentUsed ?? 0) > 80 ? 'Warning' : 'On Track'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Budget Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ${(budget ?? 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total Budget
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                isOverBudget ? 'text-red-600' : 'text-green-600'
              }`}>
                ${(actualSpent ?? 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Actual Spent
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Budget Used</span>
              <span className={`font-medium ${
                isOverBudget ? 'text-red-600' : (percentUsed ?? 0) > 80 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {(percentUsed ?? 0).toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={Math.min(percentUsed ?? 0, 100)} 
              className={`h-3 ${
                isOverBudget ? 'bg-red-100' : (percentUsed ?? 0) > 80 ? 'bg-yellow-100' : 'bg-green-100'
              }`}
            />
            {isOverBudget && (
              <div className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Over budget by ${Math.abs(remaining).toLocaleString()}
              </div>
            )}
          </div>

          {showDetailed && (
            <>
              {/* Cost Breakdown */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      ${(laborCost ?? 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Labor Costs
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-purple-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      ${(materialCost ?? 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Materials
                    </div>
                  </div>
                </div>
              </div>

              {/* Projections */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Projections
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Burn Rate:</span>
                    <span className="ml-2 font-medium">
                      ${(burnRate ?? 0).toFixed(0)}/% complete
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Remaining:</span>
                    <span className={`ml-2 font-medium ${
                      (remaining ?? 0) < 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      ${(remaining ?? 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  // Portfolio View
  const { totalBudget, totalSpent, totalRemaining, portfolioPercentUsed, projectsOverBudget, projects: portfolioProjects } = budgetData;

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Portfolio Budget Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ${(totalBudget ?? 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total Budget
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                ${(totalSpent ?? 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total Spent
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                (totalRemaining ?? 0) < 0 ? 'text-red-600' : 'text-green-600'
              }`}>
                ${(totalRemaining ?? 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Remaining
              </div>
            </div>
          </div>

          <Progress value={Math.min(portfolioPercentUsed ?? 0, 100)} className="mb-2" />
          
          {(projectsOverBudget ?? 0) > 0 && (
            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
              <AlertTriangle className="h-4 w-4" />
              {projectsOverBudget} project{(projectsOverBudget ?? 0) > 1 ? 's' : ''} over budget
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project List */}
      {showDetailed && (
        <div className="grid gap-4">
          {(portfolioProjects ?? []).map(({ project, budget, actualSpent, percentUsed, isOverBudget }) => (
            <Card key={project.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {project.name}
                  </h4>
                  <Badge 
                    className={`text-xs ${
                      isOverBudget ? 'bg-red-100 text-red-800' :
                      percentUsed > 80 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}
                  >
                    {percentUsed.toFixed(0)}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>${actualSpent.toLocaleString()} / ${budget.toLocaleString()}</span>
                  {isOverBudget ? (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <Progress value={Math.min(percentUsed, 100)} className="mt-2 h-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}