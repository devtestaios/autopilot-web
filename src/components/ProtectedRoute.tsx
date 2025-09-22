'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/LoadingComponents';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user' | 'viewer';
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole = 'user',
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        router.push(redirectTo);
        return;
      }

      if (requiredRole && user) {
        // Check role hierarchy: admin > user > viewer
        const roles = ['viewer', 'user', 'admin'];
        const userRoleIndex = roles.indexOf(user.role);
        const requiredRoleIndex = roles.indexOf(requiredRole);

        if (userRoleIndex < requiredRoleIndex) {
          // User doesn't have sufficient permissions
          router.push('/dashboard?error=insufficient_permissions');
          return;
        }
      }
    }
  }, [isLoading, isAuthenticated, user, requiredRole, redirectTo, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-800 dark:text-gray-400">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated or insufficient permissions
  if (!isAuthenticated || (requiredRole && user && !hasRequiredRole(user.role, requiredRole))) {
    return null;
  }

  return <>{children}</>;
}

// Helper function to check role permissions
function hasRequiredRole(userRole: 'admin' | 'user' | 'viewer', requiredRole: 'admin' | 'user' | 'viewer'): boolean {
  const roles = ['viewer', 'user', 'admin'];
  const userRoleIndex = roles.indexOf(userRole);
  const requiredRoleIndex = roles.indexOf(requiredRole);
  return userRoleIndex >= requiredRoleIndex;
}

// Higher-order component for protecting pages
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: { requiredRole?: 'admin' | 'user' | 'viewer'; redirectTo?: string } = {}
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute requiredRole={options.requiredRole} redirectTo={options.redirectTo}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}