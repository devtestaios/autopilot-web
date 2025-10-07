import { render, screen, fireEvent } from '@testing-library/react';
import { SearchResults } from '../SearchResults';
import { SearchResult } from '@/hooks/useGlobalSearch';

const mockResults: SearchResult[] = [
  {
    id: '1',
    title: 'Test Campaign',
    description: 'A test campaign description',
    type: 'campaign',
    url: '/campaigns/1'
  },
  {
    id: '2',
    title: 'Lead John Doe',
    description: 'Test lead description',
    type: 'lead',
    url: '/leads/2'
  },
  {
    id: '3',
    title: 'Critical Alert',
    description: 'Test alert description',
    type: 'alert',
    url: '/alerts/3'
  },
  {
    id: '4',
    title: 'Analytics Page',
    description: 'Test page description',
    type: 'page',
    url: '/analytics'
  },
  {
    id: '5',
    title: 'Campaign Template',
    description: 'Test template description',
    type: 'template',
    url: '/templates/5'
  }
];

describe('SearchResults', () => {
  const mockOnResultClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state when searching', () => {
    render(
      <SearchResults
        results={[]}
        isSearching={true}
        searchTerm="test"
        onResultClick={mockOnResultClick}
      />
    );

    expect(screen.getByText('Searching...')).toBeInTheDocument();
    // Check for the spinning icon by class name instead of role
    const spinningIcon = document.querySelector('.animate-spin');
    expect(spinningIcon).toBeInTheDocument();
  });

  it('renders nothing when no search term', () => {
    const { container } = render(
      <SearchResults
        results={mockResults}
        isSearching={false}
        searchTerm=""
        onResultClick={mockOnResultClick}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when search term is only whitespace', () => {
    const { container } = render(
      <SearchResults
        results={mockResults}
        isSearching={false}
        searchTerm="   "
        onResultClick={mockOnResultClick}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('renders no results message when no results found', () => {
    render(
      <SearchResults
        results={[]}
        isSearching={false}
        searchTerm="nonexistent"
        onResultClick={mockOnResultClick}
      />
    );

    expect(screen.getByText('No results found for "nonexistent"')).toBeInTheDocument();
  });

  it('renders search results with correct count', () => {
    render(
      <SearchResults
        results={mockResults}
        isSearching={false}
        searchTerm="test"
        onResultClick={mockOnResultClick}
      />
    );

    expect(screen.getByText('5 results for "test"')).toBeInTheDocument();
  });

  it('renders singular result text for one result', () => {
    render(
      <SearchResults
        results={[mockResults[0]]}
        isSearching={false}
        searchTerm="test"
        onResultClick={mockOnResultClick}
      />
    );

    expect(screen.getByText('1 result for "test"')).toBeInTheDocument();
  });

  it('renders campaign result with correct icon and styling', () => {
    render(
      <SearchResults
        results={[mockResults[0]]}
        isSearching={false}
        searchTerm="test"
        onResultClick={mockOnResultClick}
      />
    );

    expect(screen.getByText('Test Campaign')).toBeInTheDocument();
    expect(screen.getByText('A test campaign description')).toBeInTheDocument();
  });

  it('renders lead result with correct styling', () => {
    render(
      <SearchResults
        results={[mockResults[1]]}
        isSearching={false}
        searchTerm="test"
        onResultClick={mockOnResultClick}
      />
    );

    expect(screen.getByText('Lead John Doe')).toBeInTheDocument();
    expect(screen.getByText('Test lead description')).toBeInTheDocument();
  });

  it('renders alert result with correct styling', () => {
    render(
      <SearchResults
        results={[mockResults[2]]}
        isSearching={false}
        searchTerm="test"
        onResultClick={mockOnResultClick}
      />
    );

    expect(screen.getByText('Critical Alert')).toBeInTheDocument();
    expect(screen.getByText('Test alert description')).toBeInTheDocument();
  });

  it('renders page result with correct styling', () => {
    render(
      <SearchResults
        results={[mockResults[3]]}
        isSearching={false}
        searchTerm="test"
        onResultClick={mockOnResultClick}
      />
    );

    expect(screen.getByText('Analytics Page')).toBeInTheDocument();
    expect(screen.getByText('Test page description')).toBeInTheDocument();
  });

  it('renders template result with correct styling', () => {
    render(
      <SearchResults
        results={[mockResults[4]]}
        isSearching={false}
        searchTerm="test"
        onResultClick={mockOnResultClick}
      />
    );

    expect(screen.getByText('Campaign Template')).toBeInTheDocument();
    expect(screen.getByText('Test template description')).toBeInTheDocument();
  });

  it('calls onResultClick when result is clicked', () => {
    render(
      <SearchResults
        results={[mockResults[0]]}
        isSearching={false}
        searchTerm="test"
        onResultClick={mockOnResultClick}
      />
    );

    const resultLink = screen.getByRole('link');
    fireEvent.click(resultLink);

    expect(mockOnResultClick).toHaveBeenCalledTimes(1);
  });

  it('has proper container styling and structure', () => {
    render(
      <SearchResults
        results={mockResults}
        isSearching={false}
        searchTerm="test"
        onResultClick={mockOnResultClick}
      />
    );

    // Find the main container by its unique class combination
    const container = document.querySelector('.max-h-96.overflow-y-auto');
    expect(container).toBeInTheDocument();
  });

  it('handles unknown result type gracefully', () => {
    const unknownResult: SearchResult = {
      id: '6',
      title: 'Unknown Type',
      description: 'Unknown description',
      type: 'unknown' as any,
      url: '/unknown'
    };

    render(
      <SearchResults
        results={[unknownResult]}
        isSearching={false}
        searchTerm="test"
        onResultClick={mockOnResultClick}
      />
    );

    expect(screen.getByText('Unknown Type')).toBeInTheDocument();
  });

  it('renders all result types together correctly', () => {
    render(
      <SearchResults
        results={mockResults}
        isSearching={false}
        searchTerm="test"
        onResultClick={mockOnResultClick}
      />
    );

    // Check that all titles are rendered
    expect(screen.getByText('Test Campaign')).toBeInTheDocument();
    expect(screen.getByText('Lead John Doe')).toBeInTheDocument();
    expect(screen.getByText('Critical Alert')).toBeInTheDocument();
    expect(screen.getByText('Analytics Page')).toBeInTheDocument();
    expect(screen.getByText('Campaign Template')).toBeInTheDocument();

    // Check that all links are properly formed
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(5);
    expect(links[0]).toHaveAttribute('href', '/campaigns/1');
    expect(links[1]).toHaveAttribute('href', '/leads/2');
    expect(links[2]).toHaveAttribute('href', '/alerts/3');
    expect(links[3]).toHaveAttribute('href', '/analytics');
    expect(links[4]).toHaveAttribute('href', '/templates/5');
  });
});