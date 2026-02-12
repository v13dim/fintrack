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
            goHome();
            return;
          }
          setValue('');
          if (result.locked) {
            setRemainingSeconds(result.remainingSeconds);
            setLocked(true);
            setErrorMessage(t('pin.login.locked', { seconds: result.remainingSeconds }));
            return;
          }
          setErrorMessage(t('pin.login.incorrect'));
        })
        .catch(() => {})
        .finally(() => setIsLoading(false));
    },
    [value, locked, goHome, t],
  );

  const handleBackspace = useCallback(() => {
    if (!locked) setErrorMessage(null);
    setValue(prev => prev.slice(0, -1));
  }, [locked]);

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
      } catch (e) {
        console.log('[PinLogin] enableBiometric failed:', e);
        return;
      }
    }
    const success = await BiometricAuthService.authenticateWithBiometric();
    if (success) goHome();
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
