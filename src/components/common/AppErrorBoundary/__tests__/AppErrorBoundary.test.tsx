import React from 'react';
import { Text } from 'react-native';
import { act, fireEvent, screen } from '@testing-library/react-native';

import { renderWithTheme } from 'testUtils';

import { AppErrorBoundary } from '../AppErrorBoundary';

describe('AppErrorBoundary', () => {
  it('should render children when there is no error', () => {
    renderWithTheme(
      <AppErrorBoundary>
        <Text>Child content</Text>
      </AppErrorBoundary>,
    );

    expect(screen.getByText('Child content')).toBeTruthy();
  });

  it('should show ErrorFallback when state has error', () => {
    const ref = React.createRef<AppErrorBoundary>();

    renderWithTheme(
      <AppErrorBoundary ref={ref}>
        <Text>Child content</Text>
      </AppErrorBoundary>,
    );

    const error = new Error('test error');
    act(() => {
      ref.current?.setState({ hasError: true, error });
    });

    expect(screen.getByText('Something went wrong')).toBeTruthy();
    expect(screen.getByText('test error')).toBeTruthy();
    expect(screen.getByText('Try again')).toBeTruthy();
  });

  it('should show custom fallback when provided and state has error', () => {
    const ref = React.createRef<AppErrorBoundary>();

    renderWithTheme(
      <AppErrorBoundary ref={ref} fallback={<Text>Custom fallback</Text>}>
        <Text>Child content</Text>
      </AppErrorBoundary>,
    );

    act(() => {
      ref.current?.setState({ hasError: true, error: new Error('test error') });
    });

    expect(screen.getByText('Custom fallback')).toBeTruthy();
    expect(screen.queryByText('Something went wrong')).toBeNull();
  });

  it('getDerivedStateFromError returns error state', () => {
    const error = new Error('x');
    const state = AppErrorBoundary.getDerivedStateFromError(error);

    expect(state).toEqual({ hasError: true, error });
  });

  it('componentDidCatch calls console.error when __DEV__ is true', () => {
    const originalDev = __DEV__;
    (globalThis as { __DEV__?: boolean }).__DEV__ = true;
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    const ref = React.createRef<AppErrorBoundary>();
    renderWithTheme(
      <AppErrorBoundary ref={ref}>
        <Text>Child</Text>
      </AppErrorBoundary>,
    );

    const error = new Error('caught error');
    const errorInfo = { componentStack: 'at Fake' };
    ref.current?.componentDidCatch(error, errorInfo);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'AppErrorBoundary caught an error:',
      error,
      errorInfo,
    );

    consoleErrorSpy.mockRestore();
    (globalThis as { __DEV__?: boolean }).__DEV__ = originalDev;
  });

  it('componentDidCatch does not call console.error when __DEV__ is false', () => {
    const originalDev = __DEV__;
    (globalThis as { __DEV__?: boolean }).__DEV__ = false;
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    const ref = React.createRef<AppErrorBoundary>();
    renderWithTheme(
      <AppErrorBoundary ref={ref}>
        <Text>Child</Text>
      </AppErrorBoundary>,
    );

    const error = new Error('caught error');
    const errorInfo = { componentStack: 'at Fake' };
    ref.current?.componentDidCatch(error, errorInfo);

    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      'AppErrorBoundary caught an error:',
      expect.anything(),
      expect.anything(),
    );

    consoleErrorSpy.mockRestore();
    (globalThis as { __DEV__?: boolean }).__DEV__ = originalDev;
  });

  it('handleRetry resets state and re-renders children', () => {
    const ref = React.createRef<AppErrorBoundary>();

    renderWithTheme(
      <AppErrorBoundary ref={ref}>
        <Text>Child again</Text>
      </AppErrorBoundary>,
    );

    act(() => {
      ref.current?.setState({ hasError: true, error: new Error('err') });
    });

    expect(screen.getByText('Something went wrong')).toBeTruthy();

    fireEvent.press(screen.getByText('Try again'));

    expect(screen.getByText('Child again')).toBeTruthy();
    expect(screen.queryByText('Something went wrong')).toBeNull();
  });
});
