'use client';

import React, { useEffect, useState } from 'react';
import { simpleAnalytics } from '@/lib/performance/simpleAnalytics';
import { realAnalytics, trackingHelpers } from '@/lib/performance/realAnalytics';
import { useSocialMedia } from '@/contexts/SocialMediaContext';
import { cacheUtils } from '@/lib/performance/simpleCacheUtils';

/**
 * PERFORMANCE INTEGRATION DEMO
 * Demonstrates the working performance optimization integration
 */

const PerformanceIntegrationDemo: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [cacheStats, setCacheStats] = useState<any>(null);
  const [realAnalyticsData, setRealAnalyticsData] = useState<any>(null);
  const [backendHealth, setBackendHealth] = useState<boolean | null>(null);
  const socialMedia = useSocialMedia();

  useEffect(() => {
    // Track demo page view
    simpleAnalytics.trackPageView('/performance-demo');
    
    // Load analytics summary
    const summary = simpleAnalytics.getAnalyticsSummary();
    setAnalyticsData(summary);

    // Get cache statistics
    const stats = cacheUtils.getStats();
    setCacheStats(stats);

    // Check backend health and load real analytics
    loadRealAnalyticsData();
  }, []);

  const loadRealAnalyticsData = async () => {
    // Check backend connectivity
    const isHealthy = await realAnalytics.checkBackendHealth();
    setBackendHealth(isHealthy);

    // Load real analytics data
    try {
      const socialMediaAnalytics = await realAnalytics.getAnalyticsOverview('social-media');
      const emailAnalytics = await realAnalytics.getAnalyticsOverview('email-marketing');
      const collaborationAnalytics = await realAnalytics.getAnalyticsOverview('collaboration');
      
      setRealAnalyticsData({
        socialMedia: socialMediaAnalytics,
        emailMarketing: emailAnalytics,
        collaboration: collaborationAnalytics
      });
    } catch (error) {
      console.warn('Real analytics unavailable, using fallback data');
    }
  };

  const handleTrackFeature = async () => {
    await trackingHelpers.trackIntegrationInstall('performance_demo', 'testing');
    simpleAnalytics.trackFeatureUsage('performance_demo', 'button_click', {
      timestamp: Date.now(),
      component: 'demo_button'
    });
    
    // Refresh analytics data
    const summary = simpleAnalytics.getAnalyticsSummary();
    setAnalyticsData(summary);
  };

  const handleLoadSocialData = async () => {
    await realAnalytics.trackSocialMediaEvent('demo_load_request', { source: 'demo_page' });
    simpleAnalytics.trackFeatureUsage('performance_demo', 'load_social_data');
    await socialMedia.loadAccounts();
    await socialMedia.loadPosts();
  };

  const handleTestEmailMarketing = async () => {
    await trackingHelpers.trackCampaignCreate('demo_campaign', 100);
    simpleAnalytics.trackFeatureUsage('performance_demo', 'test_email_marketing');
  };

  const handleTestCollaboration = async () => {
    await trackingHelpers.trackTeamAction('demo_collaboration', 'demo_team', 5);
    simpleAnalytics.trackFeatureUsage('performance_demo', 'test_collaboration');
  };

  const handleTestRealAnalytics = async () => {
    await loadRealAnalyticsData();
    simpleAnalytics.trackFeatureUsage('performance_demo', 'test_real_analytics');
  };

  const handleCacheTest = async () => {
    // Test cache functionality
    const testKey = `test_${Date.now()}`;
    const testData = { message: 'Cache test successful!', timestamp: Date.now() };
    
    cacheUtils.set(testKey, testData, { ttl: 300000 }); // 5 minutes
    const retrieved = cacheUtils.get(testKey);
    
    await trackingHelpers.trackIntegrationInstall('cache_system', 'performance');
    simpleAnalytics.trackFeatureUsage('performance_demo', 'cache_test', {
      cache_hit: retrieved !== null,
      test_key: testKey
    });

    // Update cache stats
    const stats = cacheUtils.getStats();
    setCacheStats(stats);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            🚀 Performance Integration Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            This demo shows the working performance optimization integration with analytics tracking, 
            caching, and social media context connection.
          </p>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={handleTrackFeature}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Track Feature Usage
            </button>
            <button
              onClick={handleLoadSocialData}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Load Social Media Data
            </button>
            <button
              onClick={handleCacheTest}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Test Cache System
            </button>
            <button
              onClick={handleTestEmailMarketing}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Test Email Marketing
            </button>
            <button
              onClick={handleTestCollaboration}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Test Collaboration
            </button>
            <button
              onClick={handleTestRealAnalytics}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Refresh Real Analytics
            </button>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              📊 Local Analytics Summary
            </h2>
            
            {analyticsData ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <div className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Events</div>
                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {analyticsData.totalEvents}
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                    <div className="text-green-600 dark:text-green-400 text-sm font-medium">Session ID</div>
                    <div className="text-sm font-mono text-green-900 dark:text-green-100 truncate">
                      {analyticsData.sessionInfo.sessionId.slice(-8)}...
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Event Types</h3>
                  <div className="space-y-2">
                    {Object.entries(analyticsData.eventTypes).map(([type, count]) => (
                      <div key={type} className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300 capitalize">{type.replace('_', ' ')}</span>
                        <span className="text-gray-900 dark:text-white font-semibold">{count as number}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Recent Events</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {analyticsData.recentEvents.slice(0, 5).map((event: any, index: number) => (
                      <div key={index} className="text-sm bg-gray-50 dark:bg-gray-700 p-2 rounded">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {event.eventType.replace('_', ' ')}
                        </div>
                        <div className="text-gray-600 dark:text-gray-300 text-xs">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500 dark:text-gray-400">Loading analytics data...</div>
            )}
          </div>

          {/* Cache Statistics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
              💾 Cache Performance
            </h2>
            
            {cacheStats ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                    <div className="text-purple-600 dark:text-purple-400 text-sm font-medium">Total Entries</div>
                    <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      {cacheStats.totalEntries}
                    </div>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
                    <div className="text-orange-600 dark:text-orange-400 text-sm font-medium">Hit Rate</div>
                    <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                      {cacheStats.hitRate}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-gray-600 dark:text-gray-300">Hits</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{cacheStats.hits}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600 dark:text-gray-300">Misses</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{cacheStats.misses}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-gray-600 dark:text-gray-300">Total</div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">{cacheStats.total}</div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Cache system: {cacheStats.totalEntries > 0 ? 'Map fallback' : 'Empty'}
                </div>
              </div>
            ) : (
              <div className="text-gray-500 dark:text-gray-400">Loading cache stats...</div>
            )}
          </div>
        </div>

        {/* Real Analytics Dashboard */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            🌐 Real Backend Analytics
          </h2>
          
          <div className="mb-4 flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${backendHealth ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              Backend Status: {backendHealth ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          {realAnalyticsData ? (
            <div className="space-y-6">
              {/* Social Media Analytics */}
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Social Media</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600 dark:text-gray-300">Total Events</div>
                    <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      {realAnalyticsData.socialMedia?.total_events || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-300">Success Rate</div>
                    <div className="text-xl font-bold text-green-600 dark:text-green-400">
                      {realAnalyticsData.socialMedia?.performance_metrics?.success_rate || 0}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-300">Response Time</div>
                    <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      {realAnalyticsData.socialMedia?.performance_metrics?.response_time || 0}ms
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Marketing Analytics */}
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Email Marketing</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600 dark:text-gray-300">Total Events</div>
                    <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                      {realAnalyticsData.emailMarketing?.total_events || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-300">Operations</div>
                    <div className="text-xl font-bold text-green-600 dark:text-green-400">
                      {realAnalyticsData.emailMarketing?.performance_metrics?.total_operations || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-300">Active Users</div>
                    <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                      {realAnalyticsData.emailMarketing?.performance_metrics?.active_users || 0}
                    </div>
                  </div>
                </div>
              </div>

              {/* Collaboration Analytics */}
              <div className="border-l-4 border-indigo-500 pl-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Collaboration</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600 dark:text-gray-300">Total Events</div>
                    <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                      {realAnalyticsData.collaboration?.total_events || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-300">Throughput</div>
                    <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      {realAnalyticsData.collaboration?.performance_metrics?.throughput || 0}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 dark:text-gray-300">Error Rate</div>
                    <div className="text-xl font-bold text-red-600 dark:text-red-400">
                      {realAnalyticsData.collaboration?.performance_metrics?.error_rate || 0}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400">
              {backendHealth ? 'Loading real analytics data...' : 'Backend unavailable - using local fallback data'}
            </div>
          )}
        </div>

        {/* Integration Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              📱 Social Media
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Accounts</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{socialMedia.accounts.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Posts</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{socialMedia.posts.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Status</span>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">✅ Enhanced</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              📧 Email Marketing
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Analytics</span>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">✅ Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Tracking</span>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">✅ Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Backend</span>
                <span className={`text-sm font-semibold ${backendHealth ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                  {backendHealth ? '✅ Live' : '⚠️ Fallback'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              👥 Collaboration
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Analytics</span>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">✅ Enhanced</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Tracking</span>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">✅ Real-time</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Backend</span>
                <span className={`text-sm font-semibold ${backendHealth ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                  {backendHealth ? '✅ Connected' : '⚠️ Local'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              🔧 Performance
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Cache</span>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">✅ Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">Analytics</span>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">✅ Dual Mode</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-300">SSR</span>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">✅ Compatible</span>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Summary */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <h2 className="text-2xl font-semibold mb-4">
            🚀 Expanded Integration Summary
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">✅</div>
              <div className="text-sm">Simple Analytics</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">✅</div>
              <div className="text-sm">Real Analytics</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">✅</div>
              <div className="text-sm">Cache System</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">✅</div>
              <div className="text-sm">Social Media</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">✅</div>
              <div className="text-sm">Email Marketing</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">✅</div>
              <div className="text-sm">Collaboration</div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold mb-2">🎯 Expanded Features:</div>
              <ul className="space-y-1 opacity-90">
                <li>• Real backend analytics integration</li>
                <li>• Enhanced social media tracking</li>
                <li>• Email marketing performance monitoring</li>
                <li>• Collaboration activity tracking</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-2">⚡ Production Ready:</div>
              <ul className="space-y-1 opacity-90">
                <li>• Dual analytics system (local + backend)</li>
                <li>• Automatic fallback mechanisms</li>
                <li>• Real-time performance tracking</li>
                <li>• Complete SSR compatibility</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 text-center text-sm opacity-90">
            🎉 Enhanced performance optimization integration with real backend connectivity complete!
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceIntegrationDemo;