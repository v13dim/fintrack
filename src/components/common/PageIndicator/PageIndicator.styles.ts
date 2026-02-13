import { createStyles } from 'theme';

export const usePageIndicatorStyles = createStyles(({ theme: { colors, spacing, shadows } }) => ({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent.light,
  },
  dotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent.green,
    transform: [{ scale: 1.2 }],
    ...shadows.sm,
  },
}));
