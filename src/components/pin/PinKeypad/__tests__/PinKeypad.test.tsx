import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';

import { renderWithTheme } from 'testUtils';

import { PinKeypad } from '../PinKeypad';

describe('PinKeypad', () => {
  it('should render digits 1-9, 0, and backspace', () => {
    renderWithTheme(<PinKeypad onDigit={jest.fn()} onBackspace={jest.fn()} testID='keypad' />);

    expect(screen.getByTestId('keypad-key-1')).toBeTruthy();
    expect(screen.getByTestId('keypad-key-9')).toBeTruthy();
    expect(screen.getByTestId('keypad-key-0')).toBeTruthy();
    expect(screen.getByTestId('keypad-key-backspace')).toBeTruthy();
  });

  it('should call onDigit when a digit key is pressed', () => {
    const onDigit = jest.fn();
    renderWithTheme(<PinKeypad onDigit={onDigit} onBackspace={jest.fn()} />);

    fireEvent.press(screen.getByTestId('pin-keypad-key-5'));
    expect(onDigit).toHaveBeenCalledWith('5');
  });

  it('should call onBackspace when backspace is pressed', () => {
    const onBackspace = jest.fn();
    renderWithTheme(<PinKeypad onDigit={jest.fn()} onBackspace={onBackspace} />);

    fireEvent.press(screen.getByTestId('pin-keypad-key-backspace'));
    expect(onBackspace).toHaveBeenCalledTimes(1);
  });

  it('should show biometric placeholder when showBiometricPlaceholder is true', () => {
    renderWithTheme(
      <PinKeypad onDigit={jest.fn()} onBackspace={jest.fn()} showBiometricPlaceholder />,
    );
    expect(screen.getByTestId('pin-keypad-key-biometric')).toBeTruthy();
  });

  it('should call onBiometricPress when biometric key is pressed and onBiometricPress is provided', () => {
    const onBiometricPress = jest.fn();
    renderWithTheme(
      <PinKeypad
        onDigit={jest.fn()}
        onBackspace={jest.fn()}
        showBiometricPlaceholder
        onBiometricPress={onBiometricPress}
        testID='keypad'
      />,
    );
    fireEvent.press(screen.getByTestId('keypad-key-biometric'));
    expect(onBiometricPress).toHaveBeenCalledTimes(1);
  });

  it('should not invoke onBiometricPress when disabled and biometric key is pressed', () => {
    const onBiometricPress = jest.fn();
    renderWithTheme(
      <PinKeypad
        onDigit={jest.fn()}
        onBackspace={jest.fn()}
        showBiometricPlaceholder
        onBiometricPress={onBiometricPress}
        disabled
        testID='keypad'
      />,
    );
    fireEvent.press(screen.getByTestId('keypad-key-biometric'));
    expect(onBiometricPress).not.toHaveBeenCalled();
  });
});
