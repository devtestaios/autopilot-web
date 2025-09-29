'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function MasterTerminalRedirect() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/dashboard');
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-teal-200 dark:border-teal-700 rounded-full border-t-teal-600 dark:border-t-teal-400"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="w-8 h-8 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Master Terminal Consolidated
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Redirecting to the unified dashboard experience...
        </p>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-lg text-sm">
          <Zap className="w-4 h-4" />
          Enhanced with Platform Registry
        </div>
      </motion.div>
    </div>
  );
}
