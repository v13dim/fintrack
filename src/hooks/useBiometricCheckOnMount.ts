import { useEffect, useState } from 'react';

import { BiometricAuthService } from 'services';

/**
 * On mount: checks if biometric is enabled and available, then attempts authentication.
 * Calls onSuccess() if biometric auth succeeds; otherwise sets checking to false.
 * Returns isCheckingBiometric for the duration of the check.
 */
export const useBiometricCheckOnMount = (onSuccess: () => void) => {
  const [isCheckingBiometric, setIsCheckingBiometric] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      console.warn('[Auth] BiometricCheckOnMount start');
      const [enabled, available] = await Promise.all([
        BiometricAuthService.isBiometricEnabled(),
        BiometricAuthService.isBiometricAvailable(),
      ]);
      if (cancelled || !enabled || !available) {
        console.warn('[Auth] BiometricCheckOnMount skip', { enabled, available });
        setIsCheckingBiometric(false);
        return;
      }
      console.warn('[Auth] BiometricCheckOnMount prompting');
      const success = await BiometricAuthService.authenticateWithBiometric();
      if (cancelled) return;
      if (success) {
        console.warn('[Auth] BiometricCheckOnMount success, onSuccess');
        onSuccess();
      } else {
        console.warn('[Auth] BiometricCheckOnMount failed or cancelled');
        setIsCheckingBiometric(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [onSuccess]);

  return isCheckingBiometric;
};
