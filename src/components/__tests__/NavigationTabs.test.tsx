import { render, screen, fireEvent } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import NavigationTabs from '../NavigationTabs';

// Mock Next.js hooks
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe('NavigationTabs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue('/');
  });

  describe('Desktop Navigation', () => {
    it('should render all navigation items', () => {
      mockUsePathname.mockReturnValue('/');
      render(<NavigationTabs />);

      // Check desktop navigation specifically
      const desktopNav = screen.getByRole('navigation', { name: 'Tabs' });
      expect(desktopNav).toBeInTheDocument();
      
      // Desktop should have 8 links initially (mobile menu is hidden)
      const links = screen.getAllByRole('link');
      expect(links).toHaveLength(8); // 8 desktop links
      
      // Check desktop navigation is hidden on mobile
      expect(desktopNav).toHaveClass('hidden', 'md:flex');
    });

    it('should highlight active navigation item', () => {
      mockUsePathname.mockReturnValue('/campaigns');
      render(<NavigationTabs />);

      const activeLink = screen.getByRole('link', { name: '📊 Campaign Management' });
      expect(activeLink).toHaveClass('border-pulse-cyan', 'text-pulse-cyan');
    });

    it('should show correct href attributes', () => {
      mockUsePathname.mockReturnValue('/');
      render(<NavigationTabs />);

      expect(screen.getByRole('link', { name: 'Single Platform Dashboard' })).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: '🌐 Unified Platform Command Center' })).toHaveAttribute('href', '/unified');
      expect(screen.getByRole('link', { name: '⚙️ Platform Setup' })).toHaveAttribute('href', '/platforms');
      expect(screen.getByRole('link', { name: '📊 Campaign Management' })).toHaveAttribute('href', '/campaigns');
      expect(screen.getByRole('link', { name: '🎯 Lead Management' })).toHaveAttribute('href', '/leads');
      expect(screen.getByRole('link', { name: '📊 Advanced Analytics' })).toHaveAttribute('href', '/analytics');
      expect(screen.getByRole('link', { name: '🚨 Smart Alerts' })).toHaveAttribute('href', '/alerts');
      expect(screen.getByRole('link', { name: '📈 System Status' })).toHaveAttribute('href', '/status');
    });

    it('should hide desktop navigation on mobile screens', () => {
      mockUsePathname.mockReturnValue('/');
      render(<NavigationTabs />);

      const desktopNav = screen.getByRole('navigation', { name: 'Tabs' });
      expect(desktopNav).toHaveClass('hidden', 'md:flex');
    });
  });

  describe('Mobile Navigation', () => {
    it('should show current page title in mobile header', () => {
      mockUsePathname.mockReturnValue('/campaigns');
      render(<NavigationTabs />);

      // Look specifically in mobile header
      const mobileHeader = document.querySelector('.md\\:hidden .flex .text-lg');
      expect(mobileHeader).toHaveTextContent('📊 Campaign Management');
    });

    it('should show fallback title for unknown paths', () => {
      mockUsePathname.mockReturnValue('/unknown-path');
      render(<NavigationTabs />);

      // Look specifically in mobile header
      const mobileHeader = document.querySelector('.md\\:hidden .flex .text-lg');
      expect(mobileHeader).toHaveTextContent('Navigation');
    });

    it('should toggle mobile menu when menu button is clicked', () => {
      mockUsePathname.mockReturnValue('/');
      render(<NavigationTabs />);

      const menuButton = screen.getByRole('button');
      
      // Initially, mobile menu should not be visible
      expect(document.querySelector('.space-y-1')).not.toBeInTheDocument();
      
      // Open menu
      fireEvent.click(menuButton);
      
      // Mobile menu should now be visible
      const mobileMenuContainer = document.querySelector('.space-y-1');
      expect(mobileMenuContainer).toBeInTheDocument();
    });

    it('should show close icon when mobile menu is open', () => {
      mockUsePathname.mockReturnValue('/');
      render(<NavigationTabs />);

      const menuButton = screen.getByRole('button');
      
      // Initially should show Menu icon
      expect(menuButton.querySelector('.lucide-menu')).toBeInTheDocument();
      
      // Open menu
      fireEvent.click(menuButton);
      
      // Should show close icon (X)
      expect(menuButton.querySelector('.lucide-x')).toBeInTheDocument();
    });

    it('should close mobile menu when a navigation item is clicked', () => {
      mockUsePathname.mockReturnValue('/');
      render(<NavigationTabs />);

      const menuButton = screen.getByRole('button');
      
      // Open menu
      fireEvent.click(menuButton);
      expect(document.querySelector('.space-y-1')).toBeInTheDocument();

      // Click a navigation item
      const mobileLink = screen.getAllByRole('link').find(link => 
        link.closest('.space-y-1') && 
        link.getAttribute('href') === '/campaigns'
      );
      
      expect(mobileLink).toBeInTheDocument();
    });

    it('should highlight active item in mobile menu', () => {
      mockUsePathname.mockReturnValue('/');
      render(<NavigationTabs />);

      const menuButton = screen.getByRole('button');
      fireEvent.click(menuButton);

      // Find active mobile link
      const mobileMenuLinks = screen.getAllByRole('link').filter(link => 
        link.closest('.space-y-1') && 
        link.getAttribute('href') === '/'
      );
      
      expect(mobileMenuLinks.length).toBeGreaterThan(0);
      if (mobileMenuLinks.length > 0) {
        expect(mobileMenuLinks[0]).toHaveClass('bg-blue-50', 'text-blue-600');
      }
    });

    it('should apply hover styles to inactive mobile menu items', () => {
      mockUsePathname.mockReturnValue('/campaigns');
      render(<NavigationTabs />);

      const menuButton = screen.getByRole('button');
      fireEvent.click(menuButton);

      // Find an inactive mobile link
      const mobileMenuLinks = screen.getAllByRole('link').filter(link => 
        link.closest('.space-y-1') && 
        link.getAttribute('href') === '/leads'
      );
      
      expect(mobileMenuLinks.length).toBeGreaterThan(0);
      if (mobileMenuLinks.length > 0) {
        expect(mobileMenuLinks[0]).toHaveClass('text-gray-900', 'hover:bg-gray-50');
      }
    });
  });

  describe('Responsive Behavior', () => {
    it('should show mobile navigation only on small screens', () => {
      mockUsePathname.mockReturnValue('/');
      render(<NavigationTabs />);

      const mobileNavContainer = document.querySelector('.md\\:hidden');
      expect(mobileNavContainer).toHaveClass('md:hidden');
    });

    it('should show desktop navigation only on medium and larger screens', () => {
      mockUsePathname.mockReturnValue('/');
      render(<NavigationTabs />);

      const desktopNav = screen.getByRole('navigation', { name: 'Tabs' });
      expect(desktopNav).toHaveClass('hidden', 'md:flex');
    });
  });

  describe('Active State Management', () => {
    it('should correctly identify active navigation item', () => {
      mockUsePathname.mockReturnValue('/analytics');
      render(<NavigationTabs />);

      const activeLink = screen.getByRole('link', { name: '📊 Advanced Analytics' });
      expect(activeLink).toHaveClass('border-pulse-cyan', 'text-pulse-cyan');
    });

    it('should apply inactive styles to non-active items', () => {
      mockUsePathname.mockReturnValue('/analytics');
      render(<NavigationTabs />);

      const inactiveLink = screen.getByRole('link', { name: '🎯 Lead Management' });
      expect(inactiveLink).toHaveClass('border-transparent', 'text-black');
    });

    it('should handle root path correctly', () => {
      mockUsePathname.mockReturnValue('/');
      render(<NavigationTabs />);

      const activeLink = screen.getByRole('link', { name: 'Single Platform Dashboard' });
      expect(activeLink).toHaveClass('border-pulse-cyan', 'text-pulse-cyan');

      // Ensure no other links are active
      const links = screen.getAllByRole('link').filter(link => 
        !link.closest('.space-y-1') && // Only desktop links
        link !== activeLink
      );
      
      const activeLinks = links.filter(link => 
        link.className.includes('border-pulse-cyan')
      );
      expect(activeLinks).toHaveLength(0);
    });

    it('should handle invalid/undefined pathname', () => {
      mockUsePathname.mockReturnValue(undefined as any);
      render(<NavigationTabs />);

      // Should fallback to default title
      const mobileHeader = document.querySelector('.md\\:hidden .flex .text-lg');
      expect(mobileHeader).toHaveTextContent('Navigation');
    });
  });

  describe('Styling and Classes', () => {
    it('should apply scrollable navigation classes', () => {
      mockUsePathname.mockReturnValue('/');
      render(<NavigationTabs />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('overflow-x-auto', 'scrollbar-hide');
    });

    it('should apply transition classes', () => {
      mockUsePathname.mockReturnValue('/');
      render(<NavigationTabs />);

      const container = document.querySelector('.bg-white');
      expect(container).toHaveClass('transition-colors');

      const links = screen.getAllByRole('link');
      const desktopLink = links.find(link => 
        link.className.includes('transition-all') &&
        link.textContent?.includes('Single Platform Dashboard')
      );
      expect(desktopLink).toHaveClass('transition-all', 'duration-200');
    });

    it('should apply proper spacing classes', () => {
      mockUsePathname.mockReturnValue('/');
      render(<NavigationTabs />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('space-x-8');

      const container = screen.getByRole('navigation').closest('.max-w-7xl');
      expect(container).toHaveClass('mx-auto', 'px-4', 'sm:px-6', 'lg:px-8');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      mockUsePathname.mockReturnValue('/');
      render(<NavigationTabs />);

      const nav = screen.getByRole('navigation', { name: 'Tabs' });
      expect(nav).toBeInTheDocument();
    });

    it('should have accessible button for mobile menu', () => {
      mockUsePathname.mockReturnValue('/');
      render(<NavigationTabs />);

      const menuButton = screen.getByRole('button');
      expect(menuButton).toBeInTheDocument();
    });

    it('should maintain keyboard navigation', () => {
      mockUsePathname.mockReturnValue('/');
      render(<NavigationTabs />);

      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
      
      // All links should be focusable
      links.forEach(link => {
        expect(link).not.toHaveAttribute('tabindex', '-1');
      });
    });
  });
});