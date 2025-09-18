import AlertDashboard from '@/components/AlertDashboard';

export default function AlertsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Smart Alert System</h1>
        <p className="text-xl text-muted-foreground">
          Intelligent monitoring and proactive notifications for your marketing campaigns
        </p>
      </div>
      
      <AlertDashboard />
    </div>
  );
}