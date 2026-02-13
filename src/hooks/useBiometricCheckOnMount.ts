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
      const [enabled, available] = await Promise.all([
        BiometricAuthService.isBiometricEnabled(),
        BiometricAuthService.isBiometricAvailable(),
      ]);
      if (cancelled || !enabled || !available) {
        setIsCheckingBiometric(false);
        return;
      }
      const success = await BiometricAuthService.authenticateWithBiometric();
      if (cancelled) return;
      if (success) {
        onSuccess();
      } else {
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
