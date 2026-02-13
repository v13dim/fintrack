import { act, renderHook } from '@testing-library/react-native';

import { PinAuthService } from 'services';

import { usePinCreate } from '../usePinCreate';

const mockSignIn = jest.fn();
jest.mock('contexts', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
    signOut: jest.fn(),
    isAuthenticated: false,
  }),
}));

jest.mock('services', () => ({
  PinAuthService: {
    createPin: jest.fn(() => Promise.resolve()),
  },
}));

describe('usePinCreate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(PinAuthService.createPin).mockResolvedValue(undefined);
  });

  it('should start at step 1 with empty value', () => {
    const { result } = renderHook(() => usePinCreate());

    expect(result.current.title).toBe('pin.create.title');
    expect(result.current.subtitle).toBe('pin.create.subtitle');
    expect(result.current.value).toBe('');
    expect(result.current.errorMessage).toBeUndefined();
  });

  it('should move to step 2 after entering 4 digits', () => {
    const { result } = renderHook(() => usePinCreate());

    act(() => result.current.handleDigit('1'));
    act(() => result.current.handleDigit('2'));
    act(() => result.current.handleDigit('3'));
    act(() => result.current.handleDigit('4'));

    expect(result.current.value).toBe('');
    expect(result.current.title).toBe('pin.create.repeatPrompt');
  });

  it('should call createPin and signIn when repeat matches', async () => {
    const { result } = renderHook(() => usePinCreate());

    act(() => result.current.handleDigit('1'));
    act(() => result.current.handleDigit('2'));
    act(() => result.current.handleDigit('3'));
    act(() => result.current.handleDigit('4'));

    act(() => result.current.handleDigit('1'));
    act(() => result.current.handleDigit('2'));
    act(() => result.current.handleDigit('3'));
    act(() => result.current.handleDigit('4'));

    expect(PinAuthService.createPin).toHaveBeenCalledWith('1234');

    await act(async () => {
      await Promise.resolve();
    });
    expect(mockSignIn).toHaveBeenCalled();
  });

  it('should set errorMessage when repeat does not match', () => {
    const { result } = renderHook(() => usePinCreate());

    act(() => result.current.handleDigit('1'));
    act(() => result.current.handleDigit('2'));
    act(() => result.current.handleDigit('3'));
    act(() => result.current.handleDigit('4'));

    act(() => result.current.handleDigit('5'));
    act(() => result.current.handleDigit('6'));
    act(() => result.current.handleDigit('7'));
    act(() => result.current.handleDigit('8'));

    expect(result.current.errorMessage).toBe('pin.create.mismatch');
    expect(result.current.value).toBe('');
    expect(PinAuthService.createPin).not.toHaveBeenCalled();
  });

  it('should clear value on backspace and clear errorMessage', () => {
    const { result } = renderHook(() => usePinCreate());

    act(() => result.current.handleDigit('1'));
    act(() => result.current.handleDigit('2'));
    expect(result.current.value).toBe('12');

    act(() => result.current.handleBackspace());
    expect(result.current.value).toBe('1');

    act(() => result.current.handleBackspace());
    expect(result.current.value).toBe('');

    act(() => result.current.handleDigit('1'));
    act(() => result.current.handleDigit('2'));
    act(() => result.current.handleDigit('3'));
    act(() => result.current.handleDigit('4'));
    act(() => result.current.handleDigit('5'));
    act(() => result.current.handleDigit('6'));
    act(() => result.current.handleDigit('7'));
    act(() => result.current.handleDigit('8'));
    expect(result.current.errorMessage).toBe('pin.create.mismatch');

    act(() => result.current.handleBackspace());
    expect(result.current.errorMessage).toBeUndefined();
  });
});
