'use client';'use client';// Universal Page Wrapper - Ensures Design System Continuity



import React, { ReactNode } from 'react';// This component enforces the Phase 1 design standards across all pages



interface UniversalPageWrapperProps {import React, { ReactNode } from 'react';// All new pages should use this wrapper for automatic compliance

  children: ReactNode;

  title?: string;

  subtitle?: string;

  showBreadcrumbs?: boolean;interface UniversalPageWrapperProps {'use client';

  showSidebar?: boolean;

  sidebarCollapsed?: boolean;  children: ReactNode;

  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';

  headerBackground?: 'transparent' | 'solid' | 'blur';  title?: string;import React, { ReactNode, useState, useEffect } from 'react';

  headerActions?: ReactNode;

}  subtitle?: string;import { motion, AnimatePresence } from 'framer-motion';



// Simple stub implementation for disabled UniversalPageWrapper  showBreadcrumbs?: boolean;import dynamic from 'next/dynamic';

export function UniversalPageWrapper({ 

  children,  showSidebar?: boolean;

  title,

  subtitle,  sidebarCollapsed?: boolean;// Enhanced Design System Imports - Phase 1 Visual Polish

  showBreadcrumbs = false,

  showSidebar = false,  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';import { designTokens } from '@/lib/designTokens';

  sidebarCollapsed = false,

  containerSize = 'xl',  headerBackground?: 'transparent' | 'solid' | 'blur';import animations from '@/lib/animations';

  headerBackground = 'blur',

  headerActions,  headerActions?: ReactNode;import visualEffects from '@/lib/visualEffects';

  ...props 

}: UniversalPageWrapperProps) {}// import { Container, Grid, Flex, Section, Stack, Header, ContentArea, CardGrid } from '@/components/ui/LayoutSystem';

  return (

    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">import { Button, Card, Badge, Spinner, Avatar, Progress } from '@/components/ui/EnhancedComponents';

      {title && (

        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-6">// Simple stub implementation for disabled UniversalPageWrapper

          <div className="max-w-7xl mx-auto">

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>export function UniversalPageWrapper({ // Dynamic imports for SSR safety

            {subtitle && <p className="text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>}

          </div>  children,const UnifiedSidebar = dynamic(() => import('@/components/UnifiedSidebar'), {

        </div>

      )}  title,  ssr: false,

      <div className="max-w-7xl mx-auto px-4 py-6">

        {children}  subtitle,  loading: () => <div className="fixed left-0 top-0 h-screen w-56 bg-gray-900 animate-pulse" />

      </div>

    </div>  showBreadcrumbs = false,});

  );

}  showSidebar = false,



export default UniversalPageWrapper;  sidebarCollapsed = false,const AdvancedNavigation = dynamic(() => import('@/components/ui/AdvancedNavigation'), {

  containerSize = 'xl',  ssr: false,

  headerBackground = 'blur',  loading: () => <div className="h-16 bg-white dark:bg-gray-900 border-b animate-pulse" />

  headerActions,});

  ...props 

}: UniversalPageWrapperProps) {const AIControlChat = dynamic(() => import('@/components/AIControlChat'), {

  return (  ssr: false,

    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">  loading: () => null

      {title && (});

        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-6">

          <div className="max-w-7xl mx-auto">const MasterTerminalBreadcrumb = dynamic(() => import('@/components/MasterTerminalBreadcrumb'), {

            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>  ssr: false,

            {subtitle && <p className="text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>}  loading: () => <div className="h-8 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />

          </div>});

        </div>

      )}interface UniversalPageWrapperProps {

      <div className="max-w-7xl mx-auto px-4 py-6">  // Page Content

        {children}  children: ReactNode;

      </div>  

    </div>  // Page Configuration

  );  title: string;

}  subtitle?: string;

  

export default UniversalPageWrapper;  // Layout Options
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  headerBackground?: 'transparent' | 'solid' | 'blur';
  showBreadcrumb?: boolean;
  showAIChat?: boolean;
  
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
  
  // Page animations
  const pageVariants = enablePageAnimations ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  } : undefined;
  
  const pageTransition = enablePageAnimations ? {
    duration: 0.6,
    ease: "easeOut" as const,
    delay: animationDelay / 1000
  } : undefined;

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
                  <motion.h1 
                    className={`${visualEffects.typography.display.title} ${visualEffects.gradients.text.primary}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {title}
                  </motion.h1>
                  {subtitle && (
                    <motion.p 
                      className={visualEffects.typography.enhanced.subtitle}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      {subtitle}
                    </motion.p>
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