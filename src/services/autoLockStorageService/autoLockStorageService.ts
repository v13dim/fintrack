import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTO_LOCK_INTERVAL_KEY = '@fintrack/auto_lock_interval';

export type AutoLockInterval = '30' | '60' | '300' | 'never';

const VALID_VALUES: AutoLockInterval[] = ['30', '60', '300', 'never'];
const DEFAULT_INTERVAL: AutoLockInterval = '60';

/**
 * Persists the auto-lock interval (seconds or "never").
 * Used when returning from background to decide whether to show PinLogin.
 */
export class AutoLockStorageService {
  static async getAutoLockInterval(): Promise<AutoLockInterval> {
    try {
      const value = await AsyncStorage.getItem(AUTO_LOCK_INTERVAL_KEY);
      if (value != null && VALID_VALUES.includes(value as AutoLockInterval)) {
        return value as AutoLockInterval;
      }
      return DEFAULT_INTERVAL;
    } catch {
      return DEFAULT_INTERVAL;
    }
  }

  static async setAutoLockInterval(interval: AutoLockInterval): Promise<void> {
    try {
      await AsyncStorage.setItem(AUTO_LOCK_INTERVAL_KEY, interval);
    } catch {
      // Fail silently
    }
  }
}

export const getAutoLockInterval =
  AutoLockStorageService.getAutoLockInterval.bind(AutoLockStorageService);
export const setAutoLockInterval =
  AutoLockStorageService.setAutoLockInterval.bind(AutoLockStorageService);
