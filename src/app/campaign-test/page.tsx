'use client';

import { useState, useEffect } from 'react';
import { fetchCampaigns } from '@/lib/campaigns-service';

export default function CampaignTestPage() {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runCampaignTests = async () => {
    setLoading(true);
    console.log('🔍 Testing campaign database connection...');
    
    try {
      const startTime = Date.now();
      const { campaigns, error } = await fetchCampaigns();
      const endTime = Date.now();
      
      setTestResults({
        timestamp: new Date().toISOString(),
        success: !error,
        error: error,
        campaignCount: campaigns.length,
        loadTime: endTime - startTime,
        campaigns: campaigns.slice(0, 3), // Show first 3 campaigns
        sampleCampaign: campaigns[0] // Show detailed structure of first campaign
      });
      
    } catch (error) {
      setTestResults({
        timestamp: new Date().toISOString(),
        success: false,
        error: `Unexpected error: ${error}`,
        campaignCount: 0,
        loadTime: 0
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runCampaignTests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">🎯 Campaign Management Backend Test</h1>
          
          {/* Test Status */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-800 mb-3">Step 2C - Backend Connection Status</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Status:</strong> {loading ? 'Testing...' : testResults?.success ? 'Connected ✅' : 'Error ❌'}</p>
              {testResults && (
                <>
                  <p><strong>Campaigns Found:</strong> {testResults.campaignCount}</p>
                  <p><strong>Load Time:</strong> {testResults.loadTime}ms</p>
                  <p><strong>Timestamp:</strong> {new Date(testResults.timestamp).toLocaleString()}</p>
                </>
              )}
            </div>
          </div>

          {/* Test Results */}
          {testResults && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <h2 className="text-lg font-semibold text-green-800 mb-3">Database Connection Results</h2>
              
              {testResults.success ? (
                <div className="space-y-4">
                  <div className="p-3 bg-white rounded border">
                    <h3 className="font-medium text-gray-800 mb-2">✅ Connection Successful</h3>
                    <div className="text-sm space-y-1">
                      <p>📊 <strong>Campaigns Loaded:</strong> {testResults.campaignCount}</p>
                      <p>⚡ <strong>Performance:</strong> {testResults.loadTime}ms</p>
                      <p>🔗 <strong>Database:</strong> Supabase connection active</p>
                    </div>
                  </div>

                  {testResults.sampleCampaign && (
                    <div className="p-3 bg-white rounded border">
                      <h3 className="font-medium text-gray-800 mb-2">📋 Sample Campaign Data</h3>
                      <div className="text-sm space-y-1">
                        <p><strong>Name:</strong> {testResults.sampleCampaign.name}</p>
                        <p><strong>Status:</strong> {testResults.sampleCampaign.status}</p>
                        <p><strong>Platforms:</strong> {testResults.sampleCampaign.platforms.join(', ')}</p>
                        <p><strong>Budget:</strong> ${testResults.sampleCampaign.budget.total.toLocaleString()}</p>
                        <p><strong>Performance:</strong> {testResults.sampleCampaign.performance.impressions.toLocaleString()} impressions</p>
                      </div>
                    </div>
                  )}

                  {testResults.campaigns && testResults.campaigns.length > 0 && (
                    <div className="p-3 bg-white rounded border">
                      <h3 className="font-medium text-gray-800 mb-2">📈 All Campaigns Summary</h3>
                      <div className="space-y-2">
                        {testResults.campaigns.map((campaign: any, index: number) => (
                          <div key={campaign.id} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                            <span><strong>{index + 1}.</strong> {campaign.name}</span>
                            <span className="text-blue-600">{campaign.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-red-50 rounded border border-red-200">
                  <h3 className="font-medium text-red-800 mb-2">❌ Connection Failed</h3>
                  <p className="text-red-700 text-sm">{testResults.error}</p>
                </div>
              )}
            </div>
          )}

          {/* Raw Data */}
          {testResults && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Raw Test Data</h2>
              <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-96">
                {JSON.stringify(testResults, null, 2)}
              </pre>
            </div>
          )}

          {/* Actions */}
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
            <h2 className="text-lg font-semibold text-yellow-800 mb-3">Test Actions</h2>
            <div className="flex space-x-3">
              <button
                onClick={runCampaignTests}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Refresh Test'}
              </button>
              <a 
                href="/campaigns" 
                className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-medium"
              >
                Open Campaigns Page →
              </a>
              <a 
                href="/database-test" 
                className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 font-medium"
              >
                ← Database Test
              </a>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">🚀 Progress Summary:</h3>
            <div className="text-blue-700 text-sm space-y-2">
              <p>✅ <strong>Step 2A Complete:</strong> Database connection verified with real data</p>
              <p>✅ <strong>Step 2B Complete:</strong> Authentication system tested and working</p>
              <p>🔄 <strong>Step 2C In Progress:</strong> Campaign management backend connection</p>
              <div className="mt-3">
                <p className="font-medium">Status: {testResults?.success ? '✅ Backend Connected Successfully!' : '🔄 Testing backend connection...'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}