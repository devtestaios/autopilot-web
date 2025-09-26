import React from 'react';
import { screen } from '@testing-library/react';
import RootPage from '@/app/page';
import { render as renderWithWrapper } from '@/test-utils';

describe('Root Page', () => {
  it('should render root page', () => {
    renderWithWrapper(<RootPage />);
    
    // Check for main navigation element
    expect(screen.getByTestId('main-navigation')).toBeInTheDocument();
    
    // Check for landing page specific elements  
    expect(screen.getByText('PulseBridge.ai')).toBeInTheDocument();
  });

  it('should render without crashing', () => {
    const { container } = renderWithWrapper(<RootPage />);
    
    expect(container).toBeInTheDocument();
  });
});