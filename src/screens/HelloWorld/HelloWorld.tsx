import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { useHelloWorldStyles } from './HelloWorld.styles';

export const HelloWorld: FC = () => {
  const styles = useHelloWorldStyles();

  return (
    <View style={styles.container}>
      <Text testID='hello-world-text' style={styles.text}>
        Hello world!
      </Text>
    </View>
  );
};
