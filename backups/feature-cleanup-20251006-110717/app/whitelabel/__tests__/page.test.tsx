import { render, screen } from '@testing-library/react';
import WhiteLabelPage from '../page';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Test wrapper with ThemeProvider
const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

// Mock the WhiteLabelDashboard component
jest.mock('@/components/WhiteLabelDashboard', () => {
  return function MockWhiteLabelDashboard() {
    return <div data-testid="white-label-dashboard">White Label Dashboard Component</div>;
  };
});

describe('WhiteLabelPage', () => {
  it('should render the white label page with correct structure', () => {
    renderWithTheme(<WhiteLabelPage />);

    // Check that the WhiteLabelDashboard component is rendered
    expect(screen.getByTestId('white-label-dashboard')).toBeInTheDocument();
  });

  it('should have correct container styling', () => {
    const { container } = renderWithTheme(<WhiteLabelPage />);
    
    // Check main container classes
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('min-h-screen', 'bg-gray-50', 'dark:bg-gray-900');
  });

  it('should render without crashing', () => {
    expect(() => renderWithTheme(<WhiteLabelPage />)).not.toThrow();
  });

  it('should contain the WhiteLabelDashboard component', () => {
    renderWithTheme(<WhiteLabelPage />);
    
    // Verify the mocked component is present
    const component = screen.getByTestId('white-label-dashboard');
    expect(component).toBeInTheDocument();
    expect(component).toHaveTextContent('White Label Dashboard Component');
  });
});