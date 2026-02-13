import type { StyleProp, ViewStyle } from 'react-native';

export interface ISectionHeaderProps {
  title: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
