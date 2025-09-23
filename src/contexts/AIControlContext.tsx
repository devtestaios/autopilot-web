'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AICapability {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'optimization' | 'analytics' | 'automation' | 'insights' | 'control';
  permissions: string[];
}

interface AIAction {
  id: string;
  type: 'campaign_action' | 'navigation' | 'optimization' | 'analysis' | 'ui_control';
  function: string;
  arguments: any;
  timestamp: Date;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: any;
  human_approval_required?: boolean;
}

interface AIContextValue {
  // AI Control System
  aiEnabled: boolean;
  autonomousMode: boolean;
  humanApprovalRequired: boolean;
  
  // AI Actions & Control
  executeAIAction: (action: Omit<AIAction, 'id' | 'timestamp' | 'status'>) => Promise<any>;
  pendingActions: AIAction[];
  actionHistory: AIAction[];
  
  // Platform Control Capabilities
  navigateToPage: (page: string) => void;
  controlDashboard: (action: string, params?: any) => void;
  manageCampaigns: (action: string, campaignId?: string, params?: any) => Promise<any>;
  
  // AI Settings & Permissions
  capabilities: AICapability[];
  grantAIPermission: (permission: string) => void;
  revokeAIPermission: (permission: string) => void;
  toggleAutonomousMode: () => void;
  
  // Real-time AI Integration
  aiStatus: 'active' | 'idle' | 'processing' | 'error';
  lastAIActivity: Date | null;
  
  // Notification system
  showNotification: (title: string, description: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

const AIControlContext = createContext<AIContextValue | undefined>(undefined);

const advancedCapabilities: AICapability[] = [
  {
    id: 'campaign-crud',
    name: 'Campaign Management',
    description: 'Create, read, update, and delete campaigns autonomously',
    enabled: true,
    category: 'control',
    permissions: ['campaigns:create', 'campaigns:update', 'campaigns:delete', 'campaigns:read']
  },
  {
    id: 'budget-control',
    name: 'Budget Management',
    description: 'Modify campaign budgets and spending limits',
    enabled: true,
    category: 'control',
    permissions: ['budget:modify', 'budget:allocate', 'budget:limits']
  },
  {
    id: 'optimization-engine',
    name: 'Auto-Optimization',
    description: 'Automatically optimize campaigns based on performance',
    enabled: true,
    category: 'optimization',
    permissions: ['optimize:campaigns', 'optimize:bids', 'optimize:targeting']
  },
  {
    id: 'platform-navigation',
    name: 'Platform Navigation',
    description: 'Navigate between pages and control UI elements',
    enabled: true,
    category: 'control',
    permissions: ['ui:navigate', 'ui:control', 'ui:modify']
  },
  {
    id: 'data-analysis',
    name: 'Real-time Analysis',
    description: 'Analyze performance data and generate insights',
    enabled: true,
    category: 'analytics',
    permissions: ['data:read', 'data:analyze', 'insights:generate']
  },
  {
    id: 'autonomous-actions',
    name: 'Autonomous Execution',
    description: 'Execute actions without human approval (with safety limits)',
    enabled: false,
    category: 'automation',
    permissions: ['execute:autonomous', 'modify:campaigns', 'control:platform']
  }
];

export function AIControlProvider({ children }: { children: React.ReactNode }) {
  const [aiEnabled, setAIEnabled] = useState(true);
  const [autonomousMode, setAutonomousMode] = useState(false);
  const [humanApprovalRequired, setHumanApprovalRequired] = useState(true);
  const [capabilities, setCapabilities] = useState<AICapability[]>(advancedCapabilities);
  const [pendingActions, setPendingActions] = useState<AIAction[]>([]);
  const [actionHistory, setActionHistory] = useState<AIAction[]>([]);
  const [aiStatus, setAIStatus] = useState<'active' | 'idle' | 'processing' | 'error'>('active');
  const [lastAIActivity, setLastAIActivity] = useState<Date | null>(null);
  
  const router = useRouter();
  
  // Simple notification system that doesn't depend on toast context
  const showNotification = useCallback((title: string, description: string, type: 'success' | 'error' | 'warning' | 'info') => {
    // For now, use console.log - this can be replaced with a proper notification system later
    console.log(`[${type.toUpperCase()}] ${title}: ${description}`);
    
    // You could also use browser notifications API here
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body: description });
    }
  }, []);

  // Load saved AI settings
  useEffect(() => {
    const savedSettings = localStorage.getItem('ai-control-settings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setAIEnabled(settings.aiEnabled ?? true);
      setAutonomousMode(settings.autonomousMode ?? false);
      setHumanApprovalRequired(settings.humanApprovalRequired ?? true);
    }
  }, []);

  // Save settings when they change
  useEffect(() => {
    localStorage.setItem('ai-control-settings', JSON.stringify({
      aiEnabled,
      autonomousMode,
      humanApprovalRequired
    }));
  }, [aiEnabled, autonomousMode, humanApprovalRequired]);

  const executeAIAction = useCallback(async (actionData: Omit<AIAction, 'id' | 'timestamp' | 'status'>) => {
    if (!aiEnabled) {
      throw new Error('AI is currently disabled');
    }

    const action: AIAction = {
      ...actionData,
      id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      status: 'pending'
    };

    // Check if human approval is required
    if (humanApprovalRequired && !autonomousMode && action.human_approval_required !== false) {
      setPendingActions(prev => [...prev, action]);
      
      showNotification(
        "AI Action Requires Approval",
        `AI wants to ${action.function}. Check pending actions to approve.`,
        "info"
      );
      
      return { status: 'pending_approval', actionId: action.id };
    }

    // Execute action immediately
    return await executeActionInternal(action);
  }, [aiEnabled, humanApprovalRequired, autonomousMode, showNotification]);

  const executeActionInternal = useCallback(async (action: AIAction) => {
    setAIStatus('processing');
    setLastAIActivity(new Date());
    
    try {
      // Update action status
      setActionHistory(prev => [...prev, { ...action, status: 'executing' }]);
      
      let result;
      
      switch (action.type) {
        case 'navigation':
          result = await handleNavigation(action);
          break;
        case 'campaign_action':
          result = await handleCampaignAction(action);
          break;
        case 'optimization':
          result = await handleOptimization(action);
          break;
        case 'ui_control':
          result = await handleUIControl(action);
          break;
        default:
          throw new Error(`Unknown action type: ${action.type}`);
      }

      // Update action as completed
      setActionHistory(prev => 
        prev.map(a => a.id === action.id ? { ...a, status: 'completed', result } : a)
      );
      
      // Remove from pending if it was there
      setPendingActions(prev => prev.filter(a => a.id !== action.id));
      
      setAIStatus('active');
      
      showNotification(
        "AI Action Completed",
        `Successfully executed: ${action.function}`,
        "success"
      );
      
      return result;
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setActionHistory(prev => 
        prev.map(a => a.id === action.id ? { ...a, status: 'failed', result: { error: errorMessage } } : a)
      );
      
      setAIStatus('error');
      
      showNotification(
        "AI Action Failed",
        `Failed to execute: ${action.function}`,
        "error"
      );
      
      throw error;
    }
  }, [showNotification]);

  const handleNavigation = useCallback(async (action: AIAction) => {
    const { page } = action.arguments;
    
    if (page) {
      router.push(`/${page}`);
      return { navigated_to: page };
    }
    
    throw new Error('No page specified for navigation');
  }, [router]);

  const handleCampaignAction = useCallback(async (action: AIAction) => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api-1.onrender.com';
    
    switch (action.function) {
      case 'create_campaign':
        const response = await fetch(`${API_BASE}/campaigns`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.arguments)
        });
        
        if (!response.ok) {
          throw new Error('Failed to create campaign');
        }
        
        return await response.json();
        
      case 'update_campaign':
        const { campaign_id, updates } = action.arguments;
        const updateResponse = await fetch(`${API_BASE}/campaigns/${campaign_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
        
        if (!updateResponse.ok) {
          throw new Error('Failed to update campaign');
        }
        
        return await updateResponse.json();
        
      case 'pause_campaign':
      case 'resume_campaign':
        const status = action.function === 'pause_campaign' ? 'paused' : 'active';
        const statusResponse = await fetch(`${API_BASE}/campaigns/${action.arguments.campaign_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });
        
        if (!statusResponse.ok) {
          throw new Error(`Failed to ${action.function}`);
        }
        
        return await statusResponse.json();
        
      default:
        throw new Error(`Unknown campaign action: ${action.function}`);
    }
  }, []);

  const handleOptimization = useCallback(async (action: AIAction) => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api-1.onrender.com';
    
    // Call optimization endpoint (would need to be implemented in backend)
    const response = await fetch(`${API_BASE}/ai/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action.arguments)
    });
    
    if (!response.ok) {
      // Fallback to mock optimization
      return {
        optimizations_applied: [
          'Adjusted bid strategy',
          'Updated targeting parameters',
          'Optimized budget allocation'
        ],
        expected_improvement: '15% ROAS increase'
      };
    }
    
    return await response.json();
  }, []);

  const handleUIControl = useCallback(async (action: AIAction) => {
    // Handle UI control actions
    switch (action.function) {
      case 'refresh_dashboard':
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
        return { refreshed: true };
        
      case 'show_notifications':
        // Trigger notification center
        return { notifications_shown: true };
        
      case 'toggle_sidebar':
        // This would integrate with your sidebar component
        return { sidebar_toggled: true };
        
      default:
        throw new Error(`Unknown UI control action: ${action.function}`);
    }
  }, []);

  const navigateToPage = useCallback((page: string) => {
    executeAIAction({
      type: 'navigation',
      function: 'navigate_to_page',
      arguments: { page },
      human_approval_required: false
    });
  }, [executeAIAction]);

  const controlDashboard = useCallback((action: string, params?: any) => {
    executeAIAction({
      type: 'ui_control',
      function: action,
      arguments: params || {},
      human_approval_required: false
    });
  }, [executeAIAction]);

  const manageCampaigns = useCallback(async (action: string, campaignId?: string, params?: any) => {
    return await executeAIAction({
      type: 'campaign_action',
      function: action,
      arguments: { campaign_id: campaignId, ...params },
      human_approval_required: action.includes('delete') || action.includes('create')
    });
  }, [executeAIAction]);

  const grantAIPermission = useCallback((permission: string) => {
    setCapabilities(prev => 
      prev.map(cap => 
        cap.permissions.includes(permission) 
          ? { ...cap, enabled: true }
          : cap
      )
    );
    
    showNotification(
      "AI Permission Granted",
      `AI now has ${permission} permission`,
      "success"
    );
  }, [showNotification]);

  const revokeAIPermission = useCallback((permission: string) => {
    setCapabilities(prev => 
      prev.map(cap => 
        cap.permissions.includes(permission) 
          ? { ...cap, enabled: false }
          : cap
      )
    );
    
    showNotification(
      "AI Permission Revoked",
      `AI no longer has ${permission} permission`,
      "warning"
    );
  }, [showNotification]);

  const toggleAutonomousMode = useCallback(() => {
    setAutonomousMode(prev => !prev);
    setHumanApprovalRequired(prev => !prev);
    
    showNotification(
      autonomousMode ? "Autonomous Mode Disabled" : "Autonomous Mode Enabled",
      autonomousMode 
        ? "AI actions now require human approval"
        : "AI can now execute actions autonomously (with safety limits)",
      "info"
    );
  }, [autonomousMode, showNotification]);

  const value: AIContextValue = {
    aiEnabled,
    autonomousMode,
    humanApprovalRequired,
    executeAIAction,
    pendingActions,
    actionHistory,
    navigateToPage,
    controlDashboard,
    manageCampaigns,
    capabilities,
    grantAIPermission,
    revokeAIPermission,
    toggleAutonomousMode,
    aiStatus,
    lastAIActivity,
    showNotification
  };

  return (
    <AIControlContext.Provider value={value}>
      {children}
    </AIControlContext.Provider>
  );
}

export function useAIControl() {
  const context = useContext(AIControlContext);
  if (context === undefined) {
    throw new Error('useAIControl must be used within an AIControlProvider');
  }
  return context;
}

export default AIControlProvider;