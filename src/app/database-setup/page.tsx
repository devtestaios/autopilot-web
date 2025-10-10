'use client'

import { useState } from 'react'
import { setupDatabase, setupDatabaseDirect } from '@/lib/database-setup'
import { testDatabaseConnection } from '@/lib/database-test'

export default function DatabaseSetupPage() {
  const [setupResult, setSetupResult] = useState<any>(null)
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runSetup = async () => {
    setLoading(true)
    setSetupResult(null)
    setTestResult(null)
    
    try {
      console.log('🚀 Starting database setup...')
      
      // Try setup
      const setup = await setupDatabaseDirect()
      setSetupResult(setup)
      
      // Test connection after setup
      console.log('🔍 Testing connection after setup...')
      const test = await testDatabaseConnection()
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
          🔧 Database Schema Setup
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Setup Database Tables</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            This will create the required database tables: campaigns, performance_snapshots, and leads.
          </p>
          
          <button
            onClick={runSetup}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {loading ? 'Setting up database...' : 'Create Database Schema'}
          </button>
        </div>

        {loading && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-blue-700 dark:text-blue-300">Setting up database schema...</span>
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
              {setupResult.success ? '✅ Database Setup Completed!' : '❌ Database Setup Failed'}
            </h3>
            
            {setupResult.operations_completed?.length > 0 && (
              <div className="mb-3">
                <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">Completed Operations:</h4>
                <ul className="list-disc list-inside text-sm text-green-600 dark:text-green-400">
                  {setupResult.operations_completed.map((op: string, i: number) => (
                    <li key={i}>{op}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {setupResult.tables_created?.length > 0 && (
              <div className="mb-3">
                <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">Tables Created:</h4>
                <ul className="list-disc list-inside text-sm text-green-600 dark:text-green-400">
                  {setupResult.tables_created.map((table: string, i: number) => (
                    <li key={i}>{table}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {setupResult.errors?.length > 0 && (
              <div>
                <h4 className="font-medium text-red-700 dark:text-red-300 mb-2">Errors:</h4>
                <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-400">
                  {setupResult.errors.map((error: string, i: number) => (
                    <li key={i}>{error}</li>
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
              {testResult.success ? '✅ Connection Test Passed!' : '❌ Connection Test Failed'}
            </h3>
            
            {testResult.data?.tables && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(testResult.data.tables).map(([table, exists]) => (
                  <div key={table} className={`p-3 rounded border ${
                    exists 
                      ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700' 
                      : 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700'
                  }`}>
                    <div className="flex items-center">
                      <span className="mr-2">{exists ? '✅' : '❌'}</span>
                      <span className="font-medium">{table}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Important Notes:</h3>
          <ul className="text-yellow-700 dark:text-yellow-300 text-sm space-y-1">
            <li>• This will create tables with proper security (RLS) policies</li>
            <li>• Tables will be linked to user authentication</li>
            <li>• Includes performance indexes for better query speed</li>
            <li>• Safe to run multiple times (uses IF NOT EXISTS)</li>
          </ul>
        </div>

        <div className="mt-6 flex space-x-4">
          <a 
            href="/database-test" 
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 font-medium"
          >
            ← Back to Connection Test
          </a>
          <a 
            href="/campaigns" 
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium"
          >
            Test Campaigns Page →
          </a>
        </div>
      </div>
    </div>
  )
}