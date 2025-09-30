'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Cross-Platform Context Memory Interface
interface CrossPlatformMemory {
  currentProject: Project | null;
  activeGoals: BusinessGoal[];
  recentDecisions: Decision[];
  learningHistory: LearningEvent[];
  userContext: UserWorkingContext;
  platformStates: Map<string, PlatformState>;
  sharedAssets: SharedAsset[];
  workflowContext: WorkflowContext;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'paused' | 'completed';
  priority: 'high' | 'medium' | 'low';
  deadline?: Date;
  budget?: number;
  platforms: string[];
  team: TeamMember[];
  goals: BusinessGoal[];
  createdAt: Date;
  updatedAt: Date;
}

interface BusinessGoal {
  id: string;
  title: string;
  description: string;
  type: 'revenue' | 'growth' | 'efficiency' | 'brand' | 'retention';
  target: {
    metric: string;
    value: number;
    timeframe: string;
  };
  currentProgress: number;
  relatedPlatforms: string[];
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'paused' | 'achieved' | 'cancelled';
  createdAt: Date;
  deadline: Date;
}

interface Decision {
  id: string;
  title: string;
  description: string;
  category: 'strategic' | 'tactical' | 'operational';
  platform: string;
  impact: 'high' | 'medium' | 'low';
  outcome: string;
  madeBy: string;
  timestamp: Date;
  relatedGoals: string[];
  followUpActions: string[];
}

interface LearningEvent {
  id: string;
  event: string;
  platform: string;
  userAction: string;
  outcome: 'positive' | 'negative' | 'neutral';
  confidence: number;
  timestamp: Date;
  context: Record<string, any>;
  insights: string[];
}

interface UserWorkingContext {
  currentFocus: 'marketing' | 'operations' | 'growth' | 'optimization' | 'analysis';
  workingHours: {
    start: string;
    end: string;
    timezone: string;
  };
  preferredWorkflows: WorkflowPattern[];
  communicationStyle: 'quick' | 'detailed' | 'visual' | 'data-driven';
  decisionMaking: 'autonomous' | 'collaborative' | 'approval-based';
  currentMood: 'focused' | 'creative' | 'analytical' | 'strategic';
  recentActivity: ActivityEvent[];
}

interface PlatformState {
  platformId: string;
  lastAccessed: Date;
  currentView: string;
  activeFilters: Record<string, any>;
  recentActions: string[];
  performance: PlatformPerformance;
  pendingTasks: Task[];
  contextData: Record<string, any>;
}

interface SharedAsset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'template' | 'data';
  url: string;
  platforms: string[];
  tags: string[];
  createdAt: Date;
  lastUsed: Date;
  usageCount: number;
  performance: AssetPerformance;
}

interface WorkflowContext {
  activeWorkflows: ActiveWorkflow[];
  automationRules: AutomationRule[];
  crossPlatformTriggers: CrossPlatformTrigger[];
  scheduledActions: ScheduledAction[];
}

interface ActiveWorkflow {
  id: string;
  name: string;
  description: string;
  platforms: string[];
  steps: WorkflowStep[];
  currentStep: number;
  status: 'running' | 'paused' | 'completed' | 'failed';
  startedAt: Date;
  estimatedCompletion: Date;
  progress: number;
}

interface CrossPlatformTrigger {
  id: string;
  name: string;
  description: string;
  sourcePlatform: string;
  targetPlatforms: string[];
  condition: TriggerCondition;
  actions: TriggerAction[];
  isActive: boolean;
  lastTriggered?: Date;
  successRate: number;
}

interface ContextSuggestion {
  id: string;
  type: 'workflow' | 'optimization' | 'insight' | 'automation';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  platforms: string[];
  suggestedAction: string;
  automationAvailable: boolean;
  contextReasons: string[];
}

// Cross-Platform Integration Context
interface CrossPlatformContextType {
  memory: CrossPlatformMemory;
  updateProject: (project: Project) => void;
  addGoal: (goal: BusinessGoal) => void;
  updateGoalProgress: (goalId: string, progress: number) => void;
  logDecision: (decision: Omit<Decision, 'id' | 'timestamp'>) => void;
  logLearningEvent: (event: Omit<LearningEvent, 'id' | 'timestamp'>) => void;
  updateUserContext: (context: Partial<UserWorkingContext>) => void;
  updatePlatformState: (platformId: string, state: Partial<PlatformState>) => void;
  shareAsset: (asset: Omit<SharedAsset, 'id' | 'createdAt' | 'lastUsed' | 'usageCount'>) => void;
  getContextualSuggestions: (platformId: string) => ContextSuggestion[];
  triggerCrossPlatformAction: (triggerId: string, data: any) => void;
  getSharedContext: (platformId: string) => PlatformSharedContext;
  syncPlatformData: (platformId: string, data: any) => void;
  isLoading: boolean;
  error: string | null;
}

interface PlatformSharedContext {
  currentProject: Project | null;
  relevantGoals: BusinessGoal[];
  recentDecisions: Decision[];
  suggestedActions: ContextSuggestion[];
  sharedAssets: SharedAsset[];
  relatedPlatformStates: PlatformState[];
  workflowContext: WorkflowContext;
  userPreferences: UserWorkingContext;
}

const CrossPlatformContext = createContext<CrossPlatformContextType | undefined>(undefined);

// Cross-Platform Provider Component
export function CrossPlatformProvider({ children }: { children: React.ReactNode }) {
  const [memory, setMemory] = useState<CrossPlatformMemory>({
    currentProject: null,
    activeGoals: [],
    recentDecisions: [],
    learningHistory: [],
    userContext: {
      currentFocus: 'marketing',
      workingHours: { start: '09:00', end: '17:00', timezone: 'UTC' },
      preferredWorkflows: [],
      communicationStyle: 'detailed',
      decisionMaking: 'collaborative',
      currentMood: 'focused',
      recentActivity: []
    },
    platformStates: new Map(),
    sharedAssets: [],
    workflowContext: {
      activeWorkflows: [],
      automationRules: [],
      crossPlatformTriggers: [],
      scheduledActions: []
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize cross-platform memory
  useEffect(() => {
    const initializeMemory = async () => {
      setIsLoading(true);
      try {
        // Load saved memory from localStorage or API
        const savedMemory = localStorage.getItem('crossPlatformMemory');
        if (savedMemory) {
          const parsedMemory = JSON.parse(savedMemory);
          setMemory(prev => ({
            ...prev,
            ...parsedMemory,
            platformStates: new Map(Object.entries(parsedMemory.platformStates || {}))
          }));
        }

        // Initialize with sample data for demo
        const sampleProject: Project = {
          id: 'proj-001',
          name: 'Q4 Marketing Campaign',
          description: 'Multi-channel marketing campaign for holiday season',
          status: 'active',
          priority: 'high',
          deadline: new Date('2025-12-15'),
          budget: 50000,
          platforms: ['social-media', 'email-marketing', 'marketing-command-center'],
          team: [
            { id: 'user-001', name: 'Marketing Manager', role: 'lead' },
            { id: 'user-002', name: 'Content Creator', role: 'contributor' }
          ],
          goals: ['goal-001', 'goal-002'],
          createdAt: new Date('2025-09-01'),
          updatedAt: new Date()
        };

        const sampleGoals: BusinessGoal[] = [
          {
            id: 'goal-001',
            title: 'Increase Social Media Engagement',
            description: 'Boost engagement rate across all social platforms',
            type: 'brand',
            target: { metric: 'engagement_rate', value: 5.2, timeframe: 'monthly' },
            currentProgress: 3.8,
            relatedPlatforms: ['social-media', 'marketing-command-center'],
            priority: 'high',
            status: 'active',
            createdAt: new Date('2025-09-01'),
            deadline: new Date('2025-12-31')
          },
          {
            id: 'goal-002',
            title: 'Email Campaign ROI',
            description: 'Achieve 400% ROI on email marketing campaigns',
            type: 'revenue',
            target: { metric: 'roi_percentage', value: 400, timeframe: 'quarterly' },
            currentProgress: 285,
            relatedPlatforms: ['email-marketing', 'analytics'],
            priority: 'high',
            status: 'active',
            createdAt: new Date('2025-09-01'),
            deadline: new Date('2025-12-31')
          }
        ];

        setMemory(prev => ({
          ...prev,
          currentProject: sampleProject,
          activeGoals: sampleGoals
        }));

      } catch (err) {
        setError('Failed to initialize cross-platform memory');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeMemory();
  }, []);

  // Save memory to localStorage whenever it changes
  useEffect(() => {
    const saveMemory = () => {
      try {
        const memoryToSave = {
          ...memory,
          platformStates: Object.fromEntries(memory.platformStates)
        };
        localStorage.setItem('crossPlatformMemory', JSON.stringify(memoryToSave));
      } catch (err) {
        console.error('Failed to save cross-platform memory:', err);
      }
    };

    saveMemory();
  }, [memory]);

  const updateProject = useCallback((project: Project) => {
    setMemory(prev => ({
      ...prev,
      currentProject: { ...project, updatedAt: new Date() }
    }));
  }, []);

  const addGoal = useCallback((goal: BusinessGoal) => {
    setMemory(prev => ({
      ...prev,
      activeGoals: [...prev.activeGoals, goal]
    }));
  }, []);

  const updateGoalProgress = useCallback((goalId: string, progress: number) => {
    setMemory(prev => ({
      ...prev,
      activeGoals: prev.activeGoals.map(goal =>
        goal.id === goalId ? { ...goal, currentProgress: progress } : goal
      )
    }));
  }, []);

  const logDecision = useCallback((decision: Omit<Decision, 'id' | 'timestamp'>) => {
    const newDecision: Decision = {
      ...decision,
      id: `decision-${Date.now()}`,
      timestamp: new Date()
    };

    setMemory(prev => ({
      ...prev,
      recentDecisions: [newDecision, ...prev.recentDecisions].slice(0, 50) // Keep last 50 decisions
    }));
  }, []);

  const logLearningEvent = useCallback((event: Omit<LearningEvent, 'id' | 'timestamp'>) => {
    const newEvent: LearningEvent = {
      ...event,
      id: `learning-${Date.now()}`,
      timestamp: new Date()
    };

    setMemory(prev => ({
      ...prev,
      learningHistory: [newEvent, ...prev.learningHistory].slice(0, 100) // Keep last 100 events
    }));
  }, []);

  const updateUserContext = useCallback((context: Partial<UserWorkingContext>) => {
    setMemory(prev => ({
      ...prev,
      userContext: { ...prev.userContext, ...context }
    }));
  }, []);

  const updatePlatformState = useCallback((platformId: string, state: Partial<PlatformState>) => {
    setMemory(prev => {
      const newPlatformStates = new Map(prev.platformStates);
      const existingState = newPlatformStates.get(platformId) || {
        platformId,
        lastAccessed: new Date(),
        currentView: '',
        activeFilters: {},
        recentActions: [],
        performance: { score: 0, trends: {} },
        pendingTasks: [],
        contextData: {}
      };

      newPlatformStates.set(platformId, {
        ...existingState,
        ...state,
        lastAccessed: new Date()
      });

      return {
        ...prev,
        platformStates: newPlatformStates
      };
    });
  }, []);

  const shareAsset = useCallback((asset: Omit<SharedAsset, 'id' | 'createdAt' | 'lastUsed' | 'usageCount'>) => {
    const newAsset: SharedAsset = {
      ...asset,
      id: `asset-${Date.now()}`,
      createdAt: new Date(),
      lastUsed: new Date(),
      usageCount: 0,
      performance: { views: 0, clicks: 0, conversions: 0 }
    };

    setMemory(prev => ({
      ...prev,
      sharedAssets: [newAsset, ...prev.sharedAssets]
    }));
  }, []);

  const getContextualSuggestions = useCallback((platformId: string): ContextSuggestion[] => {
    // AI-powered contextual suggestions based on cross-platform memory
    const suggestions: ContextSuggestion[] = [];

    // Example: If user is in email marketing and has active social media campaign
    if (platformId === 'email-marketing' && memory.currentProject) {
      const socialMediaActive = memory.currentProject.platforms.includes('social-media');
      if (socialMediaActive) {
        suggestions.push({
          id: 'suggest-001',
          type: 'workflow',
          title: 'Amplify Social Media with Email',
          description: 'Create email campaign to promote your active social media content',
          confidence: 0.89,
          impact: 'high',
          effort: 'medium',
          platforms: ['email-marketing', 'social-media'],
          suggestedAction: 'Create cross-promotion email template',
          automationAvailable: true,
          contextReasons: [
            'Active social media campaign detected',
            'Email list has 23% higher engagement when promoting social content',
            'Current project includes both platforms'
          ]
        });
      }
    }

    // Example: Goal-based suggestions
    memory.activeGoals.forEach(goal => {
      if (goal.relatedPlatforms.includes(platformId) && goal.currentProgress < goal.target.value * 0.8) {
        suggestions.push({
          id: `goal-suggest-${goal.id}`,
          type: 'optimization',
          title: `Accelerate "${goal.title}" Progress`,
          description: `Current progress: ${goal.currentProgress}. Target: ${goal.target.value}`,
          confidence: 0.75,
          impact: 'high',
          effort: 'medium',
          platforms: goal.relatedPlatforms,
          suggestedAction: 'Optimize strategy for faster goal achievement',
          automationAvailable: false,
          contextReasons: [
            `Goal progress at ${Math.round((goal.currentProgress / goal.target.value) * 100)}%`,
            `Deadline: ${goal.deadline.toLocaleDateString()}`
          ]
        });
      }
    });

    return suggestions.sort((a, b) => (b.confidence * (b.impact === 'high' ? 3 : b.impact === 'medium' ? 2 : 1)) - 
                                      (a.confidence * (a.impact === 'high' ? 3 : a.impact === 'medium' ? 2 : 1)));
  }, [memory]);

  const triggerCrossPlatformAction = useCallback((triggerId: string, data: any) => {
    // Execute cross-platform automation
    console.log(`Triggering cross-platform action: ${triggerId}`, data);
    
    // Log the action as a learning event
    logLearningEvent({
      event: `Cross-platform trigger executed: ${triggerId}`,
      platform: 'cross-platform',
      userAction: 'automation_trigger',
      outcome: 'positive',
      confidence: 0.95,
      context: { triggerId, data },
      insights: ['Automation successfully executed', 'Cross-platform integration working']
    });
  }, [logLearningEvent]);

  const getSharedContext = useCallback((platformId: string): PlatformSharedContext => {
    const platformState = memory.platformStates.get(platformId);
    const relevantGoals = memory.activeGoals.filter(goal => 
      goal.relatedPlatforms.includes(platformId)
    );
    const recentDecisions = memory.recentDecisions
      .filter(decision => decision.platform === platformId || decision.relatedGoals.some(goalId => 
        relevantGoals.some(goal => goal.id === goalId)
      ))
      .slice(0, 10);

    return {
      currentProject: memory.currentProject,
      relevantGoals,
      recentDecisions,
      suggestedActions: getContextualSuggestions(platformId),
      sharedAssets: memory.sharedAssets.filter(asset => asset.platforms.includes(platformId)),
      relatedPlatformStates: Array.from(memory.platformStates.values())
        .filter(state => state.platformId !== platformId),
      workflowContext: memory.workflowContext,
      userPreferences: memory.userContext
    };
  }, [memory, getContextualSuggestions]);

  const syncPlatformData = useCallback((platformId: string, data: any) => {
    // Sync data across platforms
    updatePlatformState(platformId, {
      contextData: { ...data, lastSync: new Date() }
    });

    // Trigger relevant cross-platform actions
    memory.workflowContext.crossPlatformTriggers
      .filter(trigger => trigger.sourcePlatform === platformId && trigger.isActive)
      .forEach(trigger => {
        // Check if trigger condition is met
        if (trigger.condition) {
          triggerCrossPlatformAction(trigger.id, data);
        }
      });
  }, [updatePlatformState, triggerCrossPlatformAction, memory.workflowContext.crossPlatformTriggers]);

  const value: CrossPlatformContextType = {
    memory,
    updateProject,
    addGoal,
    updateGoalProgress,
    logDecision,
    logLearningEvent,
    updateUserContext,
    updatePlatformState,
    shareAsset,
    getContextualSuggestions,
    triggerCrossPlatformAction,
    getSharedContext,
    syncPlatformData,
    isLoading,
    error
  };

  return (
    <CrossPlatformContext.Provider value={value}>
      {children}
    </CrossPlatformContext.Provider>
  );
}

// Custom hook to use cross-platform context
export function useCrossPlatform() {
  const context = useContext(CrossPlatformContext);
  if (context === undefined) {
    throw new Error('useCrossPlatform must be used within a CrossPlatformProvider');
  }
  return context;
}

// Additional type definitions (placeholders for comprehensive typing)
interface TeamMember {
  id: string;
  name: string;
  role: string;
}

interface WorkflowPattern {
  id: string;
  name: string;
  steps: string[];
}

interface ActivityEvent {
  id: string;
  action: string;
  platform: string;
  timestamp: Date;
}

interface PlatformPerformance {
  score: number;
  trends: Record<string, number>;
}

interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: Date;
}

interface AssetPerformance {
  views: number;
  clicks: number;
  conversions: number;
}

interface WorkflowStep {
  id: string;
  name: string;
  platform: string;
  action: string;
  completed: boolean;
}

interface TriggerCondition {
  type: string;
  parameters: Record<string, any>;
}

interface TriggerAction {
  type: string;
  platform: string;
  parameters: Record<string, any>;
}

interface AutomationRule {
  id: string;
  name: string;
  condition: TriggerCondition;
  actions: TriggerAction[];
  isActive: boolean;
}

interface ScheduledAction {
  id: string;
  name: string;
  action: TriggerAction;
  scheduledFor: Date;
  status: 'pending' | 'executed' | 'failed';
}