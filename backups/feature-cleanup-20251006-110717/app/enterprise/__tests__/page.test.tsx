import { render, screen } from '@testing-library/react';
import EnterprisePage from '../page';

// Mock the EnterpriseAuth component
jest.mock('@/components/EnterpriseAuth', () => {
  return function MockEnterpriseAuth() {
    return <div data-testid="enterprise-auth">Enterprise Auth Component</div>;
  };
});

describe('EnterprisePage', () => {
  it('should render the enterprise page with correct structure', () => {
    render(<EnterprisePage />);

    // Check that the EnterpriseAuth component is rendered
    expect(screen.getByTestId('enterprise-auth')).toBeInTheDocument();
  });

  it('should have correct container styling', () => {
    const { container } = render(<EnterprisePage />);
    
    // Check main container classes
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('container', 'mx-auto', 'p-6');
  });

  it('should render without crashing', () => {
    expect(() => render(<EnterprisePage />)).not.toThrow();
  });

  it('should contain the EnterpriseAuth component', () => {
    render(<EnterprisePage />);
    
    // Verify the mocked component is present
    const component = screen.getByTestId('enterprise-auth');
    expect(component).toBeInTheDocument();
    expect(component).toHaveTextContent('Enterprise Auth Component');
  });
});