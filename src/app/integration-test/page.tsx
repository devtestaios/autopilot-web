'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api-1.onrender.com';

export default function IntegrationTestPage() {
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const testEndpoint = async (endpoint: string, name: string) => {
    setLoading(name);
    try {
      const response = await fetch(`${API_BASE}${endpoint}`);
      const data = await response.text();
      
      setResults(prev => ({
        ...prev,
        [name]: {
          success: response.ok,
          status: response.status,
          data: data
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [name]: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
    }
    setLoading(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🚀 API Integration Test
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test Google Ads and Meta API integrations after Render deployment
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>🎯 Google Ads API</CardTitle>
              <CardDescription>Test Google Ads integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => testEndpoint('/google-ads/config-check', 'google-config')}
                disabled={loading === 'google-config'}
                className="w-full"
              >
                {loading === 'google-config' ? 'Testing...' : 'Test Config'}
              </Button>
              
              {results['google-config'] && (
                <div className={`p-3 rounded border ${
                  results['google-config'].success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                }`}>
                  <Badge variant={results['google-config'].success ? 'secondary' : 'destructive'}>
                    HTTP {results['google-config'].status}
                  </Badge>
                  <pre className="text-xs mt-2 overflow-auto">{results['google-config'].data}</pre>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📱 Meta Business API</CardTitle>
              <CardDescription>Test Meta API integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => testEndpoint('/meta/status', 'meta-status')}
                disabled={loading === 'meta-status'}
                className="w-full"
              >
                {loading === 'meta-status' ? 'Testing...' : 'Test Meta API'}
              </Button>
              
              {results['meta-status'] && (
                <div className={`p-3 rounded border ${
                  results['meta-status'].success ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                }`}>
                  <Badge variant={results['meta-status'].success ? 'secondary' : 'destructive'}>
                    HTTP {results['meta-status'].status}
                  </Badge>
                  <pre className="text-xs mt-2 overflow-auto">{results['meta-status'].data}</pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>📊 Integration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <p className="text-green-600">✅ Environment variables configured on Render</p>
              <p className="text-green-600">✅ Backend deployed with integration code</p>
              <p className="text-blue-600">🧪 Ready for live API testing</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}