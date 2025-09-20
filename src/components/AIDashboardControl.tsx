'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Eye, 
  Settings, 
  BarChart3, 
  TrendingUp, 
  DollarSign,
  Activity,
  Shield,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Move,
  X,
  Plus,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAIControl } from '@/contexts/AIControlContext';

interface DashboardWidget {
  id: string;
  title: string;
  component: React.ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  minimized: boolean;
  aiControlled: boolean;
  permissions: string[];
}

interface AIDashboardControlProps {
  className?: string;
}

const defaultWidgets: DashboardWidget[] = [
  {
    id: 'performance-overview',
    title: 'AI Performance Monitor',
    component: <AIPerformanceWidget />,
    position: { x: 0, y: 0 },
    size: { width: 400, height: 300 },
    minimized: false,
    aiControlled: true,
    permissions: ['dashboard:read', 'analytics:view']
  },
  {
    id: 'campaign-controls',
    title: 'AI Campaign Controls',
    component: <AICampaignControlWidget />,
    position: { x: 420, y: 0 },
    size: { width: 350, height: 250 },
    minimized: false,
    aiControlled: true,
    permissions: ['campaigns:control', 'ai:execute']
  },
  {
    id: 'optimization-engine',
    title: 'Auto-Optimization Engine',
    component: <AIOptimizationWidget />,
    position: { x: 0, y: 320 },
    size: { width: 380, height: 280 },
    minimized: false,
    aiControlled: true,
    permissions: ['optimize:execute', 'budget:modify']
  }
];

export default function AIDashboardControl({ className }: AIDashboardControlProps) {
  const [widgets, setWidgets] = useState<DashboardWidget[]>(defaultWidgets);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const { 
    aiStatus, 
    autonomousMode, 
    executeAIAction,
    pendingActions,
    actionHistory 
  } = useAIControl();

  const handleWidgetMove = (widgetId: string, newPosition: { x: number; y: number }) => {
    setWidgets(prev => 
      prev.map(widget => 
        widget.id === widgetId 
          ? { ...widget, position: newPosition }
          : widget
      )
    );
  };

  const handleWidgetResize = (widgetId: string, newSize: { width: number; height: number }) => {
    setWidgets(prev => 
      prev.map(widget => 
        widget.id === widgetId 
          ? { ...widget, size: newSize }
          : widget
      )
    );
  };

  const toggleWidgetMinimized = (widgetId: string) => {
    setWidgets(prev => 
      prev.map(widget => 
        widget.id === widgetId 
          ? { ...widget, minimized: !widget.minimized }
          : widget
      )
    );
  };

  const removeWidget = (widgetId: string) => {
    setWidgets(prev => prev.filter(widget => widget.id !== widgetId));
  };

  const addWidget = (type: string) => {
    const newWidget: DashboardWidget = {
      id: `widget_${Date.now()}`,
      title: `New ${type} Widget`,
      component: <div className="p-4 text-center text-gray-500">New {type} Widget</div>,
      position: { x: Math.random() * 200, y: Math.random() * 200 },
      size: { width: 300, height: 200 },
      minimized: false,
      aiControlled: true,
      permissions: ['dashboard:read']
    };
    
    setWidgets(prev => [...prev, newWidget]);
  };

  // AI can control this dashboard through voice/chat commands
  useEffect(() => {
    const handleAICommand = (command: string) => {
      const lowerCommand = command.toLowerCase();
      
      if (lowerCommand.includes('minimize all')) {
        setWidgets(prev => prev.map(w => ({ ...w, minimized: true })));
      } else if (lowerCommand.includes('maximize all')) {
        setWidgets(prev => prev.map(w => ({ ...w, minimized: false })));
      } else if (lowerCommand.includes('add widget')) {
        addWidget('analytics');
      } else if (lowerCommand.includes('reset dashboard')) {
        setWidgets(defaultWidgets);
      }
    };

    // Listen for AI commands (this would be connected to the AI chat system)
    window.addEventListener('ai-dashboard-command', (e: any) => {
      handleAICommand(e.detail.command);
    });

    return () => {
      window.removeEventListener('ai-dashboard-command', () => {});
    };
  }, []);

  return (
    <div className={cn("relative w-full h-full min-h-screen bg-gray-50 dark:bg-gray-900", className)}>
      {/* AI Status Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={cn(
                "w-3 h-3 rounded-full",
                aiStatus === 'active' ? 'bg-green-400 animate-pulse' :
                aiStatus === 'processing' ? 'bg-yellow-400 animate-pulse' :
                aiStatus === 'error' ? 'bg-red-400' : 'bg-gray-400'
              )} />
              <span className="font-semibold text-gray-900 dark:text-white">
                AI Dashboard Control {autonomousMode ? '(Autonomous)' : '(Supervised)'}
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {actionHistory.filter(a => a.status === 'completed').length} actions completed
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => addWidget('analytics')}
              className="flex items-center space-x-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Widget</span>
            </button>
            <button
              onClick={() => setWidgets(defaultWidgets)}
              className="flex items-center space-x-2 px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Widget Container */}
      <div className="pt-20 p-6 relative">
        <AnimatePresence>
          {widgets.map((widget) => (
            <WidgetContainer
              key={widget.id}
              widget={widget}
              onMove={handleWidgetMove}
              onResize={handleWidgetResize}
              onToggleMinimized={toggleWidgetMinimized}
              onRemove={removeWidget}
            />
          ))}
        </AnimatePresence>

        {/* AI Action Overlay */}
        {pendingActions.length > 0 && (
          <div className="fixed bottom-4 right-4 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg p-4 max-w-sm">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              Pending AI Actions ({pendingActions.length})
            </h3>
            <div className="space-y-2">
              {pendingActions.slice(0, 3).map((action) => (
                <div key={action.id} className="text-sm text-yellow-700 dark:text-yellow-300">
                  {action.function}: {action.arguments.description || 'Waiting for approval'}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Widget Container Component
function WidgetContainer({ 
  widget, 
  onMove, 
  onResize, 
  onToggleMinimized, 
  onRemove 
}: {
  widget: DashboardWidget;
  onMove: (id: string, position: { x: number; y: number }) => void;
  onResize: (id: string, size: { width: number; height: number }) => void;
  onToggleMinimized: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - widget.position.x,
      y: e.clientY - widget.position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      onMove(widget.id, {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        x: widget.position.x,
        y: widget.position.y,
        width: widget.minimized ? 300 : widget.size.width,
        height: widget.minimized ? 50 : widget.size.height
      }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
      style={{ zIndex: isDragging ? 1000 : 1 }}
    >
      {/* Widget Header */}
      <div 
        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center space-x-2">
          <Move className="w-4 h-4 text-gray-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">{widget.title}</h3>
          {widget.aiControlled && (
            <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
              AI
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onToggleMinimized(widget.id)}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
          >
            {widget.minimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onRemove(widget.id)}
            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Widget Content */}
      {!widget.minimized && (
        <div className="p-4">
          {widget.component}
        </div>
      )}
    </motion.div>
  );
}

// AI-Controlled Widget Components
function AIPerformanceWidget() {
  const { aiStatus, actionHistory } = useAIControl();
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">AI Status</span>
          </div>
          <p className="text-lg font-bold text-green-900 dark:text-green-100 capitalize">{aiStatus}</p>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Actions</span>
          </div>
          <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
            {actionHistory.filter(a => a.status === 'completed').length}
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="font-medium text-gray-900 dark:text-white">Recent AI Activity</h4>
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {actionHistory.slice(-5).reverse().map((action) => (
            <div key={action.id} className="flex items-center space-x-2 text-sm">
              <div className={cn(
                "w-2 h-2 rounded-full",
                action.status === 'completed' ? 'bg-green-400' :
                action.status === 'failed' ? 'bg-red-400' :
                action.status === 'executing' ? 'bg-yellow-400' : 'bg-gray-400'
              )} />
              <span className="text-gray-600 dark:text-gray-300">{action.function}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AICampaignControlWidget() {
  const { executeAIAction, autonomousMode } = useAIControl();
  
  const handleQuickAction = (action: string) => {
    executeAIAction({
      type: 'campaign_action',
      function: action,
      arguments: { source: 'dashboard_widget' },
      human_approval_required: !autonomousMode
    });
  };
  
  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900 dark:text-white">Quick Campaign Actions</h4>
      
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handleQuickAction('optimize_all_campaigns')}
          className="flex items-center justify-center space-x-2 p-3 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Optimize All</span>
        </button>
        
        <button
          onClick={() => handleQuickAction('pause_underperforming')}
          className="flex items-center justify-center space-x-2 p-3 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg transition-colors"
        >
          <Pause className="w-4 h-4" />
          <span className="text-sm font-medium">Pause Poor</span>
        </button>
        
        <button
          onClick={() => handleQuickAction('increase_top_budgets')}
          className="flex items-center justify-center space-x-2 p-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg transition-colors"
        >
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-medium">Boost Top</span>
        </button>
        
        <button
          onClick={() => handleQuickAction('analyze_performance')}
          className="flex items-center justify-center space-x-2 p-3 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg transition-colors"
        >
          <BarChart3 className="w-4 h-4" />
          <span className="text-sm font-medium">Analyze</span>
        </button>
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        {autonomousMode ? '🤖 AI will execute automatically' : '👤 Requires human approval'}
      </div>
    </div>
  );
}

function AIOptimizationWidget() {
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [isOptimizing, setIsOptimizing] = useState(false);
  
  const startOptimization = () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);
    
    const interval = setInterval(() => {
      setOptimizationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsOptimizing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900 dark:text-white">Auto-Optimization</h4>
        <button
          onClick={startOptimization}
          disabled={isOptimizing}
          className="px-3 py-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded text-sm transition-colors"
        >
          {isOptimizing ? 'Optimizing...' : 'Start'}
        </button>
      </div>
      
      {isOptimizing && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-300">Progress</span>
            <span className="text-gray-600 dark:text-gray-300">{optimizationProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${optimizationProgress}%` }}
            />
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500 dark:text-gray-400">Campaigns Optimized</p>
          <p className="font-bold text-gray-900 dark:text-white">12</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400">Performance Boost</p>
          <p className="font-bold text-green-600">+18.5%</p>
        </div>
      </div>
    </div>
  );
}