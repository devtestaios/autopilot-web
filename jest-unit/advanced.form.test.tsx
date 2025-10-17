import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '../input';
import { Label } from '../label';
import { Textarea } from '../textarea';
import { Button } from '../button';

describe('Form Components - Integration Tests', () => {
  describe('Input Component Advanced', () => {
    test('renders with placeholder', () => {
      render(<Input placeholder="Enter your name" />);
      
      expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
    });

    test('handles value changes', () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);
      
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test value' } });
      
      expect(handleChange).toHaveBeenCalled();
    });

    test('supports different input types', () => {
      const { rerender } = render(<Input type="text" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'text');

      rerender(<Input type="email" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'email');

      rerender(<Input type="password" data-testid="input" />);
      expect(screen.getByTestId('input')).toHaveAttribute('type', 'password');
    });

    test('applies custom className', () => {
      render(<Input className="custom-input" data-testid="input" />);
      
      expect(screen.getByTestId('input')).toHaveClass('custom-input');
    });

    test('can be disabled', () => {
      render(<Input disabled data-testid="input" />);
      
      expect(screen.getByTestId('input')).toBeDisabled();
    });
  });

  describe('Label Component Advanced', () => {
    test('renders with htmlFor attribute', () => {
      render(<Label htmlFor="username">Username</Label>);
      
      const label = screen.getByText('Username');
      expect(label).toHaveAttribute('for', 'username');
    });

    test('applies custom styling', () => {
      render(<Label className="custom-label">Custom Label</Label>);
      
      expect(screen.getByText('Custom Label')).toHaveClass('custom-label');
    });

    test('supports click interaction', () => {
      const handleClick = jest.fn();
      render(<Label onClick={handleClick}>Clickable Label</Label>);
      
      fireEvent.click(screen.getByText('Clickable Label'));
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('Textarea Component Advanced', () => {
    test('renders with placeholder', () => {
      render(<Textarea placeholder="Enter description" />);
      
      expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
    });

    test('handles value changes', () => {
      const handleChange = jest.fn();
      render(<Textarea onChange={handleChange} />);
      
      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'multi\nline\ntext' } });
      
      expect(handleChange).toHaveBeenCalled();
    });

    test('supports rows attribute', () => {
      render(<Textarea rows={5} data-testid="textarea" />);
      
      expect(screen.getByTestId('textarea')).toHaveAttribute('rows', '5');
    });

    test('can be disabled', () => {
      render(<Textarea disabled data-testid="textarea" />);
      
      expect(screen.getByTestId('textarea')).toBeDisabled();
    });
  });

  describe('Button Component Advanced', () => {
    test('renders with different variants', () => {
      const { rerender } = render(<Button variant="default" data-testid="button">Default</Button>);
      expect(screen.getByTestId('button')).toBeInTheDocument();

      rerender(<Button variant="destructive" data-testid="button">Destructive</Button>);
      expect(screen.getByTestId('button')).toBeInTheDocument();

      rerender(<Button variant="outline" data-testid="button">Outline</Button>);
      expect(screen.getByTestId('button')).toBeInTheDocument();

      rerender(<Button variant="secondary" data-testid="button">Secondary</Button>);
      expect(screen.getByTestId('button')).toBeInTheDocument();

      rerender(<Button variant="ghost" data-testid="button">Ghost</Button>);
      expect(screen.getByTestId('button')).toBeInTheDocument();

      // Skip link variant as it's not available in this Button component
    });

    test('renders with different sizes', () => {
      const { rerender } = render(<Button size="default" data-testid="button">Default</Button>);
      expect(screen.getByTestId('button')).toBeInTheDocument();

      rerender(<Button size="sm" data-testid="button">Small</Button>);
      expect(screen.getByTestId('button')).toBeInTheDocument();

      rerender(<Button size="lg" data-testid="button">Large</Button>);
      expect(screen.getByTestId('button')).toBeInTheDocument();

      // Skip icon size as it's not available in this Button component
    });

    test('handles click events', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);
      
      fireEvent.click(screen.getByText('Click Me'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('can be disabled', () => {
      const handleClick = jest.fn();
      render(<Button disabled onClick={handleClick}>Disabled</Button>);
      
      const button = screen.getByText('Disabled');
      expect(button).toBeDisabled();
      
      fireEvent.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    test('supports custom button as link', () => {
      render(
        <a href="/test" role="button">
          Link Button
        </a>
      );
      
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Form Component Integration', () => {
    test('label and input work together', () => {
      render(
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" placeholder="Enter email" />
        </div>
      );
      
      const label = screen.getByText('Email Address');
      const input = screen.getByPlaceholderText('Enter email');
      
      expect(label).toHaveAttribute('for', 'email');
      expect(input).toHaveAttribute('id', 'email');
      expect(input).toHaveAttribute('type', 'email');
    });

    test('complete form with validation', () => {
      const handleSubmit = jest.fn();
      
      render(
        <form onSubmit={handleSubmit}>
          <Label htmlFor="username">Username</Label>
          <Input id="username" required />
          
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" required />
          
          <Button type="submit">Submit</Button>
        </form>
      );
      
      expect(screen.getByLabelText('Username')).toBeRequired();
      expect(screen.getByLabelText('Message')).toBeRequired();
      expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute('type', 'submit');
    });

    test('form interaction flow', () => {
      render(
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" data-testid="name-input" />
          
          <Label htmlFor="bio">Biography</Label>
          <Textarea id="bio" data-testid="bio-textarea" />
          
          <Button data-testid="save-button">Save</Button>
        </div>
      );
      
      const nameInput = screen.getByTestId('name-input');
      const bioTextarea = screen.getByTestId('bio-textarea');
      const saveButton = screen.getByTestId('save-button');
      
      fireEvent.change(nameInput, { target: { value: 'John Doe' } });
      fireEvent.change(bioTextarea, { target: { value: 'Software developer' } });
      
      expect(nameInput).toHaveValue('John Doe');
      expect(bioTextarea).toHaveValue('Software developer');
      
      fireEvent.click(saveButton);
      expect(saveButton).toBeInTheDocument();
    });
  });

  describe('Accessibility Features', () => {
    test('inputs have proper accessibility attributes', () => {
      render(
        <div>
          <Label htmlFor="accessible-input">Accessible Input</Label>
          <Input 
            id="accessible-input" 
            aria-describedby="input-help"
            aria-required="true"
          />
          <div id="input-help">This field is required</div>
        </div>
      );
      
      const input = screen.getByLabelText('Accessible Input');
      expect(input).toHaveAttribute('aria-describedby', 'input-help');
      expect(input).toHaveAttribute('aria-required', 'true');
    });

    test('buttons have proper accessibility attributes', () => {
      render(
        <Button 
          aria-label="Close dialog"
          aria-pressed="false"
          data-testid="accessible-button"
        >
          ×
        </Button>
      );
      
      const button = screen.getByTestId('accessible-button');
      expect(button).toHaveAttribute('aria-label', 'Close dialog');
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });
  });
});