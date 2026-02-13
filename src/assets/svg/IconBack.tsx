import React, { FC } from 'react';
import Svg, { Path } from 'react-native-svg';

import { useTheme } from 'hooks/useTheme';

const VIEW_BOX = '0 0 24 24';

export interface IIconBackProps {
  size?: number;
  color?: string;
  testID?: string;
}

export const IconBack: FC<IIconBackProps> = ({ size = 24, color, testID = 'icon-back' }) => {
  const { colors } = useTheme();
  const stroke = color ?? colors.text.primary;

  return (
    <Svg width={size} height={size} viewBox={VIEW_BOX} fill='none' testID={testID}>
      <Path
        d='M19 12H5M12 19l-7-7 7-7'
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </Svg>
  );
};
