// Enhanced Layout System - Following UI/UX Golden Compass Framework
// Domain 5: Information Architecture & Navigation + Domain 6: Responsive & Adaptive Design
// Comprehensive layout components with responsive behavior and accessibility

'use client';

import React, { forwardRef, HTMLAttributes, ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/visualEffects';
import visualEffects from '@/lib/visualEffects';
import { animationVariants } from '@/lib/animations';

// Enhanced Container Component
interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  center?: boolean;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'lg', padding = 'md', center = false, children, ...props }, ref) => {
    
    const baseClasses = cn(
      'w-full',
      
      // Size variants
      size === 'sm' && 'max-w-3xl',
      size === 'md' && 'max-w-4xl',
      size === 'lg' && 'max-w-6xl',
      size === 'xl' && 'max-w-7xl',
      size === 'full' && 'max-w-none',
      
      // Padding variants
      padding === 'none' && 'px-0',
      padding === 'sm' && 'px-4',
      padding === 'md' && 'px-4 md:px-6',
      padding === 'lg' && 'px-4 md:px-6 lg:px-8',
      padding === 'xl' && 'px-4 md:px-8 lg:px-12',
      
      // Center alignment
      center && 'mx-auto'
    );

    return (
      <div ref={ref} className={cn(baseClasses, className)} {...props}>
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';

// Enhanced Grid System
interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'auto';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
  alignment?: 'start' | 'center' | 'end' | 'stretch';
}

export const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 'auto', gap = 'md', responsive = true, alignment = 'stretch', children, ...props }, ref) => {
    
    const baseClasses = cn(
      'grid',
      
      // Column variants
      {
        'grid-cols-1': cols === 1,
        'grid-cols-2': cols === 2,
        'grid-cols-3': cols === 3,
        'grid-cols-4': cols === 4,
        'grid-cols-5': cols === 5,
        'grid-cols-6': cols === 6,
        'grid-cols-12': cols === 12,
        'grid-cols-[repeat(auto-fit,minmax(280px,1fr))]': cols === 'auto'
      },
      
      // Responsive variants
      responsive && {
        'md:grid-cols-2': cols === 'auto' || (typeof cols === 'number' && cols > 1),
        'lg:grid-cols-3': cols === 'auto' || (typeof cols === 'number' && cols > 2),
        'xl:grid-cols-4': cols === 'auto' || (typeof cols === 'number' && cols > 3)
      },
      
      // Gap variants
      {
        'gap-0': gap === 'none',
        'gap-2': gap === 'sm',
        'gap-4': gap === 'md',
        'gap-6': gap === 'lg',
        'gap-8': gap === 'xl'
      },
      
      // Alignment variants
      {
        'items-start': alignment === 'start',
        'items-center': alignment === 'center',
        'items-end': alignment === 'end',
        'items-stretch': alignment === 'stretch'
      }
    );

    return (
      <div ref={ref} className={cn(baseClasses, className)} {...props}>
        {children}
      </div>
    );
  }
);

Grid.displayName = 'Grid';

// Enhanced Flex Component
interface FlexProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  wrap?: boolean;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Flex = forwardRef<HTMLDivElement, FlexProps>(
  ({ 
    className, 
    direction = 'row', 
    justify = 'start', 
    align = 'stretch', 
    wrap = false,
    gap = 'none',
    children, 
    ...props 
  }, ref) => {
    
    const baseClasses = cn(
      'flex',
      
      // Direction variants
      {
        'flex-row': direction === 'row',
        'flex-col': direction === 'col',
        'flex-row-reverse': direction === 'row-reverse',
        'flex-col-reverse': direction === 'col-reverse'
      },
      
      // Justify variants
      {
        'justify-start': justify === 'start',
        'justify-center': justify === 'center',
        'justify-end': justify === 'end',
        'justify-between': justify === 'between',
        'justify-around': justify === 'around',
        'justify-evenly': justify === 'evenly'
      },
      
      // Align variants
      {
        'items-start': align === 'start',
        'items-center': align === 'center',
        'items-end': align === 'end',
        'items-stretch': align === 'stretch',
        'items-baseline': align === 'baseline'
      },
      
      // Wrap
      wrap && 'flex-wrap',
      
      // Gap variants
      {
        'gap-0': gap === 'none',
        'gap-2': gap === 'sm',
        'gap-4': gap === 'md',
        'gap-6': gap === 'lg',
        'gap-8': gap === 'xl'
      }
    );

    return (
      <div ref={ref} className={cn(baseClasses, className)} {...props}>
        {children}
      </div>
    );
  }
);

Flex.displayName = 'Flex';

// Enhanced Section Component
interface SectionProps extends HTMLAttributes<HTMLElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'transparent' | 'muted' | 'accent' | 'gradient';
  fullHeight?: boolean;
  centered?: boolean;
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ 
    className, 
    size = 'md', 
    background = 'transparent',
    fullHeight = false,
    centered = false,
    children, 
    ...props 
  }, ref) => {
    
    const baseClasses = cn(
      'w-full',
      
      // Size variants (vertical padding)
      {
        'py-8 md:py-12': size === 'sm',
        'py-12 md:py-16': size === 'md',
        'py-16 md:py-24': size === 'lg',
        'py-24 md:py-32': size === 'xl'
      },
      
      // Background variants
      {
        'bg-transparent': background === 'transparent',
        'bg-gray-50 dark:bg-gray-900': background === 'muted',
        'bg-blue-50 dark:bg-blue-950': background === 'accent',
        [visualEffects.gradients.subtle.neutral]: background === 'gradient'
      },
      
      // Full height
      fullHeight && 'min-h-screen',
      
      // Centered content
      centered && 'flex items-center justify-center'
    );

    return (
      <section ref={ref} className={cn(baseClasses, className)} {...props}>
        {children}
      </section>
    );
  }
);

Section.displayName = 'Section';

// Enhanced Stack Component
interface StackProps extends HTMLAttributes<HTMLDivElement> {
  space?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  divider?: boolean;
  align?: 'start' | 'center' | 'end' | 'stretch';
}

export const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ className, space = 'md', divider = false, align = 'stretch', children, ...props }, ref) => {
    
    const baseClasses = cn(
      'flex flex-col',
      
      // Spacing variants
      {
        'space-y-0': space === 'none',
        'space-y-1': space === 'xs',
        'space-y-2': space === 'sm',
        'space-y-4': space === 'md',
        'space-y-6': space === 'lg',
        'space-y-8': space === 'xl',
        'space-y-12': space === '2xl'
      },
      
      // Alignment variants
      {
        'items-start': align === 'start',
        'items-center': align === 'center',
        'items-end': align === 'end',
        'items-stretch': align === 'stretch'
      },
      
      // Divider styling
      divider && 'divide-y divide-gray-200 dark:divide-gray-700 space-y-0'
    );

    return (
      <div ref={ref} className={cn(baseClasses, className)} {...props}>
        {children}
      </div>
    );
  }
);

Stack.displayName = 'Stack';

// Enhanced Sidebar Layout
interface SidebarLayoutProps extends HTMLAttributes<HTMLDivElement> {
  sidebarWidth?: 'sm' | 'md' | 'lg';
  sidebarPosition?: 'left' | 'right';
  sidebarCollapsed?: boolean;
  overlay?: boolean;
  children: [ReactNode, ReactNode]; // [sidebar, content]
}

export const SidebarLayout = forwardRef<HTMLDivElement, SidebarLayoutProps>(
  ({ 
    className, 
    sidebarWidth = 'md',
    sidebarPosition = 'left',
    sidebarCollapsed = false,
    overlay = false,
    children,
    ...props 
  }, ref) => {
    
    const [sidebar, content] = children;
    
    const widthClasses = {
      sm: sidebarCollapsed ? 'w-16' : 'w-64',
      md: sidebarCollapsed ? 'w-16' : 'w-72',
      lg: sidebarCollapsed ? 'w-16' : 'w-80'
    };
    
    const layoutClasses = cn(
      'flex min-h-screen',
      sidebarPosition === 'right' && 'flex-row-reverse'
    );

    return (
      <div ref={ref} className={cn(layoutClasses, className)} {...props}>
        {/* Sidebar */}
        <motion.aside
          className={cn(
            'flex-shrink-0 transition-all duration-300',
            widthClasses[sidebarWidth],
            overlay && 'fixed inset-y-0 z-50 lg:relative'
          )}
          animate={{ width: sidebarCollapsed ? 64 : 
            sidebarWidth === 'sm' ? 256 :
            sidebarWidth === 'md' ? 288 : 320 
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {sidebar}
        </motion.aside>
        
        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {content}
        </main>
        
        {/* Overlay backdrop for mobile */}
        {overlay && !sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </div>
    );
  }
);

SidebarLayout.displayName = 'SidebarLayout';

// Enhanced Header Component
interface HeaderProps extends HTMLAttributes<HTMLElement> {
  sticky?: boolean;
  background?: 'transparent' | 'solid' | 'blur';
  border?: boolean;
  height?: 'sm' | 'md' | 'lg';
}

export const Header = forwardRef<HTMLElement, HeaderProps>(
  ({ 
    className, 
    sticky = false, 
    background = 'solid',
    border = true,
    height = 'md',
    children, 
    ...props 
  }, ref) => {
    
    const baseClasses = cn(
      'w-full z-40 transition-all duration-200',
      
      // Position
      sticky && 'sticky top-0',
      
      // Height variants
      {
        'h-14': height === 'sm',
        'h-16': height === 'md',
        'h-20': height === 'lg'
      },
      
      // Background variants
      {
        'bg-transparent': background === 'transparent',
        'bg-white dark:bg-gray-900': background === 'solid',
        [visualEffects.glassmorphism.card]: background === 'blur'
      },
      
      // Border
      border && 'border-b border-gray-200 dark:border-gray-700'
    );

    return (
      <header ref={ref} className={cn(baseClasses, className)} {...props}>
        <div className="h-full px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-full">
            {children}
          </div>
        </div>
      </header>
    );
  }
);

Header.displayName = 'Header';

// Enhanced Content Area
interface ContentAreaProps extends HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'transparent' | 'muted' | 'white';
}

export const ContentArea = forwardRef<HTMLDivElement, ContentAreaProps>(
  ({ 
    className, 
    maxWidth = 'lg', 
    padding = 'md',
    background = 'transparent',
    children, 
    ...props 
  }, ref) => {
    
    const baseClasses = cn(
      'w-full',
      
      // Max width variants
      {
        'max-w-3xl': maxWidth === 'sm',
        'max-w-4xl': maxWidth === 'md',
        'max-w-6xl': maxWidth === 'lg',
        'max-w-7xl': maxWidth === 'xl',
        'max-w-none': maxWidth === 'full'
      },
      
      // Padding variants
      {
        'p-0': padding === 'none',
        'p-4': padding === 'sm',
        'p-6': padding === 'md',
        'p-8': padding === 'lg',
        'p-12': padding === 'xl'
      },
      
      // Background variants
      {
        'bg-transparent': background === 'transparent',
        'bg-gray-50 dark:bg-gray-900': background === 'muted',
        'bg-white dark:bg-gray-800': background === 'white'
      }
    );

    return (
      <div ref={ref} className={cn(baseClasses, className)} {...props}>
        {children}
      </div>
    );
  }
);

ContentArea.displayName = 'ContentArea';

// Enhanced Card Grid Component
interface CardGridProps extends HTMLAttributes<HTMLDivElement> {
  minCardWidth?: number;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
}

export const CardGrid = forwardRef<HTMLDivElement, CardGridProps>(
  ({ className, minCardWidth = 280, gap = 'lg', responsive = true, children, ...props }, ref) => {
    
    const baseClasses = cn(
      'grid',
      `grid-cols-[repeat(auto-fit,minmax(${minCardWidth}px,1fr))]`,
      
      // Gap variants
      {
        'gap-4': gap === 'sm',
        'gap-6': gap === 'md',
        'gap-8': gap === 'lg',
        'gap-12': gap === 'xl'
      }
    );

    return (
      <motion.div
        ref={ref}
        className={cn(baseClasses, className)}
        variants={animationVariants.staggerContainer}
        initial="hidden"
        animate="visible"
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

CardGrid.displayName = 'CardGrid';

// Export all layout components
export {
  Container,
  Grid,
  Flex,
  Section,
  Stack,
  SidebarLayout,
  Header,
  ContentArea,
  CardGrid
};

// Export layout collection
export default {
  Container,
  Grid,
  Flex,
  Section,
  Stack,
  SidebarLayout,
  Header,
  ContentArea,
  CardGrid
};