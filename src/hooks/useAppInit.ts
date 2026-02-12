import { useCallback, useEffect, useState } from 'react';

import { getAuthSession, getOnboardingCompleted, hasPin } from 'services';

export interface IAppInitState {
  isReady: boolean;
  isFirstLaunch: boolean;
  hasPin: boolean;
  hasSession: boolean;
}

/**
 * Runs app initialization once: reads onboarding state, PIN presence, and auth session.
 * Use this to decide which screen to show after splash.
 * hasSession restores isAuthenticated so it survives remounts.
 */
export function useAppInit(): IAppInitState {
  const [state, setState] = useState<IAppInitState>({
    isReady: false,
    isFirstLaunch: true,
    hasPin: false,
    hasSession: false,
  });

  const init = useCallback(async () => {
    try {
      const [onboardingCompleted, pinSet, session] = await Promise.all([
        getOnboardingCompleted(),
        hasPin(),
        getAuthSession(),
      ]);

      setState({
        isReady: true,
        isFirstLaunch: !onboardingCompleted,
        hasPin: pinSet,
        hasSession: session,
      });
    } catch {
      setState({
        isReady: true,
        isFirstLaunch: true,
        hasPin: false,
        hasSession: false,
      });
    }
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  return state;
}
