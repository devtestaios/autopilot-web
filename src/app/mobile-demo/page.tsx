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
import { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Mobile UX Demo - PulseBridge.ai',
  description: 'Mobile-optimized dashboard demonstrating enhanced UX and responsive design',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function MobileUXDemoPage() {
  return <MobileResponsiveDashboard />
}