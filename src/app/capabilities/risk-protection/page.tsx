'use client';

import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import { PremiumButton } from '@/components/ui/PremiumButton';

export default function RiskProtectionPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative z-50 p-6">
        <Link 
          href="/"
          className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>

      <section className="px-6 py-20 bg-gradient-to-br from-deep-space via-bridge-purple/10 to-pulse-blue/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-pulse-blue/10 to-bridge-purple/10 border border-pulse-blue/30 mb-6">
            <Shield className="w-5 h-5 text-pulse-blue mr-2" />
            <span className="text-sm font-medium text-pulse-blue">Risk Protection</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-orbitron font-bold mb-6">
            <span className="bg-gradient-to-r from-pulse-blue via-bridge-purple to-energy-magenta bg-clip-text text-transparent">
              Your Budget
            </span>
            <br />
            <span className="text-foreground">Protected 24/7</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            Built-in safeguards prevent overspending and automatically pause underperforming campaigns. Your budget is protected around the clock.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <PremiumButton size="lg" className="text-lg px-8 py-4">
              See Protection Demo
            </PremiumButton>
            <PremiumButton variant="outline" size="lg" className="text-lg px-8 py-4">
              Learn More
            </PremiumButton>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Coming Soon</h2>
          <p className="text-xl text-muted-foreground mb-8">
            We're creating detailed examples of our risk protection features and budget safeguards. 
            Stay tuned for interactive demos!
          </p>
          <PremiumButton>
            Notify Me When Ready
          </PremiumButton>
        </div>
      </section>
    </div>
  );
}