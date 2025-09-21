'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  animated?: boolean
}

export function Skeleton({ 
  className = '', 
  variant = 'text', 
  width, 
  height, 
  animated = true 
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700'
  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-lg'
  }

  const style = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'text' ? '1em' : undefined)
  }

  const skeletonClasses = `${baseClasses} ${variants[variant]} ${className}`

  if (animated) {
    return (
      <motion.div
        className={skeletonClasses}
        style={style}
        animate={{
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    )
  }

  return <div className={skeletonClasses} style={style} />
}

// Campaign card skeleton
export function CampaignCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <Skeleton height="1.5rem" width="60%" className="mb-2" />
          <Skeleton height="1rem" width="40%" />
        </div>
        <Skeleton variant="rectangular" width="4rem" height="1.5rem" className="ml-4" />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Skeleton height="0.875rem" width="50%" className="mb-1" />
          <Skeleton height="1.25rem" width="70%" />
        </div>
        <div>
          <Skeleton height="0.875rem" width="60%" className="mb-1" />
          <Skeleton height="1.25rem" width="80%" />
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <Skeleton height="0.875rem" width="30%" />
        <div className="flex gap-2">
          <Skeleton variant="rectangular" width="4rem" height="2rem" />
          <Skeleton variant="rectangular" width="4rem" height="2rem" />
        </div>
      </div>
    </div>
  )
}

// Dashboard widget skeleton
export function DashboardWidgetSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <Skeleton height="1.5rem" width="40%" />
        <Skeleton variant="circular" width="2rem" height="2rem" />
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton height="3rem" width="30%" />
          <Skeleton height="1rem" width="20%" />
        </div>
        
        {/* Chart area */}
        <div className="h-32">
          <Skeleton variant="rectangular" width="100%" height="100%" />
        </div>
        
        <div className="flex justify-between">
          <Skeleton height="0.875rem" width="25%" />
          <Skeleton height="0.875rem" width="25%" />
        </div>
      </div>
    </div>
  )
}

// Table skeleton
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} height="1rem" width="80%" />
          ))}
        </div>
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="border-b border-gray-100 dark:border-gray-700 p-4 last:border-b-0">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton 
                key={colIndex} 
                height="1rem" 
                width={colIndex === 0 ? "90%" : `${60 + Math.random() * 30}%`} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Analytics chart skeleton
export function ChartSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <div>
          <Skeleton height="1.5rem" width="60%" className="mb-2" />
          <Skeleton height="1rem" width="40%" />
        </div>
        <div className="flex gap-2">
          <Skeleton variant="rectangular" width="4rem" height="2rem" />
          <Skeleton variant="rectangular" width="4rem" height="2rem" />
        </div>
      </div>
      
      <div className="h-80 mb-4">
        <Skeleton variant="rectangular" width="100%" height="100%" />
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="text-center">
            <Skeleton height="1rem" width="60%" className="mb-1 mx-auto" />
            <Skeleton height="1.5rem" width="80%" className="mx-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}

// Form skeleton
export function FormSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <Skeleton height="1.5rem" width="40%" className="mb-6" />
      
      <div className="space-y-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
            <Skeleton height="1rem" width="25%" className="mb-2" />
            <Skeleton variant="rectangular" width="100%" height="2.5rem" />
          </div>
        ))}
        
        <div className="flex gap-3 pt-4">
          <Skeleton variant="rectangular" width="6rem" height="2.5rem" />
          <Skeleton variant="rectangular" width="6rem" height="2.5rem" />
        </div>
      </div>
    </div>
  )
}

// Page skeleton wrapper
export function PageSkeleton({ children, showHeader = true }: { children: React.ReactNode; showHeader?: boolean }) {
  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex justify-between items-center">
          <div>
            <Skeleton height="2rem" width="30%" className="mb-2" />
            <Skeleton height="1rem" width="50%" />
          </div>
          <div className="flex gap-3">
            <Skeleton variant="rectangular" width="6rem" height="2.5rem" />
            <Skeleton variant="rectangular" width="8rem" height="2.5rem" />
          </div>
        </div>
      )}
      {children}
    </div>
  )
}