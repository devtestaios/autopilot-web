'use client';

/**
 * SIMPLE ANALYTICS SYSTEM
 * SSR-safe analytics tracking for performance optimization integration
 */

interface SimpleAnalyticsEvent {
  eventType: 'page_view' | 'click' | 'form_submit' | 'feature_use' | 'error' | 'performance';
  userId?: string;
  sessionId: string;
  timestamp: number;
  properties: Record<string, any>;
  page: string;
}

class SimpleAnalyticsManager {
  private sessionId: string;
  private userId?: string;
  private events: SimpleAnalyticsEvent[] = [];
  private isEnabled: boolean = true;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeTracking();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeTracking(): void {
    if (typeof window === 'undefined') return;

    // Load stored events
    try {
      const stored = localStorage.getItem('simple_analytics_events');
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load stored analytics events:', error);
    }
  }

  /**
   * Track user behavior events
   */
  track(
    eventType: SimpleAnalyticsEvent['eventType'],
    properties: Record<string, any> = {}
  ): void {
    if (!this.isEnabled || typeof window === 'undefined') return;

    const event: SimpleAnalyticsEvent = {
      eventType,
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      properties,
      page: window.location.pathname
    };

    this.events.push(event);
    this.persistEvents();

    // Log for development
    console.log('Analytics:', event);
  }

  /**
   * Track page views
   */
  trackPageView(page?: string): void {
    this.track('page_view', {
      page: page || (typeof window !== 'undefined' ? window.location.pathname : ''),
      referrer: typeof document !== 'undefined' ? document.referrer : ''
    });
  }

  /**
   * Track feature usage
   */
  trackFeatureUsage(featureName: string, action: string, properties: Record<string, any> = {}): void {
    this.track('feature_use', {
      feature: featureName,
      action,
      ...properties
    });
  }

  /**
   * Track conversion events
   */
  trackConversion(goalName: string, value?: number, properties: Record<string, any> = {}): void {
    this.track('form_submit', {
      conversionGoal: goalName,
      conversionValue: value,
      ...properties
    });
  }

  /**
   * Track errors
   */
  trackError(error: Error, context?: Record<string, any>): void {
    this.track('error', {
      errorMessage: error.message,
      errorStack: error.stack,
      ...context
    });
  }

  /**
   * Track performance metrics
   */
  trackPerformance(metricName: string, value: number, properties: Record<string, any> = {}): void {
    this.track('performance', {
      metric: metricName,
      value,
      ...properties
    });
  }

  /**
   * Set user ID
   */
  setUserId(userId: string): void {
    this.userId = userId;
  }

  /**
   * Get analytics summary
   */
  getAnalyticsSummary(): {
    totalEvents: number;
    eventTypes: Record<string, number>;
    recentEvents: SimpleAnalyticsEvent[];
    sessionInfo: {
      sessionId: string;
      userId?: string;
      startTime: number;
    };
  } {
    const eventTypes: Record<string, number> = {};
    this.events.forEach(event => {
      eventTypes[event.eventType] = (eventTypes[event.eventType] || 0) + 1;
    });

    return {
      totalEvents: this.events.length,
      eventTypes,
      recentEvents: this.events.slice(-10),
      sessionInfo: {
        sessionId: this.sessionId,
        userId: this.userId,
        startTime: this.events[0]?.timestamp || Date.now()
      }
    };
  }

  /**
   * Export analytics data
   */
  exportData(): SimpleAnalyticsEvent[] {
    return [...this.events];
  }

  /**
   * Clear analytics data
   */
  clearData(): void {
    this.events = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem('simple_analytics_events');
    }
  }

  /**
   * Enable/disable tracking
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  private persistEvents(): void {
    if (typeof window === 'undefined') return;

    try {
      // Keep only last 1000 events
      const eventsToStore = this.events.slice(-1000);
      localStorage.setItem('simple_analytics_events', JSON.stringify(eventsToStore));
    } catch (error) {
      console.warn('Failed to persist analytics events:', error);
    }
  }
}

// Create singleton instance
export const simpleAnalytics = new SimpleAnalyticsManager();

// Export for use in contexts
export { SimpleAnalyticsManager };
export type { SimpleAnalyticsEvent };