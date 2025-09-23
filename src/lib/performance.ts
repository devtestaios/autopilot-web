import { performance } from 'perf_hooks';

export interface PerformanceMetrics {
  renderTime: number;
  bundleSize: number;
  apiResponseTime: number;
  userInteractionLatency: number;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeWebVitals();
    }
  }

  private initializeWebVitals() {
    // Largest Contentful Paint (LCP)
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.set('LCP', lastEntry.startTime);
      });
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.push(lcpObserver);
      } catch (e) {
        console.warn('LCP observer not supported');
      }
    }

    // First Input Delay (FID)
    if ('PerformanceObserver' in window) {
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          this.metrics.set('FID', entry.processingStart - entry.startTime);
        });
      });
      
      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.push(fidObserver);
      } catch (e) {
        console.warn('FID observer not supported');
      }
    }

    // Cumulative Layout Shift (CLS)
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            this.metrics.set('CLS', clsValue);
          }
        });
      });
      
      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.push(clsObserver);
      } catch (e) {
        console.warn('CLS observer not supported');
      }
    }
  }

  measureRenderTime(componentName: string, fn: () => void): void {
    const start = performance.now();
    fn();
    const end = performance.now();
    this.metrics.set(`render_${componentName}`, end - start);
  }

  measureAPICall(endpoint: string, promise: Promise<any>): Promise<any> {
    const start = performance.now();
    return promise.finally(() => {
      const end = performance.now();
      this.metrics.set(`api_${endpoint}`, end - start);
    });
  }

  measureUserInteraction(action: string, fn: () => void): void {
    const start = performance.now();
    fn();
    const end = performance.now();
    this.metrics.set(`interaction_${action}`, end - start);
  }

  getMetrics(): Map<string, number> {
    return new Map(this.metrics);
  }

  getMetricsByType(type: 'render' | 'api' | 'interaction' | 'vital'): Map<string, number> {
    const filtered = new Map<string, number>();
    
    for (const [key, value] of this.metrics) {
      if (type === 'vital' && ['LCP', 'FID', 'CLS'].includes(key)) {
        filtered.set(key, value);
      } else if (key.startsWith(`${type}_`)) {
        filtered.set(key, value);
      }
    }
    
    return filtered;
  }

  reportPerformanceIssues(): PerformanceIssue[] {
    const issues: PerformanceIssue[] = [];
    
    const lcp = this.metrics.get('LCP');
    if (lcp && lcp > 2500) {
      issues.push({
        type: 'LCP',
        severity: lcp > 4000 ? 'high' : 'medium',
        value: lcp,
        recommendation: 'Optimize image loading and reduce render-blocking resources'
      });
    }
    
    const fid = this.metrics.get('FID');
    if (fid && fid > 100) {
      issues.push({
        type: 'FID',
        severity: fid > 300 ? 'high' : 'medium',
        value: fid,
        recommendation: 'Reduce JavaScript execution time and optimize event handlers'
      });
    }
    
    const cls = this.metrics.get('CLS');
    if (cls && cls > 0.1) {
      issues.push({
        type: 'CLS',
        severity: cls > 0.25 ? 'high' : 'medium',
        value: cls,
        recommendation: 'Ensure images and ads have dimensions and avoid dynamic content insertion'
      });
    }
    
    return issues;
  }

  clearMetrics(): void {
    this.metrics.clear();
  }

  destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }
}

export interface PerformanceIssue {
  type: string;
  severity: 'low' | 'medium' | 'high';
  value: number;
  recommendation: string;
}

// React Hook for performance monitoring
export function usePerformanceMonitor() {
  const monitor = PerformanceMonitor.getInstance();
  
  const measureRender = (componentName: string, fn: () => void) => {
    monitor.measureRenderTime(componentName, fn);
  };
  
  const measureAPI = (endpoint: string, promise: Promise<any>) => {
    return monitor.measureAPICall(endpoint, promise);
  };
  
  const measureInteraction = (action: string, fn: () => void) => {
    monitor.measureUserInteraction(action, fn);
  };
  
  const getMetrics = () => monitor.getMetrics();
  
  const getIssues = () => monitor.reportPerformanceIssues();
  
  return {
    measureRender,
    measureAPI,
    measureInteraction,
    getMetrics,
    getIssues,
  };
}

// Higher-order component for automatic performance measurement
export function withPerformanceMonitoring<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) {
  return function PerformanceMonitoredComponent(props: P) {
    const monitor = PerformanceMonitor.getInstance();
    
    React.useEffect(() => {
      const start = performance.now();
      return () => {
        const end = performance.now();
        monitor.measureRenderTime(componentName, () => {});
        monitor.getMetrics().set(`lifecycle_${componentName}`, end - start);
      };
    }, []);
    
    return React.createElement(WrappedComponent, props);
  };
}

export default PerformanceMonitor;