'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/EnhancedAuthContext'
import { supabase } from '@/lib/supabase'

export default function AuthTestPage() {
  const [testResults, setTestResults] = useState<any>({
    contextLoaded: false,
    supabaseConfig: false,
    authMethods: false,
    loginTest: null,
    error: null
  })
  const [loading, setLoading] = useState(false)

  // Try to use auth context
  let authContext: any = null
  let authError: string | null = null

  try {
    authContext = useAuth()
  } catch (error) {
    authError = (error as Error).message
  }

  const runAuthTests = async () => {
    setLoading(true)
    const results: any = {
      contextLoaded: false,
      supabaseConfig: false,
      authMethods: false,
      loginTest: null,
      userState: null,
      error: null
    }

    try {
      // Test 1: Check if auth context loaded
      results.contextLoaded = !!authContext && !authError
      results.authError = authError

      // Test 2: Check Supabase configuration
      results.supabaseConfig = !!(
        process.env.NEXT_PUBLIC_SUPABASE_URL && 
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )

      // Test 3: Check auth methods available
      if (authContext) {
        results.authMethods = !!(
          authContext.login && 
          authContext.signup && 
          authContext.logout &&
          typeof authContext.isAuthenticated === 'boolean'
        )
        results.userState = {
          isAuthenticated: authContext.isAuthenticated,
          user: authContext.user ? 'User object exists' : 'No user',
          isLoading: authContext.isLoading
        }
      }

      // Test 4: Test Supabase connection directly
      if (results.supabaseConfig) {
        try {
          const { data, error } = await supabase.auth.getSession()
          results.supabaseConnection = {
            success: !error,
            hasSession: !!data.session,
            error: error?.message || null
          }
        } catch (err) {
          results.supabaseConnection = {
            success: false,
            error: (err as Error).message
          }
        }
      }

      // Test 5: Try demo login (if possible)
      if (authContext && authContext.login) {
        try {
          results.loginTest = 'Available - could test with demo credentials'
        } catch (err) {
          results.loginTest = `Login method failed: ${(err as Error).message}`
        }
      }

    } catch (error) {
      results.error = (error as Error).message
    }

    setTestResults(results)
    setLoading(false)
  }

  useEffect(() => {
    runAuthTests()
  }, [])

  const testDemoLogin = async () => {
    if (!authContext?.login) return

    try {
      setLoading(true)
      const result = await authContext.login('demo@pulsebridge.ai', 'demo123')
      setTestResults(prev => ({
        ...prev,
        demoLoginResult: {
          success: result.success,
          error: result.error,
          requiresMfa: result.requiresMfa
        }
      }))
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        demoLoginResult: {
          success: false,
          error: (error as Error).message
        }
      }))
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          🔐 PulseBridge Authentication System Test
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Authentication Status</h2>
            <button
              onClick={runAuthTests}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Re-run Tests'}
            </button>
          </div>

          <div className="space-y-4">
            {/* Test Results */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg border ${testResults.contextLoaded ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center">
                  <span className="text-lg mr-2">{testResults.contextLoaded ? '✅' : '❌'}</span>
                  <span className="font-medium">Auth Context</span>
                </div>
                <div className="text-sm mt-1">
                  {testResults.contextLoaded ? 'Successfully loaded' : `Failed: ${testResults.authError || 'Unknown error'}`}
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${testResults.supabaseConfig ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center">
                  <span className="text-lg mr-2">{testResults.supabaseConfig ? '✅' : '❌'}</span>
                  <span className="font-medium">Supabase Config</span>
                </div>
                <div className="text-sm mt-1">
                  {testResults.supabaseConfig ? 'Environment variables set' : 'Missing SUPABASE_URL or ANON_KEY'}
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${testResults.authMethods ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center">
                  <span className="text-lg mr-2">{testResults.authMethods ? '✅' : '❌'}</span>
                  <span className="font-medium">Auth Methods</span>
                </div>
                <div className="text-sm mt-1">
                  {testResults.authMethods ? 'login, signup, logout available' : 'Auth methods not available'}
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${testResults.supabaseConnection?.success ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                <div className="flex items-center">
                  <span className="text-lg mr-2">{testResults.supabaseConnection?.success ? '✅' : '⚠️'}</span>
                  <span className="font-medium">Supabase Connection</span>
                </div>
                <div className="text-sm mt-1">
                  {testResults.supabaseConnection?.success ? 
                    `Connected ${testResults.supabaseConnection.hasSession ? '(has session)' : '(no session)'}` : 
                    testResults.supabaseConnection?.error || 'Not tested'
                  }
                </div>
              </div>
            </div>

            {/* User State */}
            {testResults.userState && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Current User State</h3>
                <div className="text-sm space-y-1">
                  <div>Authenticated: {testResults.userState.isAuthenticated ? '✅ Yes' : '❌ No'}</div>
                  <div>User Data: {testResults.userState.user}</div>
                  <div>Loading: {testResults.userState.isLoading ? 'Yes' : 'No'}</div>
                </div>
              </div>
            )}

            {/* Demo Login Test */}
            {authContext?.login && (
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">Demo Login Test</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={testDemoLogin}
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? 'Testing Login...' : 'Test Demo Login'}
                  </button>
                  <div className="flex items-center text-sm text-gray-600">
                    Will attempt login with demo@pulsebridge.ai
                  </div>
                </div>

                {testResults.demoLoginResult && (
                  <div className={`mt-3 p-3 rounded ${testResults.demoLoginResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    <div className="font-medium">
                      {testResults.demoLoginResult.success ? '✅ Login Successful!' : '❌ Login Failed'}
                    </div>
                    {testResults.demoLoginResult.error && (
                      <div className="text-sm mt-1">Error: {testResults.demoLoginResult.error}</div>
                    )}
                    {testResults.demoLoginResult.requiresMfa && (
                      <div className="text-sm mt-1">⚠️ MFA Required</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Next Steps:</h3>
          <div className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
            {testResults.contextLoaded && testResults.supabaseConfig ? (
              <div>
                <p>✅ <strong>Step 2B Progress:</strong> Authentication system loaded successfully!</p>
                <p>🔄 <strong>Action:</strong> Test login functionality and user registration</p>
                <p>🔄 <strong>Then:</strong> Step 2C - Connect campaign management to backend</p>
              </div>
            ) : (
              <div>
                <p>⚠️ <strong>Authentication Issues Detected:</strong></p>
                {!testResults.contextLoaded && <p>• Auth context not loading properly</p>}
                {!testResults.supabaseConfig && <p>• Supabase configuration missing</p>}
                <p>🔧 <strong>Need to fix:</strong> Authentication setup before proceeding</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex space-x-4">
          <a 
            href="/database-test" 
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 font-medium"
          >
            ← Back to Database Test
          </a>
          <a 
            href="/login" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            Test Login Page →
          </a>
          <a 
            href="/signup" 
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium"
          >
            Test Signup Page →
          </a>
        </div>
      </div>
    </div>
  )
}