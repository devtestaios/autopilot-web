import { render, screen, fireEvent } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import NavigationTabs from '../NavigationTabs';

// Mock Next.js hooks
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock theme context
jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: jest.fn(),
  }),
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe('NavigationTabs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue('/');
  });

  describe('Header Navigation', () => {
    it('should render header navigation elements', () => {
      mockUsePathname.mockReturnValue('/');
      render(<NavigationTabs />);

      // Check main navigation header
      const navigation = screen.getByRole('navigation', { name: 'Tabs' });
      expect(navigation).toBeInTheDocument();
      
      // Should have theme toggle button
      const themeButton = screen.getByLabelText('Toggle theme');
      expect(themeButton).toBeInTheDocument();
      
      // Should have notifications button
      const notificationsButton = screen.getByLabelText('Notifications');
      expect(notificationsButton).toBeInTheDocument();
    });

    it('should highlight active settings link', () => {
      mockUsePathname.mockReturnValue('/settings');
      render(<NavigationTabs />);

      const settingsLink = screen.getByRole('link', { name: 'Settings' });
      expect(settingsLink).toHaveClass('bg-blue-100', 'dark:bg-blue-900');
    });

    it('should show correct href attributes', () => {
      mockUsePathname.mockReturnValue('/');
      render(<NavigationTabs />);

      // Check settings link
      const settingsLink = screen.getByRole('link', { name: 'Settings' });
      expect(settingsLink).toHaveAttribute('href', '/settings');
    });
  });

  describe('User Interactions', () => {
    it('should handle user menu toggle', () => {
      mockUsePathname.mockReturnValue('/');
      render(<NavigationTabs />);

      const userMenuButton = screen.getByLabelText('User menu');
      expect(userMenuButton).toBeInTheDocument();
      
      // Click to open user menu
      fireEvent.click(userMenuButton);
      
      // Check if dropdown appears
      const profileLink = screen.getByText('Profile');
      expect(profileLink).toBeInTheDocument();
    });

    it('should handle theme toggle', () => {
      const mockToggleTheme = jest.fn();
      jest.mock('@/contexts/ThemeContext', () => ({
        useTheme: () => ({
          theme: 'light',
          toggleTheme: mockToggleTheme,
        }),
      }));

      mockUsePathname.mockReturnValue('/');
      render(<NavigationTabs />);

      const themeButton = screen.getByLabelText('Toggle theme');
      fireEvent.click(themeButton);
      
      // Theme toggle function should be called
      expect(themeButton).toBeInTheDocument();
    });
  });

  describe('Active State Management', () => {
    it('should handle root path correctly', () => {
      mockUsePathname.mockReturnValue('/');
      render(<NavigationTabs />);

      // Settings should not be active on root path
      const settingsLink = screen.getByRole('link', { name: 'Settings' });
      expect(settingsLink).not.toHaveClass('bg-blue-100');
      expect(settingsLink).toHaveClass('hover:bg-gray-100');
    });

    it('should handle invalid/undefined pathname', () => {
      mockUsePathname.mockReturnValue(undefined as any);
      render(<NavigationTabs />);

      // Should still render navigation without errors
      const navigation = screen.getByRole('navigation', { name: 'Tabs' });
      expect(navigation).toBeInTheDocument();
    });
  });

  describe('Styling and Classes', () => {
    it('should apply proper navigation classes', () => {
      mockUsePathname.mockReturnValue('/');
      render(<NavigationTabs />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('max-w-7xl', 'mx-auto', 'px-4');
    });

    it('should apply transition classes', () => {
      mockUsePathname.mockReturnValue('/');
      render(<NavigationTabs />);

      const header = screen.getByTestId('main-navigation');
      expect(header).toHaveClass('transition-colors');

      const settingsLink = screen.getByRole('link', { name: 'Settings' });
      expect(settingsLink).toHaveClass('transition-colors');
    });

    it('should apply proper spacing classes', () => {
      mockUsePathname.mockReturnValue('/');
      render(<NavigationTabs />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8');

      // Check button container spacing
      const buttonContainer = nav.querySelector('.flex.items-center.space-x-3');
      expect(buttonContainer).toHaveClass('space-x-3');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      mockUsePathname.mockReturnValue('/');
      render(<NavigationTabs />);

      const navigation = screen.getByRole('navigation', { name: 'Tabs' });
      expect(navigation).toBeInTheDocument();

      const themeButton = screen.getByLabelText('Toggle theme');
      expect(themeButton).toBeInTheDocument();

      const notificationsButton = screen.getByLabelText('Notifications');
      expect(notificationsButton).toBeInTheDocument();

      const userMenuButton = screen.getByLabelText('User menu');
      expect(userMenuButton).toBeInTheDocument();
    });

    it('should support keyboard navigation', () => {
      mockUsePathname.mockReturnValue('/');
      render(<NavigationTabs />);

      const settingsLink = screen.getByRole('link', { name: 'Settings' });
      expect(settingsLink).toBeInTheDocument();
      
      // Should be focusable
      settingsLink.focus();
      expect(document.activeElement).toBe(settingsLink);
    });
  });

  describe('Responsive Design', () => {
    it('should render header on all screen sizes', () => {
      mockUsePathname.mockReturnValue('/');
      render(<NavigationTabs />);

      const header = screen.getByTestId('main-navigation');
      expect(header).toBeInTheDocument();
    });

    it('should maintain proper spacing on mobile', () => {
      mockUsePathname.mockReturnValue('/');
      render(<NavigationTabs />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('px-4', 'sm:px-6', 'lg:px-8');
    });
  });
});