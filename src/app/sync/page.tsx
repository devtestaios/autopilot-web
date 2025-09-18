'use client';

import { useState } from 'react';
import AutomatedSyncScheduler from '@/components/AutomatedSyncScheduler';
import SyncStatusDashboard from '@/components/SyncStatusDashboard';
import { RefreshCw, Calendar, Activity, Settings, Bell } from 'lucide-react';

export default function SyncManagementPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scheduler' | 'settings'>('dashboard');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Campaign Sync Completed',
      message: 'Successfully synced 12 campaigns from Google Ads',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Performance Sync Delayed',
      message: 'API rate limit reached, retrying in 30 minutes',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      read: false
    },
    {
      id: 3,
      type: 'error',
      title: 'Meta Ads Connection Failed',
      message: 'Unable to connect to Meta Ads API - check credentials',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: true
    }
  ]);

  const handleSyncTrigger = (type: string) => {
    // Add a new notification when sync is triggered
    const newNotification = {
      id: Date.now(),
      type: 'info' as const,
      title: `${type} Sync Started`,
      message: `Manual sync initiated for ${type} data`,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
  };

  const markNotificationAsRead = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'info':
        return 'ℹ️';
      default:
        return '📌';
    }
  };

  const formatNotificationTime = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 60) return `${minutes}m ago`;
    return `${hours}h ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sync Management</h1>
              <p className="text-gray-600 mt-2">
                Monitor and manage automated data synchronization across all platforms
              </p>
            </div>
            
            {/* Notifications Panel */}
            <div className="relative">
              <button
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => {
                  // Toggle notifications (in a real app, this would open a dropdown)
                  console.log('Toggle notifications');
                }}
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'dashboard'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Activity className="w-4 h-4 inline mr-2" />
                Status Dashboard
              </button>
              <button
                onClick={() => setActiveTab('scheduler')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'scheduler'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                Sync Scheduler
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'settings'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Settings className="w-4 h-4 inline mr-2" />
                Settings
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'dashboard' && (
            <SyncStatusDashboard />
          )}

          {activeTab === 'scheduler' && (
            <AutomatedSyncScheduler onSyncTrigger={handleSyncTrigger} />
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-6">Global Sync Settings</h3>
              
              <div className="space-y-6">
                {/* API Configuration */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">API Configuration</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Google Ads API Rate Limit (requests/minute)
                      </label>
                      <input
                        type="number"
                        className="border border-gray-300 rounded-md px-3 py-2 w-full"
                        defaultValue="100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sync Timeout (seconds)
                      </label>
                      <input
                        type="number"
                        className="border border-gray-300 rounded-md px-3 py-2 w-full"
                        defaultValue="300"
                      />
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Notification Preferences</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h5 className="font-medium text-gray-900">Email Notifications</h5>
                        <p className="text-sm text-gray-600">Receive email alerts for sync failures</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h5 className="font-medium text-gray-900">Slack Integration</h5>
                        <p className="text-sm text-gray-600">Send sync status updates to Slack</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h5 className="font-medium text-gray-900">SMS Alerts</h5>
                        <p className="text-sm text-gray-600">Critical error notifications via SMS</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Data Retention */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Data Retention</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sync Log Retention Period
                      </label>
                      <select className="border border-gray-300 rounded-md px-3 py-2 w-full">
                        <option value="30">30 days</option>
                        <option value="90" selected>90 days</option>
                        <option value="365">1 year</option>
                        <option value="forever">Forever</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Performance Data History
                      </label>
                      <select className="border border-gray-300 rounded-md px-3 py-2 w-full">
                        <option value="90">90 days</option>
                        <option value="365" selected>1 year</option>
                        <option value="730">2 years</option>
                        <option value="forever">Forever</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t border-gray-200">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Save Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Sidebar (Hidden for now, would be toggled) */}
        <div className="hidden fixed right-0 top-0 h-full w-80 bg-white shadow-xl border-l border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>
          
          <div className="overflow-y-auto h-full pb-20">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                  !notification.read ? 'bg-blue-50' : ''
                }`}
                onClick={() => markNotificationAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg">
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {formatNotificationTime(notification.timestamp)}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}