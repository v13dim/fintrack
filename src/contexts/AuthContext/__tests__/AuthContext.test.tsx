import React from 'react';
import { act, renderHook } from '@testing-library/react-native';

import { __resetAuthSessionForTests, AuthProvider, useAuth } from '../AuthContext';

describe('AuthContext', () => {
  beforeEach(() => {
    __resetAuthSessionForTests();
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
  });

  it('should throw when useAuth is used outside AuthProvider', () => {
    expect(() => renderHook(() => useAuth())).toThrow('useAuth must be used within AuthProvider');
  });

  it('should restore isAuthenticated from session after AuthProvider remount', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );
    const { result, unmount } = renderHook(() => useAuth(), { wrapper });

    act(() => result.current.signIn());
    expect(result.current.isAuthenticated).toBe(true);

    unmount();

    const { result: resultAfterRemount } = renderHook(() => useAuth(), { wrapper });
    expect(resultAfterRemount.current.isAuthenticated).toBe(true);
  });
});
