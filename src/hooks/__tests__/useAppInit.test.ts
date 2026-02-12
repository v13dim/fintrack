import { renderHook, waitFor } from '@testing-library/react-native';

import * as onboardingStorage from 'services';

import { useAppInit } from '../useAppInit';

jest.mock('services', () => ({
  getOnboardingCompleted: jest.fn(),
  hasPin: jest.fn(),
}));

describe('useAppInit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should start with isReady false', () => {
    (onboardingStorage.getOnboardingCompleted as jest.Mock).mockImplementation(
      () => new Promise(() => {}),
    );
    (onboardingStorage.hasPin as jest.Mock).mockImplementation(() => new Promise(() => {}));
    const { result } = renderHook(() => useAppInit());

    expect(result.current.isReady).toBe(false);
  });

  it('should set isFirstLaunch true when onboarding not completed', async () => {
    (onboardingStorage.getOnboardingCompleted as jest.Mock).mockResolvedValue(false);
    (onboardingStorage.hasPin as jest.Mock).mockResolvedValue(false);

    const { result } = renderHook(() => useAppInit());

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    expect(result.current.isFirstLaunch).toBe(true);
    expect(result.current.hasPin).toBe(false);
  });

  it('should set isFirstLaunch false when onboarding completed', async () => {
    (onboardingStorage.getOnboardingCompleted as jest.Mock).mockResolvedValue(true);
    (onboardingStorage.hasPin as jest.Mock).mockResolvedValue(false);

    const { result } = renderHook(() => useAppInit());

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    expect(result.current.isFirstLaunch).toBe(false);
    expect(result.current.hasPin).toBe(false);
  });

  it('should set hasPin true when PIN is set', async () => {
    (onboardingStorage.getOnboardingCompleted as jest.Mock).mockResolvedValue(true);
    (onboardingStorage.hasPin as jest.Mock).mockResolvedValue(true);

    const { result } = renderHook(() => useAppInit());

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    expect(result.current.isFirstLaunch).toBe(false);
    expect(result.current.hasPin).toBe(true);
  });

  it('should set isReady true and isFirstLaunch true on error', async () => {
    (onboardingStorage.getOnboardingCompleted as jest.Mock).mockRejectedValue(
      new Error('storage error'),
    );

    const { result } = renderHook(() => useAppInit());

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    expect(result.current.isFirstLaunch).toBe(true);
  });
});
