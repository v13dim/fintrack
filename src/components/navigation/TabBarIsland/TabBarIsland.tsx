import React, { FC, useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTabBarVisibility } from 'contexts';

import { Text } from 'components/common';

import { useTheme } from 'hooks/useTheme';

import { useTabBarIslandStyles } from './TabBarIsland.styles';

const TAB_BAR_SLIDE_DISTANCE = 120;

export const TabBarIsland: FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const styles = useTabBarIslandStyles();
  const { colors } = useTheme();
  const { tabBarHidden } = useTabBarVisibility();
  const [layoutWidth, setLayoutWidth] = useState(0);
  const pillOffset = useSharedValue(0);
  const translateY = useSharedValue(0);

  const tabCount = state.routes.length;
  const pillWidth = layoutWidth > 0 ? layoutWidth / tabCount : 0;

  useEffect(() => {
    if (layoutWidth > 0 && tabCount > 0) {
      const segmentWidth = layoutWidth / tabCount;
      pillOffset.value = withSpring(state.index * segmentWidth, {
        damping: 300,
        stiffness: 1200,
      });
    }
  }, [state.index, layoutWidth, tabCount, pillOffset]);

  useEffect(() => {
    translateY.value = withSpring(tabBarHidden ? TAB_BAR_SLIDE_DISTANCE : 0, {
      damping: 300,
      stiffness: 1200,
    });
  }, [tabBarHidden, translateY]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const pillAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: pillOffset.value }],
    width: pillWidth,
  }));

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]} testID='tab-bar-island'>
      <View style={styles.island}>
        <View
          style={styles.tabRow}
          onLayout={e => setLayoutWidth(e.nativeEvent.layout.width)}
          testID='tab-bar-row'
        >
          {layoutWidth > 0 && (
            <Animated.View style={[styles.pill, pillAnimatedStyle]} testID='tab-bar-pill' />
          )}
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;
            const label = options.tabBarLabel ?? options.title ?? route.name;
            const icon = options.tabBarIcon?.({
              focused: isFocused,
              color: isFocused ? colors.white : colors.text.secondary,
              size: 22,
            });

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            return (
              <Pressable
                key={route.key}
                accessibilityRole='button'
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={`tab-bar-${route.name.toLowerCase()}`}
                onPress={onPress}
                style={({ pressed }) => [styles.tabButton, pressed && { opacity: 0.7 }]}
              >
                <View style={styles.tabButtonContent}>
                  {icon}
                  <Text.Caption
                    color={isFocused ? 'accentGreenText' : 'secondary'}
                    style={isFocused ? { color: colors.white } : undefined}
                  >
                    {typeof label === 'string' ? label : route.name}
                  </Text.Caption>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
};
