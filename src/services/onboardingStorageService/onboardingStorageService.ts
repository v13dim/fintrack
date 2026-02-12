import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_COMPLETED_KEY = '@fintrack/onboarding_completed';
const AUTH_SESSION_KEY = '@fintrack/auth_session';

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

  /** Auth session: restored on app load so isAuthenticated survives remounts. */
  static async getAuthSession(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(AUTH_SESSION_KEY);
      return value === 'true';
    } catch {
      return false;
    }
  }

  static async setAuthSession(authenticated: boolean): Promise<void> {
    try {
      if (authenticated) {
        await AsyncStorage.setItem(AUTH_SESSION_KEY, 'true');
      } else {
        await AsyncStorage.removeItem(AUTH_SESSION_KEY);
      }
    } catch {
      // Fail silently
    }
  }
}

// Backward-compatible function exports
export const getOnboardingCompleted =
  OnboardingStorageService.getOnboardingCompleted.bind(OnboardingStorageService);
export const setOnboardingCompleted =
  OnboardingStorageService.setOnboardingCompleted.bind(OnboardingStorageService);
export const getAuthSession =
  OnboardingStorageService.getAuthSession.bind(OnboardingStorageService);
export const setAuthSession =
  OnboardingStorageService.setAuthSession.bind(OnboardingStorageService);
