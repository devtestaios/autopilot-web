/**
 * =====================================================================================
 * AUTOPILOT REPORTS & EXPORT DASHBOARD
 * =====================================================================================
 * Purpose: Main reports dashboard integrating data export, report templates,
 *          scheduled reports, and comprehensive analytics
 * Features: Complete data export system with navigation integration
 * Created: September 2025
 * =====================================================================================
 */

'use client'

import React from 'react'
import DataExportReporting from '@/components/DataExportReporting'

export default function ReportsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <DataExportReporting />
      </div>
    </div>
  )
}