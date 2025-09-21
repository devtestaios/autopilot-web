import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import {
  LoadingSpinner,
  LoadingOverlay,
  InlineLoading,
  ButtonLoading,
  SkeletonCard,
  PageLoading
} from '../LoadingComponents';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('LoadingComponents', () => {
  describe('LoadingSpinner', () => {
    it('renders with default size', () => {
      render(<LoadingSpinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('w-6', 'h-6');
    });

    it('renders with small size', () => {
      render(<LoadingSpinner size="sm" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('w-4', 'h-4');
    });

    it('renders with large size', () => {
      render(<LoadingSpinner size="lg" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('w-8', 'h-8');
    });

    it('applies custom className', () => {
      render(<LoadingSpinner className="text-red-500" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('text-red-500');
    });
  });

  describe('LoadingOverlay', () => {
    it('renders with default message', () => {
      render(<LoadingOverlay />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      // Check for the presence of the overlay container
      const overlay = screen.getByText('Loading...').closest('div');
      expect(overlay).toBeInTheDocument();
    });

    it('renders with custom message', () => {
      render(<LoadingOverlay message="Custom loading message" />);
      expect(screen.getByText('Custom loading message')).toBeInTheDocument();
    });

    it('applies transparent background when specified', () => {
      const { container } = render(<LoadingOverlay transparent />);
      const overlay = container.firstChild;
      expect(overlay).toHaveClass('bg-black/20', 'backdrop-blur-sm');
    });

    it('applies default background when not transparent', () => {
      const { container } = render(<LoadingOverlay />);
      const overlay = container.firstChild;
      expect(overlay).toHaveClass('bg-white/90', 'dark:bg-gray-900/90');
    });
  });

  describe('InlineLoading', () => {
    it('renders with default message and size', () => {
      render(<InlineLoading />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      // Check for the presence of the inline loading container
      const container = screen.getByText('Loading...').closest('div');
      expect(container).toBeInTheDocument();
    });

    it('renders with custom message', () => {
      render(<InlineLoading message="Processing..." />);
      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });

    it('renders with different sizes', () => {
      render(<InlineLoading size="lg" />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('w-8', 'h-8');
    });
  });

  describe('ButtonLoading', () => {
    it('renders children when not loading', () => {
      render(
        <ButtonLoading loading={false}>
          <span>Click me</span>
        </ButtonLoading>
      );
      expect(screen.getByText('Click me')).toBeInTheDocument();
      expect(screen.queryByRole('status', { hidden: true })).not.toBeInTheDocument();
    });

    it('shows spinner when loading', () => {
      render(
        <ButtonLoading loading={true}>
          <span>Click me</span>
        </ButtonLoading>
      );
      expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
      // Children should be hidden with opacity-0
      const childrenSpan = screen.getByText('Click me');
      expect(childrenSpan.parentElement).toHaveClass('opacity-0');
    });

    it('is disabled when loading', () => {
      render(
        <ButtonLoading loading={true}>
          <span>Click me</span>
        </ButtonLoading>
      );
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
    });

    it('is disabled when disabled prop is true', () => {
      render(
        <ButtonLoading disabled={true}>
          <span>Click me</span>
        </ButtonLoading>
      );
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('calls onClick when clicked and not disabled/loading', () => {
      const handleClick = jest.fn();
      render(
        <ButtonLoading onClick={handleClick}>
          <span>Click me</span>
        </ButtonLoading>
      );
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when loading', () => {
      const handleClick = jest.fn();
      render(
        <ButtonLoading loading={true} onClick={handleClick}>
          <span>Click me</span>
        </ButtonLoading>
      );
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('applies custom className', () => {
      render(
        <ButtonLoading className="custom-class">
          <span>Click me</span>
        </ButtonLoading>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });
  });

  describe('PageLoading', () => {
    it('renders dashboard skeleton by default', () => {
      const { container } = render(<PageLoading />);
      // Check for dashboard-specific elements
      expect(container.querySelector('.grid')).toBeInTheDocument();
      expect(container.querySelector('.space-y-6')).toBeInTheDocument();
    });

    it('renders table skeleton when type is table', () => {
      const { container } = render(<PageLoading type="table" />);
      // Check for table-specific elements
      expect(container.querySelector('.grid-cols-6')).toBeInTheDocument();
    });

    it('renders chart skeleton when type is chart', () => {
      const { container } = render(<PageLoading type="chart" />);
      // Check for chart-specific elements
      expect(container.querySelector('.h-64')).toBeInTheDocument();
    });

    it('renders form skeleton when type is form', () => {
      const { container } = render(<PageLoading type="form" />);
      // Check for form-specific elements
      expect(container.querySelector('.max-w-2xl')).toBeInTheDocument();
      expect(container.querySelector('.space-y-6')).toBeInTheDocument();
    });

    it('falls back to dashboard for unknown type', () => {
      const { container } = render(<PageLoading type={'unknown' as any} />);
      // Should render dashboard skeleton
      expect(container.querySelector('.grid')).toBeInTheDocument();
    });
  });
});