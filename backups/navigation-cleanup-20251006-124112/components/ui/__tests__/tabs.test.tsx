import { render, screen, fireEvent } from '@testing-library/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../tabs';

describe('Tabs Components', () => {
  const TabsExample = ({ defaultValue = 'tab1' }) => (
    <Tabs defaultValue={defaultValue}>
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content for Tab 1</TabsContent>
      <TabsContent value="tab2">Content for Tab 2</TabsContent>
      <TabsContent value="tab3">Content for Tab 3</TabsContent>
    </Tabs>
  );

  describe('Tabs', () => {
    it('should render tabs container', () => {
      render(<TabsExample />);
      
      expect(screen.getByText('Tab 1')).toBeInTheDocument();
      expect(screen.getByText('Tab 2')).toBeInTheDocument();
      expect(screen.getByText('Tab 3')).toBeInTheDocument();
    });

    it('should show default tab content', () => {
      render(<TabsExample />);
      
      expect(screen.getByText('Content for Tab 1')).toBeInTheDocument();
      expect(screen.queryByText('Content for Tab 2')).not.toBeInTheDocument();
      expect(screen.queryByText('Content for Tab 3')).not.toBeInTheDocument();
    });

    it('should accept custom className', () => {
      const { container } = render(
        <Tabs defaultValue="tab1" className="custom-tabs">
          <div>Content</div>
        </Tabs>
      );
      
      expect(container.firstChild).toHaveClass('custom-tabs');
    });
  });

  describe('TabsList', () => {
    it('should render tabs list container', () => {
      const { container } = render(
        <TabsList>
          <div>Tab content</div>
        </TabsList>
      );
      
      expect(container.firstChild).toHaveClass('flex', 'space-x-1', 'bg-gray-100', 'p-1', 'rounded-lg');
    });

    it('should accept custom className', () => {
      const { container } = render(
        <TabsList className="custom-list">
          <div>Tab content</div>
        </TabsList>
      );
      
      expect(container.firstChild).toHaveClass('custom-list');
    });
  });

  describe('TabsTrigger', () => {
    it('should render active trigger correctly', () => {
      render(<TabsExample defaultValue="tab1" />);
      
      const tab1Button = screen.getByText('Tab 1');
      expect(tab1Button).toHaveClass('bg-white', 'text-gray-900', 'shadow-sm');
    });

    it('should render inactive trigger correctly', () => {
      render(<TabsExample defaultValue="tab1" />);
      
      const tab2Button = screen.getByText('Tab 2');
      expect(tab2Button).toHaveClass('text-gray-600');
      expect(tab2Button).not.toHaveClass('bg-white');
    });

    it('should switch tabs when clicked', () => {
      render(<TabsExample />);
      
      const tab2Button = screen.getByText('Tab 2');
      fireEvent.click(tab2Button);
      
      expect(screen.getByText('Content for Tab 2')).toBeInTheDocument();
      expect(screen.queryByText('Content for Tab 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Content for Tab 3')).not.toBeInTheDocument();
    });

    it('should update active state when clicked', () => {
      render(<TabsExample />);
      
      const tab2Button = screen.getByText('Tab 2');
      fireEvent.click(tab2Button);
      
      expect(tab2Button).toHaveClass('bg-white', 'text-gray-900', 'shadow-sm');
      expect(screen.getByText('Tab 1')).not.toHaveClass('bg-white');
    });

    it('should accept custom className', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1" className="custom-trigger">Custom Tab</TabsTrigger>
          </TabsList>
        </Tabs>
      );
      
      const trigger = screen.getByText('Custom Tab');
      expect(trigger).toHaveClass('custom-trigger');
    });

    it('should have transition classes', () => {
      render(<TabsExample />);
      
      const tab1Button = screen.getByText('Tab 1');
      expect(tab1Button).toHaveClass('transition-colors');
    });
  });

  describe('TabsContent', () => {
    it('should show content only for active tab', () => {
      render(<TabsExample defaultValue="tab2" />);
      
      expect(screen.getByText('Content for Tab 2')).toBeInTheDocument();
      expect(screen.queryByText('Content for Tab 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Content for Tab 3')).not.toBeInTheDocument();
    });

    it('should hide content for inactive tabs', () => {
      render(<TabsExample defaultValue="tab1" />);
      
      expect(screen.getByText('Content for Tab 1')).toBeInTheDocument();
      expect(screen.queryByText('Content for Tab 2')).not.toBeInTheDocument();
    });

    it('should accept custom className', () => {
      const { container } = render(
        <Tabs defaultValue="tab1">
          <TabsContent value="tab1" className="custom-content">Custom Content</TabsContent>
        </Tabs>
      );
      
      const contentDiv = container.querySelector('.custom-content');
      expect(contentDiv).toBeInTheDocument();
      expect(contentDiv).toHaveTextContent('Custom Content');
    });

    it('should have margin top class', () => {
      const { container } = render(<TabsExample />);
      
      const contentDiv = container.querySelector('.mt-4');
      expect(contentDiv).toBeInTheDocument();
      expect(contentDiv).toHaveTextContent('Content for Tab 1');
    });
  });

  describe('Complete Tabs Interaction', () => {
    it('should handle multiple tab switches', () => {
      render(<TabsExample />);
      
      // Initially tab 1 is active
      expect(screen.getByText('Content for Tab 1')).toBeInTheDocument();
      
      // Switch to tab 3
      fireEvent.click(screen.getByText('Tab 3'));
      expect(screen.getByText('Content for Tab 3')).toBeInTheDocument();
      expect(screen.queryByText('Content for Tab 1')).not.toBeInTheDocument();
      
      // Switch to tab 2
      fireEvent.click(screen.getByText('Tab 2'));
      expect(screen.getByText('Content for Tab 2')).toBeInTheDocument();
      expect(screen.queryByText('Content for Tab 3')).not.toBeInTheDocument();
      
      // Switch back to tab 1
      fireEvent.click(screen.getByText('Tab 1'));
      expect(screen.getByText('Content for Tab 1')).toBeInTheDocument();
      expect(screen.queryByText('Content for Tab 2')).not.toBeInTheDocument();
    });

    it('should maintain active state correctly during switches', () => {
      render(<TabsExample />);
      
      const tab1 = screen.getByText('Tab 1');
      const tab2 = screen.getByText('Tab 2');
      const tab3 = screen.getByText('Tab 3');
      
      // Initially tab 1 is active
      expect(tab1).toHaveClass('bg-white');
      expect(tab2).not.toHaveClass('bg-white');
      expect(tab3).not.toHaveClass('bg-white');
      
      // Click tab 2
      fireEvent.click(tab2);
      expect(tab1).not.toHaveClass('bg-white');
      expect(tab2).toHaveClass('bg-white');
      expect(tab3).not.toHaveClass('bg-white');
      
      // Click tab 3
      fireEvent.click(tab3);
      expect(tab1).not.toHaveClass('bg-white');
      expect(tab2).not.toHaveClass('bg-white');
      expect(tab3).toHaveClass('bg-white');
    });
  });
});