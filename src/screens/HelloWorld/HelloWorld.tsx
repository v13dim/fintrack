import React, { FC } from 'react';
import { View, Text } from 'react-native';
import { styles } from './HelloWorld.styles';

export const HelloWorld: FC = () => {
  return (
    <View style={styles.container}>
      <Text testID="hello-world-text" style={styles.text}>
        Hello world!
      </Text>
    </View>
  );
};
