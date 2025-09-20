/**
 * =====================================================================================
 * MOBILE-RESPONSIVE DASHBOARD COMPONENT
 * =====================================================================================
 * Purpose: Mobile-optimized dashboard with touch-friendly interactions and responsive design
 * Features: Mobile navigation, responsive grid, touch targets, and optimized layouts
 * Created: September 2025
 * =====================================================================================
 */

'use client'

import * as React from "react"
import { useState, useEffect } from "react"
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  MetricCard,
  FeatureCard 
} from "@/components/ui/enhanced-card"
import { 
  Badge, 
  StatusBadge, 
  NotificationBadge 
} from "@/components/ui/enhanced-badge"
import { 
  LoadingSpinner,
  ProgressBar 
} from "@/components/ui/loading-states"

interface MobileNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'campaigns', label: 'Campaigns', icon: '🎯' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'automation', label: 'AI', icon: '🤖' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <nav className="mobile-nav md:hidden">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`mobile-nav-item touch-target ${
              activeTab === item.id ? 'active' : ''
            }`}
          >
            <span className="mobile-nav-icon">{item.icon}</span>
            <span className="mobile-nav-label">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

interface MobileHeaderProps {
  title: string
  onMenuClick: () => void
  notifications?: number
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ title, onMenuClick, notifications = 0 }) => {
  return (
    <header className="mobile-header md:hidden">
      <div className="mobile-header-content">
        <div className="flex items-center gap-3">
          <button 
            onClick={onMenuClick}
            className="touch-target touch-padding-sm"
            aria-label="Open menu"
          >
            <span className="text-xl">☰</span>
          </button>
          <h1 className="mobile-header-title">{title}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <button className="touch-target touch-padding-sm" aria-label="Notifications">
              <span className="text-xl">🔔</span>
            </button>
            {notifications > 0 && (
              <NotificationBadge 
                count={notifications} 
                className="absolute -top-1 -right-1"
              />
            )}
          </div>
          
          <button 
            className="touch-target touch-padding-sm" 
            aria-label="User profile"
          >
            <span className="text-xl">👤</span>
          </button>
        </div>
      </div>
    </header>
  )
}

interface MobileModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

const MobileModal: React.FC<MobileModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="mobile-modal md:hidden">
      <div 
        className="mobile-modal-backdrop"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className="mobile-modal-content">
        <div className="mobile-modal-handle"></div>
        
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button 
            onClick={onClose}
            className="touch-target touch-padding-sm"
            aria-label="Close"
          >
            <span className="text-xl">✕</span>
          </button>
        </div>
        
        <div className="max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function MobileResponsiveDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [notifications] = useState(7)
  
  // Mock data
  const metrics = [
    { title: "Revenue", value: "$45.2K", change: { value: 12.5, type: "increase" as const } },
    { title: "Campaigns", value: "18", change: { value: 3, type: "increase" as const } },
    { title: "CTR", value: "3.8%", change: { value: 0.5, type: "decrease" as const } },
    { title: "ROAS", value: "4.2x", change: { value: 8.2, type: "increase" as const } },
  ]

  const campaigns = [
    { name: "Summer Sale 2025", status: "active", budget: "$2,500", spend: "$1,890" },
    { name: "Brand Awareness", status: "pending", budget: "$1,200", spend: "$0" },
    { name: "Product Launch", status: "active", budget: "$3,000", spend: "$2,100" },
  ]

  const recentActivities = [
    { action: "Campaign optimized", time: "2 min ago", type: "success" },
    { action: "Budget alert triggered", time: "15 min ago", type: "warning" },
    { action: "New conversion recorded", time: "1 hour ago", type: "success" },
    { action: "Keyword bid adjusted", time: "2 hours ago", type: "info" },
  ]

  const openCampaignModal = () => {
    setIsModalOpen(true)
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case 'campaigns': return 'Campaigns'
      case 'analytics': return 'Analytics'
      case 'automation': return 'AI Automation'
      case 'settings': return 'Settings'
      default: return 'Dashboard'
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'campaigns':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Active Campaigns</h2>
              <button 
                onClick={openCampaignModal}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg touch-target text-sm font-medium"
              >
                + New Campaign
              </button>
            </div>
            
            <div className="space-y-3">
              {campaigns.map((campaign, index) => (
                <Card key={index} className="touch-padding">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-mobile-base">{campaign.name}</h3>
                      <StatusBadge status={campaign.status as any} />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Budget</p>
                        <p className="font-medium">{campaign.budget}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Spend</p>
                        <p className="font-medium">{campaign.spend}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      
      case 'analytics':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Performance Analytics</h2>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">Conversion Trends</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>This Week</span>
                    <span className="font-medium">156 conversions</span>
                  </div>
                  <ProgressBar value={75} variant="success" showLabel />
                  
                  <div className="flex justify-between text-sm">
                    <span>Last Week</span>
                    <span className="font-medium">134 conversions</span>
                  </div>
                  <ProgressBar value={65} variant="default" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-3">Top Performing Keywords</h3>
                <div className="space-y-2">
                  {['marketing automation', 'AI advertising', 'campaign optimization'].map((keyword, index) => (
                    <div key={keyword} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                      <span className="text-sm">{keyword}</span>
                      <Badge variant="outline" size="sm">{Math.floor(Math.random() * 100) + 50} clicks</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )
      
      case 'automation':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">AI Automation</h2>
            
            <Card variant="premium">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">🤖</span>
                  <div>
                    <h3 className="font-medium">AI Campaign Optimizer</h3>
                    <p className="text-sm text-muted-foreground">Active</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Optimization Status</span>
                    <div className="flex items-center gap-2">
                      <LoadingSpinner size="xs" />
                      <span className="text-sm">Analyzing...</span>
                    </div>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <p>✅ Bid adjustments applied</p>
                    <p>✅ Keywords optimized</p>
                    <p>🔄 Budget reallocation in progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-3">
              <h3 className="font-medium">Recent AI Actions</h3>
              {recentActivities.map((activity, index) => (
                <Card key={index}>
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{activity.action}</span>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      
      case 'settings':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Settings</h2>
            
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Get alerts on mobile</p>
                  </div>
                  <div className="w-12 h-6 bg-primary rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Auto-optimization</p>
                    <p className="text-sm text-muted-foreground">Let AI manage campaigns</p>
                  </div>
                  <div className="w-12 h-6 bg-muted rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5"></div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">Use dark theme</p>
                  </div>
                  <div className="w-12 h-6 bg-primary rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="font-medium">Account</h3>
                <div className="space-y-2">
                  <button className="w-full text-left py-2 text-sm hover:bg-muted rounded touch-padding">
                    Edit Profile
                  </button>
                  <button className="w-full text-left py-2 text-sm hover:bg-muted rounded touch-padding">
                    Billing & Subscription
                  </button>
                  <button className="w-full text-left py-2 text-sm hover:bg-muted rounded touch-padding">
                    API Keys
                  </button>
                  <button className="w-full text-left py-2 text-sm text-destructive hover:bg-muted rounded touch-padding">
                    Sign Out
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      
      default:
        return (
          <div className="space-y-6">
            {/* Metrics Grid - Mobile Optimized */}
            <div className="mobile-card-grid">
              {metrics.map((metric, index) => (
                <div
                  key={metric.title}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <MetricCard
                    title={metric.title}
                    value={metric.value}
                    change={metric.change}
                    interactive="hover"
                    className="h-full"
                  />
                </div>
              ))}
            </div>
            
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-mobile-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={openCampaignModal}
                    className="bg-primary text-primary-foreground p-4 rounded-lg touch-target flex flex-col items-center gap-2"
                  >
                    <span className="text-xl">🎯</span>
                    <span className="text-sm font-medium">New Campaign</span>
                  </button>
                  
                  <button className="bg-secondary text-secondary-foreground p-4 rounded-lg touch-target flex flex-col items-center gap-2">
                    <span className="text-xl">📊</span>
                    <span className="text-sm font-medium">View Reports</span>
                  </button>
                  
                  <button className="bg-accent text-accent-foreground p-4 rounded-lg touch-target flex flex-col items-center gap-2">
                    <span className="text-xl">🤖</span>
                    <span className="text-sm font-medium">AI Insights</span>
                  </button>
                  
                  <button className="bg-muted text-muted-foreground p-4 rounded-lg touch-target flex flex-col items-center gap-2">
                    <span className="text-xl">⚙️</span>
                    <span className="text-sm font-medium">Settings</span>
                  </button>
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-mobile-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                      <span className="text-mobile-sm">{activity.action}</span>
                      <span className="text-mobile-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <MobileHeader 
        title={getPageTitle()}
        onMenuClick={() => setIsMenuOpen(true)}
        notifications={notifications}
      />
      
      {/* Desktop Header (hidden on mobile) */}
      <div className="hidden md:block p-6 border-b border-border">
        <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
      </div>
      
      {/* Main Content */}
      <main className="mobile-container pb-20 md:pb-6">
        {renderTabContent()}
      </main>
      
      {/* Mobile Navigation */}
      <MobileNavigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      {/* Mobile Modal */}
      <MobileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Campaign"
      >
        <div className="space-y-4">
          <div className="mobile-form-group">
            <label className="mobile-form-label">Campaign Name</label>
            <input 
              type="text" 
              className="mobile-input" 
              placeholder="Enter campaign name"
            />
          </div>
          
          <div className="mobile-form-group">
            <label className="mobile-form-label">Budget</label>
            <input 
              type="number" 
              className="mobile-input" 
              placeholder="$0.00"
            />
          </div>
          
          <div className="mobile-form-group">
            <label className="mobile-form-label">Platform</label>
            <select className="mobile-input mobile-select">
              <option>Google Ads</option>
              <option>Meta Ads</option>
              <option>LinkedIn Ads</option>
            </select>
          </div>
          
          <div className="flex gap-3 pt-4">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="flex-1 bg-secondary text-secondary-foreground py-3 rounded-lg touch-target font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={() => setIsModalOpen(false)}
              className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg touch-target font-medium"
            >
              Create Campaign
            </button>
          </div>
        </div>
      </MobileModal>
    </div>
  )
}

/**
 * =====================================================================================
 * USAGE INTEGRATION
 * =====================================================================================
 * 
 * To use this component:
 * 1. Import mobile-ux.css in your globals.css file
 * 2. Ensure all enhanced UI components are available
 * 3. Add this component to a page route for testing
 * 
 * Example integration:
 * - Add to src/app/mobile-demo/page.tsx
 * - Import and use: <MobileResponsiveDashboard />
 * - Test on mobile devices or browser developer tools
 * 
 * =====================================================================================
 */