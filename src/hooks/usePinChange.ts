import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

import { setPin, verifyPin } from 'services';

import { type IUsePinEntryApi, usePinEntry } from './usePinEntry';

export const usePinChange = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [firstPin, setFirstPin] = useState('');

  const pinEntry = usePinEntry({
    onComplete: useCallback(
      async (pin: string, api: IUsePinEntryApi) => {
        if (step === 1) {
          api.setIsLoading(true);
          try {
            const valid = await verifyPin(pin);
            if (valid) {
              api.setValue('');
              setStep(2);
            } else {
              api.setErrorMessage(t('pin.login.incorrect'));
              api.setValue('');
            }
          } finally {
            api.setIsLoading(false);
          }
          return;
        }

        if (step === 2) {
          setFirstPin(pin);
          api.setValue('');
          setStep(3);
          return;
        }

        if (pin !== firstPin) {
          api.setErrorMessage(t('pin.create.mismatch'));
          api.setValue('');
          return;
        }

        api.setIsLoading(true);
        try {
          await setPin(pin);
          navigation.goBack();
        } catch {
          api.setErrorMessage(t('common.error'));
        } finally {
          api.setIsLoading(false);
        }
      },
      [step, firstPin, navigation, t],
    ),
  });

  const title = useMemo(() => {
    if (step === 1) return t('pin.change.currentTitle');
    if (step === 2) return t('pin.change.newTitle');
    return t('pin.create.repeatPrompt');
  }, [step, t]);

  const subtitle = useMemo(
    () => (step === 1 ? t('pin.change.currentSubtitle') : undefined),
    [step, t],
  );

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
