import NavigationTabs from '@/components/NavigationTabs';
import WhiteLabelDashboard from '@/components/WhiteLabelDashboard';

export default function WhiteLabelPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationTabs />
      <div className="container mx-auto p-6">
        <WhiteLabelDashboard />
      </div>
    </div>
  );
}