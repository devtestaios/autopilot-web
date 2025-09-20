/**
 * =====================================================================================
 * ENHANCED UI SHOWCASE COMPONENT
 * =====================================================================================
 * Purpose: Comprehensive demonstration of all enhanced UI components and animations
 * Features: Interactive examples, loading states, micro-interactions, and design system
 * Created: September 2025
 * =====================================================================================
 */

'use client'

import * as React from "react"
import { useState, useEffect } from "react"
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  MetricCard,
  FeatureCard,
  StatusCard 
} from "@/components/ui/enhanced-card"
import { 
  Badge, 
  StatusBadge, 
  MetricBadge, 
  NotificationBadge, 
  TagBadge, 
  BadgeGroup 
} from "@/components/ui/enhanced-badge"
import { 
  LoadingSpinner,
  LoadingDots,
  LoadingPulse,
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonTable,
  ProgressBar,
  LoadingOverlay,
  LoadingButton
} from "@/components/ui/loading-states"

// Mock data for demonstrations
const mockMetrics = [
  { title: "Total Revenue", value: "$124,352", change: { value: 12.5, type: "increase" as const } },
  { title: "Active Campaigns", value: "23", change: { value: 8.2, type: "increase" as const } },
  { title: "Average CTR", value: "3.42%", change: { value: 2.1, type: "decrease" as const } },
  { title: "Conversion Rate", value: "4.8%", change: { value: 0.5, type: "neutral" as const } },
]

const mockFeatures = [
  {
    title: "AI Optimization",
    description: "Automatically optimize campaigns using machine learning algorithms for better performance.",
    badge: "New",
    icon: "🧠"
  },
  {
    title: "Real-time Analytics",
    description: "Monitor campaign performance with live data updates and interactive visualizations.",
    badge: "Popular",
    icon: "📊"
  },
  {
    title: "Smart Alerts",
    description: "Get notified when campaigns need attention or optimization opportunities arise.",
    badge: "Premium",
    icon: "🔔"
  }
]

const mockTags = ["React", "TypeScript", "Tailwind", "Next.js", "AI", "Analytics"]

export default function EnhancedUIShowcase() {
  // State management for interactive examples
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [selectedTags, setSelectedTags] = useState<string[]>(["React", "TypeScript"])
  const [notificationCount, setNotificationCount] = useState(5)
  const [showSkeletons, setShowSkeletons] = useState(false)

  // Progress simulation
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            setIsLoading(false)
            return 0
          }
          return prev + 10
        })
      }, 200)
      return () => clearInterval(interval)
    }
  }, [isLoading])

  // Auto-increment notification demo
  useEffect(() => {
    const interval = setInterval(() => {
      setNotificationCount(prev => (prev + 1) % 100)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const startLoading = () => {
    setIsLoading(true)
    setLoadingProgress(0)
  }

  const toggleSkeletons = () => {
    setShowSkeletons(!showSkeletons)
  }

  return (
    <div className="min-h-screen bg-background p-6 space-y-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <Card variant="premium" animation="fade" className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-pulse-blue to-bridge-purple bg-clip-text text-transparent">
              Enhanced UI Component Showcase
            </CardTitle>
            <CardDescription className="text-lg">
              Comprehensive demonstration of PulseBridge.ai's premium design system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BadgeGroup spacing="normal">
              <Badge variant="premium" size="lg">Design System 2.0</Badge>
              <Badge variant="success">Production Ready</Badge>
              <Badge variant="info">Interactive Demo</Badge>
            </BadgeGroup>
          </CardContent>
        </Card>

        {/* Metrics Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Metric Cards with Animations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {mockMetrics.map((metric, index) => (
              <div
                key={metric.title}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <MetricCard
                  title={metric.title}
                  value={metric.value}
                  change={metric.change}
                  icon={<span className="text-2xl">📈</span>}
                  interactive="hover"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Loading States Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Loading States & Progress</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card variant="elevated" interactive="hover">
              <CardHeader>
                <CardTitle>Loading Components</CardTitle>
                <CardDescription>Various loading indicators and spinners</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <LoadingSpinner size="sm" />
                  <LoadingSpinner size="default" />
                  <LoadingSpinner size="lg" />
                  <LoadingSpinner size="xl" />
                </div>
                
                <div className="flex items-center gap-4">
                  <LoadingDots size="sm" />
                  <LoadingDots size="default" />
                  <LoadingDots size="lg" />
                </div>
                
                <div className="space-y-2">
                  <ProgressBar value={loadingProgress} showLabel />
                  <ProgressBar indeterminate variant="success" />
                </div>
              </CardContent>
              <CardFooter>
                <LoadingButton
                  loading={isLoading}
                  loadingText="Processing..."
                  onClick={startLoading}
                  className="btn-primary"
                >
                  Start Loading Demo
                </LoadingButton>
              </CardFooter>
            </Card>

            <Card variant="glass" interactive="lift">
              <CardHeader>
                <CardTitle>Skeleton Loading</CardTitle>
                <CardDescription>Skeleton screens for better perceived performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton loading={showSkeletons} variant="text">
                  <p className="text-foreground">This is the actual content that loads after skeleton</p>
                </Skeleton>
                
                <SkeletonText lines={3} className={showSkeletons ? "block" : "hidden"} />
                
                {!showSkeletons && (
                  <div className="space-y-2">
                    <p className="text-foreground">Real content loaded successfully!</p>
                    <p className="text-muted-foreground">Toggle skeletons to see loading states</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <button
                  onClick={toggleSkeletons}
                  className="btn-outline active-press"
                >
                  Toggle Skeletons
                </button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Badge Showcase */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Badge Variations</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card interactive="hover" animation="scale">
              <CardHeader>
                <CardTitle>Status & Metric Badges</CardTitle>
                <CardDescription>Dynamic badges with real-time updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Status Badges:</p>
                  <BadgeGroup>
                    <StatusBadge status="active" />
                    <StatusBadge status="pending" />
                    <StatusBadge status="error" />
                    <StatusBadge status="success" />
                  </BadgeGroup>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Metric Badges:</p>
                  <BadgeGroup>
                    <MetricBadge value={24.5} type="percentage" trend="up" />
                    <MetricBadge value={1250} type="currency" trend="down" />
                    <MetricBadge value={15000} type="number" trend="neutral" />
                  </BadgeGroup>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Notification Badge (auto-updating):</p>
                  <div className="relative inline-block">
                    <button className="btn-outline">
                      Notifications
                    </button>
                    <NotificationBadge 
                      count={notificationCount} 
                      className="absolute -top-2 -right-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card interactive="lift" animation="slide">
              <CardHeader>
                <CardTitle>Interactive Tag Badges</CardTitle>
                <CardDescription>Clickable tags with selection state</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Technology Tags:</p>
                  <BadgeGroup wrap>
                    {mockTags.map(tag => (
                      <TagBadge
                        key={tag}
                        selected={selectedTags.includes(tag)}
                        onToggle={() => handleTagToggle(tag)}
                        className="animate-scale-bounce"
                      >
                        {tag}
                      </TagBadge>
                    ))}
                  </BadgeGroup>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Selected Technologies:</p>
                  <p className="text-muted-foreground">
                    {selectedTags.length > 0 ? selectedTags.join(", ") : "None selected"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Feature Cards Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Feature Cards with Interactions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockFeatures.map((feature, index) => (
              <div
                key={feature.title}
                className="animate-fade-in-up hover-lift"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <FeatureCard
                  title={feature.title}
                  description={feature.description}
                  badge={feature.badge}
                  icon={<span className="text-xl">{feature.icon}</span>}
                  action={
                    <button className="btn-outline hover-glow active-press">
                      Learn More
                    </button>
                  }
                />
              </div>
            ))}
          </div>
        </section>

        {/* Status Cards Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Status & Alert Cards</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StatusCard
              status="success"
              title="Campaign Deployed Successfully"
              message="Your AI optimization campaign is now live and performing well. Monitor progress in real-time."
              action={
                <button className="btn-success">
                  View Campaign
                </button>
              }
              animation="fade"
            />
            
            <StatusCard
              status="warning"
              title="Budget Threshold Reached"
              message="Your campaign has reached 80% of its daily budget. Consider increasing limits or pausing lower-performing ads."
              action={
                <button className="btn-warning">
                  Adjust Budget
                </button>
              }
              animation="fade"
            />
          </div>
        </section>

        {/* Loading Overlay Demo */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Loading Overlay Example</h2>
          <LoadingOverlay
            loading={isLoading}
            text="Processing your campaign optimization..."
          >
            <Card variant="outlined" className="h-64">
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold">Campaign Dashboard</h3>
                  <p className="text-muted-foreground">
                    This content would be overlaid with loading state when processing
                  </p>
                </div>
              </CardContent>
            </Card>
          </LoadingOverlay>
        </section>

        {/* Animation Examples */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Animation & Hover Effects</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="hover-lift transition-base" interactive="hover">
              <CardContent className="text-center p-6">
                <p className="font-medium">Hover Lift</p>
              </CardContent>
            </Card>
            
            <Card className="hover-scale transition-base" interactive="hover">
              <CardContent className="text-center p-6">
                <p className="font-medium">Hover Scale</p>
              </CardContent>
            </Card>
            
            <Card className="hover-glow transition-base" interactive="hover">
              <CardContent className="text-center p-6">
                <p className="font-medium">Hover Glow</p>
              </CardContent>
            </Card>
            
            <Card className="animate-pulse-gentle" interactive="hover">
              <CardContent className="text-center p-6">
                <p className="font-medium">Pulse Animation</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <Card variant="ghost" className="text-center">
          <CardContent className="py-8">
            <h3 className="text-xl font-semibold mb-2">Enhanced UI System Complete</h3>
            <p className="text-muted-foreground mb-4">
              All components include comprehensive accessibility, animations, and responsive design
            </p>
            <BadgeGroup>
              <Badge variant="success">WCAG AA Compliant</Badge>
              <Badge variant="info">Mobile Optimized</Badge>
              <Badge variant="premium">Production Ready</Badge>
            </BadgeGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/* CSS Classes for styling (add to globals.css) */
/* 
.btn-primary {
  @apply bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all;
}

.btn-outline {
  @apply border border-border bg-background text-foreground px-4 py-2 rounded-lg font-medium hover:bg-muted transition-all;
}

.btn-success {
  @apply bg-success text-success-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all;
}

.btn-warning {
  @apply bg-warning text-warning-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-all;
}
*/