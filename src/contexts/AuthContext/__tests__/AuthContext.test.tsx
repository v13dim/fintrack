import React from 'react';
import { act, renderHook } from '@testing-library/react-native';

import { getSession, setSession } from 'utils/authSessionStore';

import { AuthProvider, useAuth } from '../AuthContext';

jest.mock('utils/authSessionStore', () => ({
  getSession: jest.fn(() => false),
  setSession: jest.fn(),
}));

describe('AuthContext', () => {
  beforeEach(() => {
    jest.mocked(getSession).mockReturnValue(false);
  });

  it('should provide isAuthenticated false by default', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should set isAuthenticated to true when signIn is called', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.signIn();
    });

    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should set isAuthenticated to false when signOut is called after signIn', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.signIn();
    });
    act(() => {
      result.current.signOut();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(setSession).toHaveBeenCalledWith(false);
  });

  it('should provide isAuthenticated true on remount when session is active', () => {
    jest.mocked(getSession).mockReturnValue(true);
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should call setSession(true) when signIn is called', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.signIn();
    });

    expect(setSession).toHaveBeenCalledWith(true);
  });

  it('should throw when useAuth is used outside AuthProvider', () => {
    expect(() => renderHook(() => useAuth())).toThrow('useAuth must be used within AuthProvider');
  });
});
