import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import type { Campaign } from '@/types';
import CampaignCard from '../CampaignCard';

const mockCampaign: Campaign = {
  id: '1',
  name: 'Test Campaign',
  client_name: 'Test Client',
  platform: 'google',
  budget: 1000,
  spend: 250,
  status: 'active' as const,
  metrics: {},
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

describe('CampaignCard', () => {
  test('renders campaign information correctly', () => {
    render(<CampaignCard campaign={mockCampaign} />)
    
    expect(screen.getByText('Test Campaign')).toBeDefined()
    expect(screen.getByText('Test Client')).toBeDefined()
    expect(screen.getByText('google')).toBeDefined()
  })

  test('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn()
    render(<CampaignCard campaign={mockCampaign} onEdit={mockOnEdit} />)
    
    const editButton = screen.getByText('Edit')
    fireEvent.click(editButton)
    
    expect(mockOnEdit).toHaveBeenCalledWith(mockCampaign)
  })

  test('calls onDelete when delete button is clicked', () => {
    const mockOnDelete = jest.fn()
    render(<CampaignCard campaign={mockCampaign} onDelete={mockOnDelete} />)
    
    // Find delete button by its red styling (the only red button should be delete)
    const buttons = screen.getAllByRole('button')
    const deleteButton = buttons.find(btn => 
      btn.className.includes('red-500') || 
      btn.className.includes('from-red-500')
    )
    
    expect(deleteButton).toBeTruthy()
    fireEvent.click(deleteButton!)
    
    expect(mockOnDelete).toHaveBeenCalledWith('1')
  })

  test('handles different platforms correctly', () => {
    const facebookCampaign = { ...mockCampaign, platform: 'facebook' }
    render(<CampaignCard campaign={facebookCampaign} />)
    
    expect(screen.getByText('facebook')).toBeDefined()
  })
})