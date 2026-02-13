import type { ReactNode } from 'react';

export interface IAppErrorBoundaryProps {
  children: ReactNode;
  /** Optional custom fallback when an error is caught */
  fallback?: ReactNode;
}

export interface IAppErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}
