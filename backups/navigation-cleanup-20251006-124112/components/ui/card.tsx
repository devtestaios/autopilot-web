import React from 'react';
import { cn } from '@/lib/theme-utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  'data-testid'?: string;
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
  'data-testid'?: string;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  'data-testid'?: string;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  'data-testid'?: string;
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
  'data-testid'?: string;
}

export function Card({ children, className = '', 'data-testid': testId }: CardProps) {
  return (
    <div className={cn('theme-card rounded-lg border shadow-sm', className)} data-testid={testId}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '', 'data-testid': testId }: CardContentProps) {
  return (
    <div className={cn('p-6', className)} data-testid={testId}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', 'data-testid': testId }: CardHeaderProps) {
  return (
    <div className={cn('p-6 pb-0', className)} data-testid={testId}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', 'data-testid': testId }: CardTitleProps) {
  return (
    <h3 className={cn('text-lg font-semibold text-theme-primary', className)} data-testid={testId}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '', 'data-testid': testId }: CardDescriptionProps) {
  return (
    <p className={cn('text-sm text-theme-secondary mt-1', className)} data-testid={testId}>
      {children}
    </p>
  );
}