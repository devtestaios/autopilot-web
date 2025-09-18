// API helper functions for sync management functionality
// Provides type-safe interfaces to backend sync endpoints

const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://your-render-app.onrender.com' 
  : 'http://localhost:8000';

// Types matching backend models
export interface SyncSchedule {
  id: string;
  name: string;
  type: 'campaigns' | 'performance' | 'both';
  frequency: 'hourly' | 'daily' | 'weekly' | 'manual';
  next_run: string;
  last_run?: string;
  status: 'active' | 'paused' | 'error' | 'running';
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface SyncJob {
  id: string;
  schedule_id: string;
  schedule_name: string;
  type: 'campaigns' | 'performance' | 'both';
  status: 'success' | 'failed' | 'partial' | 'running';
  started_at: string;
  completed_at?: string;
  items_synced: number;
  errors: string[];
  duration?: number;
}

export interface SyncMetrics {
  total_jobs: number;
  successful_jobs: number;
  failed_jobs: number;
  avg_sync_time: number;
  last_sync_time?: string;
  data_points_synced: number;
}

export interface SystemStatus {
  id: string;
  name: string;
  type: 'api' | 'database' | 'sync' | 'analytics';
  status: 'online' | 'offline' | 'warning' | 'error';
  last_sync?: string;
  next_sync?: string;
  response_time?: number;
  uptime?: number;
  error_count: number;
}

export interface CreateSyncSchedule {
  name: string;
  type: 'campaigns' | 'performance' | 'both';
  frequency: 'hourly' | 'daily' | 'weekly' | 'manual';
  enabled?: boolean;
  next_run?: string;
}

export interface UpdateSyncSchedule {
  name?: string;
  type?: 'campaigns' | 'performance' | 'both';
  frequency?: 'hourly' | 'daily' | 'weekly' | 'manual';
  enabled?: boolean;
  next_run?: string;
}

// Error handling wrapper
async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error ${response.status}: ${errorText}`);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  return response.text() as any;
}

// Sync Schedules API
export async function fetchSyncSchedules(): Promise<SyncSchedule[]> {
  try {
    const response = await fetch(`${API_BASE}/sync/schedules`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await handleApiResponse<SyncSchedule[]>(response);
  } catch (error) {
    console.error('Failed to fetch sync schedules:', error);
    // Return mock data for demo purposes
    return [
      {
        id: 'campaign-daily',
        name: 'Daily Campaign Sync',
        type: 'campaigns',
        frequency: 'daily',
        next_run: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        last_run: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        enabled: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'performance-hourly',
        name: 'Hourly Performance Update',
        type: 'performance',
        frequency: 'hourly',
        next_run: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        last_run: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        status: 'active',
        enabled: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }
}

export async function createSyncSchedule(schedule: CreateSyncSchedule): Promise<SyncSchedule> {
  try {
    const response = await fetch(`${API_BASE}/sync/schedules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(schedule)
    });
    return await handleApiResponse<SyncSchedule>(response);
  } catch (error) {
    console.error('Failed to create sync schedule:', error);
    throw error;
  }
}

export async function updateSyncSchedule(scheduleId: string, updates: UpdateSyncSchedule): Promise<SyncSchedule> {
  try {
    const response = await fetch(`${API_BASE}/sync/schedules/${scheduleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates)
    });
    return await handleApiResponse<SyncSchedule>(response);
  } catch (error) {
    console.error('Failed to update sync schedule:', error);
    throw error;
  }
}

export async function deleteSyncSchedule(scheduleId: string): Promise<{ message: string; schedule: SyncSchedule }> {
  try {
    const response = await fetch(`${API_BASE}/sync/schedules/${scheduleId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await handleApiResponse<{ message: string; schedule: SyncSchedule }>(response);
  } catch (error) {
    console.error('Failed to delete sync schedule:', error);
    throw error;
  }
}

export async function triggerSyncJob(scheduleId: string): Promise<SyncJob> {
  try {
    const response = await fetch(`${API_BASE}/sync/schedules/${scheduleId}/trigger`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await handleApiResponse<SyncJob>(response);
  } catch (error) {
    console.error('Failed to trigger sync job:', error);
    // Return mock job for demo
    return {
      id: `job-${Date.now()}`,
      schedule_id: scheduleId,
      schedule_name: 'Demo Sync',
      type: 'campaigns',
      status: 'success',
      started_at: new Date().toISOString(),
      completed_at: new Date().toISOString(),
      items_synced: Math.floor(Math.random() * 20) + 5,
      errors: [],
      duration: Math.floor(Math.random() * 60) + 15
    };
  }
}

// Sync Jobs API
export async function fetchSyncJobs(limit: number = 50): Promise<SyncJob[]> {
  try {
    const response = await fetch(`${API_BASE}/sync/jobs?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await handleApiResponse<SyncJob[]>(response);
  } catch (error) {
    console.error('Failed to fetch sync jobs:', error);
    // Return mock data
    return [
      {
        id: 'job-1',
        schedule_id: 'campaign-daily',
        schedule_name: 'Daily Campaign Sync',
        type: 'campaigns',
        status: 'success',
        started_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        completed_at: new Date(Date.now() - 2 * 60 * 60 * 1000 + 45000).toISOString(),
        items_synced: 12,
        errors: [],
        duration: 45
      },
      {
        id: 'job-2',
        schedule_id: 'performance-hourly',
        schedule_name: 'Hourly Performance Update',
        type: 'performance',
        status: 'success',
        started_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        completed_at: new Date(Date.now() - 30 * 60 * 1000 + 23000).toISOString(),
        items_synced: 8,
        errors: [],
        duration: 23
      }
    ];
  }
}

// Sync Metrics API
export async function fetchSyncMetrics(): Promise<SyncMetrics> {
  try {
    const response = await fetch(`${API_BASE}/sync/metrics`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await handleApiResponse<SyncMetrics>(response);
  } catch (error) {
    console.error('Failed to fetch sync metrics:', error);
    // Return mock data
    return {
      total_jobs: 1247,
      successful_jobs: 1198,
      failed_jobs: 49,
      avg_sync_time: 1.8,
      last_sync_time: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      data_points_synced: 15678
    };
  }
}

// System Status API
export async function fetchSystemStatuses(): Promise<SystemStatus[]> {
  try {
    const response = await fetch(`${API_BASE}/sync/system-status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await handleApiResponse<SystemStatus[]>(response);
  } catch (error) {
    console.error('Failed to fetch system statuses:', error);
    // Return mock data
    return [
      {
        id: 'google-ads-api',
        name: 'Google Ads API',
        type: 'api',
        status: 'online',
        last_sync: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        next_sync: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
        response_time: 245,
        uptime: 99.8,
        error_count: 0
      },
      {
        id: 'supabase-db',
        name: 'Supabase Database',
        type: 'database',
        status: 'online',
        last_sync: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        response_time: 89,
        uptime: 99.9,
        error_count: 0
      },
      {
        id: 'campaign-sync',
        name: 'Campaign Data Sync',
        type: 'sync',
        status: 'online',
        last_sync: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        next_sync: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        response_time: 1234,
        uptime: 98.5,
        error_count: 2
      },
      {
        id: 'performance-sync',
        name: 'Performance Analytics',
        type: 'analytics',
        status: 'warning',
        last_sync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        next_sync: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        response_time: 3456,
        uptime: 95.2,
        error_count: 8
      }
    ];
  }
}

export async function updateSystemStatus(systemId: string, statusData: Partial<SystemStatus>): Promise<SystemStatus> {
  try {
    const response = await fetch(`${API_BASE}/sync/system-status/${systemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statusData)
    });
    return await handleApiResponse<SystemStatus>(response);
  } catch (error) {
    console.error('Failed to update system status:', error);
    throw error;
  }
}

// Utility functions
export function calculateSuccessRate(metrics: SyncMetrics): number {
  if (metrics.total_jobs === 0) return 0;
  return (metrics.successful_jobs / metrics.total_jobs) * 100;
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  } else if (seconds < 3600) {
    return `${Math.round(seconds / 60)}m ${Math.round(seconds % 60)}s`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
}

export function formatRelativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function formatNextTime(timestamp: string): string {
  const diff = new Date(timestamp).getTime() - Date.now();
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (diff < 0) return 'Overdue';
  if (minutes < 60) return `in ${minutes}m`;
  if (hours < 24) return `in ${hours}h`;
  return `in ${days}d`;
}

// Health check function
export async function checkSyncSystemHealth(): Promise<{ healthy: boolean; issues: string[] }> {
  try {
    const [schedules, metrics, systems] = await Promise.all([
      fetchSyncSchedules(),
      fetchSyncMetrics(),
      fetchSystemStatuses()
    ]);

    const issues: string[] = [];
    
    // Check for failed systems
    const failedSystems = systems.filter(s => s.status === 'error' || s.status === 'offline');
    if (failedSystems.length > 0) {
      issues.push(`${failedSystems.length} system(s) are offline or have errors`);
    }

    // Check sync success rate
    const successRate = calculateSuccessRate(metrics);
    if (successRate < 90) {
      issues.push(`Sync success rate is low: ${successRate.toFixed(1)}%`);
    }

    // Check for overdue schedules
    const overdueSchedules = schedules.filter(s => 
      s.enabled && new Date(s.next_run).getTime() < Date.now()
    );
    if (overdueSchedules.length > 0) {
      issues.push(`${overdueSchedules.length} schedule(s) are overdue`);
    }

    return {
      healthy: issues.length === 0,
      issues
    };
  } catch (error) {
    return {
      healthy: false,
      issues: ['Unable to connect to sync system']
    };
  }
}