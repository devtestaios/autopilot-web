import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Mock Next.js components
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/test',
}));

describe('Core UI Components - Production Coverage', () => {
  describe('Button Component', () => {
    it('renders with default styling', () => {
      render(<Button>Test Button</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('inline-flex', 'items-center', 'justify-center');
    });

    it('handles variant prop correctly', () => {
      const { rerender } = render(<Button variant="default">Default</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-blue-600');

      rerender(<Button variant="destructive">Destructive</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-red-600');

      rerender(<Button variant="outline">Outline</Button>);
      expect(screen.getByRole('button')).toHaveClass('border');

      rerender(<Button variant="ghost">Ghost</Button>);
      expect(screen.getByRole('button')).toHaveClass('text-gray-700');

      rerender(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-gray-600');
    });

    it('handles size prop correctly', () => {
      const { rerender } = render(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-9');

      rerender(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-11');

      rerender(<Button size="default">Default</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-10');
    });

    it('passes through HTML button props', () => {
      const handleClick = jest.fn();
      render(
        <Button 
          onClick={handleClick}
          disabled
          data-testid="test-button"
          type="submit"
        >
          Test
        </Button>
      );
      
      const button = screen.getByTestId('test-button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('type', 'submit');
      
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled(); // because disabled
    });

    it('handles className merging', () => {
      render(<Button className="custom-class">Custom</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveClass('inline-flex'); // retains base classes
    });

    it('handles tabIndex correctly', () => {
      render(<Button tabIndex={-1}>Unfocusable</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('tabindex', '-1');
    });
  });

  describe('Badge Component', () => {
    it('renders as span by default', () => {
      render(<Badge>Test Badge</Badge>);
      
      const badge = screen.getByText('Test Badge');
      expect(badge).toBeInTheDocument();
      expect(badge.tagName).toBe('SPAN');
      expect(badge).toHaveClass('inline-flex', 'items-center');
    });

    it('renders as button when onClick provided', () => {
      const handleClick = jest.fn();
      render(<Badge onClick={handleClick}>Clickable Badge</Badge>);
      
      const badge = screen.getByText('Clickable Badge');
      expect(badge.tagName).toBe('BUTTON');
      
      fireEvent.click(badge);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('handles variant styling correctly', () => {
      const { rerender } = render(<Badge variant="default">Default</Badge>);
      expect(screen.getByText('Default')).toHaveClass('bg-blue-100', 'text-blue-800');

      rerender(<Badge variant="secondary">Secondary</Badge>);
      expect(screen.getByText('Secondary')).toHaveClass('bg-gray-100', 'text-gray-800');

      rerender(<Badge variant="destructive">Destructive</Badge>);
      expect(screen.getByText('Destructive')).toHaveClass('bg-red-100', 'text-red-800');

      rerender(<Badge variant="outline">Outline</Badge>);
      expect(screen.getByText('Outline')).toHaveClass('border', 'border-gray-200');
    });

    it('handles data-testid attribute', () => {
      render(<Badge data-testid="test-badge">Test</Badge>);
      expect(screen.getByTestId('test-badge')).toBeInTheDocument();
    });

    it('merges custom className', () => {
      render(<Badge className="custom-badge-class">Custom</Badge>);
      
      const badge = screen.getByText('Custom');
      expect(badge).toHaveClass('custom-badge-class');
      expect(badge).toHaveClass('inline-flex'); // retains base classes
    });
  });

  describe('Progress Component', () => {
    it('renders with correct ARIA attributes', () => {
      render(<Progress value={50} />);
      
      const container = screen.getByRole('progressbar');
      expect(container).toHaveAttribute('aria-valuenow', '50');
      expect(container).toHaveAttribute('aria-valuemin', '0');
      expect(container).toHaveAttribute('aria-valuemax', '100');
      expect(container).toHaveAttribute('aria-label', 'Loading progress');
    });

    it('handles custom max value', () => {
      render(<Progress value={30} max={60} />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuemax', '60');
      expect(progress).toHaveAttribute('aria-valuenow', '30');
    });

    it('handles custom aria-label', () => {
      render(<Progress value={75} aria-label="Upload progress" />);
      
      const progressBars = screen.getAllByRole('progressbar');
      const mainProgress = progressBars.find(el => el.getAttribute('aria-label') === 'Upload progress');
      expect(mainProgress).toHaveAttribute('aria-label', 'Upload progress');
    });

    it('handles edge case values correctly', () => {
      const { rerender } = render(<Progress value={-10} />);
      // Progress component should clamp negative values to 0%
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '-10');
      
      rerender(<Progress value={150} max={100} />);
      // Progress component should handle values exceeding max
      expect(progress).toHaveAttribute('aria-valuenow', '150');
    });

    it('handles data-testid and className', () => {
      render(
        <Progress 
          value={40} 
          data-testid="test-progress" 
          className="custom-progress"
        />
      );
      
      const progress = screen.getByTestId('test-progress');
      expect(progress).toHaveClass('custom-progress');
      expect(progress).toHaveClass('w-full'); // retains base classes
    });

    it('handles zero max edge case', () => {
      render(<Progress value={50} max={0} />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuemax', '0');
    });
  });

  describe('Card Components', () => {
    it('renders Card with proper structure', () => {
      render(
        <Card data-testid="test-card">
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
          </CardHeader>
          <CardContent>
            Test content
          </CardContent>
        </Card>
      );
      
      const card = screen.getByTestId('test-card');
      expect(card).toBeInTheDocument();
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });

    it('handles className merging for all card components', () => {
      render(
        <Card className="custom-card">
          <CardHeader className="custom-header">
            <CardTitle className="custom-title">Title</CardTitle>
          </CardHeader>
          <CardContent className="custom-content">
            Content
          </CardContent>
        </Card>
      );
      
      expect(screen.getByText('Title').closest('.custom-card')).toBeInTheDocument();
      expect(screen.getByText('Title').closest('.custom-header')).toBeInTheDocument();
      expect(screen.getByText('Title')).toHaveClass('custom-title');
      expect(screen.getByText('Content')).toHaveClass('custom-content');
    });
  });

  describe('Utility Functions', () => {
    it('tests cn utility function directly', () => {
      expect(cn('base-class', 'additional-class')).toBe('base-class additional-class');
      expect(cn('class1', undefined, 'class2')).toBe('class1 class2');
      expect(cn('')).toBe('');
      expect(cn()).toBe('');
    });
  });

  describe('Component Integration', () => {
    it('handles complex component interactions', () => {
      const TestComponent = () => {
        const [progress, setProgress] = React.useState(0);
        const [status, setStatus] = React.useState<'idle' | 'loading' | 'complete'>('idle');

        const handleStart = () => {
          setStatus('loading');
          setProgress(0);
          
          const interval = setInterval(() => {
            setProgress(prev => {
              if (prev >= 100) {
                clearInterval(interval);
                setStatus('complete');
                return 100;
              }
              return prev + 25;
            });
          }, 100);
        };

        return (
          <Card>
            <CardHeader>
              <CardTitle>Progress Test</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={handleStart} disabled={status === 'loading'}>
                {status === 'loading' ? 'Processing...' : 'Start'}
              </Button>
              
              {status === 'loading' && (
                <Progress value={progress} aria-label="Processing" />
              )}
              
              {status === 'complete' && (
                <Badge variant="secondary">Complete</Badge>
              )}
            </CardContent>
          </Card>
        );
      };

      render(<TestComponent />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Start');
      
      fireEvent.click(button);
      
      expect(button).toHaveTextContent('Processing...');
      expect(button).toBeDisabled();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('handles accessibility features correctly', () => {
      render(
        <div>
          <Button aria-label="Close modal">×</Button>
          <Progress value={50} aria-label="File upload" />
          <Badge>Status: Active</Badge>
        </div>
      );

      const button = screen.getByLabelText('Close modal');
      const progress = screen.getByLabelText('File upload');
      const badge = screen.getByText('Status: Active');

      expect(button).toBeInTheDocument();
      expect(progress).toBeInTheDocument();
      expect(badge).toBeInTheDocument();
    });

    it('handles dynamic styling updates', () => {
      const DynamicComponent = () => {
        const [variant, setVariant] = React.useState<'default' | 'destructive'>('default');
        
        return (
          <div>
            <Button 
              variant={variant}
              onClick={() => setVariant(variant === 'default' ? 'destructive' : 'default')}
            >
              Toggle Style
            </Button>
            <Badge variant={variant === 'default' ? 'default' : 'destructive'}>
              Status
            </Badge>
          </div>
        );
      };

      render(<DynamicComponent />);
      
      const button = screen.getByRole('button');
      const badge = screen.getByText('Status');
      
      expect(button).toHaveClass('bg-blue-600');
      expect(badge).toHaveClass('bg-blue-100');
      
      fireEvent.click(button);
      
      expect(button).toHaveClass('bg-red-600');
      expect(badge).toHaveClass('bg-red-100');
    });
  });

  describe('Error Handling', () => {
    it('handles undefined children gracefully', () => {
      expect(() => {
        render(<Button>{undefined}</Button>);
      }).not.toThrow();
      
      expect(() => {
        render(<Badge>{null}</Badge>);
      }).not.toThrow();
    });

    it('handles invalid prop combinations', () => {
      // TypeScript would catch these, but testing runtime behavior
      expect(() => {
        render(<Button variant={'invalid' as any}>Test</Button>);
      }).not.toThrow();
      
      expect(() => {
        render(<Progress value={NaN} />);
      }).not.toThrow();
    });
  });
});