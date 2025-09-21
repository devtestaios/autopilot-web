'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Grid3X3, 
  Settings, 
  Plus, 
  Trash2, 
  Move, 
  Save, 
  RotateCcw, 
  Eye,
  EyeOff,
  ChevronDown,
  GripVertical,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Activity,
  Clock,
  Zap
} from 'lucide-react';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { useToast } from '@/components/ui/Toast';

// Widget Types
export interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'insights';
  title: string;
  component: string;
  size: 'small' | 'medium' | 'large' | 'full';
  position: { x: number; y: number };
  visible: boolean;
  config: Record<string, any>;
}

// Available Widget Templates
const WIDGET_TEMPLATES: Omit<DashboardWidget, 'id' | 'position'>[] = [
  {
    type: 'metric',
    title: 'Total Revenue',
    component: 'RevenueMetric',
    size: 'small',
    visible: true,
    config: { metric: 'revenue', period: '30d' }
  },
  {
    type: 'metric',
    title: 'Active Campaigns',
    component: 'CampaignMetric',
    size: 'small',
    visible: true,
    config: { metric: 'campaigns', status: 'active' }
  },
  {
    type: 'chart',
    title: 'Performance Trends',
    component: 'PerformanceChart',
    size: 'medium',
    visible: true,
    config: { chartType: 'line', period: '7d' }
  },
  {
    type: 'chart',
    title: 'Platform Breakdown',
    component: 'PlatformChart',
    size: 'medium',
    visible: true,
    config: { chartType: 'pie', metric: 'spend' }
  },
  {
    type: 'table',
    title: 'Top Campaigns',
    component: 'TopCampaignsTable',
    size: 'large',
    visible: true,
    config: { limit: 10, sortBy: 'performance' }
  },
  {
    type: 'insights',
    title: 'AI Recommendations',
    component: 'AIInsights',
    size: 'large',
    visible: true,
    config: { maxInsights: 5, confidenceThreshold: 80 }
  }
];

interface DashboardCustomizerProps {
  widgets: DashboardWidget[];
  onWidgetsChange: (widgets: DashboardWidget[]) => void;
  onSave: () => void;
  isEditMode: boolean;
  onEditModeChange: (editing: boolean) => void;
}

export default function DashboardCustomizer({
  widgets,
  onWidgetsChange,
  onSave,
  isEditMode,
  onEditModeChange
}: DashboardCustomizerProps) {
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [showWidgetPanel, setShowWidgetPanel] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);
  const { showToast } = useToast();

  // Add widget to dashboard
  const addWidget = (template: Omit<DashboardWidget, 'id' | 'position'>) => {
    const newWidget: DashboardWidget = {
      ...template,
      id: `widget-${Date.now()}`,
      position: { x: widgets.length % 4, y: Math.floor(widgets.length / 4) }
    };

    onWidgetsChange([...widgets, newWidget]);
    setShowWidgetPanel(false);
    
    showToast({
      type: 'success',
      title: 'Widget Added',
      description: `${template.title} has been added to your dashboard`
    });
  };

  // Remove widget
  const removeWidget = (widgetId: string) => {
    const updatedWidgets = widgets.filter(w => w.id !== widgetId);
    onWidgetsChange(updatedWidgets);
    setSelectedWidget(null);
    
    showToast({
      type: 'info',
      title: 'Widget Removed',
      description: 'Widget has been removed from your dashboard'
    });
  };

  // Toggle widget visibility
  const toggleWidgetVisibility = (widgetId: string) => {
    const updatedWidgets = widgets.map(w => 
      w.id === widgetId ? { ...w, visible: !w.visible } : w
    );
    onWidgetsChange(updatedWidgets);
  };

  // Update widget size
  const updateWidgetSize = (widgetId: string, size: DashboardWidget['size']) => {
    const updatedWidgets = widgets.map(w => 
      w.id === widgetId ? { ...w, size } : w
    );
    onWidgetsChange(updatedWidgets);
  };

  // Reset dashboard to defaults
  const resetDashboard = () => {
    const defaultWidgets: DashboardWidget[] = WIDGET_TEMPLATES.map((template, index) => ({
      ...template,
      id: `default-${index}`,
      position: { x: index % 3, y: Math.floor(index / 3) }
    }));
    
    onWidgetsChange(defaultWidgets);
    setSelectedWidget(null);
    
    showToast({
      type: 'info',
      title: 'Dashboard Reset',
      description: 'Dashboard has been reset to default layout'
    });
  };

  // Save dashboard configuration
  const saveDashboard = () => {
    onSave();
    onEditModeChange(false);
    
    showToast({
      type: 'success',
      title: 'Dashboard Saved',
      description: 'Your dashboard configuration has been saved'
    });
  };

  // Get widget icon
  const getWidgetIcon = (type: DashboardWidget['type']) => {
    switch (type) {
      case 'metric':
        return BarChart3;
      case 'chart':
        return TrendingUp;
      case 'table':
        return Grid3X3;
      case 'insights':
        return Zap;
      default:
        return Activity;
    }
  };

  // Get size display name
  const getSizeDisplay = (size: DashboardWidget['size']) => {
    switch (size) {
      case 'small':
        return '1x1';
      case 'medium':
        return '2x1';
      case 'large':
        return '2x2';
      case 'full':
        return '4x1';
      default:
        return '1x1';
    }
  };

  return (
    <div className="relative">
      {/* Customization Toolbar */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <PremiumCard className="flex items-center gap-4 px-6 py-3 shadow-lg">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="font-medium text-gray-900 dark:text-white">
                  Dashboard Editor
                </span>
              </div>
              
              <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />
              
              <div className="flex items-center gap-2">
                <PremiumButton
                  variant="outline"
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={() => setShowWidgetPanel(!showWidgetPanel)}
                >
                  Add Widget
                </PremiumButton>
                
                <PremiumButton
                  variant="outline"
                  size="sm"
                  icon={<RotateCcw className="w-4 h-4" />}
                  onClick={resetDashboard}
                >
                  Reset
                </PremiumButton>
                
                <PremiumButton
                  variant="outline"
                  size="sm"
                  icon={<Save className="w-4 h-4" />}
                  onClick={saveDashboard}
                >
                  Save
                </PremiumButton>
                
                <PremiumButton
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditModeChange(false)}
                >
                  Cancel
                </PremiumButton>
              </div>
            </PremiumCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Widget Selection Panel */}
      <AnimatePresence>
        {showWidgetPanel && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed right-4 top-32 z-40 w-80"
          >
            <PremiumCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Add Widget
                </h3>
                <PremiumButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowWidgetPanel(false)}
                >
                  ×
                </PremiumButton>
              </div>
              
              <div className="space-y-3">
                {WIDGET_TEMPLATES.map((template, index) => {
                  const Icon = getWidgetIcon(template.type);
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      onClick={() => addWidget(template)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                          <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                            {template.title}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {template.type} • {getSizeDisplay(template.size)}
                          </p>
                        </div>
                        <Plus className="w-4 h-4 text-gray-400" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </PremiumCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Widget Configuration Panel */}
      <AnimatePresence>
        {selectedWidget && isEditMode && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed left-4 top-32 z-40 w-80"
          >
            <PremiumCard className="p-6">
              {(() => {
                const widget = widgets.find(w => w.id === selectedWidget);
                if (!widget) return null;

                const Icon = getWidgetIcon(widget.type);

                return (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                          <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {widget.title}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {widget.type}
                          </p>
                        </div>
                      </div>
                      <PremiumButton
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedWidget(null)}
                      >
                        ×
                      </PremiumButton>
                    </div>

                    <div className="space-y-4">
                      {/* Size Control */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Size
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {(['small', 'medium', 'large', 'full'] as const).map(size => (
                            <PremiumButton
                              key={size}
                              variant={widget.size === size ? 'primary' : 'outline'}
                              size="sm"
                              onClick={() => updateWidgetSize(widget.id, size)}
                              className="text-xs"
                            >
                              {getSizeDisplay(size)}
                            </PremiumButton>
                          ))}
                        </div>
                      </div>

                      {/* Visibility Control */}
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Visible
                        </label>
                        <PremiumButton
                          variant="ghost"
                          size="sm"
                          icon={widget.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          onClick={() => toggleWidgetVisibility(widget.id)}
                        >
                          {widget.visible ? 'Visible' : 'Hidden'}
                        </PremiumButton>
                      </div>

                      {/* Remove Widget */}
                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <PremiumButton
                          variant="outline"
                          size="sm"
                          icon={<Trash2 className="w-4 h-4" />}
                          onClick={() => removeWidget(widget.id)}
                          className="w-full text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                        >
                          Remove Widget
                        </PremiumButton>
                      </div>
                    </div>
                  </>
                );
              })()}
            </PremiumCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Mode Toggle Button */}
      {!isEditMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-6 right-6 z-30"
        >
          <PremiumButton
            variant="primary"
            size="lg"
            icon={<Settings className="w-5 h-5" />}
            onClick={() => onEditModeChange(true)}
            className="shadow-lg"
          >
            Customize Dashboard
          </PremiumButton>
        </motion.div>
      )}
    </div>
  );
}