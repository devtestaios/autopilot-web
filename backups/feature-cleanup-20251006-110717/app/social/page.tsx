'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * REDIRECT TO MAIN SOCIAL MEDIA PLATFORM
 * Route: /social → /social-media (main platform)
 */
export default function SocialRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/social-media');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">
          Redirecting to Social Media Platform...
        </p>
      </div>
    </div>
  );
}
