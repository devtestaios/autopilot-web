'use client';

import { useState, useEffect } from 'react';
import { Clock, Play, Pause, RefreshCw, CheckCircle, AlertTriangle, Calendar, Settings, History, Bell } from 'lucide-react';
import { 
  fetchSyncSchedules, 
  updateSyncSchedule, 
  triggerSyncJob, 
  fetchSyncJobs,
  formatRelativeTime,
  formatNextTime,
  type SyncSchedule,
  type SyncJob
} from '@/lib/syncApi';

interface AutomatedSyncSchedulerProps {
  onSyncTrigger?: (type: string) => void;
}

export default function AutomatedSyncScheduler({ onSyncTrigger }: AutomatedSyncSchedulerProps) {
  const [schedules, setSchedules] = useState<SyncSchedule[]>([]);
  const [syncHistory, setSyncHistory] = useState<SyncJob[]>([]);
  const [isCreatingSchedule, setIsCreatingSchedule] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'schedules' | 'history' | 'settings'>('schedules');
  const [loading, setLoading] = useState(false);

  // Load schedules and history
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [schedulesData, jobsData] = await Promise.all([
        fetchSyncSchedules(),
        fetchSyncJobs(10)
      ]);
      setSchedules(schedulesData);
      setSyncHistory(jobsData);
    } catch (error) {
      console.error('Failed to load sync data:', error);
    }
  };

  const toggleSchedule = async (scheduleId: string) => {
    try {
      const schedule = schedules.find(s => s.id === scheduleId);
      if (!schedule) return;

      const updatedSchedule = await updateSyncSchedule(scheduleId, {
        enabled: !schedule.enabled
      });

      setSchedules(prev => prev.map(s => 
        s.id === scheduleId ? updatedSchedule : s
      ));
    } catch (error) {
      console.error('Failed to toggle schedule:', error);
    }
  };

  const runScheduleNow = async (schedule: SyncSchedule) => {
    setLoading(true);
    
    try {
      const job = await triggerSyncJob(schedule.id);
      
      // Add to history
      setSyncHistory(prev => [job, ...prev.slice(0, 9)]);

      // Refresh schedules to get updated last_run time
      await loadData();

      // Trigger parent sync if callback provided
      if (onSyncTrigger) {
        onSyncTrigger(schedule.type);
      }
    } catch (error) {
      console.error('Failed to run sync job:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getHistoryStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'partial':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <RefreshCw className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Clock className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold">Automated Sync Scheduler</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreatingSchedule(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            + New Schedule
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setSelectedTab('schedules')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'schedules'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          Schedules
        </button>
        <button
          onClick={() => setSelectedTab('history')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'history'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <History className="w-4 h-4 inline mr-2" />
          History
        </button>
        <button
          onClick={() => setSelectedTab('settings')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'settings'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Settings className="w-4 h-4 inline mr-2" />
          Settings
        </button>
      </div>

      {/* Schedules Tab */}
      {selectedTab === 'schedules' && (
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(schedule.status)}
                    <h4 className="font-semibold text-gray-900">{schedule.name}</h4>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full capitalize">
                      {schedule.type}
                    </span>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                      {schedule.frequency}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Next Run:</span> {formatNextTime(schedule.next_run)}
                    </div>
                    <div>
                      <span className="font-medium">Last Run:</span> {schedule.last_run ? formatRelativeTime(schedule.last_run) : 'Never'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => runScheduleNow(schedule)}
                    disabled={loading || !schedule.enabled}
                    className="text-blue-600 hover:text-blue-800 p-2 rounded-md hover:bg-blue-50 transition-colors disabled:opacity-50"
                    title="Run Now"
                  >
                    {loading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => toggleSchedule(schedule.id)}
                    className={`p-2 rounded-md transition-colors ${
                      schedule.enabled
                        ? 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50'
                        : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                    }`}
                    title={schedule.enabled ? 'Pause' : 'Resume'}
                  >
                    {schedule.enabled ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* History Tab */}
      {selectedTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Recent Sync Activity</h4>
            <span className="text-sm text-gray-500">
              {syncHistory.length} recent syncs
            </span>
          </div>
          
          {syncHistory.map((entry) => (
            <div
              key={entry.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getHistoryStatusIcon(entry.status)}
                    <span className="font-medium text-gray-900">{entry.schedule_name}</span>
                    <span className="text-xs text-gray-500">
                      {formatRelativeTime(entry.started_at)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Items Synced:</span> {entry.items_synced}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span> {entry.duration ? `${entry.duration}s` : 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Status:</span> 
                      <span className={`ml-1 capitalize ${
                        entry.status === 'success' ? 'text-green-600' :
                        entry.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {entry.status}
                      </span>
                    </div>
                  </div>
                  
                  {entry.errors && entry.errors.length > 0 && (
                    <div className="mt-2 text-sm text-red-600">
                      <span className="font-medium">Errors:</span>
                      <ul className="mt-1 list-disc list-inside">
                        {entry.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Settings Tab */}
      {selectedTab === 'settings' && (
        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Sync Configuration</h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-900">Email Notifications</h5>
                  <p className="text-sm text-gray-600">Get notified when syncs fail or complete</p>
                </div>
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-gray-500" />
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-900">Retry Failed Syncs</h5>
                  <p className="text-sm text-gray-600">Automatically retry failed syncs up to 3 times</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-900">Performance Optimization</h5>
                  <p className="text-sm text-gray-600">Optimize sync timing based on API rate limits</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Data Retention</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keep sync history for:
                </label>
                <select className="border border-gray-300 rounded-md px-3 py-2 w-full">
                  <option value="30">30 days</option>
                  <option value="90" selected>90 days</option>
                  <option value="365">1 year</option>
                  <option value="forever">Forever</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Schedule Modal Placeholder */}
      {isCreatingSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New Schedule</h3>
            <p className="text-gray-600 mb-4">
              Schedule creation will be available in the next update. For now, use the default schedules.
            </p>
            <button
              onClick={() => setIsCreatingSchedule(false)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}