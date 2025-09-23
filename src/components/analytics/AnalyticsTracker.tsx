'use client';

import { useEffect, ComponentType } from 'react';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface AnalyticsTrackerProps {
  event: string;
  category: string;
  action: string;
  label?: string;
  properties?: Record<string, any>;
  trigger?: 'mount' | 'view' | 'click' | 'hover';
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onHover?: () => void;
}

export function AnalyticsTracker({
  event,
  category,
  action,
  label,
  properties,
  trigger = 'mount',
  children,
  className,
  onClick,
  onHover
}: AnalyticsTrackerProps) {
  const { trackEvent } = useAnalytics();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });

  const handleTrack = () => {
    trackEvent({
      event,
      category,
      action,
      label,
      properties
    });
  };

  useEffect(() => {
    if (trigger === 'mount') {
      handleTrack();
    }
  }, []);

  useEffect(() => {
    if (trigger === 'view' && isInView) {
      handleTrack();
    }
  }, [isInView]);

  const handleClick = () => {
    if (trigger === 'click') {
      handleTrack();
    }
    onClick?.();
  };

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      handleTrack();
    }
    onHover?.();
  };

  if (trigger === 'view') {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  if (trigger === 'click' || trigger === 'hover') {
    return (
      <div
        className={className}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
      >
        {children}
      </div>
    );
  }

  return <div className={className}>{children}</div>;
}

// Higher-order component for automatic analytics tracking
export function withAnalytics<P extends object>(
  WrappedComponent: ComponentType<P>,
  config: {
    event: string;
    category: string;
    action: string;
    trigger?: 'mount' | 'view' | 'click';
    getProperties?: (props: P) => Record<string, any>;
  }
) {
  return function AnalyticsWrappedComponent(props: P) {
    const { trackEvent } = useAnalytics();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    const handleTrack = () => {
      const properties = config.getProperties ? config.getProperties(props) : {};
      trackEvent({
        event: config.event,
        category: config.category,
        action: config.action,
        properties
      });
    };

    useEffect(() => {
      if (config.trigger === 'mount') {
        handleTrack();
      }
    }, []);

    useEffect(() => {
      if (config.trigger === 'view' && isInView) {
        handleTrack();
      }
    }, [isInView]);

    if (config.trigger === 'view') {
      return (
        <div ref={ref}>
          <WrappedComponent {...props} />
        </div>
      );
    }

    if (config.trigger === 'click') {
      return (
        <div onClick={handleTrack}>
          <WrappedComponent {...props} />
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}

// Performance tracking hook
export function usePerformanceTracking() {
  const { trackPerformance } = useAnalytics();

  useEffect(() => {
    // Track page load performance
    const trackPageLoad = () => {
      if (typeof window !== 'undefined' && window.performance) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          trackPerformance('page_load_time', navigation.loadEventEnd - navigation.fetchStart, {
            dns_time: navigation.domainLookupEnd - navigation.domainLookupStart,
            connect_time: navigation.connectEnd - navigation.connectStart,
            response_time: navigation.responseEnd - navigation.responseStart,
            dom_ready_time: navigation.domContentLoadedEventEnd - navigation.fetchStart,
            load_complete_time: navigation.loadEventEnd - navigation.fetchStart
          });
        }
      }
    };

    // Track Core Web Vitals
    const trackWebVitals = () => {
      if (typeof window !== 'undefined') {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          trackPerformance('lcp', lastEntry.startTime, {
            element: (lastEntry as any).element?.tagName
          });
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            trackPerformance('fid', (entry as any).processingStart - entry.startTime, {
              input_type: (entry as any).name
            });
          }
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
              trackPerformance('cls', clsValue);
            }
          }
        }).observe({ entryTypes: ['layout-shift'] });
      }
    };

    // Track after a short delay to ensure page is loaded
    setTimeout(() => {
      trackPageLoad();
      trackWebVitals();
    }, 100);

  }, [trackPerformance]);
}

// Scroll depth tracking hook
export function useScrollTracking() {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    const scrollThresholds = [25, 50, 75, 90, 100];
    const tracked = new Set();

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      scrollThresholds.forEach(threshold => {
        if (scrollPercent >= threshold && !tracked.has(threshold)) {
          tracked.add(threshold);
          trackEvent({
            event: 'scroll_depth',
            category: 'engagement',
            action: 'scroll',
            label: `${threshold}%`,
            value: threshold,
            properties: {
              scroll_depth: threshold,
              page_height: document.documentElement.scrollHeight,
              viewport_height: window.innerHeight
            }
          });
        }
      });
    };

    const throttledScroll = throttle(handleScroll, 500);
    window.addEventListener('scroll', throttledScroll);
    
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [trackEvent]);
}

// Form tracking hook
export function useFormTracking(formId: string) {
  const { trackEvent } = useAnalytics();

  const trackFormStart = () => {
    trackEvent({
      event: 'form_start',
      category: 'form',
      action: 'start',
      label: formId,
      properties: { form_id: formId }
    });
  };

  const trackFormSubmit = (success: boolean, data?: Record<string, any>) => {
    trackEvent({
      event: 'form_submit',
      category: 'form',
      action: success ? 'submit_success' : 'submit_error',
      label: formId,
      properties: {
        form_id: formId,
        success,
        ...data
      }
    });
  };

  const trackFieldInteraction = (fieldName: string) => {
    trackEvent({
      event: 'form_field_interaction',
      category: 'form',
      action: 'field_focus',
      label: fieldName,
      properties: {
        form_id: formId,
        field_name: fieldName
      }
    });
  };

  return {
    trackFormStart,
    trackFormSubmit,
    trackFieldInteraction
  };
}

// Utility function for throttling
function throttle(func: Function, limit: number) {
  let inThrottle: boolean;
  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}