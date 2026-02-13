import React, { FC } from 'react';
import { View } from 'react-native';

import { usePageIndicatorStyles } from './PageIndicator.styles';
import type { IPageIndicatorProps } from './PageIndicator.types';

export const PageIndicator: FC<IPageIndicatorProps> = ({
  currentIndex,
  totalCount,
  testID = 'page-indicator',
}) => {
  const styles = usePageIndicatorStyles();

  return (
    <View style={styles.container} testID={`${testID}-container`}>
      {Array.from({ length: totalCount }).map((_, i) => (
        <View
          key={i}
          style={i === currentIndex ? styles.dotActive : styles.dot}
          testID={i === currentIndex ? `${testID}-active` : testID}
        />
      ))}
    </View>
  );
};
