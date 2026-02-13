import React, { FC } from 'react';
import Svg, { Path } from 'react-native-svg';

import { useTheme } from 'hooks/useTheme';

const VIEW_BOX = '0 0 24 24';

export interface IIconAnalyticsProps {
  size?: number;
  color?: string;
  testID?: string;
}

export const IconAnalytics: FC<IIconAnalyticsProps> = ({
  size = 24,
  color,
  testID = 'icon-analytics',
}) => {
  const { colors } = useTheme();
  const fill = color ?? colors.text.primary;

  return (
    <Svg width={size} height={size} viewBox={VIEW_BOX} fill='none' testID={testID}>
      <Path
        d='M18 20V10M12 20V4M6 20v-6'
        stroke={fill}
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </Svg>
  );
};
