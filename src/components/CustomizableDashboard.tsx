'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useDashboardCustomization, DashboardWidget, WIDGET_TEMPLATES } from '@/contexts/DashboardCustomizationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Edit3,
  Save,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Move,
  RotateCcw,
  Download,
  Upload,
  Grid3X3,
  Maximize2,
  Minimize2,
  Settings,
  TrendingUp,
  BarChart3,
  DollarSign,
  Users,
  Target,
  Zap,
  Activity,
  MessageSquare,
  Clock,
  Sparkles
} from 'lucide-react';

// Make the grid responsive
const ResponsiveGridLayout = WidthProvider(Responsive);

// Widget type icons
const WIDGET_ICONS = {
  metric: TrendingUp,
  chart: BarChart3,
  list: Activity,
  feed: MessageSquare,
  'ai-insights': Sparkles,
  'quick-actions': Zap,
  'recent-activity': Clock
};

// ============================================================================
// DASHBOARD WIDGET COMPONENT
// ============================================================================

interface DashboardWidgetComponentProps {
  widget: DashboardWidget;
  isEditMode: boolean;
  onUpdate: (updates: Partial<DashboardWidget>) => void;
  onRemove: () => void;
}

function DashboardWidgetComponent({ widget, isEditMode, onUpdate, onRemove }: DashboardWidgetComponentProps) {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = WIDGET_ICONS[widget.type] || Activity;

  const handleToggleVisibility = () => {
    onUpdate({ visible: !widget.visible });
  };

  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'metric':
        return (
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {widget.config?.format === 'currency' ? '$124,350' : 
               widget.config?.format === 'percentage' ? '23.4%' : '1,234'}
            </div>
            <p className="text-sm text-gray-500">
              {widget.config?.trend ? '+12% from last month' : 'This month'}
            </p>
          </div>
        );
      
      case 'chart':
        return (
          <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-blue-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                {widget.config?.chartType || 'Line'} Chart
              </p>
            </div>
          </div>
        );
      
      case 'list':
        return (
          <div className="space-y-2">
            {Array.from({ length: widget.config?.limit || 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                <span className="text-sm">Item {i + 1}</span>
                <Badge variant="outline">Active</Badge>
              </div>
            ))}
          </div>
        );
      
      case 'feed':
        return (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">Activity {i + 1}</p>
                  <p className="text-xs text-gray-500">{i + 1} hour ago</p>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'ai-insights':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">AI Recommendations</span>
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-sm">Recommendation {i + 1}: Optimize your campaign targeting</p>
              </div>
            ))}
          </div>
        );
      
      case 'quick-actions':
        return (
          <div className="grid grid-cols-2 gap-3">
            {['Campaign', 'Lead', 'Post', 'Report'].map((action, i) => (
              <Button key={i} variant="outline" size="sm" className="h-16 flex-col">
                <Plus className="h-4 w-4 mb-1" />
                <span className="text-xs">{action}</span>
              </Button>
            ))}
          </div>
        );
      
      default:
        return (
          <div className="h-full flex items-center justify-center text-gray-500">
            <div className="text-center">
              <IconComponent className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm">{widget.title}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div
      layout
      className={`h-full ${!widget.visible ? 'opacity-50' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: isEditMode ? 1.02 : 1 }}
    >
      <Card className={`h-full relative ${isEditMode ? 'border-dashed border-2 border-blue-300' : ''}`}>
        {/* Edit Mode Controls */}
        {isEditMode && (
          <div className="absolute top-2 right-2 z-10 flex gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={handleToggleVisibility}
              className="h-6 w-6 p-0"
            >
              {widget.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onRemove}
              className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        )}
        
        {/* Drag Handle */}
        {isEditMode && (
          <div className="drag-handle absolute top-2 left-2 cursor-move z-10">
            <Move className="h-4 w-4 text-gray-400" />
          </div>
        )}

        <CardHeader className={`pb-3 ${isEditMode ? 'pt-8' : ''}`}>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <IconComponent className="h-4 w-4" />
            {widget.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-0">
          {renderWidgetContent()}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============================================================================
// WIDGET SELECTOR COMPONENT
// ============================================================================

interface WidgetSelectorProps {
  onAddWidget: (widget: Omit<DashboardWidget, 'id' | 'position'>) => void;
  onClose: () => void;
}

function WidgetSelector({ onAddWidget, onClose }: WidgetSelectorProps) {
  const categories = {
    'Metrics': ['revenue', 'leads', 'campaigns', 'conversion_rate'],
    'Charts': ['performance_chart', 'platform_breakdown', 'roi_trends'],
    'Lists & Feeds': ['top_campaigns', 'recent_leads', 'active_projects', 'team_activity'],
    'AI & Automation': ['ai_insights', 'ai_alerts'],
    'Quick Actions': ['quick_actions', 'recent_activity']
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-4xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Add Widget</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(categories).map(([category, widgetIds]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-3">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {widgetIds.map((widgetId) => {
                    const template = WIDGET_TEMPLATES[widgetId];
                    if (!template) return null;
                    
                    const IconComponent = WIDGET_ICONS[template.type] || Activity;
                    
                    return (
                      <Card 
                        key={widgetId}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => {
                          onAddWidget({
                            ...template,
                            position: { x: 0, y: 0, w: 4, h: 3 } // Default position
                          });
                          onClose();
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <IconComponent className="h-6 w-6 text-blue-600" />
                            <div>
                              <h4 className="font-medium">{template.title}</h4>
                              <p className="text-sm text-gray-500">
                                {template.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ============================================================================
// MAIN CUSTOMIZABLE DASHBOARD COMPONENT
// ============================================================================

export default function CustomizableDashboard() {
  const {
    currentLayout,
    isEditMode,
    enableEditMode,
    disableEditMode,
    updateWidget,
    addWidget,
    removeWidget,
    moveWidget,
    resetToDefault,
    saveCurrentLayout,
    createCustomLayout
  } = useDashboardCustomization();

  const [showWidgetSelector, setShowWidgetSelector] = useState(false);
  const [gridKey, setGridKey] = useState(0); // Force re-render when layout changes

  // Force grid re-render when switching edit modes
  useEffect(() => {
    setGridKey(prev => prev + 1);
  }, [isEditMode]);

  const handleLayoutChange = useCallback((layout: any[]) => {
    if (!currentLayout || !isEditMode) return;
    
    // Update widget positions based on grid layout changes
    layout.forEach((item) => {
      const widget = currentLayout.widgets.find(w => w.id === item.i);
      if (widget) {
        moveWidget(widget.id, {
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h
        });
      }
    });
  }, [currentLayout, isEditMode, moveWidget]);

  const handleSaveLayout = async () => {
    await saveCurrentLayout();
    disableEditMode();
  };

  const handleCreateCustom = () => {
    const name = prompt('Enter a name for your custom layout:');
    if (name) {
      createCustomLayout(name);
    }
  };

  if (!currentLayout) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Convert widgets to grid layout format
  const gridLayouts = {
    lg: currentLayout.widgets.map(widget => ({
      i: widget.id,
      x: widget.position.x,
      y: widget.position.y,
      w: widget.position.w,
      h: widget.position.h,
      minW: 2,
      minH: 2
    }))
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentLayout.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {currentLayout.description}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {!isEditMode ? (
            <>
              <Button variant="outline" onClick={enableEditMode}>
                <Edit3 className="h-4 w-4 mr-2" />
                Customize
              </Button>
              <Button variant="outline" onClick={resetToDefault}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setShowWidgetSelector(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Widget
              </Button>
              <Button variant="outline" onClick={handleCreateCustom}>
                <Save className="h-4 w-4 mr-2" />
                Save as New
              </Button>
              <Button variant="outline" onClick={disableEditMode}>
                Cancel
              </Button>
              <Button onClick={handleSaveLayout}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Edit Mode Notice */}
      {isEditMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <Edit3 className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900 dark:text-blue-100">
                Customization Mode Active
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Drag widgets to rearrange, use controls to add/remove widgets, or toggle visibility.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Responsive Grid Dashboard */}
      <ResponsiveGridLayout
        key={gridKey}
        className="layout"
        layouts={gridLayouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: currentLayout.gridSize.cols, md: 8, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60}
        onLayoutChange={handleLayoutChange}
        isDraggable={isEditMode}
        isResizable={isEditMode}
        margin={[16, 16]}
        containerPadding={[0, 0]}
        dragHandle={isEditMode ? '.drag-handle' : undefined}
        compactType="vertical"
        preventCollision={false}
      >
        {currentLayout.widgets.map((widget) => (
          <div key={widget.id} className="dashboard-widget">
            <DashboardWidgetComponent
              widget={widget}
              isEditMode={isEditMode}
              onUpdate={(updates) => updateWidget(widget.id, updates)}
              onRemove={() => removeWidget(widget.id)}
            />
          </div>
        ))}
      </ResponsiveGridLayout>

      {/* Widget Selector Modal */}
      <AnimatePresence>
        {showWidgetSelector && (
          <WidgetSelector
            onAddWidget={addWidget}
            onClose={() => setShowWidgetSelector(false)}
          />
        )}
      </AnimatePresence>

      {/* Required Grid Layout CSS */}
      <style jsx global>{`
        .react-grid-layout {
          position: relative;
        }
        .react-grid-item {
          transition: all 200ms ease;
          transition-property: left, top;
        }
        .react-grid-item.cssTransforms {
          transition-property: transform;
        }
        .react-grid-item > .react-resizable-handle {
          position: absolute;
          width: 20px;
          height: 20px;
          bottom: 0;
          right: 0;
          background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNiIgaGVpZ2h0PSI2IiB2aWV3Qm94PSIwIDAgNiA2IiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZG90cyBmaWxsPSIjOTk5IiBkPSJtMTUgMTJjMCAuNTUyMjg0NzUtLjQ0NzcxNTI1IDEtMSAxcy0xLS40NDc3MTUyNS0xLTEgLjQ0NzcxNTI1LTEgMS0xIDEgLjQ0NzcxNTI1IDEgMXptLTQgMGMwIC41NTIyODQ3NS0uNDQ3NzE1MjUgMS0xIDFzLTEtLjQ0NzcxNTI1LTEtMSAuNDQ3NzE1MjUtMSAxLTEgMSAuNDQ3NzE1MjUgMSAxem0tNCAwYzAgLjU1MjI4NDc1LS40NDc3MTUyNSAxLTEgMXMtMS0uNDQ3NzE1MjUtMS0xIC40NDc3MTUyNS0xIDEtMSAxIC40NDc3MTUyNSAxIDFaIi8+Cjwvc3ZnPgo=');
          background-repeat: no-repeat;
          background-position: bottom right;
          padding: 0 3px 3px 0;
          background-size: 100% 100%;
          cursor: se-resize;
        }
        .react-grid-item.react-grid-placeholder {
          background: rgb(59 130 246 / 0.3);
          border-radius: 4px;
          opacity: 0.6;
          transition-duration: 100ms;
          z-index: 2;
          user-select: none;
        }
        .dashboard-widget {
          height: 100%;
        }
      `}</style>
    </div>
  );
}