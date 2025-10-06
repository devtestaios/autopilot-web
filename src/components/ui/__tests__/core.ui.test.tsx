import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

// Import additional UI components that are likely to be stable
import { Badge } from '../badge';
import { Button } from '../button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../card';
import { Input } from '../input';
import { Label } from '../label';
import { Textarea } from '../textarea';

// Mock timer functions to prevent any potential issues
jest.useFakeTimers();

describe('Core UI Components - Comprehensive Coverage', () => {
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
      const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;
      
      variants.forEach((variant) => {
        render(<Button variant={variant}>{variant}</Button>);
        expect(screen.getByText(variant)).toBeInTheDocument();
      });
    });

    test('renders with different sizes', () => {
      const sizes = ['default', 'sm', 'lg', 'icon'] as const;
      
      sizes.forEach((size) => {
        render(<Button size={size}>{size}</Button>);
        expect(screen.getByText(size)).toBeInTheDocument();
      });
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

  describe('Card Components', () => {
    test('renders complete card structure', () => {
      render(
        <Card data-testid="test-card">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card content goes here</p>
          </CardContent>
          <CardFooter>
            <Button>Footer Button</Button>
          </CardFooter>
        </Card>
      );
      
      expect(screen.getByTestId('test-card')).toBeInTheDocument();
      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card Description')).toBeInTheDocument();
      expect(screen.getByText('Card content goes here')).toBeInTheDocument();
      expect(screen.getByText('Footer Button')).toBeInTheDocument();
    });

    test('card components accept custom className', () => {
      const { container } = render(
        <Card className="custom-card">
          <CardHeader className="custom-header">
            <CardTitle className="custom-title">Title</CardTitle>
            <CardDescription className="custom-description">Description</CardDescription>
          </CardHeader>
          <CardContent className="custom-content">Content</CardContent>
          <CardFooter className="custom-footer">Footer</CardFooter>
        </Card>
      );
      
      expect(container.querySelector('.custom-card')).toBeInTheDocument();
      expect(container.querySelector('.custom-header')).toBeInTheDocument();
      expect(container.querySelector('.custom-title')).toBeInTheDocument();
      expect(container.querySelector('.custom-description')).toBeInTheDocument();
      expect(container.querySelector('.custom-content')).toBeInTheDocument();
      expect(container.querySelector('.custom-footer')).toBeInTheDocument();
    });

    test('card components can be nested', () => {
      render(
        <Card>
          <CardContent>
            <Card data-testid="nested-card">
              <CardHeader>
                <CardTitle>Nested Card</CardTitle>
              </CardHeader>
            </Card>
          </CardContent>
        </Card>
      );
      
      expect(screen.getByTestId('nested-card')).toBeInTheDocument();
      expect(screen.getByText('Nested Card')).toBeInTheDocument();
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
    test('form components work together', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Contact Form</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
          <CardFooter>
            <Button>Send Message</Button>
          </CardFooter>
        </Card>
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

    test('interactive form with all components', () => {
      const handleSubmit = jest.fn();
      
      render(
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Registration Form</CardTitle>
              <CardDescription>Please fill in your details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
            </CardContent>
            <CardFooter>
              <Button type="submit">Register</Button>
              <Button type="button" variant="outline">Cancel</Button>
            </CardFooter>
          </Card>
        </form>
      );
      
      expect(screen.getByRole('form')).toBeInTheDocument();
      expect(screen.getByText('Registration Form')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Bio')).toBeInTheDocument();
      expect(screen.getByText('Optional')).toBeInTheDocument();
      expect(screen.getByText('Pro Feature')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });
  });
});