import { render, screen, fireEvent } from '@testing-library/react';
import { Switch } from '../switch';

describe('Switch', () => {
  const defaultProps = {
    checked: false,
    onCheckedChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render switch component', () => {
    render(<Switch {...defaultProps} />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeInTheDocument();
    expect(switchElement).toHaveAttribute('aria-checked', 'false');
  });

  it('should display checked state correctly', () => {
    render(<Switch {...defaultProps} checked={true} />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('aria-checked', 'true');
    expect(switchElement).toHaveClass('bg-blue-600');
  });

  it('should display unchecked state correctly', () => {
    render(<Switch {...defaultProps} checked={false} />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('aria-checked', 'false');
    expect(switchElement).toHaveClass('bg-gray-200');
  });

  it('should call onCheckedChange when clicked', () => {
    const mockOnChange = jest.fn();
    render(<Switch {...defaultProps} onCheckedChange={mockOnChange} />);
    
    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);
    
    expect(mockOnChange).toHaveBeenCalledWith(true);
  });

  it('should toggle from checked to unchecked', () => {
    const mockOnChange = jest.fn();
    render(<Switch {...defaultProps} checked={true} onCheckedChange={mockOnChange} />);
    
    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);
    
    expect(mockOnChange).toHaveBeenCalledWith(false);
  });

  it('should handle disabled state', () => {
    const mockOnChange = jest.fn();
    render(<Switch {...defaultProps} disabled={true} onCheckedChange={mockOnChange} />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeDisabled();
    expect(switchElement).toHaveClass('opacity-50', 'cursor-not-allowed');
    
    fireEvent.click(switchElement);
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  it('should accept custom className', () => {
    render(<Switch {...defaultProps} className="custom-class" />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveClass('custom-class');
  });

  it('should have correct thumb position when checked', () => {
    const { container } = render(<Switch {...defaultProps} checked={true} />);
    
    const thumb = container.querySelector('span');
    expect(thumb).toHaveClass('translate-x-6');
  });

  it('should have correct thumb position when unchecked', () => {
    const { container } = render(<Switch {...defaultProps} checked={false} />);
    
    const thumb = container.querySelector('span');
    expect(thumb).toHaveClass('translate-x-1');
  });

  it('should have transition classes', () => {
    render(<Switch {...defaultProps} />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveClass('transition-colors');
    
    const { container } = render(<Switch {...defaultProps} />);
    const thumb = container.querySelector('span');
    expect(thumb).toHaveClass('transition-transform');
  });
});