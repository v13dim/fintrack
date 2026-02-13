import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { AutoLockStorageService } from 'services';

import { renderWithTheme } from 'testUtils';

import { SettingsScreen } from '../SettingsScreen';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

jest.mock('services', () => ({
  AutoLockStorageService: {
    getAutoLockInterval: jest.fn(() => Promise.resolve('60')),
    setAutoLockInterval: jest.fn(() => Promise.resolve()),
  },
  BiometricAuthService: {
    isBiometricAvailable: jest.fn(() => Promise.resolve(true)),
    isBiometricEnabled: jest.fn(() => Promise.resolve(false)),
    requestBiometricPermission: jest.fn(() => Promise.resolve(true)),
    enableBiometric: jest.fn(() => Promise.resolve()),
    disableBiometric: jest.fn(() => Promise.resolve()),
  },
}));

describe('SettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(AutoLockStorageService.getAutoLockInterval).mockResolvedValue('60');
  });

  it('should render settings title and security section', async () => {
    renderWithTheme(<SettingsScreen />);
    await waitFor(() => {
      expect(screen.getByText('settings.title')).toBeTruthy();
    });
    expect(screen.getByText('settings.security')).toBeTruthy();
  });

  it('should render Security card with biometric, change PIN and auto-lock rows', async () => {
    renderWithTheme(<SettingsScreen />);
    await waitFor(() => {
      expect(screen.getByTestId('settings-row-biometric')).toBeTruthy();
    });
    expect(screen.getByTestId('settings-row-change-pin')).toBeTruthy();
    expect(screen.getByTestId('settings-row-auto-lock')).toBeTruthy();
  });

  it('should open bottom sheet on auto-lock row press and call setAutoLockInterval when option selected', async () => {
    renderWithTheme(<SettingsScreen />);
    await waitFor(() => {
      expect(screen.getByTestId('settings-row-auto-lock')).toBeTruthy();
    });
    fireEvent.press(screen.getByTestId('settings-row-auto-lock'));
    await waitFor(() => {
      expect(screen.getByTestId('auto-lock-option-30')).toBeTruthy();
    });
    fireEvent.press(screen.getByTestId('auto-lock-option-30'));
    await waitFor(() => {
      expect(AutoLockStorageService.setAutoLockInterval).toHaveBeenCalledWith('30');
    });
  });
});
