'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrentPage?: boolean;
}

interface BreadcrumbNavigationProps {
  customItems?: BreadcrumbItem[];
  showHome?: boolean;
  separator?: React.ReactNode;
  className?: string;
}

// Route label mappings for better UX
const routeLabels: Record<string, string> = {
  '/': 'Dashboard',
  '/dashboard': 'Dashboard',
  '/campaigns': 'Campaigns',
  '/campaigns/new': 'Create Campaign',
  '/campaigns/templates': 'Campaign Templates',
  '/analytics': 'Analytics',
  '/analytics/performance': 'Performance Analytics',
  '/analytics/roi': 'ROI Analysis',
  '/leads': 'Leads',
  '/reports': 'Reports',
  '/alerts': 'Alerts',
  '/settings': 'Settings',
  '/ai': 'AI Center',
  '/ai/analytics': 'AI Analytics',
  '/ai/automation': 'AI Automation',
  '/ai/settings': 'AI Settings',
  '/platforms': 'Platforms',
  '/optimization': 'Optimization',
  '/autopilot': 'Autopilot Mode',
  '/sync': 'Sync Status',
  '/scheduler': 'Scheduler',
  '/status': 'System Status',
  '/unified': 'Unified Dashboard',
  '/unified-dashboard': 'Unified Dashboard',
  '/whitelabel': 'White Label',
  '/enterprise': 'Enterprise',
  '/infrastructure': 'Infrastructure',
  '/competitive': 'Competitive Analysis',
  '/capabilities/ai-bridge': 'AI Bridge',
  '/mobile-demo': 'Mobile Demo',
  '/login': 'Login',
  '/signup': 'Sign Up',
  '/home': 'Home'
};

// Dynamic route patterns for parameterized routes
const getDynamicLabel = (segment: string, pathname: string): string => {
  // Handle campaign IDs
  if (pathname.includes('/campaigns/') && segment.match(/^[0-9a-f-]{36}$/)) {
    return 'Campaign Details';
  }
  
  // Handle edit routes
  if (segment === 'edit') {
    return 'Edit';
  }
  
  // Default to capitalize the segment
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
};

const generateBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [];

  // Add home/dashboard
  breadcrumbs.push({
    label: 'Dashboard',
    href: '/',
    isCurrentPage: pathname === '/'
  });

  // If already at home, return just the home breadcrumb
  if (pathname === '/') {
    return breadcrumbs;
  }

  // Build breadcrumbs for each segment
  let currentPath = '';
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    
    // Get label from mapping or use dynamic generation
    const label = routeLabels[currentPath] || getDynamicLabel(segment, pathname);
    
    breadcrumbs.push({
      label,
      href: currentPath,
      isCurrentPage: isLast
    });
  });

  return breadcrumbs;
};

export const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({
  customItems,
  showHome = true,
  separator = <ChevronRight className="w-4 h-4 text-gray-400" />,
  className = ''
}) => {
  const pathname = usePathname();
  
  // Use custom items if provided, otherwise generate from current path
  const breadcrumbItems = customItems || generateBreadcrumbs(pathname);
  
  // Filter out home if not wanted
  const items = showHome ? breadcrumbItems : breadcrumbItems.slice(1);
  
  if (items.length <= 1) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      aria-label="Breadcrumb"
      className={`flex items-center space-x-2 text-sm ${className}`}
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <motion.li
            key={item.href}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="flex items-center space-x-2"
          >
            {index > 0 && (
              <span className="flex-shrink-0" aria-hidden="true">
                {separator}
              </span>
            )}
            
            {item.isCurrentPage ? (
              <span 
                className="font-medium text-gray-900 dark:text-white"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-150"
              >
                {item.label}
              </Link>
            )}
          </motion.li>
        ))}
      </ol>
    </motion.nav>
  );
};

// Compact breadcrumb variant for mobile/tight spaces
export const CompactBreadcrumb: React.FC<{
  className?: string;
}> = ({ className = '' }) => {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);
  
  // Show only the last two items for compact view
  const compactItems = breadcrumbs.slice(-2);
  
  if (compactItems.length <= 1) return null;

  return (
    <div className={`flex items-center space-x-2 text-sm ${className}`}>
      {compactItems.length > 1 && (
        <>
          <Link
            href={compactItems[0].href}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            {compactItems[0].label}
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </>
      )}
      <span className="font-medium text-gray-900 dark:text-white">
        {compactItems[compactItems.length - 1].label}
      </span>
    </div>
  );
};

// Page header with integrated breadcrumb
export const PageHeader: React.FC<{
  title?: string;
  description?: string;
  showBreadcrumb?: boolean;
  customBreadcrumb?: BreadcrumbItem[];
  children?: React.ReactNode;
  className?: string;
}> = ({ 
  title, 
  description, 
  showBreadcrumb = true, 
  customBreadcrumb,
  children,
  className = '' 
}) => {
  const pathname = usePathname();
  
  // Auto-generate title from breadcrumb if not provided
  const breadcrumbs = customBreadcrumb || generateBreadcrumbs(pathname);
  const currentPage = breadcrumbs[breadcrumbs.length - 1];
  const pageTitle = title || currentPage?.label || 'Page';

  return (
    <div className={`space-y-4 ${className}`}>
      {showBreadcrumb && (
        <BreadcrumbNavigation 
          customItems={customBreadcrumb}
          className="text-sm"
        />
      )}
      
      <div className="flex items-center justify-between">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-2xl font-bold text-gray-900 dark:text-white"
          >
            {pageTitle}
          </motion.h1>
          
          {description && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="mt-2 text-sm text-gray-600 dark:text-gray-400"
            >
              {description}
            </motion.p>
          )}
        </div>
        
        {children && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Specialized breadcrumb for modal/drawer contexts
export const ModalBreadcrumb: React.FC<{
  items: BreadcrumbItem[];
  onNavigate?: (href: string) => void;
  className?: string;
}> = ({ items, onNavigate, className = '' }) => {
  const handleClick = (href: string, e: React.MouseEvent) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(href);
    }
  };

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={item.href}>
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
          
          {item.isCurrentPage ? (
            <span className="font-medium text-gray-900 dark:text-white">
              {item.label}
            </span>
          ) : (
            <button
              onClick={(e) => handleClick(item.href, e)}
              className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default BreadcrumbNavigation;