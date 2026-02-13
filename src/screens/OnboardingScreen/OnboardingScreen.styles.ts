import { createStyles } from 'theme';

export const useOnboardingScreenStyles = createStyles(
  ({ theme: { colors, spacing }, insets: { top, bottom } }) => ({
    container: {
      flex: 1,
      paddingHorizontal: spacing.xl,
      paddingTop: top + spacing.xl,
      paddingBottom: bottom + spacing.xl,
      justifyContent: 'space-between',
      gap: spacing.md,
    },
    main: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      gap: spacing['48'],
    },
    iconBox: {
      height: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconEmoji: {
      fontSize: 80,
      lineHeight: 100,
    },
    textBlock: {
      gap: spacing['48'],
      alignItems: 'center',
      maxWidth: 280,
      minHeight: 360,
      justifyContent: 'center',
    },
    title: {
      color: colors.accent.darkText,
      textAlign: 'center',
    },
    subtitle: {
      maxWidth: 280,
      color: colors.text.primary,
      textAlign: 'center',
    },
    buttons: {
      gap: spacing.lg,
      width: '100%',
      minHeight: 120,
      justifyContent: 'space-between',
    },
    btnPlaceholder: {
      height: 48,
      opacity: 0,
      pointerEvents: 'none',
    },
  }),
);
