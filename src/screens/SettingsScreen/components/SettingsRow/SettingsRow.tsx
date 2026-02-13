import React, { FC, ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { Text } from 'components/common';

import { useSettingsRowStyles } from './SettingsRow.styles';
import type { ISettingsRowProps } from './SettingsRow.types';

function getRightContent(right: ReactNode): ReactNode {
  if (right == null) return null;
  if (typeof right === 'string') {
    return <Text.Body color='secondary'>{right}</Text.Body>;
  }
  return right;
}

export const SettingsRow: FC<ISettingsRowProps> = ({
  title,
  subtitle,
  right,
  onPress,
  style,
  testID = 'settings-row',
}) => {
  const styles = useSettingsRowStyles();
  const rightContent = getRightContent(right);
  const content = (
    <>
      <View style={styles.left}>
        <View style={styles.titleBlock}>
          <Text.Body color='accentDark'>{title}</Text.Body>
          {subtitle != null ? <Text.Caption color='secondary'>{subtitle}</Text.Caption> : null}
        </View>
      </View>
      {rightContent != null ? <View>{rightContent}</View> : null}
    </>
  );

  if (onPress != null) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }, style]}
        testID={testID}
      >
        {content}
      </Pressable>
    );
  }
  return (
    <View style={[styles.row, style]} testID={testID}>
      {content}
    </View>
  );
};
