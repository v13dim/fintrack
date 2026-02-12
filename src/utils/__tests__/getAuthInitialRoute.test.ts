import { AuthStackScreens } from 'navigation/AuthNavigator/AuthNavigator.types';

import { getAuthInitialRoute } from '../getAuthInitialRoute';

describe('getAuthInitialRoute', () => {
  it('returns Onboarding when isFirstLaunch is true', () => {
    expect(getAuthInitialRoute(true, false)).toBe(AuthStackScreens.Onboarding);
    expect(getAuthInitialRoute(true, true)).toBe(AuthStackScreens.Onboarding);
  });

  it('returns PinLogin when not first launch and hasPin is true', () => {
    expect(getAuthInitialRoute(false, true)).toBe(AuthStackScreens.PinLogin);
  });

  it('returns PinCreate when not first launch and hasPin is false', () => {
    expect(getAuthInitialRoute(false, false)).toBe(AuthStackScreens.PinCreate);
  });
});
