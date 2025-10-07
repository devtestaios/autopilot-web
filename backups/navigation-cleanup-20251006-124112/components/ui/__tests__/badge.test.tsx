import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Badge } from '@/components/ui/badge';

describe('Badge', () => {
  it('should render badge with children', () => {
    render(<Badge>Test Badge</Badge>);
    
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('should render with default variant', () => {
    const { container } = render(<Badge>Default</Badge>);
    
    expect(container.firstChild).toHaveClass('bg-blue-100', 'text-blue-800');
  });

  it('should render with secondary variant', () => {
    const { container } = render(<Badge variant="secondary">Secondary</Badge>);
    
    expect(container.firstChild).toHaveClass('bg-gray-100', 'text-gray-800');
  });

  it('should render with destructive variant', () => {
    const { container } = render(<Badge variant="destructive">Destructive</Badge>);
    
    expect(container.firstChild).toHaveClass('bg-red-100', 'text-red-800');
  });

  it('should render with outline variant', () => {
    const { container } = render(<Badge variant="outline">Outline</Badge>);
    
    expect(container.firstChild).toHaveClass('border', 'border-gray-200');
  });

  it('should apply custom className', () => {
    const { container } = render(<Badge className="custom-class">Custom</Badge>);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should render as button when onClick provided', () => {
    const handleClick = jest.fn();
    render(<Badge onClick={handleClick}>Clickable</Badge>);
    
    const element = screen.getByText('Clickable');
    expect(element.tagName).toBe('BUTTON');
    expect(element).toHaveClass('cursor-pointer');
  });

  it('should render as span by default', () => {
    render(<Badge>Default Span</Badge>);
    
    const element = screen.getByText('Default Span');
    expect(element.tagName).toBe('SPAN');
  });

  it('should call onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Badge onClick={handleClick}>Clickable</Badge>);
    
    fireEvent.click(screen.getByText('Clickable'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should include base classes', () => {
    const { container } = render(<Badge>Test</Badge>);
    
    expect(container.firstChild).toHaveClass('inline-flex', 'items-center', 'px-2.5', 'py-0.5', 'rounded-full', 'text-xs', 'font-medium');
  });
});