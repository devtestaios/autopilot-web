'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Zap, 
  Shield, 
  DollarSign, 
  Target, 
  Globe, 
  Clock, 
  Users, 
  BarChart3,
  ChevronRight,
  ChevronDown,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  AlertTriangle,
  Bell,
  X
} from 'lucide-react';
import { PremiumCard } from './ui/PremiumCard';

interface AdvancedSettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const settingSections = [
  {
    id: 'automation',
    title: 'Automation Rules',
    icon: Zap,
    color: 'text-pulse-blue',
    settings: [
      { id: 'auto_pause', label: 'Auto-pause underperforming ads', enabled: true },
      { id: 'budget_optimization', label: 'Automatic budget redistribution', enabled: true },
      { id: 'bid_optimization', label: 'Smart bid adjustments', enabled: false },
      { id: 'keyword_expansion', label: 'Auto-expand high-performing keywords', enabled: true }
    ]
  },
  {
    id: 'alerts',
    title: 'Smart Alerts',
    icon: Bell,
    color: 'text-energy-magenta',
    settings: [
      { id: 'performance_alerts', label: 'Performance threshold alerts', enabled: true },
      { id: 'budget_alerts', label: 'Budget overspend warnings', enabled: true },
      { id: 'anomaly_detection', label: 'Anomaly detection alerts', enabled: false },
      { id: 'competitor_alerts', label: 'Competitor activity notifications', enabled: true }
    ]
  },
  {
    id: 'budgets',
    title: 'Budget Controls',
    icon: DollarSign,
    color: 'text-green-500',
    settings: [
      { id: 'daily_limits', label: 'Daily spending limits', enabled: true },
      { id: 'emergency_stop', label: 'Emergency stop triggers', enabled: true },
      { id: 'rollover_budget', label: 'Budget rollover management', enabled: false },
      { id: 'forecasting', label: 'Spend forecasting alerts', enabled: true }
    ]
  },
  {
    id: 'targeting',
    title: 'Advanced Targeting',
    icon: Target,
    color: 'text-bridge-purple',
    settings: [
      { id: 'geo_optimization', label: 'Geographic performance optimization', enabled: true },
      { id: 'audience_expansion', label: 'Automatic audience expansion', enabled: false },
      { id: 'device_optimization', label: 'Device-based bid adjustments', enabled: true },
      { id: 'time_optimization', label: 'Time-of-day optimization', enabled: true }
    ]
  },
  {
    id: 'integrations',
    title: 'API Integrations',
    icon: Globe,
    color: 'text-orange-500',
    settings: [
      { id: 'google_ads_sync', label: 'Google Ads real-time sync', enabled: true },
      { id: 'meta_integration', label: 'Meta Ads integration', enabled: false },
      { id: 'analytics_sync', label: 'Google Analytics sync', enabled: true },
      { id: 'crm_integration', label: 'CRM data integration', enabled: false }
    ]
  }
];

const sidebarVariants = {
  open: {
    x: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 }
  },
  closed: {
    x: -320,
    transition: { type: "spring" as const, stiffness: 300, damping: 30 }
  }
};

const itemVariants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: -20 }
};

export default function AdvancedSettingsSidebar({ isOpen, onClose }: AdvancedSettingsSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>(['automation']);
  const [settings, setSettings] = useState<Record<string, boolean>>(() => {
    const initialSettings: Record<string, boolean> = {};
    settingSections.forEach(section => {
      section.settings.forEach(setting => {
        initialSettings[setting.id] = setting.enabled;
      });
    });
    return initialSettings;
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleSetting = (settingId: string) => {
    setSettings(prev => ({
      ...prev,
      [settingId]: !prev[settingId]
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            className="fixed left-0 top-0 h-full w-80 max-w-[80vw] bg-card border-r border-border shadow-2xl z-50 overflow-hidden"
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-pulse-blue/10 to-bridge-purple/10 border-b border-border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-pulse-blue to-bridge-purple rounded-lg">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Advanced Settings</h3>
                    <p className="text-xs text-muted-foreground">Campaign automation & controls</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-secondary rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Settings Sections */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {settingSections.map((section) => {
                const isExpanded = expandedSections.includes(section.id);
                const Icon = section.icon;
                
                return (
                  <motion.div
                    key={section.id}
                    variants={itemVariants}
                    initial="closed"
                    animate="open"
                    transition={{ delay: 0.1 }}
                  >
                    <PremiumCard className="overflow-hidden">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${section.color}`} />
                          <span className="font-medium">{section.title}</span>
                        </div>
                        <ChevronDown 
                          className={`w-4 h-4 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`} 
                        />
                      </button>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-t border-border"
                          >
                            <div className="p-4 space-y-3">
                              {section.settings.map((setting) => (
                                <div
                                  key={setting.id}
                                  className="flex items-center justify-between"
                                >
                                  <label className="text-sm font-medium cursor-pointer">
                                    {setting.label}
                                  </label>
                                  <button
                                    onClick={() => toggleSetting(setting.id)}
                                    className={`relative w-10 h-6 rounded-full transition-colors ${
                                      settings[setting.id]
                                        ? 'bg-pulse-blue'
                                        : 'bg-secondary'
                                    }`}
                                  >
                                    <div
                                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                        settings[setting.id]
                                          ? 'translate-x-5'
                                          : 'translate-x-1'
                                      }`}
                                    />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </PremiumCard>
                  </motion.div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-border p-4">
              <div className="text-xs text-muted-foreground text-center">
                <p>Settings auto-save</p>
                <p className="mt-1">Last updated: {new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}