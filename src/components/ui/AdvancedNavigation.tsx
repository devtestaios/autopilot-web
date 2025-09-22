'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronRight, 
  ChevronDown, 
  Search, 
  Command,
  Sparkles,
  Zap,
  Target,
  BarChart3,
  Settings,
  HelpCircle,
  User,
  Home,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PremiumButton } from './PremiumButton';
import GlobalSearch from '@/components/GlobalSearch';
import { useTheme } from '@/contexts/ThemeContext';

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface QuickAction {
  label: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  shortcut?: string;
}

const quickActions: QuickAction[] = [
  {
    label: 'New Campaign',
    description: 'Create a new marketing campaign',
    icon: <Sparkles className="w-4 h-4" />,
    href: '/campaigns/new',
    shortcut: '⌘+N'
  },
  {
    label: 'Analytics Dashboard',
    description: 'View performance insights',
    icon: <BarChart3 className="w-4 h-4" />,
    href: '/analytics',
    shortcut: '⌘+A'
  },
  {
    label: 'AI Optimizer',
    description: 'Enable automatic optimization',
    icon: <Zap className="w-4 h-4" />,
    href: '/optimizer',
    shortcut: '⌘+O'
  },
  {
    label: 'Campaign Goals',
    description: 'Set and track objectives',
    icon: <Target className="w-4 h-4" />,
    href: '/goals',
    shortcut: '⌘+G'
  }
];

export interface AdvancedNavigationProps {
  className?: string;
  sidebarCollapsed?: boolean;
}

export default function AdvancedNavigation({ className, sidebarCollapsed = false }: AdvancedNavigationProps) {
  const pathname = usePathname();
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Generate breadcrumbs from current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/', icon: <Home className="w-4 h-4" /> }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      
      let icon = null;
      switch (segment) {
        case 'campaigns':
          icon = <Sparkles className="w-4 h-4" />;
          break;
        case 'analytics':
          icon = <BarChart3 className="w-4 h-4" />;
          break;
        case 'settings':
          icon = <Settings className="w-4 h-4" />;
          break;
        case 'profile':
          icon = <User className="w-4 h-4" />;
          break;
        case 'help':
          icon = <HelpCircle className="w-4 h-4" />;
          break;
      }

      breadcrumbs.push({
        label,
        href: currentPath,
        icon
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Handle keyboard shortcuts for quick actions
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsQuickActionsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <nav className={cn(
      'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50',
      'sticky top-0 z-50 transition-all duration-300',
      className
    )}>
      <div className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300',
        sidebarCollapsed ? 'max-w-none lg:ml-14' : 'max-w-7xl lg:ml-0'
      )}>
        <div className="flex items-center justify-between h-16">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((item, index) => (
              <div key={item.href} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400 mx-2" />
                )}
                
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-2 py-1 rounded-lg transition-colors duration-200',
                    index === breadcrumbs.length - 1
                      ? 'text-pulse-cyan font-medium bg-pulse-cyan/10'
                      : 'text-gray-800 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </div>
            ))}
          </nav>

          {/* Advanced Search & Quick Actions */}
          <div className="flex items-center gap-4">
            {/* Global Search */}
            <GlobalSearch 
              variant="modal"
              placeholder="Search campaigns, leads, templates..."
              className="w-64"
            />

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={cn(
                'p-2 rounded-lg transition-all duration-200',
                'hover:bg-gray-100 dark:hover:bg-gray-800',
                'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              )}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            {/* Quick Action Button */}
            <PremiumButton
              variant="primary"
              size="md"
              icon={<Sparkles className="w-4 h-4" />}
              onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
              className="hidden md:flex"
            >
              New Campaign
            </PremiumButton>
          </div>
        </div>
      </div>
    </nav>
  );
}