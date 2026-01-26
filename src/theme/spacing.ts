import { ISpacing } from './theme.types';

/**
 * Spacing scale for FinTrack
 * Based on wireframes spacing values
 * All values are in pixels
 */
export const spacing: ISpacing = {
  // Standard spacing scale
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  // Additional spacing values from wireframes
  '40': 40,
  '48': 48,
  '60': 60,
  '82': 82,
} as const;
