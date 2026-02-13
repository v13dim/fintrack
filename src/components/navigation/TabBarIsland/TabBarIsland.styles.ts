import { ViewStyle } from 'react-native';

import { createStyles } from 'theme';

interface TabBarIslandStyles {
  container: ViewStyle;
  island: ViewStyle;
  tabRow: ViewStyle;
  pill: ViewStyle;
  tabButton: ViewStyle;
  tabButtonContent: ViewStyle;
}

export const useTabBarIslandStyles = createStyles<TabBarIslandStyles>(
  ({ theme: { colors, spacing, shadows }, insets }) => ({
    container: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: insets.bottom,
      paddingHorizontal: spacing.lg,
    },
    island: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      backgroundColor: colors.background.secondary,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.xs,
      borderRadius: 24,
      minHeight: 44,
      width: 240,
      ...shadows.lg,
    },
    tabRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      flex: 1,
      position: 'relative',
    },
    pill: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      borderRadius: 18,
      backgroundColor: colors.accent.green,
    },
    tabButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.xs,
      zIndex: 1,
    },
    tabButtonContent: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
    },
  }),
);
