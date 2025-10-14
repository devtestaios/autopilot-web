'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/EnhancedAuthContext';

export default function LoginTestPage() {
  const { login, user, isLoading } = useAuth();
  const [result, setResult] = useState<string>('');
  const [isTestLoading, setIsTestLoading] = useState(false);

  const testLogin = async () => {
    setIsTestLoading(true);
    setResult('Testing login...');

    try {
      console.log('🧪 Starting login test...');
      const loginResult = await login('demo@pulsebridge.ai', 'TestPassword123!');
      
      console.log('🧪 Login result:', loginResult);
      
      if (loginResult.success) {
        setResult('✅ Login successful! Redirecting to dashboard...');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        setResult(`❌ Login failed: ${loginResult.error}`);
      }
    } catch (error) {
      console.error('🧪 Login test error:', error);
      setResult(`❌ Login error: ${error}`);
    } finally {
      setIsTestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Login Test Page
        </h1>
        
        {user ? (
          <div className="text-center">
            <p className="text-green-600 dark:text-green-400 mb-4">
              ✅ Already logged in as: {user.email}
            </p>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p><strong>Test Credentials:</strong></p>
              <p>Email: demo@pulsebridge.ai</p>
              <p>Password: TestPassword123!</p>
            </div>
            
            <button
              onClick={testLogin}
              disabled={isTestLoading || isLoading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium ${
                isTestLoading || isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isTestLoading ? 'Testing Login...' : 'Test Login'}
            </button>
            
            {result && (
              <div className={`p-4 rounded-lg text-sm ${
                result.includes('✅') 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                  : result.includes('❌')
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                  : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
              }`}>
                {result}
              </div>
            )}
          </div>
        )}
        
        <div className="mt-6 text-center">
          <a 
            href="/login" 
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm"
          >
            Go to Main Login Page
          </a>
        </div>
      </div>
    </div>
  );
}