'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  icon?: string;
}

const navigationItems: NavItem[] = [
  { href: '/', label: 'Single Platform Dashboard' },
  { href: '/unified', label: '🌐 Unified Platform Command Center' },
  { href: '/platforms', label: '⚙️ Platform Setup' },
  { href: '/campaigns', label: '📊 Campaign Management' },
  { href: '/leads', label: '🎯 Lead Management' },
  { href: '/analytics', label: '📊 Advanced Analytics' },
  { href: '/alerts', label: '🚨 Smart Alerts' },
  { href: '/status', label: '📈 System Status' },
];

export default function NavigationTabs() {
  const pathname = usePathname();

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8 overflow-x-auto scrollbar-hide" aria-label="Tabs">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  border-b-2 py-4 px-1 text-sm font-medium transition-all duration-200 whitespace-nowrap
                  ${
                    isActive
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-black dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}