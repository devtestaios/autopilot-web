'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain,
  Map,
  Link,
  Settings,
  BarChart3,
  Users,
  Target
} from 'lucide-react';
import NavigationTabs from '@/components/NavigationTabs';

// Import modular CRM components
import { 
  LeadScoringDashboard,
  CustomerJourneyMapper,
  CRMIntegrations
} from '@/modules/crm';

export default function UnifiedCRMPage() {
  const [activeTab, setActiveTab] = useState<'lead-scoring' | 'customer-journey' | 'integrations' | 'overview'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'lead-scoring', label: 'Lead Scoring', icon: Target },
    { id: 'customer-journey', label: 'Customer Journey', icon: Map },
    { id: 'integrations', label: 'CRM Integrations', icon: Link },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavigationTabs />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Unified CRM Platform Suite
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                AI-powered lead scoring, customer journey mapping, and CRM integrations
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mt-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Quick Stats */}
              <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Leads</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">2,847</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="mt-3 text-sm text-emerald-600 font-medium">+12.5% from last month</div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Avg Lead Score</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">73.2</p>
                    </div>
                    <Target className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="mt-3 text-sm text-emerald-600 font-medium">+5.8% improvement</div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Conversion Rate</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">18.4%</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="mt-3 text-sm text-emerald-600 font-medium">+2.1% this quarter</div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Active Integrations</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">5</p>
                    </div>
                    <Link className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="mt-3 text-sm text-green-600 font-medium">All systems operational</div>
                </div>
              </div>

              {/* Feature Cards */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <Brain className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Lead Scoring</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Advanced AI algorithms analyze lead behavior, demographics, and engagement to provide accurate scoring.
                </p>
                <button
                  onClick={() => setActiveTab('lead-scoring')}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  View Lead Scoring Dashboard →
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <Map className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Customer Journey Mapping</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Visualize customer paths, identify bottlenecks, and optimize conversion funnels.
                </p>
                <button
                  onClick={() => setActiveTab('customer-journey')}
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  View Journey Mapper →
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <Link className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">CRM Integrations</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Connect with Salesforce, HubSpot, Pipedrive, and other major CRM platforms.
                </p>
                <button
                  onClick={() => setActiveTab('integrations')}
                  className="text-green-600 hover:text-green-700 font-medium text-sm"
                >
                  Manage Integrations →
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'lead-scoring' && (
            <motion.div
              key="lead-scoring"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <LeadScoringDashboard />
            </motion.div>
          )}

          {activeTab === 'customer-journey' && (
            <motion.div
              key="customer-journey"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CustomerJourneyMapper />
            </motion.div>
          )}

          {activeTab === 'integrations' && (
            <motion.div
              key="integrations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <CRMIntegrations />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}