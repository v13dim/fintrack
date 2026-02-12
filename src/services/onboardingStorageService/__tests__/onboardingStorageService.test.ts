import AsyncStorage from '@react-native-async-storage/async-storage';

import { getOnboardingCompleted, setOnboardingCompleted } from '../onboardingStorageService';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('onboardingStorageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getOnboardingCompleted', () => {
    it('should return true when stored value is "true"', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('true');

      const result = await getOnboardingCompleted();

      expect(result).toBe(true);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@fintrack/onboarding_completed');
    });

    it('should return false when stored value is not "true"', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('false');

      const result = await getOnboardingCompleted();

      expect(result).toBe(false);
    });

    it('should return false when getItem throws', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(new Error('read error'));

      const result = await getOnboardingCompleted();

      expect(result).toBe(false);
    });
  });

  describe('setOnboardingCompleted', () => {
    it('should store "true" when completed is true', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await setOnboardingCompleted(true);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@fintrack/onboarding_completed', 'true');
    });

    it('should store "false" when completed is false', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await setOnboardingCompleted(false);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith('@fintrack/onboarding_completed', 'false');
    });

    it('should not throw when setItem throws', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('write error'));

      await expect(setOnboardingCompleted(true)).resolves.toBeUndefined();
    });
  });
});
