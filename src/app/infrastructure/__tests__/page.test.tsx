import { render, screen } from '@testing-library/react';
import InfrastructurePage from '../page';

// Mock the ProductionInfrastructure component
jest.mock('@/components/ProductionInfrastructure', () => {
  return function MockProductionInfrastructure() {
    return <div data-testid="production-infrastructure">Production Infrastructure Component</div>;
  };
});

describe('InfrastructurePage', () => {
  it('should render the infrastructure page with correct structure', () => {
    render(<InfrastructurePage />);

    // Check that the ProductionInfrastructure component is rendered
    expect(screen.getByTestId('production-infrastructure')).toBeInTheDocument();
  });

  it('should have correct container styling', () => {
    const { container } = render(<InfrastructurePage />);
    
    // Check main container classes
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('container', 'mx-auto', 'p-6');
  });

  it('should render without crashing', () => {
    expect(() => render(<InfrastructurePage />)).not.toThrow();
  });

  it('should contain the ProductionInfrastructure component', () => {
    render(<InfrastructurePage />);
    
    // Verify the mocked component is present
    const component = screen.getByTestId('production-infrastructure');
    expect(component).toBeInTheDocument();
    expect(component).toHaveTextContent('Production Infrastructure Component');
  });
});