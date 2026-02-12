import { AuthStackScreens } from 'navigation/AuthNavigator/AuthNavigator.types';

/**
 * Returns the initial auth stack screen based on app init state.
 * Used by AuthNavigator to set initialRouteName.
 */
export function getAuthInitialRoute(isFirstLaunch: boolean, hasPin: boolean): AuthStackScreens {
  if (isFirstLaunch) return AuthStackScreens.Onboarding;
  if (hasPin) return AuthStackScreens.PinLogin;
  return AuthStackScreens.PinCreate;
}
