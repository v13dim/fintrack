import { AuthStackScreens } from 'navigation/AuthNavigator/AuthNavigator.types';

/**
 * Returns the initial auth stack screen based on app init state.
 * Used by AuthNavigator to set initialRouteName.
 */
export function getAuthInitialRoute(isFirstLaunch: boolean, hasPin: boolean): AuthStackScreens {
  if (isFirstLaunch) {
    console.warn('[Auth] getAuthInitialRoute Onboarding', { isFirstLaunch, hasPin });
    return AuthStackScreens.Onboarding;
  }
  if (hasPin) {
    console.warn('[Auth] getAuthInitialRoute PinLogin', { isFirstLaunch, hasPin });
    return AuthStackScreens.PinLogin;
  }
  console.warn('[Auth] getAuthInitialRoute PinCreate', { isFirstLaunch, hasPin });
  return AuthStackScreens.PinCreate;
}
