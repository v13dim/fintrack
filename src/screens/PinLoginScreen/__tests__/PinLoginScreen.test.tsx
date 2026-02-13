import { mockSignIn } from '../__mocks__/PinLoginScreen.module-mocks';

import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { BiometricAuthService, PinAuthService } from 'services';

import { renderWithTheme } from 'testUtils';

import { PinLoginScreen } from '../PinLoginScreen';

describe('PinLoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(PinAuthService.getRemainingLockoutSeconds).mockResolvedValue(0);
    jest.mocked(BiometricAuthService.isBiometricEnabled).mockResolvedValue(false);
    jest.mocked(BiometricAuthService.isBiometricAvailable).mockResolvedValue(false);
  });

  it('should render login title and PIN input', async () => {
    renderWithTheme(<PinLoginScreen />);

    await waitFor(() => {
      expect(screen.getByText('pin.login.title')).toBeTruthy();
    });
    expect(screen.getByTestId('pin-login-input')).toBeTruthy();
  });

  it('should show incorrect message and not navigate when PIN is wrong', async () => {
    jest.mocked(PinAuthService.verifyPin).mockResolvedValue({
      success: false,
      locked: false,
      attemptsLeft: 2,
    });

    renderWithTheme(<PinLoginScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('pin-login-input')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('pin-login-input-key-0'));
    fireEvent.press(screen.getByTestId('pin-login-input-key-0'));
    fireEvent.press(screen.getByTestId('pin-login-input-key-0'));
    fireEvent.press(screen.getByTestId('pin-login-input-key-0'));

    expect(PinAuthService.verifyPin).toHaveBeenCalledWith('0000');
    await waitFor(() => {
      expect(screen.getByText('pin.login.incorrect')).toBeTruthy();
    });
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('should navigate to Home when PIN is correct', async () => {
    jest.mocked(PinAuthService.verifyPin).mockResolvedValue({ success: true });

    renderWithTheme(<PinLoginScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('pin-login-input')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('pin-login-input-key-1'));
    fireEvent.press(screen.getByTestId('pin-login-input-key-2'));
    fireEvent.press(screen.getByTestId('pin-login-input-key-3'));
    fireEvent.press(screen.getByTestId('pin-login-input-key-4'));

    expect(PinAuthService.verifyPin).toHaveBeenCalledWith('1234');
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledTimes(1);
    });
  });

  it('should show locked message and disable input when locked', async () => {
    jest.mocked(PinAuthService.getRemainingLockoutSeconds).mockResolvedValue(15);

    renderWithTheme(<PinLoginScreen />);

    await waitFor(() => {
      expect(screen.getByText(/Try again in 15 seconds/)).toBeTruthy();
    });

    expect(screen.getByTestId('pin-login-input')).toBeTruthy();
    fireEvent.press(screen.getByTestId('pin-login-input-key-1'));
    expect(PinAuthService.verifyPin).not.toHaveBeenCalled();
  });

  it('should navigate to Home when biometric enabled and authentication succeeds', async () => {
    jest.mocked(BiometricAuthService.isBiometricEnabled).mockResolvedValue(true);
    jest.mocked(BiometricAuthService.isBiometricAvailable).mockResolvedValue(true);
    jest.mocked(BiometricAuthService.authenticateWithBiometric).mockResolvedValue(true);

    renderWithTheme(<PinLoginScreen />);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledTimes(1);
    });
    expect(PinAuthService.verifyPin).not.toHaveBeenCalled();
  });

  it('should show PIN form when biometric enabled but authentication fails', async () => {
    jest.mocked(BiometricAuthService.isBiometricEnabled).mockResolvedValue(true);
    jest.mocked(BiometricAuthService.isBiometricAvailable).mockResolvedValue(true);
    jest.mocked(BiometricAuthService.authenticateWithBiometric).mockResolvedValue(false);

    renderWithTheme(<PinLoginScreen />);

    await waitFor(() => {
      expect(screen.getByText('pin.login.title')).toBeTruthy();
    });
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it('should make biometric key non-tappable after user denies permission', async () => {
    jest.mocked(BiometricAuthService.isBiometricEnabled).mockResolvedValue(true);
    jest.mocked(BiometricAuthService.requestBiometricPermission).mockResolvedValue(false);

    renderWithTheme(<PinLoginScreen />);

    await waitFor(() => {
      expect(screen.getByTestId('pin-login-input-key-biometric')).toBeTruthy();
    });

    fireEvent.press(screen.getByTestId('pin-login-input-key-biometric'));

    await waitFor(() => {
      expect(BiometricAuthService.requestBiometricPermission).toHaveBeenCalled();
    });
    expect(BiometricAuthService.authenticateWithBiometric).not.toHaveBeenCalled();
    expect(mockSignIn).not.toHaveBeenCalled();
  });
});
