import React, { FC } from 'react';
import Svg, { Path } from 'react-native-svg';

import { useTheme } from 'hooks/useTheme';

const VIEW_BOX = '0 0 24 24';

export interface IIconHomeProps {
  size?: number;
  color?: string;
  testID?: string;
}

export const IconHome: FC<IIconHomeProps> = ({ size = 24, color, testID = 'icon-home' }) => {
  const { colors } = useTheme();
  const fill = color ?? colors.text.primary;

  return (
    <Svg width={size} height={size} viewBox={VIEW_BOX} fill='none' testID={testID}>
      <Path
        d='M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z'
        stroke={fill}
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
        fill='none'
      />
      <Path
        d='M9 22V12h6v10'
        stroke={fill}
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </Svg>
  );
};
