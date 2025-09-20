/**
 * =====================================================================================
 * ENHANCED BADGE COMPONENT
 * =====================================================================================
 * Purpose: Premium badge component with multiple variants, sizes, and interactive states
 * Features: Status indicators, interactive badges, loading states, and animations
 * Created: September 2025
 * =====================================================================================
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-badge text-badge-foreground border border-badge-border",
        secondary: "bg-secondary text-secondary-foreground border border-secondary/20",
        destructive: "bg-destructive text-destructive-foreground border border-destructive/20",
        outline: "border border-input bg-background text-foreground",
        success: "bg-success text-success-foreground border border-success/20",
        warning: "bg-warning text-warning-foreground border border-warning/20",
        info: "bg-info text-info-foreground border border-info/20",
        premium: "bg-gradient-to-r from-premium-start to-premium-end text-white border border-premium/20 shadow-sm",
        glass: "glass-morphism border-white/20 text-foreground",
        pulse: "bg-primary text-primary-foreground border border-primary/20 animate-pulse-gentle",
        glow: "bg-primary text-primary-foreground border border-primary/20 shadow-glow animate-glow",
      },
      size: {
        xs: "px-1.5 py-0.5 text-xs h-4",
        sm: "px-2 py-0.5 text-xs h-5",
        default: "px-2.5 py-0.5 text-sm h-6",
        lg: "px-3 py-1 text-sm h-7",
        xl: "px-4 py-1.5 text-base h-8",
      },
      shape: {
        default: "rounded-full",
        rounded: "rounded-md",
        square: "rounded-none",
        pill: "rounded-full px-4",
      },
      interactive: {
        none: "",
        hover: "hover:opacity-80 cursor-pointer",
        press: "hover:opacity-80 active:scale-95 cursor-pointer",
        clickable: "hover:shadow-md hover:scale-105 cursor-pointer",
      },
      animation: {
        none: "",
        bounce: "animate-bounce-gentle",
        fade: "animate-fade-in",
        slide: "animate-slide-in",
        scale: "animate-scale-in",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
      interactive: "none",
      animation: "none",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  loading?: boolean
  icon?: React.ReactNode
  dot?: boolean
  dismissible?: boolean
  onDismiss?: () => void
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ 
    className, 
    variant, 
    size, 
    shape, 
    interactive, 
    animation, 
    loading, 
    icon, 
    dot, 
    dismissible, 
    onDismiss, 
    children, 
    ...props 
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          badgeVariants({ variant, size, shape, interactive, animation }),
          loading && "opacity-60",
          className
        )}
        {...props}
      >
        {dot && (
          <div className="w-1.5 h-1.5 rounded-full bg-current mr-1.5" />
        )}
        
        {icon && !loading && (
          <div className="mr-1 -ml-0.5">
            {icon}
          </div>
        )}
        
        {loading && (
          <div className="w-3 h-3 mr-1.5 animate-spin rounded-full border border-current border-t-transparent" />
        )}
        
        <span className="truncate">{children}</span>
        
        {dismissible && onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="ml-1.5 -mr-0.5 hover:opacity-70 focus:outline-none"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    )
  }
)
Badge.displayName = "Badge"

export { Badge, badgeVariants }

/**
 * =====================================================================================
 * SPECIALIZED BADGE COMPONENTS
 * ===================================================================================== */

interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: 'active' | 'inactive' | 'pending' | 'error' | 'success' | 'warning'
}

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  ({ status, className, ...props }, ref) => {
    const statusConfig = {
      active: { variant: "success" as const, dot: true },
      inactive: { variant: "secondary" as const, dot: true },
      pending: { variant: "warning" as const, dot: true },
      error: { variant: "destructive" as const, dot: true },
      success: { variant: "success" as const, dot: true },
      warning: { variant: "warning" as const, dot: true },
    }
    
    const config = statusConfig[status]
    
    return (
      <Badge
        ref={ref}
        variant={config.variant}
        dot={config.dot}
        className={className}
        {...props}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }
)
StatusBadge.displayName = "StatusBadge"

interface MetricBadgeProps extends Omit<BadgeProps, 'variant'> {
  value: number
  type: 'percentage' | 'currency' | 'number'
  trend?: 'up' | 'down' | 'neutral'
  precision?: number
}

const MetricBadge = React.forwardRef<HTMLDivElement, MetricBadgeProps>(
  ({ value, type, trend, precision = 1, className, ...props }, ref) => {
    const formatValue = () => {
      switch (type) {
        case 'percentage':
          return `${value.toFixed(precision)}%`
        case 'currency':
          return `$${value.toFixed(2)}`
        case 'number':
          return value.toLocaleString()
        default:
          return value.toString()
      }
    }
    
    const getTrendIcon = () => {
      switch (trend) {
        case 'up':
          return <span className="text-xs">↗</span>
        case 'down':
          return <span className="text-xs">↘</span>
        case 'neutral':
          return <span className="text-xs">→</span>
        default:
          return null
      }
    }
    
    const getVariant = () => {
      if (!trend) return "default"
      switch (trend) {
        case 'up':
          return "success"
        case 'down':
          return "destructive"
        case 'neutral':
          return "secondary"
        default:
          return "default"
      }
    }
    
    return (
      <Badge
        ref={ref}
        variant={getVariant()}
        icon={getTrendIcon()}
        className={className}
        {...props}
      >
        {formatValue()}
      </Badge>
    )
  }
)
MetricBadge.displayName = "MetricBadge"

interface NotificationBadgeProps extends Omit<BadgeProps, 'variant'> {
  count: number
  max?: number
  showZero?: boolean
}

const NotificationBadge = React.forwardRef<HTMLDivElement, NotificationBadgeProps>(
  ({ count, max = 99, showZero = false, className, ...props }, ref) => {
    if (count === 0 && !showZero) return null
    
    const displayCount = count > max ? `${max}+` : count.toString()
    
    return (
      <Badge
        ref={ref}
        variant="destructive"
        size="xs"
        className={cn("min-w-[1.25rem] h-5", className)}
        {...props}
      >
        {displayCount}
      </Badge>
    )
  }
)
NotificationBadge.displayName = "NotificationBadge"

interface TagBadgeProps extends Omit<BadgeProps, 'variant'> {
  selected?: boolean
  onToggle?: () => void
}

const TagBadge = React.forwardRef<HTMLDivElement, TagBadgeProps>(
  ({ selected, onToggle, className, children, ...props }, ref) => (
    <Badge
      ref={ref}
      variant={selected ? "default" : "outline"}
      interactive={onToggle ? "press" : "none"}
      className={cn(
        "cursor-pointer transition-all",
        selected && "bg-primary text-primary-foreground",
        className
      )}
      onClick={onToggle}
      {...props}
    >
      {children}
    </Badge>
  )
)
TagBadge.displayName = "TagBadge"

export { StatusBadge, MetricBadge, NotificationBadge, TagBadge }

/**
 * =====================================================================================
 * BADGE GROUP COMPONENT
 * ===================================================================================== */

interface BadgeGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  spacing?: 'tight' | 'normal' | 'loose'
  wrap?: boolean
}

const BadgeGroup = React.forwardRef<HTMLDivElement, BadgeGroupProps>(
  ({ children, spacing = 'normal', wrap = true, className, ...props }, ref) => {
    const spacingClasses = {
      tight: 'gap-1',
      normal: 'gap-2',
      loose: 'gap-3',
    }
    
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center",
          spacingClasses[spacing],
          wrap && "flex-wrap",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
BadgeGroup.displayName = "BadgeGroup"

export { BadgeGroup }

/**
 * =====================================================================================
 * USAGE EXAMPLES
 * =====================================================================================
 *
 * // Basic badge
 * <Badge>Default</Badge>
 * <Badge variant="success">Success</Badge>
 * <Badge variant="premium" size="lg">Premium</Badge>
 *
 * // Interactive badges
 * <Badge variant="outline" interactive="clickable" onClick={handleClick}>
 *   Clickable
 * </Badge>
 *
 * // Badge with icon
 * <Badge icon={<CheckIcon className="w-3 h-3" />}>
 *   Verified
 * </Badge>
 *
 * // Status badge
 * <StatusBadge status="active" />
 * <StatusBadge status="pending" />
 *
 * // Metric badge
 * <MetricBadge value={24.5} type="percentage" trend="up" />
 * <MetricBadge value={1250} type="currency" trend="down" />
 *
 * // Notification badge
 * <NotificationBadge count={5} />
 * <NotificationBadge count={150} max={99} />
 *
 * // Tag badges
 * <TagBadge selected={true} onToggle={() => {}}>React</TagBadge>
 * <TagBadge selected={false} onToggle={() => {}}>TypeScript</TagBadge>
 *
 * // Badge group
 * <BadgeGroup spacing="normal">
 *   <Badge variant="success">Active</Badge>
 *   <Badge variant="info">Beta</Badge>
 *   <Badge variant="warning">Limited</Badge>
 * </BadgeGroup>
 *
 * // Dismissible badge
 * <Badge dismissible onDismiss={() => console.log('dismissed')}>
 *   Dismissible
 * </Badge>
 *
 * =====================================================================================
 */