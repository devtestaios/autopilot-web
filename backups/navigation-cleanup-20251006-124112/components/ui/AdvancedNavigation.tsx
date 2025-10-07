'use client';

// React hooks removed - no longer needed after legacy feature cleanup
// Phase 2C.1: Optimized Framer Motion imports for tree shaking
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronRight, 
  Sparkles,
  BarChart3,
  Settings,
  HelpCircle,
  User,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';
// PremiumButton import removed - legacy "New Campaign" button removed
// Removed GlobalSearch import - legacy marketing feature removed

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

// Legacy interfaces for marketing quick actions removed

// Legacy marketing-specific quick actions removed - no longer needed in universal header

export interface AdvancedNavigationProps {
  className?: string;
  sidebarCollapsed?: boolean;
}

export default function AdvancedNavigation({ className, sidebarCollapsed = false }: AdvancedNavigationProps) {
  const pathname = usePathname();
  // Legacy quick actions state removed

  // Generate breadcrumbs from current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/dashboard', icon: <Home className="w-4 h-4" /> }
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

  // Legacy keyboard shortcuts for quick actions removed

  return (
    <nav 
      data-testid="dashboard-navigation"
      className={cn(
        'bg-background/95 backdrop-blur-xl border-b border-border',
        'sticky top-0 z-50 transition-all duration-300',
        'pointer-events-auto',
        className
      )}
      style={{
        background: 'var(--bg-card)',
        borderBottomColor: 'var(--border-subtle)',
        backdropFilter: 'blur(12px)',
      }}
    >
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
                  <ChevronRight className="w-4 h-4 text-muted-foreground mx-2" />
                )}
                
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-2 py-1 rounded-lg transition-colors duration-200',
                    index === breadcrumbs.length - 1
                      ? 'font-medium'
                      : 'hover:bg-muted'
                  )}
                  style={{
                    color: index === breadcrumbs.length - 1 ? 'var(--brand-teal)' : 'var(--text-secondary)',
                    backgroundColor: index === breadcrumbs.length - 1 ? 'rgba(var(--brand-teal-rgb), 0.1)' : 'transparent'
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </div>
            ))}
          </nav>

          {/* Universal Header - Clean Design */}
          <div className="flex items-center gap-4">
            {/* Future: Platform-specific quick actions can be added here */}
          </div>
        </div>
      </div>
    </nav>
  );
}