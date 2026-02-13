import type { StyleProp, ViewStyle } from 'react-native';

export interface ISwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}
