import React, { FC } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Text } from 'components/common';
import { BiometricKey } from 'components/pin/BiometricKey';

import { useTheme } from 'hooks/useTheme';

import { Fingerprint } from 'assets/svg';

import { usePinKeypadStyles } from './PinKeypad.styles';
import type { IPinKeypadProps } from './PinKeypad.types';

const DIGITS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const BACKSPACE = '⌫';

export const PinKeypad: FC<IPinKeypadProps> = ({
  onDigit,
  onBackspace,
  disabled = false,
  showBiometricPlaceholder = false,
  onBiometricPress,
  testID = 'pin-keypad',
}) => {
  const styles = usePinKeypadStyles();
  const { colors } = useTheme();
  return (
    <View style={styles.keypad}>
      {DIGITS.map(d => (
        <TouchableOpacity
          key={d}
          style={[styles.key, disabled ? styles.keyDisabled : null]}
          onPress={() => onDigit(d)}
          disabled={disabled}
          testID={`${testID}-key-${d}`}
          accessibilityRole='button'
          accessibilityLabel={d}
        >
          <Text.H3 color='accentGreenText'>{d}</Text.H3>
        </TouchableOpacity>
      ))}
      {showBiometricPlaceholder ? (
        <BiometricKey
          onPress={onBiometricPress}
          disabled={disabled}
          testID={`${testID}-key-biometric`}
        />
      ) : (
        <View style={[styles.key, styles.keyEmpty]} testID={`${testID}-key-empty`}>
          <Fingerprint size={40} color={colors.accent.greenText} />
        </View>
      )}
      <TouchableOpacity
        style={[styles.key, disabled ? styles.keyDisabled : null]}
        onPress={() => onDigit('0')}
        disabled={disabled}
        testID={`${testID}-key-0`}
        accessibilityRole='button'
        accessibilityLabel='0'
      >
        <Text.H3 color='accentGreenText'>0</Text.H3>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.key, disabled ? styles.keyDisabled : null]}
        onPress={onBackspace}
        disabled={disabled}
        testID={`${testID}-key-backspace`}
        accessibilityRole='button'
        accessibilityLabel='backspace'
      >
        <Text.H3 color='accentGreenText'>{BACKSPACE}</Text.H3>
      </TouchableOpacity>
    </View>
  );
};
