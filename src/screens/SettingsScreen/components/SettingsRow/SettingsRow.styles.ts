import type { ViewStyle } from 'react-native';

import { createStyles } from 'theme';

interface SettingsRowStyles {
  row: ViewStyle;
  left: ViewStyle;
  titleBlock: ViewStyle;
}

export const useSettingsRowStyles = createStyles<SettingsRowStyles>(({ theme: { spacing } }) => ({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  left: {
    flex: 1,
  },
  titleBlock: {
    gap: 2,
  },
}));
