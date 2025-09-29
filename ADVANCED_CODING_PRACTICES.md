# Advanced Coding Practices & Guidelines

*Comprehensive reference for AI systems and developers working with cutting-edge technologies*

## Table of Contents

1. [React Key Management & Error Prevention](#react-key-management--error-prevention)
2. [Hydration Safety Protocols](#hydration-safety-protocols)
3. [Context Provider Best Practices](#context-provider-best-practices)
4. [Advanced Error Boundaries](#advanced-error-boundaries)
5. [Performance Optimization Patterns](#performance-optimization-patterns)

---

## React Key Management & Error Prevention

### Critical Rules for React Keys

#### Unique Key Generation
```typescript
// ❌ WRONG: Can cause duplicate key errors
const items = data.map(item => (
  <div key={item.type}>{item.content}</div>
))

// ✅ CORRECT: Always ensure unique keys
const items = data.map((item, index) => (
  <div key={`${item.type}-${item.id || index}`}>{item.content}</div>
))

// ✅ BEST: Use dedicated key generation function
function generateUniqueKey(prefix: string, item: any, index: number): string {
  return `${prefix}-${item.id || item.name || index}-${Date.now()}`
}

const items = data.map((item, index) => (
  <div key={generateUniqueKey('platform', item, index)}>
    {item.content}
  </div>
))
```

#### Platform Registry Key Management
```typescript
// Advanced key generation for complex data structures
interface PlatformConfig {
  id: string
  name: string
  category: string
  subcategory?: string
}

function createPlatformKey(platform: PlatformConfig): string {
  const parts = [
    platform.category,
    platform.subcategory || 'default',
    platform.id,
    platform.name.toLowerCase().replace(/\s+/g, '-')
  ]
  return parts.join('-')
}

// Example: "marketing-automation-social-media-advanced-social-media-management"
```

### Debugging Duplicate Keys
```typescript
// Key uniqueness validator
function validateUniqueKeys<T>(items: T[], keyExtractor: (item: T, index: number) => string): void {
  if (process.env.NODE_ENV !== 'production') {
    const keys = items.map(keyExtractor)
    const duplicates = keys.filter((key, index) => keys.indexOf(key) !== index)
    
    if (duplicates.length > 0) {
      console.error('Duplicate keys detected:', duplicates)
      console.error('All keys:', keys)
      throw new Error(`Duplicate React keys found: ${duplicates.join(', ')}`)
    }
  }
}

// Usage in components
function PlatformList({ platforms }: { platforms: PlatformConfig[] }) {
  const keyExtractor = useCallback((platform: PlatformConfig, index: number) => 
    createPlatformKey(platform), [])
  
  // Validate keys in development
  validateUniqueKeys(platforms, keyExtractor)
  
  return (
    <div>
      {platforms.map((platform, index) => (
        <PlatformCard 
          key={keyExtractor(platform, index)}
          platform={platform} 
        />
      ))}
    </div>
  )
}
```

---

## Hydration Safety Protocols

### SSR-Safe Component Patterns
```typescript
// ❌ WRONG: Can cause hydration mismatches
function ProblematicComponent() {
  const [count, setCount] = useState(Math.random()) // Different on server/client
  const [time, setTime] = useState(Date.now()) // Different on server/client
  
  return <div>{count} - {time}</div>
}

// ✅ CORRECT: SSR-safe patterns
function SafeComponent() {
  const [mounted, setMounted] = useState(false)
  const [count, setCount] = useState(0) // Consistent initial value
  
  useEffect(() => {
    setMounted(true)
    setCount(Math.random()) // Set dynamic value after mounting
  }, [])
  
  if (!mounted) {
    return <div>Loading...</div> // Consistent server/client render
  }
  
  return <div>{count}</div>
}

// ✅ BEST: Use suppressHydrationWarning for known mismatches
function ComponentWithClientOnlyContent() {
  const [clientTime, setClientTime] = useState<string>()
  
  useEffect(() => {
    setClientTime(new Date().toLocaleString())
  }, [])
  
  return (
    <div>
      <span>Server-rendered content</span>
      <span suppressHydrationWarning>
        {clientTime || 'Loading time...'}
      </span>
    </div>
  )
}
```

### Dynamic Import Patterns
```typescript
// ✅ CORRECT: Dynamic imports for client-only components
import dynamic from 'next/dynamic'

const ClientOnlyComponent = dynamic(
  () => import('./ClientOnlyComponent'),
  { 
    ssr: false,
    loading: () => <div className="animate-pulse">Loading...</div>
  }
)

// ✅ ADVANCED: Conditional dynamic imports
const ConditionalComponent = dynamic(
  () => import('./ConditionalComponent'),
  {
    ssr: false,
    loading: () => <ComponentSkeleton />
  }
)

function ParentComponent({ showAdvanced }: { showAdvanced: boolean }) {
  return (
    <div>
      <StaticContent />
      {showAdvanced && <ConditionalComponent />}
    </div>
  )
}
```

---

## Context Provider Best Practices

### Proper Cleanup Patterns
```typescript
// ✅ CORRECT: Proper subscription cleanup
function useWebSocketSubscription(url: string) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const wsRef = useRef<WebSocket | null>(null)
  const cleanupRef = useRef<(() => void) | null>(null)
  
  const subscribe = useCallback(() => {
    // Cleanup previous subscription
    cleanupRef.current?.()
    
    const ws = new WebSocket(url)
    wsRef.current = ws
    
    ws.onmessage = (event) => {
      setData(JSON.parse(event.data))
    }
    
    ws.onerror = (error) => {
      setError(error)
    }
    
    // Return cleanup function
    const cleanup = () => {
      ws.close()
      wsRef.current = null
    }
    
    cleanupRef.current = cleanup
    return cleanup
  }, [url])
  
  useEffect(() => {
    const unsubscribe = subscribe()
    return unsubscribe // This will be called on unmount
  }, [subscribe])
  
  const manualUnsubscribe = useCallback(() => {
    cleanupRef.current?.()
    cleanupRef.current = null
  }, [])
  
  return { data, error, subscribe, unsubscribe: manualUnsubscribe }
}
```

### Context Provider Error Handling
```typescript
// ✅ CORRECT: Robust context provider
interface ContextState {
  data: any[]
  loading: boolean
  error: string | null
}

function createSafeContext<T>(name: string, initialState: T) {
  const Context = createContext<T | undefined>(undefined)
  
  function Provider({ children, ...props }: { children: React.ReactNode } & Partial<T>) {
    const [state, setState] = useState<T>({ ...initialState, ...props })
    const subscriptionRef = useRef<(() => void) | null>(null)
    const isMountedRef = useRef(true)
    
    // Safe state updater that checks if component is mounted
    const safeSetState = useCallback((updater: Partial<T> | ((prev: T) => T)) => {
      if (isMountedRef.current) {
        setState(prev => 
          typeof updater === 'function' ? updater(prev) : { ...prev, ...updater }
        )
      }
    }, [])
    
    // Subscription management
    const subscribeToUpdates = useCallback(() => {
      // Cleanup existing subscription
      subscriptionRef.current?.()
      
      // Create new subscription (example)
      const unsubscribe = () => {
        // Cleanup logic here
        console.log(`${name} context: subscription cleaned up`)
      }
      
      subscriptionRef.current = unsubscribe
      return unsubscribe
    }, [name])
    
    useEffect(() => {
      isMountedRef.current = true
      const unsubscribe = subscribeToUpdates()
      
      return () => {
        isMountedRef.current = false
        unsubscribe?.()
      }
    }, [subscribeToUpdates])
    
    const contextValue = useMemo(() => ({
      ...state,
      safeSetState,
      subscribeToUpdates
    }), [state, safeSetState, subscribeToUpdates])
    
    return (
      <Context.Provider value={contextValue}>
        {children}
      </Context.Provider>
    )
  }
  
  function useContext() {
    const context = React.useContext(Context)
    if (context === undefined) {
      throw new Error(`use${name} must be used within a ${name}Provider`)
    }
    return context
  }
  
  return { Provider, useContext }
}
```

---

## Advanced Error Boundaries

### Comprehensive Error Boundary Implementation
```typescript
// ✅ ADVANCED: Production-ready error boundary
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
  eventId: string | null
}

class AdvancedErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<any> },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null
    }
  }
  
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    }
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Log to external service (Sentry, LogRocket, etc.)
    const eventId = this.logErrorToService(error, errorInfo)
    
    this.setState({
      error,
      errorInfo,
      eventId
    })
  }
  
  private logErrorToService(error: Error, errorInfo: React.ErrorInfo): string {
    // Mock implementation - replace with real service
    const eventId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Example: Sentry.captureException(error, { extra: errorInfo })
    console.error('Logged error with ID:', eventId, { error, errorInfo })
    
    return eventId
  }
  
  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null
    })
  }
  
  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback
      
      if (FallbackComponent) {
        return <FallbackComponent {...this.state} onRetry={this.handleRetry} />
      }
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                Something went wrong
              </h3>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              An unexpected error occurred. Our team has been notified.
            </p>
            
            {this.state.eventId && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Error ID: {this.state.eventId}
              </p>
            )}
            
            <div className="flex space-x-3">
              <button
                onClick={this.handleRetry}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Try Again
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Go Home
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 text-xs">
                <summary className="cursor-pointer text-gray-600 dark:text-gray-400">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 text-red-600 dark:text-red-400 overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }
    
    return this.props.children
  }
}

// Hook-based error boundary for function components
function useErrorHandler() {
  return useCallback((error: Error, errorInfo?: any) => {
    console.error('useErrorHandler:', error, errorInfo)
    
    // Log to service
    // Example: Sentry.captureException(error, { extra: errorInfo })
    
    // You can also trigger a global error state update here
  }, [])
}
```

---

## Performance Optimization Patterns

### Advanced React Optimization
```typescript
// ✅ ADVANCED: Comprehensive optimization patterns
import { memo, useMemo, useCallback, useRef, startTransition } from 'react'

interface OptimizedComponentProps {
  items: Array<{ id: string; name: string; data: unknown }>
  onItemClick: (id: string) => void
  filters: Record<string, unknown>
}

const OptimizedComponent = memo(({ items, onItemClick, filters }: OptimizedComponentProps) => {
  // Memoize expensive computations
  const processedItems = useMemo(() => {
    console.log('Processing items...') // This should only log when items or filters change
    
    return items
      .filter(item => {
        // Apply filters
        return Object.entries(filters).every(([key, value]) => {
          return !value || item.data[key] === value
        })
      })
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [items, filters])
  
  // Memoize callbacks to prevent child re-renders
  const handleItemClick = useCallback((id: string) => {
    startTransition(() => {
      onItemClick(id)
    })
  }, [onItemClick])
  
  // Use refs for values that don't affect rendering
  const renderCountRef = useRef(0)
  renderCountRef.current++
  
  return (
    <div data-render-count={renderCountRef.current}>
      {processedItems.map((item) => (
        <OptimizedItem
          key={item.id}
          item={item}
          onClick={handleItemClick}
        />
      ))}
    </div>
  )
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  return (
    prevProps.items === nextProps.items &&
    prevProps.onItemClick === nextProps.onItemClick &&
    JSON.stringify(prevProps.filters) === JSON.stringify(nextProps.filters)
  )
})

// Child component optimization
const OptimizedItem = memo(({ 
  item, 
  onClick 
}: { 
  item: { id: string; name: string }; 
  onClick: (id: string) => void 
}) => {
  const handleClick = useCallback(() => {
    onClick(item.id)
  }, [item.id, onClick])
  
  return (
    <div onClick={handleClick} className="cursor-pointer hover:bg-gray-100">
      {item.name}
    </div>
  )
})
```

---

## Implementation Guidelines

### Project Integration Rules

1. **Always validate React keys** in development mode
2. **Use dynamic imports** for client-only components  
3. **Implement proper cleanup** in context providers
4. **Add error boundaries** at route and component levels
5. **Memoize expensive computations** and callbacks
6. **Test hydration safety** on server and client
7. **Monitor performance** with React DevTools Profiler

### Error Prevention Checklist

- [ ] Unique keys for all mapped components
- [ ] SSR-safe initial state values
- [ ] Proper cleanup in useEffect hooks
- [ ] Error boundaries for critical sections
- [ ] Performance profiling for heavy components
- [ ] Accessibility testing with screen readers
- [ ] Cross-browser compatibility testing

---

*This document should be referenced for all React development patterns and error prevention strategies.*