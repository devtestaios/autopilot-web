/**
 * Marketing Content Studio - Integrated Content Creation Hub  
 * This redirects to the existing content suite functionality 
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MarketingContentPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to existing content suite route
    router.push('/content-suite');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to Content Studio...</p>
      </div>
    </div>
  );
}