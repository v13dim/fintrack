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
    try {
      const [onboardingCompleted, pinSet] = await Promise.all([getOnboardingCompleted(), hasPin()]);

      setState({
        isReady: true,
        isFirstLaunch: !onboardingCompleted,
        hasPin: pinSet,
      });
    } catch {
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
