'use client';

import dynamic from 'next/dynamic';

const AIDashboard = dynamic(() => import('@/components/AIDashboard'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
});

export default function AIPage() {
  return (
    <div className="container mx-auto p-6">
      <AIDashboard />
    </div>
  );
}