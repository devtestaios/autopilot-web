'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/EnhancedAuthContext';
import { supabase } from '@/lib/supabase';
import { testAuthConnection, testDemoLogin } from '@/lib/auth-test-utils';

export default function AuthTestPage() {
  const { user, login, logout, isLoading } = useAuth();
  const [testResults, setTestResults] = useState<any>(null);
  const [authTest, setAuthTest] = useState<any>(null);
  const [demoLoginTest, setDemoLoginTest] = useState<any>(null);
  const [loginForm, setLoginForm] = useState({ email: 'test@example.com', password: 'password123' });

  useEffect(() => {
    runAuthTests();
  }, []);

  const runAuthTests = async () => {
    console.log('🔍 Running authentication tests...');
    
    // Test 1: Basic auth connection
    const authResult = await testAuthConnection();
    setAuthTest(authResult);
    
    // Test 2: Demo login
    const demoResult = await testDemoLogin();
    setDemoLoginTest(demoResult);
    
    setTestResults({
      timestamp: new Date().toISOString(),
      authConnection: authResult,
      demoLogin: demoResult
    });
  };

  const handleTestLogin = async () => {
    try {
      const result = await login(loginForm.email, loginForm.password);
      console.log('Login result:', result);
      await runAuthTests();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      await runAuthTests();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">🔐 Authentication System Test</h1>
          
          {/* Current User Status */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-800 mb-3">Current Authentication Status</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
              <p><strong>User Authenticated:</strong> {user ? 'Yes' : 'No'}</p>
              {user && (
                <>
                  <p><strong>User Email:</strong> {user.email}</p>
                  <p><strong>User Role:</strong> {user.role}</p>
                  <p><strong>Display Name:</strong> {user.displayName}</p>
                  <p><strong>Account Status:</strong> {user.accountStatus}</p>
                </>
              )}
            </div>
          </div>

          {/* Authentication Tests */}
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <h2 className="text-lg font-semibold text-green-800 mb-3">Authentication Tests</h2>
            
            {authTest && (
              <div className="mb-4 p-3 bg-white rounded border">
                <h3 className="font-medium text-gray-800 mb-2">Auth Connection Test</h3>
                <div className="text-sm space-y-1">
                  <p>✅ <strong>Success:</strong> {authTest.success ? 'Yes' : 'No'}</p>
                  <p>🔧 <strong>Configured:</strong> {authTest.isConfigured ? 'Yes' : 'No'}</p>
                  <p>🔐 <strong>Has Session:</strong> {authTest.hasSession ? 'Yes' : 'No'}</p>
                  <p>👤 <strong>Profiles Table:</strong> {authTest.profilesTableExists ? 'Exists' : 'Missing'}</p>
                  {authTest.error && <p className="text-red-600">❌ <strong>Error:</strong> {authTest.error}</p>}
                </div>
              </div>
            )}

            {demoLoginTest && (
              <div className="mb-4 p-3 bg-white rounded border">
                <h3 className="font-medium text-gray-800 mb-2">Demo Login Test</h3>
                <div className="text-sm space-y-1">
                  <p>✅ <strong>Success:</strong> {demoLoginTest.success ? 'Yes' : 'No'}</p>
                  {demoLoginTest.user && <p>👤 <strong>User ID:</strong> {demoLoginTest.user.id}</p>}
                  {demoLoginTest.error && <p className="text-red-600">❌ <strong>Error:</strong> {demoLoginTest.error}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Login Test Form */}
          <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
            <h2 className="text-lg font-semibold text-yellow-800 mb-3">Test Login Form</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleTestLogin}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  Test Login
                </button>
                {user && (
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
                  >
                    Logout
                  </button>
                )}
                <button
                  onClick={runAuthTests}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                >
                  Refresh Tests
                </button>
              </div>
            </div>
          </div>

          {/* Test Results */}
          {testResults && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Full Test Results</h2>
              <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-96">
                {JSON.stringify(testResults, null, 2)}
              </pre>
            </div>
          )}

          {/* Next Steps */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Next Steps:</h3>
            <div className="text-blue-700 text-sm space-y-2">
              <p>🔄 <strong>Step 2B:</strong> Test authentication system functionality</p>
              <p>🔄 <strong>Next:</strong> Step 2C - Connect campaign management to backend</p>
              <div className="mt-3 space-y-2">
                <div>
                  <a 
                    href="/auth-setup" 
                    className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 font-medium mr-2"
                  >
                    Setup Authentication →
                  </a>
                  <a 
                    href="/login" 
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium mr-2"
                  >
                    Login Page →
                  </a>
                  <a 
                    href="/database-test" 
                    className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-medium"
                  >
                    ← Back to Database Test
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}