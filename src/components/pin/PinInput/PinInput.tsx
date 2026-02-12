import React, { FC } from 'react';
import { View } from 'react-native';

import { Text } from 'components/common';

import { PinKeypad } from '../PinKeypad';
import { usePinInputStyles } from './PinInput.styles';
import type { IPinInputProps } from './PinInput.types';

export const PinInput: FC<IPinInputProps> = ({
  value,
  onDigit,
  onBackspace,
  disabled = false,
  title,
  subtitle,
  errorMessage,
  showBiometricPlaceholder = false,
  onBiometricPress,
  testID = 'pin-input',
}) => {
  const styles = usePinInputStyles();

  const handleDigit = (digit: string) => {
    if (value.length < 4) onDigit(digit);
  };

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text.H3 color='accentDark'>{title}</Text.H3>
          {subtitle ? <Text.Body color='secondary'>{subtitle}</Text.Body> : null}
          {errorMessage ? (
            <Text.BodySmall color='error' testID={`${testID}-error`}>
              {errorMessage}
            </Text.BodySmall>
          ) : null}
        </View>
        <View style={styles.dotRow}>
          {[0, 1, 2, 3].map(i => (
            <View
              key={i}
              style={[styles.dot, i < value.length ? styles.dotFilled : null]}
              testID={`${testID}-dot-${i}`}
            />
          ))}
        </View>
      </View>

      <PinKeypad
        onDigit={handleDigit}
        onBackspace={onBackspace}
        disabled={disabled}
        showBiometricPlaceholder={showBiometricPlaceholder}
        onBiometricPress={onBiometricPress}
        testID={testID}
      />
    </View>
  );
};
