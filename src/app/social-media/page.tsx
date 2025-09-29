'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * DEPRECATED ROUTE - REDIRECT TO UNIFIED PLATFORM
 * 
 * This route has been consolidated into the unified Social Media Management Platform.
 * All social media functionality is now available at /social with modular views:
 * - Calendar View (content scheduling)
 * - Accounts View (platform management) 
 * - Analytics View (performance tracking)
 * - Composer View (content creation)
 */
export default function SocialMediaRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to unified social media platform
    router.replace('/social');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">
          Redirecting to unified Social Media Management Platform...
        </p>
      </div>
    </div>
  );
}
