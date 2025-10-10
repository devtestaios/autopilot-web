/**
 * PulseBridge.ai Navigation Structure
 * Single source of truth for all navigation across the platform
 */

import {
  LayoutDashboard,
  Target,
  Brain,
  Building2,
  Users,
  BarChart3,
  Settings,
  Zap,
  Mail,
  MessageSquare,
  Calendar,
  FileText,
  TrendingUp,
  Briefcase,
  DollarSign,
  ShoppingCart,
  Headphones,
  Boxes,
  type LucideIcon
} from 'lucide-react';

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  badge?: string;
  children?: NavigationItem[];
}

export interface NavigationSection {
  id: string;
  label: string;
  items: NavigationItem[];
}

/**
 * PRIMARY NAVIGATION - Top-level sections
 * These appear in the main navigation bar
 */
export const primaryNavigation: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Master Terminal - Overview of all systems'
  },
  {
    id: 'marketing',
    label: 'Marketing',
    href: '/marketing',
    icon: Target,
    description: 'Marketing Command Center',
    children: [
      {
        id: 'campaigns',
        label: 'Campaigns',
        href: '/campaigns',
        icon: Zap,
        description: 'Manage marketing campaigns'
      },
      {
        id: 'social-media',
        label: 'Social Media',
        href: '/social-media',
        icon: MessageSquare,
        description: 'Social media management'
      },
      {
        id: 'email-marketing',
        label: 'Email Marketing',
        href: '/email-marketing',
        icon: Mail,
        description: 'Email campaign management'
      },
      {
        id: 'content-suite',
        label: 'Content Studio',
        href: '/content-suite',
        icon: FileText,
        description: 'Content creation and management'
      },
      {
        id: 'lead-management',
        label: 'Leads & CRM',
        href: '/lead-management',
        icon: Users,
        description: 'Lead tracking and CRM'
      }
    ]
  },
  {
    id: 'ai',
    label: 'AI Suite',
    href: '/ai',
    icon: Brain,
    description: 'AI Automation & Optimization',
    children: [
      {
        id: 'ai-automation',
        label: 'AI Automation',
        href: '/ai-automation',
        icon: Zap,
        description: 'Automated workflows'
      },
      {
        id: 'ai-optimization',
        label: 'AI Optimization',
        href: '/ai-optimization',
        icon: TrendingUp,
        description: 'AI-powered optimization'
      },
      {
        id: 'workflow-automation',
        label: 'Workflows',
        href: '/workflow-automation',
        icon: BarChart3,
        description: 'Workflow automation'
      }
    ]
  },
  {
    id: 'business',
    label: 'Business',
    href: '/business-suite',
    icon: Building2,
    description: 'Business Management Suite',
    children: [
      {
        id: 'project-management',
        label: 'Projects',
        href: '/project-management',
        icon: Briefcase,
        description: 'Project management'
      },
      {
        id: 'business-intelligence',
        label: 'Analytics',
        href: '/business-intelligence',
        icon: BarChart3,
        description: 'Business intelligence'
      },
      {
        id: 'financial-management',
        label: 'Financial',
        href: '/financial-management',
        icon: DollarSign,
        description: 'Financial management'
      },
      {
        id: 'e-commerce',
        label: 'E-Commerce',
        href: '/e-commerce',
        icon: ShoppingCart,
        description: 'E-commerce platform'
      },
      {
        id: 'customer-service',
        label: 'Support',
        href: '/customer-service',
        icon: Headphones,
        description: 'Customer service'
      }
    ]
  },
  {
    id: 'team',
    label: 'Team',
    href: '/team-collaboration',
    icon: Users,
    description: 'Team Collaboration',
    children: [
      {
        id: 'collaboration',
        label: 'Workspace',
        href: '/team-collaboration',
        icon: MessageSquare,
        description: 'Team workspace'
      },
      {
        id: 'calendar',
        label: 'Calendar',
        href: '/scheduler',
        icon: Calendar,
        description: 'Unified calendar'
      },
      {
        id: 'tasks',
        label: 'Tasks',
        href: '/task-master',
        icon: Boxes,
        description: 'Task management'
      }
    ]
  }
];

/**
 * UTILITY NAVIGATION - Settings, integrations, etc.
 * These appear in secondary navigation areas
 */
export const utilityNavigation: NavigationItem[] = [
  {
    id: 'integrations',
    label: 'Integrations',
    href: '/integrations',
    icon: Zap,
    description: 'Connect your tools'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Platform analytics'
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/reports',
    icon: FileText,
    description: 'Generate reports'
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Platform settings'
  }
];

/**
 * Get breadcrumb trail for a given path
 */
export function getBreadcrumbs(pathname: string): { label: string; href: string }[] {
  const breadcrumbs: { label: string; href: string }[] = [];

  // Always start with dashboard
  if (pathname !== '/dashboard') {
    breadcrumbs.push({ label: 'Dashboard', href: '/dashboard' });
  }

  // Find matching primary nav item
  for (const item of primaryNavigation) {
    if (pathname.startsWith(item.href)) {
      breadcrumbs.push({ label: item.label, href: item.href });

      // Check children
      if (item.children) {
        for (const child of item.children) {
          if (pathname === child.href || pathname.startsWith(child.href + '/')) {
            breadcrumbs.push({ label: child.label, href: child.href });
            break;
          }
        }
      }
      break;
    }
  }

  // Check utility navigation
  for (const item of utilityNavigation) {
    if (pathname === item.href || pathname.startsWith(item.href + '/')) {
      if (breadcrumbs.length === 1) {
        // Only dashboard in breadcrumbs, add this item
        breadcrumbs.push({ label: item.label, href: item.href });
      }
      break;
    }
  }

  return breadcrumbs;
}

/**
 * Get active navigation item for a given path
 */
export function getActiveNavItem(pathname: string): NavigationItem | null {
  // Check primary navigation
  for (const item of primaryNavigation) {
    if (pathname === item.href) return item;

    if (item.children) {
      for (const child of item.children) {
        if (pathname === child.href) return child;
      }
    }
  }

  // Check utility navigation
  for (const item of utilityNavigation) {
    if (pathname === item.href) return item;
  }

  return null;
}

/**
 * Get parent navigation item for a given path
 */
export function getParentNavItem(pathname: string): NavigationItem | null {
  for (const item of primaryNavigation) {
    if (item.children) {
      for (const child of item.children) {
        if (pathname === child.href || pathname.startsWith(child.href + '/')) {
          return item;
        }
      }
    }
  }
  return null;
}
