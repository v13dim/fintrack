import { act, renderHook } from '@testing-library/react-native';

import { usePinEntry } from '../usePinEntry';

describe('usePinEntry', () => {
  it('should start with empty value, no error, not loading', () => {
    const { result } = renderHook(() => usePinEntry());

    expect(result.current.value).toBe('');
    expect(result.current.errorMessage).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
  });

  it('should append digits on handleDigit', () => {
    const { result } = renderHook(() => usePinEntry());

    act(() => result.current.handleDigit('1'));
    expect(result.current.value).toBe('1');

    act(() => result.current.handleDigit('2'));
    act(() => result.current.handleDigit('3'));
    act(() => result.current.handleDigit('4'));
    expect(result.current.value).toBe('1234');
  });

  it('should not append when value length already equals pinLength', () => {
    const { result } = renderHook(() => usePinEntry({ pinLength: 4 }));

    act(() => result.current.handleDigit('1'));
    act(() => result.current.handleDigit('2'));
    act(() => result.current.handleDigit('3'));
    act(() => result.current.handleDigit('4'));
    expect(result.current.value).toBe('1234');

    act(() => result.current.handleDigit('5'));
    expect(result.current.value).toBe('1234');
  });

  it('should call onComplete with pin and api when pinLength digits entered', () => {
    const onComplete = jest.fn();
    const { result } = renderHook(() => usePinEntry({ onComplete }));

    act(() => result.current.handleDigit('1'));
    act(() => result.current.handleDigit('2'));
    act(() => result.current.handleDigit('3'));
    act(() => result.current.handleDigit('4'));

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith(
      '1234',
      expect.objectContaining({
        setValue: expect.any(Function),
        setErrorMessage: expect.any(Function),
        setIsLoading: expect.any(Function),
      }),
    );
  });

  it('should clear errorMessage on handleDigit', () => {
    const { result } = renderHook(() => usePinEntry());

    act(() => result.current.setErrorMessage('some error'));
    act(() => result.current.handleDigit('1'));

    expect(result.current.errorMessage).toBeUndefined();
  });

  it('should remove last digit on handleBackspace', () => {
    const { result } = renderHook(() => usePinEntry());

    act(() => result.current.handleDigit('1'));
    act(() => result.current.handleDigit('2'));
    expect(result.current.value).toBe('12');

    act(() => result.current.handleBackspace());
    expect(result.current.value).toBe('1');

    act(() => result.current.handleBackspace());
    expect(result.current.value).toBe('');
  });

  it('should clear errorMessage on handleBackspace when not disabled', () => {
    const { result } = renderHook(() => usePinEntry());

    act(() => result.current.setErrorMessage('error'));
    act(() => result.current.handleBackspace());

    expect(result.current.errorMessage).toBeUndefined();
  });

  it('should not accept digits when disabled', () => {
    const onComplete = jest.fn();
    const { result } = renderHook(() => usePinEntry({ onComplete, disabled: true }));

    act(() => result.current.handleDigit('1'));
    act(() => result.current.handleDigit('2'));

    expect(result.current.value).toBe('');
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('should not clear errorMessage on handleBackspace when disabled', () => {
    const { result } = renderHook(() => usePinEntry({ disabled: true }));

    act(() => result.current.setErrorMessage('locked'));
    act(() => result.current.handleDigit('1'));
    expect(result.current.value).toBe('');

    act(() => result.current.handleBackspace());
    expect(result.current.errorMessage).toBe('locked');
  });

  it('should respect custom pinLength', () => {
    const onComplete = jest.fn();
    const { result } = renderHook(() => usePinEntry({ pinLength: 6, onComplete }));

    act(() => result.current.handleDigit('1'));
    act(() => result.current.handleDigit('2'));
    act(() => result.current.handleDigit('3'));
    act(() => result.current.handleDigit('4'));
    expect(onComplete).not.toHaveBeenCalled();

    act(() => result.current.handleDigit('5'));
    act(() => result.current.handleDigit('6'));
    expect(onComplete).toHaveBeenCalledWith(
      '123456',
      expect.objectContaining({
        setValue: expect.any(Function),
        setErrorMessage: expect.any(Function),
        setIsLoading: expect.any(Function),
      }),
    );
  });

  it('should expose setValue, setErrorMessage, setIsLoading for parent', () => {
    const { result } = renderHook(() => usePinEntry());

    act(() => result.current.setValue('12'));
    expect(result.current.value).toBe('12');

    act(() => result.current.setErrorMessage('custom'));
    expect(result.current.errorMessage).toBe('custom');

    act(() => result.current.setIsLoading(true));
    expect(result.current.isLoading).toBe(true);
  });
});
