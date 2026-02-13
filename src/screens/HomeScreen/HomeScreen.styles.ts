import { createStyles } from 'theme';

export const useHomeScreenStyles = createStyles(
  ({ theme: { spacing }, insets: { top, bottom } }) => ({
    container: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      paddingTop: top,
      paddingBottom: bottom,
      justifyContent: 'center',
      alignItems: 'center',
    },
  }),
);
