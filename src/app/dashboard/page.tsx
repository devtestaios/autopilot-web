'use client';

import React from 'react';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Master Terminal
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <p className="text-gray-600 dark:text-gray-400">
            Dashboard is ready for production deployment.
          </p>
        </div>
      </div>
    </div>
  );
}
