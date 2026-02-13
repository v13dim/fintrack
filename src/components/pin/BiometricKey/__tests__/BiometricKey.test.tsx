import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';

import { renderWithTheme } from 'testUtils';

import { BiometricKey } from '../BiometricKey';

describe('BiometricKey', () => {
  it('should render placeholder when onPress is not provided', () => {
    renderWithTheme(<BiometricKey testID='biometric-key' />);
    expect(screen.getByTestId('biometric-key')).toBeTruthy();
  });

  it('should render tappable key and call onPress when pressed', () => {
    const onPress = jest.fn();
    renderWithTheme(<BiometricKey onPress={onPress} testID='biometric-key' />);
    fireEvent.press(screen.getByTestId('biometric-key'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled and pressed', () => {
    const onPress = jest.fn();
    renderWithTheme(<BiometricKey onPress={onPress} disabled testID='biometric-key' />);
    fireEvent.press(screen.getByTestId('biometric-key'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('should use custom accessibility label when provided', () => {
    renderWithTheme(
      <BiometricKey onPress={jest.fn()} testID='biometric-key' accessibilityLabel='Use Face ID' />,
    );
    expect(screen.getByLabelText('Use Face ID')).toBeTruthy();
  });
});
