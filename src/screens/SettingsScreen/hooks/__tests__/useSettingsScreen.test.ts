import { Alert } from 'react-native';
import { act, renderHook, waitFor } from '@testing-library/react-native';

import { SettingsStackScreens } from 'navigation/SettingsStackNavigator/SettingsStackNavigator.types';

import { AutoLockStorageService, BiometricAuthService } from 'services';

import { AUTO_LOCK_OPTIONS, getAutoLockLabelKey, useSettingsScreen } from '../useSettingsScreen';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
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

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {},
  }),
}));

describe('getAutoLockLabelKey', () => {
  it('returns label key for known auto-lock value', () => {
    expect(getAutoLockLabelKey('30')).toBe('autoLock.options.30sec');
    expect(getAutoLockLabelKey('60')).toBe('autoLock.options.1min');
    expect(getAutoLockLabelKey('300')).toBe('autoLock.options.5min');
    expect(getAutoLockLabelKey('never')).toBe('autoLock.options.never');
  });

  it('returns default label key for unknown value', () => {
    expect(getAutoLockLabelKey('unknown' as '60')).toBe('autoLock.options.1min');
  });
});

describe('AUTO_LOCK_OPTIONS', () => {
  it('has expected options', () => {
    expect(AUTO_LOCK_OPTIONS).toHaveLength(4);
    expect(AUTO_LOCK_OPTIONS.map(o => o.value)).toEqual(['30', '60', '300', 'never']);
  });
});

describe('useSettingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(AutoLockStorageService.getAutoLockInterval).mockResolvedValue('60');
    jest.mocked(BiometricAuthService.isBiometricAvailable).mockResolvedValue(true);
    jest.mocked(BiometricAuthService.isBiometricEnabled).mockResolvedValue(false);
  });

  it('returns ref, securityActions and handlers', async () => {
    const { result } = renderHook(() => useSettingsScreen());

    expect(result.current.autoLockSheetRef).toBeDefined();
    expect(result.current.securityActions).toHaveLength(3);
    expect(typeof result.current.handleAutoLockSelect).toBe('function');
    expect(typeof result.current.handleBiometricChange).toBe('function');
    expect(result.current.securityActions[1].onPress).toBeDefined();
    expect(result.current.securityActions[2].onPress).toBeDefined();

    await waitFor(() => {
      expect(result.current.autoLockInterval).toBe('60');
      expect(result.current.securityActions[2].subtitle).toBeDefined();
    });
  });

  it('loads auto-lock and biometric state on mount', async () => {
    jest.mocked(AutoLockStorageService.getAutoLockInterval).mockResolvedValue('300');
    jest.mocked(BiometricAuthService.isBiometricAvailable).mockResolvedValue(true);
    jest.mocked(BiometricAuthService.isBiometricEnabled).mockResolvedValue(true);

    const { result } = renderHook(() => useSettingsScreen());

    await waitFor(() => {
      expect(result.current.autoLockInterval).toBe('300');
    });
    await waitFor(() => {
      expect(result.current.securityActions[2].subtitle).toBeTruthy();
    });
  });

  it('autoLock action onPress does not throw', async () => {
    const { result } = renderHook(() => useSettingsScreen());
    await waitFor(() => {
      expect(result.current.securityActions[2].subtitle).toBeDefined();
    });
    expect(() => result.current.securityActions[2].onPress?.()).not.toThrow();
  });

  it('handleAutoLockSelect updates interval and calls service', async () => {
    const { result } = renderHook(() => useSettingsScreen());
    await waitFor(() => {
      expect(result.current.securityActions[2].subtitle).toBeDefined();
    });

    await act(async () => {
      await result.current.handleAutoLockSelect('30');
    });

    expect(AutoLockStorageService.setAutoLockInterval).toHaveBeenCalledWith('30');
    expect(result.current.autoLockInterval).toBe('30');
  });

  it('changePin action onPress navigates to PinChange', async () => {
    const { result } = renderHook(() => useSettingsScreen());
    await waitFor(() => {
      expect(result.current.securityActions[2].subtitle).toBeDefined();
    });
    result.current.securityActions[1].onPress?.();
    expect(mockNavigate).toHaveBeenCalledWith(SettingsStackScreens.PinChange);
  });

  it('handleBiometricChange(true) when permitted enables biometric', async () => {
    jest.mocked(BiometricAuthService.requestBiometricPermission).mockResolvedValue(true);
    jest.mocked(BiometricAuthService.enableBiometric).mockResolvedValue(undefined);

    const { result } = renderHook(() => useSettingsScreen());
    await waitFor(() => {
      expect(result.current.securityActions[0].title).toBeDefined();
    });

    await act(async () => {
      await result.current.handleBiometricChange(true);
    });

    expect(BiometricAuthService.requestBiometricPermission).toHaveBeenCalled();
    expect(BiometricAuthService.enableBiometric).toHaveBeenCalled();
  });

  it('handleBiometricChange(true) when not permitted shows alert and does not enable', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    jest.mocked(BiometricAuthService.requestBiometricPermission).mockResolvedValue(false);

    const { result } = renderHook(() => useSettingsScreen());
    await waitFor(() => {
      expect(result.current.securityActions[0].title).toBeDefined();
    });

    await act(async () => {
      await result.current.handleBiometricChange(true);
    });

    expect(Alert.alert).toHaveBeenCalledWith('common.error', 'biometric.unavailable');
    expect(BiometricAuthService.enableBiometric).not.toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  it('handleBiometricChange(false) disables biometric', async () => {
    jest.mocked(BiometricAuthService.isBiometricEnabled).mockResolvedValue(true);

    const { result } = renderHook(() => useSettingsScreen());
    await waitFor(() => {
      expect(result.current.securityActions[0].title).toBeDefined();
    });

    await act(async () => {
      await result.current.handleBiometricChange(false);
    });

    expect(BiometricAuthService.disableBiometric).toHaveBeenCalled();
  });

  it('handleBiometricChange(true) on enable error shows alert', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    jest.mocked(BiometricAuthService.requestBiometricPermission).mockResolvedValue(true);
    jest.mocked(BiometricAuthService.enableBiometric).mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => useSettingsScreen());
    await waitFor(() => {
      expect(result.current.securityActions[0].title).toBeDefined();
    });

    await act(async () => {
      await result.current.handleBiometricChange(true);
    });

    expect(Alert.alert).toHaveBeenCalledWith('common.error', 'biometric.failed');
    alertSpy.mockRestore();
  });
});
