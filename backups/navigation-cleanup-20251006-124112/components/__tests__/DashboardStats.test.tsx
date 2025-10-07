import { render, screen, waitFor } from '../../test-utils';
import DashboardStats from '../DashboardStats';
import { checkApiHealth } from '@/lib/api';
import type { Campaign } from '@/types';

// Mock the API module
jest.mock('@/lib/api');
const mockCheckApiHealth = checkApiHealth as jest.MockedFunction<typeof checkApiHealth>;

// Mock data for testing
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Test Campaign 1',
    platform: 'google_ads',
    budget: 1000,
    spend: 750,
    status: 'active',
    client_name: 'Test Client 1',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    metrics: {}
  },
  {
    id: '2',
    name: 'Test Campaign 2',
    platform: 'meta',
    budget: 2000,
    spend: 500,
    status: 'active',
    client_name: 'Test Client 2',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    metrics: {}
  },
  {
    id: '3',
    name: 'Test Campaign 3',
    platform: 'google_ads',
    budget: 1500,
    spend: 1500,
    status: 'paused',
    client_name: 'Test Client 3',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    metrics: {}
  }
];

const mockHealthStatus = {
  health: 'healthy',
  version: '1.0.0',
  database: 'connected'
};

describe('DashboardStats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCheckApiHealth.mockResolvedValue(mockHealthStatus);
  });

  describe('Loading State', () => {
    it('should render loading skeleton when loading prop is true', () => {
      render(<DashboardStats campaigns={[]} loading={true} />);
      
      // Should render 4 skeleton cards
      const skeletonCards = screen.getAllByRole('generic').filter((el: HTMLElement) => 
        el.className.includes('animate-pulse')
      );
      expect(skeletonCards).toHaveLength(4);
    });

    it('should not render stats content when loading', () => {
      render(<DashboardStats campaigns={mockCampaigns} loading={true} />);
      
      // Should not render the main stats grid
      expect(screen.queryByTestId('dashboard-stats')).not.toBeInTheDocument();
    });
  });

  describe('Campaign Statistics Calculations', () => {
    it('should calculate total campaigns correctly', async () => {
      render(<DashboardStats campaigns={mockCampaigns} />);
      
      await waitFor(() => {
        expect(screen.getByText('Total Campaigns')).toBeInTheDocument();
        // Check for the total campaigns count in the Total Campaigns card
        const totalCampaignsCard = screen.getByText('Total Campaigns').closest('div');
        expect(totalCampaignsCard).toHaveTextContent('3');
      });
    });

    it('should calculate total budget correctly', async () => {
      render(<DashboardStats campaigns={mockCampaigns} />);
      
      // Total budget: 1000 + 2000 + 1500 = 4500
      await waitFor(() => {
        expect(screen.getByText('Total Budget')).toBeInTheDocument();
        // Find the Total Budget card specifically and check it contains 4,500
        const budgetCard = screen.getByText('Total Budget').closest('div');
        expect(budgetCard).toHaveTextContent('4,500');
      });
    });

    it('should calculate total spend correctly', async () => {
      render(<DashboardStats campaigns={mockCampaigns} />);
      
      // Total spend: 750 + 500 + 1500 = 2750
      await waitFor(() => {
        expect(screen.getByText('Total Spend')).toBeInTheDocument();
        expect(screen.getByText('$2,750')).toBeInTheDocument();
      });
    });

    it('should calculate remaining budget correctly', async () => {
      render(<DashboardStats campaigns={mockCampaigns} />);
      
      // Remaining: 4500 - 2750 = 1750
      await waitFor(() => {
        expect(screen.getByText('Remaining Budget')).toBeInTheDocument();
        expect(screen.getByText('$1,750')).toBeInTheDocument();
      });
    });

    it('should calculate active campaigns correctly', async () => {
      render(<DashboardStats campaigns={mockCampaigns} />);
      
      // Active campaigns: spend < budget (campaigns 1 and 2)
      await waitFor(() => {
        expect(screen.getByText('2 active')).toBeInTheDocument();
        expect(screen.getByText('1 paused')).toBeInTheDocument();
      });
    });

    it('should calculate spend percentage correctly', async () => {
      render(<DashboardStats campaigns={mockCampaigns} />);
      
      // Spend percentage: (2750 / 4500) * 100 = 61.1%
      await waitFor(() => {
        expect(screen.getByText('61.1% of budget')).toBeInTheDocument();
      });
    });

    it('should calculate remaining budget percentage correctly', async () => {
      render(<DashboardStats campaigns={mockCampaigns} />);
      
      // Remaining percentage: ((4500 - 2750) / 4500) * 100 = 38.9%
      await waitFor(() => {
        expect(screen.getByText('38.9% available')).toBeInTheDocument();
      });
    });
  });

  describe('Platform Breakdown', () => {
    it('should group campaigns by platform correctly', async () => {
      render(<DashboardStats campaigns={mockCampaigns} />);
      
      await waitFor(() => {
        // Google Ads: 2 campaigns (displayed as "google ads" due to CSS capitalize)
        expect(screen.getByText('google ads')).toBeInTheDocument();
        
        // Meta: 1 campaign  
        expect(screen.getByText('meta')).toBeInTheDocument();
      });

      // Check the platform distribution section is displayed
      const platformSection = screen.getByText('Platform Distribution').closest('div');
      expect(platformSection).toBeInTheDocument();
    });

    it('should not render platform breakdown when no campaigns', async () => {
      render(<DashboardStats campaigns={[]} />);
      
      await waitFor(() => {
        expect(screen.queryByText('Campaigns by Platform')).not.toBeInTheDocument();
      });
    });

    it('should format platform names correctly', async () => {
      const campaignsWithLinkedIn: Campaign[] = [
        {
          ...mockCampaigns[0],
          platform: 'linkedin_ads'
        }
      ];
      
      render(<DashboardStats campaigns={campaignsWithLinkedIn} />);
      
      await waitFor(() => {
        expect(screen.getByText('linkedin ads')).toBeInTheDocument();
      });
    });
  });

  describe('Currency Formatting', () => {
    it('should format currency correctly for whole numbers', async () => {
      const campaignsWithRoundNumbers: Campaign[] = [
        {
          ...mockCampaigns[0],
          budget: 1000,
          spend: 500
        }
      ];
      
      render(<DashboardStats campaigns={campaignsWithRoundNumbers} />);
      
      await waitFor(() => {
        // Find the Total Budget card specifically and check it contains 1,000
        const budgetCard = screen.getByText('Total Budget').closest('div');
        expect(budgetCard).toHaveTextContent('1,000');
        // Total Spend uses formatCurrency: $500 (appears twice - Total Spend and Remaining Budget)
        const spendValues = screen.getAllByText('$500');
        expect(spendValues).toHaveLength(2);
      });
    });

    it('should handle large numbers with commas', async () => {
      const campaignsWithLargeNumbers: Campaign[] = [
        {
          ...mockCampaigns[0],
          budget: 10000,
          spend: 5000
        }
      ];
      
      render(<DashboardStats campaigns={campaignsWithLargeNumbers} />);
      
      await waitFor(() => {
        // Find the Total Budget card specifically and check it contains 10,000
        const budgetCard = screen.getByText('Total Budget').closest('div');
        expect(budgetCard).toHaveTextContent('10,000');
        // Find the Total Spend card specifically and check it contains $5,000
        const spendCard = screen.getByText('Total Spend').closest('div');
        expect(spendCard).toHaveTextContent('$5,000');
      });
    });
  });

  describe('Health Status', () => {
    it('should fetch and display health status', async () => {
      render(<DashboardStats campaigns={mockCampaigns} />);
      
      await waitFor(() => {
        expect(screen.getByText('System Status')).toBeInTheDocument();
        expect(screen.getByText('All systems operational')).toBeInTheDocument();
        expect(screen.getByText('healthy')).toBeInTheDocument();
        expect(screen.getByText('1.0.0')).toBeInTheDocument();
        expect(screen.getByText('connected')).toBeInTheDocument();
      });

      expect(mockCheckApiHealth).toHaveBeenCalledTimes(1);
    });

    it('should not render health status when API call fails', async () => {
      // Reset the mock for this specific test
      jest.clearAllMocks();
      mockCheckApiHealth.mockRejectedValueOnce(new Error('API Error'));
      
      render(<DashboardStats campaigns={mockCampaigns} />);
      
      await waitFor(() => {
        expect(screen.queryByText('System Status')).not.toBeInTheDocument();
      });
    });

    it('should call health check on component mount', () => {
      render(<DashboardStats campaigns={mockCampaigns} />);
      
      expect(mockCheckApiHealth).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty campaigns array', async () => {
      render(<DashboardStats campaigns={[]} />);
      
      await waitFor(() => {
        expect(screen.getByText('Total Campaigns')).toBeInTheDocument();
        const totalCampaignsCard = screen.getByText('Total Campaigns').closest('div');
        expect(totalCampaignsCard).toHaveTextContent('0');
        expect(screen.getByText('Total Spend')).toBeInTheDocument();
        // Check that there are multiple $0 values as expected
        const dollarZeroElements = screen.getAllByText(/^\$0$/);
        expect(dollarZeroElements.length).toBeGreaterThan(0);
      });
    });

    it('should handle campaigns without budget or spend', async () => {
      const campaignsWithoutBudget: Campaign[] = [
        {
          id: '1',
          name: 'Test Campaign',
          platform: 'google_ads',
          status: 'active',
          client_name: 'Test Client',
          created_at: '2025-01-01T00:00:00Z',
          updated_at: '2025-01-01T00:00:00Z',
          metrics: {},
          spend: 0  // Add required spend property
        }
      ];
      
      render(<DashboardStats campaigns={campaignsWithoutBudget} />);
      
      await waitFor(() => {
        expect(screen.getByText('Total Campaigns')).toBeInTheDocument();
        const totalCampaignsCard = screen.getByText('Total Campaigns').closest('div');
        expect(totalCampaignsCard).toHaveTextContent('1');
        expect(screen.getByText('Total Spend')).toBeInTheDocument();
        // Check for specific spend display
        const dollarZeroElements = screen.getAllByText(/^\$0$/);
        expect(dollarZeroElements.length).toBeGreaterThan(0);
      });
    });

    it('should handle division by zero for budget calculations', async () => {
      const campaignsWithZeroBudget: Campaign[] = [
        {
          ...mockCampaigns[0],
          budget: 0,
          spend: 100
        }
      ];
      
      render(<DashboardStats campaigns={campaignsWithZeroBudget} />);
      
      // Should not crash and should handle the edge case
      await waitFor(() => {
        expect(screen.getByText('Total Campaigns')).toBeInTheDocument();
        const totalCampaignsCard = screen.getByText('Total Campaigns').closest('div');
        expect(totalCampaignsCard).toHaveTextContent('1');
      });
    });
  });

  describe('Spend Percentage Color Coding', () => {
    it('should show green color for low spend percentage', async () => {
      const lowSpendCampaigns: Campaign[] = [
        {
          ...mockCampaigns[0],
          budget: 1000,
          spend: 300 // 30%
        }
      ];
      
      render(<DashboardStats campaigns={lowSpendCampaigns} />);
      
      await waitFor(() => {
        const percentageElement = screen.getByText('30.0% of budget');
        expect(percentageElement.className).toContain('text-green-700');
      });
    });

    it('should show yellow color for medium spend percentage', async () => {
      const mediumSpendCampaigns: Campaign[] = [
        {
          ...mockCampaigns[0],
          budget: 1000,
          spend: 700 // 70%
        }
      ];
      
      render(<DashboardStats campaigns={mediumSpendCampaigns} />);
      
      await waitFor(() => {
        const percentageElement = screen.getByText('70.0% of budget');
        expect(percentageElement.className).toContain('text-yellow-700');
      });
    });

    it('should show red color for high spend percentage', async () => {
      const highSpendCampaigns: Campaign[] = [
        {
          ...mockCampaigns[0],
          budget: 1000,
          spend: 900 // 90%
        }
      ];
      
      render(<DashboardStats campaigns={highSpendCampaigns} />);
      
      await waitFor(() => {
        const percentageElement = screen.getByText('90.0% of budget');
        expect(percentageElement.className).toContain('text-red-700');
      });
    });
  });

  describe('Responsive Design Elements', () => {
    it('should render main stats grid with proper test id', async () => {
      render(<DashboardStats campaigns={mockCampaigns} />);
      
      await waitFor(() => {
        const statsGrid = screen.getByTestId('dashboard-stats');
        expect(statsGrid).toBeInTheDocument();
        expect(statsGrid.className).toContain('grid');
      });
    });

    it('should render all stat cards', async () => {
      render(<DashboardStats campaigns={mockCampaigns} />);
      
      await waitFor(() => {
        expect(screen.getByText('Total Campaigns')).toBeInTheDocument();
        expect(screen.getByText('Total Budget')).toBeInTheDocument();
        expect(screen.getByText('Total Spend')).toBeInTheDocument();
        expect(screen.getByText('Remaining Budget')).toBeInTheDocument();
      });
    });
  });
});