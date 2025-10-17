import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// Loading skeletons
const CardLoadingSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
    </CardHeader>
    <CardContent>
      <div className="h-20 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
    </CardContent>
  </Card>
);

const DefaultLoadingSkeleton = () => (
  <div className="h-40 bg-gray-100 dark:bg-gray-800 rounded animate-pulse"></div>
);

// AI Components with static imports (required by Next.js dynamic)
export const AIComponents = {
  AIControlChat: dynamic(() => import('@/components/AIControlChat'), {
    ssr: false,
    loading: CardLoadingSkeleton
  }),
  UnifiedAIChat: dynamic(() => import('@/components/UnifiedAIChat'), {
    ssr: false,
    loading: CardLoadingSkeleton
  }),
};

// Dashboard Components with static imports
export const DashboardComponents = {
  CustomizableDashboard: dynamic(() => import('@/components/CustomizableDashboard'), {
    ssr: false,
    loading: DefaultLoadingSkeleton
  }),
  PerformanceMetrics: dynamic(() => import('@/components/PerformanceMetrics'), {
    ssr: false,
    loading: DefaultLoadingSkeleton
  }),
};

export default {
  AIComponents,
  DashboardComponents,
  CardLoadingSkeleton,
  DefaultLoadingSkeleton,
};
