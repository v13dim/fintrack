import React, { FC } from 'react';
import { View } from 'react-native';

import { Button, Text } from 'components';

import { useErrorFallbackStyles } from './ErrorFallback.styles';

export interface IErrorFallbackProps {
  error: Error;
  onRetry: () => void;
}

export const ErrorFallback: FC<IErrorFallbackProps> = ({ error, onRetry }) => {
  const styles = useErrorFallbackStyles();

  return (
    <View style={styles.container}>
      <Text.H4 color='primary' center>
        Something went wrong
      </Text.H4>
      <Text.Body color='secondary' center style={styles.message}>
        {error.message}
      </Text.Body>
      <Button.Primary onPress={onRetry}>Try again</Button.Primary>
    </View>
  );
};
