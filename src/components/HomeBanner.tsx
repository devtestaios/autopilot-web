'use client';

import { Button } from '@/components/ui/button';
import { Shield, Wifi, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function QuickStartBanner() {
  const pathname = usePathname();
  
  // Only show on homepage or when no platforms are connected
  if (pathname !== '/' && pathname !== '/platforms') {
    return null;
  }
  
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="text-center lg:text-left">
            <h2 className="text-xl font-bold mb-2">🚀 Get Started with OAuth Platform Connections</h2>
            <p className="text-blue-100">
              Connect your marketing platforms to start tracking campaign performance across Facebook, Google Ads, LinkedIn, and more.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/platforms/setup">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                <Wifi className="h-5 w-5 mr-2" />
                Connect Platform
              </Button>
            </Link>
            
            <Link href="/platforms">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-blue-600">
                <Settings className="h-5 w-5 mr-2" />
                Manage Connections
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickStartBanner;