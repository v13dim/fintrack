import React from 'react';
import { screen } from '@testing-library/react-native';

import { renderWithTheme } from 'testUtils';

import { FullScreenLoader } from '../FullScreenLoader';

describe('FullScreenLoader', () => {
  it('should not render when visible is false', () => {
    const { queryByTestId } = renderWithTheme(
      <FullScreenLoader visible={false} message='Loading' />,
    );
    expect(queryByTestId('fullscreen-loader')).toBeNull();
  });

  it('should render overlay and spinner when visible', () => {
    renderWithTheme(<FullScreenLoader visible testID='loader' />);

    expect(screen.getByTestId('loader')).toBeTruthy();
    expect(screen.getByTestId('loader-overlay')).toBeTruthy();
    expect(screen.getByTestId('loader-spinner')).toBeTruthy();
  });

  it('should render message when provided', () => {
    renderWithTheme(<FullScreenLoader visible message='Processing...' testID='loader' />);
    expect(screen.getByText('Processing...')).toBeTruthy();
    expect(screen.getByTestId('loader-message')).toBeTruthy();
  });

  it('should not render message when message is empty', () => {
    renderWithTheme(<FullScreenLoader visible message='' testID='loader' />);
    expect(screen.queryByTestId('loader-message')).toBeNull();
  });
});
