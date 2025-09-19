import { AutopilotDashboard } from '@/components/AutopilotDashboard';

export default function AutopilotPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AutopilotDashboard />
      </div>
    </div>
  );
}