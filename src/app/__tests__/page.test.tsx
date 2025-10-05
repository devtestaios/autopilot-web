import React from 'react';
import { render, screen } from '@testing-library/react';
import RootPage from '@/app/page';
import { render as renderWithWrapper } from '@/test-utils';

describe('Root Page', () => {
  it('should render root page', () => {
    renderWithWrapper(<RootPage />);
    
    // Check for loading spinner and redirect message 
    expect(screen.getByText('Redirecting to dashboard...')).toBeInTheDocument();
    // Check for loading spinner element
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should render without crashing', () => {
    const { container } = renderWithWrapper(<RootPage />);
    
    expect(container).toBeInTheDocument();
  });
});