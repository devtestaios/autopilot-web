// Expanded UI Component Testing Suite
// Target: Increase component coverage from 1.59% to 15%+

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock Next.js modules
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>
}));

// UI Components - using correct paths
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Test wrapper for theme support
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="light">
    {children}
  </div>
);

describe('Expanded UI Component Suite', () => {
  describe('Button Component', () => {
    test('renders with different variants', () => {
      const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'];
      
      variants.forEach(variant => {
        render(
          <TestWrapper>
            <Button variant={variant as any} data-testid={`button-${variant}`}>
              {variant} Button
            </Button>
          </TestWrapper>
        );
        
        expect(screen.getByTestId(`button-${variant}`)).toBeInTheDocument();
      });
    });

    test('handles click events', () => {
      const mockClick = jest.fn();
      render(
        <TestWrapper>
          <Button onClick={mockClick} data-testid="clickable-button">
            Click Me
          </Button>
        </TestWrapper>
      );

      fireEvent.click(screen.getByTestId('clickable-button'));
      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    test('supports disabled state', () => {
      render(
        <TestWrapper>
          <Button disabled data-testid="disabled-button">
            Disabled
          </Button>
        </TestWrapper>
      );

      const button = screen.getByTestId('disabled-button');
      expect(button).toBeDisabled();
    });

    test('supports different sizes', () => {
      const sizes = ['default', 'sm', 'lg', 'icon'];
      
      sizes.forEach(size => {
        render(
          <TestWrapper>
            <Button size={size as any} data-testid={`button-size-${size}`}>
              {size}
            </Button>
          </TestWrapper>
        );
        
        expect(screen.getByTestId(`button-size-${size}`)).toBeInTheDocument();
      });
    });
  });

  describe('Card Component', () => {
    test('renders complete card structure', () => {
      render(
        <TestWrapper>
          <Card data-testid="test-card">
            <CardHeader data-testid="card-header">
              <CardTitle data-testid="card-title">Test Title</CardTitle>
              <CardDescription data-testid="card-description">
                Test Description
              </CardDescription>
            </CardHeader>
            <CardContent data-testid="card-content">
              <p>Card Content</p>
            </CardContent>
            <div className="flex items-center p-6 pt-0" data-testid="card-footer">
              <Button>Action</Button>
            </div>
          </Card>
        </TestWrapper>
      );

      expect(screen.getByTestId('test-card')).toBeInTheDocument();
      expect(screen.getByTestId('card-header')).toBeInTheDocument();
      expect(screen.getByTestId('card-title')).toBeInTheDocument();
      expect(screen.getByTestId('card-description')).toBeInTheDocument();
      expect(screen.getByTestId('card-content')).toBeInTheDocument();
      expect(screen.getByTestId('card-footer')).toBeInTheDocument();
    });

    test('renders minimal card structure', () => {
      render(
        <TestWrapper>
          <Card data-testid="minimal-card">
            <CardContent>
              <p>Minimal content</p>
            </CardContent>
          </Card>
        </TestWrapper>
      );

      expect(screen.getByTestId('minimal-card')).toBeInTheDocument();
      expect(screen.getByText('Minimal content')).toBeInTheDocument();
    });
  });

  describe('Badge Component', () => {
    test('renders with different variants', () => {
      const variants = ['default', 'secondary', 'destructive', 'outline'];
      
      variants.forEach(variant => {
        render(
          <TestWrapper>
            <Badge variant={variant as any} data-testid={`badge-${variant}`}>
              {variant}
            </Badge>
          </TestWrapper>
        );
        
        expect(screen.getByTestId(`badge-${variant}`)).toBeInTheDocument();
      });
    });

    test('renders with custom content', () => {
      render(
        <TestWrapper>
          <Badge data-testid="custom-badge">
            Custom Badge Text
          </Badge>
        </TestWrapper>
      );

      expect(screen.getByTestId('custom-badge')).toBeInTheDocument();
      expect(screen.getByText('Custom Badge Text')).toBeInTheDocument();
    });
  });

  describe('Input Component', () => {
    test('renders input with label', () => {
      render(
        <TestWrapper>
          <div>
            <Label htmlFor="test-input">Test Label</Label>
            <Input 
              id="test-input" 
              data-testid="test-input"
              placeholder="Enter text"
            />
          </div>
        </TestWrapper>
      );

      expect(screen.getByTestId('test-input')).toBeInTheDocument();
      expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    });

    test('handles value changes', () => {
      const mockChange = jest.fn();
      render(
        <TestWrapper>
          <Input 
            data-testid="change-input"
            onChange={mockChange}
            placeholder="Type here"
          />
        </TestWrapper>
      );

      const input = screen.getByTestId('change-input');
      fireEvent.change(input, { target: { value: 'test value' } });
      
      expect(mockChange).toHaveBeenCalled();
    });

    test('supports different input types', () => {
      const types = ['text', 'email', 'password', 'number'];
      
      types.forEach(type => {
        render(
          <TestWrapper>
            <Input 
              type={type}
              data-testid={`input-${type}`}
              placeholder={`${type} input`}
            />
          </TestWrapper>
        );
        
        expect(screen.getByTestId(`input-${type}`)).toBeInTheDocument();
      });
    });
  });

  describe('Textarea Component', () => {
    test('renders textarea', () => {
      render(
        <TestWrapper>
          <Textarea 
            data-testid="test-textarea"
            placeholder="Enter long text"
          />
        </TestWrapper>
      );

      expect(screen.getByTestId('test-textarea')).toBeInTheDocument();
    });

    test('handles text changes', () => {
      const mockChange = jest.fn();
      render(
        <TestWrapper>
          <Textarea 
            data-testid="change-textarea"
            onChange={mockChange}
          />
        </TestWrapper>
      );

      const textarea = screen.getByTestId('change-textarea');
      fireEvent.change(textarea, { target: { value: 'multiline\ntext' } });
      
      expect(mockChange).toHaveBeenCalled();
    });
  });

  describe('Accessibility Testing', () => {
    test('components have proper ARIA attributes', () => {
      render(
        <TestWrapper>
          <Button aria-label="Accessible button" data-testid="aria-button">
            Button
          </Button>
          <Card data-testid="aria-card">
            <CardContent>Accessible card</CardContent>
          </Card>
        </TestWrapper>
      );

      expect(screen.getByTestId('aria-button')).toHaveAttribute('aria-label');
      expect(screen.getByTestId('aria-card')).toBeInTheDocument();
    });

    test('form elements have proper associations', () => {
      render(
        <TestWrapper>
          <div>
            <Label htmlFor="accessible-input">Accessible Input</Label>
            <Input id="accessible-input" data-testid="accessible-input" />
          </div>
        </TestWrapper>
      );

      const input = screen.getByTestId('accessible-input');
      expect(input).toHaveAttribute('id', 'accessible-input');
      expect(screen.getByLabelText('Accessible Input')).toBe(input);
    });
  });

  describe('Theme Integration', () => {
    test('components render in different themes', async () => {
      const { rerender } = render(
        <div className="light">
          <Button data-testid="theme-button">Theme Button</Button>
        </div>
      );

      expect(screen.getByTestId('theme-button')).toBeInTheDocument();

      rerender(
        <div className="dark">
          <Button data-testid="theme-button">Theme Button</Button>
        </div>
      );

      expect(screen.getByTestId('theme-button')).toBeInTheDocument();
    });
  });

  describe('Error Boundaries', () => {
    test('components handle missing props gracefully', () => {
      // Test components without optional props
      expect(() => {
        render(
          <TestWrapper>
            <Button>Basic Button</Button>
            <Badge>Basic Badge</Badge>
            <Input />
            <Textarea />
          </TestWrapper>
        );
      }).not.toThrow();
    });
  });
});