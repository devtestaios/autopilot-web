/**
 * =====================================================================================
 * ENHANCED CARD COMPONENT
 * =====================================================================================
 * Purpose: Premium card component with enhanced variants, animations, and interactions
 * Features: Multiple variants, hover effects, loading states, and interactive elements
 * Created: September 2025
 * =====================================================================================
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const cardVariants = cva(
  "relative overflow-hidden rounded-lg border bg-card text-card-foreground transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-card-border shadow-card",
        elevated: "border-card-border shadow-card-hover",
        outlined: "border-2 border-border shadow-none",
        ghost: "border-transparent shadow-none bg-transparent",
        premium: "border-gradient shadow-card-hover bg-gradient-to-br from-card to-card/50",
        glass: "glass-morphism border-white/20 shadow-lg",
        success: "border-success/20 bg-success-subtle shadow-card",
        warning: "border-warning/20 bg-warning-subtle shadow-card",
        error: "border-error/20 bg-error-subtle shadow-card",
      },
      size: {
        sm: "p-3",
        default: "p-4",
        lg: "p-6",
        xl: "p-8",
      },
      interactive: {
        none: "",
        hover: "hover:shadow-card-hover hover:scale-[1.02] cursor-pointer",
        press: "hover:shadow-card-hover hover:scale-[1.02] active:scale-[0.98] cursor-pointer",
        lift: "hover:shadow-card-active hover:-translate-y-1 cursor-pointer",
      },
      animation: {
        none: "",
        fade: "animate-fade-in",
        slideUp: "animate-slide-up",
        slideDown: "animate-slide-down",
        scale: "animate-scale-in",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      interactive: "none",
      animation: "none",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  loading?: boolean
  disabled?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, interactive, animation, loading, disabled, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        cardVariants({ variant, size, interactive, animation }),
        loading && "opacity-60 pointer-events-none",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 bg-background/20 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
        </div>
      )}
      {children}
    </div>
  )
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight text-title-2", className)}
    {...props}
  >
    {children}
  </h3>
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-body-2 text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-body-1", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

/**
 * =====================================================================================
 * SPECIALIZED CARD COMPONENTS
 * ===================================================================================== */

interface MetricCardProps extends CardProps {
  title: string
  value: string | number
  change?: {
    value: number
    type: "increase" | "decrease" | "neutral"
  }
  icon?: React.ReactNode
  description?: string
}

const MetricCard = React.forwardRef<HTMLDivElement, MetricCardProps>(
  ({ title, value, change, icon, description, className, ...props }, ref) => {
    const changeColor = change?.type === "increase" ? "text-success" : 
                       change?.type === "decrease" ? "text-error" : "text-muted-foreground"
    
    return (
      <Card
        ref={ref}
        variant="elevated"
        interactive="hover"
        className={cn("relative", className)}
        {...props}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-caption text-muted-foreground mb-2">{title}</p>
              <p className="text-headline-1 font-bold">{value}</p>
              {change && (
                <p className={cn("text-body-2 mt-1", changeColor)}>
                  {change.type === "increase" ? "↗" : change.type === "decrease" ? "↘" : "→"} 
                  {Math.abs(change.value)}%
                </p>
              )}
              {description && (
                <p className="text-body-2 text-muted-foreground mt-2">{description}</p>
              )}
            </div>
            {icon && (
              <div className="text-primary opacity-80">
                {icon}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }
)
MetricCard.displayName = "MetricCard"

interface FeatureCardProps extends CardProps {
  title: string
  description: string
  icon?: React.ReactNode
  badge?: string
  action?: React.ReactNode
}

const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ title, description, icon, badge, action, className, ...props }, ref) => (
    <Card
      ref={ref}
      variant="default"
      interactive="lift"
      className={cn("h-full", className)}
      {...props}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {icon}
              </div>
            )}
            <div>
              <CardTitle className="flex items-center gap-2">
                {title}
                {badge && (
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {badge}
                  </span>
                )}
              </CardTitle>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-foreground-muted leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
      {action && (
        <CardFooter>
          {action}
        </CardFooter>
      )}
    </Card>
  )
)
FeatureCard.displayName = "FeatureCard"

interface StatusCardProps extends CardProps {
  status: "success" | "warning" | "error" | "info"
  title: string
  message: string
  action?: React.ReactNode
}

const StatusCard = React.forwardRef<HTMLDivElement, StatusCardProps>(
  ({ status, title, message, action, className, ...props }, ref) => {
    const statusConfig = {
      success: { variant: "success" as const, icon: "✓" },
      warning: { variant: "warning" as const, icon: "⚠" },
      error: { variant: "error" as const, icon: "✕" },
      info: { variant: "default" as const, icon: "ℹ" },
    }
    
    const config = statusConfig[status]
    
    return (
      <Card
        ref={ref}
        variant={config.variant}
        className={cn("border-l-4", className)}
        {...props}
      >
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <span className="text-lg font-bold">{config.icon}</span>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground mb-1">{title}</h4>
              <p className="text-body-2 text-foreground-muted">{message}</p>
              {action && <div className="mt-3">{action}</div>}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }
)
StatusCard.displayName = "StatusCard"

export { MetricCard, FeatureCard, StatusCard }

/**
 * =====================================================================================
 * USAGE EXAMPLES
 * =====================================================================================
 *
 * // Basic card
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Card description</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Card content goes here</p>
 *   </CardContent>
 * </Card>
 *
 * // Interactive premium card
 * <Card variant="premium" interactive="lift" animation="slideUp">
 *   <CardContent>Premium content</CardContent>
 * </Card>
 *
 * // Metric card
 * <MetricCard
 *   title="Total Revenue"
 *   value="$124,352"
 *   change={{ value: 12.5, type: "increase" }}
 *   icon={<DollarSign className="h-6 w-6" />}
 * />
 *
 * // Feature card
 * <FeatureCard
 *   title="AI Optimization"
 *   description="Automatically optimize your campaigns using machine learning"
 *   icon={<Brain className="h-5 w-5" />}
 *   badge="New"
 *   action={<Button>Learn More</Button>}
 * />
 *
 * // Status card
 * <StatusCard
 *   status="success"
 *   title="Campaign Deployed"
 *   message="Your campaign has been successfully deployed and is now live"
 *   action={<Button variant="outline">View Campaign</Button>}
 * />
 *
 * =====================================================================================
 */