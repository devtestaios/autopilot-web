'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Edit, Save } from 'lucide-react';
import dynamic from 'next/dynamic';

// SSR-safe dynamic imports following coding dissertation patterns
const UnifiedSidebar = dynamic(() => import('@/components/UnifiedSidebar'), {
  ssr: false,
  loading: () => <div className="fixed left-0 top-0 h-screen w-56 bg-gray-900 animate-pulse" />
});

const AdvancedNavigation = dynamic(() => import('@/components/DashboardNavbar'), {
  ssr: false,
  loading: () => <div className="h-16 bg-white dark:bg-gray-900 border-b animate-pulse" />
});

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/EnhancedAuthContext';

interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'summary';
  title: string;
  data: any;
}

export default function CustomizableDashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // SSR-safe mounting pattern from coding dissertation
  useEffect(() => {
    setMounted(true);
  }, []);

  // Default widgets configuration
  const getDefaultWidgets = (): DashboardWidget[] => [
    {
      id: 'revenue-metric',
      type: 'metric',
      title: 'Total Revenue',
      data: { value: '$124,350', label: 'This month' }
    },
    {
      id: 'campaigns-metric',
      type: 'metric', 
      title: 'Active Campaigns',
      data: { value: '23', label: 'Running campaigns' }
    },
    {
      id: 'performance-chart',
      type: 'chart',
      title: 'Performance Overview',
      data: null
    },
    {
      id: 'ai-insights',
      type: 'summary',
      title: 'AI Recommendations',
      data: [
        'Optimize budget allocation for Meta campaigns',
        'Increase Google Ads frequency for high-performing keywords', 
        'Consider expanding to LinkedIn advertising'
      ]
    }
  ];

  // Load dashboard data - SSR-safe approach
  useEffect(() => {
    if (!mounted || !user) return;

    const loadDashboardData = async () => {
      try {
        setLoading(true);

        // SSR-safe localStorage access
        if (typeof window !== 'undefined') {
          const savedConfig = localStorage.getItem('dashboard-widgets');
          if (savedConfig) {
            try {
              setWidgets(JSON.parse(savedConfig));
            } catch (e) {
              console.error('Error parsing saved config:', e);
              setWidgets(getDefaultWidgets());
            }
          } else {
            setWidgets(getDefaultWidgets());
          }
        }

      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user, mounted]);

  // Save configuration - SSR-safe
  const saveConfiguration = () => {
    if (mounted && typeof window !== 'undefined') {
      try {
        localStorage.setItem('dashboard-widgets', JSON.stringify(widgets));
        console.log('Configuration saved successfully');
      } catch (e) {
        console.error('Error saving configuration:', e);
      }
    }
  };

  // SSR protection according to coding dissertation
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <UnifiedSidebar 
        onCollapseChange={setSidebarCollapsed}
      />
      
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <AdvancedNavigation 
          sidebarCollapsed={sidebarCollapsed}
        />
        
        <main className="p-6">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <LayoutDashboard className="h-8 w-8" />
                Customizable Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Customize your dashboard widgets and layout
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  isEditMode
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isEditMode ? (
                  <>
                    <Save className="h-4 w-4" />
                    Exit Edit
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4" />
                    Edit Layout
                  </>
                )}
              </button>
              
              {isEditMode && (
                <button
                  onClick={saveConfiguration}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Config
                </button>
              )}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {widgets.map((widget) => (
                <div
                  key={widget.id}
                  className={`
                    bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700
                    ${isEditMode ? 'ring-2 ring-blue-500 cursor-move' : ''}
                    transition-all duration-200 hover:shadow-lg
                  `}
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {widget.title}
                  </h3>
                  
                  {widget.type === 'metric' && widget.data && (
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {widget.data.value}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {widget.data.label}
                      </div>
                    </div>
                  )}
                  
                  {widget.type === 'chart' && (
                    <div className="h-32 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded">
                      <span className="text-gray-400">Performance Chart</span>
                    </div>
                  )}
                  
                  {widget.type === 'summary' && widget.data && (
                    <div className="space-y-2">
                      {widget.data.map((item: string, index: number) => (
                        <div key={index} className="text-sm text-gray-600 dark:text-gray-300">
                          • {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
