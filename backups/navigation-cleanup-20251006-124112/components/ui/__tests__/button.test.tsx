import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('should render button with children', () => {
    render(<Button>Click me</Button>);
    
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should render as button by default', () => {
    render(<Button>Default Button</Button>);
    
    const element = screen.getByText('Default Button');
    expect(element.tagName).toBe('BUTTON');
  });

  it('should handle click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    
    fireEvent.click(screen.getByText('Clickable'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should apply custom className', () => {
    const { container } = render(<Button className="custom-class">Custom</Button>);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    
    const button = screen.getByText('Disabled Button');
    expect(button).toBeDisabled();
  });

  it('should not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Disabled</Button>);
    
    fireEvent.click(screen.getByText('Disabled'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should have correct type attribute', () => {
    render(<Button type="submit">Submit</Button>);
    
    const button = screen.getByText('Submit');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should render with different variants', () => {
    const { container } = render(<Button variant="outline">Outline</Button>);
    
    expect(container.firstChild).toHaveClass('border', 'border-gray-300');
  });

  it('should render with different sizes', () => {
    const { container } = render(<Button size="lg">Large</Button>);
    
    expect(container.firstChild).toHaveClass('h-11', 'px-8');
  });
});