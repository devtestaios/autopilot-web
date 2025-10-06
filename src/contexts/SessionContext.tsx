/**
 * Enterprise Session Management
 * Advanced session handling with Redis caching and security features
 * Part of the Enterprise Infrastructure Phase
 */

'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { cache, sessionCache, CACHE_KEYS, CACHE_TTL } from '@/lib/cache';
import { useAuth } from '@/contexts/EnhancedAuthContext';

// Session types
export interface SessionData {
  userId: string;
  tenantId?: string;
  email: string;
  role: string;
  permissions: string[];
  lastActivity: number;
  loginTime: number;
  ipAddress?: string;
  userAgent?: string;
  deviceFingerprint?: string;
  isActive: boolean;
  features: string[];
  subscriptionTier: string;
}

export interface SessionActivity {
  timestamp: number;
  action: string;
  page?: string;
  metadata?: Record<string, any>;
}

export interface SessionConfiguration {
  maxInactivityMinutes: number;
  maxSessionDurationHours: number;
  enableActivityTracking: boolean;
  enableSecurityChecks: boolean;
  extendOnActivity: boolean;
}

interface SessionContextType {
  sessionData: SessionData | null;
  isSessionValid: boolean;
  lastActivity: number;
  sessionDuration: number;
  isLoading: boolean;
  
  // Session management
  initializeSession: (userData: Partial<SessionData>) => Promise<void>;
  updateSession: (updates: Partial<SessionData>) => Promise<void>;
  endSession: () => Promise<void>;
  extendSession: () => Promise<void>;
  
  // Activity tracking
  trackActivity: (action: string, metadata?: Record<string, any>) => Promise<void>;
  getRecentActivity: () => Promise<SessionActivity[]>;
  
  // Security
  validateSession: () => Promise<boolean>;
  checkSecurityThreats: () => Promise<boolean>;
  
  // Configuration
  updateConfiguration: (config: Partial<SessionConfiguration>) => void;
}

const SessionContext = createContext<SessionContextType | null>(null);

// Default session configuration
const DEFAULT_CONFIG: SessionConfiguration = {
  maxInactivityMinutes: 30,
  maxSessionDurationHours: 8,
  enableActivityTracking: true,
  enableSecurityChecks: true,
  extendOnActivity: true
};

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [configuration, setConfiguration] = useState<SessionConfiguration>(DEFAULT_CONFIG);
  const [activityTimer, setActivityTimer] = useState<NodeJS.Timeout | null>(null);

  // Calculate session validity
  const isSessionValid = React.useMemo(() => {
    if (!sessionData || !sessionData.isActive) return false;
    
    const now = Date.now();
    const inactivityLimit = configuration.maxInactivityMinutes * 60 * 1000;
    const sessionLimit = configuration.maxSessionDurationHours * 60 * 60 * 1000;
    
    const inactiveTime = now - lastActivity;
    const sessionTime = now - sessionData.loginTime;
    
    return inactiveTime < inactivityLimit && sessionTime < sessionLimit;
  }, [sessionData, lastActivity, configuration]);

  // Calculate session duration
  const sessionDuration = React.useMemo(() => {
    if (!sessionData) return 0;
    return Date.now() - sessionData.loginTime;
  }, [sessionData, lastActivity]); // Update with lastActivity to trigger recalculation

  // Initialize session from cache or create new
  const initializeSession = useCallback(async (userData: Partial<SessionData>) => {
    try {
      setIsLoading(true);
      
      if (!userData.userId || !userData.email) {
        throw new Error('Required user data missing');
      }

      // Try to restore from cache first
      const cachedSession = (await sessionCache.get(userData.userId)) as SessionData | null;
      
      if (cachedSession && cachedSession.isActive) {
        // Validate cached session
        const now = Date.now();
        const inactivityLimit = configuration.maxInactivityMinutes * 60 * 1000;
        const sessionLimit = configuration.maxSessionDurationHours * 60 * 60 * 1000;
        
        const inactiveTime = now - cachedSession.lastActivity;
        const sessionTime = now - cachedSession.loginTime;
        
        if (inactiveTime < inactivityLimit && sessionTime < sessionLimit) {
          setSessionData(cachedSession);
          setLastActivity(cachedSession.lastActivity);
          console.log('✅ Session restored from cache');
          return;
        }
      }

      // Create new session
      const newSession: SessionData = {
        userId: userData.userId,
        tenantId: userData.tenantId,
        email: userData.email,
        role: userData.role || 'user',
        permissions: userData.permissions || [],
        lastActivity: Date.now(),
        loginTime: Date.now(),
        ipAddress: await getClientIP(),
        userAgent: navigator.userAgent,
        deviceFingerprint: await generateDeviceFingerprint(),
        isActive: true,
        features: userData.features || [],
        subscriptionTier: userData.subscriptionTier || 'free'
      };

      // Save to cache
      await sessionCache.set(newSession.userId, newSession, CACHE_TTL.DAILY);
      
      setSessionData(newSession);
      setLastActivity(newSession.lastActivity);
      
      console.log('✅ New session initialized');
      
      // Track login activity
      await trackActivity('session_start', {
        loginMethod: 'standard',
        device: getDeviceInfo()
      });
      
    } catch (error) {
      console.error('Session initialization error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [configuration]);

  // Update session data
  const updateSession = useCallback(async (updates: Partial<SessionData>) => {
    if (!sessionData) return;

    try {
      const updatedSession = {
        ...sessionData,
        ...updates,
        lastActivity: Date.now()
      };

      await sessionCache.set(updatedSession.userId, updatedSession);
      setSessionData(updatedSession);
      setLastActivity(updatedSession.lastActivity);
      
      console.log('Session updated:', Object.keys(updates));
      
    } catch (error) {
      console.error('Session update error:', error);
    }
  }, [sessionData]);

  // End session
  const endSession = useCallback(async () => {
    if (!sessionData) return;

    try {
      // Track logout activity
      await trackActivity('session_end', {
        duration: Date.now() - sessionData.loginTime,
        reason: 'user_logout'
      });

      // Clear from cache
      await sessionCache.delete(sessionData.userId);
      
      // Clear activity timer
      if (activityTimer) {
        clearInterval(activityTimer);
        setActivityTimer(null);
      }

      setSessionData(null);
      setLastActivity(0);
      
      console.log('✅ Session ended');
      
    } catch (error) {
      console.error('Session end error:', error);
    }
  }, [sessionData, activityTimer]);

  // Extend session
  const extendSession = useCallback(async () => {
    if (!sessionData) return;

    try {
      await sessionCache.extend(sessionData.userId, CACHE_TTL.DAILY);
      setLastActivity(Date.now());
      
      console.log('Session extended');
      
    } catch (error) {
      console.error('Session extension error:', error);
    }
  }, [sessionData]);

  // Track user activity
  const trackActivity = useCallback(async (action: string, metadata?: Record<string, any>) => {
    if (!sessionData || !configuration.enableActivityTracking) return;

    try {
      const activity: SessionActivity = {
        timestamp: Date.now(),
        action,
        page: window.location.pathname,
        metadata
      };

      // Store recent activities (last 100)
      const activityKey = `${CACHE_KEYS.USER_SESSION(sessionData.userId)}:activity`;
      const recentActivities = await cache.get<SessionActivity[]>(activityKey) || [];
      
      recentActivities.unshift(activity);
      const limitedActivities = recentActivities.slice(0, 100);
      
      await cache.set(activityKey, limitedActivities, { ttl: CACHE_TTL.DAILY });
      
      // Update last activity time
      setLastActivity(Date.now());
      
      // Extend session if configured
      if (configuration.extendOnActivity) {
        await updateSession({ lastActivity: Date.now() });
      }
      
    } catch (error) {
      console.error('Activity tracking error:', error);
    }
  }, [sessionData, configuration, updateSession]);

  // Get recent activity
  const getRecentActivity = useCallback(async (): Promise<SessionActivity[]> => {
    if (!sessionData) return [];

    try {
      const activityKey = `${CACHE_KEYS.USER_SESSION(sessionData.userId)}:activity`;
      return await cache.get<SessionActivity[]>(activityKey) || [];
    } catch (error) {
      console.error('Get activity error:', error);
      return [];
    }
  }, [sessionData]);

  // Validate session security
  const validateSession = useCallback(async (): Promise<boolean> => {
    if (!sessionData || !configuration.enableSecurityChecks) return true;

    try {
      // Check for session validity
      if (!isSessionValid) {
        await endSession();
        return false;
      }

      // Additional security checks
      const currentIP = await getClientIP();
      const currentFingerprint = await generateDeviceFingerprint();
      
      if (sessionData.ipAddress && sessionData.ipAddress !== currentIP) {
        console.warn('Session IP address changed');
        // Could trigger additional verification
      }

      if (sessionData.deviceFingerprint && sessionData.deviceFingerprint !== currentFingerprint) {
        console.warn('Device fingerprint changed');
        // Could trigger additional verification
      }

      return true;
      
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  }, [sessionData, isSessionValid, configuration, endSession]);

  // Check for security threats
  const checkSecurityThreats = useCallback(async (): Promise<boolean> => {
    if (!sessionData) return false;

    try {
      // Check for suspicious activity patterns
      const activities = await getRecentActivity();
      
      // Example: too many rapid actions
      const recentActions = activities.filter(a => 
        Date.now() - a.timestamp < 60000 // Last minute
      );
      
      if (recentActions.length > 50) {
        console.warn('Suspicious activity detected: too many rapid actions');
        return true;
      }

      // Example: access from multiple locations
      const uniqueIPs = new Set(activities
        .filter(a => a.metadata?.ipAddress)
        .map(a => a.metadata!.ipAddress)
      );
      
      if (uniqueIPs.size > 3) {
        console.warn('Suspicious activity detected: multiple IP addresses');
        return true;
      }

      return false;
      
    } catch (error) {
      console.error('Security threat check error:', error);
      return false;
    }
  }, [sessionData, getRecentActivity]);

  // Update configuration
  const updateConfiguration = useCallback((config: Partial<SessionConfiguration>) => {
    setConfiguration(prev => ({ ...prev, ...config }));
  }, []);

  // Activity tracking timer
  useEffect(() => {
    if (!sessionData || !configuration.enableActivityTracking) return;

    // Clear existing timer
    if (activityTimer) {
      clearInterval(activityTimer);
    }

    // Set up activity tracking
    const timer = setInterval(async () => {
      await validateSession();
    }, 60000); // Check every minute

    setActivityTimer(timer);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [sessionData, configuration.enableActivityTracking, validateSession]);

  // Track page visits
  useEffect(() => {
    if (sessionData && configuration.enableActivityTracking) {
      trackActivity('page_visit', { 
        path: window.location.pathname,
        referrer: document.referrer 
      });
    }
  }, [sessionData, configuration.enableActivityTracking, trackActivity]);

  // Initialize session when user authenticates
  useEffect(() => {
    if (isAuthenticated && user && !sessionData) {
      initializeSession({
        userId: user.id,
        tenantId: (user as any).app_metadata?.tenant_id,
        email: user.email || '',
        role: (user as any).app_metadata?.role || 'user',
        permissions: (user as any).app_metadata?.permissions || [],
        features: (user as any).app_metadata?.features || [],
        subscriptionTier: (user as any).app_metadata?.subscription_tier || 'free'
      });
    } else if (!isAuthenticated && sessionData) {
      endSession();
    }
  }, [isAuthenticated, user, sessionData, initializeSession, endSession]);

  // Session value
  const value: SessionContextType = {
    sessionData,
    isSessionValid,
    lastActivity,
    sessionDuration,
    isLoading,
    initializeSession,
    updateSession,
    endSession,
    extendSession,
    trackActivity,
    getRecentActivity,
    validateSession,
    checkSecurityThreats,
    updateConfiguration
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

// Custom hook
export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}

// Utility functions
async function getClientIP(): Promise<string> {
  try {
    // In a real implementation, this would get the actual client IP
    // For development, return a placeholder
    return '127.0.0.1';
  } catch {
    return 'unknown';
  }
}

async function generateDeviceFingerprint(): Promise<string> {
  try {
    // Create a simple device fingerprint
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
    }
    
    const fingerprint = btoa([
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|'));
    
    return fingerprint.slice(0, 32); // Truncate for storage
  } catch {
    return 'unknown';
  }
}

function getDeviceInfo() {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };
}

export default SessionProvider;