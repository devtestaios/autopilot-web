'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Sparkles, 
  BarChart3, 
  Target, 
  Zap,
  MessageCircle,
  HelpCircle,
  Settings
} from 'lucide-react';
import { PremiumButton } from './PremiumButton';
import { cn } from '@/lib/utils';

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  href: string;
  color: string;
}

const quickActions: QuickAction[] = [
  {
    icon: <Sparkles className="w-4 h-4" />,
    label: 'New Campaign',
    href: '/campaigns/new',
    color: 'from-pulse-cyan to-pulse-purple'
  },
  {
    icon: <BarChart3 className="w-4 h-4" />,
    label: 'Analytics',
    href: '/analytics',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: <Target className="w-4 h-4" />,
    label: 'Goals',
    href: '/goals',
    color: 'from-orange-500 to-orange-600'
  },
  {
    icon: <Zap className="w-4 h-4" />,
    label: 'AI Optimizer',
    href: '/optimizer',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: <HelpCircle className="w-4 h-4" />,
    label: 'Help',
    href: '/help',
    color: 'from-blue-500 to-blue-600'
  }
];

export interface FloatingActionButtonProps {
  className?: string;
}

export default function FloatingActionButton({ className }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn('fixed bottom-6 right-6 z-50', className)}>
      {/* Quick Action Items */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {quickActions.map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0, x: 50 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  x: 0,
                  transition: { delay: index * 0.1 }
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0, 
                  x: 50,
                  transition: { delay: (quickActions.length - index - 1) * 0.05 }
                }}
                className="flex items-center gap-3"
              >
                {/* Label */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                >
                  <span className="text-sm font-medium text-gray-900 dark:text-white whitespace-nowrap">
                    {action.label}
                  </span>
                </motion.div>
                
                {/* Action Button */}
                <motion.a
                  href={action.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    'flex items-center justify-center w-12 h-12 rounded-full shadow-lg',
                    'bg-gradient-to-r text-white transition-all duration-200',
                    'hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pulse-cyan/50',
                    `bg-gradient-to-r ${action.color}`
                  )}
                >
                  {action.icon}
                </motion.a>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'flex items-center justify-center w-16 h-16 rounded-full shadow-2xl',
          'bg-gradient-to-r from-pulse-cyan to-pulse-purple text-white',
          'hover:shadow-pulse-cyan/50 transition-all duration-300',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pulse-cyan/50',
          'border-4 border-white/20'
        )}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Plus className="w-8 h-8" />
        </motion.div>
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}