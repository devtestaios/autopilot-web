import { render, screen } from '@testing-library/react';
import MobileDemoPage from '../page';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock the premium UI components
jest.mock('@/components/ui/PremiumCard', () => ({
  PremiumCard: ({ children, className, ...props }: any) => (
    <div data-testid="premium-card" className={className} {...props}>
      {children}
    </div>
  ),
}));

jest.mock('@/components/ui/PremiumButton', () => ({
  PremiumButton: ({ children, className, ...props }: any) => (
    <button data-testid="premium-button" className={className} {...props}>
      {children}
    </button>
  ),
}));

describe('MobileDemoPage', () => {
  it('should render the mobile demo page with main heading', () => {
    render(<MobileDemoPage />);

    // Check for main heading
    expect(screen.getByRole('heading', { name: /Mobile Experience Demo/i })).toBeInTheDocument();
  });

  it('should display device cards for all three device types', () => {
    render(<MobileDemoPage />);

    // Check for device names
    expect(screen.getByText('Mobile Phone')).toBeInTheDocument();
    expect(screen.getByText('Tablet')).toBeInTheDocument();
    expect(screen.getByText('Desktop')).toBeInTheDocument();

    // Check for descriptions
    expect(screen.getByText('Optimized for iOS and Android devices')).toBeInTheDocument();
    expect(screen.getByText('Perfect for iPad and Android tablets')).toBeInTheDocument();
    expect(screen.getByText('Full desktop experience')).toBeInTheDocument();
  });

  it('should display mobile features section', () => {
    render(<MobileDemoPage />);

    // Check for mobile features
    expect(screen.getByText('Touch-Optimized Interface')).toBeInTheDocument();
    expect(screen.getByText('Mobile Analytics')).toBeInTheDocument();
    expect(screen.getByText('Push Notifications')).toBeInTheDocument();

    // Check feature descriptions
    expect(screen.getByText(/Intuitive gestures and touch-friendly controls/)).toBeInTheDocument();
    expect(screen.getByText(/View campaign performance and analytics optimized/)).toBeInTheDocument();
    expect(screen.getByText(/Real-time alerts and notifications/)).toBeInTheDocument();
  });

  it('should have correct main container styling', () => {
    const { container } = render(<MobileDemoPage />);
    
    // Check main container classes
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('min-h-screen');
    expect(mainDiv.className).toMatch(/bg-gradient-to-br/);
  });

  it('should render without crashing', () => {
    expect(() => render(<MobileDemoPage />)).not.toThrow();
  });

  it('should display screen size information for each device', () => {
    render(<MobileDemoPage />);

    // Check for screen size specifications
    expect(screen.getByText('375px × 667px')).toBeInTheDocument();
    expect(screen.getByText('768px × 1024px')).toBeInTheDocument();
    expect(screen.getByText('1920px × 1080px')).toBeInTheDocument();
  });

  it('should use PremiumCard and PremiumButton components', () => {
    render(<MobileDemoPage />);

    // Check that premium components are used
    expect(screen.getAllByTestId('premium-card')).toHaveLength(7); // 3 devices + 3 features + 1 CTA section
    expect(screen.getAllByTestId('premium-button')).toHaveLength(2); // Two buttons in CTA section
  });
});