import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'contexts';

import { BiometricAuthService, PinAuthService } from 'services';

import { useBiometricCheckOnMount } from './useBiometricCheckOnMount';
import { type IUsePinEntryApi, usePinEntry } from './usePinEntry';

const LOCKOUT_POLL_MS = 1000;

export const usePinLogin = () => {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [locked, setLocked] = useState(false);
  const [biometricPermissionDenied, setBiometricPermissionDenied] = useState(false);
  const [biometricEnabledInSettings, setBiometricEnabledInSettings] = useState(false);

  useEffect(() => {
    BiometricAuthService.isBiometricEnabled().then(setBiometricEnabledInSettings);
  }, []);

  const goHome = useCallback(() => {
    signIn();
  }, [signIn]);

  const isCheckingBiometric = useBiometricCheckOnMount(goHome);

  const refreshLockout = useCallback(async () => {
    const remaining = await PinAuthService.getRemainingLockoutSeconds();
    setRemainingSeconds(remaining);
    setLocked(remaining > 0);
  }, []);

  useEffect(() => {
    refreshLockout();
  }, [refreshLockout]);

  useEffect(() => {
    if (!locked) return;
    const id = setInterval(() => {
      PinAuthService.getRemainingLockoutSeconds().then(sec => {
        setRemainingSeconds(sec);
        if (sec <= 0) setLocked(false);
      });
    }, LOCKOUT_POLL_MS);
    return () => clearInterval(id);
  }, [locked]);

  const pinEntry = usePinEntry({
    disabled: locked,
    onComplete: useCallback(
      (pin: string, api: IUsePinEntryApi) => {
        api.setIsLoading(true);
        PinAuthService.verifyPin(pin)
          .then(result => {
            if (result.success) {
              goHome();
              return;
            }
            api.setValue('');
            if (result.locked) {
              setRemainingSeconds(result.remainingSeconds);
              setLocked(true);
              api.setErrorMessage(t('pin.login.locked', { seconds: result.remainingSeconds }));
              return;
            }
            api.setErrorMessage(t('pin.login.incorrect'));
          })
          .catch(() => undefined)
          .finally(() => api.setIsLoading(false));
      },
      [goHome, t],
    ),
  });

  const handleBiometricPress = useCallback(async () => {
    const granted = await BiometricAuthService.requestBiometricPermission();
    if (!granted) {
      setBiometricPermissionDenied(true);
      return;
    }
    const enabled = await BiometricAuthService.isBiometricEnabled();
    if (!enabled) {
      try {
        await BiometricAuthService.enableBiometric();
      } catch {
        return;
      }
    }
    const success = await BiometricAuthService.authenticateWithBiometric();
    if (success) goHome();
  }, [goHome]);

  const displayError = useMemo(
    () =>
      locked
        ? t('pin.login.locked', { seconds: remainingSeconds })
        : pinEntry.errorMessage ?? undefined,
    [locked, remainingSeconds, pinEntry.errorMessage, t],
  );

  return {
    value: pinEntry.value,
    handleDigit: pinEntry.handleDigit,
    handleBackspace: pinEntry.handleBackspace,
    handleBiometricPress,
    showBiometricKey: biometricEnabledInSettings,
    biometricKeyTappable: !biometricPermissionDenied,
    disabled: locked,
    title: t('pin.login.title'),
    subtitle: t('pin.login.subtitle'),
    errorMessage: displayError,
    isLoading: pinEntry.isLoading,
    isCheckingBiometric,
  };
};
