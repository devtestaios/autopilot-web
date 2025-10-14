'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3,
  Settings,
  Zap,
  Wifi,
  User,
  Home,
  Mail
} from 'lucide-react';

// =============================================================================
// NAVIGATION COMPONENT
// =============================================================================

const navigationItems = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
    description: 'Welcome and setup'
  },
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
    description: 'Analytics and insights',
    badge: 'New'
  },
  {
    name: 'Platforms',
    href: '/platforms',
    icon: Wifi,
    description: 'Marketing platform connections',
    badge: 'OAuth'
  },
  {
    name: 'Campaigns',
    href: '/campaigns',
    icon: BarChart3,
    description: 'Campaign performance'
  },
  {
    name: 'Automation',
    href: '/automation',
    icon: Zap,
    description: 'Automated optimizations'
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: Mail,
    description: 'Email reports and alerts'
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Account and preferences'
  }
];

export function Navigation() {
  const pathname = usePathname();
  
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PulseBridge</span>
            </Link>
          </div>
          
          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className="relative"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                    {item.badge && (
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>
          
          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Account
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden mt-4">
          <div className="grid grid-cols-2 gap-2">
            {navigationItems.slice(0, 4).map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const Icon = item.icon;
              
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'outline'}
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

// =============================================================================
// QUICK START COMPONENT
// =============================================================================

export function QuickStartBanner() {
  const pathname = usePathname();
  
  // Only show on homepage or when no platforms are connected
  if (pathname !== '/' && pathname !== '/platforms') {
    return null;
  }
  
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">🚀 Get Started with OAuth Platform Connections</h2>
            <p className="text-blue-100">
              Connect your marketing platforms to start tracking campaign performance across Facebook, Google Ads, LinkedIn, and more.
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Link href="/platforms/setup">
              <Button variant="secondary" size="lg">
                <Wifi className="h-5 w-5 mr-2" />
                Connect Platform
              </Button>
            </Link>
            
            <Link href="/platforms">
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-blue-600">
                <Settings className="h-5 w-5 mr-2" />
                Manage Connections
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navigation;