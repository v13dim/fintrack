import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'contexts';

import { BiometricAuthService, PinAuthService } from 'services';

import { useBiometricCheckOnMount } from './useBiometricCheckOnMount';

const PIN_LENGTH = 4;
const LOCKOUT_POLL_MS = 1000;

export const usePinLogin = () => {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const [value, setValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [locked, setLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [biometricPermissionDenied, setBiometricPermissionDenied] = useState(false);

  const goHome = useCallback(() => {
    console.warn('[Auth] PinLogin goHome (signIn)');
    signIn();
  }, [signIn]);

  const isCheckingBiometric = useBiometricCheckOnMount(goHome);

  const refreshLockout = useCallback(async () => {
    const remaining = await PinAuthService.getRemainingLockoutSeconds();
    setRemainingSeconds(remaining);
    setLocked(remaining > 0);
    if (remaining > 0) {
      console.warn('[Auth] PinLogin lockout remaining', remaining, 's');
    }
  }, []);

  useEffect(() => {
    console.warn('[Auth] PinLogin screen mounted');
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

  const handleDigit = useCallback(
    (digit: string) => {
      if (locked || value.length >= PIN_LENGTH) return;
      setErrorMessage(null);
      const next = value + digit;
      setValue(next);
      if (next.length !== PIN_LENGTH) return;

      setIsLoading(true);
      PinAuthService.verifyPin(next)
        .then(result => {
          if (result.success) {
            console.warn('[Auth] PinLogin PIN verified, goHome');
            goHome();
            return;
          }
          setValue('');
          if (result.locked) {
            console.warn('[Auth] PinLogin locked', result.remainingSeconds, 's');
            setRemainingSeconds(result.remainingSeconds);
            setLocked(true);
            setErrorMessage(t('pin.login.locked', { seconds: result.remainingSeconds }));
            return;
          }
          console.warn('[Auth] PinLogin incorrect PIN');
          setErrorMessage(t('pin.login.incorrect'));
        })
        .catch(() => {
          console.warn('[Auth] PinLogin verifyPin error');
        })
        .finally(() => setIsLoading(false));
    },
    [value, locked, goHome, t],
  );

  const handleBackspace = useCallback(() => {
    if (!locked) setErrorMessage(null);
    setValue(prev => prev.slice(0, -1));
  }, [locked]);

  const handleBiometricPress = useCallback(async () => {
    console.warn('[Auth] PinLogin biometric press');
    const granted = await BiometricAuthService.requestBiometricPermission();
    if (!granted) {
      console.warn('[Auth] PinLogin biometric permission denied');
      setBiometricPermissionDenied(true);
      return;
    }
    const enabled = await BiometricAuthService.isBiometricEnabled();
    if (!enabled) {
      try {
        await BiometricAuthService.enableBiometric();
        console.warn('[Auth] PinLogin biometric enabled');
      } catch (e) {
        console.warn('[Auth] PinLogin enableBiometric failed', e);
        return;
      }
    }
    const success = await BiometricAuthService.authenticateWithBiometric();
    if (success) {
      console.warn('[Auth] PinLogin biometric success, goHome');
      goHome();
    } else {
      console.warn('[Auth] PinLogin biometric failed or cancelled');
    }
  }, [goHome]);

  const displayError = useMemo(
    () =>
      locked ? t('pin.login.locked', { seconds: remainingSeconds }) : errorMessage ?? undefined,
    [locked, remainingSeconds, errorMessage, t],
  );

  return {
    value,
    handleDigit,
    handleBackspace,
    handleBiometricPress,
    biometricKeyTappable: !biometricPermissionDenied,
    disabled: locked,
    title: t('pin.login.title'),
    subtitle: t('pin.login.subtitle'),
    errorMessage: displayError,
    isLoading,
    isCheckingBiometric,
  };
};
