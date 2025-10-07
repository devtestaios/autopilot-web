/**
 * Marketing Campaigns - Integrated into Marketing Command Center
 * This maintains the existing campaign functionality while being part of the unified marketing suite
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MarketingCampaignsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect legacy /marketing/campaigns to the existing /campaigns route
    // This maintains backward compatibility while implementing the unified structure
    router.push('/campaigns');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to Campaign Management...</p>
      </div>
    </div>
  );
}