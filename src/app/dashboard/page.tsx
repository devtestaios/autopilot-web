import DashboardStats from "@/components/DashboardStats";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Dashboard - Unified & Clean
        </h1>
        <DashboardStats campaigns={[]} />
      </div>
    </div>
  );
}
