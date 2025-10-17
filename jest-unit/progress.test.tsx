import { render, screen } from '@testing-library/react';
import { Progress } from '../progress';

describe('Progress', () => {
  it('should render progress component', () => {
    const { container } = render(<Progress value={50} />);
    
    const progressWrapper = container.firstChild as HTMLElement;
    expect(progressWrapper).toHaveClass('w-full', 'bg-gray-200', 'rounded-full');
    
    const progressBar = progressWrapper.firstChild as HTMLElement;
    expect(progressBar).toHaveClass('bg-blue-600', 'h-full', 'rounded-full', 'transition-all', 'duration-300', 'ease-in-out');
    expect(progressBar).toHaveStyle('width: 50%');
  });

  it('should show correct value', () => {
    const { container } = render(<Progress value={75} />);
    
    const progressBar = container.querySelector('.bg-blue-600') as HTMLElement;
    expect(progressBar).toHaveStyle('width: 75%');
  });

  it('should handle 0 value', () => {
    const { container } = render(<Progress value={0} />);
    
    const progressBar = container.querySelector('.bg-blue-600') as HTMLElement;
    expect(progressBar).toHaveStyle('width: 0%');
  });

  it('should handle 100 value', () => {
    const { container } = render(<Progress value={100} />);
    
    const progressBar = container.querySelector('.bg-blue-600') as HTMLElement;
    expect(progressBar).toHaveStyle('width: 100%');
  });

  it('should accept custom className', () => {
    const { container } = render(<Progress value={50} className="custom-class" />);
    
    const progressWrapper = container.firstChild as HTMLElement;
    expect(progressWrapper).toHaveClass('custom-class');
  });

  it('should handle custom max value', () => {
    const { container } = render(<Progress value={50} max={200} />);
    
    const progressBar = container.querySelector('.bg-blue-600') as HTMLElement;
    expect(progressBar).toHaveStyle('width: 25%'); // 50/200 = 25%
  });

  it('should clamp values above max', () => {
    const { container } = render(<Progress value={150} />);
    
    const progressBar = container.querySelector('.bg-blue-600') as HTMLElement;
    expect(progressBar).toHaveStyle('width: 100%');
  });

  it('should clamp values below 0', () => {
    const { container } = render(<Progress value={-10} />);
    
    const progressBar = container.querySelector('.bg-blue-600') as HTMLElement;
    expect(progressBar).toHaveStyle('width: 0%');
  });

  it('should handle edge case with max of 0', () => {
    const { container } = render(<Progress value={50} max={0} />);
    
    const progressBar = container.querySelector('.bg-blue-600') as HTMLElement;
    expect(progressBar).toHaveStyle('width: 100%'); // Division by 0 should result in clamped value
  });
});