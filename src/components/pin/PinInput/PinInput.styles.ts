import { createStyles } from 'theme';

export const usePinInputStyles = createStyles(
  ({ theme: { colors, spacing, shadows }, insets: { bottom } }) => ({
    container: {
      flex: 1,
      justifyContent: 'space-between',
      paddingTop: spacing['40'],
      paddingBottom: bottom,
      paddingHorizontal: spacing.lg,
      alignItems: 'center',
    },
    header: {
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 126,
      gap: spacing['40'],
    },
    titleContainer: {
      alignItems: 'center',
      gap: spacing.sm,
      paddingHorizontal: spacing.xs,
      maxWidth: '100%',
    },
    dotRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: spacing.md,
    },
    dot: {
      width: 14,
      height: 14,
      borderRadius: 7,
      borderWidth: 2,
      borderColor: colors.accent.green,
      backgroundColor: 'transparent',
    },
    dotFilled: {
      backgroundColor: colors.accent.green,
      borderColor: colors.accent.green,
      ...shadows.pinDot,
    },
  }),
);
