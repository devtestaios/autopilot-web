import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Mock Next.js components and hooks
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock('next/link', () => {
  return function MockLink({ children, href }: { children: React.ReactNode; href: string }) {
    return <a href={href}>{children}</a>;
  };
});

describe('UI Components', () => {
  describe('Button Component', () => {
    it('should render with default props', () => {
      render(<Button>Click me</Button>);
      
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('btn');
    });

    it('should handle different variants', () => {
      const { rerender } = render(<Button variant="default">Default</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-blue-600');

      rerender(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-gray-600');

      rerender(<Button variant="outline">Outline</Button>);
      expect(screen.getByRole('button')).toHaveClass('border');
    });

    it('should handle different sizes', () => {
      const { rerender } = render(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-9');

      rerender(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-11');

      rerender(<Button size="default">Default</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-10');
    });

    it('should handle disabled state', () => {
      render(<Button disabled>Disabled</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:opacity-50');
    });

    it('should handle special button states', () => {
      const { rerender } = render(<Button disabled>Disabled</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:opacity-50');

      rerender(<Button type="submit">Submit</Button>);
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should handle click events', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Clickable</Button>);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not trigger click when disabled', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick} disabled>Disabled</Button>);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should accept custom className', () => {
      render(<Button className="custom-class">Custom</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveClass('inline-flex');
    });

    it('should render with custom attributes', () => {
      render(<Button data-testid="test-button" tabIndex={-1}>Test</Button>);
      
      const button = screen.getByTestId('test-button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('tabindex', '-1');
    });
  });

  describe('Badge Component', () => {
    it('should render with default props', () => {
      render(<Badge>Default Badge</Badge>);
      
      const badge = screen.getByText('Default Badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass('inline-flex');
    });

    it('should handle different variants', () => {
      const { rerender } = render(<Badge variant="default">Default</Badge>);
      expect(screen.getByText('Default')).toHaveClass('bg-blue-100');

      rerender(<Badge variant="secondary">Secondary</Badge>);
      expect(screen.getByText('Secondary')).toHaveClass('bg-gray-100');

      rerender(<Badge variant="destructive">Destructive</Badge>);
      expect(screen.getByText('Destructive')).toHaveClass('bg-red-100');

      rerender(<Badge variant="outline">Outline</Badge>);
      expect(screen.getByText('Outline')).toHaveClass('border');
    });

    it('should handle click functionality', () => {
      const handleClick = jest.fn();
      render(<Badge onClick={handleClick}>Clickable</Badge>);
      
      const badge = screen.getByText('Clickable');
      expect(badge.tagName).toBe('BUTTON');
      
      fireEvent.click(badge);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should accept custom className', () => {
      render(<Badge className="custom-badge">Custom</Badge>);
      
      const badge = screen.getByText('Custom');
      expect(badge).toHaveClass('custom-badge');
      expect(badge).toHaveClass('inline-flex');
    });

    it('should render with icons', () => {
      const Icon = () => <span data-testid="icon">🔥</span>;
      render(<Badge><Icon />Hot</Badge>);
      
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText('Hot')).toBeInTheDocument();
    });
  });

  describe('Progress Component', () => {
    it('should render with default props', () => {
      render(<Progress value={50} />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();
      expect(progress).toHaveAttribute('aria-valuenow', '50');
    });

    it('should handle different values', () => {
      const { rerender } = render(<Progress value={0} />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');

      rerender(<Progress value={100} />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');

      rerender(<Progress value={75} />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75');
    });

    it('should handle different max values', () => {
      const { rerender } = render(<Progress value={50} max={100} />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '100');
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');

      rerender(<Progress value={25} max={50} />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '50');
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '25');
    });

    it('should display accessible labels', () => {
      render(<Progress value={60} aria-label="Upload progress" />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-label', 'Upload progress');
      expect(progress).toHaveAttribute('aria-valuenow', '60');
    });

    it('should handle custom className and data attributes', () => {
      render(<Progress value={50} className="custom-progress" data-testid="progress-bar" />);
      
      const progress = screen.getByTestId('progress-bar');
      expect(progress).toHaveClass('custom-progress');
      expect(progress).toHaveClass('w-full');
    });

    it('should handle edge case values', () => {
      const { rerender } = render(<Progress value={0} />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');

      rerender(<Progress value={100} />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');

      rerender(<Progress value={150} max={100} />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '150');
    });

    it('should update progress values dynamically', async () => {
      const { rerender } = render(<Progress value={25} />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '25');
      
      rerender(<Progress value={75} />);
      
      await waitFor(() => {
        expect(progress).toHaveAttribute('aria-valuenow', '75');
      });
    });
  });

  describe('Component Integration', () => {
    it('should work together in a form context', () => {
      const TestForm = () => {
        const [loading, setLoading] = React.useState(false);
        const [progress, setProgress] = React.useState(0);
        const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle');

        const handleSubmit = () => {
          setLoading(true);
          setProgress(0);
          
          // Simulate progress
          const interval = setInterval(() => {
            setProgress(prev => {
              if (prev >= 100) {
                clearInterval(interval);
                setLoading(false);
                setStatus('success');
                return 100;
              }
              return prev + 10;
            });
          }, 100);
        };

        return (
          <div>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Processing...' : 'Submit'}
            </Button>
            
            {loading && (
              <Progress value={progress} aria-label="Processing progress" />
            )}
            
            {status === 'success' && (
              <Badge variant="secondary">Completed Successfully</Badge>
            )}
          </div>
        );
      };

      render(<TestForm />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Submit');
      
      fireEvent.click(button);
      
      expect(button).toHaveTextContent('Processing...');
      expect(button).toBeDisabled();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should handle keyboard navigation', () => {
      render(
        <div>
          <Button data-testid="button1">First</Button>
          <Button data-testid="button2">Second</Button>
          <Button data-testid="button3">Third</Button>
        </div>
      );

      const button1 = screen.getByTestId('button1');
      const button2 = screen.getByTestId('button2');
      
      button1.focus();
      expect(button1).toHaveFocus();
      
      fireEvent.keyDown(button1, { key: 'Tab' });
      button2.focus();
      expect(button2).toHaveFocus();
    });

    it('should support accessibility features', () => {
      render(
        <div>
          <Button aria-label="Close dialog">×</Button>
          <Progress value={50} aria-label="Upload progress" />
          <Badge role="status" aria-live="polite">3 new messages</Badge>
        </div>
      );

      const button = screen.getByLabelText('Close dialog');
      const progress = screen.getByLabelText('Upload progress');
      const badge = screen.getByRole('status');

      expect(button).toBeInTheDocument();
      expect(progress).toBeInTheDocument();
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Performance and Optimization', () => {
    it('should not re-render unnecessarily', () => {
      let renderCount = 0;
      
      const TestComponent = React.memo(({ value }: { value: number }) => {
        renderCount++;
        return <Progress value={value} />;
      });

      const { rerender } = render(<TestComponent value={50} />);
      expect(renderCount).toBe(1);

      // Same value should not cause re-render
      rerender(<TestComponent value={50} />);
      expect(renderCount).toBe(1);

      // Different value should cause re-render
      rerender(<TestComponent value={75} />);
      expect(renderCount).toBe(2);
    });

    it('should handle rapid state changes', async () => {
      const RapidUpdate = () => {
        const [value, setValue] = React.useState(0);

        React.useEffect(() => {
          const interval = setInterval(() => {
            setValue(prev => (prev + 1) % 101);
          }, 10);

          return () => clearInterval(interval);
        }, []);

        return <Progress value={value} />;
      };

      render(<RapidUpdate />);
      
      const progress = screen.getByRole('progressbar');
      expect(progress).toBeInTheDocument();

      // Wait for some updates
      await waitFor(() => {
        const currentValue = parseInt(progress.getAttribute('aria-valuenow') || '0');
        expect(currentValue).toBeGreaterThan(0);
      });
    });

    it('should handle large datasets efficiently', () => {
      const LargeList = () => {
        const items = Array.from({ length: 1000 }, (_, i) => ({
              id: i,
              name: `Item ${i}`,
              status: i % 3 === 0 ? 'secondary' : i % 3 === 1 ? 'destructive' : 'default'
            }));

            return (
              <div>
                {items.slice(0, 10).map(item => (
                  <Badge key={item.id} variant={item.status as any}>
                    {item.name}
                  </Badge>
                ))}
              </div>
            );
      };

      const startTime = performance.now();
      render(<LargeList />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // Should render quickly
      expect(screen.getAllByText(/Item \d+/)).toHaveLength(10);
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined props gracefully', () => {
      render(<Button>{undefined}</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should handle null children', () => {
      render(<Badge>{null}</Badge>);
      expect(screen.getByRole('generic')).toBeInTheDocument();
    });

    it('should handle extreme progress values', () => {
      const { rerender } = render(<Progress value={-10} />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');

      rerender(<Progress value={150} />);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    });

    it('should handle very long text content', () => {
      const longText = 'A'.repeat(1000);
      render(<Button>{longText}</Button>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button.textContent).toBe(longText);
    });

    it('should handle special characters', () => {
      const specialText = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      render(<Badge>{specialText}</Badge>);
      
      expect(screen.getByText(specialText)).toBeInTheDocument();
    });
  });

  describe('Theme Integration', () => {
    it('should respect theme classes', () => {
      render(
        <div className="theme-dark">
          <Button variant="primary">Dark Theme Button</Button>
        </div>
      );

      const button = screen.getByRole('button');
      expect(button.closest('.theme-dark')).toBeInTheDocument();
    });

    it('should handle custom CSS variables', () => {
      render(
        <div style={{ '--primary-color': '#ff0000' } as React.CSSProperties}>
          <Badge variant="default">Custom Color</Badge>
        </div>
      );

      const badge = screen.getByText('Custom Color');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Error Boundaries', () => {
    it('should handle component errors gracefully', () => {
      const ErrorComponent = () => {
        throw new Error('Test error');
      };

      const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
        try {
          return <>{children}</>;
        } catch (error) {
          return <div>Error occurred</div>;
        }
      };

      // Suppress console.error for this test
      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        render(
          <ErrorBoundary>
            <ErrorComponent />
          </ErrorBoundary>
        );
      }).not.toThrow();

      console.error = originalError;
    });
  });
});