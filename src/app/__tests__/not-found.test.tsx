import React from 'react';
import { screen } from '@testing-library/react';
import NotFoundPage from '@/app/not-found';
import { render as renderWithWrapper } from '@/test-utils';

describe('NotFound Page', () => {
  it('should render not found page', () => {
    renderWithWrapper(<NotFoundPage />);
    
    // Check for typical 404 content
    expect(screen.getByText(/404/i) || screen.getByText(/not found/i) || screen.getByText(/page not found/i)).toBeInTheDocument();
  });

  it('should render without crashing', () => {
    const { container } = renderWithWrapper(<NotFoundPage />);
    
    expect(container).toBeInTheDocument();
  });

  it('should have proper page structure', () => {
    const { container } = renderWithWrapper(<NotFoundPage />);
    
    expect(container.firstChild).toBeInTheDocument();
  });
});