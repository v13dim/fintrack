import { useContext } from 'react';
import { ThemeContext } from 'contexts/ThemeContext';

import { ITheme } from 'theme/theme.types';

/**
 * Hook to access the current theme
 * @returns Current theme object
 * @throws Error if used outside ThemeProvider
 */
export const useTheme = (): ITheme => {
  const theme = useContext(ThemeContext);

  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return theme;
};
