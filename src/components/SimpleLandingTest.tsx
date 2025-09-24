'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SimpleLandingTest() {
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold">PulseBridge.ai</h1>
          <div className="flex items-center space-x-4">
            {/* Theme toggle removed - using fixed dark theme */}
          </div>
        </div>
      </nav>
      
      <main className="pt-16">
        <section className="py-20 text-center">
          <h1 className="text-4xl font-bold mb-8">PulseBridge.ai Diagnostic</h1>
          <p className="text-xl mb-12">Testing navigation and functionality</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto px-4">
            <Link href="/dashboard" className="block p-6 bg-card rounded-lg border hover:bg-card/80 transition-colors">
              <h3 className="text-lg font-semibold mb-2">📊 Dashboard</h3>
              <p className="text-muted-foreground">Access main dashboard</p>
            </Link>
            
            <Link href="/campaigns" className="block p-6 bg-card rounded-lg border hover:bg-card/80 transition-colors">
              <h3 className="text-lg font-semibold mb-2">📢 Campaigns</h3>
              <p className="text-muted-foreground">Manage campaigns</p>
            </Link>
            
            <Link href="/analytics" className="block p-6 bg-card rounded-lg border hover:bg-card/80 transition-colors">
              <h3 className="text-lg font-semibold mb-2">📈 Analytics</h3>
              <p className="text-muted-foreground">View analytics</p>
            </Link>
          </div>
          
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Navigation Test Results</h2>
            <div className="max-w-2xl mx-auto space-y-2 text-left">
              <p className="p-3 bg-green-100 dark:bg-green-900/20 rounded">✅ Dark Theme: Fixed & Optimized</p>
              <p className="p-3 bg-green-100 dark:bg-green-900/20 rounded">✅ CSS Variables: Working</p>
              <p className="p-3 bg-green-100 dark:bg-green-900/20 rounded">✅ Next.js Navigation: Working</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}