import React, {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export interface ITabBarVisibilityContextValue {
  tabBarHidden: boolean;
  setTabBarHidden: (hidden: boolean) => void;
}

export const TabBarVisibilityContext = createContext<ITabBarVisibilityContextValue | null>(null);

export const useTabBarVisibility = () => {
  const ctx = useContext(TabBarVisibilityContext);
  if (ctx == null) {
    throw new Error('useTabBarVisibility must be used within TabBarVisibilityProvider');
  }
  return ctx;
};

export interface ITabBarVisibilityProviderProps {
  children: ReactNode;
}

export const TabBarVisibilityProvider: FC<ITabBarVisibilityProviderProps> = ({ children }) => {
  const [tabBarHidden, setTabBarHiddenState] = useState(false);

  const setTabBarHidden = useCallback((hidden: boolean) => {
    setTabBarHiddenState(hidden);
  }, []);

  const value = useMemo<ITabBarVisibilityContextValue>(
    () => ({
      tabBarHidden,
      setTabBarHidden,
    }),
    [tabBarHidden, setTabBarHidden],
  );

  return (
    <TabBarVisibilityContext.Provider value={value}>{children}</TabBarVisibilityContext.Provider>
  );
};
