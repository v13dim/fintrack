import React, { createContext, FC, ReactNode } from 'react';

import { lightTheme } from 'theme/lightTheme';
import { ITheme } from 'theme/theme.types';

/**
 * Theme Context
 * Provides theme to all components in the app
 */
export const ThemeContext = createContext<ITheme>(lightTheme);

/**
 * Theme Provider Props
 */
export interface IThemeProviderProps {
  theme?: ITheme;
  children: ReactNode;
}

/**
 * Theme Provider
 * Wraps the app and provides theme context
 */
export const ThemeProvider: FC<IThemeProviderProps> = ({ theme = lightTheme, children }) => {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};
