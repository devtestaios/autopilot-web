'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useProjectManagement, Task } from '@/contexts/ProjectManagementContext';
import { useUserTier } from '@/contexts/UserTierContext';
import UpgradePrompt from '@/components/UpgradePrompt';
import {
  Clock,
  Calendar,
  User,
  Play,
  Pause,
  Plus,
  MoreHorizontal,
  Flag,
  ArrowRight
} from 'lucide-react';

// ============================================================================
// SIMPLE KANBAN BOARD FOR TASKMASTER
// ============================================================================

const SIMPLE_COLUMNS = [
  {
    id: 'todo',
    title: 'To Do',
    statuses: ['backlog', 'todo'],
    color: 'bg-gray-100 dark:bg-gray-700',
    headerColor: 'text-gray-700 dark:text-gray-300'
  },
  {
    id: 'doing',
    title: 'Doing',
    statuses: ['in_progress', 'review'],
    color: 'bg-blue-100 dark:bg-blue-900/30',
    headerColor: 'text-blue-700 dark:text-blue-300'
  },
  {
    id: 'done',
    title: 'Done',
    statuses: ['done'],
    color: 'bg-green-100 dark:bg-green-900/30',
    headerColor: 'text-green-700 dark:text-green-300'
  }
];

interface SimpleTaskCardProps {
  task: Task;
  index: number;
}

function SimpleTaskCard({ task, index }: SimpleTaskCardProps) {
  const { activeTimer, startTimer, stopTimer, formatElapsedTime } = useProjectManagement();
  const isTimerActive = activeTimer?.taskId === task.id;
  
  const handleTimerClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isTimerActive) {
      await stopTimer();
    } else {
      startTimer(task.id, task.title);
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`group ${snapshot.isDragging ? 'rotate-1 shadow-xl' : ''}`}
          >
            <Card 
              className={`mb-3 cursor-pointer transition-all duration-200 hover:shadow-md ${
                snapshot.isDragging ? 'shadow-xl ring-2 ring-blue-500' : ''
              } ${isOverdue ? 'border-red-300 bg-red-50 dark:bg-red-900/10' : ''}`}
            >
              <CardContent className="p-4">
                {/* ========== TASK HEADER ========== */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm leading-tight mb-1">
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                        {task.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 ml-2">
                    <Flag className={`h-3 w-3 ${
                      task.priority === 'highest' || task.priority === 'critical' ? 'text-red-500' :
                      task.priority === 'high' ? 'text-orange-500' :
                      task.priority === 'medium' ? 'text-yellow-500' :
                      'text-gray-400'
                    }`} />
                  </div>
                </div>

                {/* ========== TASK METADATA ========== */}
                <div className="space-y-2">
                  {/* ========== DUE DATE ========== */}
                  {task.dueDate && (
                    <div className="flex items-center gap-1 text-xs">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className={`${
                        isOverdue ? 'text-red-600 font-medium' : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {/* ========== ASSIGNEE (SIMPLIFIED) ========== */}
                  {task.assignedTo.length > 0 && (
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Assigned
                      </span>
                    </div>
                  )}

                  {/* ========== BOTTOM ROW ========== */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      {/* Time Spent */}
                      {task.timeSpent && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{Math.round(task.timeSpent / 60)}h</span>
                        </div>
                      )}

                      {/* Active Timer Display */}
                      {isTimerActive && (
                        <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="font-mono">
                            {formatElapsedTime(activeTimer.elapsed)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Timer Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTimerClick({} as React.MouseEvent)}
                      className={`p-1 h-6 w-6 transition-all ${
                        isTimerActive 
                          ? 'text-red-600 hover:text-red-700 hover:bg-red-50' 
                          : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                      } opacity-70 group-hover:opacity-100`}
                    >
                      {isTimerActive ? (
                        <Pause className="h-3 w-3" />
                      ) : (
                        <Play className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </Draggable>
  );
}

export default function SimpleKanbanBoard() {
  const { tasks, moveTask } = useProjectManagement();
  const { canAccess } = useUserTier();
  
  // Filter to single project and limit for simplicity
  const simpleTasks = tasks.slice(0, 12);
  
  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    
    const { draggableId, destination } = result;
    const targetColumn = SIMPLE_COLUMNS.find(col => col.id === destination.droppableId);
    
    if (targetColumn) {
      // Map simple column to task status
      const newStatus = targetColumn.statuses[0] as any; // Use first status for simplicity
      await moveTask(draggableId, newStatus);
    }
  };

  return (
    <div className="h-full">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-4 h-full">
          {SIMPLE_COLUMNS.map((column) => {
            const columnTasks = simpleTasks.filter(task => 
              column.statuses.includes(task.status)
            );

            return (
              <div key={column.id} className="flex flex-col h-full">
                {/* ========== COLUMN HEADER ========== */}
                <div className={`${column.color} rounded-lg p-3 mb-3`}>
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold ${column.headerColor}`}>
                      {column.title}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {columnTasks.length}
                    </Badge>
                  </div>
                </div>

                {/* ========== DROPPABLE AREA ========== */}
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 min-h-[400px] p-2 rounded-lg transition-all ${
                        snapshot.isDraggingOver 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 border-dashed' 
                          : 'bg-gray-50 dark:bg-gray-800/50'
                      }`}
                    >
                      {columnTasks.map((task, index) => (
                        <SimpleTaskCard
                          key={task.id}
                          task={task}
                          index={index}
                        />
                      ))}
                      {provided.placeholder}
                      
                      {/* ========== ADD TASK BUTTON ========== */}
                      {column.id === 'todo' && (
                        <Button
                          variant="ghost"
                          className="w-full mt-2 h-auto p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Task
                        </Button>
                      )}
                      
                      {/* ========== ENTERPRISE FEATURES TEASERS ========== */}
                      {!canAccess('multipleProjects') && columnTasks.length > 3 && (
                        <div className="mt-4">
                          <UpgradePrompt 
                            feature="Multiple Projects"
                            size="small"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* ========== FEATURE UPGRADE HINT ========== */}
      {!canAccess('customWorkflows') && (
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-full text-sm text-purple-700 dark:text-purple-300">
            <span>Want custom columns and advanced workflows?</span>
            <ArrowRight className="h-4 w-4" />
            <Button variant="ghost" className="h-auto p-0 text-purple-700 dark:text-purple-300 font-medium underline">
              Upgrade to Enterprise
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}