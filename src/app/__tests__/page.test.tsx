import React from 'react';
import { render, screen } from '@testing-library/react';
import RootPage from '@/app/page';
import { render as renderWithWrapper } from '@/test-utils';

describe('Root Page', () => {
  it('should render root page', () => {
    renderWithWrapper(<RootPage />);
    
    // Check for unique landing page elements - use getAllByTestId since there are multiple nav elements
    expect(screen.getAllByTestId('main-navigation')).toHaveLength(2);
  });

  it('should render without crashing', () => {
    const { container } = renderWithWrapper(<RootPage />);
    
    expect(container).toBeInTheDocument();
  });
});