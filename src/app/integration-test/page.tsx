'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://autopilot-api-1.onrender.com';

export default function IntegrationTestPage() {
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<string | null>(null);

  const testEndpoint = async (endpoint: string, name: string, method: 'GET' | 'POST' = 'GET') => {
    setLoading(name);
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' }
      });
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
              
              <Button
                onClick={() => testEndpoint('/google-ads/test-token', 'google-token', 'POST')}
                disabled={loading === 'google-token'}
                variant="outline"
                className="w-full"
              >
                {loading === 'google-token' ? 'Testing...' : 'Test OAuth Token'}
              </Button>
              
              {(results['google-config'] || results['google-token']) && (
                <div className={`p-3 rounded border ${
                  (results['google-config']?.success || results['google-token']?.success) ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                }`}>
                  <Badge variant={(results['google-config']?.success || results['google-token']?.success) ? 'secondary' : 'destructive'}>
                    {results['google-config'] ? `Config: HTTP ${results['google-config'].status}` : `Token: HTTP ${results['google-token']?.status}`}
                  </Badge>
                  <pre className="text-xs mt-2 overflow-auto max-h-32">
                    {results['google-config']?.data || results['google-token']?.data}
                  </pre>
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
                onClick={() => testEndpoint('/meta/test', 'meta-test')}
                disabled={loading === 'meta-test'}
                className="w-full"
              >
                {loading === 'meta-test' ? 'Testing...' : 'Test Meta API'}
              </Button>
              
              <Button
                onClick={() => testEndpoint('/meta/status', 'meta-status')}
                disabled={loading === 'meta-status'}
                variant="outline"
                className="w-full"
              >
                {loading === 'meta-status' ? 'Testing...' : 'Test Meta Status'}
              </Button>
              
              {(results['meta-test'] || results['meta-status']) && (
                <div className={`p-3 rounded border ${
                  (results['meta-test']?.success || results['meta-status']?.success) ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                }`}>
                  <Badge variant={(results['meta-test']?.success || results['meta-status']?.success) ? 'secondary' : 'destructive'}>
                    {results['meta-test'] ? `Test: HTTP ${results['meta-test'].status}` : `Status: HTTP ${results['meta-status']?.status}`}
                  </Badge>
                  <pre className="text-xs mt-2 overflow-auto max-h-32">
                    {results['meta-test']?.data || results['meta-status']?.data}
                  </pre>
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