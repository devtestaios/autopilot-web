'use client';

import { Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdvancedAICapabilities from '@/components/AdvancedAICapabilities';

function LoadingSkeleton() {
  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        <div className="h-8 w-96 bg-muted animate-pulse rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded"></div>
          ))}
        </div>
        <div className="h-96 bg-muted animate-pulse rounded"></div>
      </div>
    </div>
  );
}

export default function AICapabilitiesPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<LoadingSkeleton />}>
        <AdvancedAICapabilities />
      </Suspense>
    </ProtectedRoute>
  );
}