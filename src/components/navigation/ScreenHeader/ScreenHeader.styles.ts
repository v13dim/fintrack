import type { ViewStyle } from 'react-native';

import { createStyles } from 'theme';

interface ScreenHeaderStyles {
  container: ViewStyle;
  island: ViewStyle;
  islandContent: ViewStyle;
  row: ViewStyle;
  left: ViewStyle;
  center: ViewStyle;
  right: ViewStyle;
}

export const useScreenHeaderStyles = createStyles<ScreenHeaderStyles>(
  ({ theme: { colors, spacing, shadows }, insets }) => ({
    container: {
      position: 'absolute',
      top: spacing.lg,
      left: 0,
      right: 0,
      paddingTop: insets.top,
      paddingHorizontal: spacing.lg,
      zIndex: 10,
    },
    island: {
      borderRadius: 24,
      minHeight: 48,
      overflow: 'hidden',
      ...shadows.lg,
    },
    islandContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 48,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.background.secondary + 'E6',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flex: 1,
    },
    left: {
      minWidth: 56,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    center: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.xs,
    },
    right: {
      minWidth: 56,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: spacing.xs,
    },
  }),
);
