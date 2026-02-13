import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'contexts';

import { PinAuthService } from 'services';

const PIN_LENGTH = 4;

export const usePinCreate = () => {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const [step, setStep] = useState<1 | 2>(1);
  const [firstPin, setFirstPin] = useState('');
  const [value, setValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const goHome = useCallback(() => {
    signIn();
  }, [signIn]);

  const handleDigit = useCallback(
    (digit: string) => {
      setErrorMessage(null);
      if (value.length >= PIN_LENGTH) return;
      const next = value + digit;
      setValue(next);

      if (next.length !== PIN_LENGTH) return;

      if (step === 1) {
        setFirstPin(next);
        setValue('');
        setStep(2);
        return;
      }

      if (next !== firstPin) {
        setErrorMessage(t('pin.create.mismatch'));
        setValue('');
        return;
      }

      setIsLoading(true);
      PinAuthService.createPin(next)
        .then(goHome)
        .finally(() => setIsLoading(false));
    },
    [value, step, firstPin, goHome, t],
  );

  const handleBackspace = useCallback(() => {
    setErrorMessage(null);
    setValue(prev => prev.slice(0, -1));
  }, []);

  const title = useMemo(
    () => (step === 1 ? t('pin.create.title') : t('pin.create.repeatPrompt')),
    [step, t],
  );
  const subtitle = useMemo(() => (step === 1 ? t('pin.create.subtitle') : undefined), [step, t]);

  return {
    value,
    handleDigit,
    handleBackspace,
    title,
    subtitle,
    errorMessage: errorMessage ?? undefined,
    isLoading,
  };
};
