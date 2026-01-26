/**
 * Common colors for FinTrack
 * These colors are theme-agnostic and can be used across different themes
 * (e.g., in shadows, overlays, etc.)
 */

/**
 * Base colors that are consistent across all themes
 */
export const baseColors = {
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
} as const;

/**
 * Shadow colors with different opacity levels
 * Used for creating shadows that work across different themes
 */
export const shadowColors = {
  // Black shadows with different opacity
  black10: '#0000001A', // 10% opacity
  black08: '#00000014', // 8% opacity
  black06: '#0000000F', // 6% opacity
  black05: '#0000000D', // 5% opacity
  black12: '#0000001F', // 12% opacity
  // Pure black for shadowColor (opacity controlled by shadowOpacity)
  black: '#000000',
} as const;

/**
 * Common color palette
 * Combines base colors and shadow colors
 */
export const commonColors = {
  ...baseColors,
  shadow: shadowColors,
} as const;
