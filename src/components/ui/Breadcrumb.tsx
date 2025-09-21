'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbProps {
  className?: string;
  showHome?: boolean;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

const routeLabels: Record<string, string> = {
  '': 'Home',
  'dashboard': 'Dashboard',
  'campaigns': 'Campaigns',
  'analytics': 'Analytics',
  'performance': 'Performance',
  'roi': 'ROI Analysis',
  'leads': 'Leads',
  'scheduler': 'Scheduler',
  'optimization': 'Optimization',
  'reports': 'Reports',
  'settings': 'Settings',
  'ai': 'AI Control',
  'ai-bridge': 'AI Bridge',
  'mobile-demo': 'Mobile Demo',
  'enterprise': 'Enterprise',
  'whitelabel': 'White Label',
  'platforms': 'Platforms',
  'competitive': 'Competitive',
  'infrastructure': 'Infrastructure',
  'alerts': 'Alerts',
  'sync': 'Sync',
  'capabilities': 'Capabilities',
  'new': 'New',
  'edit': 'Edit',
  'templates': 'Templates',
  'login': 'Sign In',
  'signup': 'Sign Up'
};

export default function Breadcrumb({ className, showHome = true }: BreadcrumbProps) {
  const pathname = usePathname();
  
  // Don't show breadcrumbs on home page or login/signup
  if (pathname === '/' || pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const pathSegments = pathname.split('/').filter(Boolean);
  
  const breadcrumbItems: BreadcrumbItem[] = [];
  
  // Add home if requested
  if (showHome) {
    breadcrumbItems.push({
      label: 'Home',
      href: '/',
      icon: <Home className="w-4 h-4" />
    });
  }

  // Build breadcrumb items from path segments
  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === pathSegments.length - 1;
    
    // Handle dynamic routes (e.g., [id])
    let label = routeLabels[segment] || segment;
    
    // If this looks like an ID (numbers or UUID), try to get a better label
    if (/^[0-9a-f-]+$/i.test(segment) && index > 0) {
      const parentSegment = pathSegments[index - 1];
      if (parentSegment === 'campaigns') {
        label = `Campaign ${segment.slice(0, 8)}...`;
      } else if (parentSegment === 'leads') {
        label = `Lead ${segment.slice(0, 8)}...`;
      } else {
        label = `${routeLabels[parentSegment] || parentSegment} Details`;
      }
    }

    breadcrumbItems.push({
      label: label.charAt(0).toUpperCase() + label.slice(1),
      href: isLast ? undefined : currentPath
    });
  });

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 mb-6',
        className
      )}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1">
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="flex items-center space-x-1">
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="flex items-center space-x-1 hover:text-pulse-cyan transition-colors duration-200 hover:underline"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span className="flex items-center space-x-1 text-gray-900 dark:text-white font-medium">
                {item.icon}
                <span>{item.label}</span>
              </span>
            )}
          </li>
        ))}
      </ol>
    </motion.nav>
  );
}