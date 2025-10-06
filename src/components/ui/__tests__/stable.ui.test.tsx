import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

// Import only components that exist and are stable
import { Badge } from '../badge';
import { Button } from '../button';
import { Input } from '../input';
import { Label } from '../label';
import { Textarea } from '../textarea';

// Mock timer functions to prevent any potential issues
jest.useFakeTimers();

describe('Stable UI Components - Focused Coverage', () => {
  // Clean up after each test
  afterEach(() => {
    cleanup();
    jest.clearAllTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('Badge Component', () => {
    test('renders badge with default variant', () => {
      render(<Badge>Default Badge</Badge>);
      
      expect(screen.getByText('Default Badge')).toBeInTheDocument();
    });

    test('renders badge with different variants', () => {
      const variants = ['default', 'secondary', 'destructive', 'outline'] as const;
      
      variants.forEach((variant) => {
        render(<Badge variant={variant}>{variant} Badge</Badge>);
        expect(screen.getByText(`${variant} Badge`)).toBeInTheDocument();
      });
      
      cleanup();
    });

    test('applies custom className', () => {
      const { container } = render(<Badge className="custom-badge">Custom</Badge>);
      
      expect(container.firstChild).toHaveClass('custom-badge');
    });

    test('renders with children', () => {
      render(
        <Badge>
          <span>Badge with children</span>
        </Badge>
      );
      
      expect(screen.getByText('Badge with children')).toBeInTheDocument();
    });
  });

  describe('Button Component', () => {
    test('renders button with default props', () => {
      render(<Button>Click me</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Click me');
    });

    test('handles click events', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('renders with different variants', () => {
      const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost'] as const;
      
      variants.forEach((variant) => {
        render(<Button variant={variant}>{variant}</Button>);
        expect(screen.getByText(variant)).toBeInTheDocument();
      });
      
      cleanup();
    });

    test('renders with different sizes', () => {
      const sizes = ['default', 'sm', 'lg', 'icon'] as const;
      
      sizes.forEach((size) => {
        render(<Button size={size}>{size}</Button>);
        expect(screen.getByText(size)).toBeInTheDocument();
      });
      
      cleanup();
    });

    test('can be disabled', () => {
      render(<Button disabled>Disabled</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    test('applies custom className', () => {
      render(<Button className="custom-button">Custom</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-button');
    });
  });

  describe('Input Component', () => {
    test('renders input with default props', () => {
      render(<Input data-testid="test-input" />);
      
      const input = screen.getByTestId('test-input');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
    });

    test('handles different input types', () => {
      const types = ['text', 'email', 'password', 'number', 'tel', 'url'] as const;
      
      types.forEach((type) => {
        render(<Input type={type} data-testid={`input-${type}`} />);
        const input = screen.getByTestId(`input-${type}`);
        expect(input).toHaveAttribute('type', type);
      });
      
      cleanup();
    });

    test('handles value changes', () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} data-testid="test-input" />);
      
      const input = screen.getByTestId('test-input');
      fireEvent.change(input, { target: { value: 'test value' } });
      
      expect(handleChange).toHaveBeenCalled();
    });

    test('can be disabled', () => {
      render(<Input disabled data-testid="test-input" />);
      
      const input = screen.getByTestId('test-input');
      expect(input).toBeDisabled();
    });

    test('accepts placeholder text', () => {
      render(<Input placeholder="Enter text here" data-testid="test-input" />);
      
      const input = screen.getByTestId('test-input');
      expect(input).toHaveAttribute('placeholder', 'Enter text here');
    });

    test('applies custom className', () => {
      render(<Input className="custom-input" data-testid="test-input" />);
      
      const input = screen.getByTestId('test-input');
      expect(input).toHaveClass('custom-input');
    });
  });

  describe('Label Component', () => {
    test('renders label with text', () => {
      render(<Label>Test Label</Label>);
      
      expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    test('associates with form control', () => {
      render(
        <div>
          <Label htmlFor="test-input">Test Label</Label>
          <Input id="test-input" />
        </div>
      );
      
      const label = screen.getByText('Test Label');
      expect(label).toHaveAttribute('for', 'test-input');
    });

    test('applies custom className', () => {
      const { container } = render(<Label className="custom-label">Custom</Label>);
      
      expect(container.firstChild).toHaveClass('custom-label');
    });
  });

  describe('Textarea Component', () => {
    test('renders textarea with default props', () => {
      render(<Textarea data-testid="test-textarea" />);
      
      const textarea = screen.getByTestId('test-textarea');
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    test('handles value changes', () => {
      const handleChange = jest.fn();
      render(<Textarea onChange={handleChange} data-testid="test-textarea" />);
      
      const textarea = screen.getByTestId('test-textarea');
      fireEvent.change(textarea, { target: { value: 'test content' } });
      
      expect(handleChange).toHaveBeenCalled();
    });

    test('can be disabled', () => {
      render(<Textarea disabled data-testid="test-textarea" />);
      
      const textarea = screen.getByTestId('test-textarea');
      expect(textarea).toBeDisabled();
    });

    test('accepts placeholder text', () => {
      render(<Textarea placeholder="Enter your message" data-testid="test-textarea" />);
      
      const textarea = screen.getByTestId('test-textarea');
      expect(textarea).toHaveAttribute('placeholder', 'Enter your message');
    });

    test('applies custom className', () => {
      render(<Textarea className="custom-textarea" data-testid="test-textarea" />);
      
      const textarea = screen.getByTestId('test-textarea');
      expect(textarea).toHaveClass('custom-textarea');
    });
  });

  describe('Component Integration Tests', () => {
    test('form components work together without Card', () => {
      render(
        <div>
          <h2>Contact Form</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="Your message" />
            </div>
          </div>
          <div>
            <Button>Send Message</Button>
          </div>
        </div>
      );
      
      expect(screen.getByText('Contact Form')).toBeInTheDocument();
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Message')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Send Message' })).toBeInTheDocument();
    });

    test('multiple badges display correctly', () => {
      const badges = ['Primary', 'Secondary', 'Success', 'Warning'];
      
      render(
        <div>
          {badges.map((badge, index) => (
            <Badge key={index} variant={index % 2 === 0 ? 'default' : 'secondary'}>
              {badge}
            </Badge>
          ))}
        </div>
      );
      
      badges.forEach((badge) => {
        expect(screen.getByText(badge)).toBeInTheDocument();
      });
    });

    test('interactive form submission', () => {
      const handleSubmit = jest.fn((e) => e.preventDefault());
      
      render(
        <form onSubmit={handleSubmit} data-testid="registration-form">
          <div>
            <h2>Registration Form</h2>
            <p>Please fill in your details</p>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" />
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">Optional</Badge>
              <Badge variant="outline">Pro Feature</Badge>
            </div>
          </div>
          <div>
            <Button type="submit">Register</Button>
            <Button type="button" variant="outline">Cancel</Button>
          </div>
        </form>
      );
      
      expect(screen.getByTestId('registration-form')).toBeInTheDocument();
      expect(screen.getByText('Registration Form')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Bio')).toBeInTheDocument();
      expect(screen.getByText('Optional')).toBeInTheDocument();
      expect(screen.getByText('Pro Feature')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      
      // Test form submission
      fireEvent.click(screen.getByRole('button', { name: 'Register' }));
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });
});