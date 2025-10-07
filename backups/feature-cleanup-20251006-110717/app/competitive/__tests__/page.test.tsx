import { render, screen } from '@testing-library/react';
import CompetitivePage from '../page';

// Mock the CompetitiveIntelligence component
jest.mock('@/components/CompetitiveIntelligence', () => {
  return function MockCompetitiveIntelligence() {
    return <div data-testid="competitive-intelligence">Competitive Intelligence Component</div>;
  };
});

describe('CompetitivePage', () => {
  it('should render the competitive page with correct structure', () => {
    render(<CompetitivePage />);

    // Check that the CompetitiveIntelligence component is rendered
    expect(screen.getByTestId('competitive-intelligence')).toBeInTheDocument();
  });

  it('should have correct container styling', () => {
    const { container } = render(<CompetitivePage />);
    
    // Check main container classes
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('container', 'mx-auto', 'p-6');
  });

  it('should render without crashing', () => {
    expect(() => render(<CompetitivePage />)).not.toThrow();
  });

  it('should contain the CompetitiveIntelligence component', () => {
    render(<CompetitivePage />);
    
    // Verify the mocked component is present
    const component = screen.getByTestId('competitive-intelligence');
    expect(component).toBeInTheDocument();
    expect(component).toHaveTextContent('Competitive Intelligence Component');
  });
});