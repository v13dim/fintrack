import type { ViewStyle } from 'react-native';

import { createStyles } from 'theme';

interface SwitchStyles {
  track: ViewStyle;
  thumb: ViewStyle;
}

const TRACK_HEIGHT = 28;
const TRACK_WIDTH = 52;
const THUMB_SIZE = 22;
const TRACK_PADDING = (TRACK_HEIGHT - THUMB_SIZE) / 2;
const THUMB_TRAVEL = TRACK_WIDTH - TRACK_PADDING * 2 - THUMB_SIZE;

export const useSwitchStyles = createStyles<SwitchStyles>(({ theme: { colors } }) => ({
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    padding: TRACK_PADDING,
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: colors.white,
    position: 'absolute',
    left: TRACK_PADDING,
    top: TRACK_PADDING,
  },
}));

export const SWITCH_THUMB_TRAVEL = THUMB_TRAVEL;
