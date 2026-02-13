import { createStyles } from 'theme';

export const usePinChangeScreenStyles = createStyles(({ theme: { spacing }, insets }) => ({
  container: {
    flex: 1,
    paddingTop: insets.top + spacing[60],
  },
}));
