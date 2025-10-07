'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PLATFORM_REGISTRY,
  getAllPlatformCategories,
  getPlatformsByCategory,
  getStatusBadge
} from '@/config/platformRegistry';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Megaphone,
  Briefcase,
  Cog,
  ShoppingBag,
  BarChart3,
  Building2,
  Menu,
  X
} from 'lucide-react';
import * as Icons from 'lucide-react';

interface EnhancedSidebarProps {
  onCollapseChange?: (collapsed: boolean) => void;
}

const CATEGORY_CONFIG = {
  marketing: { icon: 'Megaphone', label: 'Marketing Suite', color: 'text-blue-600' },
  business: { icon: 'Briefcase', label: 'Business Suite', color: 'text-green-600' },
  operations: { icon: 'Cog', label: 'Operations Suite', color: 'text-orange-600' },
  commerce: { icon: 'ShoppingBag', label: 'Commerce Suite', color: 'text-purple-600' },
  analytics: { icon: 'BarChart3', label: 'Analytics Suite', color: 'text-red-600' },
  enterprise: { icon: 'Building2', label: 'Enterprise Suite', color: 'text-indigo-600' }
};

export function EnhancedSidebar({ onCollapseChange }: EnhancedSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['marketing']);
  const pathname = usePathname();

  const toggleCollapse = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    onCollapseChange?.(newCollapsed);
    // Collapse all categories when sidebar is collapsed
    if (newCollapsed) {
      setExpandedCategories([]);
    } else {
      setExpandedCategories(['marketing']); // Expand marketing by default
    }
  };

  const toggleCategory = (category: string) => {
    if (collapsed) return;
    
    setExpandedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const isActive = (route: string) => {
    if (route === '/') return pathname === '/';
    return pathname.startsWith(route);
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 56 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 z-40 h-screen bg-card border-r border-border flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <div>
                <h2 className="font-semibold text-sm">PulseBridge</h2>
                <p className="text-xs text-muted-foreground">Master Terminal</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleCollapse}
          className="p-1.5 h-auto"
        >
          {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="space-y-1">
          {/* Master Terminal Link */}
          <Link href="/master-terminal">
            <motion.div
              whileHover={{ scale: collapsed ? 1 : 1.02 }}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive('/master-terminal')
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between flex-1"
                  >
                    <span className="font-medium text-sm">Master Terminal</span>
                    <Badge variant="secondary" className="text-xs ml-2">
                      NEW
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>

          <Separator className="my-4" />

          {/* Platform Categories */}
          {Object.entries(CATEGORY_CONFIG).map(([categoryKey, config]) => {
            const platforms = getPlatformsByCategory(categoryKey);
            const isExpanded = expandedCategories.includes(categoryKey);
            const CategoryIcon = Icons[config.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;

            return (
              <div key={categoryKey} className="space-y-1">
                {/* Category Header */}
                <Button
                  variant="ghost"
                  onClick={() => toggleCategory(categoryKey)}
                  disabled={collapsed}
                  className={`w-full justify-start px-3 py-2 h-auto font-medium text-sm ${
                    collapsed ? 'px-2' : ''
                  }`}
                >
                  <CategoryIcon className={`w-5 h-5 flex-shrink-0 ${config.color}`} />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-between flex-1 ml-3"
                      >
                        <span>{config.label}</span>
                        <div className="flex items-center space-x-1">
                          <Badge variant="outline" className="text-xs">
                            {platforms.length}
                          </Badge>
                          {isExpanded ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>

                {/* Platform Items */}
                <AnimatePresence>
                  {isExpanded && !collapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-6 space-y-1 overflow-hidden"
                    >
                      {platforms.map(platform => {
                        const PlatformIcon = Icons[platform.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
                        const statusBadge = getStatusBadge(platform.status);
                        const isClickable = platform.status === 'active' || platform.status === 'new';

                        const linkContent = (
                          <motion.div
                            whileHover={isClickable ? { scale: 1.02, x: 2 } : undefined}
                            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                              isActive(platform.route)
                                ? 'bg-primary/10 text-primary border-l-2 border-primary'
                                : isClickable
                                ? 'hover:bg-accent hover:text-accent-foreground'
                                : 'opacity-60 cursor-not-allowed'
                            }`}
                          >
                            <PlatformIcon className="w-4 h-4 flex-shrink-0" />
                            <div className="flex items-center justify-between flex-1">
                              <span className="text-sm">{platform.name}</span>
                              <Badge 
                                variant={statusBadge.variant} 
                                className="text-xs"
                              >
                                {statusBadge.label}
                              </Badge>
                            </div>
                          </motion.div>
                        );

                        if (isClickable) {
                          return (
                            <Link key={platform.id} href={platform.route}>
                              {linkContent}
                            </Link>
                          );
                        }

                        return (
                          <div key={platform.id}>
                            {linkContent}
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t px-4 py-3">
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-xs text-muted-foreground text-center"
            >
              20 Platform Ecosystem
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}