import React, { Component } from 'react';

import type { IAppErrorBoundaryProps, IAppErrorBoundaryState } from './AppErrorBoundary.types';
import { ErrorFallback } from './components';

export class AppErrorBoundary extends Component<IAppErrorBoundaryProps, IAppErrorBoundaryState> {
  state: IAppErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): IAppErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    if (__DEV__) {
      console.error('AppErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <ErrorFallback error={this.state.error} onRetry={this.handleRetry} />;
    }
    return this.props.children;
  }
}
