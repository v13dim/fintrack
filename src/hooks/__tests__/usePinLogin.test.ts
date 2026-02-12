import { act, renderHook } from '@testing-library/react-native';

import { BiometricAuthService, PinAuthService } from 'services';

import { usePinLogin } from '../usePinLogin';

const mockSignIn = jest.fn();

jest.mock('contexts', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
    signOut: jest.fn(),
    isAuthenticated: false,
  }),
}));

jest.mock('services', () => ({
  BiometricAuthService: {
    isBiometricEnabled: jest.fn(),
    isBiometricAvailable: jest.fn(),
    authenticateWithBiometric: jest.fn(),
    requestBiometricPermission: jest.fn(),
    enableBiometric: jest.fn(),
  },
  PinAuthService: {
    getRemainingLockoutSeconds: jest.fn(() => Promise.resolve(0)),
    verifyPin: jest.fn(),
  },
}));

describe('usePinLogin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.mocked(PinAuthService.getRemainingLockoutSeconds).mockResolvedValue(0);
    jest.mocked(BiometricAuthService.isBiometricEnabled).mockResolvedValue(false);
    jest.mocked(BiometricAuthService.isBiometricAvailable).mockResolvedValue(false);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should start with empty value and clear isCheckingBiometric when biometric disabled', async () => {
    const { result } = renderHook(() => usePinLogin());

    expect(result.current.value).toBe('');
    expect(result.current.isCheckingBiometric).toBe(true);

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.isCheckingBiometric).toBe(false);
  });

  it('should call signIn when biometric auth succeeds on mount', async () => {
    jest.mocked(BiometricAuthService.isBiometricEnabled).mockResolvedValue(true);
    jest.mocked(BiometricAuthService.isBiometricAvailable).mockResolvedValue(true);
    jest.mocked(BiometricAuthService.authenticateWithBiometric).mockResolvedValue(true);

    renderHook(() => usePinLogin());

    await act(async () => {
      await Promise.resolve();
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(mockSignIn).toHaveBeenCalled();
  });

  it('should set locked and errorMessage when verifyPin returns locked', async () => {
    jest.mocked(PinAuthService.verifyPin).mockResolvedValue({
      success: false,
      locked: true,
      remainingSeconds: 30,
    });

    const { result } = renderHook(() => usePinLogin());

    await act(async () => {
      await Promise.resolve();
    });

    act(() => result.current.handleDigit('1'));
    act(() => result.current.handleDigit('2'));
    act(() => result.current.handleDigit('3'));
    act(() => result.current.handleDigit('4'));

    await act(async () => {
      await Promise.resolve();
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.disabled).toBe(true);
    expect(result.current.errorMessage).toContain('pin.login.locked');
    expect(result.current.errorMessage).toContain('30');
  });

  it('should run lockout poll when locked and unlock when remaining is 0', async () => {
    jest
      .mocked(PinAuthService.getRemainingLockoutSeconds)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(0);

    const { result } = renderHook(() => usePinLogin());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.disabled).toBe(true);

    act(() => {
      jest.advanceTimersByTime(1000);
    });
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.disabled).toBe(false);
  });

  it('should set errorMessage when verifyPin returns incorrect pin (not locked)', async () => {
    jest.mocked(PinAuthService.getRemainingLockoutSeconds).mockResolvedValue(0);
    jest.mocked(PinAuthService.verifyPin).mockResolvedValue({
      success: false,
      locked: false,
      attemptsLeft: 2,
    });

    const { result } = renderHook(() => usePinLogin());

    await act(async () => Promise.resolve());

    act(() => result.current.handleDigit('1'));
    act(() => result.current.handleDigit('2'));
    act(() => result.current.handleDigit('3'));
    act(() => result.current.handleDigit('4'));

    await act(async () => Promise.resolve());

    expect(result.current.errorMessage).toBe('pin.login.incorrect');
    expect(result.current.value).toBe('');
  });

  it('should call signIn when verifyPin succeeds', async () => {
    jest.mocked(PinAuthService.verifyPin).mockResolvedValue({ success: true });

    const { result } = renderHook(() => usePinLogin());

    await act(async () => Promise.resolve());

    act(() => result.current.handleDigit('1'));
    act(() => result.current.handleDigit('2'));
    act(() => result.current.handleDigit('3'));
    act(() => result.current.handleDigit('4'));

    expect(PinAuthService.verifyPin).toHaveBeenCalledWith('1234');

    await act(async () => Promise.resolve());
    expect(mockSignIn).toHaveBeenCalled();
  });

  it('should set isLoading false when verifyPin rejects', async () => {
    jest.mocked(PinAuthService.verifyPin).mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => usePinLogin());

    await act(async () => Promise.resolve());

    act(() => result.current.handleDigit('1'));
    act(() => result.current.handleDigit('2'));
    act(() => result.current.handleDigit('3'));
    act(() => result.current.handleDigit('4'));

    await act(async () => Promise.resolve());

    expect(result.current.isLoading).toBe(false);
  });

  it('should not clear errorMessage on handleBackspace when locked', async () => {
    jest.mocked(PinAuthService.getRemainingLockoutSeconds).mockResolvedValue(30);
    jest.mocked(PinAuthService.verifyPin).mockResolvedValue({
      success: false,
      locked: true,
      remainingSeconds: 30,
    });

    const { result } = renderHook(() => usePinLogin());

    await act(async () => Promise.resolve());

    act(() => result.current.handleDigit('1'));
    act(() => result.current.handleDigit('2'));
    act(() => result.current.handleDigit('3'));
    act(() => result.current.handleDigit('4'));
    await act(async () => Promise.resolve());

    expect(result.current.disabled).toBe(true);
    const errorBefore = result.current.errorMessage;

    act(() => result.current.handleBackspace());

    expect(result.current.errorMessage).toBe(errorBefore);
  });

  it('should set biometricPermissionDenied when requestBiometricPermission returns false', async () => {
    jest.mocked(BiometricAuthService.requestBiometricPermission).mockResolvedValue(false);

    const { result } = renderHook(() => usePinLogin());

    await act(async () => Promise.resolve());

    await act(async () => {
      result.current.handleBiometricPress();
    });

    expect(result.current.biometricKeyTappable).toBe(false);
  });

  it('should call enableBiometric then authenticate when biometric not enabled', async () => {
    jest.mocked(BiometricAuthService.requestBiometricPermission).mockResolvedValue(true);
    jest.mocked(BiometricAuthService.isBiometricEnabled).mockResolvedValue(false);
    jest.mocked(BiometricAuthService.enableBiometric).mockResolvedValue(undefined);
    jest.mocked(BiometricAuthService.authenticateWithBiometric).mockResolvedValue(true);

    const { result } = renderHook(() => usePinLogin());

    await act(async () => Promise.resolve());

    await act(async () => {
      result.current.handleBiometricPress();
    });

    expect(BiometricAuthService.enableBiometric).toHaveBeenCalled();
    expect(BiometricAuthService.authenticateWithBiometric).toHaveBeenCalled();
    expect(mockSignIn).toHaveBeenCalled();
  });

  it('should not goHome when enableBiometric throws', async () => {
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
    jest.mocked(BiometricAuthService.requestBiometricPermission).mockResolvedValue(true);
    jest.mocked(BiometricAuthService.isBiometricEnabled).mockResolvedValue(false);
    jest.mocked(BiometricAuthService.enableBiometric).mockRejectedValue(new Error('fail'));

    const { result } = renderHook(() => usePinLogin());

    await act(async () => Promise.resolve());

    await act(async () => {
      result.current.handleBiometricPress();
    });

    expect(mockSignIn).not.toHaveBeenCalled();
    jest.mocked(console.log).mockRestore();
  });

  it('should call goHome when authenticateWithBiometric succeeds on biometric press', async () => {
    jest.mocked(BiometricAuthService.requestBiometricPermission).mockResolvedValue(true);
    jest.mocked(BiometricAuthService.isBiometricEnabled).mockResolvedValue(true);
    jest.mocked(BiometricAuthService.authenticateWithBiometric).mockResolvedValue(true);

    const { result } = renderHook(() => usePinLogin());

    await act(async () => Promise.resolve());

    await act(async () => {
      result.current.handleBiometricPress();
    });

    expect(mockSignIn).toHaveBeenCalled();
  });
});
