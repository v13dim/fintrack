import { createStyles } from 'theme';

export const useHelloWorldStyles = createStyles(({ theme: { colors, typography } }) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
  },
  text: {
    ...typography.h3,
    color: colors.text.primary,
  },
}));
