import { act, renderHook } from '@testing-library/react-native';

import { BiometricAuthService } from 'services';

import { useBiometricCheckOnMount } from '../useBiometricCheckOnMount';

jest.mock('services', () => ({
  BiometricAuthService: {
    isBiometricEnabled: jest.fn(),
    isBiometricAvailable: jest.fn(),
    authenticateWithBiometric: jest.fn(),
  },
}));

/** Flush microtask queue inside act() so React can flush pending updates. */
const flushMicrotasksInAct = () =>
  act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });

describe('useBiometricCheckOnMount', () => {
  const onSuccess = jest.fn();
  let originalConsoleError: typeof console.error;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(BiometricAuthService.isBiometricEnabled).mockResolvedValue(false);
    jest.mocked(BiometricAuthService.isBiometricAvailable).mockResolvedValue(false);
    originalConsoleError = console.error;
    console.error = (...args: unknown[]) => {
      const msg = args.map(a => (typeof a === 'string' ? a : String(a))).join(' ');
      if (msg.includes('not wrapped in act')) return;
      originalConsoleError.apply(console, args);
    };
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('should start with isCheckingBiometric true', () => {
    const { result } = renderHook(() => useBiometricCheckOnMount(onSuccess));

    expect(result.current).toBe(true);
  });

  it('should set isCheckingBiometric to false when biometric is disabled', async () => {
    jest.mocked(BiometricAuthService.isBiometricEnabled).mockResolvedValue(false);
    jest.mocked(BiometricAuthService.isBiometricAvailable).mockResolvedValue(true);

    const { result } = renderHook(() => useBiometricCheckOnMount(onSuccess));

    await flushMicrotasksInAct();

    expect(result.current).toBe(false);
    expect(BiometricAuthService.authenticateWithBiometric).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('should set isCheckingBiometric to false when biometric is unavailable', async () => {
    jest.mocked(BiometricAuthService.isBiometricEnabled).mockResolvedValue(true);
    jest.mocked(BiometricAuthService.isBiometricAvailable).mockResolvedValue(false);

    const { result } = renderHook(() => useBiometricCheckOnMount(onSuccess));

    await flushMicrotasksInAct();

    expect(result.current).toBe(false);
    expect(BiometricAuthService.authenticateWithBiometric).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('should set isCheckingBiometric to false and not call onSuccess when auth fails', async () => {
    jest.mocked(BiometricAuthService.isBiometricEnabled).mockResolvedValue(true);
    jest.mocked(BiometricAuthService.isBiometricAvailable).mockResolvedValue(true);
    jest.mocked(BiometricAuthService.authenticateWithBiometric).mockResolvedValue(false);

    const { result } = renderHook(() => useBiometricCheckOnMount(onSuccess));

    await flushMicrotasksInAct();
    await flushMicrotasksInAct();

    expect(result.current).toBe(false);
    expect(BiometricAuthService.authenticateWithBiometric).toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('should call onSuccess when biometric is enabled, available, and auth succeeds', async () => {
    jest.mocked(BiometricAuthService.isBiometricEnabled).mockResolvedValue(true);
    jest.mocked(BiometricAuthService.isBiometricAvailable).mockResolvedValue(true);
    jest.mocked(BiometricAuthService.authenticateWithBiometric).mockResolvedValue(true);

    const { result } = renderHook(() => useBiometricCheckOnMount(onSuccess));

    await flushMicrotasksInAct();
    await flushMicrotasksInAct();

    expect(result.current).toBe(true);
    expect(BiometricAuthService.authenticateWithBiometric).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
  });

  it('should not call onSuccess after unmount when auth would succeed', async () => {
    jest.mocked(BiometricAuthService.isBiometricEnabled).mockResolvedValue(true);
    jest.mocked(BiometricAuthService.isBiometricAvailable).mockResolvedValue(true);
    jest
      .mocked(BiometricAuthService.authenticateWithBiometric)
      .mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(true), 0)));

    const { unmount } = renderHook(() => useBiometricCheckOnMount(onSuccess));

    unmount();
    await flushMicrotasksInAct();

    expect(onSuccess).not.toHaveBeenCalled();
  });
});
