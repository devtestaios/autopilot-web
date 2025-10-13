'use client';

import { useEffect, useState } from 'react';

export default function EnvironmentDebug() {
  const [envData, setEnvData] = useState<any>({});

  useEffect(() => {
    // Client-side environment check
    const clientEnv = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      NODE_ENV: process.env.NODE_ENV,
      // Check if window.location provides any insights
      windowLocation: typeof window !== 'undefined' ? window.location.href : 'SSR',
      // Check if we can access any Next.js specific vars
      allNextPublicVars: Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_'))
    };

    setEnvData(clientEnv);
    console.log('🔍 Environment Debug Data:', clientEnv);
  }, []);

  return (
    <div className="bg-yellow-100 border border-yellow-400 p-4 rounded mb-4">
      <h3 className="font-bold text-lg mb-2">🔍 Environment Debug Info</h3>
      <div className="space-y-2 text-sm">
        <div>
          <strong>Supabase URL:</strong> 
          <span className={envData.NEXT_PUBLIC_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}>
            {envData.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET'}
          </span>
        </div>
        <div>
          <strong>Supabase Key:</strong> 
          <span className={envData.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'}>
            {envData.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET (hidden)' : 'NOT SET'}
          </span>
        </div>
        <div>
          <strong>Base URL:</strong> 
          <span className={envData.NEXT_PUBLIC_BASE_URL ? 'text-green-600' : 'text-red-600'}>
            {envData.NEXT_PUBLIC_BASE_URL || 'NOT SET'}
          </span>
        </div>
        <div>
          <strong>Environment:</strong> {envData.NODE_ENV || 'unknown'}
        </div>
        <div>
          <strong>Window Location:</strong> {envData.windowLocation}
        </div>
        <div>
          <strong>All NEXT_PUBLIC vars:</strong> {envData.allNextPublicVars?.join(', ') || 'none found'}
        </div>
      </div>
    </div>
  );
}