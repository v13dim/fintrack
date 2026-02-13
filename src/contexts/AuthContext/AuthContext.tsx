import React, {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { getSession, setSession } from 'utils/authSessionStore';

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
}

export const AuthProvider: FC<IAuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const session = getSession();
    console.warn('[Auth] AuthContext initial session', session);
    return session;
  });

  const signIn = useCallback(() => {
    console.warn('[Auth] AuthContext signIn');
    setSession(true);
    setIsAuthenticated(true);
  }, []);

  const signOut = useCallback(() => {
    console.warn('[Auth] AuthContext signOut');
    setSession(false);
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
