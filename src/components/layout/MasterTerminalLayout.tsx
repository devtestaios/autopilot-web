'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, BarChart3, Users, DollarSign, TrendingUp, Activity, 
  RefreshCw, Zap, Settings, Grid3X3, List, Calendar,
  ChevronRight, ExternalLink, Play, Pause, AlertCircle,
  Menu, X, Search, Bell, User, ChevronDown, Home
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Master Terminal Header Component
interface MasterTerminalHeaderProps {
  onSidebarToggle: () => void;
  sidebarOpen: boolean;
}

function MasterTerminalHeader({ onSidebarToggle, sidebarOpen }: MasterTerminalHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onSidebarToggle}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Master Terminal
            </h1>
          </div>
        </div>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-md mx-6">
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search platforms, insights, or take action..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          {notifications > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notifications}
            </span>
          )}
        </button>
        
        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </header>
  );
}

// Master Terminal Sidebar Component
interface MasterTerminalSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

function MasterTerminalSidebar({ isOpen, onClose }: MasterTerminalSidebarProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('overview');

  const navigationCategories = [
    {
      id: 'overview',
      name: 'Overview',
      icon: Home,
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
        { name: 'System Status', path: '/status', icon: Activity },
        { name: 'Quick Actions', path: '/quick-actions', icon: Zap }
      ]
    },
    {
      id: 'marketing',
      name: 'Marketing Suite',
      icon: Target,
      items: [
        { name: 'Social Media', path: '/social-media', icon: Users },
        { name: 'Email Marketing', path: '/email-marketing', icon: Grid3X3 },
        { name: 'Marketing Command Center', path: '/marketing', icon: Target },
        { name: 'Campaigns', path: '/campaigns', icon: TrendingUp }
      ]
    },
    {
      id: 'operations',
      name: 'Operations Suite',
      icon: Settings,
      items: [
        { name: 'Project Management', path: '/project-management', icon: List },
        { name: 'Team Collaboration', path: '/collaboration', icon: Users },
        { name: 'Workflow Automation', path: '/automation', icon: Zap },
        { name: 'Resource Management', path: '/resources', icon: Grid3X3 }
      ]
    },
    {
      id: 'analytics',
      name: 'Analytics Suite',
      icon: BarChart3,
      items: [
        { name: 'Business Intelligence', path: '/business-intelligence', icon: BarChart3 },
        { name: 'Performance Analytics', path: '/analytics', icon: TrendingUp },
        { name: 'Predictive Insights', path: '/insights', icon: Activity }
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise Suite',
      icon: DollarSign,
      items: [
        { name: 'Integrations', path: '/integrations', icon: Zap },
        { name: 'White-label Builder', path: '/whitelabel', icon: Settings },
        { name: 'Enterprise Settings', path: '/enterprise', icon: Settings }
      ]
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -320 }}
        animate={{ x: isOpen ? 0 : -320 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Platform Navigation
            </h2>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            {navigationCategories.map((category) => (
              <div key={category.id}>
                <button
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? '' : category.id)}
                  className="w-full flex items-center justify-between p-3 text-left rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <category.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </span>
                  </div>
                  <ChevronRight 
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      selectedCategory === category.id ? 'rotate-90' : ''
                    }`} 
                  />
                </button>

                <AnimatePresence>
                  {selectedCategory === category.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="mt-2 ml-8 space-y-1 overflow-hidden"
                    >
                      {category.items.map((item) => (
                        <Link
                          key={item.path}
                          href={item.path}
                          onClick={onClose}
                          className="flex items-center gap-3 p-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                        >
                          <item.icon className="w-4 h-4" />
                          {item.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}

interface MasterTerminalLayoutProps {
  children: React.ReactNode;
}

export default function MasterTerminalLayout({ children }: MasterTerminalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <MasterTerminalHeader 
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />
      
      <MasterTerminalSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <main className="pt-0">
        {children}
      </main>
    </div>
  );
}