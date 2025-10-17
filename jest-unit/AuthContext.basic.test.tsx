import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

// Test component to expose auth context values
function TestComponent() {
  const auth = useAuth();
  
  return (
    <div>
      <div data-testid="is-loading">{auth.isLoading.toString()}</div>
      <div data-testid="is-authenticated">{auth.isAuthenticated.toString()}</div>
      <div data-testid="user-email">{auth.user?.email || 'null'}</div>
      <div data-testid="has-login">{typeof auth.login === 'function' ? 'true' : 'false'}</div>
      <div data-testid="has-logout">{typeof auth.logout === 'function' ? 'true' : 'false'}</div>
      <div data-testid="has-signup">{typeof auth.signup === 'function' ? 'true' : 'false'}</div>
    </div>
  );
}

describe('AuthContext Basic Tests', () => {
  it('should provide auth context with basic functionality', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Should not be loading after initial render
    expect(screen.getByTestId('is-loading')).toHaveTextContent('false');
    
    // Should start unauthenticated
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('user-email')).toHaveTextContent('null');
    
    // Should provide all required function
    expect(screen.getByTestId('has-login')).toHaveTextContent('true');
    expect(screen.getByTestId('has-logout')).toHaveTextContent('true');
    expect(screen.getByTestId('has-signup')).toHaveTextContent('true');
  });

  it('should throw error when useAuth is used outside provider', () => {
    // Mock console.error to avoid test output pollution
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAuth must be used within an AuthProvider');
    
    consoleSpy.mockRestore();
  });

  it('should render provider without crashing', () => {
    expect(() => {
      render(
        <AuthProvider>
          <div>Test content</div>
        </AuthProvider>
      );
    }).not.toThrow();
  });

  it('should provide stable context values', () => {
    const { rerender } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const initialLoading = screen.getByTestId('is-loading').textContent;
    const initialAuth = screen.getByTestId('is-authenticated').textContent;

    // Rerender should maintain stable values
    rerender(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('is-loading')).toHaveTextContent(initialLoading || '');
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent(initialAuth || '');
  });

  it('should handle mock authentication mode gracefully', () => {
    // Test that the provider works in mock mode (when Supabase is not configured)
    const originalEnv = process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Should still provide basic functionality
    expect(screen.getByTestId('has-login')).toHaveTextContent('true');
    expect(screen.getByTestId('has-logout')).toHaveTextContent('true');
    expect(screen.getByTestId('has-signup')).toHaveTextContent('true');

    // Restore environment
    if (originalEnv) {
      process.env.NEXT_PUBLIC_SUPABASE_URL = originalEnv;
    }
  });
});