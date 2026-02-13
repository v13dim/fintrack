import React, { FC } from 'react';
import { View } from 'react-native';

import { Text } from 'components/common';

import { useSectionHeaderStyles } from './SectionHeader.styles';
import type { ISectionHeaderProps } from './SectionHeader.types';

export const SectionHeader: FC<ISectionHeaderProps> = ({
  title,
  style,
  testID = 'section-header',
}) => {
  const styles = useSectionHeaderStyles();
  return (
    <View style={[styles.container, style]} testID={testID}>
      <Text.Caption color='accentMedium' style={styles.title}>
        {title}
      </Text.Caption>
    </View>
  );
};
