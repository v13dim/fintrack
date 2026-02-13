import React, { FC } from 'react';
import Svg, { Path } from 'react-native-svg';

import { useTheme } from 'hooks/useTheme';

const VIEW_BOX = '0 0 24 24';

export interface IIconCheckProps {
  size?: number;
  color?: string;
  testID?: string;
}

export const IconCheck: FC<IIconCheckProps> = ({ size = 24, color, testID = 'icon-check' }) => {
  const { colors } = useTheme();
  const stroke = color ?? colors.text.primary;

  return (
    <Svg width={size} height={size} viewBox={VIEW_BOX} fill='none' testID={testID}>
      <Path
        d='M5 12l5 5 9-10'
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </Svg>
  );
};
