import React from 'react';
import { View as MockView } from 'react-native';
import { screen } from '@testing-library/react-native';

import { renderWithTheme } from 'testUtils';

import { FullScreenLoader } from '../FullScreenLoader';

jest.mock('react-native-reanimated', () => ({
  __esModule: true,
  default: { View: MockView },
  useSharedValue: (initial: number) => ({ value: initial }),
  useAnimatedStyle: (fn: () => object) => (typeof fn === 'function' ? fn() : {}),
  withTiming: (toValue: number) => toValue,
}));

describe('FullScreenLoader', () => {
  it('should render overlay and spinner', () => {
    renderWithTheme(<FullScreenLoader testID='loader' />);

    expect(screen.getByTestId('loader')).toBeTruthy();
    expect(screen.getByTestId('loader-overlay')).toBeTruthy();
    expect(screen.getByTestId('loader-spinner')).toBeTruthy();
  });

  it('should render message when provided', () => {
    renderWithTheme(<FullScreenLoader message='Processing...' testID='loader' />);
    expect(screen.getByText('Processing...')).toBeTruthy();
    expect(screen.getByTestId('loader-message')).toBeTruthy();
  });

  it('should not render message when message is empty', () => {
    renderWithTheme(<FullScreenLoader message='' testID='loader' />);
    expect(screen.queryByTestId('loader-message')).toBeNull();
  });
});
