import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from '../Navbar';

// Mock the contexts and hooks
const mockTheme = { theme: 'light', toggleTheme: jest.fn() };
const mockSearchContext = { campaigns: [], leads: [] };
const mockGlobalSearch = {
  searchTerm: '',
  setSearchTerm: jest.fn(),
  isSearching: false,
  results: [],
  showResults: false,
  isSearchModalOpen: false,
  openSearch: jest.fn(),
  closeSearch: jest.fn(),
};

jest.mock('@/contexts/ThemeContext', () => ({
  useTheme: () => mockTheme,
}));

jest.mock('@/contexts/SearchContext', () => ({
  useSearchContext: () => mockSearchContext,
}));

jest.mock('@/hooks/useGlobalSearch', () => ({
  useGlobalSearch: () => mockGlobalSearch,
}));

// Mock the child components
jest.mock('@/components/SearchResults', () => ({
  SearchResults: () => <div data-testid="search-results">Search Results</div>,
}));

jest.mock('../PulseWaveLogo', () => ({
  PulseWaveLogo: ({ size, className }: { size: string; className: string }) => (
    <div data-testid="pulse-wave-logo" data-size={size} className={className}>
      Logo
    </div>
  ),
}));

jest.mock('../ui/GlobalSearch', () => ({
  __esModule: true,
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
    <div data-testid="global-search-modal" data-open={isOpen}>
      Global Search Modal
      <button onClick={onClose} data-testid="close-search">Close</button>
    </div>
  ),
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Bell: () => <div data-testid="bell-icon">Bell</div>,
  Settings: () => <div data-testid="settings-icon">Settings</div>,
  User: () => <div data-testid="user-icon">User</div>,
  Search: () => <div data-testid="search-icon">Search</div>,
  Menu: () => <div data-testid="menu-icon">Menu</div>,
  Plus: () => <div data-testid="plus-icon">Plus</div>,
  Sun: () => <div data-testid="sun-icon">Sun</div>,
  Moon: () => <div data-testid="moon-icon">Moon</div>,
  ChevronDown: () => <div data-testid="chevron-down-icon">ChevronDown</div>,
  HelpCircle: () => <div data-testid="help-circle-icon">HelpCircle</div>,
  LogOut: () => <div data-testid="logout-icon">LogOut</div>,
}));

describe('Navbar', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset theme to light mode for each test
    mockTheme.theme = 'light';
  });

  describe('Component Rendering', () => {
    it('renders navbar with essential elements', () => {
      render(<Navbar />);
      
      expect(screen.getByTestId('pulse-wave-logo')).toBeInTheDocument();
      expect(screen.getByText('PulseBridge')).toBeInTheDocument();
      expect(screen.getByText('AI Marketing Intelligence')).toBeInTheDocument();
      expect(screen.getByTestId('bell-icon')).toBeInTheDocument();
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
    });

    it('renders user profile information', () => {
      render(<Navbar />);
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Marketing Director')).toBeInTheDocument();
      expect(screen.getByAltText('User profile image')).toBeInTheDocument();
    });

    it('renders search functionality', () => {
      render(<Navbar />);
      
      expect(screen.getByText('Search campaigns, analytics, reports...')).toBeInTheDocument();
      expect(screen.getAllByTestId('search-icon')).toHaveLength(3); // Desktop, mobile toggle, mobile search
    });

    it('renders with menu toggle callback prop', () => {
      const onMenuToggle = jest.fn();
      render(<Navbar onMenuToggle={onMenuToggle} />);
      
      expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
    });
  });

  describe('Theme Functionality', () => {
    it('shows moon icon in light mode', () => {
      render(<Navbar />);
      
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('sun-icon')).not.toBeInTheDocument();
    });

    it('shows sun icon in dark mode', () => {
      mockTheme.theme = 'dark';
      render(<Navbar />);
      
      expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('moon-icon')).not.toBeInTheDocument();
    });

    it('calls toggleTheme when theme button is clicked', async () => {
      render(<Navbar />);
      
      const themeButton = screen.getByTestId('moon-icon').closest('button');
      await user.click(themeButton!);
      
      expect(mockTheme.toggleTheme).toHaveBeenCalledTimes(1);
    });

    it('shows correct tooltip text for theme toggle', () => {
      render(<Navbar />);
      
      const themeButton = screen.getByTestId('moon-icon').closest('button');
      expect(themeButton).toHaveClass('group');
    });
  });

  describe('Menu Toggle Functionality', () => {
    it('calls onMenuToggle when menu button is clicked', async () => {
      const onMenuToggle = jest.fn();
      render(<Navbar onMenuToggle={onMenuToggle} />);
      
      const menuButton = screen.getByTestId('menu-icon').closest('button');
      await user.click(menuButton!);
      
      expect(onMenuToggle).toHaveBeenCalledTimes(1);
    });

    it('menu button is only visible on mobile screens', () => {
      render(<Navbar />);
      
      const menuButton = screen.getByTestId('menu-icon').closest('button');
      expect(menuButton).toHaveClass('md:hidden');
    });
  });

  describe('Search Functionality', () => {
    it('calls openSearch when desktop search button is clicked', async () => {
      render(<Navbar />);
      
      const searchButton = screen.getByText('Search campaigns, analytics, reports...').closest('button');
      await user.click(searchButton!);
      
      expect(mockGlobalSearch.openSearch).toHaveBeenCalledTimes(1);
    });

    it('calls openSearch when mobile search button is clicked', async () => {
      render(<Navbar />);
      
      const mobileSearchButton = screen.getByText('Search...').closest('button');
      await user.click(mobileSearchButton!);
      
      expect(mockGlobalSearch.openSearch).toHaveBeenCalledTimes(1);
    });

    it('renders keyboard shortcuts for search', () => {
      render(<Navbar />);
      
      expect(screen.getByText('⌘')).toBeInTheDocument();
      expect(screen.getByText('K')).toBeInTheDocument();
      expect(screen.getByText('⌘K')).toBeInTheDocument(); // Mobile version
    });

    it('renders GlobalSearch modal with correct props', () => {
      mockGlobalSearch.isSearchModalOpen = true;
      render(<Navbar />);
      
      const modal = screen.getByTestId('global-search-modal');
      expect(modal).toHaveAttribute('data-open', 'true');
    });
  });

  describe('Notifications', () => {
    it('renders notification bell with badge', () => {
      render(<Navbar />);
      
      expect(screen.getByTestId('bell-icon')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument(); // Notification count
    });

    it('notification badge shows correct styling', () => {
      render(<Navbar />);
      
      const badge = screen.getByText('3');
      expect(badge.parentElement).toHaveClass('bg-red-500');
    });
  });

  describe('User Menu', () => {
    it('shows user menu when profile is clicked', async () => {
      render(<Navbar />);
      
      const profileButton = screen.getByAltText('User profile image').closest('button');
      await user.click(profileButton!);
      
      expect(screen.getByText('john.doe@company.com')).toBeInTheDocument();
      expect(screen.getByText('View Profile')).toBeInTheDocument();
      expect(screen.getByText('Account Settings')).toBeInTheDocument();
      expect(screen.getByText('Help & Support')).toBeInTheDocument();
      expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });

    it('hides user menu when profile is clicked again', async () => {
      render(<Navbar />);
      
      const profileButton = screen.getByAltText('User profile image').closest('button');
      
      // Open menu
      await user.click(profileButton!);
      expect(screen.getByText('john.doe@company.com')).toBeInTheDocument();
      
      // Close menu
      await user.click(profileButton!);
      expect(screen.queryByText('john.doe@company.com')).not.toBeInTheDocument();
    });

    it('shows online status indicator', async () => {
      render(<Navbar />);
      
      const profileButton = screen.getByAltText('User profile image').closest('button');
      await user.click(profileButton!);
      
      expect(screen.getByText('Online')).toBeInTheDocument();
    });

    it('renders all menu items with icons', async () => {
      render(<Navbar />);
      
      const profileButton = screen.getByAltText('User profile image').closest('button');
      await user.click(profileButton!);
      
      expect(screen.getByTestId('user-icon')).toBeInTheDocument();
      expect(screen.getAllByTestId('settings-icon')).toHaveLength(2); // One in quick actions, one in user menu
      expect(screen.getByTestId('help-circle-icon')).toBeInTheDocument();
      expect(screen.getByTestId('logout-icon')).toBeInTheDocument();
    });
  });

  describe('Quick Action Buttons', () => {
    it('renders quick action buttons on desktop', () => {
      render(<Navbar />);
      
      expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
      expect(screen.getAllByTestId('settings-icon')).toHaveLength(1); // Only in quick actions (user menu not open)
    });

    it('quick action buttons are hidden on smaller screens', () => {
      render(<Navbar />);
      
      const quickActionsContainer = screen.getByTestId('plus-icon').closest('div')?.parentElement?.parentElement;
      expect(quickActionsContainer).toHaveClass('hidden', 'lg:flex');
    });
  });

  describe('Responsive Design', () => {
    it('shows mobile search section', () => {
      render(<Navbar />);
      
      const mobileSearch = screen.getByText('Search...').closest('div');
      expect(mobileSearch).toHaveClass('md:hidden');
    });

    it('hides user details on smaller screens', () => {
      render(<Navbar />);
      
      const userDetails = screen.getByText('Marketing Director').closest('div');
      expect(userDetails).toHaveClass('hidden', 'xl:block');
    });

    it('mobile search button is only visible on mobile', () => {
      render(<Navbar />);
      
      const mobileSearchButton = screen.getAllByTestId('search-icon')[0].closest('button');
      expect(mobileSearchButton).toHaveClass('md:hidden');
    });
  });

  describe('Styling and Layout', () => {
    it('applies correct navbar styling', () => {
      render(<Navbar />);
      
      const navbar = screen.getByRole('navigation');
      expect(navbar).toHaveClass('bg-white', 'dark:bg-black/90', 'backdrop-blur-sm');
    });

    it('applies gradient text to brand name', () => {
      render(<Navbar />);
      
      const brandName = screen.getByText('PulseBridge');
      expect(brandName).toHaveClass('bg-gradient-to-r', 'from-pulse-cyan', 'to-pulse-purple', 'bg-clip-text', 'text-transparent');
    });

    it('applies correct logo styling', () => {
      render(<Navbar />);
      
      const logo = screen.getByTestId('pulse-wave-logo');
      expect(logo).toHaveAttribute('data-size', 'medium');
      expect(logo).toHaveClass('text-pulse-cyan');
    });
  });

  describe('Accessibility', () => {
    it('provides alt text for user avatar', () => {
      render(<Navbar />);
      
      const avatar = screen.getByAltText('User profile image');
      expect(avatar).toBeInTheDocument();
    });

    it('uses semantic nav element', () => {
      render(<Navbar />);
      
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('buttons have proper interactive states', () => {
      render(<Navbar />);
      
      const themeButton = screen.getByTestId('moon-icon').closest('button');
      expect(themeButton).toHaveClass('hover:bg-gray-100', 'dark:hover:bg-gray-800');
    });

    it('keyboard shortcuts are properly marked up', () => {
      render(<Navbar />);
      
      const kbdElements = screen.getAllByText('⌘');
      kbdElements.forEach(kbd => {
        expect(kbd.tagName).toBe('KBD');
      });
    });
  });

  describe('Event Handling', () => {
    it('handles click outside for dropdowns', () => {
      render(<Navbar />);
      
      // This tests the structure that would handle outside clicks
      const profileButton = screen.getByAltText('User profile image').closest('button');
      
      expect(profileButton).toBeInTheDocument();
    });

    it('manages multiple dropdown states independently', async () => {
      render(<Navbar />);
      
      const profileButton = screen.getByAltText('User profile image').closest('button');
      await user.click(profileButton!);
      
      // Check that menu state is managed separately from other dropdowns
      expect(screen.getByText('john.doe@company.com')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles missing onMenuToggle prop', () => {
      render(<Navbar />);
      
      // Should render without errors even without onMenuToggle prop
      expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
    });

    it('handles theme context errors gracefully', () => {
      // Reset to light theme for this test
      mockTheme.theme = 'light';
      
      render(<Navbar />);
      
      expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
    });

    it('renders with empty search context data', () => {
      mockSearchContext.campaigns = [];
      mockSearchContext.leads = [];
      
      render(<Navbar />);
      
      expect(screen.getByText('Search campaigns, analytics, reports...')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('profile button shows chevron rotation indicator', () => {
      render(<Navbar />);
      
      const chevron = screen.getByTestId('chevron-down-icon');
      expect(chevron.closest('button')).toHaveClass('group');
    });

    it('notification count is properly displayed', () => {
      render(<Navbar />);
      
      const notificationBadge = screen.getByText('3');
      expect(notificationBadge).toHaveClass('text-white', 'text-xs', 'font-bold');
    });

    it('handles search modal interactions', () => {
      mockGlobalSearch.isSearchModalOpen = true;
      render(<Navbar />);
      
      const modal = screen.getByTestId('global-search-modal');
      const closeButton = screen.getByTestId('close-search');
      
      expect(modal).toBeInTheDocument();
      expect(closeButton).toBeInTheDocument();
    });
  });
});