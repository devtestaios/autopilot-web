'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard,
  Target,
  BarChart3,
  Users,
  Bell,
  Activity,
  Settings,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Zap,
  Clock,
  Star
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EXISTING_PLATFORMS, PLANNED_PLATFORMS, PLATFORM_CATEGORIES } from '@/config/platformRegistry';

interface EnhancedSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  className?: string;
}

const iconMap: Record<string, any> = {
  LayoutDashboard,
  Target,
  BarChart3,
  Users,
  Bell,
  Activity,
  Settings,
  Menu,
  Sparkles
};

export default function EnhancedSidebar({ 
  isCollapsed, 
  onToggleCollapse, 
  className = '' 
}: EnhancedSidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['marketing']);
  const pathname = usePathname();

  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  const getStatusBadge = (status: 'active' | 'development' | 'planning') => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-200">
            <Star className="w-3 h-3 mr-1" />
            LIVE
          </Badge>
        );
      case 'development':
        return (
          <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
            <Zap className="w-3 h-3 mr-1" />
            NEW
          </Badge>
        );
      case 'planning':
        return (
          <Badge variant="outline" className="text-xs bg-amber-100 text-amber-700 border-amber-200">
            <Clock className="w-3 h-3 mr-1" />
            SOON
          </Badge>
        );
    }
  };

  const allPlatforms = [...EXISTING_PLATFORMS, ...PLANNED_PLATFORMS];
  const categorizedPlatforms = PLATFORM_CATEGORIES.reduce((acc, category) => {
    acc[category.id] = allPlatforms.filter(platform => platform.category === category.id);
    return acc;
  }, {} as Record<string, typeof allPlatforms>);

  return (
    <div className={`${className}`}>
      <motion.div 
        className={`
          fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-30
          ${isCollapsed ? 'w-14' : 'w-80'}
        `}
        initial={false}
        animate={{ width: isCollapsed ? 56 : 320 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-gray-900 dark:text-white">
                  PulseBridge.ai
                </h1>
                <p className="text-xs text-gray-500">20-Platform Suite</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="w-8 h-8 p-0"
          >
            {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          {/* Quick Access */}
          <div className="px-3 mb-6">
            {!isCollapsed && (
              <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Quick Access
              </h2>
            )}
            <div className="space-y-1">
              <Link 
                href="/unified"
                className={`
                  flex items-center px-3 py-2 rounded-lg transition-colors
                  ${pathname === '/unified' 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                <LayoutDashboard className="w-4 h-4" />
                {!isCollapsed && <span className="ml-3 text-sm font-medium">Command Center</span>}
              </Link>
              <Link 
                href="/master-terminal"
                className={`
                  flex items-center px-3 py-2 rounded-lg transition-colors
                  ${pathname === '/master-terminal' 
                    ? 'bg-primary/10 text-primary border border-primary/20' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                <Target className="w-4 h-4" />
                {!isCollapsed && <span className="ml-3 text-sm font-medium">Master Terminal</span>}
              </Link>
            </div>
          </div>

          {/* Platform Categories */}
          {PLATFORM_CATEGORIES.map((category) => {
            const platforms = categorizedPlatforms[category.id] || [];
            const isExpanded = expandedCategories.includes(category.id);
            const CategoryIcon = iconMap[category.icon] || Target;

            return (
              <div key={category.id} className="px-3 mb-4">
                {!isCollapsed && (
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="flex items-center w-full px-3 py-2 text-left rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <CategoryIcon className="w-4 h-4 text-gray-500" />
                    <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {category.name}
                    </span>
                    <span className="ml-auto text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                      {platforms.length}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-3 h-3 ml-2 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-3 h-3 ml-2 text-gray-400" />
                    )}
                  </button>
                )}

                {(!isCollapsed && isExpanded) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 space-y-1 pl-4"
                  >
                    {platforms.map((platform) => {
                      const PlatformIcon = iconMap[platform.icon] || Target;
                      return (
                        <Link
                          key={platform.id}
                          href={platform.route}
                          className={`
                            flex items-center justify-between px-3 py-2 rounded-lg transition-colors group
                            ${pathname === platform.route
                              ? 'bg-primary/10 text-primary border border-primary/20'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
                            }
                          `}
                        >
                          <div className="flex items-center">
                            <PlatformIcon className="w-3 h-3" />
                            <span className="ml-2 text-xs font-medium line-clamp-1">
                              {platform.name}
                            </span>
                          </div>
                          {getStatusBadge(platform.status)}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          {!isCollapsed && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center justify-between mb-1">
                <span>Active Platforms</span>
                <span className="font-medium">{EXISTING_PLATFORMS.length}/20</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                <div 
                  className="bg-gradient-to-r from-teal-600 to-cyan-600 h-1 rounded-full"
                  style={{ width: `${(EXISTING_PLATFORMS.length / 20) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 md:hidden"
          onClick={onToggleCollapse}
        />
      )}
    </div>
  );
}