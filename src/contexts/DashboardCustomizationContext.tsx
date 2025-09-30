'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';

// ============================================================================
// DASHBOARD CUSTOMIZATION TYPES
// ============================================================================

export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'list' | 'feed' | 'ai-insights' | 'quick-actions' | 'recent-activity';
  title: string;
  size: 'small' | 'medium' | 'large' | 'full';
  position: { x: number; y: number; w: number; h: number };
  dataSource?: string;
  config?: Record<string, any>;
  visible: boolean;
  locked?: boolean;
}

export interface DashboardLayout {
  id: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  backgroundStyle?: string;
  gridSize: { cols: number; rows: number };
  businessType?: string;
  businessSize?: string;
  isDefault?: boolean;
  isCustom?: boolean;
}

export interface DashboardPersonalization {
  businessName: string;
  businessType: string;
  businessSize: string;
  industry: string;
  goals: string[];
  preferredLayout: 'minimal' | 'balanced' | 'comprehensive' | 'custom';
  priorityMetrics: string[];
  enabledPlatforms: string[];
  automationLevel: 'basic' | 'intermediate' | 'advanced';
}

// ============================================================================
// WIDGET TEMPLATES
// ============================================================================

export const WIDGET_TEMPLATES: Record<string, Omit<DashboardWidget, 'id' | 'position'>> = {
  // Core Metrics
  revenue: {
    type: 'metric',
    title: 'Total Revenue',
    size: 'small',
    visible: true,
    config: { format: 'currency', period: 'month' }
  },
  leads: {
    type: 'metric', 
    title: 'Active Leads',
    size: 'small',
    visible: true,
    config: { format: 'number', trend: true }
  },
  campaigns: {
    type: 'metric',
    title: 'Running Campaigns', 
    size: 'small',
    visible: true,
    config: { format: 'number', platforms: ['google', 'meta', 'linkedin'] }
  },
  conversion_rate: {
    type: 'metric',
    title: 'Conversion Rate',
    size: 'small', 
    visible: true,
    config: { format: 'percentage', comparison: 'last_month' }
  },

  // Charts & Analytics
  performance_chart: {
    type: 'chart',
    title: 'Performance Overview',
    size: 'medium',
    visible: true,
    config: { chartType: 'line', period: '30d', metrics: ['revenue', 'leads', 'conversions'] }
  },
  platform_breakdown: {
    type: 'chart',
    title: 'Platform Performance',
    size: 'medium',
    visible: true,
    config: { chartType: 'pie', platforms: ['google', 'meta', 'linkedin'] }
  },
  roi_trends: {
    type: 'chart',
    title: 'ROI Trends',
    size: 'medium',
    visible: true,
    config: { chartType: 'bar', period: '90d' }
  },

  // Lists & Feeds
  top_campaigns: {
    type: 'list',
    title: 'Top Performing Campaigns',
    size: 'medium',
    visible: true,
    config: { limit: 5, sortBy: 'performance', showThumbnails: true }
  },
  recent_leads: {
    type: 'list',
    title: 'Recent Leads',
    size: 'medium', 
    visible: true,
    config: { limit: 8, showSource: true, realTime: true }
  },
  active_projects: {
    type: 'list',
    title: 'Active Projects',
    size: 'medium',
    visible: true,
    config: { limit: 6, showProgress: true, showTeam: true }
  },

  // AI & Automation
  ai_insights: {
    type: 'ai-insights',
    title: 'AI Recommendations',
    size: 'large',
    visible: true,
    config: { categories: ['optimization', 'budget', 'targeting'], limit: 3 }
  },
  ai_alerts: {
    type: 'feed',
    title: 'Smart Alerts',
    size: 'medium',
    visible: true,
    config: { priority: 'high', autoRefresh: true }
  },

  // Quick Actions
  quick_actions: {
    type: 'quick-actions',
    title: 'Quick Actions',
    size: 'medium',
    visible: true,
    config: { 
      actions: ['create_campaign', 'add_lead', 'schedule_post', 'generate_report'],
      layout: 'grid'
    }
  },

  // Activity & Collaboration
  team_activity: {
    type: 'feed',
    title: 'Team Activity',
    size: 'medium',
    visible: true,
    config: { showAvatars: true, limit: 6, realTime: true }
  },
  recent_activity: {
    type: 'recent-activity',
    title: 'Recent Activity',
    size: 'large',
    visible: true,
    config: { categories: ['campaigns', 'leads', 'projects'], limit: 10 }
  }
};

// ============================================================================
// PREDEFINED LAYOUTS BY BUSINESS TYPE
// ============================================================================

export const BUSINESS_LAYOUT_TEMPLATES: Record<string, DashboardLayout> = {
  solo_entrepreneur: {
    id: 'solo_entrepreneur',
    name: 'Solo Entrepreneur',
    description: 'Focused on essential metrics and quick actions for individual creators',
    gridSize: { cols: 12, rows: 8 },
    businessType: 'solo_entrepreneur',
    isDefault: true,
    widgets: [
      { ...WIDGET_TEMPLATES.revenue, id: 'revenue-1', position: { x: 0, y: 0, w: 3, h: 2 } },
      { ...WIDGET_TEMPLATES.leads, id: 'leads-1', position: { x: 3, y: 0, w: 3, h: 2 } },
      { ...WIDGET_TEMPLATES.campaigns, id: 'campaigns-1', position: { x: 6, y: 0, w: 3, h: 2 } },
      { ...WIDGET_TEMPLATES.conversion_rate, id: 'conversion-1', position: { x: 9, y: 0, w: 3, h: 2 } },
      { ...WIDGET_TEMPLATES.performance_chart, id: 'performance-1', position: { x: 0, y: 2, w: 6, h: 3 } },
      { ...WIDGET_TEMPLATES.quick_actions, id: 'actions-1', position: { x: 6, y: 2, w: 6, h: 3 } },
      { ...WIDGET_TEMPLATES.ai_insights, id: 'ai-1', position: { x: 0, y: 5, w: 12, h: 3 } }
    ]
  },

  startup: {
    id: 'startup',
    name: 'Startup Growth',
    description: 'Growth metrics and team collaboration for early-stage companies',
    gridSize: { cols: 12, rows: 10 },
    businessType: 'startup',
    isDefault: true,
    widgets: [
      { ...WIDGET_TEMPLATES.revenue, id: 'revenue-2', position: { x: 0, y: 0, w: 2, h: 2 } },
      { ...WIDGET_TEMPLATES.leads, id: 'leads-2', position: { x: 2, y: 0, w: 2, h: 2 } },
      { ...WIDGET_TEMPLATES.campaigns, id: 'campaigns-2', position: { x: 4, y: 0, w: 2, h: 2 } },
      { ...WIDGET_TEMPLATES.conversion_rate, id: 'conversion-2', position: { x: 6, y: 0, w: 2, h: 2 } },
      { ...WIDGET_TEMPLATES.performance_chart, id: 'performance-2', position: { x: 0, y: 2, w: 6, h: 3 } },
      { ...WIDGET_TEMPLATES.platform_breakdown, id: 'platforms-2', position: { x: 6, y: 2, w: 6, h: 3 } },
      { ...WIDGET_TEMPLATES.top_campaigns, id: 'top-campaigns-2', position: { x: 0, y: 5, w: 4, h: 3 } },
      { ...WIDGET_TEMPLATES.recent_leads, id: 'recent-leads-2', position: { x: 4, y: 5, w: 4, h: 3 } },
      { ...WIDGET_TEMPLATES.team_activity, id: 'team-2', position: { x: 8, y: 5, w: 4, h: 3 } },
      { ...WIDGET_TEMPLATES.ai_insights, id: 'ai-2', position: { x: 0, y: 8, w: 12, h: 2 } }
    ]
  },

  agency: {
    id: 'agency',
    name: 'Agency Command Center',
    description: 'Client management and team collaboration for service agencies',
    gridSize: { cols: 12, rows: 12 },
    businessType: 'agency',
    isDefault: true,
    widgets: [
      { ...WIDGET_TEMPLATES.revenue, id: 'revenue-3', position: { x: 0, y: 0, w: 2, h: 2 } },
      { ...WIDGET_TEMPLATES.leads, id: 'leads-3', position: { x: 2, y: 0, w: 2, h: 2 } },
      { ...WIDGET_TEMPLATES.campaigns, id: 'campaigns-3', position: { x: 4, y: 0, w: 2, h: 2 } },
      { ...WIDGET_TEMPLATES.conversion_rate, id: 'conversion-3', position: { x: 6, y: 0, w: 2, h: 2 } },
      { ...WIDGET_TEMPLATES.performance_chart, id: 'performance-3', position: { x: 0, y: 2, w: 6, h: 3 } },
      { ...WIDGET_TEMPLATES.platform_breakdown, id: 'platforms-3', position: { x: 6, y: 2, w: 6, h: 3 } },
      { ...WIDGET_TEMPLATES.top_campaigns, id: 'top-campaigns-3', position: { x: 0, y: 5, w: 3, h: 3 } },
      { ...WIDGET_TEMPLATES.recent_leads, id: 'recent-leads-3', position: { x: 3, y: 5, w: 3, h: 3 } },
      { ...WIDGET_TEMPLATES.active_projects, id: 'projects-3', position: { x: 6, y: 5, w: 3, h: 3 } },
      { ...WIDGET_TEMPLATES.team_activity, id: 'team-3', position: { x: 9, y: 5, w: 3, h: 3 } },
      { ...WIDGET_TEMPLATES.ai_insights, id: 'ai-3', position: { x: 0, y: 8, w: 8, h: 2 } },
      { ...WIDGET_TEMPLATES.quick_actions, id: 'actions-3', position: { x: 8, y: 8, w: 4, h: 2 } },
      { ...WIDGET_TEMPLATES.recent_activity, id: 'activity-3', position: { x: 0, y: 10, w: 12, h: 2 } }
    ]
  },

  enterprise: {
    id: 'enterprise',
    name: 'Enterprise Overview',
    description: 'Comprehensive analytics and management for large organizations',
    gridSize: { cols: 16, rows: 12 },
    businessType: 'enterprise',
    isDefault: true,
    widgets: [
      { ...WIDGET_TEMPLATES.revenue, id: 'revenue-4', position: { x: 0, y: 0, w: 2, h: 2 } },
      { ...WIDGET_TEMPLATES.leads, id: 'leads-4', position: { x: 2, y: 0, w: 2, h: 2 } },
      { ...WIDGET_TEMPLATES.campaigns, id: 'campaigns-4', position: { x: 4, y: 0, w: 2, h: 2 } },
      { ...WIDGET_TEMPLATES.conversion_rate, id: 'conversion-4', position: { x: 6, y: 0, w: 2, h: 2 } },
      { ...WIDGET_TEMPLATES.performance_chart, id: 'performance-4', position: { x: 0, y: 2, w: 6, h: 4 } },
      { ...WIDGET_TEMPLATES.platform_breakdown, id: 'platforms-4', position: { x: 6, y: 2, w: 4, h: 4 } },
      { ...WIDGET_TEMPLATES.roi_trends, id: 'roi-4', position: { x: 10, y: 2, w: 6, h: 4 } },
      { ...WIDGET_TEMPLATES.top_campaigns, id: 'top-campaigns-4', position: { x: 0, y: 6, w: 4, h: 3 } },
      { ...WIDGET_TEMPLATES.recent_leads, id: 'recent-leads-4', position: { x: 4, y: 6, w: 4, h: 3 } },
      { ...WIDGET_TEMPLATES.active_projects, id: 'projects-4', position: { x: 8, y: 6, w: 4, h: 3 } },
      { ...WIDGET_TEMPLATES.team_activity, id: 'team-4', position: { x: 12, y: 6, w: 4, h: 3 } },
      { ...WIDGET_TEMPLATES.ai_insights, id: 'ai-4', position: { x: 0, y: 9, w: 8, h: 3 } },
      { ...WIDGET_TEMPLATES.ai_alerts, id: 'alerts-4', position: { x: 8, y: 9, w: 4, h: 3 } },
      { ...WIDGET_TEMPLATES.quick_actions, id: 'actions-4', position: { x: 12, y: 9, w: 4, h: 3 } }
    ]
  }
};

// ============================================================================
// DASHBOARD CUSTOMIZATION CONTEXT
// ============================================================================

interface DashboardCustomizationContextValue {
  // ========== CURRENT STATE ==========
  currentLayout: DashboardLayout | null;
  personalization: DashboardPersonalization | null;
  isEditMode: boolean;
  isDragging: boolean;
  
  // ========== LAYOUT MANAGEMENT ==========
  availableLayouts: DashboardLayout[];
  customLayouts: DashboardLayout[];
  
  // ========== PERSONALIZATION ==========
  setPersonalization: (personalization: DashboardPersonalization) => void;
  generatePersonalizedLayout: (personalization: DashboardPersonalization) => DashboardLayout;
  applyBusinessSetupResults: (setupResults: any) => Promise<void>;
  
  // ========== LAYOUT OPERATIONS ==========
  setCurrentLayout: (layout: DashboardLayout) => void;
  createCustomLayout: (name: string, baseLayout?: DashboardLayout) => DashboardLayout;
  saveCurrentLayout: () => Promise<void>;
  deleteCustomLayout: (layoutId: string) => void;
  
  // ========== WIDGET OPERATIONS ==========
  addWidget: (widget: Omit<DashboardWidget, 'id'>) => void;
  removeWidget: (widgetId: string) => void;
  updateWidget: (widgetId: string, updates: Partial<DashboardWidget>) => void;
  moveWidget: (widgetId: string, position: DashboardWidget['position']) => void;
  toggleWidgetVisibility: (widgetId: string) => void;
  
  // ========== EDIT MODE ==========
  enableEditMode: () => void;
  disableEditMode: () => void;
  setDragging: (isDragging: boolean) => void;
  
  // ========== UTILITIES ==========
  resetToDefault: () => void;
  exportLayout: () => string;
  importLayout: (layoutData: string) => boolean;
  getWidgetsByType: (type: DashboardWidget['type']) => DashboardWidget[];
}

const DashboardCustomizationContext = createContext<DashboardCustomizationContextValue | undefined>(undefined);

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

export function DashboardCustomizationProvider({ children }: { children: React.ReactNode }) {
  // ========== STATE ==========
  const [currentLayout, setCurrentLayoutState] = useState<DashboardLayout | null>(null);
  const [personalization, setPersonalizationState] = useState<DashboardPersonalization | null>(null);
  const [customLayouts, setCustomLayouts] = useState<DashboardLayout[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Available layouts include defaults + custom
  const availableLayouts = useMemo(() => [
    ...Object.values(BUSINESS_LAYOUT_TEMPLATES),
    ...customLayouts
  ], [customLayouts]);

  // ========== INITIALIZATION ==========
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // Load personalization
        const savedPersonalization = localStorage.getItem('dashboard-personalization');
        if (savedPersonalization) {
          const parsed = JSON.parse(savedPersonalization);
          setPersonalizationState(parsed);
        }

        // Load current layout
        const savedLayout = localStorage.getItem('dashboard-current-layout');
        if (savedLayout) {
          const parsed = JSON.parse(savedLayout);
          setCurrentLayoutState(parsed);
        } else if (savedPersonalization) {
          // Generate layout from personalization
          const parsed = JSON.parse(savedPersonalization);
          const generated = generatePersonalizedLayout(parsed);
          setCurrentLayoutState(generated);
        } else {
          // Default to solo entrepreneur layout
          setCurrentLayoutState(BUSINESS_LAYOUT_TEMPLATES.solo_entrepreneur);
        }

        // Load custom layouts
        const savedCustom = localStorage.getItem('dashboard-custom-layouts');
        if (savedCustom) {
          const parsed = JSON.parse(savedCustom);
          setCustomLayouts(parsed);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setCurrentLayoutState(BUSINESS_LAYOUT_TEMPLATES.solo_entrepreneur);
      }
    };

    loadSavedData();
  }, []);

  // ========== PERSONALIZATION ==========
  const setPersonalization = useCallback((newPersonalization: DashboardPersonalization) => {
    setPersonalizationState(newPersonalization);
    localStorage.setItem('dashboard-personalization', JSON.stringify(newPersonalization));
    
    // Auto-generate layout based on personalization
    const newLayout = generatePersonalizedLayout(newPersonalization);
    setCurrentLayoutState(newLayout);
  }, []);

  const generatePersonalizedLayout = useCallback((personalization: DashboardPersonalization): DashboardLayout => {
    // Select base template based on business type
    const baseTemplate = BUSINESS_LAYOUT_TEMPLATES[personalization.businessType] || 
                        BUSINESS_LAYOUT_TEMPLATES.solo_entrepreneur;
    
    // Clone the template
    const personalizedLayout: DashboardLayout = {
      ...baseTemplate,
      id: `personalized-${Date.now()}`,
      name: `${personalization.businessName} Dashboard`,
      description: `Personalized dashboard for ${personalization.businessType}`,
      isCustom: true,
      widgets: [...baseTemplate.widgets]
    };

    // Customize widgets based on goals and preferences
    if (personalization.goals.includes('increase_revenue')) {
      // Prioritize revenue and ROI widgets
      personalizedLayout.widgets = personalizedLayout.widgets.map(widget => {
        if (widget.id.includes('revenue') || widget.id.includes('roi')) {
          return { ...widget, size: 'medium' as const };
        }
        return widget;
      });
    }

    if (personalization.goals.includes('lead_generation')) {
      // Emphasize lead tracking widgets
      personalizedLayout.widgets = personalizedLayout.widgets.map(widget => {
        if (widget.id.includes('leads') || widget.id.includes('conversion')) {
          return { ...widget, visible: true, size: 'medium' as const };
        }
        return widget;
      });
    }

    if (personalization.automationLevel === 'advanced') {
      // Add more AI widgets
      const aiWidgetExists = personalizedLayout.widgets.some(w => w.type === 'ai-insights');
      if (!aiWidgetExists) {
        personalizedLayout.widgets.push({
          ...WIDGET_TEMPLATES.ai_alerts,
          id: `ai-alerts-${Date.now()}`,
          position: { x: 0, y: personalizedLayout.gridSize.rows - 2, w: 6, h: 2 }
        });
      }
    }

    return personalizedLayout;
  }, []);

  const applyBusinessSetupResults = useCallback(async (setupResults: any) => {
    const personalization: DashboardPersonalization = {
      businessName: setupResults.businessName || 'My Business',
      businessType: setupResults.businessType || 'solo_entrepreneur',
      businessSize: setupResults.businessSize || 'solo',
      industry: setupResults.industry || 'Technology',
      goals: setupResults.goals || [],
      preferredLayout: setupResults.dashboardLayout || 'balanced',
      priorityMetrics: setupResults.priorityMetrics || ['revenue', 'leads'],
      enabledPlatforms: setupResults.selectedPlatforms || [],
      automationLevel: setupResults.automationLevel || 'basic'
    };

    setPersonalization(personalization);
  }, [setPersonalization]);

  // ========== LAYOUT OPERATIONS ==========
  const setCurrentLayout = useCallback((layout: DashboardLayout) => {
    setCurrentLayoutState(layout);
    localStorage.setItem('dashboard-current-layout', JSON.stringify(layout));
  }, []);

  const createCustomLayout = useCallback((name: string, baseLayout?: DashboardLayout): DashboardLayout => {
    const base = baseLayout || currentLayout || BUSINESS_LAYOUT_TEMPLATES.solo_entrepreneur;
    const newLayout: DashboardLayout = {
      ...base,
      id: `custom-${Date.now()}`,
      name,
      description: `Custom layout created by user`,
      isCustom: true,
      widgets: [...base.widgets]
    };

    setCustomLayouts(prev => [...prev, newLayout]);
    localStorage.setItem('dashboard-custom-layouts', JSON.stringify([...customLayouts, newLayout]));
    
    return newLayout;
  }, [currentLayout, customLayouts]);

  const saveCurrentLayout = useCallback(async () => {
    if (!currentLayout) return;
    
    localStorage.setItem('dashboard-current-layout', JSON.stringify(currentLayout));
    
    // If it's a custom layout, update it in the custom layouts array
    if (currentLayout.isCustom) {
      setCustomLayouts(prev => 
        prev.map(layout => 
          layout.id === currentLayout.id ? currentLayout : layout
        )
      );
      localStorage.setItem('dashboard-custom-layouts', JSON.stringify(customLayouts));
    }
  }, [currentLayout, customLayouts]);

  const deleteCustomLayout = useCallback((layoutId: string) => {
    setCustomLayouts(prev => prev.filter(layout => layout.id !== layoutId));
    localStorage.setItem('dashboard-custom-layouts', JSON.stringify(customLayouts.filter(layout => layout.id !== layoutId)));
    
    // If the deleted layout is current, switch to default
    if (currentLayout?.id === layoutId) {
      setCurrentLayoutState(BUSINESS_LAYOUT_TEMPLATES.solo_entrepreneur);
    }
  }, [customLayouts, currentLayout]);

  // ========== WIDGET OPERATIONS ==========
  const addWidget = useCallback((widget: Omit<DashboardWidget, 'id'>) => {
    if (!currentLayout) return;
    
    const newWidget: DashboardWidget = {
      ...widget,
      id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    
    const updatedLayout = {
      ...currentLayout,
      widgets: [...currentLayout.widgets, newWidget]
    };
    
    setCurrentLayoutState(updatedLayout);
  }, [currentLayout]);

  const removeWidget = useCallback((widgetId: string) => {
    if (!currentLayout) return;
    
    const updatedLayout = {
      ...currentLayout,
      widgets: currentLayout.widgets.filter(widget => widget.id !== widgetId)
    };
    
    setCurrentLayoutState(updatedLayout);
  }, [currentLayout]);

  const updateWidget = useCallback((widgetId: string, updates: Partial<DashboardWidget>) => {
    if (!currentLayout) return;
    
    const updatedLayout = {
      ...currentLayout,
      widgets: currentLayout.widgets.map(widget =>
        widget.id === widgetId ? { ...widget, ...updates } : widget
      )
    };
    
    setCurrentLayoutState(updatedLayout);
  }, [currentLayout]);

  const moveWidget = useCallback((widgetId: string, position: DashboardWidget['position']) => {
    updateWidget(widgetId, { position });
  }, [updateWidget]);

  const toggleWidgetVisibility = useCallback((widgetId: string) => {
    if (!currentLayout) return;
    
    const widget = currentLayout.widgets.find(w => w.id === widgetId);
    if (widget) {
      updateWidget(widgetId, { visible: !widget.visible });
    }
  }, [currentLayout, updateWidget]);

  // ========== EDIT MODE ==========
  const enableEditMode = useCallback(() => setIsEditMode(true), []);
  const disableEditMode = useCallback(() => {
    setIsEditMode(false);
    saveCurrentLayout();
  }, [saveCurrentLayout]);

  const setDragging = useCallback((dragging: boolean) => setIsDragging(dragging), []);

  // ========== UTILITIES ==========
  const resetToDefault = useCallback(() => {
    const defaultLayout = personalization ? 
      BUSINESS_LAYOUT_TEMPLATES[personalization.businessType] || BUSINESS_LAYOUT_TEMPLATES.solo_entrepreneur :
      BUSINESS_LAYOUT_TEMPLATES.solo_entrepreneur;
    
    setCurrentLayoutState(defaultLayout);
  }, [personalization]);

  const exportLayout = useCallback((): string => {
    return JSON.stringify({
      layout: currentLayout,
      personalization,
      version: '1.0'
    }, null, 2);
  }, [currentLayout, personalization]);

  const importLayout = useCallback((layoutData: string): boolean => {
    try {
      const parsed = JSON.parse(layoutData);
      if (parsed.layout && parsed.version) {
        setCurrentLayoutState(parsed.layout);
        if (parsed.personalization) {
          setPersonalizationState(parsed.personalization);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error importing layout:', error);
      return false;
    }
  }, []);

  const getWidgetsByType = useCallback((type: DashboardWidget['type']): DashboardWidget[] => {
    return currentLayout?.widgets.filter(widget => widget.type === type) || [];
  }, [currentLayout]);

  // ========== CONTEXT VALUE ==========
  const contextValue: DashboardCustomizationContextValue = {
    // Current State
    currentLayout,
    personalization,
    isEditMode,
    isDragging,
    
    // Layout Management
    availableLayouts,
    customLayouts,
    
    // Personalization
    setPersonalization,
    generatePersonalizedLayout,
    applyBusinessSetupResults,
    
    // Layout Operations  
    setCurrentLayout,
    createCustomLayout,
    saveCurrentLayout,
    deleteCustomLayout,
    
    // Widget Operations
    addWidget,
    removeWidget,
    updateWidget,
    moveWidget,
    toggleWidgetVisibility,
    
    // Edit Mode
    enableEditMode,
    disableEditMode,
    setDragging,
    
    // Utilities
    resetToDefault,
    exportLayout,
    importLayout,
    getWidgetsByType
  };

  return (
    <DashboardCustomizationContext.Provider value={contextValue}>
      {children}
    </DashboardCustomizationContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

export function useDashboardCustomization() {
  const context = useContext(DashboardCustomizationContext);
  if (context === undefined) {
    throw new Error('useDashboardCustomization must be used within a DashboardCustomizationProvider');
  }
  return context;
}