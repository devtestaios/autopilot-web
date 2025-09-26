'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { PageSkeleton, DashboardWidgetSkeleton } from '@/components/ui/Skeleton';
import { AsyncContent } from '@/components/ui/AsyncContent';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { fetchDashboardOverview, fetchCampaigns, fetchKPISummary } from '@/lib/api';

// Dynamic imports to prevent SSR issues
const DashboardCustomizer = dynamic(
  () => import('@/components/DashboardCustomizer').then(mod => ({ default: mod.default })),
  { ssr: false, loading: () => <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-64 rounded-lg"></div> }
);
const AdvancedNavigation = dynamic(() => import('@/components/ui/AdvancedNavigation'), { ssr: false });
const UnifiedSidebar = dynamic(() => import('@/components/UnifiedSidebar'), { ssr: false });
const Breadcrumb = dynamic(() => import('@/components/ui/Breadcrumb'), { ssr: false });

// Widget Components - also load dynamically
const MetricWidget = dynamic(() => import('@/components/dashboard/widgets/MetricWidget'), { ssr: false });
const ChartWidget = dynamic(() => import('@/components/dashboard/widgets/ChartWidget'), { ssr: false });
const TableWidget = dynamic(() => import('@/components/dashboard/widgets/TableWidget'), { ssr: false });
const InsightsWidget = dynamic(() => import('@/components/dashboard/widgets/InsightsWidget'), { ssr: false });

// Import the type separately
import type { DashboardWidget } from '@/components/DashboardCustomizer';

export default function CustomizableDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const { error, handleError, clearError } = useErrorHandler();

  // Load dashboard data and configuration
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        clearError();

        // Load dashboard data in parallel
        const [overview, campaigns, kpiSummary] = await Promise.all([
          fetchDashboardOverview(),
          fetchCampaigns(),
          fetchKPISummary()
        ]);

        setDashboardData({
          overview,
          campaigns,
          kpi: kpiSummary
        });

        // Load saved widget configuration or use defaults
        const savedConfig = localStorage.getItem('dashboard-widgets');
        if (savedConfig) {
          setWidgets(JSON.parse(savedConfig));
        } else {
          // Default widget configuration
          setWidgets([
            {
              id: 'revenue-metric',
              type: 'metric',
              title: 'Total Revenue',
              component: 'RevenueMetric',
              size: 'small',
              position: { x: 0, y: 0 },
              visible: true,
              config: { metric: 'revenue' }
            },
            {
              id: 'campaigns-metric',
              type: 'metric',
              title: 'Active Campaigns',
              component: 'CampaignMetric',
              size: 'small',
              position: { x: 1, y: 0 },
              visible: true,
              config: { metric: 'campaigns' }
            },
            {
              id: 'performance-chart',
              type: 'chart',
              title: 'Performance Trends',
              component: 'PerformanceChart',
              size: 'medium',
              position: { x: 0, y: 1 },
              visible: true,
              config: { chartType: 'line', period: '7d' }
            },
            {
              id: 'ai-insights',
              type: 'insights',
              title: 'AI Recommendations',
              component: 'AIInsights',
              size: 'large',
              position: { x: 0, y: 2 },
              visible: true,
              config: { maxInsights: 5 }
            }
          ]);
        }

      } catch (err) {
        handleError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user, handleError, clearError]);

  // Save widget configuration
  const saveWidgetConfiguration = () => {
    localStorage.setItem('dashboard-widgets', JSON.stringify(widgets));
  };

  // Render individual widget
  const renderWidget = (widget: DashboardWidget) => {
    if (!widget.visible) return null;

    const widgetProps = {
      widget,
      data: dashboardData,
      isEditMode,
      onSelect: () => setIsEditMode(true)
    };

    let WidgetComponent;
    switch (widget.component) {
      case 'RevenueMetric':
      case 'CampaignMetric':
        WidgetComponent = MetricWidget;
        break;
      case 'PerformanceChart':
      case 'PlatformChart':
        WidgetComponent = ChartWidget;
        break;
      case 'TopCampaignsTable':
        WidgetComponent = TableWidget;
        break;
      case 'AIInsights':
        WidgetComponent = InsightsWidget;
        break;
      default:
        return null;
    }

    return (
      <motion.div
        key={widget.id}
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`
          ${getWidgetSizeClass(widget.size)}
          ${isEditMode ? 'ring-2 ring-blue-200 dark:ring-blue-800 rounded-lg' : ''}
        `}
      >
        <WidgetComponent {...widgetProps} />
      </motion.div>
    );
  };

  // Get CSS classes for widget size
  const getWidgetSizeClass = (size: DashboardWidget['size']) => {
    switch (size) {
      case 'small':
        return 'col-span-1 row-span-1';
      case 'medium':
        return 'col-span-2 row-span-1';
      case 'large':
        return 'col-span-2 row-span-2';
      case 'full':
        return 'col-span-4 row-span-1';
      default:
        return 'col-span-1 row-span-1';
    }
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <UnifiedSidebar onCollapseChange={setSidebarCollapsed} />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-14' : 'lg:ml-[220px]'}`}>
        {/* Navigation */}
        <AdvancedNavigation sidebarCollapsed={sidebarCollapsed} />
        
        {/* Page Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-6" />

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Customizable Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Drag, drop, and configure widgets to create your perfect dashboard
            </p>
          </div>

          {/* Dashboard Content */}
          <AsyncContent
            loading={loading}
            error={error}
            fallback={
              <PageSkeleton>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <DashboardWidgetSkeleton />
                  <DashboardWidgetSkeleton />
                  <DashboardWidgetSkeleton />
                  <DashboardWidgetSkeleton />
                </div>
              </PageSkeleton>
            }
          >
            <div className="relative">
              {/* Widget Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-auto">
                {widgets.map(renderWidget)}
              </div>

              {/* Empty State */}
              {widgets.filter(w => w.visible).length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Settings className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      </motion.div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Your dashboard is empty
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Click "Customize Dashboard" to add widgets and create your personalized view
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Dashboard Customizer */}
              <DashboardCustomizer
                widgets={widgets}
                onWidgetsChange={setWidgets}
                onSave={saveWidgetConfiguration}
                isEditMode={isEditMode}
                onEditModeChange={setIsEditMode}
              />
            </div>
          </AsyncContent>
        </main>
      </div>
    </div>
  );
}