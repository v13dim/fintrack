import type { TextStyle, ViewStyle } from 'react-native';

import { createStyles } from 'theme';

import type { ButtonVariant } from './Button.types';

export interface IButtonStylesExtra {
  fullWidth: boolean;
  variant: ButtonVariant;
}

export const useButtonStyles = createStyles<
  { root: ViewStyle; label: TextStyle },
  IButtonStylesExtra
>(({ theme: { colors, typography, spacing, shadows } }, { fullWidth, variant }) => {
  const base: ViewStyle = {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  };

  const variantStyles: Record<ButtonVariant, ViewStyle> = {
    primary: {
      backgroundColor: colors.accent.green,
      ...shadows.buttonPrimary,
    },
    secondary: {
      backgroundColor: colors.accent.light,
      ...shadows.buttonSecondary,
    },
    third: {
      backgroundColor: colors.accent.medium,
      ...shadows.buttonThird,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: colors.accent.medium,
    },
    danger: {
      backgroundColor: colors.status.error,
      ...shadows.buttonDanger,
    },
  };

  const labelColors: Record<ButtonVariant, string> = {
    primary: colors.white,
    secondary: colors.accent.lightText,
    third: colors.white,
    ghost: colors.accent.mediumText,
    danger: colors.white,
  };

  const widthStyle: ViewStyle = fullWidth ? { width: '100%' } : {};

  return {
    root: {
      ...base,
      ...variantStyles[variant],
      ...widthStyle,
    },
    label: {
      ...typography.button,
      color: labelColors[variant],
    },
  };
});
