import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface ISettingsRowProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
