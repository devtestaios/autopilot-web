'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { getBreadcrumbs } from '@/config/navigation';

export default function Breadcrumbs() {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);

  // Don't show breadcrumbs on dashboard (root)
  if (pathname === '/dashboard' || pathname === '/') {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6" aria-label="Breadcrumb">
      <Link
        href="/dashboard"
        className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>

      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center space-x-2">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {index === breadcrumbs.length - 1 ? (
            <span className="text-gray-900 dark:text-white font-medium">
              {crumb.label}
            </span>
          ) : (
            <Link
              href={crumb.href}
              className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
