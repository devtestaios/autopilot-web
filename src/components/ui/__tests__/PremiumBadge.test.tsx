import { render, screen } from '@testing-library/react';
import { PremiumBadge } from '../PremiumBadge';

describe('PremiumBadge', () => {
  it('renders children content', () => {
    render(<PremiumBadge>Test Badge</PremiumBadge>);
    
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('applies default variant classes', () => {
    render(<PremiumBadge>Default</PremiumBadge>);
    
    const badge = screen.getByText('Default');
    expect(badge).toHaveClass('bg-gray-100', 'dark:bg-gray-800', 'text-gray-800', 'dark:text-gray-200');
  });

  it('applies success variant classes', () => {
    render(<PremiumBadge variant="success">Success</PremiumBadge>);
    
    const badge = screen.getByText('Success');
    expect(badge).toHaveClass('bg-green-100', 'dark:bg-green-900/20', 'text-green-800', 'dark:text-green-300');
  });

  it('applies warning variant classes', () => {
    render(<PremiumBadge variant="warning">Warning</PremiumBadge>);
    
    const badge = screen.getByText('Warning');
    expect(badge).toHaveClass('bg-yellow-100', 'dark:bg-yellow-900/20', 'text-yellow-800', 'dark:text-yellow-300');
  });

  it('applies danger variant classes', () => {
    render(<PremiumBadge variant="danger">Danger</PremiumBadge>);
    
    const badge = screen.getByText('Danger');
    expect(badge).toHaveClass('bg-red-100', 'dark:bg-red-900/20', 'text-red-800', 'dark:text-red-300');
  });

  it('applies info variant classes', () => {
    render(<PremiumBadge variant="info">Info</PremiumBadge>);
    
    const badge = screen.getByText('Info');
    expect(badge).toHaveClass('bg-blue-100', 'dark:bg-blue-900/20', 'text-blue-800', 'dark:text-blue-300');
  });

  it('applies small size classes', () => {
    render(<PremiumBadge size="sm">Small</PremiumBadge>);
    
    const badge = screen.getByText('Small');
    expect(badge).toHaveClass('px-2', 'py-1', 'text-xs');
  });

  it('applies medium size classes (default)', () => {
    render(<PremiumBadge size="md">Medium</PremiumBadge>);
    
    const badge = screen.getByText('Medium');
    expect(badge).toHaveClass('px-3', 'py-1', 'text-sm');
  });

  it('applies large size classes', () => {
    render(<PremiumBadge size="lg">Large</PremiumBadge>);
    
    const badge = screen.getByText('Large');
    expect(badge).toHaveClass('px-4', 'py-2', 'text-base');
  });

  it('applies default size when not specified', () => {
    render(<PremiumBadge>Default Size</PremiumBadge>);
    
    const badge = screen.getByText('Default Size');
    expect(badge).toHaveClass('px-3', 'py-1', 'text-sm');
  });

  it('applies custom className', () => {
    render(<PremiumBadge className="custom-class">Custom</PremiumBadge>);
    
    const badge = screen.getByText('Custom');
    expect(badge).toHaveClass('custom-class');
  });

  it('applies base classes to all variants', () => {
    render(<PremiumBadge>Test</PremiumBadge>);
    
    const badge = screen.getByText('Test');
    expect(badge).toHaveClass(
      'inline-flex',
      'items-center',
      'font-medium',
      'rounded-full',
      'border'
    );
  });

  it('renders as motion.span when animated is true', () => {
    render(<PremiumBadge animated>Animated</PremiumBadge>);
    
    const badge = screen.getByText('Animated');
    expect(badge).toBeInTheDocument();
  });

  it('renders as span when animated is false or not specified', () => {
    render(<PremiumBadge>Static</PremiumBadge>);
    
    const badge = screen.getByText('Static');
    expect(badge).toBeInTheDocument();
    expect(badge.tagName).toBe('SPAN');
  });

  describe('status prop functionality', () => {
    it('renders "Active" label for active status', () => {
      render(<PremiumBadge status="active" />);
      
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('renders "Paused" label for paused status', () => {
      render(<PremiumBadge status="paused" />);
      
      expect(screen.getByText('Paused')).toBeInTheDocument();
    });

    it('renders "Ended" label for ended status', () => {
      render(<PremiumBadge status="ended" />);
      
      expect(screen.getByText('Ended')).toBeInTheDocument();
    });

    it('renders "Optimizing" label for optimizing status', () => {
      render(<PremiumBadge status="optimizing" />);
      
      expect(screen.getByText('Optimizing')).toBeInTheDocument();
    });

    it('applies success variant for active status', () => {
      render(<PremiumBadge status="active" />);
      
      const badge = screen.getByText('Active');
      expect(badge).toHaveClass('bg-green-100', 'text-green-800');
    });

    it('applies warning variant for paused status', () => {
      render(<PremiumBadge status="paused" />);
      
      const badge = screen.getByText('Paused');
      expect(badge).toHaveClass('bg-yellow-100', 'text-yellow-800');
    });

    it('applies danger variant for ended status', () => {
      render(<PremiumBadge status="ended" />);
      
      const badge = screen.getByText('Ended');
      expect(badge).toHaveClass('bg-red-100', 'text-red-800');
    });

    it('applies info variant for optimizing status', () => {
      render(<PremiumBadge status="optimizing" />);
      
      const badge = screen.getByText('Optimizing');
      expect(badge).toHaveClass('bg-blue-100', 'text-blue-800');
    });

    it('status overrides children and variant props', () => {
      render(
        <PremiumBadge status="active" variant="danger">
          Custom Text
        </PremiumBadge>
      );
      
      // Should show status label instead of children
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.queryByText('Custom Text')).not.toBeInTheDocument();
      
      // Should use status variant instead of explicit variant
      const badge = screen.getByText('Active');
      expect(badge).toHaveClass('bg-green-100'); // success, not danger
    });
  });

  it('combines size, variant, and custom classes correctly', () => {
    render(
      <PremiumBadge variant="info" size="lg" className="border-2">
        Combined
      </PremiumBadge>
    );
    
    const badge = screen.getByText('Combined');
    expect(badge).toHaveClass('bg-blue-100'); // variant class
    expect(badge).toHaveClass('px-4', 'py-2', 'text-base'); // size classes
    expect(badge).toHaveClass('border-2'); // custom class
  });

  it('handles empty children', () => {
    render(<PremiumBadge></PremiumBadge>);
    
    // Should render an empty badge
    const badge = document.querySelector('span');
    expect(badge).toBeInTheDocument();
  });

  it('handles complex children content', () => {
    render(
      <PremiumBadge>
        <span>Icon</span>
        <span>Text</span>
      </PremiumBadge>
    );
    
    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('preserves all prop combinations correctly', () => {
    render(
      <PremiumBadge 
        variant="success" 
        size="sm" 
        className="custom" 
        animated 
        status="paused"
      >
        Ignored Text
      </PremiumBadge>
    );
    
    const badge = screen.getByText('Paused');
    expect(badge).toHaveClass('bg-yellow-100'); // status overrides variant
    expect(badge).toHaveClass('px-2', 'py-1', 'text-xs'); // size preserved
    expect(badge).toHaveClass('custom'); // custom class preserved
  });
});