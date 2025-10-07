import React from 'react';
import { render, screen } from '@testing-library/react';
import RootPage from '@/app/page';
import { render as renderWithWrapper } from '@/test-utils';

describe('Root Page', () => {
  it('should render root page', () => {
    renderWithWrapper(<RootPage />);
    
    // Check for landing page content 
    expect(screen.getByText('Stop Managing 15+ Tools.')).toBeInTheDocument();
    expect(screen.getByText('Start Growing Instead.')).toBeInTheDocument();
    expect(screen.getByText('AI-Powered Marketing Platform')).toBeInTheDocument();
  });

  it('should render without crashing', () => {
    const { container } = renderWithWrapper(<RootPage />);
    
    expect(container).toBeInTheDocument();
  });
});