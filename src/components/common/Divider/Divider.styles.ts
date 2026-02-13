import type { ViewStyle } from 'react-native';

import { createStyles } from 'theme';

interface DividerStyles {
  line: ViewStyle;
}

export const useDividerStyles = createStyles<DividerStyles>(({ theme: { colors, spacing } }) => ({
  line: {
    height: 1,
    backgroundColor: colors.border.divider,
    marginHorizontal: spacing.lg,
  },
}));
