// Global Design Standards Configuration
// This file establishes the design system as the standard for all future implementations
// All new components and pages must follow these patterns for site-wide continuity

'use client';

import { designTokens } from '@/lib/designTokens';
import animations from '@/lib/animations';
import visualEffects from '@/lib/visualEffects';
import { Container, Grid, Flex, Section, Stack, Header, ContentArea, CardGrid } from '@/components/ui/LayoutSystem';
import { Button, Card, Badge, Spinner, Avatar, Progress } from '@/components/ui/EnhancedComponents';

// MANDATORY IMPORT PATTERN FOR ALL NEW PAGES
export const REQUIRED_DESIGN_IMPORTS = `
// Enhanced Design System Imports - Phase 1 Visual Polish (MANDATORY)
import { designTokens } from '@/lib/designTokens';
import animations from '@/lib/animations';
import visualEffects from '@/lib/visualEffects';
import { Container, Grid, Flex, Section, Stack, Header, ContentArea, CardGrid } from '@/components/ui/LayoutSystem';
import { Button, Card, Badge, Spinner, Avatar, Progress } from '@/components/ui/EnhancedComponents';
`;

// STANDARD PAGE LAYOUT PATTERN
export const STANDARD_PAGE_LAYOUT = {
  // 1. Container Structure
  container: {
    component: Container,
    props: { size: 'xl', padding: 'lg', center: true },
    className: 'min-h-screen bg-gray-50 dark:bg-gray-900'
  },
  
  // 2. Header Pattern
  header: {
    component: Header,
    props: { sticky: true, background: 'blur' },
    titleClass: `${visualEffects.typography.display.title} ${visualEffects.gradients.text.primary}`,
    subtitleClass: visualEffects.typography.enhanced.subtitle
  },
  
  // 3. Section Organization
  sections: {
    component: Section,
    sizes: { sm: 'sm', md: 'md', lg: 'lg', xl: 'xl' },
    backgrounds: ['transparent', 'muted', 'gradient']
  },
  
  // 4. Content Grid
  grid: {
    component: CardGrid,
    props: { minCardWidth: 280, gap: 'lg' },
    responsive: true
  }
};

// STANDARD COMPONENT PATTERNS
export const COMPONENT_PATTERNS = {
  // KPI Card Pattern
  kpiCard: {
    wrapper: 'motion.div',
    animation: 'animations.variants.cardHover',
    card: {
      variant: 'glassmorphism',
      interactive: true,
      className: 'p-6 group'
    },
    title: visualEffects.typography.enhanced.caption,
    value: `${visualEffects.typography.display.subtitle} ${visualEffects.gradients.text.primary}`,
    change: { component: Badge, variants: ['success', 'warning', 'error'] }
  },
  
  // Platform Suite Card Pattern
  platformCard: {
    card: {
      variant: 'glassmorphism',
      interactive: true,
      className: 'p-6 h-full group'
    },
    title: `${visualEffects.typography.enhanced.title} group-hover:${visualEffects.gradients.text.primary}`,
    description: visualEffects.typography.enhanced.body,
    button: { variant: 'primary', gradient: true, className: 'w-full' }
  },
  
  // Quick Action Card Pattern
  actionCard: {
    card: {
      variant: 'glassmorphism',
      interactive: true,
      className: 'p-5 cursor-pointer group'
    },
    icon: 'motion.div with whileHover={{ rotate: 5, scale: 1.1 }}',
    title: `${visualEffects.typography.enhanced.subtitle} group-hover:text-blue-600 transition-colors`,
    description: visualEffects.typography.enhanced.caption
  }
};

// ANIMATION STANDARDS
export const ANIMATION_STANDARDS = {
  // Page Load
  pageLoad: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' }
  },
  
  // Staggered Lists
  staggeredList: {
    container: animations.variants.stagger,
    item: animations.variants.fadeInUp,
    delay: 'index * 0.1'
  },
  
  // Card Interactions
  cardHover: {
    variants: animations.variants.cardHover,
    whileHover: 'hover',
    whileTap: 'tap'
  },
  
  // Micro-interactions
  microInteractions: {
    iconRotation: { rotate: 5, scale: 1.1 },
    buttonScale: { scale: 0.98 },
    slideIn: { x: 4 }
  }
};

// COLOR USAGE STANDARDS
export const COLOR_STANDARDS = {
  // Status Colors
  status: {
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    error: 'text-red-600 dark:text-red-400',
    info: 'text-blue-600 dark:text-blue-400'
  },
  
  // Interactive States
  interactive: {
    primary: 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300',
    secondary: 'text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
  },
  
  // Semantic Usage
  semantic: {
    revenue: 'text-green-600',
    campaigns: 'text-blue-600',
    conversion: 'text-purple-600',
    team: 'text-orange-600'
  }
};

// ACCESSIBILITY STANDARDS (MANDATORY)
export const ACCESSIBILITY_STANDARDS = {
  // Focus States (Required)
  focus: visualEffects.accessibility.focus.ring,
  
  // Color Contrast (WCAG 2.2 AAA)
  contrast: visualEffects.accessibility.contrast,
  
  // Screen Reader Support
  screenReader: visualEffects.accessibility.sr,
  
  // Keyboard Navigation
  keyboard: 'All interactive elements must be keyboard accessible',
  
  // Motion Preferences
  motion: visualEffects.performance.reduceMotion
};

// RESPONSIVE DESIGN STANDARDS
export const RESPONSIVE_STANDARDS = {
  // Breakpoints (Following Tailwind)
  breakpoints: {
    sm: '640px',
    md: '768px', 
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  
  // Grid Behavior
  gridResponsive: {
    mobile: '1 column',
    tablet: '2 columns',
    desktop: '3-4 columns',
    ultrawide: '4+ columns'
  },
  
  // Typography Scaling
  typography: {
    mobile: 'Smaller font sizes, tighter spacing',
    desktop: 'Full typography scale, comfortable spacing'
  }
};

// PERFORMANCE STANDARDS
export const PERFORMANCE_STANDARDS = {
  // Animation Performance
  animations: {
    fps: '60fps target',
    gpu: 'GPU acceleration required (transform-gpu)',
    duration: 'Keep under 500ms for micro-interactions'
  },
  
  // Component Loading
  loading: {
    lazy: 'Use dynamic imports for heavy components',
    ssr: 'SSR-safe patterns required',
    skeleton: 'Provide loading states for all async content'
  },
  
  // Bundle Size
  optimization: {
    imports: 'Import only what you need',
    treeshaking: 'Ensure proper tree-shaking',
    splitting: 'Code split heavy components'
  }
};

// IMPLEMENTATION CHECKLIST (For all new pages/components)
export const IMPLEMENTATION_CHECKLIST = {
  required: [
    '✅ Import enhanced design system components',
    '✅ Use Container, Section, Grid layout pattern',
    '✅ Apply glassmorphism design language',
    '✅ Implement micro-interactions with animations',
    '✅ Use semantic color system',
    '✅ Ensure WCAG 2.2 AAA accessibility',
    '✅ Test responsive behavior',
    '✅ Verify 60fps animation performance',
    '✅ Add proper loading states',
    '✅ Follow SSR-safe patterns'
  ],
  
  patterns: [
    '📋 Use standard KPI card pattern for metrics',
    '📋 Use platform card pattern for navigation',
    '📋 Use action card pattern for quick actions',
    '📋 Apply consistent typography hierarchy',
    '📋 Implement standard page load animations',
    '📋 Use Badge components for status indicators',
    '📋 Apply glassmorphism to key UI elements'
  ]
};

// QUICK START TEMPLATE
export const QUICK_START_TEMPLATE = `
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Enhanced Design System Imports - Phase 1 Visual Polish (MANDATORY)
import { designTokens } from '@/lib/designTokens';
import animations from '@/lib/animations';
import visualEffects from '@/lib/visualEffects';
import { Container, Grid, Flex, Section, Stack, Header, ContentArea, CardGrid } from '@/components/ui/LayoutSystem';
import { Button, Card, Badge, Spinner, Avatar, Progress } from '@/components/ui/EnhancedComponents';

export default function NewPlatformPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar and Navigation */}
      <UnifiedSidebar onCollapseChange={setSidebarCollapsed} />
      
      <div className={\`transition-all duration-300 \${sidebarCollapsed ? 'ml-14' : 'ml-56'}\`}>
        <AdvancedNavigation sidebarCollapsed={sidebarCollapsed} />
        
        <Container size="xl" padding="lg" center>
          {/* Enhanced Header */}
          <Header sticky background="blur">
            <Flex justify="between" align="center" className="w-full">
              <Stack space="xs">
                <h1 className={\`\${visualEffects.typography.display.title} \${visualEffects.gradients.text.primary}\`}>
                  Platform Title
                </h1>
                <p className={visualEffects.typography.enhanced.subtitle}>
                  Platform description
                </p>
              </Stack>
              <Badge variant="success" size="lg" dot>
                System Status
              </Badge>
            </Flex>
          </Header>
          
          {/* Content Sections */}
          <Section size="lg">
            <CardGrid minCardWidth={280} gap="lg">
              {/* Your enhanced content here */}
            </CardGrid>
          </Section>
        </Container>
      </div>
    </div>
  );
}
`;

// Export all standards for global usage
export default {
  REQUIRED_DESIGN_IMPORTS,
  STANDARD_PAGE_LAYOUT,
  COMPONENT_PATTERNS,
  ANIMATION_STANDARDS,
  COLOR_STANDARDS,
  ACCESSIBILITY_STANDARDS,
  RESPONSIVE_STANDARDS,
  PERFORMANCE_STANDARDS,
  IMPLEMENTATION_CHECKLIST,
  QUICK_START_TEMPLATE
};