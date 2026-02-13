import type { ViewStyle } from 'react-native';

import { createStyles } from 'theme';

interface SettingsCardStyles {
  card: ViewStyle;
}

export const useSettingsCardStyles = createStyles<SettingsCardStyles>(
  ({ theme: { colors, shadows } }) => ({
    card: {
      backgroundColor: colors.background.secondary,
      borderRadius: 16,
      padding: 0,
      overflow: 'hidden',
      ...shadows.sm,
    },
  }),
);
