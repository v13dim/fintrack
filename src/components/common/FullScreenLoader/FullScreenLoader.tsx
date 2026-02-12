import React, { FC } from 'react';
import { ActivityIndicator, Modal, View } from 'react-native';

import { Text } from 'components/common';

import { useTheme } from 'hooks/useTheme';

import { useFullScreenLoaderStyles } from './FullScreenLoader.styles';
import type { IFullScreenLoaderProps } from './FullScreenLoader.types';

export const FullScreenLoader: FC<IFullScreenLoaderProps> = ({
  visible,
  message,
  testID = 'fullscreen-loader',
}) => {
  const styles = useFullScreenLoaderStyles();
  const { colors } = useTheme();

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType='fade' statusBarTranslucent testID={testID}>
      <View style={styles.overlay} testID={`${testID}-overlay`}>
        <ActivityIndicator size='large' color={colors.accent.green} testID={`${testID}-spinner`} />
        {message != null && message !== '' ? (
          <Text.Body style={styles.message} color='secondary' testID={`${testID}-message`}>
            {message}
          </Text.Body>
        ) : null}
      </View>
    </Modal>
  );
};
