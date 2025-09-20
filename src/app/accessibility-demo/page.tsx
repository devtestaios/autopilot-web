/**
 * =====================================================================================
 * ACCESSIBILITY DEMO PAGE
 * =====================================================================================
 * Purpose: Demonstrate WCAG AA compliant components and accessibility features
 * Features: Keyboard navigation, screen reader support, focus management
 * Created: September 2025
 * =====================================================================================
 */

import AccessibleComponentShowcase from '@/components/AccessibleComponentShowcase'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Accessibility Demo - PulseBridge.ai',
  description: 'WCAG AA compliant components showcasing accessibility best practices and inclusive design',
  keywords: 'accessibility, WCAG, a11y, inclusive design, keyboard navigation, screen reader',
}

export default function AccessibilityDemoPage() {
  return <AccessibleComponentShowcase />
}