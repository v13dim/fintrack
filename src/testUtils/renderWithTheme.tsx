import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { ThemeProvider } from 'contexts/ThemeContext';

import { lightTheme } from 'theme/lightTheme';
import { ITheme } from 'theme/theme.types';

export interface IRenderWithThemeOptions extends Omit<RenderOptions, 'wrapper'> {
  theme?: ITheme;
}

/**
 * Renders the given UI wrapped in ThemeProvider (default: lightTheme).
 * Use in component tests that need theme context (createStyles, theme colors, etc.).
 */
export function renderWithTheme(
  ui: React.ReactElement,
  { theme = lightTheme, ...options }: IRenderWithThemeOptions = {},
) {
  return render(ui, {
    ...options,
    wrapper: ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>,
  });
}
