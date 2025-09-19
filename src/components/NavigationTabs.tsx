'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, BarChart3, Target, TrendingUp, Zap, Settings, AlertTriangle, Globe, Home } from 'lucide-react';
import { PulseWaveLogo } from './PulseWaveLogo';
import { ThemeToggle } from './ui/ThemeToggle';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

const navigationItems: NavItem[] = [
  { href: '/', label: 'Dashboard', icon: Home, description: 'Main platform overview' },
  { href: '/unified', label: 'Unified Command', icon: Globe, description: 'Multi-platform control center' },
  { href: '/platforms', label: 'Platform Setup', icon: Settings, description: 'Configure integrations' },
  { href: '/campaigns', label: 'Campaigns', icon: Target, description: 'Manage marketing campaigns' },
  { href: '/leads', label: 'Lead Management', icon: TrendingUp, description: 'Track and optimize leads' },
  { href: '/analytics', label: 'Analytics', icon: BarChart3, description: 'Advanced performance insights' },
  { href: '/alerts', label: 'Smart Alerts', icon: AlertTriangle, description: 'AI-powered notifications' },
  { href: '/status', label: 'System Status', icon: Zap, description: 'Platform health monitoring' },
];

export default function NavigationTabs() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-card/95 backdrop-blur-lg border-b border-border transition-all duration-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Logo */}
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center space-x-3">
            <PulseWaveLogo size="small" animated={true} showText={true} />
          </Link>
          
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors duration-200 border border-border"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-1 overflow-x-auto scrollbar-hide pb-2" aria-label="Main navigation">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group relative flex items-center space-x-2 px-4 py-3 rounded-lg
                  font-medium text-sm transition-all duration-200 whitespace-nowrap
                  hover:bg-muted/80 hover:scale-105
                  ${isActive
                    ? 'bg-gradient-to-r from-pulse-blue/10 to-bridge-purple/10 text-pulse-blue border border-pulse-blue/20 shadow-lg shadow-pulse-blue/10'
                    : 'text-muted-foreground hover:text-foreground border border-transparent'
                  }
                `}
                title={item.description}
              >
                <IconComponent className={`w-4 h-4 transition-colors ${isActive ? 'text-pulse-blue' : 'text-muted-foreground group-hover:text-foreground'}`} />
                <span className="font-exo-2">{item.label}</span>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-pulse-blue to-energy-magenta rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-border pt-4 animate-fade-in">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              const IconComponent = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium
                    transition-all duration-200 border
                    ${isActive
                      ? 'bg-gradient-to-r from-pulse-blue/10 to-bridge-purple/10 text-pulse-blue border-pulse-blue/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border-transparent'
                    }
                  `}
                >
                  <IconComponent className={`w-4 h-4 ${isActive ? 'text-pulse-blue' : 'text-muted-foreground'}`} />
                  <div>
                    <div className="font-exo-2">{item.label}</div>
                    {item.description && (
                      <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}