import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_COMPLETED_KEY = '@fintrack/onboarding_completed';

/**
 * Persists whether the user has completed onboarding.
 * Used to show onboarding only on first launch.
 * Can be migrated to secure storage if needed.
 */
export class OnboardingStorageService {
  static async getOnboardingCompleted(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
      return value === 'true';
    } catch {
      return false;
    }
  }

  static async setOnboardingCompleted(completed: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, completed ? 'true' : 'false');
    } catch {
      // Fail silently; app can still function
    }
  }
}

// Backward-compatible function exports
export const getOnboardingCompleted =
  OnboardingStorageService.getOnboardingCompleted.bind(OnboardingStorageService);
export const setOnboardingCompleted =
  OnboardingStorageService.setOnboardingCompleted.bind(OnboardingStorageService);
