import { render, screen } from '@testing-library/react';
import AlertsPage from '../page';

// Mock the complex dependencies
jest.mock('@/components/AlertDashboard', () => {
  return function MockAlertDashboard() {
    return <div data-testid="alert-dashboard">Alert Dashboard Component</div>;
  };
});

jest.mock('@/components/NavigationTabs', () => {
  return function MockNavigationTabs() {
    return <div data-testid="navigation-tabs">Navigation Tabs</div>;
  };
});

describe('AlertsPage', () => {
  it('should render the alerts page with correct structure', () => {
    render(<AlertsPage />);

    // Check main heading
    expect(screen.getByRole('heading', { name: 'Smart Alert System', level: 1 })).toBeInTheDocument();
    
    // Check description text
    expect(screen.getByText('Intelligent monitoring and proactive notifications for your marketing campaigns')).toBeInTheDocument();
    
    // Check that both components are rendered
    expect(screen.getByTestId('navigation-tabs')).toBeInTheDocument();
    expect(screen.getByTestId('alert-dashboard')).toBeInTheDocument();
  });

  it('should have correct styling classes', () => {
    const { container } = render(<AlertsPage />);
    
    // Check main container classes
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('min-h-screen', 'bg-gray-50', 'dark:bg-gray-900');
    
    // Check if container structure exists
    const containerDiv = container.querySelector('.container');
    expect(containerDiv).toBeInTheDocument();
    expect(containerDiv).toHaveClass('mx-auto', 'px-4', 'py-8');
  });

  it('should render without crashing', () => {
    expect(() => render(<AlertsPage />)).not.toThrow();
  });

  it('should display proper semantic HTML structure', () => {
    render(<AlertsPage />);
    
    // Check that we have proper semantic HTML
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveClass('text-4xl', 'font-bold', 'mb-4');
    
    // Check description paragraph
    const description = screen.getByText(/Intelligent monitoring and proactive notifications/);
    expect(description).toHaveClass('text-xl', 'text-muted-foreground');
  });
});