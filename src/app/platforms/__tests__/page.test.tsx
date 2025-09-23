import { render, screen } from '@testing-library/react';
import PlatformsPage from '../page';

// Mock the complex dependencies
jest.mock('@/components/PlatformSetupManager', () => ({
  PlatformSetupManager: function MockPlatformSetupManager() {
    return <div data-testid="platform-setup-manager">Platform Setup Manager Component</div>;
  }
}));

jest.mock('@/components/NavigationTabs', () => {
  return function MockNavigationTabs() {
    return <div data-testid="navigation-tabs">Navigation Tabs</div>;
  };
});

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return <a href={href} {...props}>{children}</a>;
  };
});

describe('PlatformsPage', () => {
  it('should render the platforms page with correct structure', () => {
    render(<PlatformsPage />);

    // Check that both main components are rendered
    expect(screen.getByTestId('navigation-tabs')).toBeInTheDocument();
    expect(screen.getByTestId('platform-setup-manager')).toBeInTheDocument();
  });

  it('should display AI optimization banner', () => {
    render(<PlatformsPage />);

    // Check for AI optimization content
    expect(screen.getByText('AI-Powered Campaign Optimization')).toBeInTheDocument();
    expect(screen.getByText(/Get intelligent insights and recommendations/)).toBeInTheDocument();
  });

  it('should have correct main container styling', () => {
    const { container } = render(<PlatformsPage />);
    
    // Check main container classes
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('min-h-screen', 'bg-gray-50', 'dark:bg-gray-900');
  });

  it('should render without crashing', () => {
    expect(() => render(<PlatformsPage />)).not.toThrow();
  });

  it('should have proper content structure', () => {
    render(<PlatformsPage />);
    
    // Check for the content container
    const contentContainer = screen.getByTestId('platform-setup-manager').parentElement;
    expect(contentContainer).toHaveClass('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-8');
  });

  it('should display the optimization banner with correct styling', () => {
    render(<PlatformsPage />);
    
    // Find the correct banner element by looking for the parent div with the gradient classes
    const banner = screen.getByText('AI-Powered Campaign Optimization').closest('.bg-gradient-to-r');
    expect(banner).toHaveClass('bg-gradient-to-r', 'from-blue-600', 'to-purple-600', 'rounded-lg', 'p-6', 'text-white');
  });
});