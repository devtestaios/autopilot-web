'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Sparkles, 
  BarChart3, 
  Target, 
  Zap,
  HelpCircle,
  ChevronDown
} from 'lucide-react';
import { PremiumButton } from './PremiumButton';
import { cn } from '@/lib/utils';

interface ActionItem {
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
  onClick: () => void;
}

export interface ActionDropdownProps {
  className?: string;
  onNewCampaign?: () => void;
  onAnalytics?: () => void;
  onOptimization?: () => void;
  onGoals?: () => void;
  onHelp?: () => void;
}

export default function ActionDropdown({ 
  className,
  onNewCampaign,
  onAnalytics,
  onOptimization,
  onGoals,
  onHelp
}: ActionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const actionItems: ActionItem[] = [
    {
      icon: <Sparkles className="w-5 h-5" />,
      label: 'New Campaign',
      description: 'Create a new marketing campaign',
      color: 'text-pulse-cyan',
      onClick: () => {
        onNewCampaign?.();
        setIsOpen(false);
      }
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      label: 'Analytics',
      description: 'View detailed performance analytics',
      color: 'text-green-600',
      onClick: () => {
        onAnalytics?.();
        setIsOpen(false);
      }
    },
    {
      icon: <Target className="w-5 h-5" />,
      label: 'Goals',
      description: 'Set and track campaign goals',
      color: 'text-orange-600',
      onClick: () => {
        onGoals?.();
        setIsOpen(false);
      }
    },
    {
      icon: <Zap className="w-5 h-5" />,
      label: 'AI Optimizer',
      description: 'Automated campaign optimization',
      color: 'text-purple-600',
      onClick: () => {
        onOptimization?.();
        setIsOpen(false);
      }
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      label: 'Help',
      description: 'Get help and support',
      color: 'text-blue-600',
      onClick: () => {
        onHelp?.();
        setIsOpen(false);
      }
    }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      {/* Dropdown Trigger Button */}
      <PremiumButton
        variant="primary"
        size="default"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
        glow
      >
        <Plus className="w-4 h-4" />
        <span>Quick Actions</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </PremiumButton>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 z-50"
          >
            <div className="p-2">
              {actionItems.map((item, index) => (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    transition: { delay: index * 0.05 }
                  }}
                  onClick={item.onClick}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-all duration-200 group"
                >
                  <div className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200',
                    'bg-gray-100 dark:bg-gray-700 group-hover:bg-white dark:group-hover:bg-gray-600',
                    item.color
                  )}>
                    {item.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900 dark:text-white text-sm">
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.description}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}