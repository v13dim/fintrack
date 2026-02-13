import React, { FC } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';

import { useScreenHeaderStyles } from './ScreenHeader.styles';
import type { IScreenHeaderProps } from './ScreenHeader.types';

export const ScreenHeader: FC<IScreenHeaderProps> = ({
  left,
  center,
  right,
  testID = 'screen-header',
}) => {
  const styles = useScreenHeaderStyles();

  return (
    <View style={styles.container} testID={testID}>
      <View style={styles.island}>
        <BlurView
          blurType='light'
          blurAmount={Platform.OS === 'ios' ? 20 : 25}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.islandContent}>
          <View style={styles.row}>
            <View style={styles.left}>{left ?? null}</View>
            <View style={styles.center}>{center ?? null}</View>
            <View style={styles.right}>{right ?? null}</View>
          </View>
        </View>
      </View>
    </View>
  );
};
