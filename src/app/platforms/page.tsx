import { PlatformSetupManager } from '@/components/PlatformSetupManager';
import Link from 'next/link';
import { Brain } from 'lucide-react';

export default function PlatformsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PlatformSetupManager />
        
        {/* AI Optimization Feature Banner */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8" />
              <div>
                <h3 className="text-xl font-semibold">AI-Powered Campaign Optimization</h3>
                <p className="text-blue-100 mt-1">
                  Get intelligent insights and recommendations to maximize your campaign performance
                </p>
              </div>
            </div>
            <Link 
              href="/optimization"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Try AI Optimization →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}