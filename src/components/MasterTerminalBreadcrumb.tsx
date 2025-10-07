'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, LayoutDashboard } from 'lucide-react';
import { PLATFORM_CATEGORIES } from '@/config/platformRegistry';

interface MasterTerminalBreadcrumbProps {
  customPath?: Array<{ label: string; href?: string }>;
  className?: string;
}

export default function MasterTerminalBreadcrumb({ 
  customPath, 
  className = '' 
}: MasterTerminalBreadcrumbProps) {
  const pathname = usePathname();

  // Generate breadcrumb path based on current route
  const generateBreadcrumbPath = () => {
    if (customPath) return customPath;

    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [
      { label: 'Master Terminal', href: '/dashboard' }
    ];

    // Map route segments to breadcrumb hierarchy
    if (segments.length > 0) {
      const firstSegment = segments[0];
      
      // Map platform routes to their categories
      const platformCategoryMap: Record<string, string> = {
        'campaigns': 'Marketing Platforms',
        'email-marketing': 'Marketing Platforms',
        'social-media': 'Marketing Platforms',
        'content-suite': 'Marketing Platforms',
        'marketing': 'Marketing Platforms',
        
        'collaboration': 'Business Operations',
        'project-management': 'Business Operations',
        'leads': 'Business Operations',
        'unified-crm': 'Business Operations',
        'business-suite': 'Business Operations',
        
        'analytics': 'Analytics & Insights',
        'reports': 'Analytics & Insights',
        'performance': 'Analytics & Insights',
        
        'ai': 'AI & Automation',
        'optimization': 'AI & Automation',
        'ai-automation': 'AI & Automation',
        
        'integrations': 'Integration & Tools',
        'sync': 'Integration & Tools',
        'scheduler': 'Integration & Tools',
        'platforms': 'Integration & Tools',
        
        'enterprise': 'Enterprise & Settings',
        'business-intelligence': 'Enterprise & Settings',
        'settings': 'Enterprise & Settings',
        'infrastructure': 'Enterprise & Settings'
      };

      const category = platformCategoryMap[firstSegment];
      if (category) {
        breadcrumbs.push({ 
          label: category,
          href: undefined // Category level, no direct link
        });
      }

      // Add current page
      const pageLabel = firstSegment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      breadcrumbs.push({
        label: pageLabel,
        href: undefined // Current page, no link
      });

      // Add sub-pages if they exist
      if (segments.length > 1) {
        const subPage = segments[1]
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        breadcrumbs.push({
          label: subPage,
          href: undefined
        });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbPath = generateBreadcrumbPath();

  return (
    <nav className={`flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4 ${className}`}>
      {breadcrumbPath.map((crumb, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
          )}
          {crumb.href ? (
            <Link 
              href={crumb.href}
              className="flex items-center gap-1 font-medium text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
            >
              {index === 0 && <LayoutDashboard className="w-4 h-4" />}
              {crumb.label}
            </Link>
          ) : (
            <span className={`flex items-center gap-1 ${
              index === breadcrumbPath.length - 1 
                ? 'text-gray-900 dark:text-white font-medium' 
                : 'text-gray-600 dark:text-gray-300'
            }`}>
              {index === 0 && <LayoutDashboard className="w-4 h-4" />}
              {crumb.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}