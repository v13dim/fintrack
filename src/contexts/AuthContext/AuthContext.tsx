import React, {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

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

/** Survives AuthProvider remount (e.g. after Error Boundary retry); reset on process death. */
let sessionActive = false;

/** Reset session state for tests. Not part of public API. */
export function __resetAuthSessionForTests(): void {
  sessionActive = false;
}

export const AuthProvider: FC<IAuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionActive);

  const signIn = useCallback(() => {
    sessionActive = true;
    setIsAuthenticated(true);
  }, []);

  const signOut = useCallback(() => {
    sessionActive = false;
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
