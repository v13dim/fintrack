import React, { FC } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { Text } from 'components';

import { lightTheme } from 'theme/lightTheme';

import { useAppSuspenseFallbackStyles } from './AppSuspenseFallback.styles';

export const AppSuspenseFallback: FC = () => {
  const styles = useAppSuspenseFallbackStyles();

  return (
    <View style={styles.container}>
      <ActivityIndicator size='large' color={lightTheme.colors.accent.medium} />
      <Text.Body color='secondary'>Loading...</Text.Body>
    </View>
  );
};
