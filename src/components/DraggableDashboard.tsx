'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  UniqueIdentifier
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import {
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Target, TrendingUp, DollarSign, BarChart3, Users, Zap, 
  Activity, Clock, AlertCircle, ChevronRight, ExternalLink,
  Globe, Rocket, Shield, Brain, Play, Settings, 
  MessageSquare, Calendar, FileText, PieChart, GripVertical,
  Edit3, RotateCcw, Save, X, Plus, Grid3X3, List, Monitor,
  Smartphone, Tablet, Layout, LayoutGrid, LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Widget Types
export interface DashboardWidget {
  id: string;
  type: 'kpi' | 'platform-suite' | 'sub-platform' | 'chart' | 'activity-feed' | 'quick-actions' | 'custom';
  title: string;
  description?: string;
  size: 'small' | 'medium' | 'large' | 'extra-large';
  position: { x: number; y: number; w: number; h: number };
  isLocked?: boolean;
  isVisible?: boolean;
  data?: any;
  configurable?: boolean;
  icon?: React.ComponentType<any>;
  color?: string;
  href?: string;
}

export interface DashboardLayout {
  id: string;
  name: string;
  description: string;
  widgets: DashboardWidget[];
  gridCols: number;
  gridRows: number;
  responsive: boolean;
  lastModified: Date;
}

// Layout Presets with simplified widgets
export const LAYOUT_PRESETS: DashboardLayout[] = [
  {
    id: 'executive',
    name: 'Executive Overview',
    description: 'High-level KPIs and platform summaries for leadership',
    gridCols: 4,
    gridRows: 6,
    responsive: true,
    lastModified: new Date(),
    widgets: [
      {
        id: 'revenue-kpi',
        type: 'kpi',
        title: 'Total Revenue',
        size: 'medium',
        position: { x: 0, y: 0, w: 1, h: 1 },
        data: { value: '$487,320', change: '+18.2%', changeType: 'positive', icon: DollarSign, color: 'text-green-600' }
      },
      {
        id: 'campaigns-kpi',
        type: 'kpi',
        title: 'Active Campaigns',
        size: 'medium',
        position: { x: 1, y: 0, w: 1, h: 1 },
        data: { value: '24', change: '+12.5%', changeType: 'positive', icon: Target, color: 'text-blue-600' }
      },
      {
        id: 'leads-kpi',
        type: 'kpi',
        title: 'Total Leads',
        size: 'medium',
        position: { x: 2, y: 0, w: 1, h: 1 },
        data: { value: '1,847', change: '+8.3%', changeType: 'positive', icon: Users, color: 'text-purple-600' }
      },
      {
        id: 'conversion-kpi',
        type: 'kpi',
        title: 'Conversion Rate',
        size: 'medium',
        position: { x: 3, y: 0, w: 1, h: 1 },
        data: { value: '3.2%', change: '+0.8%', changeType: 'positive', icon: TrendingUp, color: 'text-emerald-600' }
      }
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing Focus',
    description: 'Optimized for marketing teams and campaign management',
    gridCols: 6,
    gridRows: 8,
    responsive: true,
    lastModified: new Date(),
    widgets: [
      {
        id: 'marketing-revenue',
        type: 'kpi',
        title: 'Marketing Revenue',
        size: 'medium',
        position: { x: 0, y: 0, w: 2, h: 1 },
        data: { value: '$287,320', change: '+22.1%', changeType: 'positive', icon: DollarSign, color: 'text-green-600' }
      },
      {
        id: 'marketing-campaigns',
        type: 'kpi',
        title: 'Active Campaigns',
        size: 'medium',
        position: { x: 2, y: 0, w: 2, h: 1 },
        data: { value: '18', change: '+15.2%', changeType: 'positive', icon: Target, color: 'text-blue-600' }
      },
      {
        id: 'marketing-leads',
        type: 'kpi',
        title: 'Generated Leads',
        size: 'medium',
        position: { x: 4, y: 0, w: 2, h: 1 },
        data: { value: '1,247', change: '+18.7%', changeType: 'positive', icon: Users, color: 'text-purple-600' }
      }
    ]
  }
];

// Device detection hook
export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      if (width >= 1024) setDeviceType('desktop');
      else if (width >= 768) setDeviceType('tablet');
      else setDeviceType('mobile');
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return deviceType;
};

// Sortable Widget Component
interface SortableWidgetProps {
  widget: DashboardWidget;
  isEditing: boolean;
  onEdit?: (widget: DashboardWidget) => void;
  onDelete?: (widgetId: string) => void;
  children: React.ReactNode;
}

function SortableWidget({ widget, isEditing, onEdit, onDelete, children }: SortableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver
  } = useSortable({ 
    id: widget.id,
    disabled: !isEditing || widget.isLocked
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative group transition-all duration-200
        ${isDragging ? 'scale-105 shadow-2xl' : ''}
        ${isOver ? 'ring-2 ring-blue-500' : ''}
        ${isEditing ? 'ring-1 ring-dashed ring-gray-300 dark:ring-gray-600' : ''}
        ${widget.isLocked ? 'opacity-75' : ''}
      `}
    >
      {/* Drag Handle */}
      {isEditing && !widget.isLocked && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 z-10 p-1 bg-white dark:bg-gray-800 rounded shadow-sm cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-4 h-4 text-gray-500" />
        </div>
      )}

      {/* Widget Controls */}
      {isEditing && (
        <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {widget.configurable && onEdit && (
            <button
              onClick={() => onEdit(widget)}
              className="p-1 bg-white dark:bg-gray-800 rounded shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Edit3 className="w-4 h-4 text-gray-500" />
            </button>
          )}
          {onDelete && !widget.isLocked && (
            <button
              onClick={() => onDelete(widget.id)}
              className="p-1 bg-white dark:bg-gray-800 rounded shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
          )}
        </div>
      )}

      {children}
    </div>
  );
}

// Individual Widget Components
interface WidgetProps {
  widget: DashboardWidget;
  isEditing?: boolean;
}

function KPIWidget({ widget }: WidgetProps) {
  const { data } = widget;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
          {data.icon && <data.icon className={`w-6 h-6 ${data.color}`} />}
        </div>
        <span className={`text-sm font-medium ${
          data.changeType === 'positive' ? 'text-green-600' : 
          data.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
        }`}>
          {data.change}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {data.value}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {widget.title}
      </p>
    </div>
  );
}

function CustomWidget({ widget }: WidgetProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            {widget.icon && <widget.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {widget.title}
          </h3>
        </div>
        <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
          {widget.size}
        </span>
      </div>
      
      {widget.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {widget.description}
        </p>
      )}
      
      <div className="h-20 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
            {widget.icon && <widget.icon className="w-4 h-4 text-blue-600" />}
          </div>
          <p className="text-xs text-gray-500">
            {widget.data?.preview || 'Custom Widget'}
          </p>
        </div>
      </div>
    </div>
  );
}

// Widget Renderer
function WidgetRenderer({ widget, isEditing }: WidgetProps & { isEditing?: boolean }) {
  switch (widget.type) {
    case 'kpi':
      return <KPIWidget widget={widget} isEditing={isEditing} />;
    case 'custom':
      return <CustomWidget widget={widget} isEditing={isEditing} />;
    default:
      return (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm h-full flex items-center justify-center">
          <p className="text-gray-500">Widget: {widget.title}</p>
        </div>
      );
  }
}

// Main Draggable Dashboard Component
interface DraggableDashboardProps {
  initialLayout?: DashboardLayout;
  onLayoutChange?: (layout: DashboardLayout) => void;
  className?: string;
}

export function DraggableDashboard({ 
  initialLayout = LAYOUT_PRESETS[0], 
  onLayoutChange,
  className = ''
}: DraggableDashboardProps) {
  const [layout, setLayout] = useState<DashboardLayout>(initialLayout);
  const [isEditing, setIsEditing] = useState(false);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [selectedPreset, setSelectedPreset] = useState(initialLayout.id);
  const deviceType = useDeviceType();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      setLayout(prevLayout => {
        const oldIndex = prevLayout.widgets.findIndex(widget => widget.id === active.id);
        const newIndex = prevLayout.widgets.findIndex(widget => widget.id === over?.id);
        
        const newWidgets = arrayMove(prevLayout.widgets, oldIndex, newIndex);
        const newLayout = { ...prevLayout, widgets: newWidgets, lastModified: new Date() };
        
        onLayoutChange?.(newLayout);
        return newLayout;
      });
    }
    
    setActiveId(null);
  }, [onLayoutChange]);

  const handlePresetChange = useCallback((presetId: string) => {
    const preset = LAYOUT_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setLayout(preset);
      setSelectedPreset(presetId);
      onLayoutChange?.(preset);
    }
  }, [onLayoutChange]);

  const handleSaveLayout = useCallback(() => {
    setIsEditing(false);
    onLayoutChange?.(layout);
    localStorage.setItem('customDashboardLayout', JSON.stringify(layout));
  }, [layout, onLayoutChange]);

  const handleResetLayout = useCallback(() => {
    const preset = LAYOUT_PRESETS.find(p => p.id === selectedPreset) || LAYOUT_PRESETS[0];
    setLayout(preset);
    onLayoutChange?.(preset);
  }, [selectedPreset, onLayoutChange]);

  const handleDeleteWidget = useCallback((widgetId: string) => {
    setLayout(prevLayout => ({
      ...prevLayout,
      widgets: prevLayout.widgets.filter(widget => widget.id !== widgetId),
      lastModified: new Date()
    }));
  }, []);

  // Get current breakpoint settings
  const currentBreakpoint = { cols: deviceType === 'mobile' ? 2 : deviceType === 'tablet' ? 4 : 6 };
  const gridCols = Math.min(layout.gridCols, currentBreakpoint.cols);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Dashboard Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Dashboard Layout
          </h2>
          
          {/* Layout Presets */}
          <select
            value={selectedPreset}
            onChange={(e) => handlePresetChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            {LAYOUT_PRESETS.map(preset => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>
          
          {/* Device Type Indicator */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {deviceType === 'desktop' && <Monitor className="w-4 h-4" />}
            {deviceType === 'tablet' && <Tablet className="w-4 h-4" />}
            {deviceType === 'mobile' && <Smartphone className="w-4 h-4" />}
            <span className="capitalize">{deviceType}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleResetLayout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={handleSaveLayout}
                className="flex items-center gap-2 px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                <Save className="w-4 h-4" />
                Save Layout
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <Edit3 className="w-4 h-4" />
              Customize Layout
            </button>
          )}
        </div>
      </div>

      {/* Editing Mode Notice */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg"
        >
          <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Customization Mode Active</span>
          </div>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
            Drag widgets to rearrange them. Use the controls to edit or remove widgets.
          </p>
        </motion.div>
      )}

      {/* Dashboard Grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={layout.widgets.map(w => w.id)} 
          strategy={rectSortingStrategy}
        >
          <div 
            className={`grid gap-4 auto-rows-fr`}
            style={{ 
              gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
              minHeight: `120px`
            }}
          >
            {layout.widgets.map((widget) => (
              <SortableWidget
                key={widget.id}
                widget={widget}
                isEditing={isEditing}
                onDelete={handleDeleteWidget}
              >
                <div 
                  className="h-full"
                  style={{
                    gridColumn: `span ${Math.min(widget.position.w, gridCols)}`,
                    gridRow: `span ${widget.position.h}`
                  }}
                >
                  <WidgetRenderer widget={widget} isEditing={isEditing} />
                </div>
              </SortableWidget>
            ))}
          </div>
        </SortableContext>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeId ? (
            <div className="opacity-90 transform rotate-3 scale-105">
              {(() => {
                const widget = layout.widgets.find(w => w.id === activeId);
                return widget ? <WidgetRenderer widget={widget} /> : null;
              })()}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Layout Info */}
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
        {layout.widgets.length} widgets • Last modified: {layout.lastModified.toLocaleDateString()}
        {isEditing && ' • Changes not saved'}
      </div>
    </div>
  );
}

export default DraggableDashboard;