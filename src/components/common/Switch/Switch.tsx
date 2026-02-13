import React, { FC, useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useTheme } from 'hooks/useTheme';

import { SWITCH_THUMB_TRAVEL, useSwitchStyles } from './Switch.styles';
import type { ISwitchProps } from './Switch.types';

const AnimatedView = Animated.createAnimatedComponent(View);

export const Switch: FC<ISwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  style,
  testID = 'switch',
}) => {
  const { colors } = useTheme();
  const styles = useSwitchStyles();
  const thumbOffset = useSharedValue(value ? SWITCH_THUMB_TRAVEL : 0);

  useEffect(() => {
    thumbOffset.value = withTiming(value ? SWITCH_THUMB_TRAVEL : 0, {
      duration: 150,
    });
  }, [value, thumbOffset]);

  const thumbAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: thumbOffset.value }],
  }));

  const trackBackgroundColor = value ? colors.accent.medium : colors.toggleInactive;

  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      disabled={disabled}
      style={[styles.track, { backgroundColor: trackBackgroundColor }, style]}
      testID={testID}
    >
      <AnimatedView style={[styles.thumb, thumbAnimatedStyle]} />
    </Pressable>
  );
};
