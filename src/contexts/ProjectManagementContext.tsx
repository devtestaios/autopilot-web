'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// ============================================================================
// PROJECT MANAGEMENT TYPES
// ============================================================================

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: Priority;
  startDate: Date;
  endDate: Date;
  progress: number;
  budget?: number;
  spent?: number;
  owner: TeamMember;
  team: TeamMember[];
  tags: string[];
  color: string;
  visibility: 'private' | 'team' | 'organization';
  template?: string;
  customFields: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: Priority;
  assignee?: TeamMember;
  assignedTo: string[];
  dependencies: string[];
  subtasks: string[];
  parentTask?: string;
  startDate?: Date;
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  completedDate?: Date;
  tags: string[];
  attachments: Attachment[];
  comments: Comment[];
  customFields: Record<string, any>;
  position: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  department?: string;
  workload: number; // percentage
  hourlyRate?: number;
  skills: string[];
  isActive: boolean;
}

export interface Milestone {
  id: string;
  projectId: string;
  name: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'completed' | 'overdue';
  tasks: string[];
  completedDate?: Date;
  createdAt: Date;
}

export interface TimeEntry {
  id: string;
  taskId: string;
  projectId: string;
  userId: string;
  date: Date;
  hours: number;
  description: string;
  billable: boolean;
  rate?: number;
  createdAt: Date;
}

export interface Comment {
  id: string;
  taskId?: string;
  projectId?: string;
  userId: string;
  user: TeamMember;
  content: string;
  mentions: string[];
  attachments: Attachment[];
  parentId?: string;
  reactions: Reaction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface Reaction {
  emoji: string;
  users: string[];
  count: number;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  structure: {
    phases: ProjectPhase[];
    defaultTasks: Partial<Task>[];
    milestones: Partial<Milestone>[];
  };
  estimatedDuration: number; // days
  complexity: 'simple' | 'moderate' | 'complex';
}

export interface ProjectPhase {
  id: string;
  name: string;
  description: string;
  order: number;
  color: string;
  tasks: string[];
}

export interface WorkflowRule {
  id: string;
  name: string;
  trigger: WorkflowTrigger;
  conditions: WorkflowCondition[];
  actions: WorkflowAction[];
  isActive: boolean;
}

export interface WorkflowTrigger {
  type: 'task_status_change' | 'task_assigned' | 'due_date_approaching' | 'project_status_change';
  config: Record<string, any>;
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
}

export interface WorkflowAction {
  type: 'notify_user' | 'change_status' | 'assign_task' | 'create_task' | 'send_email';
  config: Record<string, any>;
}

export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'testing' | 'done' | 'cancelled';
export type Priority = 'lowest' | 'low' | 'medium' | 'high' | 'highest' | 'critical';
export type ViewType = 'kanban' | 'list' | 'calendar' | 'gantt' | 'timeline' | 'dashboard' | 'analytics';

// ============================================================================
// PROJECT MANAGEMENT CONTEXT INTERFACE
// ============================================================================

interface ProjectManagementContextValue {
  // ========== CORE STATE ==========
  currentProject: Project | null;
  projects: Project[];
  tasks: Task[];
  teamMembers: TeamMember[];
  milestones: Milestone[];
  timeEntries: TimeEntry[];
  
  // ========== VIEW STATE ==========
  currentView: ViewType;
  selectedTasks: string[];
  filters: ProjectFilter;
  sorting: ProjectSort;
  grouping: ProjectGrouping;
  
  // ========== PROJECT MANAGEMENT ==========
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Project>;
  updateProject: (projectId: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  switchProject: (projectId: string) => void;
  duplicateProject: (projectId: string) => Promise<Project>;
  
  // ========== TASK MANAGEMENT ==========
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Task>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  moveTask: (taskId: string, status: TaskStatus, position?: number) => Promise<void>;
  bulkUpdateTasks: (taskIds: string[], updates: Partial<Task>) => Promise<void>;
  
  // ========== TEAM MANAGEMENT ==========
  addTeamMember: (member: Omit<TeamMember, 'id'>) => Promise<TeamMember>;
  updateTeamMember: (memberId: string, updates: Partial<TeamMember>) => Promise<void>;
  removeTeamMember: (memberId: string) => Promise<void>;
  getTeamWorkload: () => Record<string, number>;
  
  // ========== TIME TRACKING ==========
  startTimer: (taskId: string, description?: string) => void;
  stopTimer: () => void;
  addTimeEntry: (entry: Omit<TimeEntry, 'id' | 'createdAt'>) => Promise<TimeEntry>;
  getTimeReport: (projectId?: string, startDate?: Date, endDate?: Date) => TimeReport;
  
  // ========== MILESTONES ==========
  createMilestone: (milestone: Omit<Milestone, 'id' | 'createdAt'>) => Promise<Milestone>;
  updateMilestone: (milestoneId: string, updates: Partial<Milestone>) => Promise<void>;
  deleteMilestone: (milestoneId: string) => Promise<void>;
  
  // ========== COMMENTS & COLLABORATION ==========
  addComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Comment>;
  updateComment: (commentId: string, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  addReaction: (commentId: string, emoji: string, userId: string) => Promise<void>;
  
  // ========== VIEW MANAGEMENT ==========
  setCurrentView: (view: ViewType) => void;
  updateFilters: (filters: Partial<ProjectFilter>) => void;
  updateSorting: (sorting: ProjectSort) => void;
  updateGrouping: (grouping: ProjectGrouping) => void;
  saveViewPreset: (name: string, config: ViewConfig) => void;
  
  // ========== TEMPLATES & WORKFLOWS ==========
  getProjectTemplates: () => ProjectTemplate[];
  createFromTemplate: (templateId: string, projectData: Partial<Project>) => Promise<Project>;
  saveAsTemplate: (projectId: string, templateData: Omit<ProjectTemplate, 'id'>) => Promise<ProjectTemplate>;
  
  // ========== ANALYTICS & REPORTING ==========
  getProjectAnalytics: (projectId: string) => ProjectAnalytics;
  getTeamAnalytics: () => TeamAnalytics;
  getProductivityReport: (startDate: Date, endDate: Date) => ProductivityReport;
  getBurndownData: (projectId: string) => BurndownData;
  getVelocityReport: (projectId: string) => VelocityReport;
  
  // ========== NOTIFICATIONS ==========
  notifications: ProjectNotification[];
  markNotificationRead: (notificationId: string) => void;
  getUpcomingDeadlines: () => UpcomingDeadline[];
  getOverdueTasks: () => Task[];
}

// ============================================================================
// SUPPORTING INTERFACES
// ============================================================================

interface ProjectFilter {
  status: ProjectStatus[];
  priority: Priority[];
  assignee: string[];
  tags: string[];
  dateRange: { start?: Date; end?: Date };
  search: string;
}

interface ProjectSort {
  field: string;
  direction: 'asc' | 'desc';
}

interface ProjectGrouping {
  field: 'status' | 'priority' | 'assignee' | 'project' | 'none';
}

interface ViewConfig {
  type: ViewType;
  filters: ProjectFilter;
  sorting: ProjectSort;
  grouping: ProjectGrouping;
  columns: string[];
}

interface ProjectAnalytics {
  completion: number;
  tasksCompleted: number;
  totalTasks: number;
  hoursSpent: number;
  budgetUsed: number;
  teamEfficiency: number;
  milestoneProgress: number;
  riskFactors: string[];
  bottlenecks: string[];
}

interface TeamAnalytics {
  totalMembers: number;
  activeMembers: number;
  averageWorkload: number;
  topPerformers: string[];
  capacityUtilization: Record<string, number>;
  skillDistribution: Record<string, number>;
}

interface ProductivityReport {
  tasksCompleted: number;
  hoursWorked: number;
  averageTaskTime: number;
  velocityTrend: number[];
  burndownProgress: number;
  effortVariance: number;
}

interface BurndownData {
  ideal: number[];
  actual: number[];
  dates: string[];
  remaining: number;
  onTrack: boolean;
}

interface VelocityReport {
  sprintVelocities: number[];
  averageVelocity: number;
  trend: 'up' | 'down' | 'stable';
  predictedCompletion: Date;
}

interface TimeReport {
  totalHours: number;
  billableHours: number;
  byProject: Record<string, number>;
  byUser: Record<string, number>;
  byDate: Record<string, number>;
  efficiency: number;
}

interface ProjectNotification {
  id: string;
  type: 'deadline' | 'assignment' | 'mention' | 'status_change' | 'milestone';
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: Date;
}

interface UpcomingDeadline {
  taskId: string;
  projectId: string;
  title: string;
  dueDate: Date;
  priority: Priority;
  assignee?: TeamMember;
  daysRemaining: number;
}

// ============================================================================
// PROJECT TEMPLATES
// ============================================================================

const projectTemplates: ProjectTemplate[] = [
  {
    id: 'software_development',
    name: 'Software Development',
    description: 'Complete software development lifecycle with sprints and releases',
    category: 'Technology',
    icon: '💻',
    structure: {
      phases: [
        { id: 'planning', name: 'Planning', description: 'Project planning and requirements', order: 1, color: '#3B82F6', tasks: [] },
        { id: 'development', name: 'Development', description: 'Feature development and implementation', order: 2, color: '#10B981', tasks: [] },
        { id: 'testing', name: 'Testing', description: 'Quality assurance and testing', order: 3, color: '#F59E0B', tasks: [] },
        { id: 'deployment', name: 'Deployment', description: 'Production deployment and release', order: 4, color: '#8B5CF6', tasks: [] }
      ],
      defaultTasks: [],
      milestones: []
    },
    estimatedDuration: 90,
    complexity: 'complex'
  },
  {
    id: 'marketing_campaign',
    name: 'Marketing Campaign',
    description: 'End-to-end marketing campaign planning and execution',
    category: 'Marketing',
    icon: '📊',
    structure: {
      phases: [
        { id: 'strategy', name: 'Strategy', description: 'Campaign strategy and planning', order: 1, color: '#EC4899', tasks: [] },
        { id: 'creative', name: 'Creative', description: 'Content creation and design', order: 2, color: '#8B5CF6', tasks: [] },
        { id: 'execution', name: 'Execution', description: 'Campaign launch and management', order: 3, color: '#10B981', tasks: [] },
        { id: 'analysis', name: 'Analysis', description: 'Performance analysis and optimization', order: 4, color: '#F59E0B', tasks: [] }
      ],
      defaultTasks: [],
      milestones: []
    },
    estimatedDuration: 45,
    complexity: 'moderate'
  },
  {
    id: 'product_launch',
    name: 'Product Launch',
    description: 'Comprehensive product launch with go-to-market strategy',
    category: 'Product',
    icon: '🚀',
    structure: {
      phases: [
        { id: 'research', name: 'Market Research', description: 'Market analysis and competitor research', order: 1, color: '#3B82F6', tasks: [] },
        { id: 'development', name: 'Product Development', description: 'Product development and testing', order: 2, color: '#10B981', tasks: [] },
        { id: 'marketing', name: 'Marketing Preparation', description: 'Marketing materials and strategy', order: 3, color: '#EC4899', tasks: [] },
        { id: 'launch', name: 'Launch', description: 'Product launch and post-launch support', order: 4, color: '#F59E0B', tasks: [] }
      ],
      defaultTasks: [],
      milestones: []
    },
    estimatedDuration: 120,
    complexity: 'complex'
  },
  {
    id: 'event_planning',
    name: 'Event Planning',
    description: 'Complete event planning and management workflow',
    category: 'Operations',
    icon: '🎉',
    structure: {
      phases: [
        { id: 'planning', name: 'Event Planning', description: 'Initial planning and requirements', order: 1, color: '#8B5CF6', tasks: [] },
        { id: 'logistics', name: 'Logistics', description: 'Venue, catering, and logistics coordination', order: 2, color: '#10B981', tasks: [] },
        { id: 'promotion', name: 'Promotion', description: 'Marketing and attendee management', order: 3, color: '#EC4899', tasks: [] },
        { id: 'execution', name: 'Event Execution', description: 'Day-of event management', order: 4, color: '#F59E0B', tasks: [] }
      ],
      defaultTasks: [],
      milestones: []
    },
    estimatedDuration: 60,
    complexity: 'moderate'
  },
  {
    id: 'simple_project',
    name: 'Simple Project',
    description: 'Basic project template for small teams and simple workflows',
    category: 'General',
    icon: '📋',
    structure: {
      phases: [
        { id: 'todo', name: 'To Do', description: 'Tasks to be started', order: 1, color: '#6B7280', tasks: [] },
        { id: 'in_progress', name: 'In Progress', description: 'Tasks currently being worked on', order: 2, color: '#3B82F6', tasks: [] },
        { id: 'review', name: 'Review', description: 'Tasks under review', order: 3, color: '#F59E0B', tasks: [] },
        { id: 'done', name: 'Done', description: 'Completed tasks', order: 4, color: '#10B981', tasks: [] }
      ],
      defaultTasks: [],
      milestones: []
    },
    estimatedDuration: 30,
    complexity: 'simple'
  }
];

// ============================================================================
// PROJECT MANAGEMENT CONTEXT
// ============================================================================

const ProjectManagementContext = createContext<ProjectManagementContextValue | undefined>(undefined);

// ============================================================================
// PROJECT MANAGEMENT PROVIDER
// ============================================================================

export function ProjectManagementProvider({ children }: { children: React.ReactNode }) {
  // ========== CORE STATE ==========
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  
  // ========== VIEW STATE ==========
  const [currentView, setCurrentView] = useState<ViewType>('kanban');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [filters, setFilters] = useState<ProjectFilter>({
    status: [],
    priority: [],
    assignee: [],
    tags: [],
    dateRange: {},
    search: ''
  });
  const [sorting, setSorting] = useState<ProjectSort>({
    field: 'createdAt',
    direction: 'desc'
  });
  const [grouping, setGrouping] = useState<ProjectGrouping>({
    field: 'status'
  });
  const [notifications, setNotifications] = useState<ProjectNotification[]>([]);

  // ========== PROJECT MANAGEMENT ==========
  const createProject = useCallback(async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProject: Project = {
      ...projectData,
      id: `project_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setProjects(prev => [...prev, newProject]);
    setCurrentProject(newProject);

    return newProject;
  }, []);

  const updateProject = useCallback(async (projectId: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, ...updates, updatedAt: new Date() }
        : project
    ));

    if (currentProject?.id === projectId) {
      setCurrentProject(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
    }
  }, [currentProject]);

  const deleteProject = useCallback(async (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    setTasks(prev => prev.filter(t => t.projectId !== projectId));
    setMilestones(prev => prev.filter(m => m.projectId !== projectId));
    
    if (currentProject?.id === projectId) {
      setCurrentProject(null);
    }
  }, [currentProject]);

  const switchProject = useCallback((projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProject(project);
    }
  }, [projects]);

  const duplicateProject = useCallback(async (projectId: string) => {
    const originalProject = projects.find(p => p.id === projectId);
    if (!originalProject) throw new Error('Project not found');

    const duplicatedProject: Project = {
      ...originalProject,
      id: `project_${Date.now()}`,
      name: `${originalProject.name} (Copy)`,
      status: 'planning',
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setProjects(prev => [...prev, duplicatedProject]);
    return duplicatedProject;
  }, [projects]);

  // ========== TASK MANAGEMENT ==========
  const createTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task_${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, []);

  const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ));
  }, []);

  const deleteTask = useCallback(async (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  }, []);

  const moveTask = useCallback(async (taskId: string, status: TaskStatus, position?: number) => {
    await updateTask(taskId, { status, position });
  }, [updateTask]);

  const bulkUpdateTasks = useCallback(async (taskIds: string[], updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      taskIds.includes(task.id)
        ? { ...task, ...updates, updatedAt: new Date() }
        : task
    ));
  }, []);

  // ========== TEAM MANAGEMENT ==========
  const addTeamMember = useCallback(async (memberData: Omit<TeamMember, 'id'>) => {
    const newMember: TeamMember = {
      ...memberData,
      id: `member_${Date.now()}`
    };

    setTeamMembers(prev => [...prev, newMember]);
    return newMember;
  }, []);

  const updateTeamMember = useCallback(async (memberId: string, updates: Partial<TeamMember>) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === memberId 
        ? { ...member, ...updates }
        : member
    ));
  }, []);

  const removeTeamMember = useCallback(async (memberId: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== memberId));
  }, []);

  const getTeamWorkload = useCallback(() => {
    return teamMembers.reduce((acc, member) => {
      acc[member.id] = member.workload;
      return acc;
    }, {} as Record<string, number>);
  }, [teamMembers]);

  // ========== TIME TRACKING ==========
  const startTimer = useCallback((taskId: string, description?: string) => {
    // TODO: Implement timer functionality
    console.log('Starting timer for task:', taskId, description);
  }, []);

  const stopTimer = useCallback(() => {
    // TODO: Implement timer functionality
    console.log('Stopping timer');
  }, []);

  const addTimeEntry = useCallback(async (entryData: Omit<TimeEntry, 'id' | 'createdAt'>) => {
    const newEntry: TimeEntry = {
      ...entryData,
      id: `time_${Date.now()}`,
      createdAt: new Date()
    };

    setTimeEntries(prev => [...prev, newEntry]);
    return newEntry;
  }, []);

  const getTimeReport = useCallback((projectId?: string, startDate?: Date, endDate?: Date): TimeReport => {
    let filteredEntries = timeEntries;

    if (projectId) {
      filteredEntries = filteredEntries.filter(entry => entry.projectId === projectId);
    }

    if (startDate) {
      filteredEntries = filteredEntries.filter(entry => entry.date >= startDate);
    }

    if (endDate) {
      filteredEntries = filteredEntries.filter(entry => entry.date <= endDate);
    }

    const totalHours = filteredEntries.reduce((sum, entry) => sum + entry.hours, 0);
    const billableHours = filteredEntries.filter(entry => entry.billable).reduce((sum, entry) => sum + entry.hours, 0);

    return {
      totalHours,
      billableHours,
      byProject: {},
      byUser: {},
      byDate: {},
      efficiency: totalHours > 0 ? (billableHours / totalHours) * 100 : 0
    };
  }, [timeEntries]);

  // ========== ANALYTICS ==========
  const getProjectAnalytics = useCallback((projectId: string): ProjectAnalytics => {
    const projectTasks = tasks.filter(t => t.projectId === projectId);
    const completedTasks = projectTasks.filter(t => t.status === 'done');
    const totalTasks = projectTasks.length;
    const completion = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;

    return {
      completion,
      tasksCompleted: completedTasks.length,
      totalTasks,
      hoursSpent: 0, // TODO: Calculate from time entries
      budgetUsed: 0, // TODO: Calculate from project budget
      teamEfficiency: 85, // TODO: Calculate actual efficiency
      milestoneProgress: 0, // TODO: Calculate milestone progress
      riskFactors: [],
      bottlenecks: []
    };
  }, [tasks]);

  const getTeamAnalytics = useCallback((): TeamAnalytics => {
    const activeMembers = teamMembers.filter(m => m.isActive);
    const totalWorkload = activeMembers.reduce((sum, m) => sum + m.workload, 0);
    const averageWorkload = activeMembers.length > 0 ? totalWorkload / activeMembers.length : 0;

    return {
      totalMembers: teamMembers.length,
      activeMembers: activeMembers.length,
      averageWorkload,
      topPerformers: [],
      capacityUtilization: {},
      skillDistribution: {}
    };
  }, [teamMembers]);

  // ========== VIEW MANAGEMENT ==========
  const updateFilters = useCallback((newFilters: Partial<ProjectFilter>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const updateSorting = useCallback((newSorting: ProjectSort) => {
    setSorting(newSorting);
  }, []);

  const updateGrouping = useCallback((newGrouping: ProjectGrouping) => {
    setGrouping(newGrouping);
  }, []);

  // ========== TEMPLATE FUNCTIONS ==========
  const getProjectTemplates = useCallback(() => {
    return projectTemplates;
  }, []);

  const createFromTemplate = useCallback(async (templateId: string, projectData: Partial<Project>) => {
    const template = projectTemplates.find(t => t.id === templateId);
    if (!template) throw new Error('Template not found');

    // Create project with template structure
    const newProject = await createProject({
      name: projectData.name || template.name,
      description: projectData.description || template.description,
      status: 'planning',
      priority: 'medium',
      startDate: projectData.startDate || new Date(),
      endDate: projectData.endDate || new Date(Date.now() + template.estimatedDuration * 24 * 60 * 60 * 1000),
      progress: 0,
      owner: projectData.owner || teamMembers[0],
      team: projectData.team || [],
      tags: projectData.tags || [],
      color: projectData.color || '#3B82F6',
      visibility: projectData.visibility || 'team',
      template: templateId,
      customFields: projectData.customFields || {}
    });

    return newProject;
  }, [createProject, teamMembers]);

  // Mock some initial data
  useEffect(() => {
    // Add some sample team members
    setTeamMembers([
      {
        id: 'user_1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Project Manager',
        workload: 75,
        skills: ['Project Management', 'Planning', 'Leadership'],
        isActive: true
      },
      {
        id: 'user_2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'Developer',
        workload: 80,
        skills: ['React', 'TypeScript', 'Node.js'],
        isActive: true
      },
      {
        id: 'user_3',
        name: 'Mike Johnson',
        email: 'mike@example.com',
        role: 'Designer',
        workload: 60,
        skills: ['UI/UX Design', 'Figma', 'Prototyping'],
        isActive: true
      }
    ]);
  }, []);

  // ========== CONTEXT VALUE ==========
  const contextValue: ProjectManagementContextValue = {
    // Core state
    currentProject,
    projects,
    tasks,
    teamMembers,
    milestones,
    timeEntries,
    
    // View state
    currentView,
    selectedTasks,
    filters,
    sorting,
    grouping,
    
    // Project management
    createProject,
    updateProject,
    deleteProject,
    switchProject,
    duplicateProject,
    
    // Task management
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    bulkUpdateTasks,
    
    // Team management
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
    getTeamWorkload,
    
    // Time tracking
    startTimer,
    stopTimer,
    addTimeEntry,
    getTimeReport,
    
    // Milestones
    createMilestone: async () => ({} as Milestone), // TODO: Implement
    updateMilestone: async () => {}, // TODO: Implement
    deleteMilestone: async () => {}, // TODO: Implement
    
    // Comments
    addComment: async () => ({} as Comment), // TODO: Implement
    updateComment: async () => {}, // TODO: Implement
    deleteComment: async () => {}, // TODO: Implement
    addReaction: async () => {}, // TODO: Implement
    
    // View management
    setCurrentView,
    updateFilters,
    updateSorting,
    updateGrouping,
    saveViewPreset: () => {}, // TODO: Implement
    
    // Templates
    getProjectTemplates,
    createFromTemplate,
    saveAsTemplate: async () => ({} as ProjectTemplate), // TODO: Implement
    
    // Analytics
    getProjectAnalytics,
    getTeamAnalytics,
    getProductivityReport: () => ({} as ProductivityReport), // TODO: Implement
    getBurndownData: () => ({} as BurndownData), // TODO: Implement
    getVelocityReport: () => ({} as VelocityReport), // TODO: Implement
    
    // Notifications
    notifications,
    markNotificationRead: () => {}, // TODO: Implement
    getUpcomingDeadlines: () => [], // TODO: Implement
    getOverdueTasks: () => [] // TODO: Implement
  };

  return (
    <ProjectManagementContext.Provider value={contextValue}>
      {children}
    </ProjectManagementContext.Provider>
  );
}

// ============================================================================
// CUSTOM HOOK
// ============================================================================

export function useProjectManagement() {
  const context = useContext(ProjectManagementContext);
  if (context === undefined) {
    throw new Error('useProjectManagement must be used within a ProjectManagementProvider');
  }
  return context;
}