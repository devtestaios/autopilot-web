'use client';

import React from 'react';
import { Play, Pause, Square, Clock } from 'lucide-react';
import { useProjectManagement } from '@/contexts/ProjectManagementContext';

interface TimerWidgetProps {
  taskId?: string;
  taskTitle?: string;
  showCompact?: boolean;
}

export default function TimerWidget({ taskId, taskTitle, showCompact = false }: TimerWidgetProps) {
  const { 
    activeTimer, 
    startTimer, 
    stopTimer, 
    formatElapsedTime,
    tasks 
  } = useProjectManagement();

  const isTimerActive = activeTimer !== null;
  const isCurrentTask = activeTimer?.taskId === taskId;
  
  // Get task info if taskId provided
  const task = taskId ? tasks.find(t => t.id === taskId) : null;
  const displayTitle = taskTitle || task?.title || 'Select Task';

  const handleStartTimer = () => {
    if (!taskId) return;
    startTimer(taskId, `Working on: ${displayTitle}`);
  };

  const handleStopTimer = async () => {
    const timeEntry = await stopTimer();
    if (timeEntry) {
      console.log('Timer stopped, time entry created:', timeEntry);
    }
  };

  if (showCompact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        {isCurrentTask && (
          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="font-mono text-xs">
              {formatElapsedTime(activeTimer?.elapsed ?? 0)}
            </span>
          </div>
        )}
        {task?.timeSpent && (
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="w-3 h-3" />
            <span className="text-xs">{Math.round(task.timeSpent / 60)}h</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Time Tracker
        </h3>
        {isTimerActive && !isCurrentTask && (
          <div className="text-xs text-amber-600 dark:text-amber-400">
            Timer running elsewhere
          </div>
        )}
      </div>

      {/* Current Task Display */}
      {isCurrentTask ? (
        <div className="mb-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Currently tracking:
          </div>
          <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {displayTitle}
          </div>
          <div className="text-2xl font-mono text-green-600 dark:text-green-400 mt-2">
            {formatElapsedTime(activeTimer?.elapsed ?? 0)}
          </div>
        </div>
      ) : taskId ? (
        <div className="mb-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Task:
          </div>
          <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {displayTitle}
          </div>
          {task?.timeSpent && (
            <div className="text-sm text-gray-500 mt-1">
              Total time: {Math.round(task.timeSpent / 60)}h {task.timeSpent % 60}m
            </div>
          )}
        </div>
      ) : (
        <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
          Select a task to start timing
        </div>
      )}

      {/* Timer Controls */}
      <div className="flex gap-2">
        {!isTimerActive ? (
          <button
            onClick={handleStartTimer}
            disabled={!taskId}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-md text-sm font-medium transition-colors"
          >
            <Play className="w-4 h-4" />
            Start Timer
          </button>
        ) : isCurrentTask ? (
          <button
            onClick={handleStopTimer}
            className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            <Square className="w-4 h-4" />
            Stop Timer
          </button>
        ) : (
          <button
            onClick={handleStopTimer}
            className="flex items-center gap-2 px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            <Pause className="w-4 h-4" />
            Stop Current
          </button>
        )}

        {isCurrentTask && (
          <button
            onClick={() => {
              handleStopTimer();
              if (taskId) {
                setTimeout(() => handleStartTimer(), 100);
              }
            }}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            <Pause className="w-4 h-4" />
            Restart
          </button>
        )}
      </div>

      {/* Quick Actions */}
      {isCurrentTask && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Time will be automatically logged when stopped
          </div>
        </div>
      )}
    </div>
  );
}