import { createStyles } from 'theme';

export const usePinLoginScreenStyles = createStyles(({ theme: { spacing } }) => ({
  container: {
    flex: 1,
    paddingVertical: spacing['40'],
    paddingHorizontal: spacing.xl,
  },
}));
