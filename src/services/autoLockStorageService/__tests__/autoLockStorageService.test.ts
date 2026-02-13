import AsyncStorage from '@react-native-async-storage/async-storage';

import { getAutoLockInterval, setAutoLockInterval } from '../autoLockStorageService';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('autoLockStorageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAutoLockInterval', () => {
    it('should return stored value when valid', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('30');
      expect(await getAutoLockInterval()).toBe('30');
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('300');
      expect(await getAutoLockInterval()).toBe('300');
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('never');
      expect(await getAutoLockInterval()).toBe('never');
    });

    it('should return default 60 when stored value is invalid', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid');
      expect(await getAutoLockInterval()).toBe('60');
    });

    it('should return default 60 when getItem throws', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('read error'));
      expect(await getAutoLockInterval()).toBe('60');
    });

    it('should return default 60 when key is missing', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      expect(await getAutoLockInterval()).toBe('60');
    });
  });

  describe('setAutoLockInterval', () => {
    it('should store value', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      await setAutoLockInterval('30');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@fintrack/auto_lock_interval', '30');
    });

    it('should not throw when setItem throws', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('write error'));
      await expect(setAutoLockInterval('60')).resolves.toBeUndefined();
    });
  });
});
