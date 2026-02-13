import React from 'react';
import { act, renderHook } from '@testing-library/react-native';

import { TabBarVisibilityProvider, useTabBarVisibility } from '../TabBarVisibilityContext';

describe('TabBarVisibilityContext', () => {
  it('should provide tabBarHidden false by default', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TabBarVisibilityProvider>{children}</TabBarVisibilityProvider>
    );
    const { result } = renderHook(() => useTabBarVisibility(), { wrapper });

    expect(result.current.tabBarHidden).toBe(false);
    expect(typeof result.current.setTabBarHidden).toBe('function');
  });

  it('should update tabBarHidden when setTabBarHidden is called', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <TabBarVisibilityProvider>{children}</TabBarVisibilityProvider>
    );
    const { result } = renderHook(() => useTabBarVisibility(), { wrapper });

    act(() => {
      result.current.setTabBarHidden(true);
    });

    expect(result.current.tabBarHidden).toBe(true);

    act(() => {
      result.current.setTabBarHidden(false);
    });

    expect(result.current.tabBarHidden).toBe(false);
  });

  it('should throw when useTabBarVisibility is used outside TabBarVisibilityProvider', () => {
    expect(() => renderHook(() => useTabBarVisibility())).toThrow(
      'useTabBarVisibility must be used within TabBarVisibilityProvider',
    );
  });
});
