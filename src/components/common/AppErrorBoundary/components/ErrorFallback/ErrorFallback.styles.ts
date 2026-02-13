import { createStyles } from 'theme';

export const useErrorFallbackStyles = createStyles(({ theme: { colors, spacing } }) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  message: {
    maxWidth: 320,
  },
}));
