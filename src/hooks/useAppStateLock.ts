import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { AutoLockStorageService } from 'services';

import { intervalToSeconds } from 'utils';

/**
 * Subscribes to AppState and calls signOut when the app returns to active
 * after being in background longer than the stored auto-lock interval.
 * Only record background time when we're in the app (call this hook only when authenticated).
 */
export function useAppStateLock(signOut: () => void): void {
  const backgroundedAt = useRef<number>(0);

  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'background' || nextState === 'inactive') {
        backgroundedAt.current = Date.now();
        return;
      }
      if (nextState !== 'active') return;

      AutoLockStorageService.getAutoLockInterval().then(interval => {
        const seconds = intervalToSeconds(interval);
        if (seconds == null) return;
        const elapsed = (Date.now() - backgroundedAt.current) / 1000;
        if (elapsed >= seconds) {
          signOut();
        }
      });
    };

    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => sub.remove();
  }, [signOut]);
}
