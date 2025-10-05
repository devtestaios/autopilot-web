import { render, screen } from '@testing-library/react';
import InfrastructurePage from '../page';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Test wrapper with ThemeProvider
const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

// Mock the ProductionInfrastructure component
jest.mock('@/components/ProductionInfrastructure', () => {
  return function MockProductionInfrastructure() {
    return <div data-testid="production-infrastructure">Production Infrastructure Component</div>;
  };
});

describe('InfrastructurePage', () => {
  it('should render the infrastructure page with correct structure', () => {
    renderWithTheme(<InfrastructurePage />);

    // Check that the ProductionInfrastructure component is rendered
    expect(screen.getByTestId('production-infrastructure')).toBeInTheDocument();
  });

  it('should have correct container styling', () => {
    const { container } = renderWithTheme(<InfrastructurePage />);
    
    // Check main container classes
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('min-h-screen', 'bg-gray-50', 'dark:bg-gray-900');
  });

  it('should render without crashing', () => {
    expect(() => renderWithTheme(<InfrastructurePage />)).not.toThrow();
  });

  it('should contain the ProductionInfrastructure component', () => {
    renderWithTheme(<InfrastructurePage />);
    
    // Verify the mocked component is present
    const component = screen.getByTestId('production-infrastructure');
    expect(component).toBeInTheDocument();
    expect(component).toHaveTextContent('Production Infrastructure Component');
  });
});