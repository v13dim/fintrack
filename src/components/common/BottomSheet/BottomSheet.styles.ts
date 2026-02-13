import type { ViewStyle } from 'react-native';

import { createStyles } from 'theme';

interface BottomSheetStyles {
  background: ViewStyle;
  backdrop: ViewStyle;
  contentContainer: ViewStyle;
  headerRow: ViewStyle;
  headerLeft: ViewStyle;
  headerCenter: ViewStyle;
  headerRight: ViewStyle;
  contentArea: ViewStyle;
}

export const useBottomSheetStyles = createStyles<BottomSheetStyles>(
  ({ theme: { colors, spacing }, insets }) => ({
    background: {
      backgroundColor: colors.background.secondary,
    },
    backdrop: {
      backgroundColor: colors.shadow.black40,
    },
    contentContainer: {
      paddingBottom: insets.bottom + spacing.lg,
    },
    headerRow: {
      flexDirection: 'row',
      paddingTop: spacing.md,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.divider,
    },
    headerLeft: {
      minWidth: 44,
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerCenter: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.sm,
    },
    headerRight: {
      minWidth: 44,
      alignItems: 'flex-end',
    },
    contentArea: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.md,
    },
  }),
);
