import React from 'react';
import { fireEvent, screen, waitFor } from '@testing-library/react-native';

import { AutoLockStorageService } from 'services';

import { renderWithTheme } from 'testUtils';

import { SettingsScreen } from '../SettingsScreen';

jest.mock('services', () => ({
  AutoLockStorageService: {
    getAutoLockInterval: jest.fn(() => Promise.resolve('60')),
    setAutoLockInterval: jest.fn(() => Promise.resolve()),
  },
}));

describe('SettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(AutoLockStorageService.getAutoLockInterval).mockResolvedValue('60');
  });

  const waitForAutoLockLoad = () =>
    waitFor(() => {
      expect(screen.getByText('✓')).toBeTruthy();
    });

  it('should render settings title and security section', async () => {
    renderWithTheme(<SettingsScreen />);
    await waitForAutoLockLoad();

    expect(screen.getByText('settings.title')).toBeTruthy();
    expect(screen.getByText('settings.security')).toBeTruthy();
  });

  it('should call setAutoLockInterval when option is pressed', async () => {
    renderWithTheme(<SettingsScreen />);
    await waitForAutoLockLoad();

    fireEvent.press(screen.getByTestId('settings-auto-lock-30'));

    expect(AutoLockStorageService.setAutoLockInterval).toHaveBeenCalledWith('30');
  });

  it('should call setAutoLockInterval with never when Never is pressed', async () => {
    renderWithTheme(<SettingsScreen />);
    await waitForAutoLockLoad();

    fireEvent.press(screen.getByTestId('settings-auto-lock-never'));

    expect(AutoLockStorageService.setAutoLockInterval).toHaveBeenCalledWith('never');
  });
});
