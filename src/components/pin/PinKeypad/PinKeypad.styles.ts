import { createStyles } from 'theme';

export const usePinKeypadStyles = createStyles(({ theme: { colors, spacing, shadows } }) => ({
  keypad: {
    width: '100%',
    maxWidth: 280,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
  },
  key: {
    width: 72,
    height: 72,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.accent.green,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.pinKey,
  },
  keyDisabled: {
    opacity: 0.5,
  },
  keyEmpty: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  keyLabel: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.accent.greenText,
  },
  keyBiometric: {
    fontSize: 20,
  },
}));
