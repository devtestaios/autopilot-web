import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import BreadcrumbNavigation, { PageHeader, CompactBreadcrumb } from '@/components/BreadcrumbNavigation';

// Mock Next.js navigation hooks
const mockUsePathname = jest.fn();

jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Test wrapper with providers
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>
    <AuthProvider>
      {children}
    </AuthProvider>
  </ThemeProvider>
);

describe('BreadcrumbNavigation', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/dashboard/campaigns');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders breadcrumb navigation', () => {
    render(
      <TestWrapper>
        <BreadcrumbNavigation />
      </TestWrapper>
    );
    
    const breadcrumb = screen.getByRole('navigation');
    expect(breadcrumb).toBeInTheDocument();
  });

  it('generates breadcrumb items from current path', () => {
    render(
      <TestWrapper>
        <BreadcrumbNavigation />
      </TestWrapper>
    );
    
    // Use getAllByText since there might be multiple "Dashboard" elements
    const dashboardElements = screen.getAllByText('Dashboard');
    expect(dashboardElements.length).toBeGreaterThan(0);
    expect(screen.getByText('Campaigns')).toBeInTheDocument();
  });
});

describe('PageHeader', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/dashboard/campaigns');
  });

  it('renders page header with title and description', () => {
    render(
      <TestWrapper>
        <PageHeader title="Custom Title" description="Custom Description" />
      </TestWrapper>
    );
    
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
    expect(screen.getByText('Custom Description')).toBeInTheDocument();
  });

  it('renders children in header', () => {
    render(
      <TestWrapper>
        <PageHeader title="Test Title">
          <button>Custom Button</button>
        </PageHeader>
      </TestWrapper>
    );
    
    expect(screen.getByText('Custom Button')).toBeInTheDocument();
  });
});

describe('CompactBreadcrumb', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/dashboard/campaigns/manage');
  });

  it('renders compact breadcrumb', () => {
    const { container } = render(
      <TestWrapper>
        <CompactBreadcrumb />
      </TestWrapper>
    );
    
    expect(container.firstChild).toBeInTheDocument();
  });
});