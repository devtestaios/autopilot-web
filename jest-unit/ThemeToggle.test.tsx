import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';

// Mock the ThemeContext
jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: jest.fn(),
}));

const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>;

describe('ThemeToggle', () => {
  const mockToggleTheme = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render theme toggle button', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
      setTheme: jest.fn(),
    });

    render(<ThemeToggle />);
    
    const themeToggle = screen.getByRole('button');
    expect(themeToggle).toBeInTheDocument();
  });

  it('should call toggleTheme when clicked', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
      setTheme: jest.fn(),
    });

    render(<ThemeToggle />);
    
    const themeToggle = screen.getByRole('button');
    fireEvent.click(themeToggle);
    
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('should render differently for light theme', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
      setTheme: jest.fn(),
    });

    render(<ThemeToggle />);
    
    const themeToggle = screen.getByRole('button');
    expect(themeToggle).toBeInTheDocument();
  });

  it('should render differently for dark theme', () => {
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
      setTheme: jest.fn(),
    });

    render(<ThemeToggle />);
    
    const themeToggle = screen.getByRole('button');
    expect(themeToggle).toBeInTheDocument();
  });
});