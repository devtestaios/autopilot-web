'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, X, BarChart3, Target, Users, Activity, Zap, 
  MessageSquare, Calendar, FileText, TrendingUp, DollarSign
} from 'lucide-react';

// Widget Template Types
export interface WidgetTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'metrics' | 'analytics' | 'activities' | 'tools';
  size: 'small' | 'medium' | 'large' | 'extra-large';
  preview: string;
}

// Available Widget Templates
export const WIDGET_GALLERY: WidgetTemplate[] = [
  // Metrics Category
  {
    id: 'revenue-kpi',
    name: 'Revenue KPI',
    description: 'Display total revenue with trend indicators',
    icon: DollarSign,
    category: 'metrics',
    size: 'medium',
    preview: '$487,320 (+18.2%)'
  },
  {
    id: 'conversion-kpi',
    name: 'Conversion Rate',
    description: 'Track conversion rates across campaigns',
    icon: Target,
    category: 'metrics',
    size: 'medium',
    preview: '3.2% (+0.8%)'
  },
  {
    id: 'leads-kpi',
    name: 'Total Leads',
    description: 'Monitor lead generation performance',
    icon: Users,
    category: 'metrics',
    size: 'medium',
    preview: '1,847 (+12.5%)'
  },
  {
    id: 'campaigns-kpi',
    name: 'Active Campaigns',
    description: 'Track number of active campaigns',
    icon: Zap,
    category: 'metrics',
    size: 'medium',
    preview: '24 campaigns'
  },

  // Analytics Category
  {
    id: 'performance-chart',
    name: 'Performance Chart',
    description: 'Visualize performance trends over time',
    icon: BarChart3,
    category: 'analytics',
    size: 'large',
    preview: 'Line chart (30 days)'
  },
  {
    id: 'roi-trends',
    name: 'ROI Trends',
    description: 'Return on investment analysis',
    icon: TrendingUp,
    category: 'analytics',
    size: 'large',
    preview: 'ROI analysis chart'
  },
  {
    id: 'platform-breakdown',
    name: 'Platform Breakdown',
    description: 'Performance breakdown by platform',
    icon: BarChart3,
    category: 'analytics',
    size: 'large',
    preview: 'Multi-platform comparison'
  },

  // Activities Category
  {
    id: 'team-activity',
    name: 'Team Activity Feed',
    description: 'Recent team member activities and updates',
    icon: Activity,
    category: 'activities',
    size: 'large',
    preview: 'Live activity stream'
  },
  {
    id: 'recent-leads',
    name: 'Recent Leads',
    description: 'Latest leads and prospect information',
    icon: Users,
    category: 'activities',
    size: 'medium',
    preview: 'Latest 10 leads'
  },
  {
    id: 'top-campaigns',
    name: 'Top Campaigns',
    description: 'Best performing campaigns this period',
    icon: Target,
    category: 'activities',
    size: 'medium',
    preview: 'Top 5 campaigns'
  },

  // Tools Category
  {
    id: 'quick-actions',
    name: 'Quick Actions',
    description: 'Frequently used action buttons',
    icon: Zap,
    category: 'tools',
    size: 'medium',
    preview: 'Action shortcuts'
  },
  {
    id: 'ai-insights',
    name: 'AI Insights',
    description: 'AI-powered recommendations and insights',
    icon: MessageSquare,
    category: 'tools',
    size: 'extra-large',
    preview: 'AI recommendations'
  },
  {
    id: 'calendar-view',
    name: 'Calendar',
    description: 'Upcoming events and scheduled tasks',
    icon: Calendar,
    category: 'tools',
    size: 'large',
    preview: 'Monthly calendar'
  }
];

interface WidgetGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWidget: (template: WidgetTemplate) => void;
}

export default function WidgetGallery({ isOpen, onClose, onAddWidget }: WidgetGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Widgets', count: WIDGET_GALLERY.length },
    { id: 'metrics', name: 'Metrics', count: WIDGET_GALLERY.filter(w => w.category === 'metrics').length },
    { id: 'analytics', name: 'Analytics', count: WIDGET_GALLERY.filter(w => w.category === 'analytics').length },
    { id: 'activities', name: 'Activities', count: WIDGET_GALLERY.filter(w => w.category === 'activities').length },
    { id: 'tools', name: 'Tools', count: WIDGET_GALLERY.filter(w => w.category === 'tools').length }
  ];

  const filteredWidgets = WIDGET_GALLERY.filter(widget => {
    const matchesCategory = selectedCategory === 'all' || widget.category === selectedCategory;
    const matchesSearch = widget.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         widget.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddWidget = (template: WidgetTemplate) => {
    onAddWidget(template);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Widget Gallery
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Add new widgets to customize your dashboard
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Search and Categories */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          {/* Search */}
          <input
            type="text"
            placeholder="Search widgets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
          />

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Widget Grid */}
        <div className="p-6 overflow-y-auto max-h-96">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWidgets.map(widget => (
              <motion.div
                key={widget.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer group"
                onClick={() => handleAddWidget(widget)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                    <widget.icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    widget.size === 'small' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    widget.size === 'medium' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                    widget.size === 'large' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' :
                    'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                  }`}>
                    {widget.size}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {widget.name}
                </h3>

                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  {widget.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {widget.preview}
                  </span>
                  <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredWidgets.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No widgets found matching your criteria
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>
              {filteredWidgets.length} widget{filteredWidgets.length !== 1 ? 's' : ''} available
            </span>
            <span>
              Click any widget to add it to your dashboard
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}