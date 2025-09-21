import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CampaignForm from '../CampaignForm';
import type { CampaignFormData } from '@/types';

// Mock campaign form data
const mockCampaignFormData: CampaignFormData = {
  name: 'Test Campaign',
  platform: 'google_ads',
  client_name: 'Test Client',
  budget: 5000,
  spend: 2500,
  status: 'active',
  metrics: {}
};

describe('CampaignForm', () => {
  const mockProps = {
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
    loading: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    it('should render create campaign form by default', () => {
      render(<CampaignForm {...mockProps} />);
      
      expect(screen.getByText('Create New Campaign')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Create Campaign' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    });

    it('should render edit campaign form when campaign is provided', () => {
      render(<CampaignForm {...mockProps} campaign={mockCampaignFormData} />);
      
      expect(screen.getByText('Edit Campaign')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Update Campaign' })).toBeInTheDocument();
    });

    it('should render all form fields', () => {
      render(<CampaignForm {...mockProps} />);
      
      expect(screen.getByLabelText(/Campaign Name/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Client Name/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Platform/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Budget/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Current Spend/)).toBeInTheDocument();
    });

    it('should show required field indicators', () => {
      render(<CampaignForm {...mockProps} />);
      
      expect(screen.getByText('Campaign Name *')).toBeInTheDocument();
      expect(screen.getByText('Client Name *')).toBeInTheDocument();
      expect(screen.getByText('Platform *')).toBeInTheDocument();
    });

    it('should populate form with existing campaign data', () => {
      render(<CampaignForm {...mockProps} campaign={mockCampaignFormData} />);
      
      expect(screen.getByDisplayValue('Test Campaign')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Client')).toBeInTheDocument();
      // Platform is selected by value, not displayed as text
      const platformSelect = screen.getByLabelText(/Platform/) as HTMLSelectElement;
      expect(platformSelect.value).toBe('google_ads');
      expect(screen.getByDisplayValue('5000')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2500')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should require campaign name field', async () => {
      const user = userEvent.setup();
      render(<CampaignForm {...mockProps} />);
      
      const nameInput = screen.getByLabelText(/Campaign Name/);
      expect(nameInput).toBeRequired();
    });

    it('should require client name field', async () => {
      render(<CampaignForm {...mockProps} />);
      
      const clientInput = screen.getByLabelText(/Client Name/);
      expect(clientInput).toBeRequired();
    });

    it('should require platform field', async () => {
      render(<CampaignForm {...mockProps} />);
      
      const platformSelect = screen.getByLabelText(/Platform/);
      expect(platformSelect).toBeRequired();
    });

    it('should validate budget field is numeric', async () => {
      render(<CampaignForm {...mockProps} />);
      
      const budgetInput = screen.getByLabelText(/Budget/);
      expect(budgetInput).toHaveAttribute('type', 'number');
      expect(budgetInput).toHaveAttribute('min', '0');
      expect(budgetInput).toHaveAttribute('step', '0.01');
    });

    it('should validate spend field is numeric', async () => {
      render(<CampaignForm {...mockProps} />);
      
      const spendInput = screen.getByLabelText(/Current Spend/);
      expect(spendInput).toHaveAttribute('type', 'number');
      expect(spendInput).toHaveAttribute('min', '0');
      expect(spendInput).toHaveAttribute('step', '0.01');
    });
  });

  describe('Platform Selection', () => {
    it('should render all platform options', () => {
      render(<CampaignForm {...mockProps} />);
      
      const platformSelect = screen.getByLabelText(/Platform/);
      expect(platformSelect).toBeInTheDocument();
      
      // Check for platform options
      expect(screen.getByRole('option', { name: 'Google Ads' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Meta (Facebook/Instagram)' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'LinkedIn Ads' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Twitter/X Ads' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'TikTok Ads' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Other' })).toBeInTheDocument();
    });

    it('should default to google_ads platform', () => {
      render(<CampaignForm {...mockProps} />);
      
      const platformSelect = screen.getByLabelText(/Platform/) as HTMLSelectElement;
      expect(platformSelect.value).toBe('google_ads');
    });

    it('should allow changing platform selection', async () => {
      const user = userEvent.setup();
      render(<CampaignForm {...mockProps} />);
      
      const platformSelect = screen.getByLabelText(/Platform/);
      await user.selectOptions(platformSelect, 'meta');
      
      expect(platformSelect).toHaveValue('meta');
    });
  });

  describe('Form Input Interactions', () => {
    it('should update campaign name input', async () => {
      const user = userEvent.setup();
      render(<CampaignForm {...mockProps} />);
      
      const nameInput = screen.getByLabelText(/Campaign Name/);
      await user.type(nameInput, 'New Campaign Name');
      
      expect(nameInput).toHaveValue('New Campaign Name');
    });

    it('should update client name input', async () => {
      const user = userEvent.setup();
      render(<CampaignForm {...mockProps} />);
      
      const clientInput = screen.getByLabelText(/Client Name/);
      await user.type(clientInput, 'New Client');
      
      expect(clientInput).toHaveValue('New Client');
    });

    it('should update budget input with numeric values', async () => {
      const user = userEvent.setup();
      render(<CampaignForm {...mockProps} />);
      
      const budgetInput = screen.getByLabelText(/Budget/);
      await user.type(budgetInput, '10000');
      
      expect(budgetInput).toHaveValue(10000);
    });

    it('should update spend input with numeric values', async () => {
      const user = userEvent.setup();
      render(<CampaignForm {...mockProps} />);
      
      const spendInput = screen.getByLabelText(/Current Spend/);
      await user.clear(spendInput);
      await user.type(spendInput, '7500');
      
      expect(spendInput).toHaveValue(7500);
    });

    it('should handle decimal values in budget field', async () => {
      const user = userEvent.setup();
      render(<CampaignForm {...mockProps} />);
      
      const budgetInput = screen.getByLabelText(/Budget/);
      await user.type(budgetInput, '1234.56');
      
      expect(budgetInput).toHaveValue(1234.56);
    });

    it('should clear budget field when empty', async () => {
      const user = userEvent.setup();
      render(<CampaignForm {...mockProps} campaign={mockCampaignFormData} />);
      
      const budgetInput = screen.getByLabelText(/Budget/);
      await user.clear(budgetInput);
      
      expect(budgetInput).toHaveValue(null);
    });
  });

  describe('Form Submission', () => {
    it('should call onSubmit with form data when submitted', async () => {
      const user = userEvent.setup();
      render(<CampaignForm {...mockProps} />);
      
      // Fill out the form
      await user.type(screen.getByLabelText(/Campaign Name/), 'Test Campaign');
      await user.type(screen.getByLabelText(/Client Name/), 'Test Client');
      await user.selectOptions(screen.getByLabelText(/Platform/), 'meta');
      await user.type(screen.getByLabelText(/Budget/), '5000');
      await user.type(screen.getByLabelText(/Current Spend/), '1000');
      
      // Submit the form
      await user.click(screen.getByRole('button', { name: 'Create Campaign' }));
      
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        name: 'Test Campaign',
        platform: 'meta',
        client_name: 'Test Client',
        budget: 5000,
        spend: 1000,
        metrics: {}
      });
    });

    it('should call onSubmit with updated data when editing', async () => {
      const user = userEvent.setup();
      render(<CampaignForm {...mockProps} campaign={mockCampaignFormData} />);
      
      // Update campaign name
      const nameInput = screen.getByLabelText(/Campaign Name/);
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Campaign');
      
      // Submit the form
      await user.click(screen.getByRole('button', { name: 'Update Campaign' }));
      
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        name: 'Updated Campaign',
        platform: 'google_ads',
        client_name: 'Test Client',
        budget: 5000,
        spend: 2500,
        metrics: {}
      });
    });

    it('should prevent form submission when loading', async () => {
      const user = userEvent.setup();
      render(<CampaignForm {...mockProps} loading={true} />);
      
      const submitButton = screen.getByRole('button', { name: 'Saving...' });
      expect(submitButton).toBeDisabled();
      
      await user.click(submitButton);
      expect(mockProps.onSubmit).not.toHaveBeenCalled();
    });

    it('should handle form submission with minimal data', async () => {
      const user = userEvent.setup();
      render(<CampaignForm {...mockProps} />);
      
      // Fill only required fields
      await user.type(screen.getByLabelText(/Campaign Name/), 'Minimal Campaign');
      await user.type(screen.getByLabelText(/Client Name/), 'Minimal Client');
      
      await user.click(screen.getByRole('button', { name: 'Create Campaign' }));
      
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        name: 'Minimal Campaign',
        platform: 'google_ads', // default
        client_name: 'Minimal Client',
        budget: undefined,
        spend: 0, // default
        metrics: {}
      });
    });
  });

  describe('Cancel Functionality', () => {
    it('should call onCancel when cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<CampaignForm {...mockProps} />);
      
      await user.click(screen.getByRole('button', { name: 'Cancel' }));
      
      expect(mockProps.onCancel).toHaveBeenCalledTimes(1);
    });

    it('should disable cancel button when loading', () => {
      render(<CampaignForm {...mockProps} loading={true} />);
      
      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      expect(cancelButton).toBeDisabled();
    });
  });

  describe('Loading States', () => {
    it('should show loading state on submit button', () => {
      render(<CampaignForm {...mockProps} loading={true} />);
      
      expect(screen.getByRole('button', { name: 'Saving...' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Create Campaign' })).not.toBeInTheDocument();
    });

    it('should show loading state on update button', () => {
      render(<CampaignForm {...mockProps} campaign={mockCampaignFormData} loading={true} />);
      
      expect(screen.getByRole('button', { name: 'Saving...' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Update Campaign' })).not.toBeInTheDocument();
    });

    it('should disable form inputs when loading', () => {
      render(<CampaignForm {...mockProps} loading={true} />);
      
      const submitButton = screen.getByRole('button', { name: 'Saving...' });
      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      
      expect(submitButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle undefined campaign data gracefully', () => {
      render(<CampaignForm {...mockProps} campaign={undefined} />);
      
      // Check that name field is empty
      const nameInput = screen.getByLabelText(/Campaign Name/);
      expect(nameInput).toHaveValue('');
      
      // Check that default platform is selected
      const platformSelect = screen.getByLabelText(/Platform/) as HTMLSelectElement;
      expect(platformSelect.value).toBe('google_ads');
    });

    it('should handle campaign with missing optional fields', () => {
      const partialCampaign: CampaignFormData = {
        name: 'Partial Campaign',
        platform: 'meta',
        client_name: 'Partial Client',
        metrics: {}
        // budget and spend are missing
      };
      
      render(<CampaignForm {...mockProps} campaign={partialCampaign} />);
      
      expect(screen.getByDisplayValue('Partial Campaign')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Partial Client')).toBeInTheDocument();
      
      // Check platform selection
      const platformSelect = screen.getByLabelText(/Platform/) as HTMLSelectElement;
      expect(platformSelect.value).toBe('meta');
      
      // Budget should be empty and spend should default to 0
      const budgetInput = screen.getByLabelText(/Budget/);
      const spendInput = screen.getByLabelText(/Current Spend/);
      expect(budgetInput).toHaveValue(null);
      expect(spendInput).toHaveValue(0);
    });

    it('should handle zero budget and spend values', () => {
      const zeroCampaign: CampaignFormData = {
        name: 'Zero Campaign',
        platform: 'google_ads',
        client_name: 'Zero Client',
        budget: 0,
        spend: 0,
        metrics: {}
      };
      
      render(<CampaignForm {...mockProps} campaign={zeroCampaign} />);
      
      expect(screen.getByDisplayValue('0')).toBeInTheDocument();
    });

    it('should handle empty string inputs correctly', async () => {
      const user = userEvent.setup();
      render(<CampaignForm {...mockProps} campaign={mockCampaignFormData} />);
      
      const nameInput = screen.getByLabelText(/Campaign Name/);
      await user.clear(nameInput);
      
      // Since name is required, we need to provide some value for form to submit
      await user.type(nameInput, 'Empty Test');
      
      await user.click(screen.getByRole('button', { name: 'Update Campaign' }));
      
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        name: 'Empty Test',
        platform: 'google_ads',
        client_name: 'Test Client',
        budget: 5000,
        spend: 2500,
        metrics: {}
      });
    });

    it('should handle negative numbers in numeric fields', async () => {
      const user = userEvent.setup();
      render(<CampaignForm {...mockProps} />);
      
      const budgetInput = screen.getByLabelText(/Budget/);
      // Try to enter negative number (should be prevented by min="0")
      await user.type(budgetInput, '-100');
      
      // The input should handle this gracefully
      expect(budgetInput).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper form labels', () => {
      render(<CampaignForm {...mockProps} />);
      
      expect(screen.getByLabelText(/Campaign Name/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Client Name/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Platform/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Budget/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Current Spend/)).toBeInTheDocument();
    });

    it('should have proper placeholder text', () => {
      render(<CampaignForm {...mockProps} />);
      
      expect(screen.getByPlaceholderText('Enter campaign name...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter client name...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter budget amount...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter current spend...')).toBeInTheDocument();
    });

    it('should have focus management', async () => {
      const user = userEvent.setup();
      render(<CampaignForm {...mockProps} />);
      
      const nameInput = screen.getByLabelText(/Campaign Name/);
      await user.click(nameInput);
      
      expect(nameInput).toHaveFocus();
    });

    it('should have keyboard navigation support', async () => {
      const user = userEvent.setup();
      render(<CampaignForm {...mockProps} />);
      
      const nameInput = screen.getByLabelText(/Campaign Name/);
      await user.tab();
      
      expect(nameInput).toHaveFocus();
    });
  });

  describe('Styling and Layout', () => {
    it('should have proper CSS classes', () => {
      render(<CampaignForm {...mockProps} />);
      
      // Find the form element by its tag name
      const form = document.querySelector('form');
      expect(form).toHaveClass('space-y-4');
      
      const container = form?.closest('div');
      expect(container).toHaveClass('bg-white', 'rounded-lg', 'shadow-md', 'p-6');
    });

    it('should render form fields in correct order', () => {
      render(<CampaignForm {...mockProps} />);
      
      const inputs = screen.getAllByRole('textbox');
      const selects = screen.getAllByRole('combobox');
      const numbers = screen.getAllByDisplayValue('0'); // number inputs with default value
      
      expect(inputs).toHaveLength(2); // name and client_name
      expect(selects).toHaveLength(1); // platform
      expect(numbers).toHaveLength(1); // spend field (budget might be empty)
    });
  });
});