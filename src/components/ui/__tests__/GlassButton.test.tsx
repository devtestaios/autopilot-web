import { render, screen, fireEvent } from '@testing-library/react';
import { GlassButton } from '../GlassButton';

describe('GlassButton', () => {
  it('renders children content', () => {
    render(<GlassButton>Click me</GlassButton>);
    
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = jest.fn();
    render(<GlassButton onClick={mockOnClick}>Click me</GlassButton>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const mockOnClick = jest.fn();
    render(
      <GlassButton onClick={mockOnClick} disabled>
        Click me
      </GlassButton>
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('has disabled attribute when disabled prop is true', () => {
    render(<GlassButton disabled>Click me</GlassButton>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('applies default variant classes', () => {
    render(<GlassButton>Default</GlassButton>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-white/10', 'border-white/20', 'text-white');
  });

  it('applies primary variant classes', () => {
    render(<GlassButton variant="primary">Primary</GlassButton>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-blue-500/20', 'border-blue-400/30', 'text-blue-100');
  });

  it('applies secondary variant classes', () => {
    render(<GlassButton variant="secondary">Secondary</GlassButton>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-purple-500/20', 'border-purple-400/30', 'text-purple-100');
  });

  it('applies custom className', () => {
    render(<GlassButton className="custom-class">Custom</GlassButton>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('applies base classes to all variants', () => {
    render(<GlassButton>Test</GlassButton>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'relative',
      'overflow-hidden',
      'backdrop-blur-lg',
      'border',
      'transition-all',
      'duration-300'
    );
  });

  it('applies disabled styling when disabled', () => {
    render(<GlassButton disabled>Disabled</GlassButton>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('cursor-not-allowed', 'opacity-50');
  });

  it('applies enabled styling when not disabled', () => {
    render(<GlassButton>Enabled</GlassButton>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('cursor-pointer');
    expect(button).not.toHaveClass('cursor-not-allowed', 'opacity-50');
  });

  it('renders with complex children', () => {
    render(
      <GlassButton>
        <span>Icon</span>
        <span>Text</span>
      </GlassButton>
    );
    
    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Text')).toBeInTheDocument();
  });

  it('handles onClick without error when not provided', () => {
    render(<GlassButton>No onClick</GlassButton>);
    
    const button = screen.getByRole('button');
    expect(() => fireEvent.click(button)).not.toThrow();
  });

  it('has correct structure with overlay elements', () => {
    render(<GlassButton>Test</GlassButton>);
    
    const button = screen.getByRole('button');
    
    // Check for glass effect overlay
    const overlays = button.querySelectorAll('div');
    expect(overlays.length).toBeGreaterThan(0);
    
    // Check for content span
    const contentSpan = button.querySelector('span');
    expect(contentSpan).toBeInTheDocument();
    expect(contentSpan).toHaveClass('relative', 'z-10', 'font-medium');
  });

  it('combines variant and custom classes correctly', () => {
    render(
      <GlassButton variant="primary" className="px-4 py-2">
        Combined
      </GlassButton>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-blue-500/20'); // variant class
    expect(button).toHaveClass('px-4', 'py-2'); // custom classes
  });

  it('handles all variant types correctly', () => {
    const variants = ['default', 'primary', 'secondary'] as const;
    
    variants.forEach((variant) => {
      const { unmount } = render(
        <GlassButton variant={variant}>
          {variant}
        </GlassButton>
      );
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      
      unmount();
    });
  });

  it('handles empty children', () => {
    render(<GlassButton></GlassButton>);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });

  it('preserves disabled state correctly', () => {
    const { rerender } = render(<GlassButton disabled>Test</GlassButton>);
    
    let button = screen.getByRole('button');
    expect(button).toBeDisabled();
    
    rerender(<GlassButton disabled={false}>Test</GlassButton>);
    
    button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });
});