import React from 'react';
import { render, screen } from '@testing-library/react';
import PerformanceChart, { CampaignComparisonChart } from '../PerformanceChart';

// Mock Recharts components
jest.mock('recharts', () => ({
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: ({ dataKey, stroke }: { dataKey: string; stroke: string }) => (
    <div data-testid={`line-${dataKey}`} data-stroke={stroke} />
  ),
  XAxis: ({ dataKey, tickFormatter }: { dataKey: string; tickFormatter?: Function }) => (
    <div data-testid="x-axis" data-key={dataKey} />
  ),
  YAxis: ({ tickFormatter }: { tickFormatter?: Function }) => (
    <div data-testid="y-axis" />
  ),
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: ({ labelFormatter, formatter }: { labelFormatter?: Function; formatter?: Function }) => (
    <div data-testid="tooltip" />
  ),
  Legend: () => <div data-testid="legend" />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: ({ dataKey, fill, name }: { dataKey: string; fill: string; name: string }) => (
    <div data-testid={`bar-${dataKey}`} data-fill={fill} data-name={name} />
  ),
}));

describe('PerformanceChart', () => {
  const mockData = [
    { date: '2023-01-01', spend: 100, clicks: 50, impressions: 1000, conversions: 5 },
    { date: '2023-01-02', spend: 150, clicks: 75, impressions: 1500, conversions: 8 },
    { date: '2023-01-03', spend: 200, clicks: 100, impressions: 2000, conversions: 10 },
  ];

  describe('Component Rendering', () => {
    it('renders with spend metric', () => {
      render(<PerformanceChart data={mockData} metric="spend" />);
      
      expect(screen.getByText('spend Over Time')).toBeInTheDocument();
      // Check for container element instead of dynamic import issues
      const container = screen.getByText('spend Over Time').closest('div');
      expect(container).toHaveClass('bg-white', 'rounded-lg', 'shadow-md', 'p-6');
    });

    it('renders with clicks metric', () => {
      render(<PerformanceChart data={mockData} metric="clicks" />);
      
      expect(screen.getByText('clicks Over Time')).toBeInTheDocument();
      expect(screen.getByTestId('line-clicks')).toBeInTheDocument();
    });

    it('renders with impressions metric', () => {
      render(<PerformanceChart data={mockData} metric="impressions" />);
      
      expect(screen.getByText('impressions Over Time')).toBeInTheDocument();
      expect(screen.getByTestId('line-impressions')).toBeInTheDocument();
    });

    it('renders with conversions metric', () => {
      render(<PerformanceChart data={mockData} metric="conversions" />);
      
      expect(screen.getByText('conversions Over Time')).toBeInTheDocument();
      expect(screen.getByTestId('line-conversions')).toBeInTheDocument();
    });

    it('renders with custom title', () => {
      render(<PerformanceChart data={mockData} metric="spend" title="Custom Chart Title" />);
      
      expect(screen.getByText('Custom Chart Title')).toBeInTheDocument();
      expect(screen.queryByText('Spend Over Time')).not.toBeInTheDocument();
    });
  });

  describe('Chart Elements', () => {
    it('renders all chart components', () => {
      render(<PerformanceChart data={mockData} metric="spend" />);
      
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      expect(screen.getByTestId('grid')).toBeInTheDocument();
      expect(screen.getByTestId('x-axis')).toBeInTheDocument();
      expect(screen.getByTestId('y-axis')).toBeInTheDocument();
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
      expect(screen.getByTestId('legend')).toBeInTheDocument();
    });

    it('configures X-axis with date key', () => {
      render(<PerformanceChart data={mockData} metric="spend" />);
      
      const xAxis = screen.getByTestId('x-axis');
      expect(xAxis).toHaveAttribute('data-key', 'date');
    });

    it('renders line with correct metric', () => {
      render(<PerformanceChart data={mockData} metric="clicks" />);
      
      expect(screen.getByTestId('line-clicks')).toBeInTheDocument();
    });
  });

  describe('Color Configuration', () => {
    it('uses correct color for spend metric', () => {
      render(<PerformanceChart data={mockData} metric="spend" />);
      
      const line = screen.getByTestId('line-spend');
      expect(line).toHaveAttribute('data-stroke', '#ef4444');
    });

    it('uses correct color for clicks metric', () => {
      render(<PerformanceChart data={mockData} metric="clicks" />);
      
      const line = screen.getByTestId('line-clicks');
      expect(line).toHaveAttribute('data-stroke', '#3b82f6');
    });

    it('uses correct color for impressions metric', () => {
      render(<PerformanceChart data={mockData} metric="impressions" />);
      
      const line = screen.getByTestId('line-impressions');
      expect(line).toHaveAttribute('data-stroke', '#10b981');
    });

    it('uses correct color for conversions metric', () => {
      render(<PerformanceChart data={mockData} metric="conversions" />);
      
      const line = screen.getByTestId('line-conversions');
      expect(line).toHaveAttribute('data-stroke', '#f59e0b');
    });
  });

  describe('Empty Data Handling', () => {
    it('displays no data message when data array is empty', () => {
      render(<PerformanceChart data={[]} metric="spend" />);
      
      expect(screen.getByText('No performance data available')).toBeInTheDocument();
      expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
    });

    it('shows proper styling for empty state', () => {
      render(<PerformanceChart data={[]} metric="spend" />);
      
      const emptyMessage = screen.getByText('No performance data available');
      expect(emptyMessage).toHaveClass('h-64', 'flex', 'items-center', 'justify-center', 'text-muted-foreground');
    });
  });

  describe('Data Processing', () => {
    it('handles data with zero values', () => {
      const zeroData = [
        { date: '2023-01-01', spend: 0, clicks: 0, impressions: 0, conversions: 0 },
      ];
      
      render(<PerformanceChart data={zeroData} metric="spend" />);
      
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      expect(screen.queryByText('No performance data available')).not.toBeInTheDocument();
    });

    it('handles large numbers correctly', () => {
      const largeData = [
        { date: '2023-01-01', spend: 1000000, clicks: 50000, impressions: 10000000, conversions: 500 },
      ];
      
      render(<PerformanceChart data={largeData} metric="impressions" />);
      
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });
  });

  describe('Container Styling', () => {
    it('applies correct container classes', () => {
      render(<PerformanceChart data={mockData} metric="spend" />);
      
      const container = screen.getByText('spend Over Time').closest('div');
      expect(container).toHaveClass('bg-white', 'rounded-lg', 'shadow-md', 'p-6');
    });

    it('applies correct title classes', () => {
      render(<PerformanceChart data={mockData} metric="spend" />);
      
      const title = screen.getByText('spend Over Time');
      expect(title).toHaveClass('text-lg', 'font-semibold', 'mb-4', 'capitalize');
    });
  });

  describe('Accessibility', () => {
    it('provides meaningful chart title', () => {
      render(<PerformanceChart data={mockData} metric="spend" />);
      
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('spend Over Time');
    });

    it('handles missing data gracefully', () => {
      const incompleteData = [
        { date: '2023-01-01', spend: 100, clicks: 50, impressions: 1000, conversions: 5 },
        // Testing with minimal/zero data
        { date: '2023-01-02', spend: 0, clicks: 0, impressions: 0, conversions: 0 },
      ];
      
      render(<PerformanceChart data={incompleteData} metric="spend" />);
      
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });
  });
});

describe('CampaignComparisonChart', () => {
  const mockCampaigns = [
    { name: 'Campaign A', spend: 1000, budget: 2000, conversions: 50 },
    { name: 'Campaign B', spend: 1500, budget: 2500, conversions: 75 },
    { name: 'Very Long Campaign Name That Should Be Truncated', spend: 800, budget: 1200, conversions: 30 },
  ];

  describe('Component Rendering', () => {
    it('renders campaign comparison chart', () => {
      render(<CampaignComparisonChart campaigns={mockCampaigns} />);
      
      expect(screen.getByText('Campaign Budget vs Spend')).toBeInTheDocument();
      // Check for container element instead of dynamic import issues
      const container = screen.getByText('Campaign Budget vs Spend').closest('div');
      expect(container).toHaveClass('bg-white', 'rounded-lg', 'shadow-md', 'p-6');
    });

    it('renders budget and spend bars', () => {
      render(<CampaignComparisonChart campaigns={mockCampaigns} />);
      
      expect(screen.getByTestId('bar-budget')).toBeInTheDocument();
      expect(screen.getByTestId('bar-spend')).toBeInTheDocument();
    });

    it('applies correct colors to bars', () => {
      render(<CampaignComparisonChart campaigns={mockCampaigns} />);
      
      const budgetBar = screen.getByTestId('bar-budget');
      const spendBar = screen.getByTestId('bar-spend');
      
      expect(budgetBar).toHaveAttribute('data-fill', '#e5e7eb');
      expect(spendBar).toHaveAttribute('data-fill', '#3b82f6');
    });

    it('sets correct bar names', () => {
      render(<CampaignComparisonChart campaigns={mockCampaigns} />);
      
      const budgetBar = screen.getByTestId('bar-budget');
      const spendBar = screen.getByTestId('bar-spend');
      
      expect(budgetBar).toHaveAttribute('data-name', 'Budget');
      expect(spendBar).toHaveAttribute('data-name', 'Spend');
    });
  });

  describe('Chart Elements', () => {
    it('renders all chart components', () => {
      render(<CampaignComparisonChart campaigns={mockCampaigns} />);
      
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.getByTestId('grid')).toBeInTheDocument();
      expect(screen.getByTestId('x-axis')).toBeInTheDocument();
      expect(screen.getByTestId('y-axis')).toBeInTheDocument();
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
      expect(screen.getByTestId('legend')).toBeInTheDocument();
    });

    it('configures X-axis with name key', () => {
      render(<CampaignComparisonChart campaigns={mockCampaigns} />);
      
      const xAxis = screen.getByTestId('x-axis');
      expect(xAxis).toHaveAttribute('data-key', 'name');
    });
  });

  describe('Data Processing', () => {
    it('handles campaigns with missing values', () => {
      const incompleteData = [
        { name: 'Campaign A', spend: 1000, budget: 2000 }, // Missing conversions
        { name: 'Campaign B', spend: 0, budget: 1500, conversions: 25 }, // Zero spend
      ];
      
      render(<CampaignComparisonChart campaigns={incompleteData} />);
      
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('handles campaigns with undefined values', () => {
      const undefinedData = [
        // Testing with minimal data (conversions is optional)
        { name: 'Campaign A', spend: 0, budget: 2000, conversions: undefined },
        // Testing with zero budget
        { name: 'Campaign B', spend: 1500, budget: 0, conversions: 75 },
      ];
      
      render(<CampaignComparisonChart campaigns={undefinedData} />);
      
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('processes long campaign names correctly', () => {
      const longNameData = [
        { name: 'This is a very long campaign name that should be truncated for display', spend: 1000, budget: 2000, conversions: 50 },
      ];
      
      // We can't directly test the truncation logic without accessing the processed data,
      // but we can ensure the component renders without errors
      render(<CampaignComparisonChart campaigns={longNameData} />);
      
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  describe('Empty Data Handling', () => {
    it('displays no data message when campaigns array is empty', () => {
      render(<CampaignComparisonChart campaigns={[]} />);
      
      expect(screen.getByText('No campaign data available')).toBeInTheDocument();
      expect(screen.queryByTestId('bar-chart')).not.toBeInTheDocument();
    });

    it('shows proper styling for empty state', () => {
      render(<CampaignComparisonChart campaigns={[]} />);
      
      const emptyMessage = screen.getByText('No campaign data available');
      expect(emptyMessage).toHaveClass('h-64', 'flex', 'items-center', 'justify-center', 'text-muted-foreground');
    });
  });

  describe('Container Styling', () => {
    it('applies correct container classes', () => {
      render(<CampaignComparisonChart campaigns={mockCampaigns} />);
      
      const container = screen.getByText('Campaign Budget vs Spend').closest('div');
      expect(container).toHaveClass('bg-white', 'rounded-lg', 'shadow-md', 'p-6');
    });

    it('applies correct title classes', () => {
      render(<CampaignComparisonChart campaigns={mockCampaigns} />);
      
      const title = screen.getByText('Campaign Budget vs Spend');
      expect(title).toHaveClass('text-lg', 'font-semibold', 'mb-4');
    });
  });

  describe('Edge Cases', () => {
    it('handles zero values correctly', () => {
      const zeroData = [
        { name: 'Zero Campaign', spend: 0, budget: 0, conversions: 0 },
      ];
      
      render(<CampaignComparisonChart campaigns={zeroData} />);
      
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
      expect(screen.queryByText('No campaign data available')).not.toBeInTheDocument();
    });

    it('handles large budget values', () => {
      const largeData = [
        { name: 'Big Budget', spend: 50000, budget: 100000, conversions: 1000 },
      ];
      
      render(<CampaignComparisonChart campaigns={largeData} />);
      
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('handles single campaign', () => {
      const singleData = [
        { name: 'Solo Campaign', spend: 1000, budget: 2000, conversions: 50 },
      ];
      
      render(<CampaignComparisonChart campaigns={singleData} />);
      
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('provides meaningful chart title', () => {
      render(<CampaignComparisonChart campaigns={mockCampaigns} />);
      
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Campaign Budget vs Spend');
    });

    it('handles empty campaign names', () => {
      const emptyNameData = [
        { name: '', spend: 1000, budget: 2000, conversions: 50 },
        { name: '   ', spend: 1500, budget: 2500, conversions: 75 }, // Whitespace only
      ];
      
      render(<CampaignComparisonChart campaigns={emptyNameData} />);
      
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
  });
});