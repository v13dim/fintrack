import { lightThemeColors } from './colors';
import { commonColors } from './commonColors';
import { shadows } from './shadows';
import { spacing } from './spacing';
import { ITheme } from './theme.types';
import { typography } from './typography';

/**
 * Light theme for FinTrack
 * Combines all theme objects (spacing, colors, typography, shadows, commonColors)
 * Based on wireframes design system
 */
export const lightTheme: ITheme = {
  spacing,
  colors: lightThemeColors,
  typography,
  shadows,
  commonColors,
} as const;
