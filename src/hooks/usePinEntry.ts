import { useCallback, useMemo, useState } from 'react';

const DEFAULT_PIN_LENGTH = 4;

export interface IUsePinEntryApi {
  setValue: (value: string | ((prev: string) => string)) => void;
  setErrorMessage: (message: string | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export interface IUsePinEntryOptions {
  /** Length of PIN (default 4). When reached, onComplete is called. */
  pinLength?: number;
  /** Called when user has entered pinLength digits. Second argument provides setValue, setErrorMessage, setIsLoading. */
  onComplete?: (pin: string, api: IUsePinEntryApi) => void | Promise<void>;
  /** When true, digit input and error clear on backspace are no-ops. */
  disabled?: boolean;
}

export const usePinEntry = (options: IUsePinEntryOptions = {}) => {
  const pinLength = options.pinLength ?? DEFAULT_PIN_LENGTH;
  const [value, setValue] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const api = useMemo<IUsePinEntryApi>(
    () => ({
      setValue,
      setErrorMessage,
      setIsLoading,
    }),
    [],
  );

  const handleDigit = useCallback(
    (digit: string) => {
      if (options.disabled || value.length >= pinLength) return;
      setErrorMessage(null);
      const next = value + digit;
      setValue(next);

      if (next.length === pinLength && options.onComplete) {
        options.onComplete(next, api);
      }
    },
    [value, pinLength, options.disabled, options.onComplete, api],
  );

  const handleBackspace = useCallback(() => {
    if (!options.disabled) setErrorMessage(null);
    setValue(prev => prev.slice(0, -1));
  }, [options.disabled]);

  return {
    value,
    setValue,
    errorMessage: errorMessage ?? undefined,
    setErrorMessage,
    isLoading,
    setIsLoading,
    handleDigit,
    handleBackspace,
  };
};
