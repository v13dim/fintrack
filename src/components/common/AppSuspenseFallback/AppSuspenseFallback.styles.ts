import { createStyles } from 'theme';

export const useAppSuspenseFallbackStyles = createStyles(({ theme: { colors, spacing } }) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    gap: spacing.lg,
  },
}));
