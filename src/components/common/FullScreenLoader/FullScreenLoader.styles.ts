import { StyleSheet } from 'react-native';

import { createStyles } from 'theme';

export const useFullScreenLoaderStyles = createStyles(({ theme: { colors, spacing } }) => ({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background.primary,
    opacity: 0.95,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
  },
  message: {
    textAlign: 'center',
  },
}));
