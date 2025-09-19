import AlertDashboard from '@/components/AlertDashboard';
import NavigationTabs from '@/components/NavigationTabs';

export default function AlertsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationTabs />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Smart Alert System</h1>
          <p className="text-xl text-muted-foreground">
            Intelligent monitoring and proactive notifications for your marketing campaigns
          </p>
        </div>
        
        <AlertDashboard />
      </div>
    </div>
  );
}