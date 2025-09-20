/**
 * =====================================================================================
 * ENHANCED BUTTON COMPONENT
 * =====================================================================================
 * Purpose: Premium button component with enhanced variants, animations, and accessibility
 * Features: Multiple variants, sizes, states, micro-interactions, and loading states
 * Created: September 2025
 * =====================================================================================
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-card hover:bg-primary-hover hover:shadow-card-hover active:bg-primary-active active:shadow-card-active",
        destructive:
          "bg-error text-error-foreground shadow-card hover:bg-error-hover hover:shadow-card-hover active:shadow-card-active",
        outline:
          "border border-border bg-background shadow-card hover:bg-secondary hover:text-secondary-foreground hover:shadow-card-hover active:shadow-card-active",
        secondary:
          "bg-secondary text-secondary-foreground shadow-card hover:bg-secondary-hover hover:shadow-card-hover active:bg-secondary-active active:shadow-card-active",
        ghost: "hover:bg-secondary hover:text-secondary-foreground active:bg-secondary-active",
        link: "text-primary underline-offset-4 hover:underline active:text-primary-active",
        premium:
          "bg-gradient-to-r from-pulse-blue to-bridge-purple text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200",
        success:
          "bg-success text-success-foreground shadow-card hover:bg-success-hover hover:shadow-card-hover active:shadow-card-active",
        warning:
          "bg-warning text-warning-foreground shadow-card hover:bg-warning-hover hover:shadow-card-hover active:shadow-card-active",
        glass:
          "glass-morphism backdrop-blur-sm border border-white/20 text-foreground shadow-lg hover:bg-white/20 hover:shadow-xl transition-all duration-200",
      },
      size: {
        default: "h-9 px-4 py-2 rounded-md",
        xs: "h-6 px-2 py-1 rounded text-xs",
        sm: "h-8 px-3 py-1.5 rounded-md text-xs",
        lg: "h-10 px-6 py-2.5 rounded-lg",
        xl: "h-12 px-8 py-3 rounded-lg text-base",
        icon: "h-9 w-9 rounded-md",
        "icon-sm": "h-8 w-8 rounded-md",
        "icon-lg": "h-10 w-10 rounded-lg",
        "icon-xl": "h-12 w-12 rounded-lg",
      },
      animation: {
        none: "",
        pulse: "animate-pulse-custom",
        bounce: "hover:animate-bounce",
        scale: "hover:scale-105 active:scale-95",
        slide: "transform transition-transform hover:translate-y-[-2px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      animation: "scale",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    animation,
    asChild = false, 
    loading = false,
    loadingText,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const isDisabled = disabled || loading
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, animation, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        {!loading && leftIcon && leftIcon}
        {loading ? loadingText || "Loading..." : children}
        {!loading && rightIcon && rightIcon}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

/**
 * =====================================================================================
 * BUTTON GROUP COMPONENT
 * ===================================================================================== */

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"
  variant?: VariantProps<typeof buttonVariants>["variant"]
  size?: VariantProps<typeof buttonVariants>["size"]
  children: React.ReactNode
}

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  ({ className, orientation = "horizontal", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex",
          orientation === "horizontal" ? "flex-row" : "flex-col",
          "[&>*:not(:first-child):not(:last-child)]:rounded-none",
          orientation === "horizontal" ? [
            "[&>*:first-child]:rounded-r-none",
            "[&>*:last-child]:rounded-l-none",
            "[&>*:not(:first-child)]:border-l-0"
          ] : [
            "[&>*:first-child]:rounded-b-none",
            "[&>*:last-child]:rounded-t-none",
            "[&>*:not(:first-child)]:border-t-0"
          ],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ButtonGroup.displayName = "ButtonGroup"

export { ButtonGroup }

/**
 * =====================================================================================
 * FLOATING ACTION BUTTON COMPONENT
 * ===================================================================================== */

interface FloatingActionButtonProps extends ButtonProps {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left"
  extended?: boolean
}

const FloatingActionButton = React.forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  ({ 
    className, 
    position = "bottom-right",
    extended = false,
    children,
    ...props 
  }, ref) => {
    const positionClasses = {
      "bottom-right": "fixed bottom-6 right-6",
      "bottom-left": "fixed bottom-6 left-6", 
      "top-right": "fixed top-6 right-6",
      "top-left": "fixed top-6 left-6",
    }
    
    return (
      <Button
        ref={ref}
        className={cn(
          positionClasses[position],
          "z-50 shadow-lg hover:shadow-xl",
          extended ? "px-6" : "h-12 w-12",
          className
        )}
        size={extended ? "lg" : "icon-lg"}
        variant="premium"
        animation="scale"
        {...props}
      >
        {children}
      </Button>
    )
  }
)
FloatingActionButton.displayName = "FloatingActionButton"

export { FloatingActionButton }

/**
 * =====================================================================================
 * USAGE EXAMPLES
 * =====================================================================================
 *
 * // Basic button
 * <Button>Click me</Button>
 *
 * // Premium variant with loading
 * <Button variant="premium" loading={isLoading} loadingText="Saving...">
 *   Save Changes
 * </Button>
 *
 * // Button with icons
 * <Button leftIcon={<Plus />} rightIcon={<ArrowRight />}>
 *   Create Campaign
 * </Button>
 *
 * // Button group
 * <ButtonGroup>
 *   <Button variant="outline">Previous</Button>
 *   <Button>Next</Button>
 * </ButtonGroup>
 *
 * // Floating action button
 * <FloatingActionButton extended>
 *   <Plus className="h-5 w-5 mr-2" />
 *   New Campaign
 * </FloatingActionButton>
 *
 * =====================================================================================
 */