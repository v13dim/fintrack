import { createStyles } from 'theme';

export const usePinLoginScreenStyles = createStyles(
  ({ theme: { spacing }, insets: { top, bottom } }) => ({
    container: {
      flex: 1,
      paddingVertical: spacing['40'],
      paddingTop: top,
      paddingBottom: bottom,
    },
  }),
);
