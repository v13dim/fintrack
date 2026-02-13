import React, { FC } from 'react';
import { View } from 'react-native';

import { Text } from 'components';

import { useHelloWorldStyles } from './HelloWorld.styles';

export const HelloWorld: FC = () => {
  const styles = useHelloWorldStyles();

  return (
    <View style={styles.container}>
      <Text.H3 testID='hello-world-text' color='primary'>
        Hello world!
      </Text.H3>
    </View>
  );
};
