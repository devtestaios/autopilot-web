import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '@/components/ui/input';

describe('Input', () => {
  it('should render input element', () => {
    render(<Input placeholder="Enter text" />);
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe('INPUT');
  });

  it('should handle value changes', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('should apply custom className', () => {
    const { container } = render(<Input className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled input" />);
    
    const input = screen.getByPlaceholderText('Disabled input');
    expect(input).toBeDisabled();
  });

  it('should have correct type attribute', () => {
    render(<Input type="email" placeholder="Email" />);
    
    const input = screen.getByPlaceholderText('Email');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('should handle default value', () => {
    render(<Input defaultValue="default text" />);
    
    const input = screen.getByDisplayValue('default text');
    expect(input).toBeInTheDocument();
  });

  it('should handle controlled value', () => {
    render(<Input value="controlled value" onChange={() => {}} />);
    
    const input = screen.getByDisplayValue('controlled value');
    expect(input).toBeInTheDocument();
  });

  it('should handle focus and blur events', () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    render(<Input onFocus={handleFocus} onBlur={handleBlur} />);
    
    const input = screen.getByRole('textbox');
    
    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    
    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('should handle required attribute', () => {
    render(<Input required placeholder="Required field" />);
    
    const input = screen.getByPlaceholderText('Required field');
    expect(input).toBeRequired();
  });

  it('should handle readonly attribute', () => {
    render(<Input readOnly value="readonly value" />);
    
    const input = screen.getByDisplayValue('readonly value');
    expect(input).toHaveAttribute('readonly');
  });
});