'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUnifiedAI } from '@/contexts/UnifiedAIContext';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import {
  Bot,
  Zap,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  MessageSquare,
  Settings,
  PlayCircle,
  StopCircle,
  RefreshCw
} from 'lucide-react';

interface AITestResult {
  test: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  timestamp: Date;
  duration?: number;
}

export default function AISystemTester() {
  const {
    aiEnabled,
    aiStatus,
    sendMessage,
    executeAIAction,
    capabilities,
    insights,
    lastAIActivity,
    autonomousMode
  } = useUnifiedAI();

  const [testResults, setTestResults] = useState<AITestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');

  // Add test result
  const addTestResult = (test: string, status: 'success' | 'error', message: string, startTime?: Date) => {
    const result: AITestResult = {
      test,
      status,
      message,
      timestamp: new Date(),
      duration: startTime ? Date.now() - startTime.getTime() : undefined
    };
    setTestResults(prev => [...prev, result]);
  };

  // Test AI Chat System
  const testAIChat = async () => {
    setCurrentTest('AI Chat System');
    const startTime = new Date();
    
    try {
      await sendMessage('Test AI connectivity from frontend', { page: 'ai-tester' });
      addTestResult('AI Chat System', 'success', 'AI chat responded successfully', startTime);
    } catch (error) {
      addTestResult('AI Chat System', 'error', `Chat failed: ${error}`, startTime);
    }
  };

  // Test AI Actions
  const testAIActions = async () => {
    setCurrentTest('AI Actions System');
    const startTime = new Date();
    
    try {
      await executeAIAction({
        type: 'ui_control',
        function: 'test_action',
        arguments: { test: true }
      });
      addTestResult('AI Actions System', 'success', 'AI action executed successfully', startTime);
    } catch (error) {
      addTestResult('AI Actions System', 'error', `Action failed: ${error}`, startTime);
    }
  };

  // Test Backend Connectivity
  const testBackendConnectivity = async () => {
    setCurrentTest('Backend Connectivity');
    const startTime = new Date();
    
    try {
      const response = await fetch('https://autopilot-api-1.onrender.com/health');
      const data = await response.json();
      
      if (data.status === 'healthy') {
        addTestResult('Backend Connectivity', 'success', `Backend healthy: ${data.ai_services.preferred_provider} configured`, startTime);
      } else {
        addTestResult('Backend Connectivity', 'error', 'Backend unhealthy', startTime);
      }
    } catch (error) {
      addTestResult('Backend Connectivity', 'error', `Backend unreachable: ${error}`, startTime);
    }
  };

  // Test AI Capabilities
  const testAICapabilities = async () => {
    setCurrentTest('AI Capabilities');
    const startTime = new Date();
    
    try {
      const enabledCaps = capabilities.filter(cap => cap.enabled).length;
      const totalCaps = capabilities.length;
      
      if (enabledCaps > 0) {
        addTestResult('AI Capabilities', 'success', `${enabledCaps}/${totalCaps} capabilities enabled`, startTime);
      } else {
        addTestResult('AI Capabilities', 'error', 'No capabilities enabled', startTime);
      }
    } catch (error) {
      addTestResult('AI Capabilities', 'error', `Capabilities test failed: ${error}`, startTime);
    }
  };

  // Test AI Insights
  const testAIInsights = async () => {
    setCurrentTest('AI Insights System');
    const startTime = new Date();
    
    try {
      const insightCount = insights.length;
      addTestResult('AI Insights System', 'success', `${insightCount} insights available`, startTime);
    } catch (error) {
      addTestResult('AI Insights System', 'error', `Insights test failed: ${error}`, startTime);
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    
    const tests = [
      testBackendConnectivity,
      testAIChat,
      testAIActions,
      testAICapabilities,
      testAIInsights
    ];

    for (const test of tests) {
      await test();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Delay between tests
    }
    
    setIsRunningTests(false);
    setCurrentTest('');
  };

  // Status icon
  const getStatusIcon = (status: AITestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <Bot className="w-8 h-8 text-teal-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              AI System Testing Dashboard
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive testing of AI capabilities, backend connectivity, and autonomous features
          </p>
        </motion.div>

        {/* Current AI Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <PremiumCard className="p-6">
            <div className="flex items-center gap-3">
              <Zap className={`w-6 h-6 ${aiEnabled ? 'text-green-500' : 'text-red-500'}`} />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">AI Status</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {aiEnabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
          </PremiumCard>

          <PremiumCard className="p-6">
            <div className="flex items-center gap-3">
              <Activity className={`w-6 h-6 ${aiStatus === 'active' ? 'text-green-500' : 'text-yellow-500'}`} />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current State</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                  {aiStatus}
                </p>
              </div>
            </div>
          </PremiumCard>

          <PremiumCard className="p-6">
            <div className="flex items-center gap-3">
              <Settings className={`w-6 h-6 ${autonomousMode ? 'text-teal-500' : 'text-gray-500'}`} />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Autonomous Mode</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {autonomousMode ? 'Active' : 'Manual'}
                </p>
              </div>
            </div>
          </PremiumCard>

          <PremiumCard className="p-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Activity</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {lastAIActivity ? lastAIActivity.toLocaleTimeString() : 'None'}
                </p>
              </div>
            </div>
          </PremiumCard>
        </motion.div>

        {/* Test Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <PremiumCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                AI System Tests
              </h2>
              <div className="flex gap-3">
                <PremiumButton
                  onClick={runAllTests}
                  disabled={isRunningTests}
                  icon={isRunningTests ? <RefreshCw className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
                  variant="primary"
                >
                  {isRunningTests ? 'Running Tests...' : 'Run All Tests'}
                </PremiumButton>
                
                <PremiumButton
                  onClick={() => setTestResults([])}
                  disabled={isRunningTests}
                  icon={<StopCircle className="w-4 h-4" />}
                  variant="secondary"
                >
                  Clear Results
                </PremiumButton>
              </div>
            </div>
            
            {currentTest && (
              <div className="text-center py-4">
                <p className="text-teal-600 dark:text-teal-400 font-medium">
                  Currently testing: {currentTest}
                </p>
              </div>
            )}
          </PremiumCard>
        </motion.div>

        {/* Test Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <PremiumCard className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Test Results ({testResults.length})
            </h3>
            
            {testResults.length === 0 ? (
              <div className="text-center py-12">
                <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  No tests run yet. Click "Run All Tests" to start testing.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-800"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {result.test}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {result.message}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right text-sm text-gray-500">
                      <p>{result.timestamp.toLocaleTimeString()}</p>
                      {result.duration && (
                        <p>{result.duration}ms</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </PremiumCard>
        </motion.div>
      </div>
    </div>
  );
}