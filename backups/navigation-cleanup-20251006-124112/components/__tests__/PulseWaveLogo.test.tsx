import React from 'react';
import { render, screen } from '@testing-library/react';
import PulseWaveLogo from '@/components/PulseWaveLogo';

describe('PulseWaveLogo', () => {
  it('should render pulse wave logo', () => {
    render(<PulseWaveLogo />);
    
    // Check if the logo container is rendered
    expect(screen.getByText('Pulse Bridge')).toBeInTheDocument();
  });

  it('should render with custom className', () => {
    const customClass = 'custom-logo-class';
    const { container } = render(<PulseWaveLogo className={customClass} />);
    
    expect(container.firstChild).toHaveClass(customClass);
  });

  it('should render with different sizes', () => {
    render(<PulseWaveLogo size="large" />);
    
    expect(screen.getByText('Pulse Bridge')).toBeInTheDocument();
  });

  it('should render with small size', () => {
    render(<PulseWaveLogo size="small" />);
    
    expect(screen.getByText('Pulse Bridge')).toBeInTheDocument();
  });

  it('should render with light variant', () => {
    render(<PulseWaveLogo variant="light" />);
    
    expect(screen.getByText('Pulse Bridge')).toBeInTheDocument();
  });

  it('should render without animation', () => {
    render(<PulseWaveLogo animated={false} />);
    
    expect(screen.getByText('Pulse Bridge')).toBeInTheDocument();
  });

  it('should render without text', () => {
    render(<PulseWaveLogo showText={false} />);
    
    // When showText is false, the text should not be rendered
    expect(screen.queryByText('Pulse Bridge')).not.toBeInTheDocument();
  });

  it('should render SVG elements', () => {
    const { container } = render(<PulseWaveLogo />);
    
    // Check that the component container exists
    expect(container.firstChild).toBeInTheDocument();
  });
});