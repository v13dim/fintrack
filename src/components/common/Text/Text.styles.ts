import type { TextStyle } from 'react-native';

import { createStyles } from 'theme';
import type { IColors, TypographyKey } from 'theme/theme.types';

import type { TextColorVariant } from './Text.types';

export interface ITextStylesExtra {
  variant: TypographyKey;
  color: TextColorVariant;
  center: boolean;
}

function getTextColor(color: TextColorVariant, colors: IColors): string {
  switch (color) {
    case 'primary':
      return colors.text.primary;
    case 'secondary':
      return colors.text.secondary;
    case 'error':
      return colors.status.errorText;
    case 'tertiary':
      return colors.text.tertiary;
    case 'accentDark':
      return colors.accent.darkText;
    case 'accentMedium':
      return colors.accent.mediumText;
    case 'accentGreenText':
      return colors.accent.greenText;
    case 'white':
    case 'inverse':
      return colors.white;
    default:
      return colors.text.primary;
  }
}

export const useTextStyles = createStyles<{ text: TextStyle }, ITextStylesExtra>(
  ({ theme: { colors, typography } }, { variant, color, center }) => ({
    text: {
      ...typography[variant],
      color: getTextColor(color, colors),
      ...(center ? { textAlign: 'center' as const } : {}),
    },
  }),
);
