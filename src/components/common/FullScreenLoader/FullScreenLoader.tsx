import React, { FC, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { Text } from 'components/common';

import { useTheme } from 'hooks/useTheme';

import { useFullScreenLoaderStyles } from './FullScreenLoader.styles';
import type { IFullScreenLoaderProps } from './FullScreenLoader.types';

const FADE_DURATION_MS = 200;

export const FullScreenLoader: FC<IFullScreenLoaderProps> = ({
  message,
  testID = 'fullscreen-loader',
}) => {
  const styles = useFullScreenLoaderStyles();
  const { colors } = useTheme();
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(0.95, { duration: FADE_DURATION_MS });
  }, [opacity]);

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[styles.overlay, animatedOverlayStyle]}
      pointerEvents='box-only'
      testID={testID}
    >
      <View style={styles.content} testID={`${testID}-overlay`}>
        <ActivityIndicator size='large' color={colors.accent.green} testID={`${testID}-spinner`} />
        {message != null && message !== '' ? (
          <Text.Body style={styles.message} color='secondary' testID={`${testID}-message`}>
            {message}
          </Text.Body>
        ) : null}
      </View>
    </Animated.View>
  );
};
