'use client';

import NavigationTabs from '@/components/NavigationTabs';
import ProductionInfrastructure from '@/components/ProductionInfrastructure';

export default function InfrastructurePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationTabs />
      <div className="container mx-auto px-4 py-8">
        <ProductionInfrastructure />
      </div>
    </div>
  );
}