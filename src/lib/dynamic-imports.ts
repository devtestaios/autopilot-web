import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const createLoadingSkeleton = (type: string) => {
  if (type === 'card') {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }
  
  return <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>;
};

const createDynamicImport = (importPath: string, loadingType = 'card') => {
  return dynamic(
    () => import(importPath),
    { 
      ssr: false,
      loading: () => createLoadingSkeleton(loadingType)
    }
  );
};

export const AIComponents = {
  AIControlChat: createDynamicImport('@/components/AIControlChat'),
  UnifiedAIChat: createDynamicImport('@/components/UnifiedAIChat'),
};

export const DashboardComponents = {
  CustomizableDashboard: createDynamicImport('@/components/CustomizableDashboard'),
  PerformanceMetrics: createDynamicImport('@/components/PerformanceMetrics'),
};

export default {
  AIComponents,
  DashboardComponents,
  createDynamicImport,
  createLoadingSkeleton,
};
