'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useProjectManagement, Task, TaskStatus } from '@/contexts/ProjectManagementContext';
import {
  Clock,
  Calendar,
  User,
  MessageSquare,
  Paperclip,
  Flag,
  CheckCircle2,
  Circle,
  AlertCircle,
  Play,
  Pause,
  MoreHorizontal,
  Plus,
  Filter,
  Search,
  Eye
} from 'lucide-react';

// ============================================================================
// KANBAN BOARD INTERFACE
// ============================================================================

interface KanbanBoardProps {
  projectId?: string;
}

// ============================================================================
// TASK STATUS CONFIGURATIONS
// ============================================================================

const statusConfig: Record<TaskStatus, {
  label: string;
  color: string;
  bgColor: string;
  icon: React.ComponentType<any>;
}> = {
  backlog: {
    label: 'Backlog',
    color: 'text-gray-600',
    bgColor: 'bg-gray-100 dark:bg-slate-800',
    icon: Circle
  },
  todo: {
    label: 'To Do',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    icon: Circle
  },
  in_progress: {
    label: 'In Progress',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    icon: Play
  },
  review: {
    label: 'In Review',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    icon: Eye
  },
  testing: {
    label: 'Testing',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    icon: AlertCircle
  },
  done: {
    label: 'Done',
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    icon: CheckCircle2
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    icon: Pause
  }
};

// ============================================================================
// PRIORITY CONFIGURATIONS
// ============================================================================

const priorityConfig = {
  lowest: { label: 'Lowest', color: 'bg-gray-100 text-gray-800', flag: 'text-gray-400' },
  low: { label: 'Low', color: 'bg-blue-100 text-blue-800', flag: 'text-blue-400' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800', flag: 'text-yellow-500' },
  high: { label: 'High', color: 'bg-orange-100 text-orange-800', flag: 'text-orange-500' },
  highest: { label: 'Highest', color: 'bg-red-100 text-red-800', flag: 'text-red-500' },
  critical: { label: 'Critical', color: 'bg-purple-100 text-purple-800', flag: 'text-purple-600' }
};

// ============================================================================
// TASK CARD COMPONENT
// ============================================================================

interface TaskCardProps {
  task: Task;
  index: number;
  teamMembers: any[];
  onClick?: () => void;
}

function TaskCard({ task, index, teamMembers, onClick }: TaskCardProps) {
  const { activeTimer, startTimer, stopTimer, formatElapsedTime } = useProjectManagement();
  const assignee = task.assignee || teamMembers.find(m => task.assignedTo.includes(m.id));
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
  const daysUntilDue = task.dueDate 
    ? Math.ceil((new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const isTimerActive = activeTimer?.taskId === task.id;

  const handleTimerClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (isTimerActive) {
      await stopTimer();
    } else {
      startTimer(task.id, task.title);
    }
  };

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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ scale: 1.02 }}
            className={`group ${snapshot.isDragging ? 'rotate-3 shadow-xl' : ''}`}
          >
            <div onClick={onClick} className="cursor-pointer">
              <Card 
                className={`mb-3 transition-all duration-200 hover:shadow-md ${
                  snapshot.isDragging 
                    ? 'shadow-xl ring-2 ring-blue-500' 
                    : 'hover:shadow-lg'
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
                    <Flag className={`h-3 w-3 ${priorityConfig[task.priority].flag}`} />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                    >
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* ========== TASK METADATA ========== */}
                <div className="space-y-2">
                  {/* ========== DUE DATE ========== */}
                  {task.dueDate && (
                    <div className="flex items-center gap-1 text-xs">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className={`${
                        isOverdue 
                          ? 'text-red-600 font-medium' 
                          : daysUntilDue !== null && daysUntilDue <= 3
                          ? 'text-orange-600 font-medium'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {isOverdue 
                          ? `${Math.abs(daysUntilDue || 0)} days overdue`
                          : daysUntilDue === 0 
                          ? 'Due today'
                          : daysUntilDue === 1
                          ? 'Due tomorrow'
                          : `${daysUntilDue} days left`
                        }
                      </span>
                    </div>
                  )}

                  {/* ========== ASSIGNEE ========== */}
                  {assignee && (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={assignee.avatar} />
                        <AvatarFallback className="text-xs">
                          {assignee.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {assignee.name}
                      </span>
                    </div>
                  )}

                  {/* ========== TAGS ========== */}
                  {task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {task.tags.slice(0, 3).map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs px-1 py-0">
                          {tag}
                        </Badge>
                      ))}
                      {task.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          +{task.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* ========== BOTTOM METRICS ========== */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      {/* ========== COMMENTS ========== */}
                      {task.comments.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MessageSquare className="h-3 w-3" />
                          <span>{task.comments.length}</span>
                        </div>
                      )}

                      {/* ========== ATTACHMENTS ========== */}
                      {task.attachments.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Paperclip className="h-3 w-3" />
                          <span>{task.attachments.length}</span>
                        </div>
                      )}

                      {/* ========== SUBTASKS ========== */}
                      {task.subtasks.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>{task.subtasks.length}</span>
                        </div>
                      )}
                    </div>

                    {/* ========== TIME TRACKING & TIMER ========== */}
                    <div className="flex items-center gap-2">
                      {/* Timer Display */}
                      {isTimerActive && (
                        <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          <span className="font-mono">
                            {formatElapsedTime(activeTimer.elapsed)}
                          </span>
                        </div>
                      )}
                      
                      {/* Time Spent */}
                      {task.timeSpent && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>{Math.round(task.timeSpent / 60)}h</span>
                        </div>
                      )}

                      {/* Estimated Hours */}
                      {task.estimatedHours && (
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <span>({task.estimatedHours}h est.)</span>
                        </div>
                      )}

                      {/* Timer Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleTimerClick}
                        className={`p-1 h-6 w-6 transition-all ${
                          isTimerActive 
                            ? 'text-red-600 hover:text-red-700 hover:bg-red-50' 
                            : 'text-green-600 hover:text-green-700 hover:bg-green-50'
                        } opacity-0 group-hover:opacity-100`}
                      >
                        {isTimerActive ? (
                          <Pause className="h-3 w-3" />
                        ) : (
                          <Play className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          </motion.div>
        </div>
      )}
    </Draggable>
  );
}

// ============================================================================
// KANBAN COLUMN COMPONENT
// ============================================================================

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  teamMembers: any[];
  onTaskClick: (task: Task) => void;
  onCreateTask: (status: TaskStatus) => void;
}

function KanbanColumn({ status, tasks, teamMembers, onTaskClick, onCreateTask }: KanbanColumnProps) {
  const config = statusConfig[status];
  const IconComponent = config.icon;

  return (
    <div className="flex-shrink-0 w-80">
      <div className="mb-4">
        <div className={`${config.bgColor} rounded-lg p-3 mb-3`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconComponent className={`h-4 w-4 ${config.color}`} />
              <h3 className={`font-medium ${config.color}`}>
                {config.label}
              </h3>
              <Badge variant="secondary" className="text-xs ml-1">
                {tasks.length}
              </Badge>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCreateTask(status)}
              className="opacity-60 hover:opacity-100 transition-opacity p-1 h-auto"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-[500px] p-2 rounded-lg transition-colors ${
              snapshot.isDraggingOver 
                ? 'bg-blue-50 dark:bg-blue-900/10 border-2 border-dashed border-blue-300'
                : 'border-2 border-transparent'
            }`}
          >
            <AnimatePresence>
              {tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  teamMembers={teamMembers}
                  onClick={() => onTaskClick(task)}
                />
              ))}
            </AnimatePresence>
            {provided.placeholder}

            {tasks.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-gray-400 dark:text-gray-600"
              >
                <Circle className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">No tasks yet</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCreateTask(status)}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add task
                </Button>
              </motion.div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}

// ============================================================================
// MAIN KANBAN BOARD COMPONENT
// ============================================================================

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const { 
    tasks, 
    teamMembers, 
    currentProject, 
    moveTask,
    createTask
  } = useProjectManagement();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string[]>([]);
  const [selectedAssignee, setSelectedAssignee] = useState<string[]>([]);

  // ========== FILTER TASKS ==========
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filter by project if specified
    if (projectId) {
      filtered = filtered.filter(task => task.projectId === projectId);
    } else if (currentProject) {
      filtered = filtered.filter(task => task.projectId === currentProject.id);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by priority
    if (selectedPriority.length > 0) {
      filtered = filtered.filter(task => selectedPriority.includes(task.priority));
    }

    // Filter by assignee
    if (selectedAssignee.length > 0) {
      filtered = filtered.filter(task => 
        task.assignedTo.some(id => selectedAssignee.includes(id)) ||
        (task.assignee && selectedAssignee.includes(task.assignee.id))
      );
    }

    return filtered;
  }, [tasks, projectId, currentProject, searchQuery, selectedPriority, selectedAssignee]);

  // ========== GROUP TASKS BY STATUS ==========
  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      backlog: [],
      todo: [],
      in_progress: [],
      review: [],
      testing: [],
      done: [],
      cancelled: []
    };

    filteredTasks.forEach(task => {
      if (grouped[task.status]) {
        grouped[task.status].push(task);
      }
    });

    // Sort tasks within each column by position/creation date
    Object.keys(grouped).forEach(status => {
      grouped[status as TaskStatus].sort((a, b) => {
        if (a.position && b.position) {
          return a.position - b.position;
        }
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });
    });

    return grouped;
  }, [filteredTasks]);

  // ========== DRAG AND DROP HANDLER ==========
  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // No destination means dropped outside droppable area
    if (!destination) return;

    // No change in position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    try {
      await moveTask(
        draggableId,
        destination.droppableId as TaskStatus,
        destination.index
      );
    } catch (error) {
      console.error('Error moving task:', error);
    }
  };

  // ========== TASK CLICK HANDLER ==========
  const handleTaskClick = (task: Task) => {
    // TODO: Open task detail modal
    console.log('Task clicked:', task);
  };

  // ========== CREATE TASK HANDLER ==========
  const handleCreateTask = async (status: TaskStatus) => {
    if (!currentProject && !projectId) return;

    try {
      await createTask({
        title: 'New Task',
        description: '',
        status,
        priority: 'medium',
        projectId: projectId || currentProject!.id,
        assignedTo: [],
        dependencies: [],
        subtasks: [],
        tags: [],
        attachments: [],
        comments: [],
        customFields: {},
        position: tasksByStatus[status].length,
        createdBy: 'current_user' // TODO: Get actual user ID
      });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div className="h-full">
      {/* ========== KANBAN HEADER ========== */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {currentProject ? `${currentProject.name} - Kanban Board` : 'All Tasks - Kanban View'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {filteredTasks.length} tasks across {Object.keys(tasksByStatus).filter(status => tasksByStatus[status as TaskStatus].length > 0).length} columns
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // TODO: Open filters modal
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button
              onClick={() => handleCreateTask('todo')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {/* ========== SEARCH BAR ========== */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* ========== KANBAN BOARD ========== */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="overflow-x-auto">
          <div className="flex gap-6 pb-6 min-w-max">
            {(Object.keys(statusConfig) as TaskStatus[]).map(status => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={tasksByStatus[status]}
                teamMembers={teamMembers}
                onTaskClick={handleTaskClick}
                onCreateTask={handleCreateTask}
              />
            ))}
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}