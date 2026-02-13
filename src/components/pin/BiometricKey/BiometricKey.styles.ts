import { ViewStyle } from 'react-native';

import { createStyles } from 'theme';

interface BiometricKeyStyles {
  key: ViewStyle;
  keyDisabled: ViewStyle;
  keyEmpty: ViewStyle;
}

export const useBiometricKeyStyles = createStyles<BiometricKeyStyles>(
  ({ theme: { colors, shadows } }) => ({
    key: {
      width: 72,
      height: 72,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: colors.accent.green,
      backgroundColor: colors.background.secondary,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.pinKey,
    },
    keyDisabled: {
      opacity: 0.5,
    },
    keyEmpty: {
      borderWidth: 0,
      backgroundColor: 'transparent',
      shadowOpacity: 0,
      elevation: 0,
    },
  }),
);
