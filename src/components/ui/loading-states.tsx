/**
 * =====================================================================================
 * ENHANCED LOADING COMPONENTS
 * =====================================================================================
 * Purpose: Comprehensive loading states with skeleton screens and progress indicators
 * Features: Multiple loading variants, skeleton UI, progress bars, and micro-interactions
 * Created: September 2025
 * =====================================================================================
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/* ================================
   LOADING SPINNER COMPONENT
   ================================ */

const spinnerVariants = cva(
  "inline-block animate-spin rounded-full border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]",
  {
    variants: {
      size: {
        xs: "h-3 w-3 border",
        sm: "h-4 w-4 border",
        default: "h-5 w-5 border-2",
        lg: "h-6 w-6 border-2",
        xl: "h-8 w-8 border-2",
        "2xl": "h-12 w-12 border-4",
      },
      variant: {
        default: "text-primary",
        muted: "text-muted-foreground",
        white: "text-white",
        current: "text-current",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
)

interface LoadingSpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string
  "aria-label"?: string
}

const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ size, variant, className, "aria-label": ariaLabel, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(spinnerVariants({ size, variant }), className)}
      role="status"
      aria-label={ariaLabel || "Loading"}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
)
LoadingSpinner.displayName = "LoadingSpinner"

/* ================================
   LOADING DOTS COMPONENT
   ================================ */

interface LoadingDotsProps {
  className?: string
  dotClassName?: string
  size?: "sm" | "default" | "lg"
}

const LoadingDots = React.forwardRef<HTMLDivElement, LoadingDotsProps>(
  ({ className, dotClassName, size = "default", ...props }, ref) => {
    const sizeClasses = {
      sm: "gap-1",
      default: "gap-1.5",
      lg: "gap-2",
    }
    
    const dotSizeClasses = {
      sm: "w-1 h-1",
      default: "w-1.5 h-1.5",
      lg: "w-2 h-2",
    }
    
    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center", sizeClasses[size], className)}
        role="status"
        aria-label="Loading"
        {...props}
      >
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={cn(
              "rounded-full bg-current animate-loading-dots",
              dotSizeClasses[size],
              dotClassName
            )}
            style={{
              animationDelay: `${index * 0.16}s`,
            }}
          />
        ))}
        <span className="sr-only">Loading...</span>
      </div>
    )
  }
)
LoadingDots.displayName = "LoadingDots"

/* ================================
   LOADING PULSE COMPONENT
   ================================ */

interface LoadingPulseProps {
  className?: string
  children?: React.ReactNode
}

const LoadingPulse = React.forwardRef<HTMLDivElement, LoadingPulseProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("animate-pulse-gentle", className)}
      {...props}
    >
      {children}
    </div>
  )
)
LoadingPulse.displayName = "LoadingPulse"

/* ================================
   SKELETON COMPONENT
   ================================ */

const skeletonVariants = cva(
  "animate-pulse rounded-md bg-muted",
  {
    variants: {
      variant: {
        default: "",
        text: "h-4",
        heading: "h-6",
        avatar: "rounded-full",
        button: "h-10",
        card: "h-32",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  loading?: boolean
  children?: React.ReactNode
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, loading = true, children, ...props }, ref) => {
    if (!loading && children) {
      return <>{children}</>
    }
    
    return (
      <div
        ref={ref}
        className={cn(skeletonVariants({ variant }), className)}
        {...props}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"

/* ================================
   SKELETON LAYOUTS
   ================================ */

interface SkeletonTextProps {
  lines?: number
  className?: string
  lastLineWidth?: string
}

const SkeletonText = React.forwardRef<HTMLDivElement, SkeletonTextProps>(
  ({ lines = 3, className, lastLineWidth = "75%", ...props }, ref) => (
    <div ref={ref} className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          className={cn(
            "w-full",
            index === lines - 1 && lastLineWidth !== "100%" ? `w-[${lastLineWidth}]` : ""
          )}
        />
      ))}
    </div>
  )
)
SkeletonText.displayName = "SkeletonText"

interface SkeletonCardProps {
  className?: string
  showAvatar?: boolean
  showHeader?: boolean
  showContent?: boolean
  showFooter?: boolean
}

const SkeletonCard = React.forwardRef<HTMLDivElement, SkeletonCardProps>(
  ({ className, showAvatar = true, showHeader = true, showContent = true, showFooter = false, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-4 p-4", className)} {...props}>
      {showHeader && (
        <div className="flex items-center space-x-4">
          {showAvatar && <Skeleton variant="avatar" className="h-10 w-10" />}
          <div className="space-y-2 flex-1">
            <Skeleton variant="heading" className="w-1/3" />
            <Skeleton variant="text" className="w-1/2" />
          </div>
        </div>
      )}
      
      {showContent && (
        <div className="space-y-2">
          <Skeleton variant="text" className="w-full" />
          <Skeleton variant="text" className="w-4/5" />
          <Skeleton variant="text" className="w-3/5" />
        </div>
      )}
      
      {showFooter && (
        <div className="flex space-x-2">
          <Skeleton variant="button" className="w-20" />
          <Skeleton variant="button" className="w-24" />
        </div>
      )}
    </div>
  )
)
SkeletonCard.displayName = "SkeletonCard"

interface SkeletonTableProps {
  rows?: number
  columns?: number
  className?: string
}

const SkeletonTable = React.forwardRef<HTMLDivElement, SkeletonTableProps>(
  ({ rows = 5, columns = 4, className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-3", className)} {...props}>
      {/* Header */}
      <div className="flex space-x-3">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={`header-${index}`} variant="text" className="h-5 flex-1" />
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex space-x-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={`cell-${rowIndex}-${colIndex}`} variant="text" className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
)
SkeletonTable.displayName = "SkeletonTable"

/* ================================
   PROGRESS BAR COMPONENT
   ================================ */

interface ProgressBarProps {
  value?: number
  max?: number
  className?: string
  barClassName?: string
  indeterminate?: boolean
  size?: "sm" | "default" | "lg"
  variant?: "default" | "success" | "warning" | "error"
  showLabel?: boolean
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ 
    value = 0, 
    max = 100, 
    className, 
    barClassName, 
    indeterminate = false,
    size = "default",
    variant = "default",
    showLabel = false,
    ...props 
  }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    
    const sizeClasses = {
      sm: "h-1",
      default: "h-2",
      lg: "h-3",
    }
    
    const variantClasses = {
      default: "bg-primary",
      success: "bg-success",
      warning: "bg-warning",
      error: "bg-destructive",
    }
    
    return (
      <div className={cn("w-full", className)} {...props}>
        {showLabel && (
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>Progress</span>
            <span>{Math.round(percentage)}%</span>
          </div>
        )}
        <div
          ref={ref}
          className={cn(
            "w-full bg-secondary rounded-full overflow-hidden",
            sizeClasses[size]
          )}
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : value}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          <div
            className={cn(
              "h-full transition-all duration-300 ease-out",
              variantClasses[variant],
              indeterminate && "animate-progress-indeterminate w-1/3",
              barClassName
            )}
            style={
              indeterminate
                ? undefined
                : { width: `${percentage}%` }
            }
          />
        </div>
      </div>
    )
  }
)
ProgressBar.displayName = "ProgressBar"

/* ================================
   LOADING OVERLAY COMPONENT
   ================================ */

interface LoadingOverlayProps {
  loading: boolean
  children: React.ReactNode
  spinner?: React.ReactNode
  text?: string
  className?: string
  overlayClassName?: string
  blur?: boolean
}

const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ 
    loading, 
    children, 
    spinner, 
    text, 
    className, 
    overlayClassName, 
    blur = true,
    ...props 
  }, ref) => (
    <div ref={ref} className={cn("relative", className)} {...props}>
      {children}
      {loading && (
        <div
          className={cn(
            "absolute inset-0 flex flex-col items-center justify-center z-10",
            blur ? "backdrop-blur-sm" : "",
            "bg-background/60",
            overlayClassName
          )}
        >
          {spinner || <LoadingSpinner size="lg" />}
          {text && (
            <p className="mt-3 text-sm text-muted-foreground">{text}</p>
          )}
        </div>
      )}
    </div>
  )
)
LoadingOverlay.displayName = "LoadingOverlay"

/* ================================
   LOADING BUTTON COMPONENT
   ================================ */

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  loadingText?: string
  spinner?: React.ReactNode
  children: React.ReactNode
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ loading = false, loadingText, spinner, children, disabled, className, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn("inline-flex items-center justify-center", className)}
      {...props}
    >
      {loading && (
        <span className="mr-2">
          {spinner || <LoadingSpinner size="sm" variant="current" />}
        </span>
      )}
      {loading && loadingText ? loadingText : children}
    </button>
  )
)
LoadingButton.displayName = "LoadingButton"

/* ================================
   EXPORTS
   ================================ */

export {
  LoadingSpinner,
  LoadingDots,
  LoadingPulse,
  Skeleton,
  SkeletonText,
  SkeletonCard,
  SkeletonTable,
  ProgressBar,
  LoadingOverlay,
  LoadingButton,
}

/**
 * =====================================================================================
 * USAGE EXAMPLES
 * =====================================================================================
 *
 * // Loading Spinner
 * <LoadingSpinner size="lg" variant="primary" />
 *
 * // Loading Dots
 * <LoadingDots size="lg" className="text-primary" />
 *
 * // Skeleton Components
 * <Skeleton variant="text" className="w-32 h-4" />
 * <SkeletonText lines={3} />
 * <SkeletonCard showAvatar showHeader showContent />
 * <SkeletonTable rows={5} columns={3} />
 *
 * // Progress Bar
 * <ProgressBar value={65} showLabel />
 * <ProgressBar indeterminate />
 *
 * // Loading Overlay
 * <LoadingOverlay loading={isLoading} text="Processing...">
 *   <YourContent />
 * </LoadingOverlay>
 *
 * // Loading Button
 * <LoadingButton loading={isSubmitting} loadingText="Saving...">
 *   Save Changes
 * </LoadingButton>
 *
 * // Conditional Loading
 * <Skeleton loading={isLoading} variant="card">
 *   <YourActualContent />
 * </Skeleton>
 *
 * =====================================================================================
 */