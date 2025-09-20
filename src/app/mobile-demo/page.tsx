/**
 * =====================================================================================
 * MOBILE UX DEMO PAGE
 * =====================================================================================
 * Purpose: Demonstrate mobile-optimized dashboard and enhanced UI components
 * Features: Responsive design, touch interactions, mobile navigation
 * Created: September 2025
 * =====================================================================================
 */

import MobileResponsiveDashboard from '@/components/MobileResponsiveDashboard'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mobile UX Demo - PulseBridge.ai',
  description: 'Mobile-optimized dashboard demonstrating enhanced UX and responsive design',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function MobileUXDemoPage() {
  return <MobileResponsiveDashboard />
}