/**
 * AI Optimization Dashboard Page
 * 
 * Demonstrates the AI-powered campaign optimization engine
 * with real-time insights and recommendations.
 */

import { OptimizationDashboard } from '@/components/OptimizationDashboard';

export default function OptimizationPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Campaign Optimization</h1>
          <p className="text-gray-600 mt-2">
            Intelligent insights and recommendations powered by machine learning to maximize your campaign performance.
          </p>
        </div>
        
        <OptimizationDashboard />
      </div>
    </div>
  );
}