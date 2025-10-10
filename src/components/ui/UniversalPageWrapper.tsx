// Universal Page Wrapper - Ensures Design System Continuity
// This component enforces the Phase 1 design standards across all pages
// All new pages should use this wrapper for automatic compliance

'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

// Enhanced Design System Imports - Phase 1 Visual Polish
import { designTokens } from '@/lib/designTokens';
import animations from '@/lib/animations';
import visualEffects from '@/lib/visualEffects';
import { Container, Grid, Flex, Section, Stack, Header, ContentArea, CardGrid } from '@/components/ui/LayoutSystem';
import { Button, Card, Badge, Spinner, Avatar, Progress } from '@/components/ui/EnhancedComponents';

// Dynamic imports for SSR safety
const UnifiedSidebar = dynamic(() => import('@/components/UnifiedSidebar'), {
  ssr: false,
  loading: () => <div className="fixed left-0 top-0 h-screen w-56 bg-gray-900 animate-pulse" />
});

const AdvancedNavigation = dynamic(() => import('@/components/ui/AdvancedNavigation'), {
  ssr: false,
  loading: () => <div className="h-16 bg-white dark:bg-gray-900 border-b animate-pulse" />
});

const AIControlChat = dynamic(() => import('@/components/AIControlChat'), {
  ssr: false,
  loading: () => null
});

const MasterTerminalBreadcrumb = dynamic(() => import('@/components/MasterTerminalBreadcrumb'), {
  ssr: false,
  loading: () => <div className="h-8 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
});

interface UniversalPageWrapperProps {
  // Page Content
  children: ReactNode;

  // Page Configuration
  title: string;
  subtitle?: string;

  // Layout Options
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  headerBackground?: 'transparent' | 'solid' | 'blur';
  showBreadcrumb?: boolean;
  showAIChat?: boolean;

  // Visual Mode (NEW - controls visual complexity)
  visualMode?: 'premium' | 'standard' | 'minimal';

  // Status and Badges
  statusBadge?: {
    variant: 'success' | 'warning' | 'error' | 'info' | 'default';
    text: string;
    dot?: boolean;
  };

  // Custom Header Actions
  headerActions?: ReactNode;

  // Animation Options
  enablePageAnimations?: boolean;
  animationDelay?: number;

  // Background Options
  background?: 'default' | 'muted' | 'gradient';

  // Custom Classes
  className?: string;
  contentClassName?: string;
}

export default function UniversalPageWrapper({
  children,
  title,
  subtitle,
  containerSize = 'xl',
  headerBackground = 'blur',
  showBreadcrumb = true,
  showAIChat = true,
  visualMode = 'standard', // Default to clean, professional mode
  statusBadge,
  headerActions,
  enablePageAnimations = true,
  animationDelay = 0,
  background = 'default',
  className = '',
  contentClassName = ''
}: UniversalPageWrapperProps) {
  
  // Sidebar state management
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Loading animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300 + animationDelay);
    return () => clearTimeout(timer);
  }, [animationDelay]);
  
  // Background class mapping
  const backgroundClasses = {
    default: 'bg-gray-50 dark:bg-gray-900',
    muted: 'bg-gray-100 dark:bg-gray-800',
    gradient: visualEffects.gradients.subtle.neutral
  };
  
  // Page animations (simplified based on visual mode)
  const pageVariants = enablePageAnimations && visualMode !== 'minimal' ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  } : undefined;

  const pageTransition = enablePageAnimations && visualMode !== 'minimal' ? {
    duration: visualMode === 'standard' ? 0.3 : 0.6, // Faster for standard mode
    ease: "easeOut" as const,
    delay: animationDelay / 1000
  } : undefined;

  // Typography classes based on visual mode
  const titleClasses = visualEffects.typography.modes[visualMode].title;
  const subtitleClasses = visualEffects.typography.modes[visualMode].subtitle;

  return (
    <div className={`min-h-screen ${backgroundClasses[background]} ${className}`}>
      {/* Unified Sidebar */}
      <UnifiedSidebar onCollapseChange={setSidebarCollapsed} />
      
      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'ml-14' : 'ml-56'
      }`}>
        
        {/* Advanced Navigation */}
        <AdvancedNavigation sidebarCollapsed={sidebarCollapsed} />
        
        {/* Master Terminal Breadcrumb */}
        {showBreadcrumb && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="px-6 py-2"
          >
            <MasterTerminalBreadcrumb />
          </motion.div>
        )}
        
        {/* Enhanced Header with Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={headerBackground === 'blur' ? visualEffects.glassmorphism.card : ''}
        >
          <Header 
            sticky={true} 
            background={headerBackground}
            className={headerBackground === 'blur' ? 'border-none' : ''}
          >
            <Container size={containerSize} padding="lg" center>
              <Flex justify="between" align="center" className="w-full">
                <Stack space="xs">
                  {visualMode === 'minimal' ? (
                    <h1 className={titleClasses}>
                      {title}
                    </h1>
                  ) : (
                    <motion.h1
                      className={titleClasses}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: visualMode === 'standard' ? 0.1 : 0.3 }}
                    >
                      {title}
                    </motion.h1>
                  )}
                  {subtitle && (
                    visualMode === 'minimal' ? (
                      <p className={subtitleClasses}>
                        {subtitle}
                      </p>
                    ) : (
                      <motion.p
                        className={subtitleClasses}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: visualMode === 'standard' ? 0.15 : 0.4 }}
                      >
                        {subtitle}
                      </motion.p>
                    )
                  )}
                </Stack>
                
                <Flex align="center" gap="md">
                  {/* Status Badge */}
                  {statusBadge && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Badge 
                        variant={statusBadge.variant} 
                        size="lg" 
                        dot={statusBadge.dot}
                      >
                        {statusBadge.text}
                      </Badge>
                    </motion.div>
                  )}
                  
                  {/* Custom Header Actions */}
                  {headerActions && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      {headerActions}
                    </motion.div>
                  )}
                </Flex>
              </Flex>
            </Container>
          </Header>
        </motion.div>
        
        {/* Main Content Container */}
        <Container size={containerSize} padding="lg" center>
          <AnimatePresence mode="wait">
            <motion.div
              key="page-content"
              variants={pageVariants}
              initial={enablePageAnimations ? "initial" : false}
              animate={enablePageAnimations ? "animate" : false}
              exit={enablePageAnimations ? "exit" : false}
              transition={pageTransition}
              className={`space-y-8 ${contentClassName}`}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </Container>
      </div>
      
      {/* Enhanced AI Control Chat */}
      {showAIChat && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <AIControlChat defaultMinimized={true} />
        </motion.div>
      )}
    </div>
  );
}

// Enhanced Section Wrapper for consistent section styling
interface SectionWrapperProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'transparent' | 'muted' | 'gradient';
  actions?: ReactNode;
  className?: string;
  enableAnimation?: boolean;
  animationDelay?: number;
}

export function SectionWrapper({
  children,
  title,
  subtitle,
  size = 'md',
  background = 'transparent',
  actions,
  className = '',
  enableAnimation = true,
  animationDelay = 0
}: SectionWrapperProps) {
  
  const sectionVariants = enableAnimation ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  } : undefined;
  
  const sectionTransition = enableAnimation ? {
    duration: 0.6,
    delay: animationDelay / 1000
  } : undefined;

  return (
    <Section size={size} background={background} className={className}>
      <motion.div
        variants={sectionVariants}
        initial={enableAnimation ? "initial" : false}
        animate={enableAnimation ? "animate" : false}
        transition={sectionTransition}
        className="space-y-8"
      >
        {/* Section Header */}
        {(title || subtitle || actions) && (
          <Flex justify="between" align="center" className="mb-8">
            <Stack space="xs">
              {title && (
                <h2 className={visualEffects.typography.enhanced.title}>
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className={visualEffects.typography.enhanced.body}>
                  {subtitle}
                </p>
              )}
            </Stack>
            {actions && <div>{actions}</div>}
          </Flex>
        )}
        
        {/* Section Content */}
        {children}
      </motion.div>
    </Section>
  );
}

// Enhanced Card Grid Wrapper for consistent card layouts
interface CardGridWrapperProps {
  children: ReactNode;
  minCardWidth?: number;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  enableStagger?: boolean;
  className?: string;
}

export function CardGridWrapper({
  children,
  minCardWidth = 280,
  gap = 'lg',
  enableStagger = true,
  className = ''
}: CardGridWrapperProps) {
  
  return (
    <motion.div
      variants={enableStagger ? animations.variants.stagger : undefined}
      initial={enableStagger ? "hidden" : false}
      animate={enableStagger ? "visible" : false}
      className={className}
    >
      <CardGrid minCardWidth={minCardWidth} gap={gap}>
        {children}
      </CardGrid>
    </motion.div>
  );
}

// Export all wrapper components
export {
  SectionWrapper,
  CardGridWrapper
};