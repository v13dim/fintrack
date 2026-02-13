import { useCallback, useEffect, useState } from 'react';

import { getOnboardingCompleted, hasPin } from 'services';

export interface IAppInitState {
  isReady: boolean;
  isFirstLaunch: boolean;
  hasPin: boolean;
}

/**
 * Runs app initialization once: reads onboarding state and PIN presence.
 * Use this to decide which screen to show after splash.
 */
export function useAppInit(): IAppInitState {
  const [state, setState] = useState<IAppInitState>({
    isReady: false,
    isFirstLaunch: true,
    hasPin: false,
  });

  const init = useCallback(async () => {
    console.warn('[Auth] AppInit start');
    try {
      const [onboardingCompleted, pinSet] = await Promise.all([getOnboardingCompleted(), hasPin()]);
      const isFirstLaunch = !onboardingCompleted;
      console.warn('[Auth] AppInit done', {
        onboardingCompleted,
        hasPin: pinSet,
        isFirstLaunch,
      });
      setState({
        isReady: true,
        isFirstLaunch,
        hasPin: pinSet,
      });
    } catch (e) {
      console.warn('[Auth] AppInit error', e);
      setState({
        isReady: true,
        isFirstLaunch: true,
        hasPin: false,
      });
    }
  }, []);

  useEffect(() => {
    init();
  }, [init]);

  return state;
}
