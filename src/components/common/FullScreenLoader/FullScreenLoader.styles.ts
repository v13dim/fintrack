import { createStyles } from 'theme';

export const useFullScreenLoaderStyles = createStyles(({ theme: { colors, spacing } }) => ({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.background.primary,
    opacity: 0.95,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    gap: spacing.lg,
  },
  message: {
    textAlign: 'center',
  },
}));
