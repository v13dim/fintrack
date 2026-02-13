import React, { FC } from 'react';
import { View } from 'react-native';

import { useDividerStyles } from './Divider.styles';

export const Divider: FC<{ testID?: string }> = ({ testID = 'divider' }) => {
  const styles = useDividerStyles();
  return <View style={styles.line} testID={testID} />;
};
