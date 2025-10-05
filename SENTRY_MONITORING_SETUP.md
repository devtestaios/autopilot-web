// ===============================================
// SENTRY MONITORING SETUP CONFIGURATION
// Production-ready error tracking and performance monitoring
// PulseBridge.ai Enterprise Platform
// ===============================================

// Package installation command:
// npm install @sentry/nextjs @sentry/tracing @sentry/node

// ===============================================
// 1. SENTRY CLIENT CONFIGURATION
// ===============================================

// File: sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Environment configuration
  environment: process.env.NODE_ENV,
  debug: process.env.NODE_ENV === 'development',
  
  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Session replay for debugging
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Integrations
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: [
        'localhost',
        'pulsebridge.ai',
        'autopilot-api-1.onrender.com',
        /^https:\/\/yourapi\.domain\.com\/api/
      ]
    }),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true
    })
  ],
  
  // Release tracking
  release: process.env.NEXT_PUBLIC_APP_VERSION || 'development',
  
  // User context
  beforeSend(event, hint) {
    // Filter out development errors
    if (process.env.NODE_ENV === 'development') {
      console.log('Sentry Event:', event);
    }
    
    // Add custom context
    if (event.user) {
      event.tags = {
        ...event.tags,
        subscription_tier: event.user.subscription_tier,
        company_id: event.user.company_id
      };
    }
    
    return event;
  },
  
  // Error filtering
  beforeSendTransaction(event) {
    // Filter out noisy transactions
    if (event.transaction?.includes('_next/static')) {
      return null;
    }
    return event;
  }
});

// ===============================================
// 2. SENTRY SERVER CONFIGURATION
// ===============================================

// File: sentry.server.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  environment: process.env.NODE_ENV,
  debug: process.env.NODE_ENV === 'development',
  
  // Server-side performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Server integrations
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Postgres(),
    new Sentry.Integrations.Redis()
  ],
  
  release: process.env.NEXT_PUBLIC_APP_VERSION || 'development',
  
  beforeSend(event, hint) {
    // Add server context
    event.tags = {
      ...event.tags,
      server: 'nextjs',
      environment: process.env.NODE_ENV
    };
    
    return event;
  }
});

// ===============================================
// 3. ENHANCED ERROR BOUNDARY WITH SENTRY
// ===============================================

// File: src/components/SentryErrorBoundary.tsx
'use client';

import React from 'react';
import * as Sentry from '@sentry/nextjs';
import { ErrorBoundary as SentryErrorBoundary } from '@sentry/react';
import { AlertCircle, RefreshCw, Bug } from 'lucide-react';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  eventId?: string;
}

function ErrorFallback({ error, resetError, eventId }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 dark:bg-red-900 rounded-full mb-4">
          <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>
        
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">
          Something went wrong
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          We've been notified about this error and will fix it soon.
        </p>
        
        {eventId && (
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Error ID: <code className="font-mono text-xs">{eventId}</code>
            </p>
          </div>
        )}
        
        <div className="flex gap-3">
          <button
            onClick={resetError}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          
          <button
            onClick={() => {
              Sentry.showReportDialog({ eventId });
            }}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Bug className="w-4 h-4" />
            Report
          </button>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4">
            <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
              Error Details (Development)
            </summary>
            <pre className="mt-2 text-xs text-gray-600 bg-gray-100 dark:bg-gray-700 p-2 rounded overflow-auto max-h-32">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

export function SentryErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <SentryErrorBoundary
      fallback={({ error, resetError, eventId }) => (
        <ErrorFallback error={error} resetError={resetError} eventId={eventId} />
      )}
      beforeCapture={(scope, error, errorInfo) => {
        scope.setTag('errorBoundary', 'SentryErrorBoundary');
        scope.setContext('errorInfo', errorInfo);
        scope.setLevel('error');
      }}
    >
      {children}
    </SentryErrorBoundary>
  );
}

// ===============================================
// 4. PERFORMANCE MONITORING UTILITIES
// ===============================================

// File: src/lib/monitoring/sentryUtils.ts
import * as Sentry from '@sentry/nextjs';

export class PerformanceMonitoring {
  
  /**
   * Track custom performance metrics
   */
  static trackPerformance(name: string, value: number, unit: string = 'ms') {
    Sentry.setMeasurement(name, value, unit);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance: ${name} = ${value}${unit}`);
    }
  }
  
  /**
   * Track API response times
   */
  static trackAPICall(endpoint: string, method: string, duration: number, status: number) {
    Sentry.addBreadcrumb({
      category: 'api',
      data: {
        endpoint,
        method,
        duration,
        status
      },
      level: status >= 400 ? 'error' : 'info'
    });
    
    Sentry.setMeasurement(`api.${endpoint}.${method}`, duration, 'ms');
  }
  
  /**
   * Track user interactions
   */
  static trackUserAction(action: string, data?: Record<string, any>) {
    Sentry.addBreadcrumb({
      category: 'user',
      message: action,
      data,
      level: 'info'
    });
  }
  
  /**
   * Track business metrics
   */
  static trackBusinessMetric(metric: string, value: number, tags?: Record<string, string>) {
    Sentry.setMeasurement(metric, value);
    
    if (tags) {
      Object.entries(tags).forEach(([key, value]) => {
        Sentry.setTag(key, value);
      });
    }
  }
}

export class ErrorTracking {
  
  /**
   * Capture custom errors with context
   */
  static captureError(error: Error, context?: Record<string, any>) {
    Sentry.withScope((scope) => {
      if (context) {
        scope.setContext('custom', context);
      }
      Sentry.captureException(error);
    });
  }
  
  /**
   * Track AI-related errors
   */
  static captureAIError(error: Error, aiContext: {
    model?: string;
    endpoint?: string;
    userId?: string;
    subscriptionTier?: string;
    costUSD?: number;
  }) {
    Sentry.withScope((scope) => {
      scope.setTag('category', 'ai_error');
      scope.setContext('ai', aiContext);
      Sentry.captureException(error);
    });
  }
  
  /**
   * Track tenant-related errors
   */
  static captureTenantError(error: Error, tenantContext: {
    tenantId?: string;
    userId?: string;
    operation?: string;
  }) {
    Sentry.withScope((scope) => {
      scope.setTag('category', 'tenant_error');
      scope.setContext('tenant', tenantContext);
      Sentry.captureException(error);
    });
  }
}

// ===============================================
// 5. NEXTJS CONFIGURATION
// ===============================================

// File: next.config.js (addition)
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  // ... existing config
  experimental: {
    instrumentationHook: true
  }
};

// Sentry webpack plugin configuration
const sentryWebpackPluginOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  
  // Upload source maps for better error tracking
  widenClientFileUpload: true,
  
  // Automatically tree-shake Sentry logger statements
  disableLogger: true,
  
  // Don't upload source maps in development
  dryRun: process.env.NODE_ENV === 'development',
  
  silent: true
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);

// ===============================================
// 6. ENVIRONMENT VARIABLES
// ===============================================

/*
Add to .env.local:

# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
SENTRY_AUTH_TOKEN=your-auth-token
NEXT_PUBLIC_APP_VERSION=1.0.0

Add to .env.production:
# Same variables for production
*/

// ===============================================
// 7. API ROUTE MONITORING
// ===============================================

// File: src/lib/monitoring/apiMonitoring.ts
import * as Sentry from '@sentry/nextjs';
import { NextRequest, NextResponse } from 'next/server';

export function withSentryMonitoring(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    const start = Date.now();
    const url = new URL(request.url);
    
    return Sentry.withScope(async (scope) => {
      scope.setTag('api.route', url.pathname);
      scope.setTag('api.method', request.method);
      
      try {
        const response = await handler(request, ...args);
        const duration = Date.now() - start;
        
        // Track successful API calls
        PerformanceMonitoring.trackAPICall(
          url.pathname,
          request.method || 'GET',
          duration,
          response.status || 200
        );
        
        return response;
        
      } catch (error) {
        const duration = Date.now() - start;
        
        // Track failed API calls
        PerformanceMonitoring.trackAPICall(
          url.pathname,
          request.method || 'GET',
          duration,
          500
        );
        
        // Capture the error
        Sentry.captureException(error);
        
        return NextResponse.json(
          { error: 'Internal Server Error' },
          { status: 500 }
        );
      }
    });
  };
}

// ===============================================
// 8. USAGE EXAMPLE
// ===============================================

// File: src/app/api/example/route.ts
import { withSentryMonitoring } from '@/lib/monitoring/apiMonitoring';

async function handler(request: NextRequest) {
  // Your API logic here
  return NextResponse.json({ success: true });
}

export const GET = withSentryMonitoring(handler);
export const POST = withSentryMonitoring(handler);

// ===============================================
// 9. CLIENT PROVIDER INTEGRATION
// ===============================================

// Update src/components/ClientProviders.tsx
import { SentryErrorBoundary } from '@/components/SentryErrorBoundary';

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <SentryErrorBoundary>
      <ErrorProvider>
        <ThemeProvider>
          {/* ... rest of providers */}
          {children}
        </ThemeProvider>
      </ErrorProvider>
    </SentryErrorBoundary>
  );
}

// ===============================================
// 10. DEPLOYMENT CHECKLIST
// ===============================================

/*
Production Deployment Steps:

1. Create Sentry account and project
2. Add environment variables to Vercel/hosting platform
3. Install packages: npm install @sentry/nextjs @sentry/tracing
4. Update next.config.js with Sentry configuration
5. Add sentry.client.config.ts and sentry.server.config.ts
6. Update ClientProviders with SentryErrorBoundary
7. Deploy and verify error tracking in Sentry dashboard

Estimated Setup Time: 2-3 hours
Monthly Cost: $120-240 (depending on error volume)
*/