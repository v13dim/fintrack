import { AppState } from 'react-native';
import { act, renderHook } from '@testing-library/react-native';

import { AutoLockStorageService } from 'services';

import { useAppStateLock } from '../useAppStateLock';

jest.mock('react-native', () => ({
  AppState: {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  },
}));

jest.mock('utils', () => ({
  intervalToSeconds: (interval: string) => {
    if (interval === 'never') return null;
    const n = parseInt(interval, 10);
    return Number.isNaN(n) ? null : n;
  },
}));

jest.mock('services', () => ({
  AutoLockStorageService: {
    getAutoLockInterval: jest.fn(() => Promise.resolve('60')),
  },
}));

describe('useAppStateLock', () => {
  let listener: ((state: string) => void) | null = null;

  beforeEach(() => {
    jest.clearAllMocks();
    listener = null;
    jest.mocked(AppState.addEventListener).mockImplementation((event, fn) => {
      if (event === 'change') listener = fn as (state: string) => void;
      return { remove: jest.fn() };
    });
    jest.mocked(AutoLockStorageService.getAutoLockInterval).mockResolvedValue('60');
  });

  it('should call signOut when returning to active after interval elapsed', async () => {
    const signOut = jest.fn();
    renderHook(() => useAppStateLock(signOut));

    expect(listener).not.toBeNull();

    act(() => {
      listener!('background');
    });

    await new Promise<void>(r => setTimeout(r, 0));

    jest.spyOn(Date, 'now').mockReturnValue(Date.now() + 120 * 1000);

    await act(async () => {
      listener!('active');
    });

    await new Promise<void>(r => setTimeout(r, 50));

    expect(AutoLockStorageService.getAutoLockInterval).toHaveBeenCalled();
    expect(signOut).toHaveBeenCalledTimes(1);
  });

  it('should not call signOut when interval is never', async () => {
    jest.mocked(AutoLockStorageService.getAutoLockInterval).mockResolvedValue('never');
    const signOut = jest.fn();
    renderHook(() => useAppStateLock(signOut));

    act(() => {
      listener!('background');
    });
    await new Promise<void>(r => setTimeout(r, 0));

    jest.spyOn(Date, 'now').mockReturnValue(Date.now() + 120 * 1000);

    await act(async () => {
      listener!('active');
    });

    await new Promise<void>(r => setTimeout(r, 50));

    expect(signOut).not.toHaveBeenCalled();
  });

  it('should not call signOut when elapsed time is less than interval', async () => {
    const signOut = jest.fn();
    renderHook(() => useAppStateLock(signOut));

    act(() => {
      listener!('background');
    });
    await new Promise<void>(r => setTimeout(r, 0));

    jest.spyOn(Date, 'now').mockReturnValue(Date.now() + 30 * 1000);

    await act(async () => {
      listener!('active');
    });

    await new Promise<void>(r => setTimeout(r, 50));

    expect(signOut).not.toHaveBeenCalled();
  });
});
