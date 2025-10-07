'use client';

import dynamic from 'next/dynamic';
import { ComponentProps } from 'react';

// Import GlobalSearch without SSR
const GlobalSearch = dynamic(() => import('./GlobalSearch').then(mod => ({ default: mod.GlobalSearch })), { 
  ssr: false,
  loading: () => (
    <div className="w-full max-w-md mx-auto">
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search campaigns, leads, pages..."
          className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 shadow-sm"
          disabled
        />
      </div>
    </div>
  )
});

interface ClientOnlyGlobalSearchProps {
  className?: string;
  placeholder?: string;
  variant?: 'default' | 'header' | 'modal';
  onClose?: () => void;
}

export function ClientOnlyGlobalSearch(props: ClientOnlyGlobalSearchProps) {
  return <GlobalSearch {...props} />;
}