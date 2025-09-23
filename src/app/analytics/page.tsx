'use client';

import EnhancedAnalyticsDashboard from '@/components/EnhancedAnalyticsDashboard';
import NavigationTabs from '@/components/NavigationTabs';

export default function AnalyticsPage() {
  const mockMetrics = [
    { title: 'Total Impressions', value: '1.2M', change: '+12%' },
    { title: 'Click-through Rate', value: '3.4%', change: '+8%' },
    { title: 'Cost per Click', value: '$1.23', change: '-5%' },
    { title: 'Conversions', value: '456', change: '+15%' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationTabs />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Analytics Dashboard</h1>
        
        {/* Simple metric cards for testing */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mockMetrics.map((metric, index) => (
            <div 
              key={metric.title}
              data-testid="metric-card"
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{metric.title}</h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{metric.value}</span>
                <span className={`text-sm font-medium ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Placeholder chart for testing */}
        <div role="img" aria-label="Performance Chart" className="w-full h-64 bg-gray-200 dark:bg-gray-800 rounded-lg mb-6 flex items-center justify-center">
          <span className="text-gray-500 dark:text-gray-400">Performance Chart</span>
        </div>
        <EnhancedAnalyticsDashboard />
      </div>
    </div>
  );
}