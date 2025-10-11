'use client'

import { useState } from 'react'
import { setupSupabaseAuth, testAuthConnection } from '@/lib/auth-setup'

export default function AuthSetupPage() {
  const [setupResult, setSetupResult] = useState<any>(null)
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runAuthSetup = async () => {
    setLoading(true)
    setSetupResult(null)
    setTestResult(null)
    
    try {
      console.log('🚀 Starting authentication setup...')
      
      // Run setup
      const setup = await setupSupabaseAuth()
      setSetupResult(setup)
      
      // Test connection after setup
      console.log('🔍 Testing auth connection after setup...')
      const test = await testAuthConnection()
      setTestResult(test)
      
    } catch (error) {
      setSetupResult({ success: false, errors: [(error as Error).message] })
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
          🔐 Authentication Setup
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Setup Supabase Authentication</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            This will create the required authentication tables and setup demo users.
          </p>
          
          <button
            onClick={runAuthSetup}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {loading ? 'Setting up authentication...' : 'Setup Authentication System'}
          </button>
        </div>

        {loading && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-blue-700 dark:text-blue-300">Setting up authentication system...</span>
            </div>
          </div>
        )}

        {setupResult && (
          <div className={`border rounded-lg p-6 mb-6 ${
            setupResult.success 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}>
            <h3 className={`text-lg font-semibold mb-3 ${
              setupResult.success 
                ? 'text-green-700 dark:text-green-300' 
                : 'text-red-700 dark:text-red-300'
            }`}>
              {setupResult.success ? '✅ Authentication Setup Completed!' : '❌ Authentication Setup Issues'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className={`p-3 rounded border ${
                setupResult.profiles_table 
                  ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700' 
                  : 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700'
              }`}>
                <div className="flex items-center">
                  <span className="mr-2">{setupResult.profiles_table ? '✅' : '❌'}</span>
                  <span className="font-medium">Profiles Table</span>
                </div>
              </div>
              
              <div className={`p-3 rounded border ${
                setupResult.auth_policies 
                  ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700' 
                  : 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700'
              }`}>
                <div className="flex items-center">
                  <span className="mr-2">{setupResult.auth_policies ? '✅' : '❌'}</span>
                  <span className="font-medium">Security Policies</span>
                </div>
              </div>
              
              <div className={`p-3 rounded border ${
                setupResult.demo_user 
                  ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700' 
                  : 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700'
              }`}>
                <div className="flex items-center">
                  <span className="mr-2">{setupResult.demo_user ? '✅' : '⚠️'}</span>
                  <span className="font-medium">Demo User</span>
                </div>
              </div>
            </div>
            
            {setupResult.errors?.length > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <h4 className="font-medium text-yellow-800 mb-2">Setup Details:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {setupResult.errors.map((error: string, i: number) => (
                    <li key={i}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {testResult && (
          <div className={`border rounded-lg p-6 mb-6 ${
            testResult.success 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}>
            <h3 className={`text-lg font-semibold mb-3 ${
              testResult.success 
                ? 'text-green-700 dark:text-green-300' 
                : 'text-red-700 dark:text-red-300'
            }`}>
              {testResult.success ? '✅ Authentication Connection Test Passed!' : '❌ Authentication Connection Test Failed'}
            </h3>
            
            {testResult.success && (
              <div className="text-green-700 dark:text-green-300 text-sm space-y-1">
                <p>📊 Total users: {testResult.userCount}</p>
                <p>🎭 Demo user exists: {testResult.hasDemo ? 'Yes' : 'No'}</p>
              </div>
            )}
            
            {testResult.error && (
              <div className="text-red-700 dark:text-red-300 text-sm">
                <strong>Error:</strong> {testResult.error}
              </div>
            )}
          </div>
        )}

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">What This Does:</h3>
          <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
            <li>• Creates `profiles` table to extend Supabase auth.users</li>
            <li>• Sets up Row Level Security (RLS) policies</li>
            <li>• Creates demo user: demo@pulsebridge.ai / demo123</li>
            <li>• Enables proper user registration and authentication</li>
            <li>• Tests the auth connection to verify everything works</li>
          </ul>
        </div>

        <div className="mt-6 flex space-x-4">
          <a 
            href="/auth-test" 
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 font-medium"
          >
            ← Back to Auth Test
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