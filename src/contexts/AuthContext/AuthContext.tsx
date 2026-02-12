import React, {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { setAuthSession } from 'services';

export interface IAuthContextValue {
  isAuthenticated: boolean;
  signIn: () => void;
  signOut: () => void;
}

export const AuthContext = createContext<IAuthContextValue | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (ctx == null) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};

export interface IAuthProviderProps {
  children: ReactNode;
  /** Restored from storage on app init so isAuthenticated survives remounts. */
  initialIsAuthenticated?: boolean;
}

export const AuthProvider: FC<IAuthProviderProps> = ({
  children,
  initialIsAuthenticated = false,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(initialIsAuthenticated);

  const signIn = useCallback(() => {
    setAuthSession(true);
    setIsAuthenticated(true);
  }, []);

  const signOut = useCallback(() => {
    setAuthSession(false);
    setIsAuthenticated(false);
  }, []);

  const value = useMemo<IAuthContextValue>(
    () => ({
      isAuthenticated,
      signIn,
      signOut,
    }),
    [isAuthenticated, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
