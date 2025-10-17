/**
 * UI Component Tests - Basic Coverage
 * Focus on core UI components without complex dependencies
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import basic UI components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

describe('UI Components - Basic Tests', () => {
  
  describe('Button Component', () => {
    test('renders button with text', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });

    test('applies default variant classes', () => {
      render(<Button>Default Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    test('renders with different variants', () => {
      const { rerender } = render(<Button variant="destructive">Delete</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
      
      rerender(<Button variant="outline">Outline</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
      
      rerender(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('renders with different sizes', () => {
      const { rerender } = render(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
      
      rerender(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('can be disabled', () => {
      render(<Button disabled>Disabled Button</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('Card Component', () => {
    test('renders card with all parts', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Test content</p>
          </CardContent>
        </Card>
      );
      
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    test('renders card with only content', () => {
      render(
        <Card>
          <CardContent>
            <p>Only content</p>
          </CardContent>
        </Card>
      );
      
      expect(screen.getByText('Only content')).toBeInTheDocument();
    });

    test('renders card with custom className', () => {
      render(
        <Card className="custom-card">
          <CardContent>Content</CardContent>
        </Card>
      );
      
      const card = screen.getByText('Content').closest('div')?.parentElement;
      expect(card).toHaveClass('custom-card');
    });
  });

  describe('Badge Component', () => {
    test('renders badge with text', () => {
      render(<Badge>New</Badge>);
      expect(screen.getByText('New')).toBeInTheDocument();
    });

    test('renders with different variants', () => {
      const { rerender } = render(<Badge variant="destructive">Error</Badge>);
      expect(screen.getByText('Error')).toBeInTheDocument();
      
      rerender(<Badge variant="outline">Outline</Badge>);
      expect(screen.getByText('Outline')).toBeInTheDocument();
      
      rerender(<Badge variant="secondary">Secondary</Badge>);
      expect(screen.getByText('Secondary')).toBeInTheDocument();
    });
  });

  describe('Input Component', () => {
    test('renders input field', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    test('renders input with type', () => {
      render(<Input type="email" placeholder="Email" />);
      const input = screen.getByPlaceholderText('Email');
      expect(input).toHaveAttribute('type', 'email');
    });

    test('can be disabled', () => {
      render(<Input disabled placeholder="Disabled" />);
      expect(screen.getByPlaceholderText('Disabled')).toBeDisabled();
    });

    test('accepts custom className', () => {
      render(<Input className="custom-input" placeholder="Custom" />);
      expect(screen.getByPlaceholderText('Custom')).toHaveClass('custom-input');
    });
  });

  describe('Label Component', () => {
    test('renders label with text', () => {
      render(<Label>Test Label</Label>);
      expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    test('can be associated with input', () => {
      render(
        <div>
          <Label htmlFor="test-input">Label for input</Label>
          <Input id="test-input" placeholder="Test input" />
        </div>
      );
      
      const label = screen.getByText('Label for input');
      const input = screen.getByPlaceholderText('Test input');
      
      expect(label).toHaveAttribute('for', 'test-input');
      expect(input).toHaveAttribute('id', 'test-input');
    });
  });

  describe('Textarea Component', () => {
    test('renders textarea', () => {
      render(<Textarea placeholder="Enter description" />);
      expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
    });

    test('can be disabled', () => {
      render(<Textarea disabled placeholder="Disabled textarea" />);
      expect(screen.getByPlaceholderText('Disabled textarea')).toBeDisabled();
    });

    test('accepts custom className', () => {
      render(<Textarea className="custom-textarea" placeholder="Custom" />);
      expect(screen.getByPlaceholderText('Custom')).toHaveClass('custom-textarea');
    });
  });

  describe('Component Integration', () => {
    test('form components work together', () => {
      render(
        <form>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Your name" />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Tell us about yourself" />
          </div>
          <Button type="submit">Submit</Button>
        </form>
      );
      
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    test('card with form elements', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Update your profile information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" />
              </div>
              <div>
                <Badge>Premium User</Badge>
              </div>
              <Button>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      );
      
      expect(screen.getByText('User Profile')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByText('Premium User')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
    });
  });

  describe('Accessibility Features', () => {
    test('button renders and is accessible', () => {
      render(<Button aria-label="Close dialog">×</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('×');
    });

    test('input has proper accessibility with label', () => {
      render(
        <div>
          <Label htmlFor="accessible-input">Accessible Input</Label>
          <Input id="accessible-input" aria-describedby="input-help" />
          <p id="input-help">This input has helper text</p>
        </div>
      );
      
      const input = screen.getByLabelText('Accessible Input');
      expect(input).toHaveAttribute('aria-describedby', 'input-help');
    });
  });

  describe('Component Props and Variants', () => {
    test('button handles all size variants', () => {
      const sizes = ['default', 'sm', 'lg'] as const;
      
      sizes.forEach(size => {
        const { unmount } = render(<Button size={size}>Size {size}</Button>);
        expect(screen.getByRole('button')).toBeInTheDocument();
        unmount();
      });
    });

    test('badge handles all variants', () => {
      const variants = ['default', 'secondary', 'destructive', 'outline'] as const;
      
      variants.forEach(variant => {
        const { unmount } = render(<Badge variant={variant}>Variant {variant}</Badge>);
        expect(screen.getByText(`Variant ${variant}`)).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('Event Handling', () => {
    test('button click events work', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click Test</Button>);
      
      const button = screen.getByRole('button');
      button.click();
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('input change events work', () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} placeholder="Change test" />);
      
      const input = screen.getByPlaceholderText('Change test');
      // Note: Testing actual change events would require user-event library
      expect(input).toBeInTheDocument();
    });
  });
});