import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../card';

describe('Card Components', () => {
  describe('Card', () => {
    it('should render card wrapper', () => {
      render(<Card>Test Card</Card>);
      
      expect(screen.getByText('Test Card')).toBeInTheDocument();
    });

    it('should apply base card styles', () => {
      const { container } = render(<Card>Card content</Card>);
      
      expect(container.firstChild).toHaveClass('bg-white', 'rounded-lg', 'border', 'border-gray-200', 'shadow-sm');
    });

    it('should accept custom className', () => {
      const { container } = render(<Card className="custom-class">Card</Card>);
      
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('CardContent', () => {
    it('should render card content', () => {
      render(<CardContent>Content text</CardContent>);
      
      expect(screen.getByText('Content text')).toBeInTheDocument();
    });

    it('should apply padding styles', () => {
      const { container } = render(<CardContent>Content</CardContent>);
      
      expect(container.firstChild).toHaveClass('p-6');
    });
  });

  describe('CardHeader', () => {
    it('should render card header', () => {
      render(<CardHeader>Header content</CardHeader>);
      
      expect(screen.getByText('Header content')).toBeInTheDocument();
    });

    it('should apply header padding styles', () => {
      const { container } = render(<CardHeader>Header</CardHeader>);
      
      expect(container.firstChild).toHaveClass('p-6', 'pb-0');
    });
  });

  describe('CardTitle', () => {
    it('should render card title', () => {
      render(<CardTitle>Title text</CardTitle>);
      
      expect(screen.getByText('Title text')).toBeInTheDocument();
    });

    it('should render as h3 element', () => {
      render(<CardTitle>Title</CardTitle>);
      
      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass('text-lg', 'font-semibold', 'text-gray-900');
    });
  });

  describe('CardDescription', () => {
    it('should render card description', () => {
      render(<CardDescription>Description content</CardDescription>);
      
      expect(screen.getByText('Description content')).toBeInTheDocument();
    });

    it('should apply description styles', () => {
      const { container } = render(<CardDescription>Description</CardDescription>);
      
      expect(container.firstChild).toHaveClass('text-sm', 'text-gray-600', 'mt-1');
    });
  });

  describe('Complete Card Structure', () => {
    it('should render complete card with all components', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test description</CardDescription>
          </CardHeader>
          <CardContent>
            Test content
          </CardContent>
        </Card>
      );
      
      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
      expect(screen.getByText('Test content')).toBeInTheDocument();
    });
  });
});