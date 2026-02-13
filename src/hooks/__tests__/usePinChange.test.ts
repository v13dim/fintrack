import { act, renderHook } from '@testing-library/react-native';

import { setPin, verifyPin } from 'services';

import { usePinChange } from '../usePinChange';

const mockGoBack = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
}));

jest.mock('services', () => ({
  setPin: jest.fn(() => Promise.resolve()),
  verifyPin: jest.fn(() => Promise.resolve(false)),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {},
  }),
}));

const enterPin = async (
  result: { current: { handleDigit: (d: string) => void } },
  digits: string,
) => {
  for (const d of digits) {
    await act(async () => {
      result.current.handleDigit(d);
    });
  }
};

describe('usePinChange', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(verifyPin).mockResolvedValue(false);
    jest.mocked(setPin).mockResolvedValue(undefined);
  });

  it('should start at step 1 with empty value', () => {
    const { result } = renderHook(() => usePinChange());

    expect(result.current.title).toBe('pin.change.currentTitle');
    expect(result.current.subtitle).toBe('pin.change.currentSubtitle');
    expect(result.current.value).toBe('');
    expect(result.current.errorMessage).toBeUndefined();
  });

  it('should show error and clear value when current PIN is wrong (step 1)', async () => {
    jest.mocked(verifyPin).mockResolvedValue(false);
    const { result } = renderHook(() => usePinChange());
    await enterPin(result, '0000');
    expect(result.current.errorMessage).toBe('pin.login.incorrect');
    expect(result.current.value).toBe('');
  });

  it('should advance to step 2 when current PIN is correct (step 1)', async () => {
    jest.mocked(verifyPin).mockResolvedValue(true);
    const { result } = renderHook(() => usePinChange());
    await enterPin(result, '1234');
    expect(result.current.title).toBe('pin.change.newTitle');
    expect(result.current.value).toBe('');
    expect(result.current.subtitle).toBeUndefined();
  });

  it('should advance to step 3 after entering new PIN (step 2)', async () => {
    jest.mocked(verifyPin).mockResolvedValue(true);
    const { result } = renderHook(() => usePinChange());
    await enterPin(result, '1234');
    await enterPin(result, '5678');
    expect(result.current.title).toBe('pin.create.repeatPrompt');
    expect(result.current.value).toBe('');
  });

  it('should show error when repeat PIN does not match (step 3)', async () => {
    jest.mocked(verifyPin).mockResolvedValue(true);
    const { result } = renderHook(() => usePinChange());
    await enterPin(result, '1234');
    await enterPin(result, '5678');
    await enterPin(result, '9999');
    expect(result.current.errorMessage).toBe('pin.create.mismatch');
    expect(result.current.value).toBe('');
  });

  it('should call setPin and goBack when repeat PIN matches (step 3)', async () => {
    jest.mocked(verifyPin).mockResolvedValue(true);
    const { result } = renderHook(() => usePinChange());
    await enterPin(result, '1234');
    await enterPin(result, '5678');
    await enterPin(result, '5678');
    expect(setPin).toHaveBeenCalledWith('5678');
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('should show error when setPin throws (step 3)', async () => {
    jest.mocked(verifyPin).mockResolvedValue(true);
    jest.mocked(setPin).mockRejectedValue(new Error('storage error'));
    const { result } = renderHook(() => usePinChange());
    await enterPin(result, '1234');
    await enterPin(result, '5678');
    await enterPin(result, '5678');
    expect(result.current.errorMessage).toBe('common.error');
  });

  it('should clear error and remove last digit on backspace', async () => {
    jest.mocked(verifyPin).mockResolvedValue(false);
    const { result } = renderHook(() => usePinChange());
    await enterPin(result, '12');
    expect(result.current.value).toBe('12');
    await act(async () => {
      result.current.handleBackspace();
    });
    expect(result.current.value).toBe('1');
    expect(result.current.errorMessage).toBeUndefined();
  });
});
