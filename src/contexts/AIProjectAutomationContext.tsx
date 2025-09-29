'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useProjectManagement, Project, Task, TaskStatus, Priority } from '@/contexts/ProjectManagementContext';
import { useUnifiedAI } from '@/contexts/UnifiedAIContext';

// ============================================================================
// AI PROJECT AUTOMATION TYPES
// ============================================================================

export interface AIProjectSuggestion {
  id: string;
  type: 'task_creation' | 'resource_allocation' | 'timeline_optimization' | 'risk_mitigation';
  title: string;
  description: string;
  confidence: number; // 0-100
  impact: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  data: any;
  createdAt: Date;
  isApplied: boolean;
}

export interface AITaskBreakdown {
  phase: string;
  tasks: {
    title: string;
    description: string;
    estimatedHours: number;
    priority: Priority;
    dependencies: string[];
    skills: string[];
    status: TaskStatus;
  }[];
}

export interface AIResourceAllocation {
  taskId: string;
  recommendedAssignee: string;
  confidence: number;
  reasoning: string;
  alternativeAssignees: Array<{
    id: string;
    confidence: number;
    reasoning: string;
  }>;
}

export interface AIRiskAssessment {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: Array<{
    type: 'timeline' | 'budget' | 'resources' | 'dependencies' | 'scope';
    description: string;
    impact: number; // 1-10
    likelihood: number; // 1-10
    mitigation: string;
  }>;
  recommendations: string[];
}

export interface AIProjectAnalysis {
  projectId: string;
  taskBreakdown: AITaskBreakdown[];
  resourceAllocations: AIResourceAllocation[];
  riskAssessment: AIRiskAssessment;
  timelineOptimization: {
    originalDuration: number;
    optimizedDuration: number;
    savings: number;
    adjustments: string[];
  };
  budgetOptimization: {
    originalBudget: number;
    optimizedBudget: number;
    savings: number;
    recommendations: string[];
  };
}

// ============================================================================
// AI PROJECT AUTOMATION CONTEXT
// ============================================================================

interface AIProjectAutomationContextValue {
  // ========== CORE STATE ==========
  suggestions: AIProjectSuggestion[];
  isAnalyzing: boolean;
  analysisProgress: number;
  
  // ========== AI PROJECT PLANNING ==========
  analyzeProject: (project: Project) => Promise<AIProjectAnalysis>;
  generateTaskBreakdown: (projectDescription: string, template?: string) => Promise<AITaskBreakdown[]>;
  optimizeResourceAllocation: (projectId: string) => Promise<AIResourceAllocation[]>;
  assessProjectRisks: (project: Project) => Promise<AIRiskAssessment>;
  
  // ========== AI AUTOMATION ==========
  autoCreateTasks: (projectId: string, breakdown: AITaskBreakdown[]) => Promise<void>;
  autoAssignTasks: (allocations: AIResourceAllocation[]) => Promise<void>;
  optimizeTimeline: (projectId: string) => Promise<void>;
  
  // ========== SUGGESTIONS MANAGEMENT ==========
  getSuggestions: (projectId?: string) => AIProjectSuggestion[];
  applySuggestion: (suggestionId: string) => Promise<void>;
  dismissSuggestion: (suggestionId: string) => void;
  
  // ========== INTELLIGENT MONITORING ==========
  monitorProject: (projectId: string) => Promise<AIProjectSuggestion[]>;
  predictDelays: (projectId: string) => Promise<Array<{taskId: string; predictedDelay: number; confidence: number}>>;
  optimizeBudget: (projectId: string) => Promise<{recommendations: string[]; potentialSavings: number}>;
}

const AIProjectAutomationContext = createContext<AIProjectAutomationContextValue | undefined>(undefined);

// ============================================================================
// AI PROJECT AUTOMATION PROVIDER
// ============================================================================

export function AIProjectAutomationProvider({ children }: { children: React.ReactNode }) {
  const { executeAIAction } = useUnifiedAI();
  const { 
    projects, 
    tasks, 
    teamMembers, 
    createTask, 
    updateTask, 
    currentProject 
  } = useProjectManagement();
  
  const [suggestions, setSuggestions] = useState<AIProjectSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // ========== AI HELPER FUNCTION ==========
  const getAIResponse = useCallback(async (prompt: string): Promise<string> => {
    try {
      const result = await executeAIAction({
        type: 'analysis',
        function: 'analyze',
        arguments: { prompt }
      });
      return result || '{}';
    } catch (error) {
      console.error('Error getting AI response:', error);
      return '{}';
    }
  }, [executeAIAction]);

  // ========== AI PROJECT ANALYSIS ==========
  const analyzeProject = useCallback(async (project: Project): Promise<AIProjectAnalysis> => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      // Phase 1: Generate task breakdown
      setAnalysisProgress(20);
      const taskBreakdown = await generateTaskBreakdown(
        `${project.name}: ${project.description}`,
        project.template
      );

      // Phase 2: Analyze resource allocation
      setAnalysisProgress(40);
      const resourceAllocations = await optimizeResourceAllocation(project.id);

      // Phase 3: Assess risks
      setAnalysisProgress(60);
      const riskAssessment = await assessProjectRisks(project);

      // Phase 4: Timeline optimization
      setAnalysisProgress(80);
      const timelinePrompt = `
        Analyze and optimize the timeline for project: ${project.name}
        
        Current timeline: ${project.startDate} to ${project.endDate}
        Tasks: ${JSON.stringify(taskBreakdown, null, 2)}
        Team: ${JSON.stringify(teamMembers, null, 2)}
        
        Provide timeline optimization recommendations in JSON format:
        {
          "originalDuration": number (days),
          "optimizedDuration": number (days),
          "savings": number (days),
          "adjustments": ["adjustment1", "adjustment2"]
        }
      `;

      const timelineResult = await getAIResponse(timelinePrompt);
      const timelineOptimization = JSON.parse(timelineResult || '{}');

      // Phase 5: Budget optimization
      setAnalysisProgress(90);
      const budgetPrompt = `
        Analyze and optimize the budget for project: ${project.name}
        
        Current budget: ${project.budget || 0}
        Tasks breakdown: ${JSON.stringify(taskBreakdown, null, 2)}
        Team rates: ${teamMembers.map(m => `${m.name}: $${m.hourlyRate || 75}/hr`).join(', ')}
        
        Provide budget optimization in JSON format:
        {
          "originalBudget": number,
          "optimizedBudget": number,
          "savings": number,
          "recommendations": ["rec1", "rec2"]
        }
      `;

      const budgetResult = await getAIResponse(budgetPrompt);
      const budgetOptimization = JSON.parse(budgetResult || '{}');

      setAnalysisProgress(100);

      const analysis: AIProjectAnalysis = {
        projectId: project.id,
        taskBreakdown,
        resourceAllocations,
        riskAssessment,
        timelineOptimization,
        budgetOptimization
      };

      // Generate suggestions based on analysis
      const newSuggestions = generateSuggestionsFromAnalysis(analysis);
      setSuggestions(prev => [...prev, ...newSuggestions]);

      return analysis;

    } catch (error) {
      console.error('Error analyzing project:', error);
      throw error;
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  }, [getAIResponse, teamMembers]);

  // ========== AI TASK BREAKDOWN GENERATION ==========
  const generateTaskBreakdown = useCallback(async (
    projectDescription: string,
    template?: string
  ): Promise<AITaskBreakdown[]> => {
    const prompt = `
      As an expert project manager, create a comprehensive task breakdown for this project:
      
      Project: ${projectDescription}
      Template: ${template || 'Custom'}
      
      Generate a detailed task breakdown structure with phases and tasks. Consider:
      - Industry best practices
      - Realistic time estimates
      - Task dependencies
      - Required skills
      - Appropriate priority levels
      
      Return JSON format:
      {
        "phases": [
          {
            "phase": "Phase Name",
            "tasks": [
              {
                "title": "Task title",
                "description": "Detailed description",
                "estimatedHours": number,
                "priority": "low|medium|high|highest|critical",
                "dependencies": ["task titles that must be completed first"],
                "skills": ["required skills"],
                "status": "todo"
              }
            ]
          }
        ]
      }
    `;

    try {
      const response = await getAIResponse(prompt);
      const result = JSON.parse(response || '{"phases":[]}');
      
      return result.phases.map((phase: any) => ({
        phase: phase.phase,
        tasks: phase.tasks.map((task: any) => ({
          ...task,
          status: 'todo' as TaskStatus,
          priority: task.priority as Priority
        }))
      }));
    } catch (error) {
      console.error('Error generating task breakdown:', error);
      return [];
    }
  }, [getAIResponse]);

  // ========== AI RESOURCE ALLOCATION ==========
  const optimizeResourceAllocation = useCallback(async (
    projectId: string
  ): Promise<AIResourceAllocation[]> => {
    const project = projects.find(p => p.id === projectId);
    const projectTasks = tasks.filter(t => t.projectId === projectId);
    
    if (!project || !projectTasks.length) return [];

    const prompt = `
      Optimize resource allocation for project tasks:
      
      Project: ${project.name}
      Tasks: ${JSON.stringify(projectTasks.map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        estimatedHours: t.estimatedHours,
        priority: t.priority,
        tags: t.tags
      })), null, 2)}
      
      Team Members: ${JSON.stringify(teamMembers.map(m => ({
        id: m.id,
        name: m.name,
        role: m.role,
        skills: m.skills,
        workload: m.workload
      })), null, 2)}
      
      For each task, recommend the best assignee based on:
      - Skill match
      - Current workload
      - Past performance
      - Task priority
      
      Return JSON format:
      {
        "allocations": [
          {
            "taskId": "task_id",
            "recommendedAssignee": "member_id",
            "confidence": number (0-100),
            "reasoning": "explanation",
            "alternativeAssignees": [
              {
                "id": "member_id",
                "confidence": number,
                "reasoning": "explanation"
              }
            ]
          }
        ]
      }
    `;

    try {
      const response = await getAIResponse(prompt);
      const result = JSON.parse(response || '{"allocations":[]}');
      return result.allocations;
    } catch (error) {
      console.error('Error optimizing resource allocation:', error);
      return [];
    }
  }, [getAIResponse, projects, tasks, teamMembers]);

  // ========== AI RISK ASSESSMENT ==========
  const assessProjectRisks = useCallback(async (project: Project): Promise<AIRiskAssessment> => {
    const projectTasks = tasks.filter(t => t.projectId === project.id);
    
    const prompt = `
      Assess risks for this project:
      
      Project: ${JSON.stringify(project, null, 2)}
      Tasks: ${JSON.stringify(projectTasks, null, 2)}
      Team: ${JSON.stringify(teamMembers, null, 2)}
      
      Analyze potential risks in:
      - Timeline (delays, dependencies)
      - Budget (overruns, scope creep)
      - Resources (availability, skills gaps)
      - Dependencies (external blockers)
      - Scope (unclear requirements, changing priorities)
      
      Return JSON format:
      {
        "riskLevel": "low|medium|high|critical",
        "factors": [
          {
            "type": "timeline|budget|resources|dependencies|scope",
            "description": "risk description",
            "impact": number (1-10),
            "likelihood": number (1-10),
            "mitigation": "mitigation strategy"
          }
        ],
        "recommendations": ["recommendation1", "recommendation2"]
      }
    `;

    try {
      const response = await getAIResponse(prompt);
      const result = JSON.parse(response || '{"riskLevel":"medium","factors":[],"recommendations":[]}');
      return result;
    } catch (error) {
      console.error('Error assessing project risks:', error);
      return {
        riskLevel: 'medium',
        factors: [],
        recommendations: []
      };
    }
  }, [getAIResponse, tasks, teamMembers]);

  // ========== AUTO CREATE TASKS ==========
  const autoCreateTasks = useCallback(async (
    projectId: string,
    breakdown: AITaskBreakdown[]
  ): Promise<void> => {
    try {
      for (const phase of breakdown) {
        for (let i = 0; i < phase.tasks.length; i++) {
          const taskData = phase.tasks[i];
          
          await createTask({
            title: taskData.title,
            description: taskData.description,
            status: taskData.status,
            priority: taskData.priority,
            projectId,
            estimatedHours: taskData.estimatedHours,
            assignedTo: [],
            dependencies: [],
            subtasks: [],
            tags: [phase.phase, ...taskData.skills],
            attachments: [],
            comments: [],
            customFields: {
              phase: phase.phase,
              aiGenerated: true,
              skills: taskData.skills
            },
            position: i,
            createdBy: 'ai_assistant'
          });
          
          // Small delay to avoid overwhelming the system
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } catch (error) {
      console.error('Error auto-creating tasks:', error);
      throw error;
    }
  }, [createTask]);

  // ========== HELPER FUNCTIONS ==========
  const generateSuggestionsFromAnalysis = (analysis: AIProjectAnalysis): AIProjectSuggestion[] => {
    const suggestions: AIProjectSuggestion[] = [];

    // Timeline optimization suggestion
    if (analysis.timelineOptimization.savings > 0) {
      suggestions.push({
        id: `timeline_${Date.now()}`,
        type: 'timeline_optimization',
        title: `Optimize Timeline - Save ${analysis.timelineOptimization.savings} days`,
        description: `AI identified potential timeline optimizations that could save ${analysis.timelineOptimization.savings} days`,
        confidence: 85,
        impact: 'high',
        category: 'Timeline',
        data: analysis.timelineOptimization,
        createdAt: new Date(),
        isApplied: false
      });
    }

    // Risk mitigation suggestions
    analysis.riskAssessment.factors.forEach((risk, index) => {
      if (risk.impact * risk.likelihood > 35) { // High risk threshold
        suggestions.push({
          id: `risk_${Date.now()}_${index}`,
          type: 'risk_mitigation',
          title: `Mitigate ${risk.type} Risk`,
          description: risk.mitigation,
          confidence: Math.min(90, risk.impact * 10),
          impact: risk.impact > 7 ? 'critical' : risk.impact > 5 ? 'high' : 'medium',
          category: 'Risk Management',
          data: risk,
          createdAt: new Date(),
          isApplied: false
        });
      }
    });

    return suggestions;
  };

  // ========== ADDITIONAL FUNCTIONS ==========
  const getSuggestions = useCallback((projectId?: string) => {
    if (projectId) {
      return suggestions.filter(s => 
        s.data?.projectId === projectId || s.type === 'task_creation'
      );
    }
    return suggestions;
  }, [suggestions]);

  const applySuggestion = useCallback(async (suggestionId: string) => {
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (!suggestion) return;

    // Mark as applied
    setSuggestions(prev => 
      prev.map(s => s.id === suggestionId ? { ...s, isApplied: true } : s)
    );

    // TODO: Implement suggestion application logic based on type
    switch (suggestion.type) {
      case 'task_creation':
        // Auto create tasks
        break;
      case 'resource_allocation':
        // Auto assign tasks
        break;
      case 'timeline_optimization':
        // Apply timeline changes
        break;
      case 'risk_mitigation':
        // Apply risk mitigation measures
        break;
    }
  }, [suggestions]);

  const dismissSuggestion = useCallback((suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  }, []);

  // ========== CONTEXT VALUE ==========
  const contextValue: AIProjectAutomationContextValue = {
    // Core state
    suggestions,
    isAnalyzing,
    analysisProgress,
    
    // AI project planning
    analyzeProject,
    generateTaskBreakdown,
    optimizeResourceAllocation,
    assessProjectRisks,
    
    // AI automation
    autoCreateTasks,
    autoAssignTasks: async () => {}, // TODO: Implement
    optimizeTimeline: async () => {}, // TODO: Implement
    
    // Suggestions management
    getSuggestions,
    applySuggestion,
    dismissSuggestion,
    
    // Intelligent monitoring
    monitorProject: async () => [], // TODO: Implement
    predictDelays: async () => [], // TODO: Implement
    optimizeBudget: async () => ({ recommendations: [], potentialSavings: 0 }) // TODO: Implement
  };

  return (
    <AIProjectAutomationContext.Provider value={contextValue}>
      {children}
    </AIProjectAutomationContext.Provider>
  );
}

// ============================================================================
// CUSTOM HOOK
// ============================================================================

export function useAIProjectAutomation() {
  const context = useContext(AIProjectAutomationContext);
  if (context === undefined) {
    throw new Error('useAIProjectAutomation must be used within an AIProjectAutomationProvider');
  }
  return context;
}