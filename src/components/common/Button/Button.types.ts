import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'third' | 'ghost' | 'danger';

export interface IButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

/** Props for compound buttons (variant is fixed) */
export type IButtonCompoundProps = Omit<IButtonProps, 'variant'>;
