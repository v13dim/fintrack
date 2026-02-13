import { createStyles } from 'theme';

export const useHelloWorldStyles = createStyles(({ theme: { colors } }) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
  },
}));
