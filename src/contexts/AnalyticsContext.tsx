'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
  timestamp: number;
  sessionId: string;
  userId?: string;
  page: string;
  userAgent: string;
}

interface UserSession {
  sessionId: string;
  startTime: number;
  lastActivity: number;
  pageViews: number;
  events: AnalyticsEvent[];
  device: {
    type: 'desktop' | 'tablet' | 'mobile';
    browser: string;
    os: string;
  };
  referrer?: string;
  utmParams?: Record<string, string>;
}

interface AnalyticsContextType {
  trackEvent: (event: Omit<AnalyticsEvent, 'timestamp' | 'sessionId' | 'page' | 'userAgent'>) => void;
  trackPageView: (page: string, title?: string) => void;
  trackConversion: (type: string, value?: number, properties?: Record<string, any>) => void;
  trackInteraction: (element: string, action: string, properties?: Record<string, any>) => void;
  trackPerformance: (metric: string, value: number, properties?: Record<string, any>) => void;
  getSession: () => UserSession | null;
  setUserId: (userId: string) => void;
  getCurrentSessionId: () => string;
  // Additional methods for analytics dashboard
  getSessionStats: () => { totalSessions: number; averageDuration: number; bounceRate: number };
  getTotalEvents: () => number;
  getPerformanceStats: () => { averageLoadTime: number };
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}

interface AnalyticsProviderProps {
  children: ReactNode;
  apiEndpoint?: string;
  enableLocalStorage?: boolean;
  batchSize?: number;
  flushInterval?: number;
}

export function AnalyticsProvider({ 
  children, 
  apiEndpoint = '/api/analytics',
  enableLocalStorage = true,
  batchSize = 10,
  flushInterval = 30000 // 30 seconds
}: AnalyticsProviderProps) {
  const [session, setSession] = useState<UserSession | null>(null);
  const [eventQueue, setEventQueue] = useState<AnalyticsEvent[]>([]);
  const [userId, setUserIdState] = useState<string | undefined>();

  // Initialize session
  useEffect(() => {
    const initSession = () => {
      const sessionId = generateSessionId();
      const userAgent = navigator.userAgent;
      const device = detectDevice(userAgent);
      const referrer = document.referrer;
      const utmParams = extractUtmParams();

      const newSession: UserSession = {
        sessionId,
        startTime: Date.now(),
        lastActivity: Date.now(),
        pageViews: 0,
        events: [],
        device,
        referrer: referrer || undefined,
        utmParams: Object.keys(utmParams).length > 0 ? utmParams : undefined
      };

      setSession(newSession);

      // Store session in localStorage if enabled
      if (enableLocalStorage) {
        localStorage.setItem('pulsebridge_session', JSON.stringify(newSession));
      }

      return newSession;
    };

    // Try to restore session from localStorage
    if (enableLocalStorage) {
      const stored = localStorage.getItem('pulsebridge_session');
      if (stored) {
        try {
          const parsedSession = JSON.parse(stored);
          // Check if session is still valid (less than 30 minutes old)
          if (Date.now() - parsedSession.lastActivity < 30 * 60 * 1000) {
            setSession(parsedSession);
            return;
          }
        } catch (error) {
          console.warn('Failed to restore analytics session:', error);
        }
      }
    }

    initSession();
  }, [enableLocalStorage]);

  // Flush events periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (eventQueue.length > 0) {
        flushEvents();
      }
    }, flushInterval);

    return () => clearInterval(interval);
  }, [eventQueue, flushInterval]);

  // Flush events when queue reaches batch size
  useEffect(() => {
    if (eventQueue.length >= batchSize) {
      flushEvents();
    }
  }, [eventQueue, batchSize]);

  const generateSessionId = (): string => {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const detectDevice = (userAgent: string) => {
    const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);
    
    let browser = 'Unknown';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    let os = 'Unknown';
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac OS')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';

    return {
      type: (isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop') as 'desktop' | 'mobile' | 'tablet',
      browser,
      os
    };
  };

  const extractUtmParams = (): Record<string, string> => {
    if (typeof window === 'undefined') return {};
    
    const params = new URLSearchParams(window.location.search);
    const utmParams: Record<string, string> = {};
    
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
      const value = params.get(param);
      if (value) {
        utmParams[param] = value;
      }
    });

    return utmParams;
  };

  const updateSession = (updates: Partial<UserSession>) => {
    if (!session) return;

    const updatedSession = {
      ...session,
      ...updates,
      lastActivity: Date.now()
    };

    setSession(updatedSession);

    if (enableLocalStorage) {
      localStorage.setItem('pulsebridge_session', JSON.stringify(updatedSession));
    }
  };

  const addEventToQueue = (event: AnalyticsEvent) => {
    setEventQueue(prev => [...prev, event]);
    
    // Update session with event
    if (session) {
      updateSession({
        events: [...session.events, event]
      });
    }
  };

  const flushEvents = async () => {
    if (eventQueue.length === 0) return;

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events: eventQueue,
          session: session,
          timestamp: Date.now()
        })
      });

      if (response.ok) {
        setEventQueue([]);
      } else {
        console.warn('Failed to send analytics events:', response.statusText);
      }
    } catch (error) {
      console.warn('Analytics flush error:', error);
    }
  };

  const trackEvent = (eventData: Omit<AnalyticsEvent, 'timestamp' | 'sessionId' | 'page' | 'userAgent'>) => {
    if (!session || typeof window === 'undefined') return;

    const event: AnalyticsEvent = {
      ...eventData,
      timestamp: Date.now(),
      sessionId: session.sessionId,
      userId,
      page: typeof window !== 'undefined' ? window.location.pathname : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
    };

    addEventToQueue(event);
  };

  const trackPageView = (page: string, title?: string) => {
    if (typeof window === 'undefined') return;
    
    trackEvent({
      event: 'page_view',
      category: 'navigation',
      action: 'page_view',
      label: page,
      properties: {
        title: title || (typeof document !== 'undefined' ? document.title : ''),
        url: typeof window !== 'undefined' ? window.location.href : '',
        referrer: typeof document !== 'undefined' ? document.referrer : ''
      }
    });

    // Update session page views
    if (session) {
      updateSession({
        pageViews: session.pageViews + 1
      });
    }
  };

  const trackConversion = (type: string, value?: number, properties?: Record<string, any>) => {
    trackEvent({
      event: 'conversion',
      category: 'conversion',
      action: type,
      value,
      properties: {
        conversion_type: type,
        ...properties
      }
    });
  };

  const trackInteraction = (element: string, action: string, properties?: Record<string, any>) => {
    trackEvent({
      event: 'interaction',
      category: 'ui',
      action,
      label: element,
      properties: {
        element,
        ...properties
      }
    });
  };

  const trackPerformance = (metric: string, value: number, properties?: Record<string, any>) => {
    trackEvent({
      event: 'performance',
      category: 'performance',
      action: metric,
      value,
      properties: {
        metric,
        ...properties
      }
    });
  };

  const getSession = () => session;

  const setUserId = (newUserId: string) => {
    setUserIdState(newUserId);
    trackEvent({
      event: 'user_identified',
      category: 'user',
      action: 'identify',
      properties: {
        user_id: newUserId
      }
    });
  };

  const getCurrentSessionId = () => session?.sessionId || '';

  // Track page views automatically
  useEffect(() => {
    if (session && typeof window !== 'undefined') {
      trackPageView(window.location.pathname);
    }
  }, [session]);

  // Track session end on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (eventQueue.length > 0) {
        // Use sendBeacon for reliable delivery on page unload
        navigator.sendBeacon(apiEndpoint, JSON.stringify({
          events: eventQueue,
          session: session,
          timestamp: Date.now()
        }));
      }

      // Track session end
      trackEvent({
        event: 'session_end',
        category: 'session',
        action: 'end',
        properties: {
          duration: session ? Date.now() - session.startTime : 0,
          page_views: session?.pageViews || 0,
          events_count: session?.events.length || 0
        }
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [eventQueue, session]);

  // Additional analytics methods
  const getSessionStats = () => {
    if (!session) {
      return { totalSessions: 0, averageDuration: 0, bounceRate: 0 };
    }
    
    const duration = Date.now() - session.startTime;
    const bounceRate = session.pageViews <= 1 ? 1 : 0;
    
    return {
      totalSessions: 1, // Current session
      averageDuration: duration / 1000, // Convert to seconds
      bounceRate: bounceRate
    };
  };

  const getTotalEvents = () => {
    return session?.events.length || 0;
  };

  const getPerformanceStats = () => {
    const performanceEntries = session?.events.filter(e => e.category === 'performance') || [];
    const loadTimes = performanceEntries
      .filter(e => e.action === 'page_load_time')
      .map(e => e.properties?.value)
      .filter(v => typeof v === 'number') as number[];
    
    const averageLoadTime = loadTimes.length > 0 
      ? loadTimes.reduce((sum, time) => sum + time, 0) / loadTimes.length 
      : 0;
    
    return {
      averageLoadTime
    };
  };

  const value: AnalyticsContextType = {
    trackEvent,
    trackPageView,
    trackConversion,
    trackInteraction,
    trackPerformance,
    getSession,
    setUserId,
    getCurrentSessionId,
    getSessionStats,
    getTotalEvents,
    getPerformanceStats
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}