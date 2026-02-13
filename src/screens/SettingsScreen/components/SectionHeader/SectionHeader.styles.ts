import type { TextStyle, ViewStyle } from 'react-native';

import { createStyles } from 'theme';

interface SectionHeaderStyles {
  container: ViewStyle;
  title: TextStyle;
}

export const useSectionHeaderStyles = createStyles<SectionHeaderStyles>(
  ({ theme: { spacing } }) => ({
    container: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
    },
    title: {
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      fontWeight: '600',
    },
  }),
);
