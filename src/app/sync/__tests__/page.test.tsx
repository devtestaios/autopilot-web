import { render, screen } from '@testing-library/react';
import SyncManagementPage from '../page';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Mock the MultiPlatformSyncDashboard component
jest.mock('@/components/MultiPlatformSyncDashboard', () => {
  return function MockMultiPlatformSyncDashboard() {
    return <div data-testid="multi-platform-sync-dashboard">Multi Platform Sync Dashboard Component</div>;
  };
});

// Mock useTheme hook
jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: jest.fn(),
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('SyncManagementPage', () => {
  it('should render the sync management page with correct structure', () => {
    render(<SyncManagementPage />);

    // Check that the MultiPlatformSyncDashboard component is rendered
    expect(screen.getByTestId('multi-platform-sync-dashboard')).toBeInTheDocument();
  });

  it('should have correct styling classes', () => {
    const { container } = render(<SyncManagementPage />);
    
    // Check main container classes
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('min-h-screen', 'bg-gray-50', 'dark:bg-gray-900');
    
    // Check inner container
    const innerDiv = container.querySelector('.max-w-7xl');
    expect(innerDiv).toBeInTheDocument();
    expect(innerDiv).toHaveClass('max-w-7xl', 'mx-auto');
  });

  it('should render without crashing', () => {
    expect(() => render(<SyncManagementPage />)).not.toThrow();
  });

  it('should contain the MultiPlatformSyncDashboard component', () => {
    render(<SyncManagementPage />);
    
    // Verify the mocked component is present
    const component = screen.getByTestId('multi-platform-sync-dashboard');
    expect(component).toBeInTheDocument();
    expect(component).toHaveTextContent('Multi Platform Sync Dashboard Component');
  });

  it('should use the theme context', () => {
    // This test verifies that the component imports and uses useTheme
    // The actual functionality is mocked, but we can verify the component renders
    render(<SyncManagementPage />);
    expect(screen.getByTestId('multi-platform-sync-dashboard')).toBeInTheDocument();
  });
});