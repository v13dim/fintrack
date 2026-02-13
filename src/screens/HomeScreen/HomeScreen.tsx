import React, { FC } from 'react';
import { View } from 'react-native';

import { Text } from 'components/common';

import { useHomeScreenStyles } from './HomeScreen.styles';

/**
 * Main app home screen after authentication.
 * Currently wraps HelloWorld; will be replaced by transaction list and FAB in Phase 2.
 */
export const HomeScreen: FC = () => {
  const styles = useHomeScreenStyles();

  return (
    <View style={styles.container}>
      <Text.H3 testID='home-screen-text' color='primary'>
        Hello world!
      </Text.H3>
    </View>
  );
};
