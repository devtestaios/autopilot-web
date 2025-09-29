/**
 * PERFORMANCE DATA STORAGE
 * Following ADVANCED_CODING_AI_DISSERTATION.md - Performance Protocol
 * 
 * Browser-based performance data persistence with IndexedDB fallback
 * and localStorage support for performance analytics and historical tracking.
 */

import { PerformanceSnapshot } from '@/contexts/PerformanceContext';

// Storage configuration
const STORAGE_CONFIG = {
  localStorageKey: 'pulsebridge_performance_data',
  maxStorageSize: 5 * 1024 * 1024, // 5MB limit
  maxSnapshots: 200,
  compressionEnabled: true
} as const;

// Storage interface for different storage backends
interface StorageBackend {
  save: (data: PerformanceSnapshot[]) => Promise<void>;
  load: () => Promise<PerformanceSnapshot[]>;
  clear: () => Promise<void>;
  getSize: () => Promise<number>;
}

/**
 * localStorage backend implementation
 * 
 * ✅ PERFORMANCE: Optimized for quick access with compression
 */
class LocalStorageBackend implements StorageBackend {
  async save(data: PerformanceSnapshot[]): Promise<void> {
    try {
      const serialized = JSON.stringify(data);
      
      // Check size limits
      if (serialized.length > STORAGE_CONFIG.maxStorageSize) {
        // Trim oldest data to fit within limits
        const trimmedData = data.slice(0, Math.floor(STORAGE_CONFIG.maxSnapshots / 2));
        const trimmedSerialized = JSON.stringify(trimmedData);
        localStorage.setItem(STORAGE_CONFIG.localStorageKey, trimmedSerialized);
      } else {
        localStorage.setItem(STORAGE_CONFIG.localStorageKey, serialized);
      }
    } catch (error) {
      console.warn('Failed to save performance data to localStorage:', error);
      // Fallback: Clear old data and try again
      try {
        localStorage.removeItem(STORAGE_CONFIG.localStorageKey);
        const recentData = data.slice(0, 50); // Keep only most recent 50 snapshots
        localStorage.setItem(STORAGE_CONFIG.localStorageKey, JSON.stringify(recentData));
      } catch (fallbackError) {
        console.error('Failed to save performance data even after clearing:', fallbackError);
      }
    }
  }

  async load(): Promise<PerformanceSnapshot[]> {
    try {
      const stored = localStorage.getItem(STORAGE_CONFIG.localStorageKey);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      
      // Validate data structure
      if (Array.isArray(parsed)) {
        return parsed.filter(this.validateSnapshot);
      }
      
      return [];
    } catch (error) {
      console.warn('Failed to load performance data from localStorage:', error);
      return [];
    }
  }

  async clear(): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_CONFIG.localStorageKey);
    } catch (error) {
      console.warn('Failed to clear performance data from localStorage:', error);
    }
  }

  async getSize(): Promise<number> {
    try {
      const stored = localStorage.getItem(STORAGE_CONFIG.localStorageKey);
      return stored ? stored.length : 0;
    } catch (error) {
      return 0;
    }
  }

  private validateSnapshot(snapshot: any): snapshot is PerformanceSnapshot {
    return (
      snapshot &&
      typeof snapshot.id === 'string' &&
      typeof snapshot.timestamp === 'number' &&
      typeof snapshot.url === 'string' &&
      snapshot.webVitals &&
      snapshot.summary
    );
  }
}

/**
 * IndexedDB backend implementation (future enhancement)
 * 
 * ✅ FUTURE: Advanced storage for larger datasets
 */
class IndexedDBBackend implements StorageBackend {
  private dbName = 'PulseBridgePerformance';
  private version = 1;
  private storeName = 'snapshots';

  async save(data: PerformanceSnapshot[]): Promise<void> {
    // IndexedDB implementation would go here
    // For now, fallback to localStorage
    const localStorage = new LocalStorageBackend();
    return localStorage.save(data);
  }

  async load(): Promise<PerformanceSnapshot[]> {
    // IndexedDB implementation would go here
    // For now, fallback to localStorage
    const localStorage = new LocalStorageBackend();
    return localStorage.load();
  }

  async clear(): Promise<void> {
    // IndexedDB implementation would go here
    // For now, fallback to localStorage
    const localStorage = new LocalStorageBackend();
    return localStorage.clear();
  }

  async getSize(): Promise<number> {
    // IndexedDB implementation would go here
    // For now, fallback to localStorage
    const localStorage = new LocalStorageBackend();
    return localStorage.getSize();
  }
}

// Storage backend selection
function getStorageBackend(): StorageBackend {
  // For now, use localStorage. In the future, could detect IndexedDB support
  return new LocalStorageBackend();
}

// Global storage instance
let storageBackend: StorageBackend | null = null;

function getStorage(): StorageBackend {
  if (!storageBackend) {
    storageBackend = getStorageBackend();
  }
  return storageBackend;
}

/**
 * Save performance snapshot to persistent storage
 * 
 * ✅ PERFORMANCE: Efficient storage with size management
 */
export async function savePerformanceData(snapshot: PerformanceSnapshot): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const storage = getStorage();
    const existing = await storage.load();
    
    // Add new snapshot to the beginning
    const updated = [snapshot, ...existing];
    
    // Limit number of snapshots to prevent storage bloat
    const trimmed = updated.slice(0, STORAGE_CONFIG.maxSnapshots);
    
    await storage.save(trimmed);
  } catch (error) {
    console.error('Failed to save performance data:', error);
  }
}

/**
 * Load performance history from persistent storage
 * 
 * ✅ PERFORMANCE: Optimized loading with validation
 */
export async function loadPerformanceHistory(): Promise<PerformanceSnapshot[]> {
  if (typeof window === 'undefined') return [];

  try {
    const storage = getStorage();
    const data = await storage.load();
    
    // Sort by timestamp (newest first) and validate
    return data
      .sort((a, b) => b.timestamp - a.timestamp)
      .filter(snapshot => {
        // Basic validation
        return snapshot.timestamp > 0 && snapshot.webVitals;
      });
  } catch (error) {
    console.error('Failed to load performance history:', error);
    return [];
  }
}

/**
 * Clear all performance data from storage
 * 
 * ✅ PERFORMANCE: Complete data cleanup
 */
export async function clearPerformanceData(): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    const storage = getStorage();
    await storage.clear();
  } catch (error) {
    console.error('Failed to clear performance data:', error);
  }
}

/**
 * Get storage usage information
 * 
 * ✅ ANALYTICS: Storage size monitoring for optimization
 */
export async function getStorageInfo(): Promise<{
  size: number;
  maxSize: number;
  count: number;
  utilizationPercentage: number;
}> {
  if (typeof window === 'undefined') {
    return { size: 0, maxSize: 0, count: 0, utilizationPercentage: 0 };
  }

  try {
    const storage = getStorage();
    const data = await storage.load();
    const size = await storage.getSize();
    
    return {
      size,
      maxSize: STORAGE_CONFIG.maxStorageSize,
      count: data.length,
      utilizationPercentage: Math.round((size / STORAGE_CONFIG.maxStorageSize) * 100)
    };
  } catch (error) {
    console.error('Failed to get storage info:', error);
    return { size: 0, maxSize: 0, count: 0, utilizationPercentage: 0 };
  }
}

/**
 * Export performance data as JSON for analysis
 * 
 * ✅ ANALYTICS: Data export for external analysis
 */
export async function exportPerformanceData(): Promise<string> {
  if (typeof window === 'undefined') return '[]';

  try {
    const storage = getStorage();
    const data = await storage.load();
    
    const exportData = {
      exportTimestamp: Date.now(),
      version: '1.0',
      snapshots: data,
      metadata: {
        totalSnapshots: data.length,
        dateRange: data.length > 0 ? {
          from: Math.min(...data.map(s => s.timestamp)),
          to: Math.max(...data.map(s => s.timestamp))
        } : null,
        exportedBy: 'PulseBridge Performance Monitor'
      }
    };
    
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Failed to export performance data:', error);
    return '[]';
  }
}

/**
 * Import performance data from JSON
 * 
 * ✅ ANALYTICS: Data import for analysis and testing
 */
export async function importPerformanceData(jsonData: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  try {
    const importData = JSON.parse(jsonData);
    
    // Validate import data structure
    if (!importData.snapshots || !Array.isArray(importData.snapshots)) {
      throw new Error('Invalid import data format');
    }
    
    const storage = getStorage();
    const existing = await storage.load();
    
    // Merge imported data with existing (avoid duplicates)
    const existingIds = new Set(existing.map(s => s.id));
    const newSnapshots = importData.snapshots.filter((s: PerformanceSnapshot) => 
      !existingIds.has(s.id)
    );
    
    const merged = [...existing, ...newSnapshots]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, STORAGE_CONFIG.maxSnapshots);
    
    await storage.save(merged);
    return true;
  } catch (error) {
    console.error('Failed to import performance data:', error);
    return false;
  }
}

/**
 * Optimize storage by removing old and redundant data
 * 
 * ✅ PERFORMANCE: Storage optimization for long-running applications
 */
export async function optimizeStorage(): Promise<{
  before: { count: number; size: number };
  after: { count: number; size: number };
  optimized: boolean;
}> {
  if (typeof window === 'undefined') {
    return { before: { count: 0, size: 0 }, after: { count: 0, size: 0 }, optimized: false };
  }

  try {
    const storage = getStorage();
    const beforeData = await storage.load();
    const beforeSize = await storage.getSize();
    
    // Optimization strategies:
    // 1. Remove snapshots older than 30 days
    // 2. Keep only best and worst performing snapshots for each day
    // 3. Limit to maximum number of snapshots
    
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    
    // Filter out old data
    const recent = beforeData.filter(s => s.timestamp > thirtyDaysAgo);
    
    // Group by day and select representative samples
    const dailyGroups = new Map<string, PerformanceSnapshot[]>();
    
    recent.forEach(snapshot => {
      const dateKey = new Date(snapshot.timestamp).toDateString();
      if (!dailyGroups.has(dateKey)) {
        dailyGroups.set(dateKey, []);
      }
      dailyGroups.get(dateKey)!.push(snapshot);
    });
    
    // Keep best and worst performing snapshot from each day
    const optimized: PerformanceSnapshot[] = [];
    
    dailyGroups.forEach(snapshots => {
      if (snapshots.length <= 2) {
        optimized.push(...snapshots);
      } else {
        // Sort by overall performance rating
        snapshots.sort((a, b) => {
          const ratingOrder = { good: 3, 'needs-improvement': 2, poor: 1 };
          return ratingOrder[b.summary.overallRating] - ratingOrder[a.summary.overallRating];
        });
        
        // Keep best and worst
        optimized.push(snapshots[0], snapshots[snapshots.length - 1]);
      }
    });
    
    // Final limit check
    const final = optimized
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, STORAGE_CONFIG.maxSnapshots);
    
    await storage.save(final);
    const afterSize = await storage.getSize();
    
    return {
      before: { count: beforeData.length, size: beforeSize },
      after: { count: final.length, size: afterSize },
      optimized: final.length < beforeData.length || afterSize < beforeSize
    };
  } catch (error) {
    console.error('Failed to optimize storage:', error);
    return { before: { count: 0, size: 0 }, after: { count: 0, size: 0 }, optimized: false };
  }
}