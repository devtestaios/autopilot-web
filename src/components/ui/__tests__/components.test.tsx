/**
 * Comprehensive test suite for UI components
 * Tests major UI components to increase coverage
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

describe('UI Components', () => {
  describe('Button Component', () => {
    it('should render button with text', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('should handle click events', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should support disabled state', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should support different variants', () => {
      const { rerender } = render(<Button variant="outline">Outline</Button>);
      expect(screen.getByRole('button')).toHaveClass('border');

      rerender(<Button variant="destructive">Destructive</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-destructive');
    });

    it('should support different sizes', () => {
      const { rerender } = render(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-9');

      rerender(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-11');
    });
  });

  describe('Card Components', () => {
    it('should render card with content', () => {
      render(
        <Card data-testid="test-card">
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Test content</p>
          </CardContent>
        </Card>
      );

      expect(screen.getByTestId('test-card')).toBeInTheDocument();
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('should apply correct styling classes', () => {
      render(
        <Card className="custom-class">
          <CardHeader className="header-class">
            <CardTitle className="title-class">Title</CardTitle>
          </CardHeader>
          <CardContent className="content-class">Content</CardContent>
        </Card>
      );

      expect(screen.getByText('Title').closest('div')).toHaveClass('title-class');
      expect(screen.getByText('Content')).toHaveClass('content-class');
    });
  });

  describe('Alert Components', () => {
    it('should render div with alert-like styling', () => {
      render(
        <div role="alert" className="border rounded p-4">
          <p>This is an alert message</p>
        </div>
      );

      expect(screen.getByText('This is an alert message')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveClass('border', 'rounded', 'p-4');
    });

    it('should support different alert variants', () => {
      const { rerender } = render(
        <div role="alert" className="border-red-500 bg-red-50">
          <p>Error message</p>
        </div>
      );

      expect(screen.getByRole('alert')).toHaveClass('border-red-500');

      rerender(
        <div role="alert" className="border-blue-500 bg-blue-50">
          <p>Info message</p>
        </div>
      );

      expect(screen.getByRole('alert')).toHaveClass('border-blue-500');
    });
  });

  describe('Badge Component', () => {
    it('should render badge with text', () => {
      render(<Badge>New</Badge>);
      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('should support different variants', () => {
      const { rerender } = render(<Badge variant="destructive">Error</Badge>);
      expect(screen.getByText('Error')).toHaveClass('bg-destructive');

      rerender(<Badge variant="secondary">Info</Badge>);
      expect(screen.getByText('Info')).toHaveClass('bg-secondary');

      rerender(<Badge variant="outline">Outline</Badge>);
      expect(screen.getByText('Outline')).toHaveClass('border');
    });
  });

  describe('Progress Component', () => {
    it('should render progress bar', () => {
      render(<Progress value={50} data-testid="progress" />);
      const progress = screen.getByTestId('progress');
      expect(progress).toBeInTheDocument();
    });

    it('should handle different values', () => {
      const { rerender } = render(<Progress value={0} data-testid="progress" />);
      let progressBar = screen.getByTestId('progress').querySelector('[role="progressbar"]');
      expect(progressBar).toHaveStyle('transform: translateX(-100%)');

      rerender(<Progress value={50} data-testid="progress" />);
      progressBar = screen.getByTestId('progress').querySelector('[role="progressbar"]');
      expect(progressBar).toHaveStyle('transform: translateX(-50%)');

      rerender(<Progress value={100} data-testid="progress" />);
      progressBar = screen.getByTestId('progress').querySelector('[role="progressbar"]');
      expect(progressBar).toHaveStyle('transform: translateX(0%)');
    });

    it('should handle edge cases', () => {
      const { rerender } = render(<Progress value={-10} data-testid="progress" />);
      let progressBar = screen.getByTestId('progress').querySelector('[role="progressbar"]');
      expect(progressBar).toHaveStyle('transform: translateX(-100%)');

      rerender(<Progress value={150} data-testid="progress" />);
      progressBar = screen.getByTestId('progress').querySelector('[role="progressbar"]');
      expect(progressBar).toHaveStyle('transform: translateX(0%)');
    });
  });

  describe('Component Integration', () => {
    it('should work together in complex layouts', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div role="alert" className="border rounded p-3 mb-4">
              <p>System status: Normal</p>
            </div>
            <div className="mt-4">
              <Badge variant="secondary">Active</Badge>
              <Progress value={75} className="mt-2" />
              <Button className="mt-2" size="sm">View Details</Button>
            </div>
          </CardContent>
        </Card>
      );

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('System status: Normal')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'View Details' })).toBeInTheDocument();
    });

    it('should handle nested components correctly', () => {
      render(
        <div role="alert" className="border rounded p-3">
          <div>
            <Badge>Important</Badge>
            <span> This is a critical alert</span>
            <Button size="sm" className="ml-2">Acknowledge</Button>
          </div>
        </div>
      );

      expect(screen.getByText('Important')).toBeInTheDocument();
      expect(screen.getByText('This is a critical alert')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Acknowledge' })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <div>
          <Button aria-label="Close dialog">×</Button>
          <Progress value={50} aria-label="Loading progress" />
          <div role="alert" aria-live="polite" className="border rounded p-3">
            <p>Status update</p>
          </div>
        </div>
      );

      expect(screen.getByLabelText('Close dialog')).toBeInTheDocument();
      expect(screen.getByLabelText('Loading progress')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'polite');
    });

    it('should support keyboard navigation', () => {
      render(
        <div>
          <Button>First</Button>
          <Button>Second</Button>
          <Button>Third</Button>
        </div>
      );

      const buttons = screen.getAllByRole('button');
      
      buttons.forEach(button => {
        expect(button).toHaveAttribute('tabIndex', '0');
      });
    });
  });

  describe('Responsive Behavior', () => {
    it('should handle responsive classes', () => {
      render(
        <Card className="w-full md:w-1/2 lg:w-1/3">
          <CardContent>
            <Button className="w-full sm:w-auto">Responsive Button</Button>
          </CardContent>
        </Card>
      );

      const card = screen.getByText('Responsive Button').closest('.rounded-lg');
      const button = screen.getByRole('button');

      expect(card).toHaveClass('w-full', 'md:w-1/2', 'lg:w-1/3');
      expect(button).toHaveClass('w-full', 'sm:w-auto');
    });
  });

  describe('Theme Support', () => {
    it('should support dark mode classes', () => {
      render(
        <div className="dark">
          <Card className="bg-white dark:bg-gray-900">
            <CardContent>
              <Button className="bg-blue-500 dark:bg-blue-600">Theme Button</Button>
            </CardContent>
          </Card>
        </div>
      );

      const card = screen.getByText('Theme Button').closest('.rounded-lg');
      const button = screen.getByRole('button');

      expect(card).toHaveClass('dark:bg-gray-900');
      expect(button).toHaveClass('dark:bg-blue-600');
    });
  });
});