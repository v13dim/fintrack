import React, { FC } from 'react';
import { View } from 'react-native';

import { useSettingsCardStyles } from './SettingsCard.styles';
import type { ISettingsCardProps } from './SettingsCard.types';

export const SettingsCard: FC<ISettingsCardProps> = ({
  children,
  style,
  testID = 'settings-card',
}) => {
  const styles = useSettingsCardStyles();
  return (
    <View style={[styles.card, style]} testID={testID}>
      {children}
    </View>
  );
};
