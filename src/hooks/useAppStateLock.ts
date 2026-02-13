import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { AutoLockStorageService } from 'services';

import { intervalToSeconds } from 'utils';

const MIN_BACKGROUND_SECONDS = 1;

/**
 * Subscribes to AppState and calls signOut when the app returns to active
 * after being in background longer than the stored auto-lock interval.
 * Only records time when state is 'background' (not 'inactive'), so system
 * dialogs (e.g. biometric prompt) don't trigger auto-lock.
 * Ignores very short backgrounds (< 1s) to avoid lock from brief transitions.
 * Call this hook only when authenticated.
 */
export function useAppStateLock(signOut: () => void): void {
  const backgroundedAt = useRef<number>(0);
  const cameFromBackground = useRef(false);

  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'background') {
        backgroundedAt.current = Date.now();
        cameFromBackground.current = true;
        return;
      }
      if (nextState !== 'active') return;

      if (!cameFromBackground.current) return;
      cameFromBackground.current = false;

      AutoLockStorageService.getAutoLockInterval().then(interval => {
        const seconds = intervalToSeconds(interval);
        if (seconds == null) return;
        const elapsed = (Date.now() - backgroundedAt.current) / 1000;
        if (elapsed < MIN_BACKGROUND_SECONDS) return;
        if (elapsed >= seconds) {
          signOut();
        }
      });
    };

    const sub = AppState.addEventListener('change', handleAppStateChange);
    return () => sub.remove();
  }, [signOut]);
}
