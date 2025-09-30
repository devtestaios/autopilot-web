'use client';

import { useState } from 'react';
import { socialMediaService } from '@/services/socialMediaService';

export default function InstagramOAuthTest() {
  const [status, setStatus] = useState('');
  const [authUrl, setAuthUrl] = useState('');

  const testOAuth = async () => {
    try {
      setStatus('Generating OAuth URL...');
      const url = await socialMediaService.initiateOAuth('instagram');
      setAuthUrl(url);
      setStatus('OAuth URL generated successfully!');
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('OAuth test error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Instagram OAuth Test Page
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            OAuth Flow Test
          </h2>
          
          <button
            onClick={testOAuth}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            Test OAuth Flow
          </button>
          
          {status && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Status:</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{status}</p>
            </div>
          )}
          
          {authUrl && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Generated OAuth URL:</p>
              <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded mt-2">
                <p className="text-xs text-gray-600 dark:text-gray-300 break-all">{authUrl}</p>
              </div>
              
              <a
                href={authUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Open OAuth URL
              </a>
            </div>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Environment Variables Check
          </h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">Instagram App ID:</span> 
              <span className="ml-2 text-gray-600 dark:text-gray-300">
                {process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID || 'Not set'}
              </span>
            </p>
            <p>
              <span className="font-medium">Base URL:</span> 
              <span className="ml-2 text-gray-600 dark:text-gray-300">
                {process.env.NEXT_PUBLIC_BASE_URL || 'Not set'}
              </span>
            </p>
            <p>
              <span className="font-medium">API Base:</span> 
              <span className="ml-2 text-gray-600 dark:text-gray-300">
                {process.env.NEXT_PUBLIC_API_BASE || 'Not set'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}