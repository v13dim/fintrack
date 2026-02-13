import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native';

import { useTheme } from 'hooks/useTheme';

import { Fingerprint } from 'assets/svg';

import { useBiometricKeyStyles } from './BiometricKey.styles';
import type { IBiometricKeyProps } from './BiometricKey.types';

const DEFAULT_ACCESSIBILITY_LABEL = 'Authenticate with biometrics';

export const BiometricKey: FC<IBiometricKeyProps> = ({
  onPress,
  disabled = false,
  testID,
  accessibilityLabel = DEFAULT_ACCESSIBILITY_LABEL,
}) => {
  const styles = useBiometricKeyStyles();
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.key, disabled ? styles.keyDisabled : null]}
      onPress={onPress}
      disabled={disabled}
      testID={testID}
      accessibilityRole='button'
      accessibilityLabel={accessibilityLabel}
    >
      <Fingerprint size={40} color={colors.accent.greenText} />
    </TouchableOpacity>
  );
};
