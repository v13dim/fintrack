import { createStyles } from 'theme';

export const usePinCreateScreenStyles = createStyles(
  ({ theme: { spacing }, insets: { top, bottom } }) => ({
    container: {
      flex: 1,
      paddingVertical: spacing['40'],
      paddingTop: top,
      paddingBottom: bottom,
    },
  }),
);
