import { useMemo } from 'react';
import { Dimensions, ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from 'hooks/useTheme';

import { ITheme } from './theme.types';

/**
 * Screen dimensions helper
 */
export interface IStyleDimensions {
  width: number;
  height: number;
  scale: number;
  fontScale: number;
}

/**
 * Safe area insets helper
 */
export interface IStyleInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Style helpers containing theme, dimensions, and insets
 */
export interface IStyleHelpers {
  theme: ITheme;
  dimensions: IStyleDimensions;
  insets: IStyleInsets;
}

/**
 * Style function that receives helpers and optional extra data, returns styles
 */
export type StyleFunction<T, TExtra = void> = (helpers: IStyleHelpers, extra: TExtra) => T;

/**
 * Styles object type for React Native
 */
export type Styles<T> = {
  [K in keyof T]: ViewStyle | TextStyle | ImageStyle;
};

/**
 * Creates a memoized style hook with access to theme, dimensions, insets, and extra data
 *
 * Usage with extra data:
 * ```tsx
 * // Component.styles.ts
 * import { createStyles } from 'theme';
 *
 * interface ComponentStylesExtra {
 *   isActive: boolean;
 *   variant?: 'primary' | 'secondary';
 * }
 *
 * export const useComponentStyles = createStyles(
 *   ({ theme: { colors, typography, spacing }, dimensions, insets }, { isActive, variant = 'primary' }: ComponentStylesExtra) => ({
 *     container: {
 *       backgroundColor: isActive ? colors.accent.green : colors.background.primary,
 *       padding: spacing.lg,
 *       paddingTop: insets.top + spacing.md,
 *       width: dimensions.width,
 *     },
 *     text: {
 *       ...typography.body,
 *       color: variant === 'primary' ? colors.text.primary : colors.text.secondary,
 *     },
 *   }),
 * );
 *
 * // In component:
 * const styles = useComponentStyles({ isActive: true, variant: 'primary' });
 * ```
 *
 * Without extra data:
 * ```tsx
 * // Component.styles.ts
 * import { createStyles } from 'theme';
 *
 * export const useComponentStyles = createStyles(
 *   ({ theme: { colors, spacing }, dimensions, insets }) => ({
 *     container: {
 *       backgroundColor: colors.background.primary,
 *       padding: spacing.lg,
 *     },
 *   }),
 * );
 *
 * // In component:
 * const styles = useComponentStyles();
 * ```
 *
 * **Performance Note:** For complex extra objects, memoize them in the component:
 * ```tsx
 * const extra = useMemo(() => ({ isActive, variant }), [isActive, variant]);
 * const styles = useComponentStyles(extra);
 * ```
 *
 * @param styleFunction Function that receives helpers (theme, dimensions, insets) and extra data, returns styles object
 * @returns Hook function that accepts extra data and returns memoized StyleSheet
 */
export const createStyles =
  <T extends Styles<T>, TExtra = void>(styleFunction: StyleFunction<T, TExtra>) =>
  (extra: TExtra): ReturnType<typeof StyleSheet.create<T>> => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const dimensions = useMemo<IStyleDimensions>(() => {
      const { width, height, scale, fontScale } = Dimensions.get('window');
      return { width, height, scale, fontScale };
    }, []);

    return useMemo(() => {
      const helpers: IStyleHelpers = {
        theme,
        dimensions,
        insets,
      };
      const styles = styleFunction(helpers, extra as TExtra);
      return StyleSheet.create(styles);
    }, [theme, dimensions, insets, extra]);
  };
