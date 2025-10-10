'use client';

import { useEffect, useState } from 'react';
import { testDatabaseConnection } from '@/lib/database-test';

export default function DatabaseTestPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function runTest() {
      console.log('🚀 Running database connection test...');
      const result = await testDatabaseConnection();
      setTestResult(result);
      setLoading(false);
    }
    
    runTest();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          🔧 PulseBridge Database Connection Test
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Environment Check</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Supabase URL:</span>{' '}
              <span className="text-gray-600 dark:text-gray-400">{process.env.NEXT_PUBLIC_SUPABASE_URL}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Supabase Key:</span>{' '}
              <span className="text-gray-600 dark:text-gray-400">{process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}...</span>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-blue-700 dark:text-blue-300">Testing database connection...</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className={`border rounded-lg p-6 ${
              testResult?.success 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            }`}>
              <h2 className={`text-xl font-semibold mb-4 ${
                testResult?.success 
                  ? 'text-green-700 dark:text-green-300' 
                  : 'text-red-700 dark:text-red-300'
              }`}>
                {testResult?.success ? '✅ Database Connection Successful!' : '❌ Database Connection Failed'}
              </h2>
              
              {testResult?.error && (
                <div className="mb-4">
                  <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded text-sm text-red-700 dark:text-red-300">
                    <strong>Error:</strong> {testResult.error}
                  </div>
                </div>
              )}
            </div>

            {testResult?.data?.tables && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Expected Tables Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(testResult.data.tables).map(([table, exists]) => (
                    <div key={table} className={`p-4 rounded-lg border ${
                      exists 
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    }`}>
                      <div className="flex items-center mb-2">
                        <span className="text-lg mr-2">{exists ? '✅' : '❌'}</span>
                        <span className={`font-medium ${
                          exists 
                            ? 'text-green-700 dark:text-green-300' 
                            : 'text-red-700 dark:text-red-300'
                        }`}>
                          {table}
                        </span>
                      </div>
                      <div className={`text-sm ${
                        exists 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {exists ? 'Accessible' : 'Not found/accessible'}
                      </div>
                    </div>
                  ))}
                </div>
                
                {testResult.data.errors?.length > 0 && (
                  <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Detailed Errors:</h4>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                      {testResult.data.errors.map((error: string, i: number) => (
                        <li key={i}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Next Steps:</h3>
          <div className="text-blue-700 dark:text-blue-300 text-sm space-y-2">
            {testResult?.success ? (
              <div>
                <p>✅ <strong>Step 2A Complete:</strong> Database connection verified!</p>
                <p>🔄 <strong>Next:</strong> Step 2B - Test authentication system</p>
                <p>🔄 <strong>Then:</strong> Step 2C - Connect campaign management to backend</p>
                <div className="mt-3 space-y-2">
                  <div>
                    <a 
                      href="/auth-test" 
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium mr-2"
                    >
                      Test Authentication →
                    </a>
                    <a 
                      href="/auth-setup" 
                      className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 font-medium"
                    >
                      Setup Auth →
                    </a>
                  </div>
                  <div>
                    <a 
                      href="/campaign-test" 
                      className="inline-block bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 font-medium mr-2"
                    >
                      Test Campaign Backend →
                    </a>
                    <a 
                      href="/campaigns" 
                      className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-medium"
                    >
                      Live Campaigns Page →
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p>⚠️ <strong>Database Issue Detected:</strong> Tables need to be created in Supabase</p>
                <p>🔧 <strong>Action Required:</strong> Run SQL commands in Supabase dashboard</p>
                <p>📋 <strong>Expected Tables:</strong> campaigns, performance_snapshots, leads</p>
                <div className="mt-3 space-x-3">
                  <a 
                    href="https://supabase.com/dashboard/project/aggorhmzuhdirterhyej/sql" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium"
                  >
                    Open Supabase SQL Editor →
                  </a>
                </div>
                <div className="mt-2 p-3 bg-white dark:bg-gray-800 rounded border">
                  <p className="font-medium text-gray-900 dark:text-white mb-2">Quick Setup Instructions:</p>
                  <ol className="text-xs text-gray-700 dark:text-gray-300 space-y-1">
                    <li>1. Click "Open Supabase SQL Editor" above</li>
                    <li>2. Copy the SQL from DATABASE_SETUP_INSTRUCTIONS.md in your project</li>
                    <li>3. Paste and run the SQL in Supabase</li>
                    <li>4. Refresh this page to test again</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6">
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
          >
            Retest Connection
          </button>
        </div>
      </div>
    </div>
  );
}