import React, { FC } from 'react';
import Svg, { Path } from 'react-native-svg';

import { useTheme } from 'hooks/useTheme';

const VIEW_BOX = '0 0 24 24';

export interface IIconRightArrowProps {
  size?: number;
  color?: string;
  testID?: string;
}

export const IconRightArrow: FC<IIconRightArrowProps> = ({
  size = 24,
  color,
  testID = 'icon-right-arrow',
}) => {
  const { colors } = useTheme();
  const stroke = color ?? colors.text.primary;

  return (
    <Svg width={size} height={size} viewBox={VIEW_BOX} fill='none' testID={testID}>
      <Path
        d='M5 12h14M12 5l7 7-7 7'
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </Svg>
  );
};
