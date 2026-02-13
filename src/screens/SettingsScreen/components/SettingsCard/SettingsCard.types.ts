import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface ISettingsCardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
