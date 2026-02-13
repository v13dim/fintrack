import React, { FC } from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

import { useTheme } from 'hooks/useTheme';

const VIEW_BOX = '0 0 24 24';

export interface IIconSettingsProps {
  size?: number;
  color?: string;
  testID?: string;
}

export const IconSettings: FC<IIconSettingsProps> = ({
  size = 24,
  color,
  testID = 'icon-settings',
}) => {
  const { colors } = useTheme();
  const stroke = color ?? colors.text.primary;

  return (
    <Svg width={size} height={size} viewBox={VIEW_BOX} fill='none' testID={testID}>
      <Circle cx={12} cy={12} r={3} stroke={stroke} strokeWidth={2} />
      <Path
        d='M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z'
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </Svg>
  );
};
