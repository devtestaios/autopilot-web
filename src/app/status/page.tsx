'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { checkApiHealth } from '@/lib/api';

interface HealthStatus {
  health: string;
  version: string;
  database: string;
}

export default function StatusPage() {
  const [status, setStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStatus() {
      try {
        const healthData = await checkApiHealth();
        setStatus(healthData);
      } catch {
        setStatus({
          health: '❌ Connection Failed',
          version: '❌ Unreachable',
          database: '❌ Unreachable'
        });
      } finally {
        setLoading(false);
      }
    }

    loadStatus();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Status</h1>
            <p className="text-gray-600 mt-1">Monitor the health of Autopilot services</p>
          </div>
          <Link
            href="/"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            ))
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">API Health</h3>
                <p className="text-lg font-semibold">{status?.health}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">API Version</h3>
                <p className="text-lg font-semibold">{status?.version}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Database</h3>
                <p className="text-lg font-semibold">{status?.database}</p>
              </div>
            </>
          )}
        </div>

        {/* Detailed Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">System Information</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">API Endpoint</h3>
              <p className="text-sm text-gray-900 font-mono">
                {process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api-1.onrender.com'}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Environment</h3>
              <p className="text-sm text-gray-900">
                {process.env.NODE_ENV === 'production' ? 'Production' : 'Development'}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Last Updated</h3>
              <p className="text-sm text-gray-900">
                {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Need help?</h3>
          <p className="text-sm text-blue-800 mb-3">
            If you&apos;re experiencing issues, try these quick actions:
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
            <Link
              href="/campaigns"
              className="bg-white text-blue-700 px-3 py-1 rounded text-sm border border-blue-300 hover:bg-blue-50 transition-colors"
            >
              View Campaigns
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
