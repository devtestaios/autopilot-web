'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target, ArrowRight } from 'lucide-react';

export default function AIOptimizationRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to AI page with optimization tab
    const timer = setTimeout(() => {
      router.replace('/ai?tab=optimization');
    }, 1500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 dark:from-gray-900 dark:to-purple-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-12 text-center max-w-md border border-gray-200 dark:border-gray-700"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6"
        >
          <Target className="w-10 h-10 text-white" />
        </motion.div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          Redirecting to AI Control Center
        </h1>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          AI Optimization is now integrated into the unified AI Control Center with enhanced features!
        </p>

        <div className="flex items-center justify-center space-x-2 text-purple-600 dark:text-purple-400">
          <span className="text-sm font-medium">Taking you there now</span>
          <ArrowRight className="w-4 h-4 animate-pulse" />
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            The AI Optimization page has moved to provide a better unified experience.
            You'll find all optimization features in the Optimization tab.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
