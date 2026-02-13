import type { ReactNode } from 'react';
import type { StyleProp, TextStyle } from 'react-native';

import type { TypographyKey } from 'theme/theme.types';

export type TextColorVariant =
  | 'primary'
  | 'secondary'
  | 'error'
  | 'tertiary'
  | 'accentDark'
  | 'accentMedium'
  | 'accentGreenText'
  | 'white'
  | 'inverse';

export interface ITextProps {
  children: ReactNode;
  variant?: TypographyKey;
  color?: TextColorVariant;
  center?: boolean;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

/** Props for compound text (variant is fixed) */
export type ITextCompoundProps = Omit<ITextProps, 'variant'>;
