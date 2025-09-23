import { render, screen } from '@testing-library/react';
import WhiteLabelPage from '../page';

// Mock the WhiteLabelDashboard component
jest.mock('@/components/WhiteLabelDashboard', () => {
  return function MockWhiteLabelDashboard() {
    return <div data-testid="white-label-dashboard">White Label Dashboard Component</div>;
  };
});

describe('WhiteLabelPage', () => {
  it('should render the white label page with correct structure', () => {
    render(<WhiteLabelPage />);

    // Check that the WhiteLabelDashboard component is rendered
    expect(screen.getByTestId('white-label-dashboard')).toBeInTheDocument();
  });

  it('should have correct container styling', () => {
    const { container } = render(<WhiteLabelPage />);
    
    // Check main container classes
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('container', 'mx-auto', 'p-6');
  });

  it('should render without crashing', () => {
    expect(() => render(<WhiteLabelPage />)).not.toThrow();
  });

  it('should contain the WhiteLabelDashboard component', () => {
    render(<WhiteLabelPage />);
    
    // Verify the mocked component is present
    const component = screen.getByTestId('white-label-dashboard');
    expect(component).toBeInTheDocument();
    expect(component).toHaveTextContent('White Label Dashboard Component');
  });
});