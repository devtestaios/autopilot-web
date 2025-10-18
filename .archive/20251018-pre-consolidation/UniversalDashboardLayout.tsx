'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Dynamic imports for performance
const ContextualUnifiedSidebar = dynamic(() => import('@/components/ContextualUnifiedSidebar'), {
  ssr: false,
  loading: () => (
    <div className="hidden md:block w-14 h-full bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 animate-pulse" />
  )
});

const VSCodeAIChat = dynamic(() => import('@/components/VSCodeAIChat'), {
  ssr: false,
  loading: () => null
});

// ============================================================================
// UNIVERSAL DASHBOARD LAYOUT COMPONENT
// ============================================================================

interface UniversalDashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
  showSidebar?: boolean;
  showAIChat?: boolean;
  sidebarDefaultCollapsed?: boolean;
}

export default function UniversalDashboardLayout({
  children,
  className,
  showSidebar = true,
  showAIChat = true,
  sidebarDefaultCollapsed = false
}: UniversalDashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(sidebarDefaultCollapsed);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydration safety
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Don't render on server to prevent hydration mismatch
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex">
          {showSidebar && (
            <div className="hidden md:block w-14 h-screen bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 animate-pulse" />
          )}
          <div className="flex-1">
            <div className="p-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md w-2/3 mb-8"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* Contextual Sidebar */}
        {showSidebar && (
          <ContextualUnifiedSidebar
            defaultCollapsed={sidebarDefaultCollapsed}
            onCollapseChange={setSidebarCollapsed}
          />
        )}

        {/* Main Content Area */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "flex-1 transition-all duration-300",
            // Responsive margin based on sidebar state
            showSidebar && !sidebarCollapsed && "md:ml-60",
            showSidebar && sidebarCollapsed && "md:ml-14",
            className
          )}
        >
          {children}
        </motion.main>
      </div>

      {/* Universal AI Chat */}
      {showAIChat && (
        <VSCodeAIChat defaultMinimized={true} />
      )}
    </div>
  );
}

// ============================================================================
// DASHBOARD PAGE WRAPPER COMPONENT
// ============================================================================

interface DashboardPageWrapperProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  showSidebar?: boolean;
  showAIChat?: boolean;
  sidebarDefaultCollapsed?: boolean;
  headerActions?: React.ReactNode;
}

export function DashboardPageWrapper({
  children,
  title,
  description,
  className,
  showSidebar = true,
  showAIChat = true,
  sidebarDefaultCollapsed = false,
  headerActions
}: DashboardPageWrapperProps) {
  return (
    <UniversalDashboardLayout
      showSidebar={showSidebar}
      showAIChat={showAIChat}
      sidebarDefaultCollapsed={sidebarDefaultCollapsed}
    >
      <div className={cn("container mx-auto px-6 py-8", className)}>
        {/* Page Header */}
        {(title || description || headerActions) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-start justify-between">
              <div>
                {title && (
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    {description}
                  </p>
                )}
              </div>
              {headerActions && (
                <div className="flex items-center space-x-4">
                  {headerActions}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Page Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {children}
        </motion.div>
      </div>
    </UniversalDashboardLayout>
  );
}

// ============================================================================
// QUICK LAYOUT PRESETS
// ============================================================================

// Primary Dashboard Layout (Master Terminal)
export function PrimaryDashboardLayout({ children, ...props }: Omit<DashboardPageWrapperProps, 'showSidebar'>) {
  return (
    <DashboardPageWrapper
      {...props}
      showSidebar={true}
      sidebarDefaultCollapsed={false}
    >
      {children}
    </DashboardPageWrapper>
  );
}

// Secondary Dashboard Layout (Platform-specific)
export function SecondaryDashboardLayout({ children, ...props }: Omit<DashboardPageWrapperProps, 'showSidebar'>) {
  return (
    <DashboardPageWrapper
      {...props}
      showSidebar={true}
      sidebarDefaultCollapsed={false}
    >
      {children}
    </DashboardPageWrapper>
  );
}

// Tertiary Dashboard Layout (Sub-platform specific)
export function TertiaryDashboardLayout({ children, ...props }: Omit<DashboardPageWrapperProps, 'showSidebar'>) {
  return (
    <DashboardPageWrapper
      {...props}
      showSidebar={true}
      sidebarDefaultCollapsed={true}
    >
      {children}
    </DashboardPageWrapper>
  );
}

// Minimal Layout (No sidebar, AI chat only)
export function MinimalDashboardLayout({ children, ...props }: Omit<DashboardPageWrapperProps, 'showSidebar'>) {
  return (
    <DashboardPageWrapper
      {...props}
      showSidebar={false}
      showAIChat={true}
    >
      {children}
    </DashboardPageWrapper>
  );
}

// Full Layout (Everything enabled)
export function FullDashboardLayout({ children, ...props }: DashboardPageWrapperProps) {
  return (
    <DashboardPageWrapper
      {...props}
      showSidebar={true}
      showAIChat={true}
      sidebarDefaultCollapsed={false}
    >
      {children}
    </DashboardPageWrapper>
  );
}