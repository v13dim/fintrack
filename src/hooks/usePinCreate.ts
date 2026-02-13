import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'contexts';

import { PinAuthService } from 'services';

import { type IUsePinEntryApi, usePinEntry } from './usePinEntry';

export const usePinCreate = () => {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [firstPin, setFirstPin] = useState('');

  const goHome = useCallback(() => {
    signIn();
  }, [signIn]);

  const pinEntry = usePinEntry({
    onComplete: useCallback(
      (pin: string, api: IUsePinEntryApi) => {
        if (step === 1) {
          setFirstPin(pin);
          api.setValue('');
          setStep(2);
          return;
        }

        if (pin !== firstPin) {
          api.setErrorMessage(t('pin.create.mismatch'));
          api.setValue('');
          return;
        }

        api.setIsLoading(true);
        PinAuthService.createPin(pin)
          .then(goHome)
          .finally(() => api.setIsLoading(false));
      },
      [step, firstPin, goHome, t],
    ),
  });

  const title = useMemo(
    () => (step === 1 ? t('pin.create.title') : t('pin.create.repeatPrompt')),
    [step, t],
  );
  const subtitle = useMemo(() => (step === 1 ? t('pin.create.subtitle') : undefined), [step, t]);

  return {
    value: pinEntry.value,
    handleDigit: pinEntry.handleDigit,
    handleBackspace: pinEntry.handleBackspace,
    title,
    subtitle,
    errorMessage: pinEntry.errorMessage,
    isLoading: pinEntry.isLoading,
  };
};
